# Spec — macmladen.com v1: home, about, one workshop page

Owner: Mladen. Implementer: worker agent. Reviewer: Fable, then Mladen.
Supersedes `spec-macmladen-site.md` in the WordCamp workshop project folder (2026-09-06 draft).
Repo: `~/Sites/macmladen` (remote `macmladen/macmladen.github.io`), branch `main`. The Drupal/Next legacy was committed (MM-01) and removed (MM-02); Astro lives at the repository root. Nothing is pushed until the GitHub Pages source is switched off master.

## What

A three-page English personal site for a senior developer and speaker, static, with exactly one server endpoint (the workshop registration form). Small on purpose. The full estate plan (`docs/analisys/f-2.md`) stays the vision; only these three pages are built now.

Decisions taken 2026-09-07:
- Language: English only. The workshop itself is held in Serbian; the page says so in one line.
- URL hierarchy: `/speaking/<year>/<event-slug>/` is the canonical home for every appearance. Short sayable aliases redirect to the current one.
- Repo: clean Astro build at the root of this repo on `main`; legacy removed.

### Stack (fixed)
- Astro 7, `output: 'static'`, `@astrojs/cloudflare` adapter; only the form endpoint opts out of prerendering. Deploy target: Cloudflare Workers with static assets, git-triggered Workers Build (decision: `docs/decisions/M1-DEPLOY-TARGET.md`).
- Cloudflare D1 stores registrations; local development uses wrangler's local D1.
- MailerLite API upserts each registrant as a subscriber with custom fields and a group. The confirmation email is a MailerLite automation configured in the dashboard, not code. Keys and ids: see `docs/mail-setup.md`.
- Cloudflare Turnstile on the form; locally the documented always-pass test keys.
- No CSS framework, no client-side framework, no Tailwind, no React. Plain CSS with tokens, cascade layers `reset, base, layout, components, utilities`, per `~/Sites/altervictus/docs/FRONTEND-CHARTER.md` (section/container model, layout vs appearance separated). The existing `src/styles/tokens.css` is the starting token set; adjust values, keep the names. Astro config `build.inlineStylesheets: 'always'` so the page ships one HTML file and no external CSS.
- Integrations: `@astrojs/sitemap` (with a `serialize` filter that drops non-page URLs), `astro-robots-txt`. Nothing else in v1.
- `public/_redirects` (handled natively by Workers static assets, same format as Pages) holds the aliases and legacy redirects.
- Local development is plain Node: `npm run dev`. No DDEV; nothing here needs PHP or a database container (decision 2026-09-08).

### Design (fixed for v1)

Confident, plain, professional. No animation, no decoration that does not carry meaning. Mobile-first: every rule is written for 360 px and widened with `min-width` queries or `clamp()`.

**Colour.** Short hex only. Light only for now (decided 2026-09-09, replacing the three-state Auto/Light/Dark scheme built in MM-16): `:root` declares `color-scheme: light`, the site does not follow `prefers-color-scheme`, there is no scheme control and no inline script, and `<meta name="theme-color">` is one unconditional tag. The three-state scheme and its measured dark palette are parked — the palette is kept as a dormant `:root[data-theme="dark"]` block at the bottom of `src/styles/tokens.css` and written up in `docs/decisions/M3-DARK-SCHEME-PARKED.md`; the switcher is an "After launch" entry in `ROADMAP.md`.

Light scheme, on `:root`. Pairs checked against `--color-bg` unless stated:

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-bg` | `#FED` | page background, sand | |
| `--color-bg-alt` | `#EDC` | alternate section band, form fields' surroundings | |
| `--color-border` | `#CBA` | rules, input borders | 1.7 : 1, non-text separation |
| `--color-ink` | `#111` | text | 16.7 : 1 |
| `--color-ink-soft` | `#444` | secondary text, dates, captions | 8.6 : 1 |
| `--color-accent` | `#F40` | primary button fill, focus outline, bar outline, link hover | 3.05 : 1 on `#FED`, 2.61 : 1 on `#EDC` |
| `--color-accent-ink` | `#111` | text on the accent | 5.47 : 1 on `#F40` |
| `--color-link` | `#A30` | body link text, secondary button label, primary button hover fill | 5.82 : 1 on `#FED`, 4.98 : 1 on `#EDC`, 6.60 : 1 on `#FFF` |
| `--color-ok-bg` / `--color-ok-ink` | `#DED` / `#151` | success state | 7.4 : 1 |
| `--color-error-bg` / `--color-error-ink` | `#FDD` / `#900` | field errors | 7.1 : 1 |
| `--color-field-bg` | `#FFF` | input, select and textarea fill | |

The accent is `#F40` (chosen 2026-09-09, replacing `#909`), and it carries two roles rather than one ramp. **`--color-accent` is a surface and an edge** — button fill, focus outline, bar outline, link hover — where 3 : 1 is the bar it has to clear; at 3.05 : 1 on the page and 2.61 : 1 on the alternate band it is never body text on a light surface. **`--color-link` is the text role**, and it is the lightest step of the same hue ramp that clears 4.5 : 1 on *both* light surfaces: `#B30` is 5.17 / 4.42 and misses the band, `#A30` is 5.82 / 4.98 and passes. `#B20` is fractionally lighter and also passes (5.54 / 4.74), but its hue is 11° against `#F40`'s 16°, where `#A30` sits at 18° — `#A30` stays in the accent's family, which is why it wins.

`--color-accent-strong` is retired: two accent steps become one accent plus one link colour. Everything that used it now reads `--color-accent` (link hover, focus outlines) or `--color-link` (the primary button's hover fill, the secondary button's label and hover border). The primary button's hover flips its text to `--color-bg`, because `#111` falls to 2.86 : 1 on `#A30` while `#FED` reaches 5.82 : 1.

Scheme-independent tokens, declared once and never redefined:

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-bar-bg` | `#111` | header and footer bars, in every scheme | |
| `--color-bar-ink` | `#FFF` | text and links on a bar | 18.9 : 1 |
| `--color-bar-hover` | `#F40` | the outline a bar link shows on hover and focus; the accent value | 5.47 : 1 on the bar, 3.45 : 1 on the white it surrounds |
| `--color-overlay` | `rgb(0 0 0 / 0.7)` | the credit strip's scrim over a photograph | |
| `--color-overlay-ink` | `#FFF` | text on that scrim | |

Links are underlined in body text (`text-decoration-thickness` from a token, `text-underline-offset` set), never colour alone; hover moves the colour to `--color-accent` and keeps the underline. Focus: a 2 px outline in `--color-accent` with a 2 px offset, on every interactive element. Inside the two bars the outline is `--color-bar-hover`, which now holds the same `#F40`; the token stays separate because the bars are declared against `--color-bar-bg`, not against the page.

Bar links are the one exception to the underline rule: they are white, underline on hover, and both hover and focus draw the outline. The header wordmark never underlines; the current nav item is marked with weight and a permanent underline rather than a colour.

**Type.** System fonts, nothing loaded over the network: `--font-body: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; `--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace`. Headings use the body family at heavier weight (600 to 700), no display face. Fluid scale with a 1.2 ratio, so steps are noticeable but not dramatic:

| Token | Mobile → desktop | Use |
|---|---|---|
| `--text-base` | 1rem → 1.125rem (`clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`) | body |
| `--text-sm` | 0.875rem → 0.9375rem | meta, captions, footer |
| `--text-lg` | 1.125rem → 1.25rem | lead paragraph, h4 |
| `--text-xl` | 1.25rem → 1.5rem | h3 |
| `--text-2xl` | 1.5rem → 1.875rem | h2 |
| `--text-3xl` | 1.875rem → 2.5rem | h1 |

Line height 1.55 for body, 1.2 for headings. Reading measure is a layout concern: prose sits in `.container--narrow` (720 px), never a `max-width` on paragraphs. Vertical rhythm from the existing space scale (4 px base). Radius 4 px on inputs and buttons, nothing rounder.

**Layout.** One column on mobile. Header: name as the home link on the left, one nav item on the right ("About"), no hamburger and no colour-scheme control. The workshop is reached from the home block's CTA, not from the menu. Sections are full-width bands, content in `.container` (1200 px) or `.container--narrow`. Footer: link list plus `<address>` with the email.

**Prototyping.** Straight in Astro components, no separate static HTML pass. The charter's "ship CSS first" rule still applies: components carry final CSS from the first commit, and no CSS is written for content that does not exist yet.

### URL hierarchy

Built now:

| URL | What |
|---|---|
| `/` | home |
| `/about/` | story, bio, speaking history, links |
| `/speaking/2026/wordcamp-belgrade-ddev-ai/` | the workshop page with the registration form |
| `/api/register` | form endpoint (POST only, server-rendered) |
| `/radionica`, `/workshop` | 302 → `/speaking/2026/wordcamp-belgrade-ddev-ai/` |
| `/about`, `/about.html` | 301 → `/about/` |
| `/sitemap-index.xml`, `/robots.txt` | generated |

Reserved, not built, must not be taken by anything else: `/speaking/` and `/speaking/<year>/` indexes, `/work/`, `/writing/` and `/rss.xml`, `/now/`, `/cv/`, `/contact/`, `/colophon/`, `/sr/` (Serbian prefix if ever bilingual). Participant deploy boxes live on a subdomain (`*.ws.macmladen.com` or similar), outside the site's path space.

Trailing-slash form is canonical for pages (`trailingSlash: 'always'`); Workers static assets normalise the other form.

### Pages

**1. `/` home.** Three sections, each a full-width `section` with a contained `container`:
- Intro: the headshot (`img/mladen_head_2020-lg.jpg` from the `jekyll` branch of this repo (`git show jekyll:img/mladen_head_2020-lg.jpg`), resized and served as WebP through Astro's image pipeline) beside two paragraphs about who Mladen is. Copy is approved (Mladen, 2026-09-08), third person, verbatim:

  > Mladen Đurić (MacMladen) is a senior developer and architect with more than two decades of building for the web, and a computing story that starts with assembly on 8-bit machines. He lives in Novi Sad, where he builds solutions for clients with WordPress and Drupal, side by side with modern technologies such as Astro, Next.js and React Native.

  > A pragmatist of the "right tool for the right job" school, he cares about performance, sustainability, and the UNIX principle of eliminating everything that is not necessary. He organises meetups, workshops and conferences, and is active in the IT community: WordPress, Drupal, JavaScript, AI.

  Image left, text right at 768 px and up; stacked on mobile with the image first. No positioning slogan, no "what I do" list.
- Workshop announcement: a two-half block. Left half: `src/assets/workshop.png` — Mladen's own image of a training classroom with laptops and code on the projector screen, 1536 × 1024, supplied 2026-09-09 and replacing the stock photographs used up to MM-19. It is his, so there is no attribution and no credit overlay. Committed to the repo under `src/assets/` and served through Astro's image pipeline at 800 × 533 as WebP, with width and height, `alt` describing the room. The `.credit` and `.credit-frame` rules stay in `src/styles/components.css`, unused, for any future photograph that does need attribution. Right half: eyebrow line "18 September · <time> · Dom Omladine Beograda" in `--color-ink-soft` with the time from the data object; title "WordPress, Docker and AI agents — hands-on"; a catchy two-sentence intro (drafted, marked); primary CTA button "Register for the workshop" → `/speaking/2026/wordcamp-belgrade-ddev-ai/`. Halves stack on mobile, image first. The whole block reads from one data object (`src/data/workshop.ts`: title, date, start, end, venue, address, url, closeDate, wordcampUrl) shared with the workshop page and its JSON-LD.
- Footer (shared component, revised 2026-09-08): two centred icon links only — LinkedIn `rs.linkedin.com/in/macmladen` and GitHub `github.com/macmladen` — as inline SVG brand marks on a 24 px viewBox, `fill="currentColor"`, `aria-hidden`, each with a visually hidden text label and `rel="me"`; the copyright line centred under them. Speaker Deck, the brand links (Blue Fish, Koder, Razgovori) and the email are no longer in the footer; they stay in `src/data/person.ts` for the JSON-LD (`sameAs`, `email`). Reaching Mladen is a Contact page's job, not the footer's.

**2. `/about/`.** Narrow container for the reading text.
- Headshot, then the body text of the 2014 site's about page verbatim (MM-20, decided 2026-09-09): thirteen paragraphs recovered with `git show jekyll:about.html`, front matter and `<p>` wrappers stripped and nothing else changed, including the original's `<em>`, `<strong>` and the Ruby `gem` as `<code>`. They live in `src/data/person.ts` as `about: string[]` and render with `set:html`. It is Mladen's own copy, so it carries no draft marker and its typos stand. This replaces the EN bio from section 6 of `wordcamp-belgrade-2026-workshop-handover.md` on the page; that bio stays in `person.ts` as `bio`.
- "Speaking": WordCamp Apatin 2023 "WordPress with Cloudflare CDN" (link `https://apatin.wordcamp.org/2023/session/wordpress-with-cloudflare-cdn/`), DrupalJam Utrecht 2024, Drupal Dev Days Burgas, WordPress Meetup Vršac 2025 "Decoupled WordPress — architecture and challenges", plus the line "40+ events in Novi Sad, Subotica, Zagreb, Amsterdam, Prague, Varna, Utrecht, Burgas", and the Speaker Deck link. The list is a data array in one file so `/speaking/` can be generated from it later.
- "Community": DaFED founder, Drupal Camp Novi Sad organiser, Drupal meetup, WordPress and Drupal communities. One short paragraph.
- Footer as above.

**3. `/speaking/2026/wordcamp-belgrade-ddev-ai/`.**
- Header: title, "Workshop · WordCamp Belgrade 2026", date and time from the shared data object, "Dom Omladine Beograda, Makedonska 22, Belgrade" (venue verified on belgrade.wordcamp.org 2026-09-08), "Held in Serbian". Link to the WordCamp site.
- The EN abstract from section 2 of the handover with the two flagged fixes applied (workflow "rests on" three things; DDEV added to prerequisites).
- Prerequisites as a mandatory checklist: Docker, DDEV, git, a GitHub account, an AI tool of choice (Claude Code, Codex, Cursor). SSH access to your own hosting: optional, for the deploy part.
- Line: "Preparation guide and materials will be on GitHub by Friday 11 September." with a placeholder link, marked in source.
- "Registration closes Tuesday 15 September." The form, fields below. Success state replaces the form inline with a thank-you saying a confirmation email is on its way. After the close date (a constant in the page's data object) the form is replaced by a "Registration is closed" line; the page stays as the talk's archive page for slides and recording later.
- JSON-LD `Event` (name, startDate, endDate, location, organizer, performer, url) via a ten-line `StructuredData.astro` component (pattern from `ddev/ddev.com`, `src/components/meta/StructuredData.astro`).
- Footer as above.

### Form fields (names are the D1 column names)

| field | type | required |
|---|---|---|
| name | text | yes |
| email | email | yes |
| github | text, GitHub username, `^[a-zA-Z0-9-]{1,39}$` | yes |
| os | select: macos / windows / linux | yes |
| tool | select: claude-code / codex / cursor / other | yes |
| ssh_key | textarea, optional; must start with `ssh-ed25519 ` or `ssh-rsa ` if present; one-line hint on how to print it | no |
| own_hosting | checkbox "I have my own hosting with SSH access" | no |
| watch_only | checkbox "I will watch, not work on my own laptop" | no |
| newsletter | checkbox "Send me news about Koder workshops, meetups and the Razgovori podcast" | no, unchecked by default |

D1 table `registrations` additionally has `id`, `created_at`, `ip_hash`, `mailerlite_status`.

### Endpoint behaviour (`/api/register`)
- Accepts POST only. Verifies Turnstile server-side. Validates fields. Rejects duplicate email with a friendly message.
- Inserts into D1 first. Then MailerLite: upsert subscriber with fields `name`, `github`, `os`, `tool`, `own_hosting`, `watch_only`, add to the group from env. Records the outcome in `mailerlite_status`. A MailerLite failure never fails the registration.
- Env: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`, `TURNSTILE_SECRET`, `TURNSTILE_SITE_KEY`. Locally `.dev.vars` (gitignored) with `.dev.vars.example` committed. Empty `MAILERLITE_API_KEY` skips the call, status `skipped`.
- Progressive enhancement: works without JavaScript (full-page POST, server renders success or errors back on the page URL). A small inline script may enhance it. No JavaScript is shipped on `/` or `/about/`.

### Markup, SEO, machine readability
- Landmarks on every page: `header` with `nav aria-label="Main"`, one `main`, `footer`. Exactly one `h1` per page; heading levels never skip. Each section is `<section aria-labelledby>` its own heading. A skip link to `main` is the first focusable element.
- Dates in `<time datetime="2026-09-18T12:20:00+02:00">`. The workshop page is an `<article>`; prerequisites are a real `<ul>`; the form uses `<label for>`, `<fieldset>` for the checkbox group, `autocomplete` attributes, `aria-describedby` for hints and errors, and `aria-invalid` on failed fields.
- Head, per page: `<title>` as "Page · Mladen Đurić" (home: "Mladen Đurić · MacMladen"), `meta description`, `link rel="canonical"`, `lang="en"`, one `meta name="theme-color"` tag (`#FED`, unconditional — the site is light in every scheme), Open Graph (`og:type` website or article, title, description, url, image, `og:locale` en_US) and `twitter:card summary_large_image`. One static OG image `public/og.png` (1200×630, name and positioning line) for v1; per-page generation is reserved.
- `rel="me"` on the LinkedIn, GitHub and Speaker Deck links in the footer, so the profiles verify back to the site.
- JSON-LD via `StructuredData.astro`, one block per page, values from the same data objects the visible content uses, never duplicated by hand:
  - `/`: `WebSite` and `Person` (name, alternateName "MacMladen", jobTitle, url, image, email, sameAs [LinkedIn, GitHub, Speaker Deck], worksFor Blue Fish, address locality Novi Sad).
  - `/about/`: `ProfilePage` whose `mainEntity` is the same `Person`.
  - workshop page: `Event` (additionalType `EducationEvent`) with name, description, startDate, endDate, `eventAttendanceMode` Offline, `eventStatus` Scheduled, location (Belgrade, Place, address country RS), `inLanguage` "sr", `superEvent` WordCamp Belgrade 2026 with its url, `performer` and `organizer` the Person, `offers` free with `availability` and `validThrough` the close date, and a `BreadcrumbList` Home → Speaking → 2026 → WordCamp Belgrade (breadcrumb URLs point at the reserved index paths and are the reason those paths must not be reused).
- `public/llms.txt`: a short plain-text description of who Mladen is and links to the three pages, per the llms.txt convention. `robots.txt` allows all crawlers and names the sitemap; no AI crawler is blocked.
- `public/_headers`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera, microphone and geolocation, and a Content-Security-Policy that allows only self, inline styles, and the Turnstile script and frame. HSTS is set in Cloudflare, not here.
- Images through Astro's `<Image>`: width and height set, WebP output, `loading="eager"` and `fetchpriority="high"` for the hero headshot only, `alt` text that describes, not decorates.
- Targets: Lighthouse 100 in all four categories on all three pages, mobile profile; no layout shift; no request other than the document, the images, the favicon, and Turnstile on the workshop page.

### Working method (as on Neusatz)
- `AGENTS.md` at the root (with `CLAUDE.md` containing `@AGENTS.md`): working model, roles, rules, conventions, where things live. Task IDs `MM-nn`, sequential, never reused. Commits `type [MM-nn] One-line description.` with `Co-Authored-By`. Every task description carries `Effort`, `Estimate`, `Actual`, `Billable` (this is Mladen's own site: `Billable: no` throughout), plus `AI cost (USD list)` and `AI time (min)` recorded at completion from the figures available, marked approximate until the costing script exists.
- `backlog/` managed with the `backlog` CLI (`backlog init`, tasks in `backlog/tasks/`, milestones in `backlog/milestones/`). Milestone M1 "v1 live for registration" holds the tasks; each task has acceptance criteria copied from this spec; the agent marks them as it goes and fills the final summary.
- Project agents in `.claude/agents/`: `coder` (Opus, xhigh) for implementation, `performer` (Sonnet, high) for research and mechanical work; `judge` (user-level, Opus) reviews the finished build against the acceptance criteria before Mladen does. No subagent inherits the session model.
- `docs/` holds this spec, decisions made during the build (`docs/decisions/`), and the deploy procedure once verified here.

### Repo hygiene
- `README.md`: run locally (`npm run dev`), deploy as a Cloudflare Worker with static assets, create and bind D1, run migrations, export registrations to CSV with one wrangler command, which secrets to set where, and the DNS change (Workers custom domain for `macmladen.com` and `www`) as the last step. No secrets in the repo, ever.
- `wrangler.toml` with the D1 binding; `migrations/0001_registrations.sql`.
- `CLAUDE.md` with process guardrails: never run the dev server in agent mode, never change DNS or secrets, never publish content Mladen has not approved, and a task→file map for the recurring tasks (edit the workshop block, add a speaking entry, add a redirect).
- `.gitignore`, `.editorconfig`, `.nvmrc`.
- Git initialised; one commit at the end: `feat: macmladen.com v1 — home, about, WordCamp Belgrade 2026 workshop page`.

## Acceptance criteria
- [ ] `npm run dev` serves `/`, `/about/`, `/speaking/2026/wordcamp-belgrade-ddev-ai/` locally; `ddev start` does the same under DDEV.
- [ ] `/` shows intro, workshop announcement and footer in order; the announcement carries the classroom image with no credit overlay, eyebrow, title, intro and CTA to the workshop page; every footer link resolves to the stated URL.
- [ ] `/about/` shows headshot, the thirteen paragraphs of the 2014 about text verbatim and in order, the speaking list with the Apatin and Speaker Deck links, and the community paragraph.
- [ ] The workshop page shows the corrected EN abstract, the mandatory checklist, the GitHub placeholder line, the close date, and the form with all nine fields; the JSON-LD validates as an `Event`.
- [ ] Submitting valid data locally inserts one row into local D1 (query documented in README) and renders the inline success state.
- [ ] Missing required field, bad GitHub username, malformed SSH key, or duplicate email re-renders the form with field-level errors and preserves entered values.
- [ ] Form submits and validates with JavaScript disabled. `/` and `/about/` ship no script at all; the workshop page ships only Turnstile. No external JavaScript anywhere.
- [ ] Turnstile renders; a request without a valid token is rejected.
- [ ] Empty `MAILERLITE_API_KEY` → registration succeeds with status `skipped`; with a key the subscriber call is made with the fields above.
- [ ] With the close-date constant set in the past, the form is replaced by the closed notice.
- [ ] `_redirects`: `/radionica` and `/workshop` → the workshop page; `/about` and `/about.html` → `/about/`.
- [ ] `npm run build` produces the static site plus one server function, no Astro warnings; sitemap contains exactly the three pages.
- [ ] No external CSS or JS except Turnstile's script; `/` under 150 KB including the WebP headshot.
- [ ] Layout works at 360 px and 1440 px; no horizontal scroll; the intro and the announcement halves stack on mobile and sit side by side at 768 px and up.
- [ ] Every colour pair in the token table meets the stated contrast; links are underlined; every interactive element shows the focus outline.
- [ ] Each page has one `h1`, no skipped heading level, `header`/`nav`/`main`/`footer` landmarks, and a working skip link. `<time>` elements carry ISO `datetime` values.
- [ ] JSON-LD on each page parses and matches the page: `WebSite` + `Person` on `/`, `ProfilePage` on `/about/`, `Event` + `BreadcrumbList` on the workshop page. Values come from shared data objects, not duplicated literals.
- [ ] `public/llms.txt`, `public/_headers`, and `public/_redirects` exist with the stated content; `rel="me"` is present on the three profile links.
- [ ] Lighthouse mobile scores 100 / 100 / 100 / 100 on all three pages against the production build served locally (`wrangler pages dev dist` or `astro preview`); report the run in the handover.
- [ ] README documents local run, deploy, D1 create/bind/migrate, secrets, CSV export, DNS change.
- [ ] `git log` shows exactly one commit; `git status` clean; no `.dev.vars` in the tree; no token values anywhere.

## Out of scope
Serbian version, blog, other sites and sections, per-page OG images, search, the confirmation email copy (MailerLite), the GitHub scaffold repo for the workshop, the participant VPS, the DNS change itself.
