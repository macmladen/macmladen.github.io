/** Schema.org node builders. Every value comes from the data files that the
 *  visible HTML also reads, so the markup and the structured data can never
 *  drift apart. Pages pass their own `Astro.site` in, so nothing hard-codes
 *  the origin. */
import { person } from '../data/person';
import { appearancesNewestFirst, type Appearance } from '../data/speaking';
import { workshop } from '../data/workshop';

type Node = Record<string, unknown>;

/** Absolute URL from a site-relative path. */
const absolute = (path: string, site: URL | string | undefined): string =>
  new URL(path, site ?? person.url).href;

/** Wraps one or more nodes in the single JSON-LD block a page emits. */
export function graph(...nodes: Node[]): Node {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** The Person. `image` is a site-relative path to the headshot the page renders. */
export function personNode(site: URL | string | undefined, image?: string): Node {
  return {
    '@type': 'Person',
    '@id': absolute('/#person', site),
    name: person.name,
    alternateName: person.alternateName,
    jobTitle: person.jobTitle,
    url: absolute('/', site),
    ...(image ? { image: absolute(image, site) } : {}),
    email: `mailto:${person.email}`,
    sameAs: [...person.sameAs],
    worksFor: {
      '@type': 'Organization',
      name: person.worksFor.name,
      url: person.worksFor.url,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: person.locality,
      addressCountry: person.country,
    },
  };
}

/** Reference to the Person node, for use inside another node in the same graph. */
export function personRef(site: URL | string | undefined): Node {
  return { '@id': absolute('/#person', site) };
}

export function webSiteNode(site: URL | string | undefined): Node {
  return {
    '@type': 'WebSite',
    '@id': absolute('/#website', site),
    url: absolute('/', site),
    name: person.name,
    alternateName: person.alternateName,
    inLanguage: 'en',
    publisher: personRef(site),
  };
}

export function profilePageNode(site: URL | string | undefined, mainEntity: Node): Node {
  return {
    '@type': 'ProfilePage',
    '@id': absolute('/about/#profile', site),
    url: absolute('/about/', site),
    name: `About ${person.name}`,
    inLanguage: 'en',
    isPartOf: { '@id': absolute('/#website', site) },
    mainEntity,
  };
}

/** The /contact/ page. Its mainEntity is the Person, the same node the home
 *  and about pages describe, so the three agree on who is being contacted. */
export function contactPageNode(site: URL | string | undefined, mainEntity: Node): Node {
  return {
    '@type': 'ContactPage',
    '@id': absolute('/contact/#contact', site),
    url: absolute('/contact/', site),
    name: 'Contact',
    inLanguage: 'en',
    isPartOf: { '@id': absolute('/#website', site) },
    mainEntity,
  };
}

/** One appearance as an Event. The event itself — the conference, camp or
 *  meetup — is the superEvent; the talk, workshop or lecture given there is the
 *  Event. The day where src/data/speaking.ts records one, otherwise the year on
 *  its own, which is a valid ISO 8601 date too. `location` is the city, where
 *  one is recorded; the two podcast slots have none. `sameAs` is where the same
 *  appearance can be seen elsewhere: the deck on Speaker Deck, the recording on
 *  YouTube, or both. */
function appearanceNode(appearance: Appearance, site: URL | string | undefined): Node {
  const elsewhere = [appearance.deck, appearance.video].filter(
    (url): url is string => url !== null,
  );
  return {
    '@type': 'Event',
    ...(appearance.kind === 'workshop' || appearance.kind === 'lecture'
      ? { additionalType: 'EducationEvent' }
      : {}),
    name: appearance.title ?? appearance.event,
    startDate: appearance.date ?? String(appearance.year),
    ...(appearance.city
      ? { location: { '@type': 'Place', name: appearance.city } }
      : {}),
    ...(appearance.url ? { url: absolute(appearance.url, site) } : {}),
    ...(elsewhere.length > 0 ? { sameAs: elsewhere } : {}),
    ...(appearance.title ? { superEvent: { '@type': 'Event', name: appearance.event } } : {}),
    performer: personRef(site),
  };
}

/** The /speaking/ index: a CollectionPage whose mainEntity is an ItemList of
 *  the appearances, in the order the page itself renders them. Every value is
 *  read from src/data/speaking.ts; nothing here is typed out a second time. */
export function speakingPageNode(site: URL | string | undefined): Node {
  return {
    '@type': 'CollectionPage',
    '@id': absolute('/speaking/#speaking', site),
    url: absolute('/speaking/', site),
    name: 'Speaking',
    inLanguage: 'en',
    isPartOf: { '@id': absolute('/#website', site) },
    about: personRef(site),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: appearancesNewestFirst.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: appearancesNewestFirst.map((appearance, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: appearanceNode(appearance, site),
      })),
    },
  };
}

export function eventNode(site: URL | string | undefined): Node {
  return {
    '@type': 'Event',
    additionalType: 'EducationEvent',
    '@id': absolute(`${workshop.path}#event`, site),
    name: workshop.title,
    description: workshop.summary,
    startDate: workshop.start,
    endDate: workshop.end,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    inLanguage: workshop.language,
    url: absolute(workshop.path, site),
    /** The same session described elsewhere: its page on the WordCamp site.
     *  `url` stays this site's own page, which is the canonical one. */
    sameAs: workshop.sessionUrl,
    location: {
      '@type': 'Place',
      name: workshop.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: workshop.street,
        addressLocality: workshop.city,
        addressCountry: workshop.country,
      },
    },
    superEvent: {
      '@type': 'Event',
      name: workshop.wordcampName,
      url: workshop.wordcampUrl,
      startDate: workshop.wordcampStart,
      endDate: workshop.wordcampEnd,
    },
    performer: personRef(site),
    organizer: personRef(site),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: absolute(workshop.path, site),
      validThrough: workshop.closesAt,
    },
  };
}

/** Breadcrumb trail. /speaking/ is a real page (MM-30) and /speaking/<year>/
 *  stays reserved in the spec, so every step of the trail points somewhere
 *  real or somewhere nothing else may take. */
export function breadcrumbNode(
  site: URL | string | undefined,
  trail: { name: string; path: string }[],
): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: absolute(step.path, site),
    })),
  };
}
