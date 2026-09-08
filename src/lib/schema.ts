/** Schema.org node builders. Every value comes from the data files that the
 *  visible HTML also reads, so the markup and the structured data can never
 *  drift apart. Pages pass their own `Astro.site` in, so nothing hard-codes
 *  the origin. */
import { person } from '../data/person';
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

/** Breadcrumb trail. The /speaking/ and /speaking/<year>/ URLs are reserved in
 *  the spec precisely so these links keep pointing somewhere real. */
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
