# Notes from the v1 build, 7–9 September 2026

What was discussed and decided while building macmladen.com v1, beyond what the spec and the decision records hold. The spec (`spec-v1.md`) is the what; `decisions/` holds the two architecture decisions; this is the rest, so a later session does not rediscover it.

## Why v1 is what it is

- Deadline: WordCamp Belgrade, Friday 18 September 2026, where Mladen gives the workshop "WordPress, Docker i AI agenti — praktično"; registration for it had to open on Monday 8 September. The site is the registration's home, so v1 was scoped to three pages and grew to five in the same week.
- Language: English only. The Serbian market is small, recruiters at home and abroad read English. Blue Fish may be bilingual later; this site not.
- URL hierarchy: `/speaking/<year>/<event-slug>/` is the canonical home of every appearance; `/radionica` and `/workshop` are sayable aliases that redirect to the current one. Reserved paths are listed in the spec and must not be reused.
- Deploy: Cloudflare Worker with static assets, not Pages (`decisions/M1-DEPLOY-TARGET.md`). GitHub Pages, which served the 2014 Jekyll site from `master`, was unpublished after the domain moved; `master` deleted, `main` is the default, the `jekyll` branch and the `archive/main-2023` tag keep history.
- No DDEV: nothing here needs PHP or a database container; DDEV's port mapping and file sync broke the host dev server twice and was removed.

## Design decisions and their reasons

- Sand background (#FED), near-black text (#111), Koder orange (#F40) for links, buttons and the h1 rule. #F40 measures 3.05:1 on the sand; Mladen chose it with the ratios known (spec, 2026-09-09). Eyebrow in a muted terracotta (#853) because no lighter orange reaches 4.5:1 on the alternate band. Inline code in the terminal's maroon (#A22).
- System font stack, no web fonts: the single biggest speed win. Headings are the body face at heavier weight; h1 36 to 58 px, h2 to 36, h3 to 28 on desktop.
- Ink bars (#111) for header and footer with white links; hover is an orange underline in the nav and orange icons in the footer; no hover outlines anywhere; keyboard focus keeps the outline.
- Light only in v1. A three-state switcher was built and removed; the dark palette is measured and parked.
- Home: name, tagline, two approved paragraphs (third person, Mladen's choice) wrapping a 280 px floated portrait, then the workshop announcement with Mladen's own AI-generated classroom image (credit "Image: AI-generated (OpenAI)").
- About: Mladen's 2014 text, corrected by him, thirteen paragraphs, 29 source links, portrait floated right.

## References weighed

- steipete.me: hacky and playful on purpose, a template left as it is; it reads solid because it matches its owner. Worth taking: CLAUDE.md process guardrails, OG generation without a browser, tokens under a data-theme attribute.
- ddev.com: `_redirects`, a ten-line JSON-LD component, link validation at build.
- mayankgupta.com: very professional; the structure to learn from (positioning line, "what I'm hired for" with an opinion each, timeline, dated writing, Now page), not the template look.
- Feedback on v1 after launch: "kinda okayish". v2 must be considerably better; see ROADMAP.md.

## Working method

- Milestones and MM-numbered tasks in `backlog/`; the procedure is in AGENTS.md. Task IDs are assigned at creation; future work lives in ROADMAP.md by name.
- Agents never start servers or deploy; Mladen checks the build locally and gives the word. Pushing is his hand too, though a plain fast-forward push by an agent is fine once the remote is safe.
- Effort tracking: `Actual` is Mladen's own time; `AI time` is measured agent minutes; `AI cost` at API list price waits for the costing script.
- The Cloudflare auto-mode classifier blocks some production writes for agents (remote D1 migrations, Turnstile widget creation, DNS record deletion, force pushes); those are Mladen's commands, listed in README.

## Registration and mail

- Registrations go to D1 (`registrations`), then MailerLite (group "WordCamp Belgrade 2026 workshop", id 198135774424598339) with custom fields name, github, os, tool (comma-joined), own_hosting, watch_only, terminal; MailerLite must have a `terminal` field or the API drops it silently. The confirmation email is a MailerLite automation (to be built).
- Contact messages go to D1 (`messages`) and MailerSend to mladen@macmladen.com from no-reply@macmladen.com with Reply-To the sender.
- Registration closes Thursday 17 September 2026 (Mladen's decision; the earlier plan closed on the 15th to leave provisioning time).
- Cloudflare's Turnstile dashboard warns "siteverify isn't being called" until the first real submission.

## Open at the time of writing

- One test registration and one contact message on the live site (MM-48).
- MailerLite `terminal` field and the confirmation automation (MM-49).
- Draft copy still marked in source: tagline, workshop teaser, meta descriptions, CTA labels, contact line, success texts.
- Lighthouse and the deferred verification (MM-11).
