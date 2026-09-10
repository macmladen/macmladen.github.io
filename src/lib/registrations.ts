/** Everything this site does to the D1 `registrations` table. The database is
 *  typed structurally so no Cloudflare types package is needed; the shape is the
 *  part of D1Database this file actually uses. */
import type { RegistrationValues } from '../data/registration';

export interface D1PreparedStatementLike {
  bind(...values: unknown[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}

export interface D1Like {
  prepare(query: string): D1PreparedStatementLike;
}

/** SHA-256 of salt + IP, hex. Returns null when either part is missing, because
 *  an unsalted hash of an IP address is not anonymous and storing nothing is
 *  the honest outcome. IP_HASH_SALT is documented in README. */
export async function hashIp(
  ip: string | null | undefined,
  salt: string | undefined,
): Promise<string | null> {
  if (!ip || !salt) return null;
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export interface Seats {
  capacity: number;
  /** Registrations that take a working seat: everything but the watchers. */
  taken: number;
  left: number;
}

/** How many working seats are gone. Watchers are not counted — they take a
 *  chair, not a seat at the exercise (MM-71). */
export async function countSeatsTaken(db: D1Like): Promise<number> {
  const row = await db
    .prepare('SELECT COUNT(*) AS taken FROM registrations WHERE watch_only = 0')
    .first<{ taken: number }>();
  return row?.taken ?? 0;
}

/** The three numbers /api/seats/ answers with. `left` never goes below zero:
 *  an over-full room is still a full one, and a negative number on the page
 *  would be a puzzle rather than an answer. */
export async function readSeats(db: D1Like, capacity: number): Promise<Seats> {
  const taken = await countSeatsTaken(db);
  return { capacity, taken, left: Math.max(0, capacity - taken) };
}

/** At capacity a registration that wanted a working seat becomes a watching
 *  one. The rule is here rather than only in the page's script because the
 *  script is an enhancement and the room is not: a submission that arrives
 *  after the last seat went — with JavaScript off, or from a page that was
 *  loaded while a seat was still free — must be placed the same way.
 *
 *  It only ever adds watch_only; what the registrant answered about their
 *  laptop is kept, because they gave those answers meaning to use them. */
export const placeAtCapacity = (
  values: RegistrationValues,
  seats: Seats,
): RegistrationValues =>
  seats.left === 0 && !values.watch_only ? { ...values, watch_only: true } : values;

/** The email column is unique; this is the friendly check that runs first. */
export async function findByEmail(db: D1Like, email: string): Promise<{ id: number } | null> {
  return db.prepare('SELECT id FROM registrations WHERE email = ?').bind(email).first<{
    id: number;
  }>();
}

/** An unanswered question in a nullable column is stored as NULL rather than an
 *  empty string, so it reads the same way as the rows written before that column
 *  existed. `github`, `os` and `tool` are NOT NULL since 0001 and keep the empty
 *  string; since MM-73 an empty one of those means "not answered" too. */
const orNull = (value: string): string | null => (value === '' ? null : value);

/** Inserts the registration and returns its id. mailerlite_status starts as
 *  'pending' and is overwritten once the MailerLite call has answered. */
export async function insertRegistration(
  db: D1Like,
  values: RegistrationValues,
  ipHash: string | null,
): Promise<number> {
  const row = await db
    .prepare(
      `INSERT INTO registrations
         (name, email, github, os, tool, terminal, ssh_key, own_hosting, watch_only, newsletter, ip_hash, mailerlite_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
       RETURNING id`,
    )
    .bind(
      values.name,
      values.email,
      values.github,
      values.os,
      // Every ticked AI tool in one string, comma-joined by the validator.
      values.tool,
      orNull(values.terminal),
      orNull(values.ssh_key),
      values.own_hosting ? 1 : 0,
      values.watch_only ? 1 : 0,
      values.newsletter ? 1 : 0,
      ipHash,
    )
    .first<{ id: number }>();

  if (!row) throw new Error('The registration insert returned no id.');
  return row.id;
}

export async function setMailerliteStatus(
  db: D1Like,
  id: number,
  status: string,
): Promise<void> {
  await db.prepare('UPDATE registrations SET mailerlite_status = ? WHERE id = ?').bind(status, id).run();
}

/** The confirmation email's outcome, written after the send has answered
 *  (migration 0004). Null until then, and on every row written before MM-70. */
export async function setConfirmationStatus(
  db: D1Like,
  id: number,
  status: string,
): Promise<void> {
  await db
    .prepare('UPDATE registrations SET confirmation_status = ? WHERE id = ?')
    .bind(status, id)
    .run();
}
