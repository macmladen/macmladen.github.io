/** The two switches in the D1 `workshop_state` table (MM-84): whether the
 *  registration form is still taking people, and whether the room may ask
 *  questions. `questions_open` is flipped from the switch on the workshop page
 *  (MM-88) and `registration_open` from the command line, which is the fallback
 *  under both (README, "Live questions"), because the site is static and a
 *  rebuild in front of a room is not a plan.
 *
 *  '1' is open. Anything else — another value, a missing row — is closed, so a
 *  half-applied database never reads as an open door. A database without the
 *  table throws, which is the honest answer: the caller decides what a workshop
 *  page does when its state cannot be read.
 *
 *  The .ts extension on the import is deliberate; see the note in questions.ts. */
import type { QuestionsDb } from './questions.ts';

export interface WorkshopState {
  registrationOpen: boolean;
  questionsOpen: boolean;
}

/** The keys as they are spelled in the table, in one place. */
export const stateKeys = {
  registrationOpen: 'registration_open',
  questionsOpen: 'questions_open',
} as const;

/** A key as the table spells it, and a value as the table stores it. The two
 *  together are everything /api/state/ accepts: no other row may be written,
 *  and no third value invented. */
export type StateKey = (typeof stateKeys)[keyof typeof stateKeys];
export type StateValue = '0' | '1';

const keys: readonly string[] = Object.values(stateKeys);

export interface StateChange {
  key: StateKey;
  value: StateValue;
}

/** Anything with a FormData- or URLSearchParams-shaped get(), which is both of
 *  the ways /api/state/ is asked for a flip: a form post from the page's switch
 *  and a bookmarked link from the iPad. */
export interface StateSource {
  get(name: string): unknown;
}

/** The requested flip, or null when it is not one of the two switches or not
 *  one of the two values. Null rather than a thrown error: the endpoint answers
 *  422 and says nothing more, and this stays a pure function the tests can
 *  drive without a request. */
export function readStateChange(source: StateSource): StateChange | null {
  const key = source.get('key');
  const value = source.get('value');
  if (typeof key !== 'string' || !keys.includes(key)) return null;
  if (value !== '0' && value !== '1') return null;
  return { key: key as StateKey, value };
}

export const closedState: WorkshopState = { registrationOpen: false, questionsOpen: false };

export async function readState(db: QuestionsDb): Promise<WorkshopState> {
  const { results } = await db
    .prepare('SELECT key, value FROM workshop_state WHERE key IN (?, ?)')
    .bind(stateKeys.registrationOpen, stateKeys.questionsOpen)
    .all<{ key: string; value: string }>();

  const values = new Map(results.map((row) => [row.key, row.value]));
  return {
    registrationOpen: values.get(stateKeys.registrationOpen) === '1',
    questionsOpen: values.get(stateKeys.questionsOpen) === '1',
  };
}

/** Flipping one switch (MM-87). An UPDATE, not an upsert: the two rows are
 *  seeded by migration 0006, and a key that is not there is a database that has
 *  not been migrated rather than a row this endpoint should invent. D1 reports
 *  no rows changed in that case and the caller is none the wiser, which is the
 *  same silence `setCovered` keeps for an id that is not there. */
export async function setState(db: QuestionsDb, key: StateKey, value: StateValue): Promise<void> {
  await db.prepare('UPDATE workshop_state SET value = ? WHERE key = ?').bind(value, key).run();
}

/** Two booleans as a string the stream can compare from one poll to the next. */
export const stateVersion = (state: WorkshopState): string =>
  `${state.registrationOpen ? '1' : '0'}${state.questionsOpen ? '1' : '0'}`;
