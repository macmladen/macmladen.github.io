# macmladen.com

Personal site of Mladen Đurić (MacMladen): Astro 7, static output deployed as a Cloudflare Worker with static assets, one server endpoint for the workshop registration form. English only. Spec: `docs/spec-v1.md`. Estate vision: `docs/analisys/f-2.md`.

## Working model

Discuss → agree → **green light from Mladen** → implement. Work is green-lit per milestone. The milestone procedure:

1. Start the milestone.
2. Lay the tasks in the backlog.
3. The work, per task: set In Progress → implement → check acceptance criteria → write Actual, AI cost, AI time → set Done → commit → next task.
4. Stop at the end of the milestone.
5. Brief summary.
6. Questions and dilemmas.
7. A verification plan for Mladen: URL and what to check, briefly.
8. Add tasks if needed and work them the same way.
9. When everything is done, clean up the board (done tasks to `backlog/completed/`, milestone archived, commit) and move to the next milestone.

Roles per task:
- **Fable** (main loop) — planning, orchestration, review of delegated work
- **coder** (Opus, xhigh, `.claude/agents/coder.md`) — implementation and anything needing code judgement
- **performer** (Sonnet, high, `.claude/agents/performer.md`) — research, mechanical multi-file edits, verification runs
- **judge** (Opus, high, user-level) — independent review against acceptance criteria before Mladen's review
- **scout** (Haiku, low, user-level) — pure search and inventory

Never spawn a subagent that inherits the session model; set model and effort explicitly.

## Rules

1. When something is off — unexpected result, misbehaving tool, unclear path — **ask, don't improvise workarounds**.
2. Nothing is pushed to the remote until Mladen switches the GitHub Pages source away from `master`; pushing is Mladen's hand. No DNS, no secrets, no account settings by agents. Never write an API key or token anywhere but a gitignored file Mladen created.
3. Agents never start servers or long-running processes (no `npm run dev`, `astro preview`, `wrangler dev`). Mladen starts them in his terminal and says which URL is up; agents then verify against that URL with the browser tools or curl. Agents verify what they can without a server: `npm run build`, static checks of `dist/`, unit-level scripts.
4. Don't edit unrelated code — flag it as a separate task.
5. Copy marked as draft in the source stays marked until Mladen approves it.

## Conventions

- Commits: `type [MM-nn] One-line description.` + `Co-Authored-By: <running model display name> <noreply@anthropic.com>`. Types: feat, fix, chore, docs, refactor, test. Commit in whole chunks: a coherent unit of work, whether three lines or many files; several commits per task are normal. Tasks added after the first run are referenced by name in commits and text, not by ID.
- Task lifecycle: the first step of any task is `backlog task edit <n> -s "In Progress"`; the last step is administration (tick acceptance criteria, notes with effort figures, final summary, `-s Done`) followed by the task's closing commit, so that commit contains the task file in its Done state together with the last code chunk. Never work on a task that is not In Progress.
- Tasks: every Description carries `Effort` (XS–XL), `Estimate` (h), `Actual` (h, Mladen's own time incl. thinking, review, prompting), `Billable` (no throughout, own site), `AI cost` (USD at API list price, approximate until the costing script exists), `AI time` (minutes of agent activity). Final Summary filled when done, with the raw figures the agent has (subagent tokens, durations, session reference).
- Task IDs `MM-nn` for the first run (MM-01 to MM-12), sequential, never reused.
- `docs/` — spec, decisions (`docs/decisions/`), procedures verified **here**; nothing copied from sibling projects unverified.
- Frontend: plain CSS with tokens and cascade layers per the charter summarised in `docs/spec-v1.md` (section/container model; layout and appearance separated; no bare values where a token exists). No Tailwind, no client-side framework.

## Where things live

- `backlog/` — `backlog` CLI; tasks in `backlog/tasks/`, milestones in `backlog/milestones/`.
- `src/` — Astro pages, components, layouts, styles, data (`src/data/*.ts` is the single source for content that appears in both HTML and JSON-LD).
- `public/` — `_redirects`, `_headers`, `robots.txt` inputs, `llms.txt`, static OG image, favicons.
- `migrations/` — D1 SQL; `wrangler.toml` — bindings.
- `presentations/` — legacy reveal.js decks, untouched.
- `docs/analisys/` — the 2026 web presence analyses; `docs/mail-setup.md` — MailerSend/MailerLite/Cloudflare mail status.

## Environment

- Local: plain Node, `npm run dev` (Mladen starts it). Node per `.nvmrc`. No DDEV: nothing here needs PHP or a database container.
- Production (M5): Cloudflare Worker with static assets, git-triggered Workers Build, D1 binding, secrets on the Worker. DNS on Cloudflare. Decision record: `docs/decisions/M1-DEPLOY-TARGET.md`.
- Old site: Jekyll on GitHub Pages from branch `master` of this repo's remote, CNAME macmladen.com, last built 2022. The `jekyll` branch holds it.

<!-- BACKLOG.MD GUIDELINES START -->
Tasks live in `backlog/` and are managed via the `backlog` CLI (`backlog --help`). Detailed CLI instructions trimmed deliberately for brevity — re-inject with `backlog agents --update-instructions` if needed.
<!-- BACKLOG.MD GUIDELINES END -->
