# Roadmap

## Status: on hold from 2026-09-10

v2.1 is live and serves through WordCamp Belgrade (18 September 2026). Work on the site pauses so Mladen can focus on the workshop itself; the IA and design overhaul (v2 below) starts after the camp. Open on the board while on hold: MM-48 (one live test registration and contact message, then close), MM-49 (MailerLite `terminal` field and the confirmation automation), MM-11 (verification pass). Deploys are tagged; `git tag -l 'v*'` is the deploy log (v1.0 first Jekyll deploy 2014, v1.1 last Jekyll build 2022, v2.0 first Cloudflare deploy 2026-09-09, v2.1 refinements 2026-09-09).

To resume: read this file, `docs/notes-v1-build.md`, `AGENTS.md`, then `backlog board`.

Future work by name. An item becomes a backlog task when it is needed and gets the next MM number then; the number is written here at that moment. Nothing in the open sections has a number until that happens. Done items keep their numbers as the record.

## Done

**v1 live on macmladen.com, 2026-09-09.** Astro 7 as a Cloudflare Worker with static assets, D1, MailerLite, MailerSend, Turnstile. Five pages: home, about, speaking, contact, the WordCamp Belgrade 2026 workshop page with registration. Per-page OG cards, security headers, llms.txt, redirects, SSH keys published. GitHub Pages retired, `main` is the default branch, Dependabot clean.

- M1 Repo reset (MM-01–03): legacy Drupal/Next archived and removed, Astro scaffold, backlog and agent method, Workers-not-Pages decision.
- M2 Design system and shell (MM-04–05): tokens, cascade layers, base layout, head, header, footer, structured data, shared data.
- M3 Pages (MM-06–44): the five pages and two endpoints; sand and Koder orange (#F40) palette by decision with the ratios known; ink bars; system fonts; About text from the 2014 site with source links; contact form with topic; light only, dark palette parked.
- M4 Quality (MM-10, MM-12): generated OG images, headers with hashed inline scripts, README deploy section. MM-11 verification deferred (below).
- M5 Live (MM-45–50): Cloudflare resources, secrets, preview, custom domains, keys.
- M6 Refinements (MM-51–65): link previews, session link, facts block with map pin, section spacing, form rework (radios, checkboxes, terminal experience, copy buttons), footer nav and Speaker Deck, close date 17 September, speaking history researched from Speaker Deck, YouTube and LinkedIn (`docs/speaking-research.md`) and the Speaking page rebuilt from it, 31 appearances 2011–2026. Shipped as v2.1.

## Next, before the camp (18 September 2026)

- One live test registration and one contact message; Turnstile siteverify confirmed in the Cloudflare dashboard; MM-48 closed.
- MailerLite: `terminal` custom field; confirmation automation on the workshop group (MM-49).
- Verification pass on the live site: Lighthouse mobile on every page, forms with JavaScript off, 422 round trips (MM-11, deferred from M4).
- Draft copy approvals still marked in source: tagline, workshop teaser, meta descriptions, CTA labels, contact line, success texts.

## After the camp: v2

The feedback on v1 is "okayish"; v2 has to be considerably better. Two reference points from the planning sessions: Peter Steinberger's site (steipete.me) is hacky and playful on purpose, a template left as it is, and it reads solid because it matches him; Mayank Gupta's site (mayankgupta.com) reads very professional: one positioning sentence, "what I'm hired for" blocks with an opinion each, a timeline, dated writing, a Now page. v2 should be as deliberate as either, in Mladen's own register.

- **Design overhaul.** Keep the tokens and the charter; redo hierarchy, rhythm and the home narrative (positioning line, what I'm hired for, timeline, proof of activity). Decide a distinctive typographic or accent choice; consider warm light background kept, real photo kept, no scroll animation. A design canvas or mockups before code.
- **Data structures.** Content collections with typed frontmatter for posts, talks, work and the CV; `src/data` for facts; one source feeding pages, JSON-LD, OG cards and RSS. Decide what stays TypeScript data and what becomes Markdown.
- **Posts in Markdown** at `/writing/` with `/rss.xml`, dated, tags, reading time; first post is the rebuild story. One post a month keeps the site alive.
- **CV** at `/cv/` with a print stylesheet and a PDF export; the timeline on the home page derives from it.
- **Work** at `/work/`: three short write-ups (role, problem, decisions, outcome); community organising counts as delivery.
- **Now** page, **colophon** (how this is built and why), `/speaking/<year>/` indexes.
- **Colour-scheme switcher** (Auto, Light, Dark): built in MM-17, removed in MM-21; the measured dark palette is parked in `docs/decisions/M3-DARK-SCHEME-PARKED.md` and dormant in `src/styles/tokens.css`. Write it with `light-dark()`. Turnstile then follows the scheme.
- **Border contrast decision**: `#CBA` on sand is below 3:1 for non-text boundaries; keep as deliberate softness or raise.
- **Serbian bio block** on About if the WordCamp audience asks.
- **AI cost script**: price each task's transcript tokens at API list rates, print cost and active minutes per task, replace the approximate figures in the backlog.
- **Git-triggered deploys** (Workers Builds) instead of deploys from a developer machine.
- **Workshop follow-ups** on the site: slides and recording on the workshop page after 18 September; the registration list handed to the Koder, meetup and Razgovori follow-ups.

## Estate (other properties, see `docs/analisys/f-2.md`)

- bluefish.rs, koder.rs, razgovori.rs, the conference site: each in its own repo and session, sharing tokens and the subscribe spine.
- `/sr/` prefix on this site only if it ever goes bilingual.
