/** The WordCamp Belgrade 2026 workshop. Shared by the home page block, the
 *  workshop page itself and its Event JSON-LD. Venue verified on
 *  belgrade.wordcamp.org, 2026-09-08. */

/** End of the day registration closes, in Europe/Belgrade. */
const closesAt = '2026-09-15T23:59:59+02:00';

export const workshop = {
  title: 'WordPress, Docker and AI agents — hands-on',
  subtitle: 'Workshop · WordCamp Belgrade 2026',
  date: '2026-09-18',
  start: '2026-09-18T12:20:00+02:00',
  end: '2026-09-18T13:40:00+02:00',
  venue: 'Dom Omladine Beograda',
  address: 'Makedonska 22, Belgrade',
  language: 'sr',
  path: '/speaking/2026/wordcamp-belgrade-ddev-ai/',
  wordcampUrl: 'https://belgrade.wordcamp.org/2026/',
  closeDate: '2026-09-15',
  closesAt,
} as const;

/** True until the end of the close date. Evaluated when the page is built,
 *  so a build after 15 September ships the closed state. */
export const registrationOpen = Date.now() <= Date.parse(closesAt);

export default workshop;
