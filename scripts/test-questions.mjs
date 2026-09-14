/** Unit checks for the live questions (MM-84). Run with
 *  `node scripts/test-questions.mjs`. Exits non-zero on the first failure.
 *
 *  The database is a fake: a small in-memory store that answers the six
 *  statements src/lib/questions.ts and src/lib/state.ts send, the way D1 would.
 *  That is enough to drive a question from asked to covered and back and watch
 *  the version move, without a server and without wrangler.
 *
 *  The endpoints themselves are not driven here. dist/server is a workerd
 *  bundle — it imports `cloudflare:workers` for the bindings, which plain node
 *  cannot resolve — so importing the built routes would mean faking the runtime
 *  rather than testing it. Everything the endpoints decide with lives in the
 *  three libraries below and is checked here; the endpoints over the top are
 *  checked against a running preview by hand (README, "Live questions"). */
import {
  addQuestion,
  hasErrors,
  limits,
  listQuestions,
  messages,
  questionsVersion,
  readQuestionForm,
  setCovered,
  validateQuestion,
} from '../src/lib/questions.ts';
import {
  closedState,
  readState,
  readStateChange,
  setState,
  stateKeys,
  stateVersion,
} from '../src/lib/state.ts';
import {
  HOST_COOKIE,
  hostCookie,
  hostToken,
  isHost,
  readCookie,
  sameSecret,
} from '../src/lib/host.ts';

let passed = 0;
const failures = [];

const check = (name, condition, detail = '') => {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail === '' ? '' : ` — ${detail}`}`);
    console.log(`  FAIL ${name}${detail === '' ? '' : ` — ${detail}`}`);
  }
};

/** FormData-shaped enough for readQuestionForm. */
const form = (fields) => ({ get: (name) => (name in fields ? fields[name] : null) });

/** The fake D1. It knows the six statements the two libraries send and nothing
 *  else: an unknown query throws rather than quietly answering nothing, so a
 *  query that changes without this file changing is a failing test, not a
 *  silent pass. `now` is a counter so covered_at values sort the way real
 *  timestamps would without a clock in the test. */
const fakeDb = (state = {}) => {
  const rows = [];
  const switches = new Map(Object.entries(state));
  let tick = 0;
  const stamp = () => `2026-09-18 09:${String((tick += 1)).padStart(2, '0')}:00`;

  const run = (query, values) => {
    if (query.startsWith('INSERT INTO questions')) {
      const row = {
        id: rows.length + 1,
        created_at: stamp(),
        name: values[0],
        body: values[1],
        ip_hash: values[2],
        covered_at: null,
      };
      rows.push(row);
      return { first: { id: row.id }, all: [] };
    }

    if (query.startsWith('SELECT id, created_at, name, body, covered_at FROM questions')) {
      return { first: rows[0] ?? null, all: rows.map((row) => ({ ...row })) };
    }

    if (query.startsWith('SELECT COUNT(*) AS c')) {
      const covered = rows.filter((row) => row.covered_at !== null);
      return {
        first: {
          c: rows.length,
          m: rows.reduce((max, row) => Math.max(max, row.id), 0),
          v: covered.reduce((max, row) => (row.covered_at > max ? row.covered_at : max), ''),
          n: covered.length,
        },
        all: [],
      };
    }

    if (query.startsWith('UPDATE questions SET covered_at')) {
      const row = rows.find((candidate) => candidate.id === values[0]);
      if (row) row.covered_at = query.includes('NULL') ? null : stamp();
      return { first: null, all: [] };
    }

    if (query.startsWith('UPDATE workshop_state SET value')) {
      // The real table is seeded by migration 0006, so an UPDATE for a key that
      // is not there changes nothing rather than creating a row.
      if (switches.has(values[1])) switches.set(values[1], values[0]);
      return { first: null, all: [] };
    }

    if (query.startsWith('SELECT key, value FROM workshop_state')) {
      return {
        first: null,
        all: values
          .filter((key) => switches.has(key))
          .map((key) => ({ key, value: switches.get(key) })),
      };
    }

    throw new Error(`the fake database was handed a query it does not know: ${query}`);
  };

  const db = {
    rows,
    switches,
    prepare(query) {
      let bound = [];
      const statement = {
        bind: (...values) => {
          bound = values;
          return statement;
        },
        first: async () => run(query, bound).first,
        all: async () => ({ results: run(query, bound).all }),
        run: async () => run(query, bound),
      };
      return statement;
    },
  };
  return db;
};

const ask = { name: 'Ana Anić', body: 'How do you keep the agent from inventing a migration?' };

console.log('reading the form');
{
  const values = readQuestionForm(form({ name: '  Ana  ', body: '  Why DDEV?  ' }));
  check('the name is trimmed', values.name === 'Ana', values.name);
  check('the question is trimmed', values.body === 'Why DDEV?', values.body);

  const missing = readQuestionForm(form({}));
  check('a missing name reads as empty', missing.name === '');
  check('a missing question reads as empty', missing.body === '');

  const odd = readQuestionForm(form({ name: 42, body: ['a'] }));
  check('anything that is not a string reads as empty', odd.name === '' && odd.body === '');
}

console.log('validation');
{
  check('a full question passes', !hasErrors(validateQuestion(ask)));
  check(
    'no name is fine — a question may be anonymous',
    !hasErrors(validateQuestion({ name: '', body: 'Why DDEV?' })),
  );

  const empty = validateQuestion({ name: '', body: '' });
  check('an empty question is refused', empty.body === messages.body);
  check('and the empty name is not held against it', empty.name === undefined);

  const longName = validateQuestion({ name: 'a'.repeat(limits.name + 1), body: 'Why?' });
  check('a name over the limit is refused', longName.name === messages.nameLong);
  check(
    'a name exactly at the limit passes',
    validateQuestion({ name: 'a'.repeat(limits.name), body: 'Why?' }).name === undefined,
  );

  const longBody = validateQuestion({ name: '', body: 'a'.repeat(limits.body + 1) });
  check('a question over the limit is refused', longBody.body === messages.bodyLong);
  check(
    'a question exactly at the limit passes',
    validateQuestion({ name: '', body: 'a'.repeat(limits.body) }).body === undefined,
  );

  check('the limits are the agreed ones', limits.name === 100 && limits.body === 500);
  check('hasErrors is false on an empty object', !hasErrors({}));
  check('hasErrors is true on a form-level error', hasErrors({ form: messages.closed }));
}

console.log('adding and listing');
{
  const db = fakeDb();
  check('an empty table lists nothing', (await listQuestions(db)).length === 0);

  const id = await addQuestion(db, ask, 'abc123');
  check('the insert hands back an id', id === 1, String(id));

  const second = await addQuestion(db, { name: '', body: 'And on Windows?' }, null);
  check('the second question gets the next id', second === 2, String(second));

  const list = await listQuestions(db);
  check('both questions are listed', list.length === 2);
  check('oldest first', list[0].id === 1 && list[1].id === 2);
  check('the name is carried through', list[0].name === 'Ana Anić');
  check('an empty name is stored and read as null', list[1].name === null);
  check('the question itself is carried through', list[0].body === ask.body);
  check('nothing starts covered', list.every((question) => !question.covered));
  check('the ip hash is stored', db.rows[0].ip_hash === 'abc123');
  check('a missing ip hash is stored as null', db.rows[1].ip_hash === null);
  check(
    'created_at comes back as ISO with the Z, not as SQLite local-looking text',
    list[0].createdAt === '2026-09-18T09:01:00Z',
    list[0].createdAt,
  );
  check(
    'and Date reads it as the UTC it is',
    new Date(list[0].createdAt).toISOString() === '2026-09-18T09:01:00.000Z',
  );
}

console.log('the version the stream polls');
{
  const db = fakeDb();
  const empty = await questionsVersion(db);

  await addQuestion(db, ask, null);
  const one = await questionsVersion(db);
  check('a new question moves the version', one !== empty, `${empty} -> ${one}`);

  const again = await questionsVersion(db);
  check('and a quiet moment leaves it alone', again === one);

  await addQuestion(db, { name: '', body: 'Second' }, null);
  const two = await questionsVersion(db);
  check('a second question moves it again', two !== one);

  await setCovered(db, 1, true);
  const covered = await questionsVersion(db);
  check('covering a question moves it', covered !== two, `${two} -> ${covered}`);

  await setCovered(db, 2, true);
  const both = await questionsVersion(db);
  check('covering the second moves it', both !== covered);

  await setCovered(db, 1, false);
  const uncovered = await questionsVersion(db);
  check(
    'uncovering one that is not the last covered moves it too',
    uncovered !== both,
    `${both} -> ${uncovered}`,
  );
}

console.log('covering');
{
  const db = fakeDb();
  await addQuestion(db, ask, null);

  await setCovered(db, 1, true);
  check('the question is covered', (await listQuestions(db))[0].covered === true);
  check('and when is written down', db.rows[0].covered_at !== null);

  await setCovered(db, 1, false);
  check('the mark comes off again', (await listQuestions(db))[0].covered === false);
  check('and the column is null, not empty', db.rows[0].covered_at === null);

  await setCovered(db, 99, true);
  check('covering a question that is not there changes nothing', db.rows.length === 1);
}

console.log('the two switches');
{
  const open = await readState(fakeDb({ registration_open: '1', questions_open: '1' }));
  check('both open', open.registrationOpen && open.questionsOpen);

  const seeded = await readState(fakeDb({ registration_open: '1', questions_open: '0' }));
  check('the seeded state has registration open', seeded.registrationOpen);
  check('and questions closed', !seeded.questionsOpen);

  const other = await readState(fakeDb({ registration_open: 'yes', questions_open: 'true' }));
  check('anything that is not "1" is closed', !other.registrationOpen && !other.questionsOpen);

  const missing = await readState(fakeDb({}));
  check('a missing row is closed, not open', !missing.registrationOpen && !missing.questionsOpen);

  check('the closed state is closed', !closedState.registrationOpen && !closedState.questionsOpen);
  check(
    'the version tells the four combinations apart',
    new Set(
      [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ].map(([registrationOpen, questionsOpen]) =>
        stateVersion({ registrationOpen, questionsOpen }),
      ),
    ).size === 4,
  );
}

console.log('flipping a switch');
{
  const db = fakeDb({ registration_open: '1', questions_open: '0' });

  await setState(db, stateKeys.questionsOpen, '1');
  check('questions open', (await readState(db)).questionsOpen);
  check('and registration is left alone', (await readState(db)).registrationOpen);

  await setState(db, stateKeys.registrationOpen, '0');
  check('registration closes', !(await readState(db)).registrationOpen);
  check('and questions stay open', (await readState(db)).questionsOpen);

  await setState(db, stateKeys.questionsOpen, '0');
  check('and a switch goes back the way it came', !(await readState(db)).questionsOpen);

  const empty = fakeDb({});
  await setState(empty, stateKeys.questionsOpen, '1');
  check('a row that is not there is not invented', empty.switches.size === 0);
}

console.log('what /api/state/ accepts');
{
  const source = (fields) => ({ get: (name) => (name in fields ? fields[name] : null) });

  const open = readStateChange(source({ key: 'questions_open', value: '1' }));
  check('the key comes through', open?.key === stateKeys.questionsOpen);
  check('and the value with it', open?.value === '1');
  check(
    'the other switch too',
    readStateChange(source({ key: 'registration_open', value: '0' }))?.key ===
      stateKeys.registrationOpen,
  );

  check('a third key is refused', readStateChange(source({ key: 'admin', value: '1' })) === null);
  check(
    'a key that only looks like one of the two is refused',
    readStateChange(source({ key: 'questions_open ', value: '1' })) === null,
  );
  check(
    'a third value is refused',
    readStateChange(source({ key: 'questions_open', value: 'yes' })) === null,
  );
  check(
    'an empty value is refused',
    readStateChange(source({ key: 'questions_open', value: '' })) === null,
  );
  check('a missing key is refused', readStateChange(source({ value: '1' })) === null);
  check('a missing value is refused', readStateChange(source({ key: 'questions_open' })) === null);
  check('nothing at all is refused', readStateChange(source({})) === null);
  check(
    'anything that is not a string is refused',
    readStateChange(source({ key: 42, value: 1 })) === null,
  );
  check(
    'and the query string of the bookmarked link is read the same way',
    readStateChange(new URLSearchParams('key=questions_open&value=1'))?.value === '1',
  );
}

console.log('the host cookie');
{
  const key = 'a-long-workshop-day-secret';
  const token = await hostToken(key);

  check('the token is 64 hex characters — a SHA-256 HMAC', /^[0-9a-f]{64}$/.test(token), token);
  check('the same key makes the same token', (await hostToken(key)) === token);
  check('another key makes another token', (await hostToken(`${key}!`)) !== token);
  check('no key makes no token', (await hostToken(undefined)) === null);
  check('an empty key makes no token', (await hostToken('')) === null);
  check('the token is not the key', !token.includes(key));

  const cookie = hostCookie(token);
  check('the cookie carries the token', cookie.startsWith(`${HOST_COOKIE}=${token}`));
  check('it is HttpOnly', cookie.includes('HttpOnly'));
  check('it is Secure', cookie.includes('Secure'));
  check('it is SameSite=Lax', cookie.includes('SameSite=Lax'));
  check('it is for the whole site', cookie.includes('Path=/'));
  check('it lasts a week', cookie.includes('Max-Age=604800'));

  const sent = `${HOST_COOKIE}=${token}`;
  const request = (header) => ({ headers: { get: () => header } });

  check('the cookie is read back out of the header', readCookie(sent, HOST_COOKIE) === token);
  check(
    'and out of a header with company',
    readCookie(`other=1; ${sent}; third=x`, HOST_COOKIE) === token,
  );
  check('a missing header reads as nothing', readCookie(null, HOST_COOKIE) === null);
  check('another cookie is not mistaken for it', readCookie('mm_hostile=1', HOST_COOKIE) === null);

  check('the round trip makes a host', (await isHost(request(sent), { HOST_KEY: key })) === true);
  check('no cookie is no host', (await isHost(request(null), { HOST_KEY: key })) === false);
  check(
    'a made-up cookie is no host',
    (await isHost(request(`${HOST_COOKIE}=${'0'.repeat(64)}`), { HOST_KEY: key })) === false,
  );
  check(
    'the cookie for another key is no host',
    (await isHost(request(`${HOST_COOKIE}=${await hostToken('another')}`), { HOST_KEY: key })) ===
      false,
  );
  check(
    'without a HOST_KEY nobody is the host, cookie or no cookie',
    (await isHost(request(sent), {})) === false,
  );
  check(
    'and an empty HOST_KEY is the same as none',
    (await isHost(request(sent), { HOST_KEY: '' })) === false,
  );

  check('sameSecret matches what is the same', sameSecret('abc', 'abc'));
  check('and refuses what is not', !sameSecret('abc', 'abd'));
  check('a different length is refused without a match', !sameSecret('abc', 'abcd'));
}

console.log('');
if (failures.length > 0) {
  console.log(`${passed} passed, ${failures.length} FAILED`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
