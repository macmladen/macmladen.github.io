/** Unit checks for the seat count and the capacity rule (MM-71). Run with
 *  `node scripts/test-seats.mjs`. The database is a fake: the smallest object
 *  that answers the way D1 does, so the rule can be driven from an empty room to
 *  an over-full one without one. Exits non-zero on the first failure. */
import { countSeatsTaken, placeAtCapacity, readSeats } from '../src/lib/registrations.ts';
import { emptyValues } from '../src/data/registration.ts';
import { workshop } from '../src/data/workshop.ts';

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

/** Answers every prepare() with the one row a COUNT gives back, and keeps the
 *  queries it was handed so the test can read what was asked. */
const fakeDb = (row) => {
  const queries = [];
  return {
    queries,
    prepare(query) {
      queries.push(query);
      const statement = {
        bind: () => statement,
        first: async () => row,
        run: async () => undefined,
      };
      return statement;
    },
  };
};

console.log('counting');
{
  const db = fakeDb({ taken: 12 });
  check('reads the count', (await countSeatsTaken(db)) === 12);
  check(
    'counts only the registrations that take a seat',
    /watch_only\s*=\s*0/.test(db.queries[0]),
    db.queries[0],
  );
  check('counts the registrations table', /FROM registrations/.test(db.queries[0]));
  check('an empty answer counts as none', (await countSeatsTaken(fakeDb(null))) === 0);
}

console.log('what is left');
{
  const half = await readSeats(fakeDb({ taken: 12 }), 30);
  check('capacity is carried through', half.capacity === 30);
  check('taken is the count', half.taken === 12);
  check('left is the difference', half.left === 18, String(half.left));

  const empty = await readSeats(fakeDb({ taken: 0 }), 30);
  check('an empty room has every seat left', empty.left === 30);

  const full = await readSeats(fakeDb({ taken: 30 }), 30);
  check('a full room has none left', full.left === 0);

  const over = await readSeats(fakeDb({ taken: 31 }), 30);
  check('an over-full room never goes below zero', over.left === 0, String(over.left));
}

console.log('placing a registration at capacity');
{
  const wantsASeat = {
    ...emptyValues,
    name: 'Ana Anić',
    email: 'ana@example.com',
    github: 'ana-anic',
    os: 'linux',
    tool: 'claude-code',
    terminal: 'fluent',
  };
  const roomLeft = { capacity: 30, taken: 29, left: 1 };
  const noRoom = { capacity: 30, taken: 30, left: 0 };

  check(
    'with a seat left the registration is handed back untouched',
    placeAtCapacity(wantsASeat, roomLeft) === wantsASeat,
  );

  const placed = placeAtCapacity(wantsASeat, noRoom);
  check('at capacity it becomes a watching registration', placed.watch_only === true);
  check('the one that was asked for is not changed', wantsASeat.watch_only === false);
  check('the laptop answers are kept', placed.github === 'ana-anic' && placed.os === 'linux');
  check('the terminal answer is kept', placed.terminal === 'fluent');
  check('the address is kept', placed.email === 'ana@example.com');

  const alreadyWatching = { ...wantsASeat, watch_only: true };
  check(
    'someone who came to watch is handed back untouched',
    placeAtCapacity(alreadyWatching, noRoom) === alreadyWatching,
  );

  const over = placeAtCapacity(wantsASeat, { capacity: 30, taken: 34, left: 0 });
  check('an over-full room places them to watch too', over.watch_only === true);
}

console.log('the room itself');
{
  check('the workshop knows how big it is', workshop.capacity === 30, String(workshop.capacity));
}

console.log('');
if (failures.length > 0) {
  console.log(`${passed} passed, ${failures.length} FAILED`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}
console.log(`${passed} passed, 0 failed`);
