/** The WordCamp Belgrade 2026 workshop. Shared by the home page block, the
 *  workshop page itself and its Event JSON-LD. Venue verified on
 *  belgrade.wordcamp.org, 2026-09-08. */

/** End of the day registration closes, in Europe/Belgrade. */
const closesAt = '2026-09-17T23:59:59+02:00';

/** The moment the workshop counts as under way: ten minutes past the scheduled
 *  start, Mladen's cut-off, so a slot that begins a few minutes late does not
 *  take the page down while people are still walking in. Everything the site
 *  offers before the event — the form, the Register buttons, the seats lines —
 *  is gone from the build after this instant. */
const startsAt = '2026-09-18T12:30:00+02:00';

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
const abstract: string[] = [
  `Working with AI tools is neither hype nor a luxury — it's a necessity if you ` +
    `want to strike the best balance between your own knowledge and experience while ` +
    `your AI collaborator does its share of the work.`,
  `In the workshop I show how I work on a current, real project for the Invictus ` +
    `gym: planning, local development and the procedure by which the AI tool checks ` +
    `and deploys code to the server. We rely on serious tools: the terminal, git and ` +
    `Docker. The workflow rests on three things: DDEV, which gives every project a ` +
    `local environment that faithfully reproduces production (the same PHP version, ` +
    `the same extensions, the same database); parallel work on several tasks through ` +
    `git worktree; and an AI agent that doesn't just "suggest" code but helps with ` +
    `planning, estimation and keeping a record of the work, runs checks, and spins up ` +
    `subagents that work in parallel.`,
  `The key difference from "chat" vibe-coding is the environment: an agent that sees ` +
    `the whole codebase, works where it is allowed to make mistakes, under version ` +
    `control, with a plan and acceptance criteria in place before anything goes further.`,
  `We go through one full loop, live, on the participants' machines: environment → ` +
    `task with acceptance criteria → plan → the agent works and checks → review → ` +
    `code on the server. Everyone leaves with a local WordPress environment in DDEV, ` +
    `a project under git, an agent set up to plan and work on their own code, and a ` +
    `repository to use as their own starting point.`,
];

/** Target audience, from the same v2 text, one sentence now.
 *  approved-pending: Mladen approves the translation (MM-79). */
const audience =
  `Experienced WordPress developers who want to bring AI into their work seriously ` +
  `and systematically. Familiarity with git and the command line is assumed; ` +
  `experience with Docker or DDEV is not required.`;

/** The three ways to be in the room, from the v2 text: nobody has to bring a
 *  laptop, and the page says so before the prerequisites ask for anything.
 *  approved-pending: Mladen approves the translation (MM-79). */
const waysToFollow: string[] = [
  'Work on your own laptop (registration required, preparation before you come)',
  'Watch, then repeat at home from the guides',
  'Just listen',
];

/** Mandatory prerequisites. DDEV is the fix the handover flagged: the submitted
 *  text lists Docker and git but the workshop runs on DDEV. */
const prerequisites: string[] = [
  'Docker',
  'DDEV',
  'git',
  'A GitHub account',
  'An AI tool of your choice: Claude Code, Codex or Cursor',
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
  before: 'Guides for macOS, Windows (WSL2) and Linux are in the repository; run',
  command: 'ddev start',
  after: 'once at home so the images download before the workshop.',
} as const;

export const workshop = {
  title: 'WordPress, Docker and AI agents — hands-on',
  date: '2026-09-18',
  start: '2026-09-18T12:20:00+02:00',
  end: '2026-09-18T13:40:00+02:00',
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
  sessionUrl:
    'https://belgrade.wordcamp.org/2026/session/wordpress-docker-i-ai-agenti-prakticno-sr/',
  /** Working seats in the room: laptops Mladen can look after in eighty
   *  minutes. Watching does not take one, which is why /api/seats/ counts only
   *  the registrations that are not watch-only (MM-71). */
  capacity: 30,
  wordcampName: 'WordCamp Belgrade 2026',
  wordcampStart: '2026-09-18',
  wordcampEnd: '2026-09-19',
  /** Date part of closesAt, so the two can never drift apart. */
  closeDate: closesAt.slice(0, 10),
  closesAt,
  startsAt,
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

/** True until the workshop is under way — see `startsAt`. `now` is injectable
 *  so the after state can be exercised without touching the clock.
 *
 *  Call this from a page or from the endpoint, never at module scope: workerd —
 *  which runs both the prerender and the deployed worker — reports Date.now() as
 *  0 while modules are being evaluated, so a constant computed up here would say
 *  "before" for ever. Verified in a build on 2026-09-08 (MM-08).
 */
export const isBeforeStart = (now: number = Date.now()): boolean =>
  now < Date.parse(startsAt);

/** True until the end of the close date, and never once the workshop has begun.
 *  The close date sits a day before the start, so the second clause is only ever
 *  load-bearing if the close date is moved again — it has moved once already
 *  (MM-62) — but it is what makes "registration is open" impossible to read as
 *  true during or after the session. Same module-scope caveat as isBeforeStart.
 */
export const isRegistrationOpen = (now: number = Date.now()): boolean =>
  now <= Date.parse(closesAt) && isBeforeStart(now);

export default workshop;
