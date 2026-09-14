/** Reading the D1 `registrations` table back out — the list behind the host's
 *  People page and the CSV beside it (MM-89). registrations.ts writes a
 *  registration; this reads them all, and the two are kept apart so the write
 *  path stays the small thing it is.
 *
 *  The database is typed as QuestionsDb rather than registrations.ts's D1Like
 *  because a list needs `all()`, which a single-row read never did. It is the
 *  shape the `DB` binding already carries (src/env.d.ts).
 *
 *  Nothing here ever hands back an SSH key. The column is read only to answer
 *  yes or no: the page and the CSV are a list of people to greet in a room, and
 *  a public key in a downloaded file is a copy nobody asked for. `ip_hash` is
 *  not read at all.
 *
 *  Everything below the query is pure, so `node scripts/test-people.mjs` drives
 *  it with a fake database and no server. The .ts extension on the import is
 *  deliberate; see the note in questions.ts. */
import type { QuestionsDb } from './questions.ts';

/** One registration, as the page and the CSV see it. */
export interface Person {
  id: number;
  /** ISO 8601 with the Z, see toIso below. */
  createdAt: string;
  name: string;
  /** Null when it was not answered — city, terminal and both statuses are
   *  columns added after the first registrations were written. */
  city: string | null;
  email: string;
  os: string;
  /** Every ticked AI tool in one comma-joined string, as the form stored it. */
  tool: string;
  terminal: string | null;
  /** Whether a key was given, never the key itself. */
  sshKey: boolean;
  ownHosting: boolean;
  watchOnly: boolean;
  newsletter: boolean;
  mailerliteStatus: string | null;
  confirmationStatus: string | null;
}

interface PersonRow {
  id: number;
  created_at: string;
  name: string;
  city: string | null;
  email: string;
  os: string;
  tool: string;
  terminal: string | null;
  ssh_key: string | null;
  own_hosting: number;
  watch_only: number;
  newsletter: number;
  mailerlite_status: string | null;
  confirmation_status: string | null;
}

/** SQLite's datetime('now') is UTC written as `2026-09-18 09:30:00`, and
 *  `new Date()` reads a string in that shape as *local* time. The T and the Z
 *  are added here, in the one place that knows the value came from SQLite. The
 *  same two lines stand in questions.ts; they are kept there rather than shared
 *  because each module owns its own table's rows. */
const toIso = (value: string): string =>
  /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(' ', 'T')}Z` : value;

/** SQLite has no boolean: the three flags are stored as 0 and 1. */
const flag = (value: unknown): boolean => value === 1 || value === true || value === '1';

/** Empty strings read as unanswered, the way registrations.ts writes them:
 *  `os` and `tool` are NOT NULL and keep the empty string, the rest are NULL. */
const orNull = (value: string | null): string | null =>
  value === null || value === '' ? null : value;

const toPerson = (row: PersonRow): Person => ({
  id: row.id,
  createdAt: toIso(row.created_at),
  name: row.name,
  city: orNull(row.city),
  email: row.email,
  os: row.os,
  tool: row.tool,
  terminal: orNull(row.terminal),
  // The one use the key column is put to here: was one given.
  sshKey: orNull(row.ssh_key) !== null,
  ownHosting: flag(row.own_hosting),
  watchOnly: flag(row.watch_only),
  newsletter: flag(row.newsletter),
  mailerliteStatus: orNull(row.mailerlite_status),
  confirmationStatus: orNull(row.confirmation_status),
});

/** Every registration, newest first — the order a list is read in on the
 *  morning of the workshop, where the question is who has just arrived. Ordered
 *  by id rather than created_at: two registrations in the same second share a
 *  timestamp and the id never ties. The room holds thirty, so nothing is paged. */
export async function listRegistrations(db: QuestionsDb): Promise<Person[]> {
  const { results } = await db
    .prepare(
      `SELECT id, created_at, name, city, email, os, tool, terminal, ssh_key,
              own_hosting, watch_only, newsletter, mailerlite_status, confirmation_status
         FROM registrations
        ORDER BY id DESC`,
    )
    .all<PersonRow>();
  return results.map(toPerson);
}

export interface PeopleCounts {
  total: number;
  /** Registrations that came for a working seat. */
  working: number;
  /** The ones that came to watch. */
  watching: number;
}

/** The count line. Counted from the rows already in hand rather than asked of
 *  the database again: the list is the answer, and a second query could only
 *  disagree with it. */
export function peopleCounts(rows: readonly Person[]): PeopleCounts {
  const watching = rows.filter((row) => row.watchOnly).length;
  return { total: rows.length, working: rows.length - watching, watching };
}

/** The CSV's header, and the order of its fields. The names are the D1 column
 *  names, so a downloaded file and the `wrangler d1 execute` export in the
 *  README line up field for field. `ssh_key` carries yes or no, not a key. */
const CSV_HEADER = [
  'id',
  'created_at',
  'name',
  'city',
  'email',
  'os',
  'tool',
  'terminal',
  'ssh_key',
  'own_hosting',
  'watch_only',
  'newsletter',
  'mailerlite_status',
  'confirmation_status',
] as const;

const yesNo = (value: boolean): string => (value ? 'yes' : 'no');

/** RFC 4180 quoting: a field is quoted when it holds a comma, a quote or a line
 *  break, and a quote inside a quoted field is doubled. Everything else is
 *  written bare, which keeps the common file readable in a text editor. */
const quote = (value: string): string =>
  /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

const fields = (person: Person): string[] => [
  String(person.id),
  person.createdAt,
  person.name,
  person.city ?? '',
  person.email,
  person.os,
  person.tool,
  person.terminal ?? '',
  yesNo(person.sshKey),
  yesNo(person.ownHosting),
  yesNo(person.watchOnly),
  yesNo(person.newsletter),
  person.mailerliteStatus ?? '',
  person.confirmationStatus ?? '',
];

/** The whole list as one CSV document, header first and in the order the page
 *  shows. CRLF between records and a trailing one, as RFC 4180 has it; every
 *  spreadsheet reads that, and a few of them read nothing else. */
export function toCsv(rows: readonly Person[]): string {
  const lines = [CSV_HEADER.join(','), ...rows.map((row) => fields(row).map(quote).join(','))];
  return `${lines.join('\r\n')}\r\n`;
}

/** "18.09 12:20" — the day and the time in Belgrade, which is where the room
 *  is. Short on purpose: the whole list is one day, so the year and the month's
 *  name would be thirteen columns of the same thing.
 *
 *  hourCycle rather than hour12: `hour12: false` has been known to render
 *  midnight as 24:00 under some ICU builds, and a list read at the start of a
 *  day should not have to explain that. */
const belgrade = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Europe/Belgrade',
});

export function whenInBelgrade(iso: string): string {
  const parts = new Map(belgrade.formatToParts(new Date(iso)).map((part) => [part.type, part.value]));
  return `${parts.get('day')}.${parts.get('month')} ${parts.get('hour')}:${parts.get('minute')}`;
}
