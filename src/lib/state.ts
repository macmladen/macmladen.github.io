/** The two switches in the D1 `workshop_state` table (MM-84): whether the
 *  registration form is still taking people, and whether the room may ask
 *  questions. Both are flipped by hand from the command line during the day
 *  (README, "Live questions") because the site is static and a rebuild in front
 *  of a room is not a plan.
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

/** Two booleans as a string the stream can compare from one poll to the next. */
export const stateVersion = (state: WorkshopState): string =>
  `${state.registrationOpen ? '1' : '0'}${state.questionsOpen ? '1' : '0'}`;
