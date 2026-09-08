/** The single source for everything about Mladen that appears in both the
 *  visible HTML and the JSON-LD. Never duplicate these values in a template. */

export interface Link {
  name: string;
  url: string;
}

/** Profile links that carry rel="me" in the footer, so the profiles verify
 *  back to this site. Their URLs are also the Person's sameAs list. */
export const profiles: Link[] = [
  { name: 'LinkedIn', url: 'https://rs.linkedin.com/in/macmladen' },
  { name: 'GitHub', url: 'https://github.com/macmladen' },
  { name: 'Speaker Deck', url: 'https://speakerdeck.com/macmladen' },
];

/** Projects and companies Mladen runs. Plain links, no rel="me". */
export const brands: Link[] = [
  { name: 'Blue Fish', url: 'https://bluefish.rs/' },
  { name: 'Koder', url: 'https://koder.rs/' },
  { name: 'Razgovori', url: 'https://razgovori.rs/' },
];

/** EN bio, verbatim from section 6 of the WordCamp Belgrade 2026 handover. */
export const bio =
  'Mladen Đurić (MacMladen) is a senior developer and architect with two decades of ' +
  'building for the web — and a computing story that starts with assembly on 8-bit ' +
  'machines. He runs Blue Fish, a full-service digital agency in Novi Sad, shipping ' +
  'WordPress and Drupal sites alongside modern stacks like Astro, Next.js, and React ' +
  'Native. A right-tool-for-the-job pragmatist, he cares about performance, ' +
  'sustainability, and the UNIX principle of doing nothing unless required. He ' +
  'organizes meetups, workshops, and an annual conference, hosts the Razgovori ' +
  'podcast, and is active in both the WordPress and Drupal communities. He writes at ' +
  'macmladen.com.';

/** The first two sentences of the bio, for meta descriptions and short intros. */
export const bioShort =
  'Mladen Đurić (MacMladen) is a senior developer and architect with two decades of ' +
  'building for the web — and a computing story that starts with assembly on 8-bit ' +
  'machines. He runs Blue Fish, a full-service digital agency in Novi Sad, shipping ' +
  'WordPress and Drupal sites alongside modern stacks like Astro, Next.js, and React ' +
  'Native.';

export const person = {
  name: 'Mladen Đurić',
  alternateName: 'MacMladen',
  jobTitle: 'Senior web developer and architect',
  url: 'https://macmladen.com/',
  email: 'mladen@macmladen.com',
  locality: 'Novi Sad',
  country: 'RS',
  profiles,
  sameAs: profiles.map((profile) => profile.url),
  worksFor: { name: 'Blue Fish', url: 'https://bluefish.rs/' },
  brands,
  bio,
  bioShort,
} as const;

export default person;
