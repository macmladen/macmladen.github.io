/** Speaking history. One array so /speaking/ can be generated from it later. */
import { workshop } from './workshop';

export type AppearanceKind = 'talk' | 'workshop';

export interface Appearance {
  event: string;
  /** null where the source material does not record the year. */
  year: number | null;
  /** null where the source material does not record the title. */
  title: string | null;
  kind: AppearanceKind;
  url?: string;
}

export const appearances: Appearance[] = [
  {
    event: 'WordCamp Apatin',
    year: 2023,
    title: 'WordPress with Cloudflare CDN',
    kind: 'talk',
    url: 'https://apatin.wordcamp.org/2023/session/wordpress-with-cloudflare-cdn/',
  },
  {
    event: 'DrupalJam Utrecht',
    year: 2024,
    title: 'Drupal and DDEV workshop',
    kind: 'workshop',
  },
  {
    // The handover records neither a year nor a title for this one.
    event: 'Drupal Dev Days Burgas',
    year: null,
    title: null,
    kind: 'talk',
  },
  {
    event: 'WordPress Meetup Vršac',
    year: 2025,
    title: 'Decoupled WordPress — architecture and challenges',
    kind: 'talk',
  },
  {
    event: 'WordCamp Belgrade',
    year: 2026,
    title: workshop.title,
    kind: 'workshop',
    url: workshop.path,
  },
];

/** The appearances in the order /speaking/ renders them: newest first, with
 *  the entries whose year the source material does not record last. The page
 *  and the ItemList in its JSON-LD both read this one array, so the visible
 *  order and the structured order can never disagree. */
export const appearancesNewestFirst: Appearance[] = [...appearances].sort(
  (a, b) => (b.year ?? 0) - (a.year ?? 0),
);

/** The line that stands for everything not listed above. */
export const summaryLine =
  '40+ events in Novi Sad, Subotica, Zagreb, Amsterdam, Prague, Varna, Utrecht, Burgas';

export default appearances;
