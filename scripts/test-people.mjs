/** Unit checks for the host's People list and its CSV (MM-89). Run with
 *  `node scripts/test-people.mjs`. Exits non-zero on the first failure.
 *
 *  The database is a fake, as in test-seats.mjs and test-questions.mjs: an
 *  object that answers `all()` with rows shaped the way D1 hands them over —
 *  SQLite's `datetime('now')` strings and 0/1 for the three flags. That is
 *  enough to check the order, the counts, the quoting and, most of all, that no
 *  SSH key ever leaves the module.
 *
 *  The page and the endpoint over the top are not driven here: dist/server is a
 *  workerd bundle that imports `cloudflare:workers`, which plain node cannot
 *  resolve. Everything they decide with is in src/lib/people.ts and is checked
 *  below; the host cookie in front of both is checked in test-questions.mjs. */
import { listRegistrations, peopleCounts, toCsv, whenInBelgrade } from '../src/lib/people.ts';

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

/** A row as D1 gives it back, with the defaults a registration carries. */
const row = (id, overrides = {}) => ({
  id,
  created_at: '2026-09-18 09:30:00',
  name: `Person ${id}`,
  city: 'Novi Sad',
  email: `person${id}@example.com`,
  os: 'macos',
  tool: 'claude-code',
  terminal: 'fluent',
  ssh_key: null,
  own_hosting: 0,
  watch_only: 0,
  newsletter: 0,
  mailerlite_status: 'ok',
  confirmation_status: 'sent',
  ...overrides,
});

/** Answers every all() with the rows it was given, and keeps the queries so the
 *  test can read what was asked for. The rows are handed back in the order the
 *  fake holds them, because ORDER BY is SQLite's job, not this object's — the
 *  test checks that the query says DESC, and separately that what comes back is
 *  passed through in the order it arrived. */
const fakeDb = (rows) => {
  const queries = [];
  return {
    queries,
    prepare(query) {
      queries.push(query);
      const statement = {
        bind: () => statement,
        first: async () => rows[0] ?? null,
        all: async () => ({ results: rows.map((one) => ({ ...one })) }),
        run: async () => undefined,
      };
      return statement;
    },
  };
};

console.log('listing');
{
  const db = fakeDb([row(3), row(2), row(1)]);
  const people = await listRegistrations(db);

  check('every row comes back', people.length === 3, String(people.length));
  check('newest first is what is asked for', /ORDER BY id DESC/.test(db.queries[0]), db.queries[0]);
  check('the registrations table is what is read', /FROM registrations/.test(db.queries[0]));
  check(
    'the order the database gave is kept',
    people.map((person) => person.id).join(',') === '3,2,1',
    people.map((person) => person.id).join(','),
  );
  check('the ip hash is never selected', !/ip_hash/.test(db.queries[0]));
  check(
    "SQLite's timestamp becomes an ISO instant",
    people[0].createdAt === '2026-09-18T09:30:00Z',
    people[0].createdAt,
  );
  check('an empty table is an empty list', (await listRegistrations(fakeDb([]))).length === 0);
}

console.log('the columns');
{
  const [withKey, without] = await listRegistrations(
    fakeDb([
      row(2, { ssh_key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIexample', own_hosting: 1 }),
      row(1, { ssh_key: '', city: null, terminal: null, confirmation_status: null }),
    ]),
  );

  check('a key that was given is a yes', withKey.sshKey === true);
  check('the raw column is not carried through', !('ssh_key' in withKey));
  check(
    'no value on the person is the key',
    !Object.values(withKey).some(
      (value) => typeof value === 'string' && value.includes('ssh-ed25519'),
    ),
  );
  check('an empty key is a no', without.sshKey === false);
  check('1 reads as true', withKey.ownHosting === true);
  check('0 reads as false', without.ownHosting === false);
  check('an unanswered city is null', without.city === null);
  check('an unanswered terminal is null', without.terminal === null);
  check('a missing confirmation status is null', without.confirmationStatus === null);
  check('an answered city is kept', withKey.city === 'Novi Sad');
}

console.log('counting');
{
  const people = await listRegistrations(
    fakeDb([row(4, { watch_only: 1 }), row(3), row(2, { watch_only: 1 }), row(1)]),
  );
  const counts = peopleCounts(people);

  check('total is every registration', counts.total === 4, String(counts.total));
  check('watching is the watch-only ones', counts.watching === 2, String(counts.watching));
  check('working is the rest', counts.working === 2, String(counts.working));

  const empty = peopleCounts([]);
  check(
    'an empty list counts to nothing',
    empty.total === 0 && empty.working === 0 && empty.watching === 0,
  );

  const allWatching = peopleCounts(await listRegistrations(fakeDb([row(1, { watch_only: 1 })])));
  check(
    'a room of watchers has nobody working',
    allWatching.working === 0 && allWatching.watching === 1,
  );
}

console.log('the CSV');
{
  const header = toCsv([]).split('\r\n')[0];
  check('an empty list is still a header row', toCsv([]) === `${header}\r\n`, JSON.stringify(toCsv([])));
  check(
    'the header is the column names',
    header ===
      'id,created_at,name,city,email,os,tool,terminal,ssh_key,own_hosting,watch_only,newsletter,mailerlite_status,confirmation_status',
    header,
  );

  const people = await listRegistrations(
    fakeDb([
      row(2, {
        name: 'Đurić, Mladen "MacMladen"',
        city: 'Novi Sad',
        tool: 'claude-code,codex',
        ssh_key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIexample',
        watch_only: 1,
        newsletter: 1,
      }),
      row(1, { city: null, terminal: null, mailerlite_status: null, confirmation_status: null }),
    ]),
  );
  const csv = toCsv(people);
  const lines = csv.split('\r\n');

  check('one line per registration, plus the header', lines.length === 4, String(lines.length));
  check('the file ends with a line break', lines[3] === '');
  check(
    'a name with a comma and a quote is quoted and the quotes doubled',
    lines[1].includes('"Đurić, Mladen ""MacMladen"""'),
    lines[1],
  );
  check(
    'a comma-joined tool list is quoted too',
    lines[1].includes('"claude-code,codex"'),
    lines[1],
  );
  check('a plain field is not quoted', lines[2].includes(',Person 1,'), lines[2]);
  check(
    'the four flags are yes and no, the key among them',
    lines[1].includes(',yes,no,yes,yes,'),
    lines[1],
  );
  check('a registration that answered none of them is four noes', lines[2].includes(',no,no,no,no,'), lines[2]);
  check('the key itself never reaches the file', !csv.includes('ssh-ed25519'));
  check('no key material anywhere in the file', !/AAAAC3NzaC1lZDI1NTE5/.test(csv));
  check('an unanswered column is empty, not "null"', !/,null,/.test(csv), lines[2]);
  check('the newest registration is the first row', lines[1].startsWith('2,'), lines[1]);

  const newline = toCsv(await listRegistrations(fakeDb([row(1, { city: 'Novi\r\nSad' })])));
  check(
    'a line break inside a field is quoted',
    newline.includes('"Novi\r\nSad"'),
    JSON.stringify(newline),
  );
}

console.log('the time');
{
  check(
    'a summer instant is said in Belgrade time',
    whenInBelgrade('2026-09-18T09:30:00Z') === '18.09 11:30',
    whenInBelgrade('2026-09-18T09:30:00Z'),
  );
  check(
    'a winter instant shifts by one hour instead of two',
    whenInBelgrade('2026-01-05T09:30:00Z') === '05.01 10:30',
    whenInBelgrade('2026-01-05T09:30:00Z'),
  );
  check(
    'midnight is 00, never 24',
    whenInBelgrade('2026-09-17T22:00:00Z') === '18.09 00:00',
    whenInBelgrade('2026-09-17T22:00:00Z'),
  );
}

console.log('');
if (failures.length > 0) {
  console.log(`${passed} passed, ${failures.length} FAILED`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
