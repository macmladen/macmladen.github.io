/** The sharing cards. One per page, drawn at build time by `scripts/og.mjs`
 *  into `public/og/<slug>.png` and named by that page's `og:image` (see
 *  `src/components/Head.astro`).
 *
 *  This registry is the single source for both ends: the script walks it to
 *  know which files to draw, and Head.astro looks a page up by its canonical
 *  path to know which file to name. A page that is not listed falls back to
 *  the home card, which is what the two form endpoints get — they render a
 *  result page that carries `robots: noindex` and is never shared.
 *
 *  The relative imports below carry their `.ts` extension on purpose. The
 *  generator is plain Node, run before `astro build` and outside Vite, and
 *  Node's ESM resolver has no extension guessing; Vite and TypeScript
 *  (`allowImportingTsExtensions`, set by Astro's base config) take the
 *  explicit form just as happily. */

import { person } from './person.ts';
import { workshop } from './workshop.ts';
import { whenAndWhere } from '../lib/dates.ts';

/** Facebook's and LinkedIn's preferred sharing size, and what `og:image:width`
 *  and `og:image:height` promise. Exported so the generator and the markup
 *  cannot disagree. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  /** File name under `/og/`, without the extension. */
  slug: string;
  /** Canonical path of the page this card belongs to. */
  path: string;
  /** The line set large on the card. */
  title: string;
  /** An optional smaller line under the title. Only the workshop card has one:
   *  a card for a dated event has a job the others do not, which is to answer
   *  "when and where" in the preview itself, before anyone opens the link. */
  subtitle?: string;
}

/** Titles are the page's own words, taken from the data files rather than
 *  written again here, so nothing can drift and no new copy needs approving.
 *  The home card is the deliberate exception: its page title is the name, and
 *  the name is already the card's footer line, so the card carries the
 *  standfirst — the sentence the home page actually opens with — rather than
 *  saying "Mladen Djuric" twice. */
export const ogCards: OgCard[] = [
  { slug: 'home', path: '/', title: person.tagline },
  { slug: 'about', path: '/about/', title: 'About' },
  { slug: 'speaking', path: '/speaking/', title: 'Speaking' },
  { slug: 'contact', path: '/contact/', title: 'Contact' },
  {
    slug: 'workshop',
    path: workshop.path,
    title: workshop.title,
    subtitle: whenAndWhere(workshop.start, workshop.venue),
  },
];

/** The card for a canonical path, or the home card for anything unlisted. */
export function cardForPath(path: string): OgCard {
  return ogCards.find((card) => card.path === path) ?? ogCards[0];
}

/** Where a card is served from. */
export function ogImagePath(slug: string): string {
  return `/og/${slug}.png`;
}
