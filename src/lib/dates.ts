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
