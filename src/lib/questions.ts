/** Everything this site does to the D1 `questions` table — the live questions
 *  the room asks during the workshop (MM-84). A sibling of registrations.ts and
 *  messages.ts, and like them the database is typed structurally so no
 *  Cloudflare types package is needed.
 *
 *  The validation lives here rather than in a validate-questions.ts of its own:
 *  there are two fields and three rules, and a separate module for that would be
 *  filing rather than structure. Everything above the database line is pure, so
 *  `node scripts/test-questions.mjs` exercises it without a server.
 *
 *  The imports below carry their .ts extension on purpose: node's ESM resolver
 *  does not guess extensions, and this file has to load in plain node as well as
 *  through Vite. */
import type { D1Like, D1PreparedStatementLike } from './registrations.ts';

/** D1Like plus all(). The registrations and messages tables are only ever read
 *  one row at a time, so registrations.ts never needed it; a list of questions
 *  does. The binding in src/env.d.ts is this shape, and it is still a D1Like,
 *  so the register, contact and seats endpoints keep working off the same one. */
export interface D1AllStatementLike extends D1PreparedStatementLike {
  bind(...values: unknown[]): D1AllStatementLike;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

export interface QuestionsDb extends D1Like {
  prepare(query: string): D1AllStatementLike;
}

/** Anything with a FormData-shaped get(). Keeps this file free of DOM types,
 *  the same way validate.ts and validate-contact.ts do. */
export interface FormLike {
  get(name: string): unknown;
}

/** What the ask form sends. A name is optional; a question is not. */
export interface QuestionValues {
  name: string;
  body: string;
}

export interface QuestionErrors {
  name?: string;
  body?: string;
  /** Anything that is not about one field: the anti-spam check, a closed
   *  question time, a database that will not answer. */
  form?: string;
}

export const emptyQuestion: QuestionValues = { name: '', body: '' };

export const limits = {
  name: 100,
  body: 500,
} as const;

/** draft: Mladen to approve — every line the ask form can answer with. */
export const messages = {
  nameLong: `A name longer than ${limits.name} characters will not fit.`,
  body: 'Write the question first — a single line is enough.',
  bodyLong:
    `That is longer than ${limits.body} characters. Ask the short version; ` +
    'the long one is a conversation for the break.',
  turnstile: 'The anti-spam check did not go through. Tick it once more and send again.',
  closed: 'Questions are not open. They open when the workshop starts.',
  unavailable: 'Questions are temporarily unavailable. Ask out loud instead — that works too.',
} as const;

const text = (form: FormLike, field: string): string => {
  const raw = form.get(field);
  return typeof raw === 'string' ? raw.trim() : '';
};

/** Submitted form to values. Never throws, never validates: whatever came in is
 *  what the form is handed back with when validation then fails. */
export function readQuestionForm(form: FormLike): QuestionValues {
  return {
    name: text(form, 'name'),
    body: text(form, 'body'),
  };
}

/** Field-level errors, empty when everything passes. */
export function validateQuestion(values: QuestionValues): QuestionErrors {
  const errors: QuestionErrors = {};

  if (values.name.length > limits.name) errors.name = messages.nameLong;

  if (values.body === '') errors.body = messages.body;
  else if (values.body.length > limits.body) errors.body = messages.bodyLong;

  return errors;
}

export const hasErrors = (errors: QuestionErrors): boolean => Object.keys(errors).length > 0;

/** One question as the stream hands it to the page. */
export interface Question {
  id: number;
  /** Null when it was asked without a name. */
  name: string | null;
  body: string;
  /** ISO 8601 with the Z, see toIso below. */
  createdAt: string;
  covered: boolean;
}

interface QuestionRow {
  id: number;
  created_at: string;
  name: string | null;
  body: string;
  covered_at: string | null;
}

/** SQLite's datetime('now') is UTC written as `2026-09-18 09:30:00`, and
 *  `new Date()` reads a string in that shape as *local* time — which would put
 *  every question two hours out in Belgrade. The T and the Z are added here, in
 *  the one place that knows the value came from SQLite, so the page script can
 *  hand it straight to Date. A value that is already ISO is left alone. */
const toIso = (value: string): string =>
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(' ', 'T')}Z` : value;

const toQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  name: row.name === null || row.name === '' ? null : row.name,
  body: row.body,
  createdAt: toIso(row.created_at),
  covered: row.covered_at !== null && row.covered_at !== '',
});

/** Every question, oldest first — the order they were asked in, which is the
 *  order the room expects to see them in. There are tens of these in a day, so
 *  nothing is paged. */
export async function listQuestions(db: QuestionsDb): Promise<Question[]> {
  const { results } = await db
    .prepare('SELECT id, created_at, name, body, covered_at FROM questions ORDER BY id')
    .all<QuestionRow>();
  return results.map(toQuestion);
}

/** Inserts the question and returns its id. An empty name is stored as NULL. */
export async function addQuestion(
  db: QuestionsDb,
  values: QuestionValues,
  ipHash: string | null,
): Promise<number> {
  const row = await db
    .prepare('INSERT INTO questions (name, body, ip_hash) VALUES (?, ?, ?) RETURNING id')
    .bind(values.name === '' ? null : values.name, values.body, ipHash)
    .first<{ id: number }>();

  if (!row) throw new Error('The question insert returned no id.');
  return row.id;
}

/** Marks a question answered, or takes the mark off again — one column, so
 *  covering it records when and uncovering it forgets. */
export async function setCovered(db: QuestionsDb, id: number, covered: boolean): Promise<void> {
  await db
    .prepare(
      covered
        ? "UPDATE questions SET covered_at = datetime('now') WHERE id = ?"
        : 'UPDATE questions SET covered_at = NULL WHERE id = ?',
    )
    .bind(id)
    .run();
}

/** A cheap stand-in for "has anything changed", read by the stream every two
 *  seconds so the list itself is only fetched when it has.
 *
 *  Four numbers, not three: the count and the highest id catch a new question,
 *  the latest covered_at catches one being marked answered — and the number of
 *  covered ones catches a mark being taken *off*, which the first three miss
 *  when the question uncovered was not the most recently covered one. */
export async function questionsVersion(db: QuestionsDb): Promise<string> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS c,
              COALESCE(MAX(id), 0) AS m,
              MAX(COALESCE(covered_at, '')) AS v,
              SUM(CASE WHEN covered_at IS NULL THEN 0 ELSE 1 END) AS n
         FROM questions`,
    )
    .first<{ c: number; m: number; v: string | null; n: number | null }>();

  return `${row?.c ?? 0}:${row?.m ?? 0}:${row?.v ?? ''}:${row?.n ?? 0}`;
}
