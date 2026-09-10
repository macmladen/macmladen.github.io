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

/** The EN abstract, from section 2 of wordcamp-belgrade-2026-workshop-handover.md
 *  in ~/Documents/JOBS/0905 DDEV and AI Radionica WordCamp BG 2026/, with the two
 *  fixes flagged there applied: the workflow "rests on" three things, and DDEV is
 *  named in the prerequisites (see `prerequisites` below). Otherwise verbatim. */
const abstract: string[] = [
  `Working with AI tools is neither hype nor a luxury — it's a necessity if you ` +
    `want to strike the best balance between your own knowledge and experience while ` +
    `your AI collaborator does its share of the work.`,
  `In this session for advanced users, I'll show you how I work on a current, ` +
    `real project for the Invictus gym using AI tools, planning, local development, ` +
    `and a procedure by which the AI tool checks and deploys code to the server.`,
  `We rely on serious tools: the terminal, git and Docker. We go through a workflow ` +
    `that rests on three things: DDEV, which gives every project its own local ` +
    `environment faithfully reproducing production (the same PHP version, the same ` +
    `extensions, the same database); parallel work on several tasks through git ` +
    `worktree; and an AI agent that doesn't just "suggest" code but also helps ` +
    `with planning, estimation and keeping a record of the work, runs checks, and ` +
    `spins up subagents that work in parallel for you.`,
  `The key difference from "chat" vibe-coding lies precisely in the environment: an ` +
    `agent that sees the whole codebase (context) and works where it is allowed to ` +
    `make mistakes — under version control, with a plan and acceptance criteria in ` +
    `place before anything goes further. That is what makes this process a good ` +
    `practice, one you adapt to your team and your project.`,
  `The workshop follows the same flow, but on the participants' own machines, so ` +
    `they can follow along, ask questions and work themselves. Everyone leaves with ` +
    `hands-on experience, a working local WordPress environment, a project under ` +
    `version control, and an agent configured to plan and work on their own code. We ` +
    `set up the project, develop a theme and a plugin with the agent, and push the ` +
    `code to the server — in real time, with everything that entails. The ` +
    `preparation, the demo project itself and the resources will be available on ` +
    `GitHub, where anyone can see how to get ready, clone it, and use it as their own ` +
    `starting point ("scaffolding").`,
];

/** Target audience, same source, verbatim. */
const audience =
  `Developers already working with WordPress who want to bring AI into their work ` +
  `seriously and systematically, not experimentally. Familiarity with git and the ` +
  `command line is assumed; experience with Docker or DDEV isn't required, but ` +
  `makes it easier to follow. Those not yet using a local environment will get a ` +
  `complete working pattern — but the talk doesn't stop there.`;

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
   *  conference front page. It is also the Event's sameAs. */
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
  prerequisites,
  optionalPrerequisite,
  /** draft: Mladen to approve — one-sentence summary, used for the page's meta
   *  description and as the Event description in the JSON-LD. */
  summary:
    'A hands-on workshop at WordCamp Belgrade 2026: set WordPress up in DDEV, put it ' +
    'under git, and run one full loop with an AI agent that plans, checks and deploys.',
  /** The scaffolding repository: the preparation guide, the demo project and the
   *  materials. Linked from the workshop page and named in the confirmation email. */
  repoUrl: 'https://github.com/macmladen/workshop-wp-ddev-ai',
  prepDeadline: 'Friday 11 September',
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
