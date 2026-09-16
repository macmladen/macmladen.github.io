/** The WordCamp Belgrade 2026 workshop. Shared by the home page block, the
 *  workshop page itself and its Event JSON-LD. Venue verified on
 *  belgrade.wordcamp.org, 2026-09-08. */

/** Registration stays open through the workshop itself, so participants can
 *  be sent to the form from the stage (Mladen, 2026-09-14). It closes when the
 *  workshop ends; from that instant the form, the Register buttons and the seats
 *  lines are gone from the build and the post-event notice takes their place. */
const endsAt = '2026-09-18T13:40:00+02:00';

/** Street and city are kept apart so the PostalAddress in the JSON-LD and the
 *  visible venue line come from the same two values. */
const street = 'Makedonska 22';
const city = 'Belgrade';

/** The EN abstract, translated from the v2 description sent to the WordCamp
 *  organisers on 2026-09-13 (wordcamp-page-request.md in ~/Documents/JOBS/0905
 *  DDEV and AI Radionica WordCamp BG 2026/), which replaces the whole description
 *  on the session page. The theme-and-plugin paragraph of the first version is
 *  gone; the Invictus paragraph and the three pillars are now one.
 *  approved-pending: Mladen approves the translation (MM-79). */
/** Links and bold live in the strings (rendered with set:html), so the page,
 *  the JSON-LD description (stripped) and any future feed read one source. */
const abstract: string[] = [
  `Working with AI tools is neither hype nor a luxury — it’s a necessity if you ` +
    `want to strike the best balance between your own knowledge and experience while ` +
    `your AI collaborator does its share of the work.`,
  `In the workshop I show how I work on a current, real project for the ` +
    `Invictus gym: planning, local ` +
    `development and the procedure by which the AI tool checks and deploys code to ` +
    `the server. We rely on serious tools: the terminal, ` +
    `<a href="https://git-scm.com/">git</a> and ` +
    `<a href="https://www.docker.com/">Docker</a>. The workflow rests on ` +
    `<strong>three things</strong>: <a href="https://ddev.com/">DDEV</a>, which gives ` +
    `every project a local environment that faithfully reproduces production (the ` +
    `same PHP version, the same extensions, the same database); parallel work on ` +
    `several tasks through ` +
    `<a href="https://git-scm.com/docs/git-worktree">git worktree</a>; and an ` +
    `<strong>AI agent</strong> that doesn’t just “suggest” code but helps with ` +
    `planning, estimation and keeping a record of the work, runs checks, and spins ` +
    `up subagents that work in parallel.`,
  `The key difference from “chat” vibe-coding is <strong>the environment</strong>: ` +
    `an agent that sees the whole codebase, works where it is allowed to make ` +
    `mistakes, under version control, with a plan and acceptance criteria in place ` +
    `before anything goes further.`,
  `We go through <strong>one full loop, live</strong>, on the participants’ ` +
    `machines: environment → task with acceptance criteria → plan → the agent works ` +
    `and checks → review → code on the server. Everyone leaves with a local ` +
    `<a href="https://wordpress.org/">WordPress</a> environment in DDEV, a project ` +
    `under git, an agent set up to plan and work on their own code, and a ` +
    `<a href="https://github.com/macmladen/workshop-wp-ddev-ai">repository</a> to use ` +
    `as their own starting point.`,
];


/** Target audience, from the same v2 text, one sentence now.
 *  approved-pending: Mladen approves the translation (MM-79). */
const audience =
  `<strong>Experienced WordPress developers</strong> who want to bring AI into ` +
  `their work seriously and systematically. Familiarity with git and the command ` +
  `line is assumed; experience with Docker or DDEV is not required.`;

/** The three ways to be in the room, from the v2 text: nobody has to bring a
 *  laptop, and the page says so before the prerequisites ask for anything.
 *  approved-pending: Mladen approves the translation (MM-79). */
const waysToFollow: string[] = [
  '<strong>Work on your own laptop</strong> (a WordCamp ticket, registration here, preparation before you come)',
  '<strong>Watch</strong>, then repeat at home from the <a href="https://github.com/macmladen/workshop-wp-ddev-ai/tree/main/docs">guides</a>',
  '<strong>Just listen</strong>',
];

/** Mandatory prerequisites. DDEV is the fix the handover flagged: the submitted
 *  text lists Docker and git but the workshop runs on DDEV. */
const prerequisites: string[] = [
  '<a href="https://www.docker.com/products/docker-desktop/">Docker</a>',
  '<a href="https://ddev.com/get-started/">DDEV</a>',
  '<a href="https://git-scm.com/downloads">git</a>',
  'A <a href="https://github.com/signup">GitHub account</a>',
  'An AI tool of your choice: <a href="https://claude.com/product/claude-code">Claude Code</a>, ' +
    '<a href="https://openai.com/codex/">Codex</a> or <a href="https://cursor.com/">Cursor</a>',
];

/** The one prerequisite that stays optional. */
const optionalPrerequisite =
  'SSH access to your own hosting — optional, for the deploy part at the end.';

/** The note that closes the prerequisites: where the guides for each operating
 *  system are, and the one command to run at home so the Docker images are
 *  already downloaded when the workshop starts. Held in three parts so the
 *  command can be marked up as code on the page without the template having to
 *  cut a sentence apart.
 *  approved-pending: Mladen approves the translation (MM-79). */
const osNote = {
  before: 'Guides for <strong>macOS</strong>, <strong>Windows (WSL2)</strong> and <strong>Linux</strong> are in the repository; run',
  command: 'ddev start',
  after: 'once at home so the images download before the workshop.',
} as const;

export const workshop = {
  title: 'WordPress, Docker and AI agents — hands-on',
  date: '2026-09-18',
  start: '2026-09-18T12:20:00+02:00',
  end: endsAt,
  venue: 'Dom Omladine Beograda',
  street,
  city,
  address: `${street}, ${city}`,
  country: 'RS',
  language: 'sr',
  path: '/speaking/2026/wordcamp-belgrade-ddev-ai/',
  /** The conference itself. Kept for the Event's superEvent, which describes
   *  WordCamp Belgrade 2026 rather than this session. */
  wordcampUrl: 'https://belgrade.wordcamp.org/2026/',
  /** This session's own page on the WordCamp site. Every visible "WordCamp"
   *  link points here: a visitor following it wants the session, not the
   *  conference front page. It is also the first of the Event's sameAs. */
  /** Where a WordCamp ticket is bought; the workshop registration is not one. */
  ticketsUrl: 'https://belgrade.wordcamp.org/2026/en/tickets/',
  sessionUrl:
    'https://belgrade.wordcamp.org/2026/session/wordpress-docker-i-ai-agenti-prakticno-sr/',
  /** Working seats in the room: laptops Mladen can look after in eighty
   *  minutes. Watching does not take one, which is why /api/seats/ counts only
   *  the registrations that are not watch-only (MM-71). */
  capacity: 30,
  wordcampName: 'WordCamp Belgrade 2026',
  wordcampStart: '2026-09-18',
  wordcampEnd: '2026-09-19',
  endsAt,
  /** What the registration band says; the form is closed live from the room
   *  around this time by a rebuild, while the endpoint stays open until the end
   *  (MM-81). */
  closesLine: '2026-09-18T12:30:00+02:00',
  closesLineText: 'Friday, 18 September 2026 at 12:30',
  abstract,
  audience,
  waysToFollow,
  prerequisites,
  optionalPrerequisite,
  osNote,
  /** draft: Mladen to approve — one-sentence summary, used for the page's meta
   *  description and as the Event description in the JSON-LD. */
  summary:
    'A hands-on workshop at WordCamp Belgrade 2026: set WordPress up in DDEV, put it ' +
    'under git, and run one full loop with an AI agent that plans, checks and deploys.',
  /** The scaffolding repository: the preparation guide, the demo project and the
   *  materials. Linked from the workshop page and named in the confirmation email. */
  repoUrl: 'https://github.com/macmladen/workshop-wp-ddev-ai',
  /** The deck, in the two places it lives. Both are listed in the Resources
   *  section of the page and both are sameAs on the Event (MM-79). */
  slidesSpeakerDeck: 'https://speakerdeck.com/macmladen/wordpress-docker-and-ai-agents-workshop',
  slidesGoogle:
    'https://docs.google.com/presentation/d/1zsYWcF8TTJJivXWKn0GpL7B_lvlxO2fJ/edit?usp=sharing',
} as const;

/** True until the workshop ends. `now` is injectable for tests. Asked at
 *  render time, never at module scope: under the Cloudflare adapter a module
 *  evaluates inside workerd, where Date.now() is not the wall clock. */
export const isRegistrationOpen = (now: number = Date.now()): boolean =>
  now < Date.parse(endsAt);

/** Alias kept for the pages that gate the seats lines on it. */
export const isBeforeStart = isRegistrationOpen;

export default workshop;
