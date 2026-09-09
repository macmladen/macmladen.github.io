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

/** draft: Mladen to approve — the standfirst line under the name on the home
 *  page. It sits beside `jobTitle` rather than replacing it: `jobTitle` is the
 *  formal string the JSON-LD Person carries, this is the spoken one the page
 *  shows, and the two are allowed to differ. Rendered by `src/pages/index.astro`
 *  only; nothing in the structured data reads it. */
export const tagline = 'Senior developer, architect, IA and AI guy.';

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

/** The body of /about/. The 2014 text, rewritten by Mladen himself on
 *  2026-09-09 and supplied verbatim; his punctuation and his British spelling
 *  ("socialise", "optimisation", "practising") stay as written. His own copy,
 *  so it carries no draft marker.
 *
 *  The only markup added on top of his text: <code> around the Ruby gem,
 *  <strong> around About in the penultimate paragraph, and one <a> on the
 *  first occurrence of each named technology, machine or cultural reference —
 *  Wikipedia or the vendor's own page, same tab, no rel. Every URL was checked
 *  with curl on 2026-09-09. Render with set:html, never as plain text, or the
 *  markup ships as literal angle brackets. Template literals throughout so the
 *  href quotes and the apostrophes both sit in the source unescaped. This is
 *  fixed authored content in the repo, not input from anywhere. */
export const about: string[] = [
  `I am an IT guy with many skills, and I'm always open to learning new ones.`,
  `Although challenges may suck my energy below absolute zero, I still enjoy taking them on. Sometimes, it is a server task about making a machine operate beyond what seems possible. Then it could be some border on a CSS element defying common sense. Or a <a href="https://rubygems.org/">Ruby <code>gem</code></a> that drives someone up the wall. Or it could be showing how Macs are magnificent beyond their captivating shell beauty.`,
  `But I am not exclusively an IT guy. Just some geek or nerd living in piles of comic books, watching <a href="https://en.wikipedia.org/wiki/Star_Wars">Star Wars</a> while downloading <a href="https://en.wikipedia.org/wiki/Star_Trek:_Deep_Space_Nine">Deep Space 9</a>. Not only do I socialise regularly, just like anyone else, but I also enjoy debating the humanities, questioning reality and the limits of knowledge, or practising logic and oral skills. If you meet me, make me happy by bringing up these or some other essential questions on God and existence.`,
  `I'm a <a href="https://en.wikipedia.org/wiki/Gnosticism">gnostic</a>. Maybe <a href="https://en.wikipedia.org/wiki/Buddhism">Buddhist</a>, but not a true one. I do not believe, I know, question, or reason. You may have your way, but this is mine; this is my choice.`,
  `I've started thinking analytically since I became aware of myself. Still, I conceived my first algorithms somewhere in the late seventies with <a href="https://en.wikipedia.org/wiki/TI-57">Texas Instruments TI-57</a> and soon took first steps in <a href="https://en.wikipedia.org/wiki/BASIC">BASIC</a> and <a href="https://en.wikipedia.org/wiki/Zilog_Z80">Z80</a> assembly on <a href="https://en.wikipedia.org/wiki/TRS-80">Tandy Radio Shack TRS-80</a>. Brief episodes with <a href="https://en.wikipedia.org/wiki/ZX81">Sinclair ZX-81</a> and <a href="https://en.wikipedia.org/wiki/ZX_Spectrum">Spectrum</a> led me to the <a href="https://en.wikipedia.org/wiki/Commodore_64">Commodore 64</a>, whose architecture, kernel and API were the theme of my high school graduation. Yes, I've done <a href="https://en.wikipedia.org/wiki/C_(programming_language)">C</a> and assembly on <a href="https://en.wikipedia.org/wiki/X86">x86</a> <a href="https://en.wikipedia.org/wiki/MS-DOS">DOS</a> too; it felt like my last <a href="https://en.wikipedia.org/wiki/Commodore_128">Commodore 128D</a>, which I ran on <a href="https://en.wikipedia.org/wiki/CP/M">CP/M</a>.`,
  `Those limited environments taught me a lot about appreciating limited resources, optimisation, and a battle for every single byte and CPU cycle. Imagine your CPU running at 1MHz? That was our <a href="https://en.wikipedia.org/wiki/MOS_Technology_6502">6502</a> baby; friends and I called <a href="https://en.wikipedia.org/wiki/Reduced_instruction_set_computer">RISC</a> when we fought the other tribe with their Z80, which we called <a href="https://en.wikipedia.org/wiki/Complex_instruction_set_computer">CISC</a>.`,
  `I know about Macs. I've seen <a href="https://en.wikipedia.org/wiki/Apple_II">Apple ][</a> and the very first <a href="https://en.wikipedia.org/wiki/Macintosh">Macintoshes</a>, but got my first one somewhere in 1995 and never looked back. I was fascinated with simplicity, beauty and overall philosophy. And I still am. Others may like the case or some fancy UI tricks, but I know and understand what's ticking under the hood. And I like that.`,
  `<a href="https://en.wikipedia.org/wiki/Desktop_publishing">DTP</a> was my escape to aesthetics. I enjoyed type, that strange marriage of mathematics and aesthetics, ruled by splines and psychology and incomprehensible logic for rhythm. I've done that for a decade and a half, went pretty deep, and I am still very proficient in <a href="https://www.adobe.com/products/photoshop.html">Adobe Photoshop</a>, <a href="https://www.adobe.com/products/illustrator.html">Illustrator</a> and <a href="https://www.adobe.com/products/indesign.html">InDesign</a>.`,
  `Just as I thought the hardware industry was dead in 1990 and switched to DTP, I figured DTP would go down too, as everyone thinks they can do it and the need for printed anything declines.`,
  `So I finally decided to jump on the web wagon in 2006. However, I've used mail since the late eighties, on academic net long before the Internet became public (I even remember debate and disgust on opening web sites for commercial entities!)`,
  `And here I am right now, split between front-end development, <a href="https://www.drupal.org/">Drupal</a> site building and development and server building, tuning and maintaining.`,
  `You've read so far? Rarely anyone does, but then again, what would an <strong>About</strong> page on a personal Blog be if not all about a person who owns it?`,
  `If you are interested in something more specific, have an <a href="https://en.wikipedia.org/wiki/Indecent_Proposal">Indecent (job) Proposal</a> or wonder about <a href="https://en.wikipedia.org/wiki/Meaning_of_life">The Meaning of Life</a>, feel free to contact me somehow. Even better, meet me in person. Somewhere.`,
];

export const person = {
  name: 'Mladen Đurić',
  alternateName: 'MacMladen',
  jobTitle: 'Senior web developer and architect',
  tagline,
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
