/** Speaking history. One array; /speaking/ and the ItemList in its JSON-LD
 *  both read it, so the visible list and the structured data can never drift
 *  apart.
 *
 *  Every entry comes from a row of docs/speaking-research.md (MM-64), which
 *  carries the source URLs and the confidence rating for each claim. The
 *  `source:` comment above each entry names that row and what backs it.
 *  Nothing here is invented: where the research leaves a cell empty, the field
 *  is null.
 *
 *  Mladen's decisions of 2026-09-09, which set what is in and what is out:
 *  every confirmed or likely appearance with a deck or a recording is
 *  included, as are the confirmed events with neither; Drupal Dev Days Burgas
 *  2024 is a workshop, "Drupal and Next: practical workshop", 26–28 June 2024;
 *  the two podcast guest slots go in as `podcast`; the unclear DrupalCon
 *  Amsterdam 2019 row stays out. */
import { workshop } from './workshop';

export type AppearanceKind = 'talk' | 'workshop' | 'panel' | 'podcast' | 'lecture';

export interface Appearance {
  /** Every row the research approved has a year, so this one is never null. */
  year: number;
  /** ISO date, YYYY-MM-DD, where the research fixes a day; null where it does
   *  not. Sorting inside a year reads it; nothing on the page prints it. */
  date: string | null;
  event: string;
  /** null where the research records no place — the two podcast slots. */
  city: string | null;
  /** null only where the research records no title at all. */
  title: string | null;
  kind: AppearanceKind;
  /** The event's or the session's own page, where one exists and still
   *  resolves. Not a Speaker Deck or YouTube link: those are `deck` and
   *  `video`. */
  url: string | null;
  /** Speaker Deck. */
  deck: string | null;
  /** YouTube. */
  video: string | null;
}

export const appearances: Appearance[] = [
  {
    // source: research row "2026 | WordCamp Belgrade" — confirmed. Title, date,
    // city and path come from src/data/workshop.ts, so this entry and the
    // workshop page can never disagree. The WordCamp listing shows a Serbian
    // title for the same session; workshop.sessionUrl is where that lives.
    year: 2026,
    date: workshop.date,
    event: 'WordCamp Belgrade',
    city: workshop.city,
    title: workshop.title,
    kind: 'workshop',
    url: workshop.path,
    deck: null,
    video: null,
  },
  {
    // source: research row "2025 | WordPress Meetup Vršac" — confirmed. Deck of
    // 66 slides; its description dates the meetup 28 March 2025 and a LinkedIn
    // post of the same day corroborates it. No event page found.
    year: 2025,
    date: '2025-03-28',
    event: 'WordPress Meetup Vršac',
    city: 'Vršac',
    title: 'Decoupled WordPress — architecture and challenges',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/decoupled-wordpress-architecture-and-challenges-2025-wp-vrsac',
    video: null,
  },
  {
    // source: research row "2024 | Drupal Camp Novi Sad" — confirmed. Held
    // 19 October 2024; he co-organised it and appeared in the ceremonial
    // opening and in the panel with Miki Stojković, Franko Antičević and
    // Vladimir Zdravković. `url` is the panel session; the opening is at
    // https://ns2024.drupal.rs/sr/session/svecano-otvaranje and the team page
    // at https://ns2024.drupal.rs/en/team.
    year: 2024,
    date: '2024-10-19',
    event: 'Drupal Camp Novi Sad',
    city: 'Novi Sad',
    title: 'Ceremonial opening + panel discussion',
    kind: 'panel',
    url: 'https://ns2024.drupal.rs/sr/session/panel-diskusija',
    deck: null,
    video: null,
  },
  {
    // source: research row "2024 | Drupal Dev Days Burgas" — likely, resolved
    // by Mladen: it is the workshop "Drupal and Next: practical workshop",
    // 26–28 June 2024 (the date here is the first day). The research could
    // confirm only the event and the year, from drupal.org's own "Events Where
    // He Spoke" list; the title is Mladen's. No url: ddd2024.drupalcamp.bg no
    // longer resolves to the event (its TLS certificate points elsewhere) and
    // it is not in the Wayback Machine.
    year: 2024,
    date: '2024-06-26',
    event: 'Drupal Dev Days Burgas',
    city: 'Burgas',
    title: 'Drupal and Next: practical workshop',
    kind: 'workshop',
    url: null,
    deck: null,
    video: null,
  },
  {
    // source: research row "2024 | DrupalJam Utrecht" — confirmed. 52 slides,
    // deck dated 12 June 2024, at DeFabrique. The session's real name is "DDEV
    // and Drupal, BFF", per Drupaljam's own announcement and the YouTube
    // upload; speaking.ts used to carry the generic "Drupal and DDEV workshop".
    year: 2024,
    date: '2024-06-12',
    event: 'DrupalJam Utrecht',
    city: 'Utrecht',
    title: 'DDEV and Drupal, BFF',
    kind: 'workshop',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/2024-drupaljam-utrecht-drupal-and-ddev-workshop',
    video: 'https://www.youtube.com/watch?v=PwtHE6b_JKU',
  },
  {
    // source: research row "2024 (approx.) | Websites Workshop (podcast)" —
    // a guest slot, not a conference talk; in as `podcast` by Mladen's
    // decision. The research marks the year approximate and records no month,
    // hence the null date.
    year: 2024,
    date: null,
    event: 'Websites Workshop',
    city: null,
    title: 'Guest appearance discussing Drupal CMS',
    kind: 'podcast',
    url: null,
    deck: null,
    video: 'https://www.youtube.com/watch?v=0Ok-K-4EMpk',
  },
  {
    // source: research row "— | Podcast, episode 6" — the second guest slot.
    // The research establishes no year at all and calls this "possibly the
    // same or a companion recording" to the Websites Workshop episode above;
    // it sits in 2024 for that reason alone. Flagged for Mladen: if the two
    // are one recording, one of these entries should go.
    year: 2024,
    date: null,
    event: 'Podcast, episode 6',
    city: null,
    title: 'Drupal CMS',
    kind: 'podcast',
    url: null,
    deck: null,
    video: 'https://www.youtube.com/watch?v=ne1ZzPl26ZI',
  },
  {
    // source: research row "2023 | DrupalJam Utrecht" — confirmed. 64 slides,
    // deck dated 1 June 2023; the video is on his own channel as "Drupaljam
    // 2023 Next-Drupal demo".
    year: 2023,
    date: '2023-06-01',
    event: 'DrupalJam Utrecht',
    city: 'Utrecht',
    title: 'NextJS with Drupal',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/nextjs-with-drupal-drupaljam-utrecht-2023',
    video: 'https://www.youtube.com/watch?v=1tRC4IOCw3Q',
  },
  {
    // source: research row "2023 | WordCamp Apatin" — confirmed. 33 slides,
    // deck dated 27 May 2023, matching WordCamp's own date for the session.
    year: 2023,
    date: '2023-05-27',
    event: 'WordCamp Apatin',
    city: 'Apatin',
    title: 'WordPress with Cloudflare CDN',
    kind: 'talk',
    url: 'https://apatin.wordcamp.org/2023/session/wordpress-with-cloudflare-cdn/',
    deck: 'https://speakerdeck.com/macmladen/wordpress-with-cloudflare-cdn-wordcamp-apatin-2023',
    video: null,
  },
  {
    // source: research row "2023 | Serbian Drupal Community Meetup" — likely.
    // Month and title are corroborated by drupal.merkle.com's write-up and by
    // drupal.org's event list; the exact day (20 May 2023) and the city both
    // come from the drupal.org summary rather than a page read first-hand. The
    // write-up says recordings are on drupal.rs but the research could not
    // track one down to a URL, so `video` stays null.
    year: 2023,
    date: '2023-05-20',
    event: 'Serbian Drupal Community Meetup',
    city: 'Novi Sad',
    title: 'Local development with DDEV',
    kind: 'talk',
    url: 'https://drupal.merkle.com/post/2023/05/serbian-drupal-community-meetup/',
    deck: null,
    video: null,
  },
  {
    // source: research row "2018 | DrupalCamp Pannonia" — confirmed. The first
    // ever edition, 2–3 November 2018 at Palić; the date here is the first
    // day. Not on Speaker Deck. Video published 20 November 2018 on the camp's
    // own channel; drupal.rs also wrote it up at
    // https://drupal.rs/blog/mladen-duric-koder-drupal-docker-composer-gulp-oh-my-drupalcamppannonia
    year: 2018,
    date: '2018-11-02',
    event: 'DrupalCamp Pannonia',
    city: 'Palić',
    title: 'Drupal, Docker, Composer, Gulp, oh my!',
    kind: 'talk',
    url: 'https://www.itcsubotica.org.rs/en/first-ever-drupalcamp-pannonia-palic',
    deck: null,
    video: 'https://www.youtube.com/watch?v=HdCLICY6xno',
  },
  {
    // source: research row "2018 | Drupal-Nis meetup" — confirmed. 55 slides,
    // deck dated 19 May 2018, the second Drupal meetup in Niš. The deck notes
    // a video "soon to be published"; none was found.
    year: 2018,
    date: '2018-05-19',
    event: 'Drupal Niš meetup',
    city: 'Niš',
    title: 'Good Guy Gulp',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/drupal-nis-good-guy-gulp',
    video: null,
  },
  {
    // source: research row "2018 | VTS lecture (Visoka tehnička škola
    // strukovnih studija)" — confirmed. 96 slides, deck dated 10 May 2018,
    // fifth lecture in the series (deck slug vts185). The deck notes a video
    // "soon to be published"; none was found.
    year: 2018,
    date: '2018-05-10',
    event: 'Visoka tehnička škola strukovnih studija',
    city: 'Novi Sad',
    title: 'JavaScript 2018, State and Trends',
    kind: 'lecture',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/vts185-javascript-2018-state-and-trends',
    video: null,
  },
  {
    // source: research row "2018 | VTS lecture" — confirmed. 55 slides, deck
    // dated 26 April 2018, fourth in the series (vts184); the video is on his
    // own channel as "koder-vts184 gulp".
    year: 2018,
    date: '2018-04-26',
    event: 'Visoka tehnička škola strukovnih studija',
    city: 'Novi Sad',
    title: 'Gulp, task runner',
    kind: 'lecture',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/vts184-gulp-task-runner',
    video: 'https://www.youtube.com/watch?v=kRqu-uvlxxc',
  },
  {
    // source: research row "2018 | VTS lecture" — confirmed. 44 slides, deck
    // dated 19 April 2018, third in the series (vts183).
    year: 2018,
    date: '2018-04-19',
    event: 'Visoka tehnička škola strukovnih studija',
    city: 'Novi Sad',
    title: 'Sass, CSS on steroids',
    kind: 'lecture',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/vts183-sass-css-on-steroids',
    video: null,
  },
  {
    // source: research row "2018 | WordPress Meetup Novi Sad" — confirmed.
    // 46 slides, deck dated 18 January 2018.
    year: 2018,
    date: '2018-01-18',
    event: 'WordPress Meetup Novi Sad',
    city: 'Novi Sad',
    title: 'Gulp based Sass frontend workflow with Bootstrap 4',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/gulp-based-sass-frontend-workflow-with-bootstrap-4',
    video: null,
  },
  {
    // source: research row "2017 | Drupal Meetup Subotica (Palić)" —
    // confirmed. 97 slides, deck dated 2 September 2017; the video, published
    // 16 days later on Studio Present's channel, gives the session its name,
    // "Docker4Drupal 2.x".
    year: 2017,
    date: '2017-09-02',
    event: 'Drupal Meetup Subotica',
    city: 'Palić',
    title: 'Docker4Drupal 2.x',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/docker-drupal-meetup-palic-2017',
    video: 'https://www.youtube.com/watch?v=V7LmdFEfmpM',
  },
  {
    // source: research row "2017 | DrupalHeart Camp" (Docker) — confirmed.
    // 101 slides, deck dated 19 May 2017; video on the channel of Srce, the
    // University of Zagreb computing centre.
    year: 2017,
    date: '2017-05-19',
    event: 'DrupalHeart Camp',
    city: 'Zagreb',
    title: 'Docker Driven Drupal Development™',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/docker-driven-drupal-development',
    video: 'https://www.youtube.com/watch?v=EmHw9TJCGFo',
  },
  {
    // source: research row "2017 | DrupalHeart Camp" (Gulp) — confirmed.
    // 52 slides, same day and same camp as the Docker talk above: a second
    // session, not a duplicate.
    year: 2017,
    date: '2017-05-19',
    event: 'DrupalHeart Camp',
    city: 'Zagreb',
    title: 'Gulp based Sass frontend workflow with Bootstrap framework and theme',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/gulp-based-sass-frontend-workflow-with-bootstrap-framework-and-theme',
    video: null,
  },
  {
    // source: research row "2017 | WordPress meetup" (Zrenjanin) — confirmed.
    // 31 slides, deck dated 28 April 2017.
    year: 2017,
    date: '2017-04-28',
    event: 'WordPress meetup',
    city: 'Zrenjanin',
    title: 'Docker 4 WordPress',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/docker-4-wordpress',
    video: null,
  },
  {
    // source: research row "2017 | WordPress Meetup Novi Sad (6th)" —
    // confirmed. 28 slides, deck dated 17 April 2017; the meetup itself is on
    // Meetup.com.
    year: 2017,
    date: '2017-04-17',
    event: 'WordPress Meetup Novi Sad',
    city: 'Novi Sad',
    title: 'Docker based Web development',
    kind: 'talk',
    url: 'https://www.meetup.com/WP-Meetup-NS/events/236189966',
    deck: 'https://speakerdeck.com/macmladen/docker-based-web-development',
    video: null,
  },
  {
    // source: research row "2017 | Drupal Serbia meetup (1st)" — confirmed.
    // 26 slides, deck dated 8 April 2017; the first meetup of the group, on
    // Meetup.com as "Top lista drupalista".
    year: 2017,
    date: '2017-04-08',
    event: 'Drupal Serbia meetup',
    city: 'Niš',
    title: 'Docker + Wodby + Docksal technology and comparison',
    kind: 'talk',
    url: 'https://www.meetup.com/top-lista-drupalista/events/238489719/',
    deck: 'https://speakerdeck.com/macmladen/docker-plus-wodby-plus-docksal-technology-and-comparison',
    video: null,
  },
  {
    // source: research row "2016 | Ironcamp (1st)" — confirmed. 13 slides,
    // deck dated 26 November 2016; video published on the Drupal IronCamp
    // channel in January 2017.
    year: 2016,
    date: '2016-11-26',
    event: 'Ironcamp',
    city: 'Prague',
    title: 'Docker 4 Drupal',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/docker-4-drupal',
    video: 'https://www.youtube.com/watch?v=GKzfuAzR6dk',
  },
  {
    // source: research row "2015 | Drupal Camp Skopje" — confirmed. 31 slides,
    // deck dated 3 May 2015; the camp's own channel published the recording as
    // "Run your own server on cheap like a pro with BOA". drupal.org's profile
    // lists the event independently.
    year: 2015,
    date: '2015-05-03',
    event: 'Drupal Camp Skopje',
    city: 'Skopje',
    title: 'BOA — Barracuda on Aegir (Drupal hosting)',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/boa-drupal-camp-skopje-2015',
    video: 'https://www.youtube.com/watch?v=WemboKD6oBA',
  },
  {
    // source: research row "2014 | Drupal Camp Serbia" — confirmed. 35 slides,
    // deck dated 31 October 2014; drupal.org's profile lists it as "DrupalCamp
    // Novi Sad 2014".
    year: 2014,
    date: '2014-10-31',
    event: 'Drupal Camp Serbia',
    city: 'Novi Sad',
    title: 'BOA — Barracuda on Aegir (Drupal hosting)',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/boa-drupal-camp-serbia-2014',
    video: null,
  },
  {
    // source: research row "2013 | BalCCon (Balkan Computer Congress)"
    // (Ethics) — confirmed. 28 slides, deck dated 7 September 2013, at the
    // Master Centre on the Novi Sad Fair. No recording found.
    year: 2013,
    date: '2013-09-07',
    event: 'BalCCon',
    city: 'Novi Sad',
    title: 'Ethics — what it (actually) is and why is it important',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/balccon-2013-ethics-what-it-actually-is-and-why-is-it-important',
    video: null,
  },
  {
    // source: research row "2013 | BalCCon" (Mac OS X) — confirmed. 30 slides,
    // deck dated 6 September 2013; recording on BalCCon's own channel.
    year: 2013,
    date: '2013-09-06',
    event: 'BalCCon',
    city: 'Novi Sad',
    title: 'Mac OS X — How Apple learned to stop worrying and fell in love with UNIX',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/balccon-2013-mac-os-x-how-apple-learned-to-stop-worrying-and-fell-in-love-with-unix',
    video: 'https://www.youtube.com/watch?v=Xzj1KP06kmw',
  },
  {
    // source: research row "2013 | Drupal meetup Serbia" — confirmed.
    // 17 slides, deck dated 29 July 2013 (the deck's own slug carries the
    // series marker DrupalRS_17). Its description jokes that it was "(not)
    // presented" to an audience of two, the heat having thinned the room.
    year: 2013,
    date: '2013-07-29',
    event: 'Drupal meetup Serbia',
    city: 'Novi Sad',
    title: '.tpl vs Panels vs Display Suite ...vs Drupal Front-end developer',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/drupalrs-17-tpl-vs-panels-vs-display-suite-dot-dot-dot-vs-drupal-front-end-developer',
    video: null,
  },
  {
    // source: research row "2013 | DaFED #9" — confirmed. 35 slides, deck
    // dated 3 April 2013. DaFED is the Novi Sad front-end meetup he founded.
    year: 2013,
    date: '2013-04-03',
    event: 'DaFED #9',
    city: 'Novi Sad',
    title: 'CSS vs LESS vs SASS vs Frontend Designer',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/dafed-9-css-vs-less-vs-sass-vs-frontend-designer',
    video: null,
  },
  {
    // source: research row "2011 | Drupal Balkan Summit" (How Much Is Site?) —
    // confirmed. 6 slides, deck dated 9 October 2011: the second day of the
    // summit and his second talk at it.
    year: 2011,
    date: '2011-10-09',
    event: 'Drupal Balkan Summit',
    city: 'Novi Sad',
    title: 'How Much Is Site?',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/drupal-balkan-summit-2011-how-much-is-site',
    video: null,
  },
  {
    // source: research row "2011 | Drupal Balkan Summit (1st ever)" —
    // confirmed. 14 slides, deck dated 8 October 2011. The oldest appearance
    // the research found, at the first summit of its kind, 8–9 October 2011.
    year: 2011,
    date: '2011-10-08',
    event: 'Drupal Balkan Summit',
    city: 'Novi Sad',
    title: 'How Do We Theme Drupal',
    kind: 'talk',
    url: null,
    deck: 'https://speakerdeck.com/macmladen/drupal-balkan-summit-2011-how-do-we-theme-drupal',
    video: null,
  },
];

/** Newest first: by year, then by date inside the year. Entries the research
 *  dates only to a year sort last within it, since there is nothing to place
 *  them against. Array.prototype.sort is stable, so two entries sharing a date
 *  — the two DrupalHeart Camp talks of 19 May 2017 — keep the order above. */
const newestFirst = (a: Appearance, b: Appearance): number => {
  if (a.year !== b.year) return b.year - a.year;
  if (a.date === b.date) return 0;
  if (a.date === null) return 1;
  if (b.date === null) return -1;
  return a.date < b.date ? 1 : -1;
};

/** The appearances in the order /speaking/ renders them. The page and the
 *  ItemList in its JSON-LD both read this one array, so the visible order and
 *  the structured order can never disagree. */
export const appearancesNewestFirst: Appearance[] = [...appearances].sort(newestFirst);

export interface AppearanceYear {
  year: number;
  items: Appearance[];
}

/** The same appearances, grouped into the year sections the page renders:
 *  years newest first, entries inside a year in the order above. Built by
 *  walking the sorted array, so the grouping can never disagree with it. */
export const appearancesByYear: AppearanceYear[] = appearancesNewestFirst.reduce(
  (years: AppearanceYear[], appearance) => {
    const last = years.at(-1);
    if (last && last.year === appearance.year) last.items.push(appearance);
    else years.push({ year: appearance.year, items: [appearance] });
    return years;
  },
  [],
);

/** The line that stands for everything not listed above. Mladen's own claim
 *  about the scale of it; the list is what the research could evidence. */
export const summaryLine =
  '40+ events in Novi Sad, Subotica, Zagreb, Amsterdam, Prague, Varna, Utrecht, Burgas';

export default appearances;
