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

/** The home page intro, two paragraphs. Approved by Mladen 2026-09-08 and
 *  reproduced verbatim from docs/spec-v1.md; this is a different, shorter text
 *  than the EN bio above, which belongs to /about/. */
export const intro: string[] = [
  'Mladen Đurić (MacMladen) is a senior developer and architect with more than two ' +
    'decades of building for the web, and a computing story that starts with assembly ' +
    'on 8-bit machines. He lives in Novi Sad, where he builds solutions for clients ' +
    'with WordPress and Drupal, side by side with modern technologies such as Astro, ' +
    'Next.js and React Native.',
  'A pragmatist of the "right tool for the right job" school, he cares about ' +
    'performance, sustainability, and the UNIX principle of eliminating everything ' +
    'that is not necessary. He organises meetups, workshops and conferences, and is ' +
    'active in the IT community: WordPress, Drupal, JavaScript, AI.',
];

/** The body of /about/, verbatim from the 2014 site — `git show jekyll:about.html`,
 *  front matter and <p> wrappers removed, nothing else touched. Mladen's own
 *  copy, so it carries no draft marker. Typos and turns of phrase are his and
 *  stay as written.
 *
 *  Each entry may contain the inline markup the original carried: <em>, <strong>
 *  and one <code> (the Ruby `gem` of the second paragraph). Render with
 *  set:html, never as plain text, or the markup ships as literal angle brackets.
 *  This is fixed authored content in the repo, not input from anywhere. */
export const about: string[] = [
  'I am an IT man with many skills, still open to learn new ones.',
  'Although challenges may suck my energy below absolute zero I still enjoy taking them. Sometimes, it is server task about making machine operate beyond what seems possible. Then it could be some border on CSS element defying common sense. Or Ruby <code>gem</code> that drives someone nuts. Or just showing how Macs are magnificent beyond their captivating shell beauty.',
  'But I am not exclusively an IT guy. Just some geek or nerd living in piles of comic books, watching Star Wars while downloading <em>Deep Space 9</em>. Not only regularly socialized, just like anyone else, I enjoy debating on humanities, questioning reality, ability of knowledge or practicing logic and oral skills. If you meet me, make me happy by bringing up these or some other essential questions on God and existence.',
  "I'm a gnostic. Maybe Buddhist but not a true one. I do not believe, I know, question, reason. You may have your way but this is mine, this is my choice.",
  "I've started thinking analytically since I'm aware of myself but conceived first algorithms somewhere in 1978 with Texas Instruments TI-57 and soon was making first steps in BASIC and assembly of Z80 in Tandy Radio Shack TRS-80. Brief episodes with Sinclair ZX-81 and Spectrum led me to Commodore 64 whose architecture, kernel and API was theme of my high school graduation. Yes, I've done C and assembly on x86 DOS too, felt like my last Commodore 128D which I ran on CP/M.",
  'Those limited environments learned me a lot about appreciation of limited resources, optimization and battle for every single cycle. Imagine your CPU running at 1MHz? That was our 6502 baby, friends and I called RISC when we <em>fought</em> the other tribe with their Z80 we called CISC.',
  "I know about Macs. I've seen Apple ][ and very first Macintoshes but got first one somewhere in 1995 and never looked back. I was fascinated with simplicity, beauty and overall philosophy. And I still am. Others may like the case or some fancy UI tricks but I know and understand ticking under the hood. And I like that.",
  "DTP was my escape to aesthetics. I enjoyed type, that strange marriage of mathematics and aesthetics, ruled by splines and psychology and incomprehensible logic for rhythm. I've done that for a decade and half, went pretty deep and still I am very proficient in Adobe Photoshop, Illustrator and InDesign.",
  'Just as I thought hardware industry was dead in 1990 and switched to DTP, I also figured that DTP will go down as everyone thinks they can do it and declining need for printed anything.',
  "So I finally decided to jump on web wagon in 2006 although I've used mail from late eighties, on academic net long before Internet became <em>public</em> (I even remember debate and disgust on opening web sites for commercial entities!)",
  'And here I am right now, split between front end development, Drupal site building and development and server building, tuining and maintaining.',
  "You've read so far? Rarely anyone does but then again, what would <strong>About</strong> page on personal Blog be if not all about a person who owns it?",
  'If you are interested in something more particular, have some Indecent (job) Proposal or just wonder about a Meaning of Life, feel free to contact me somehow. Even better meet me in person. Somewhere.',
];

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
  intro,
  about,
} as const;

export default person;
