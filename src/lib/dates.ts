/** Date formatting for the one time zone this site talks about. The workshop
 *  happens in Belgrade, so every human-readable date and time is rendered in
 *  Europe/Belgrade regardless of where the build runs. The machine-readable
 *  values in `datetime` attributes come straight from the data files. */

const TIME_ZONE = 'Europe/Belgrade';

const dayMonth = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  timeZone: TIME_ZONE,
});

const weekdayDayMonthYear = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIME_ZONE,
});

const clock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: TIME_ZONE,
});

const weekdayDayMonth = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: TIME_ZONE,
});

/** "18 September" */
export const dayAndMonth = (iso: string): string => dayMonth.format(new Date(iso));

/** "Friday 18 September" — the workshop is this year, so the confirmation email
 *  says the day and leaves the year to the calendar. */
export const weekdayAndDate = (iso: string): string =>
  weekdayDayMonth.format(new Date(iso));

/** "Friday 18 September 2026" */
export const fullDate = (iso: string): string => weekdayDayMonthYear.format(new Date(iso));

/** "12:20" */
export const timeOfDay = (iso: string): string => clock.format(new Date(iso));

/** The separator between the parts of the when-and-where line. A middot with
 *  hair spaces around it, the same one the eyebrow on the home page sets by
 *  hand, kept here so the sharing card and the page cannot drift apart. */
const DOT = ' · ';

/** "Friday 18 September 2026 · 12:20" — one instant said in full. Kept apart
 *  from `whenAndWhere` because markup wants it on its own: it is the part that
 *  belongs inside a `<time>` element, and the place beside it does not. */
export const dateAndTime = (iso: string): string =>
  `${fullDate(iso)}${DOT}${timeOfDay(iso)}`;

/** "Friday 18 September 2026 · 12:20 · Dom Omladine Beograda" — when and where,
 *  in one string, for the places that can only take one: the sharing card
 *  (`scripts/og.mjs`, drawn as flat text) among them. A page composes the same
 *  line out of `dateAndTime` and the place instead, so the date can carry its
 *  machine-readable form. */
export const whenAndWhere = (iso: string, place: string): string =>
  `${dateAndTime(iso)}${DOT}${place}`;
