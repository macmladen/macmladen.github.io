# Spec — macmladen.com v1: home, about, one workshop page

Owner: Mladen. Implementer: worker agent. Reviewer: Fable, then Mladen.
Supersedes `spec-macmladen-site.md` in the WordCamp workshop project folder (2026-09-06 draft).
Repo: `~/Sites/macmladen` (remote `macmladen/macmladen.github.io`), branch `main`. The Drupal/Next legacy was committed (MM-01) and removed (MM-02); Astro lives at the repository root. Nothing is pushed until the GitHub Pages source is switched off master.

## What

A three-page English personal site for a senior developer and speaker, static, with two server endpoints (the workshop registration form and, since MM-36, the contact form). Small on purpose. The full estate plan (`docs/analisys/f-2.md`) stays the vision; only these three pages are built now.

Decisions taken 2026-09-07:
- Language: English only. The workshop itself is held in Serbian; the page says so in one line.
- URL hierarchy: `/speaking/<year>/<event-slug>/` is the canonical home for every appearance. Short sayable aliases redirect to the current one.
- Repo: clean Astro build at the root of this repo on `main`; legacy removed.

### Stack (fixed)
- Astro 7, `output: 'static'`, `@astrojs/cloudflare` adapter; only the two form endpoints opt out of prerendering. Deploy target: Cloudflare Workers with static assets, git-triggered Workers Build (decision: `docs/decisions/M1-DEPLOY-TARGET.md`).
- Cloudflare D1 stores registrations; local development uses wrangler's local D1.
- MailerLite API upserts each registrant as a subscriber with custom fields and a group — the mailing list, nothing more. The confirmation email itself is sent from code through MailerSend (MM-70), the same module the contact form uses. Keys and ids: see `docs/mail-setup.md`.
- MailerSend API delivers each contact message to Mladen's inbox. The domain `macmladen.com` is verified there (DKIM, SPF, return-path); keys and the smoke test: see `docs/mail-setup.md`.
- Cloudflare Turnstile on the form; locally the documented always-pass test keys.
- No CSS framework, no client-side framework, no Tailwind, no React. Plain CSS with tokens, cascade layers `reset, base, layout, components, utilities`, per `~/Sites/altervictus/docs/FRONTEND-CHARTER.md` (section/container model, layout vs appearance separated). The existing `src/styles/tokens.css` is the starting token set; adjust values, keep the names. Astro config `build.inlineStylesheets: 'always'` so the page ships one HTML file and no external CSS.
- Integrations: `@astrojs/sitemap` (with a `serialize` filter that drops non-page URLs), `astro-robots-txt`. Nothing else in v1. The sharing cards are drawn outside Astro, by a `prebuild` script using satori and sharp (both dev dependencies); Node 22.18 or newer, because that script imports the site's own `.ts` data modules and relies on type stripping.
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
| `--color-accent` | `#F40` | primary button fill, secondary button border, focus outline, bar outline | 3.05 : 1 on `#FED`, 2.61 : 1 on `#EDC` |
| `--color-accent-ink` | `#FFF` | text on the accent | 3.45 : 1 on `#F40`, 6.60 : 1 on `#A30` |
| `--color-accent-hover` | `#A30` | both buttons' hover fill, border and label | 5.82 : 1 on `#FED`, 4.98 : 1 on `#EDC`, 6.60 : 1 under `#FFF` |
| `--color-accent-muted` | `#853` | the eyebrow line above a heading, and the labels of the facts block | 5.46 : 1 on `#FED`, 4.67 : 1 on `#EDC` |
| `--color-link` | `#F40` | body link text, secondary button label | 3.05 : 1 on `#FED`, 2.61 : 1 on `#EDC`, 3.45 : 1 on `#FFF` |
| `--color-ok-bg` / `--color-ok-ink` | `#DED` / `#151` | success state | 7.4 : 1 |
| `--color-error-bg` / `--color-error-ink` | `#FDD` / `#900` | field errors | 7.1 : 1 |
| `--color-field-bg` | `#FFF` | input, select and textarea fill | |

The accent is `#F40` (chosen 2026-09-09, replacing `#909`), and it now carries every role, surface and text alike. `--color-accent` is the fill, the outline and the edge; `--color-link` holds the same `#F40` for body link text and the secondary button's label; `--color-accent-ink` is white on it. #F40 for links and button text is Mladen's decision of 2026-09-09 with the ratios known. Those ratios are 3.05 : 1 on the page, 2.61 : 1 on the alternate band and 3.45 : 1 for white on the accent — under 4.5 : 1 for text, and the earlier `#A30` link step (5.82 / 4.98) is retired from the resting state.

`--color-accent-muted` `#853` is the accent as small print — the eyebrow line and, since MM-53, the labels of the workshop page's facts block, which are the eyebrow's voice applied to a column of labels. Nothing else. The eyebrow is body-size text, so it needs 4.5 : 1, and none of the three candidates first considered reaches that on both grounds (`#C63` 3.36 / 2.87, `#B53` 4.15 / 3.55, `#A52` 4.60 / 3.93). `#853` is the lightest short hex of the same terracotta family that clears the bar on both, at 5.46 : 1 on the page and 4.67 : 1 on the alternate band, where the eyebrow actually sits.

`--color-accent-hover` `#A30` is the one darker step, and it appears only on hover: the primary button deepens its fill to it and keeps the white label at 6.60 : 1, and the secondary button darkens border and label to it together with a `--color-bg-alt` fill — at rest its border is already the accent, so a fill alone would be invisible on `.section--alt`. `--color-accent-strong` remains retired.

Scheme-independent tokens, declared once and never redefined:

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--color-bar-bg` | `#111` | header and footer bars, in every scheme | |
| `--color-bar-ink` | `#FFF` | text and links on a bar | 18.9 : 1 |
| `--color-bar-hover` | `#F40` | the outline a bar link shows on hover and focus; the accent value | 5.47 : 1 on the bar, 3.45 : 1 on the white it surrounds |
| `--color-overlay` | `rgb(0 0 0 / 0.7)` | the credit strip's scrim over a photograph | |
| `--color-overlay-ink` | `#FFF` | text on that scrim | |

Links are underlined in body text (`text-decoration-thickness` from a token, `text-underline-offset` set), never colour alone; hover keeps the colour, since link and accent are the same `#F40`, and thickens the underline from `--underline-thickness` 1 px to `--underline-thickness-strong` 2 px. Focus: a 2 px outline in `--color-accent` with a 2 px offset, on every interactive element. Inside the two bars the outline is `--color-bar-hover`, which now holds the same `#F40`; the token stays separate because the bars are declared against `--color-bar-bg`, not against the page.

Bar links are the one exception to the underline rule: they are white, underline on hover, and both hover and focus draw the outline. The header wordmark never underlines; the current nav item is marked with weight and a permanent underline rather than a colour.

**Type.** System fonts, nothing loaded over the network: `--font-body: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`; `--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace`. Headings use the body family at heavier weight (600 to 700), no display face. Every step is a `clamp()` interpolating between the same two viewport anchors, 320 px and 1120 px. The body steps keep a 1.2 ratio at both ends. The heading steps keep their 320 px values and reach further at 1120 px (MM-38), so the ratio between them opens to roughly 1.29 and 1.33 on a desktop screen while the phone is untouched:

| Token | Mobile → desktop | Use |
|---|---|---|
| `--text-base` | 1rem → 1.125rem (`clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`) | body |
| `--text-sm` | 0.875rem → 0.9375rem | meta, captions, footer |
| `--text-lg` | 1.125rem → 1.25rem | lead paragraph, h4 |
| `--text-xl` | 1.25rem → 1.75rem (`clamp(1.25rem, 1.05rem + 1vw, 1.75rem)`) | h3, home standfirst |
| `--text-2xl` | 1.5rem → 2.25rem (`clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)`) | h2 |
| `--text-3xl` | 1.875rem → 3rem (`clamp(1.875rem, 1.425rem + 2.25vw, 3rem)`) | h1 |

Line height 1.55 for body, 1.2 for headings. Reading measure is a layout concern: prose sits in `.container--narrow` (720 px), never a `max-width` on paragraphs. Vertical rhythm from the existing space scale (4 px base). Radius 4 px on inputs and buttons, nothing rounder.

**Layout.** One column on mobile. Header: name as the home link on the left, three nav items on the right ("About", "Speaking", "Contact"), no hamburger and no colour-scheme control. The workshop is reached from the home block's CTA and from the `/speaking/` index, not from the menu. Sections are full-width bands, content in `.container` (1200 px) or `.container--narrow`. Footer: one centred row — the same three nav items, a thin rule, then the three profile marks (MM-63); no `<address>` and no email.

**Prototyping.** Straight in Astro components, no separate static HTML pass. The charter's "ship CSS first" rule still applies: components carry final CSS from the first commit, and no CSS is written for content that does not exist yet.

### URL hierarchy

Built now:

| URL | What |
|---|---|
| `/` | home |
| `/about/` | the long-form story |
| `/speaking/` | the appearances index, generated from `src/data/speaking.ts` |
| `/speaking/2026/wordcamp-belgrade-ddev-ai/` | the workshop page with the registration form |
| `/contact/` | email, the profile links and the contact form |
| `/api/register` | registration form endpoint (POST only, server-rendered) |
| `/api/contact` | contact form endpoint (POST only, server-rendered) |
| `/radionica`, `/workshop` | 302 → `/speaking/2026/wordcamp-belgrade-ddev-ai/` |
| `/about`, `/about.html` | 301 → `/about/` |
| `/sitemap-index.xml`, `/robots.txt` | generated |

Reserved, not built, must not be taken by anything else: `/speaking/<year>/` indexes, `/work/`, `/writing/` and `/rss.xml`, `/now/`, `/cv/`, `/colophon/`, `/sr/` (Serbian prefix if ever bilingual). Participant deploy boxes live on a subdomain (`*.ws.macmladen.com` or similar), outside the site's path space.

Trailing-slash form is canonical for pages (`trailingSlash: 'always'`); Workers static assets normalise the other form.

### Pages

**1. `/` home.** Three sections, each a full-width `section` with a contained `container`:
- Intro: the headshot (`img/mladen_head_2020-lg.jpg` from the `jekyll` branch of this repo (`git show jekyll:img/mladen_head_2020-lg.jpg`), resized and served as WebP through Astro's image pipeline) beside two paragraphs about who Mladen is. Copy is approved (Mladen, 2026-09-08), third person, verbatim:

  > Mladen Đurić (MacMladen) is a senior developer and architect with more than two decades of building for the web, and a computing story that starts with assembly on 8-bit machines. He lives in Novi Sad, where he builds solutions for clients with WordPress and Drupal, side by side with modern technologies such as Astro, Next.js and React Native.

  > A pragmatist of the "right tool for the right job" school, he cares about performance, sustainability, and the UNIX principle of eliminating everything that is not necessary. He organises meetups, workshops and conferences, and is active in the IT community: WordPress, Drupal, JavaScript, AI.

  One column rather than a grid (MM-39): the h1, the standfirst, then the two paragraphs, with the portrait floated to the end of the line from 768 px so the text wraps around it and sitting above the paragraphs as a centred block below that. The image is `.portrait--float` widened to `--width-portrait-lg` 280 px by `.portrait--float-lg`, inside `.container--narrow` (MM-34), and the container carries `.flow-root` so it closes over the float. It is emitted once at 560 px, which is 2x the floated width and the same file the `Person` node and `/about/` point at. No "what I do" list. Under the h1 there is one standfirst line, `person.tagline` in `.subtitle .subtitle--lead` — `--text-xl` at `--weight-medium`, on the soft ink `.subtitle` already gives it (MM-39) — draft copy, marked in the source and in `src/data/person.ts`, awaiting Mladen's approval (MM-35). It supersedes the earlier "no positioning slogan" rule for that one line; `person.jobTitle` is unchanged and is still what the JSON-LD `Person` carries.
- Workshop announcement: a two-half block. Left half: `src/assets/workshop.png` — Mladen's own image of a training classroom with laptops and code on the projector screen, 1536 × 1024, supplied 2026-09-09 and replacing the stock photographs used up to MM-19. It is his, so there is no attribution and no credit overlay. Committed to the repo under `src/assets/` and served through Astro's image pipeline at 800 × 533 as WebP, with width and height, `alt` describing the room. The `.credit` and `.credit-frame` rules stay in `src/styles/components.css`, unused, for any future photograph that does need attribution. Right half: a two-line eyebrow in `--color-accent-muted` (MM-62) — "**WordCamp Belgrade 2026** · workshop", the conference name in `<strong>`, then a `<br>` and the date line "18 September · <time> · Dom Omladine Beograda" with the time from the data object, so the block reads as part of WordCamp before it reads as a date; title "WordPress, Docker and AI agents — hands-on"; a catchy two-sentence intro (drafted, marked); primary CTA button "Register for the workshop" → `/speaking/2026/wordcamp-belgrade-ddev-ai/#register`, the registration band itself rather than the top of the page (MM-62), and a secondary button labelled "WordCamp Belgrade 2026" (MM-62) → `workshop.sessionUrl`, the session's own page on the WordCamp site rather than the conference front page (MM-52). Halves stack on mobile, image first. The whole block reads from one data object (`src/data/workshop.ts`: title, date, start, end, venue, address, url, closeDate, sessionUrl, wordcampUrl, wordcampName) shared with the workshop page and its JSON-LD.
- Footer (shared component, revised 2026-09-08, rebuilt 2026-09-09 in MM-63): one centred row inside a `<nav aria-label="Footer">` — the three section links About, Speaking and Contact, read from `src/data/nav.ts` so they are the header's own list rather than a copy of it (the header marks the current page, the footer does not); a thin vertical rule (`--border-width` in `--color-border`, `--space-5` tall) on an `aria-hidden` list item; then all three profiles from `person.profiles` — LinkedIn `rs.linkedin.com/in/macmladen`, GitHub `github.com/macmladen` and Speaker Deck `speakerdeck.com/macmladen` — as inline SVG marks on a 24 px viewBox, `fill="currentColor"`, `aria-hidden`, each with a visually hidden text label and `rel="me"`. LinkedIn and GitHub are the official brand glyphs; the Speaker Deck mark is drawn in the component — a rounded frame with a diagonal band, one path with `fill-rule="evenodd"` — an approximation of its logo rather than anything lifted from their site. Below 480 px the separator stops being a rule and becomes an empty full-width flex item, which is what wraps the row into two: words first, marks second. Footer links do not underline; they turn `--color-accent` on hover and take the bar's fuchsia focus outline, as the header's do. The copyright line stays centred underneath. The brand links (Blue Fish, Koder, Razgovori) and the email are not in the footer; they stay in `src/data/person.ts` for the JSON-LD (`sameAs`, `email`). Reaching Mladen is a Contact page's job, not the footer's.

**2. `/about/`.** Narrow container. h1 "About", subtitle "This is what I do.", the portrait floated right from 768 px (above the text on phones), Mladen's thirteen-paragraph story (his 2026-09-09 copy, verbatim, with source links on named technologies and references). ProfilePage JSON-LD with the Person as mainEntity. Speaking moved to `/speaking/` (MM-30); the community paragraph was removed (MM-31). The page ends with a primary CTA button, "Request a proposal" → `/contact/?topic=website` — draft label, marked in source.

**2b. `/speaking/`.** The appearances index, generated from `src/data/speaking.ts`. The h1 is followed by one line: the "40+ events" summary — Mladen's own claim about the scale of it, which the list does not try to match — and a link to Speaker Deck. Then the one appearance that has a page of its own on this site, lifted out of its year into a `.notice` block at the top with its own register link (replaced by a plain link to the workshop page once registration closes). Below it, one `<section>` per year, newest first, each with the year as its h2 and a list of that year's appearances, newest first inside the year; the year the highlighted appearance came from is not repeated, so 2026 does not appear twice. Each entry is three lines: the title, linked when the event or session still has a page of its own; the event and the city, the city dropped when the event name already carries it (WordCamp Apatin, DrupalJam Utrecht); and a quiet row holding the kind — talk, workshop, panel, podcast or lecture — and up to two marks, a projector screen linking to the deck on Speaker Deck and a play button linking to the recording on YouTube. The marks follow the footer's pattern: one path on a 24 px grid at 20 px, `fill="currentColor"`, `aria-hidden`, each with a visually hidden name ("Slides on Speaker Deck", "Recording on YouTube") because the mark alone is not a link name. The entries themselves come from `docs/speaking-research.md` (MM-64), approved by Mladen on 2026-09-09: every confirmed or likely appearance with a deck or a recording, plus the confirmed events with neither, the two podcast guest slots as `podcast`, and the unclear DrupalCon Amsterdam 2019 row left out. Every entry in the data file carries a `source:` comment naming its research row. The page ends with the same CTA pattern as `/about/`: a primary button "Invite me to speak" → `/contact/?topic=speaking` — draft label, marked in source. The two query keys are the stored topic keys from `src/data/contact.ts`, not the visible labels, so a label may be reworded without breaking a link.

**3. `/speaking/2026/wordcamp-belgrade-ddev-ai/`.**
- Header: eyebrow "**WordCamp Belgrade 2026** · Workshop" — the conference name in `<strong>`, composed on the page from `workshop.wordcampName` rather than held as a ready-made string in the data object (MM-62) — the title, then the facts block and one link.
- The facts block is `src/components/Facts.astro` (MM-53): a `<dl class="facts">` with three labelled rows read from `src/data/workshop.ts`, the same object the `Event` JSON-LD reads. **When** — "Friday, 18 September 2026, 12:20–13:40", both ends in `<time>` with the ISO values from the data object and the visible text from `src/lib/dates.ts`, which formats everything in Europe/Belgrade. **Where** — "Dom Omladine Beograda, Makedonska 22, Belgrade" (venue verified on belgrade.wordcamp.org 2026-09-08), the venue name linking to a Google Maps search for `Dom omladine Beograda, Makedonska 22, Beograd`, preceded by an inline `aria-hidden` map-pin mark (Material Design's "place" glyph, one path on a 24 px grid, `fill="currentColor"`). A search URL rather than a place id or an embed: no key, nothing loaded into the page, and it survives Google renumbering its places. The pin sits outside the anchor, so it does not collect the link underline. **Language** — "Serbian". Labels take `--color-accent-muted` at `--text-sm`, values full `--color-ink`; the rows stack on a phone and put label beside value from 768 px, placed in the layout layer next to `.contact` and coloured in the components layer. The block is not used on the home announcement, where the single eyebrow line reads better in the narrow half of a two-half block than three labelled rows would.
- Under the block, a link "Session at WordCamp Belgrade 2026" to `workshop.sessionUrl` — the session page, not the conference front page (MM-52); `workshop.wordcampUrl` stays the conference URL and is used only by the Event's `superEvent`, while the Event carries `sameAs` the session URL.
- The EN abstract from section 2 of the handover with the two flagged fixes applied (workflow "rests on" three things; DDEV added to prerequisites).
- Prerequisites. The section opens with "It is perfectly fine if you wish to watch and participate by following and asking." (Mladen's own copy, MM-62), then the mandatory checklist: Docker, DDEV, git, a GitHub account, an AI tool of choice (Claude Code, Codex, Cursor). The line introducing the list ends "We will not have enough time to install it all in the workshop, so please follow the preparation guide on GitHub." with "preparation guide on GitHub" linking to `workshop.repoUrl` (MM-62). SSH access to your own hosting: optional, for the deploy part.
- Line: "Preparation guide and materials will be on GitHub by Friday 11 September." with a placeholder link, marked in source.
- "Registration closes Thursday, 17 September 2026." The band carries `id="register"`, which is what every "Register for the workshop" link on the site points at (MM-62). The close date is written once, as `closesAt` in `src/data/workshop.ts`; this line, `isRegistrationOpen`, the Event offer's `validThrough` and the closed-state line all derive from it, and the visible weekday is formatted in Europe/Belgrade by `src/lib/dates.ts` (MM-62). The form, fields below. Success state replaces the form inline with a short thank-you: on the list, a confirmation on its way to that address, and the preparation guide and demo project linked on GitHub (MM-70). Seats left (MM-71) is shown twice, in a `<p class="seats" data-seats>` under the facts block and another above the form: built as "30 seats", the plain size of the room, and replaced by the page's script with "N of 30 seats left" or "All 30 seats are taken; you can still register to watch" from `/api/seats/`. When none are left the script ticks the watch-only box for the visitor, which hides the laptop fields exactly as ticking it by hand does. After the close date the form is replaced by a "Registration is closed" line; the page stays as the talk's archive page for slides and recording later.
- JSON-LD `Event` (name, startDate, endDate, location, organizer, performer, url) via a ten-line `StructuredData.astro` component (pattern from `ddev/ddev.com`, `src/components/meta/StructuredData.astro`).
- Rhythm: every band on this page carries `.section--compact`, `padding-block: var(--space-12)` at all widths (MM-54). The page is one article in four bands rather than four separate stops, so the site-wide 4.5 rem / 6 rem section step pulls it apart. The modifier sits after the 768 px step in `src/styles/layout.css`, at the same specificity as `.section`, so the later rule wins — the same placement `.section--tight` relies on. The home page is untouched.
- Footer as above.

**4. `/contact/`.** Narrow container, two bands. The first is the h1 "Contact", one short line in Mladen's voice (draft, marked) and a `<dl>` with the email as a `mailto:` and the LinkedIn and GitHub profiles with `rel="me"`, all read from `src/data/person.ts`; Speaker Deck is left out because it is a slide archive and is linked from `/speaking/` instead. The second is a `.section--alt` band holding the contact form: h2 "Or write from here", one introductory line (draft, marked) and the form itself. `ContactPage` JSON-LD whose `mainEntity` is the shared Person node.

The form is `src/components/ContactForm.astro`, the same shape as `RegistrationForm.astro`: `<label for>`, `autocomplete` on name and email, `aria-describedby` for hints and errors, `aria-invalid` on failed fields, Turnstile, and a submit button. Four fields and no `<fieldset>` — there is no group of related controls to name. It renders twice, on the static page with empty props and by `/api/contact/` with the visitor's values and the server's errors. The success state, `ContactSuccess.astro`, replaces the form inline and says the message was received (not that the email arrived — delivery is recorded separately in `mail_status`).

### Form fields (names are the D1 column names)

| field | type | required |
|---|---|---|
| name | text | no |
| email | email | yes |
| github | text, GitHub username, `^[a-zA-Z0-9-]{1,39}$` when given | no |
| os | radio group "Operating system": macos / windows / linux | no |
| tool | checkbox group "AI tool": claude-code / codex / cursor / other, several allowed; the ticked values are stored in the one column, comma-joined, e.g. `claude-code,cursor` | no |
| terminal | radio group "Terminal experience": beginner / comfortable / fluent / expert, labelled "Beginner: I have pasted a command or two", "Comfortable: npm, npx and git from the terminal are routine", "Fluent: the terminal is where I work", "Expert: I have full control of the machine" (draft, marked) | no |
| ssh_key | textarea, optional; must start with `ssh-ed25519 ` or `ssh-rsa ` if present; one-line hint on how to print it | no |
| own_hosting | checkbox "I have my own hosting with SSH access" | no |
| watch_only | checkbox "I will watch, not work on my own laptop", rendered directly under email; ticking it hides every laptop field and clears their values on the server | no |
| newsletter | checkbox "Send me news about Koder workshops, meetups and the Razgovori podcast" | no, unchecked by default |

D1 table `registrations` additionally has `id`, `created_at`, `ip_hash`, `mailerlite_status` and `confirmation_status`. `terminal` arrived after the first deploy, in `migrations/0003_registrations_terminal.sql`, and `confirmation_status` in `migrations/0004_registrations_confirmation.sql`; both are therefore nullable, because the rows written before them carry no answer and a default would invent one.

Since MM-73 only `email` is required: it is where the confirmation goes and the key the duplicate check uses, and everything else is asked because it helps Mladen prepare the room. The word "required" (`.field__required`, as on the contact form) therefore marks the email label and nothing else, and no other control carries the `required` attribute. The validator looks at an optional field only when it carries a value — an empty one is an answer the visitor chose not to give, a filled one still has to be one of the answers the form offers.

The watch-only switch (MM-72) sits directly under email, in its own `.field`, because it decides whether the rest of the form is asked at all. Everything that only matters to someone bringing a laptop — the GitHub field, the operating-system and AI-tool row, the terminal group, the SSH key and the own-hosting box — is wrapped in an element carrying `data-laptop-only`, and the page's inline script sets `hidden` on those wrappers from the box's state, on load and on every change. Hidden, not emptied: what was typed comes back the moment the box is unticked. With JavaScript off nothing is hidden and every field is offered. The rule that holds either way is the server's: `dropLaptopAnswers()` in `src/lib/validate.ts` clears `github`, `os`, `tool`, `terminal`, `ssh_key` and `own_hosting` on a watch-only submission before validation, so a value the visitor can no longer see is neither stored nor sent to MailerLite, and a stale one can never fail the submission. Only a box the visitor ticked themselves clears the fields; a registration the endpoint turns into a watching one because the seats ran out keeps the answers it was given. An empty answer is stored as `NULL` in the nullable columns (`terminal`, `ssh_key`) and as an empty string in the ones `0001` declared `NOT NULL`.

### Contact form fields (names are the D1 column names)

| field | type | required |
|---|---|---|
| name | text, 1–100 characters | yes |
| email | email, up to 254 characters | yes |
| topic | select: chat / website / training / speaking, labelled "Casual chat", "We need a website", "We need training", "We are calling you as a speaker" | yes |
| message | textarea, 10–2000 characters | yes |

D1 table `messages` additionally has `id`, `created_at`, `ip_hash`, `mail_status`. Values are the stored keys and labels are display only, so a label may be reworded without rewriting rows.

### Endpoint behaviour (`/api/register`)
- Accepts POST only. Verifies Turnstile server-side. Clears the laptop answers of a watch-only submission (`dropLaptopAnswers`), then validates fields. Rejects duplicate email with a friendly message.
- Counts the seats before inserting (MM-71). At capacity a registration that asked for a working seat is stored with `watch_only = 1` and told so in the success block — never refused. The count is taken here rather than trusted from the form, because the page may have been loaded while the room still had room in it and the script that ticks the box is an enhancement. Whatever the registrant answered about their laptop is kept: they gave those answers meaning to use them, and a seat may free up.
- Inserts into D1 first. Then MailerLite: upsert subscriber with fields `name`, `github`, `os`, `tool` (the comma-joined list), `terminal`, `own_hosting`, `watch_only`, add to the group from env. Each field has to exist on the MailerLite account; one that does not is dropped silently and the call still answers 2xx. Records the outcome in `mailerlite_status`. A MailerLite failure never fails the registration.
- Then the confirmation email (MM-70), through the same MailerSend wrapper the contact form uses: `from` `no-reply@macmladen.com`, `to` the registrant, `reply_to` `person.email`, the approved subject and plain-text body built by `src/lib/confirmation.ts` from `workshop.ts` and `person.ts` — the day and hours, the venue and street, what to install, the repository link and the date the guide lands. Someone who gave no name is greeted with "Hi there". The outcome goes in `confirmation_status` (`sent`, `skipped`, `failed:<reason>`, migration `0004`); a send that fails never fails the registration, which is already written.
- Env: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`, `MAILERSEND_API_KEY`, `TURNSTILE_SECRET`, `TURNSTILE_SITE_KEY`. Locally `.dev.vars` (gitignored) with `.dev.vars.example` committed. Empty `MAILERLITE_API_KEY` skips that call, status `skipped`; empty `MAILERSEND_API_KEY` skips the confirmation the same way.
- Progressive enhancement: works without JavaScript (full-page POST, server renders success or errors back on the page URL). With JavaScript the workshop page's one inline script hides the `data-laptop-only` blocks while the watch-only box is ticked and submits the form with `fetch` and no navigation: the endpoint answers with the same rendered page, and the script lifts the part that changed out of it — the success block (`data-form-success`) into a green notice above the form, which is returned to its empty state; or the re-rendered form (`data-form-root`, field errors and typed values intact) into the page, with the general message as a red notice above it. A status with no form in it, or a failed request, leaves the form untouched under a red notice. The notice is focused and Turnstile is reset, or re-rendered when the swap brought a new container. No JavaScript is shipped on `/` or `/about/`.

### Endpoint behaviour (`/api/seats`)
- GET only, `src/pages/api/seats.ts`, `prerender = false`. A `.ts` route rather than an `.astro` one, unlike the two form targets: there is nothing to render, only three numbers. `trailingSlash: 'always'` applies to it as to a page, so the route is `/api/seats/`.
- Answers `{ capacity, taken, left }` as JSON with `Cache-Control: no-store`. `capacity` is `workshop.capacity` (30); `taken` counts the rows in `registrations` with `watch_only = 0`, because watching takes a chair and not a working seat; `left` is the difference and never goes below zero.
- A missing `DB` binding or a database that will not answer is a 503 carrying `{ error: 'unavailable' }`. The page then keeps the line it was built with, which is true whatever the endpoint says.
- Read by the workshop page's inline script only; `connect-src 'self'` already allowed it.

### Endpoint behaviour (`/api/contact`)
- Accepts POST only (GET answers 405 with `Allow: POST`). Verifies Turnstile server-side, with the same `src/lib/turnstile.ts` and the same `TURNSTILE_SECRET`, failing closed. Validates fields with `src/lib/validate-contact.ts`, a sibling of the registration validator rather than a generalisation of it. No duplicate check: the same person may write more than once.
- Inserts into D1 first, `mail_status` `'pending'`. Then MailerSend: `POST https://api.mailersend.com/v1/email` with a Bearer token, `from` `no-reply@macmladen.com`, `to` the address in `person.email`, `reply_to` the sender, subject `[macmladen.com] <topic label> from <name>`, a plain-text body, and per-message `settings.track_clicks`/`track_opens` false because the plan refuses to turn tracking off at domain level. The outcome overwrites `mail_status` as `sent`, `skipped` or `failed:<reason>`. A MailerSend failure never fails the submission — the message is already stored.
- Env: `MAILERSEND_API_KEY`, `TURNSTILE_SECRET`, `IP_HASH_SALT`, and the shared `DB` binding. Empty `MAILERSEND_API_KEY` skips the call, status `skipped`.
- Status codes: 200 success, 422 validation or a failed anti-spam check, 503 when the `DB` binding or the table is missing, 405 for anything but POST. `Cache-Control: no-store` and a `robots` `noindex` on every response.
- Progressive enhancement: works without JavaScript (full-page POST, server renders the success state or the form with its errors and the typed values preserved). `/contact/` carries Turnstile's script and one inline script of its own, which does two things: it preselects the topic from a `?topic=` query key — never overwriting a topic the visitor has already chosen, so the endpoint's re-render is safe from it — and it submits the form with `fetch` exactly as the workshop page's script does, lifting the success block or the re-rendered form out of the answer.

### Markup, SEO, machine readability
- Landmarks on every page: `header` with `nav aria-label="Main"`, one `main`, `footer`. Exactly one `h1` per page; heading levels never skip. Each section is `<section aria-labelledby>` its own heading. A skip link to `main` is the first focusable element.
- Dates in `<time datetime="2026-09-18T12:20:00+02:00">`. The workshop page is an `<article>`; prerequisites are a real `<ul>`; the form uses `<label for>`, a `<fieldset>` with a `<legend>` for each group of choices (operating system, AI tool, terminal experience, "Anything else"), `autocomplete` attributes, `aria-describedby` for hints and errors — on the fieldset itself for a group — and `aria-invalid` on failed single fields.
- Head, per page: `<title>` as "Page · Mladen Djuric" (home: "Mladen Djuric · MacMladen"), `meta description`, `link rel="canonical"`, `lang="en"`, one `meta name="theme-color"` tag (`#FED`, unconditional — the site is light in every scheme), Open Graph (`og:type` website or article, title, description, url, image with its type, width and height, `og:locale` en_US) and `twitter:card summary_large_image` with `twitter:image`. `og:image` is absolute and per page.
- Sharing cards, one per page, 1200×630: sand ground, ink title set large, the `h1`'s accent rule at six pixels, and the name and site URL along the bottom. `scripts/og.mjs` draws them with satori and sharp into `public/og/<slug>.png` before every build (`npm run og`, wired as npm's `prebuild`); the directory is generated and git-ignored. `src/data/og.ts` is the registry both ends read — the script to know what to draw, `Head.astro` to know what to name, looked up by canonical path. Card titles come from the same data objects the pages use; the home card carries the standfirst rather than repeating the name its footer line already shows. Inter (latin, 400 and 700, SIL OFL) is checked into `src/assets/fonts/` because satori needs font data and the site itself loads no fonts. Not an Astro endpoint: `@astrojs/cloudflare` prerenders inside workerd, where a route can neither read a font off disk nor call an image library.
- `rel="me"` on the LinkedIn, GitHub and Speaker Deck links in the footer, so the profiles verify back to the site.
- JSON-LD via `StructuredData.astro`, one block per page, values from the same data objects the visible content uses, never duplicated by hand:
  - `/`: `WebSite` and `Person` (name, alternateName "MacMladen", jobTitle, url, image, email, sameAs [LinkedIn, GitHub, Speaker Deck], worksFor Blue Fish, address locality Novi Sad).
  - `/about/`: `ProfilePage` whose `mainEntity` is the same `Person`.
  - `/speaking/`: `CollectionPage` whose `mainEntity` is an `ItemList` of every appearance in `src/data/speaking.ts`, in the order the page renders them (`itemListOrder` descending). Each item is an `Event` — `additionalType` `EducationEvent` for the workshops and the lectures — with the title as `name`, `startDate` the recorded day or, where the research fixes no day, the year on its own, `location` the city as a `Place`, `url` the event or session page where one exists, `sameAs` the deck and the recording, `superEvent` the event it was given at, and `performer` the Person.
  - workshop page: `Event` (additionalType `EducationEvent`) with name, description, startDate, endDate, `eventAttendanceMode` Offline, `eventStatus` Scheduled, location (Belgrade, Place, address country RS), `inLanguage` "sr", `superEvent` WordCamp Belgrade 2026 with its url, `performer` and `organizer` the Person, `offers` free with `availability` and `validThrough` the close date, and a `BreadcrumbList` Home → Speaking → 2026 → WordCamp Belgrade (breadcrumb URLs point at the reserved index paths and are the reason those paths must not be reused).
- `public/llms.txt`: the short bio verbatim from `src/data/person.ts`, the ways to reach him, and the five pages with a line each, per the llms.txt convention. `robots.txt` allows all crawlers and names the sitemap; no AI crawler is blocked.
- `public/_headers`: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera, microphone and geolocation, and a Content-Security-Policy allowing this origin, `data:` images, inline styles (the build inlines every stylesheet), Turnstile's script, iframe and callbacks, and the inline script each of `/contact/` and the workshop page carries, by `sha256` of its emitted body, with `base-uri` and `form-action` held to self and `frame-ancestors 'none'`. A hash covers whitespace, so `npm run check:csp` rehashes every inline script in `dist/client` and fails if the policy has fallen behind or a page has grown an unhashed script. HSTS is set in Cloudflare, not here. The Cloudflare adapter prepends its own `/_astro/*` `Cache-Control` rule to the file at build time.
- Images through Astro's `<Image>`: width and height set, WebP output, `loading="eager"` and `fetchpriority="high"` for the hero headshot only, `alt` text that describes, not decorates.
- Targets: Lighthouse 100 in all four categories on all five pages, mobile profile; no layout shift; no request other than the document, the images, the favicon, and Turnstile on the workshop page.

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
- [ ] `/about/` shows the subtitle, the floated portrait and the thirteen paragraphs verbatim with their links; `/speaking/` renders the appearances from `speaking.ts` grouped by year, newest first, with the current workshop on top and the deck and recording marks resolving.
- [ ] The workshop page shows the corrected EN abstract, the mandatory checklist, the GitHub placeholder line, the close date, and the form with all nine fields; the JSON-LD validates as an `Event`.
- [ ] Submitting valid data locally inserts one row into local D1 (query documented in README) and renders the inline success state.
- [ ] Missing required field, bad GitHub username, malformed SSH key, or duplicate email re-renders the form with field-level errors and preserves entered values.
- [ ] Both forms submit and validate with JavaScript disabled. `/`, `/about/` and `/speaking/` ship no script at all; the workshop page ships Turnstile and one inline script of its own (the copy buttons, and the registration form submitted with `fetch`); `/contact/` ships Turnstile and one inline script of its own (the topic preselect, and the contact form submitted with `fetch`). Those two are the only inline scripts on the site and each is in the CSP by hash. No external JavaScript anywhere except Turnstile's.
- [ ] Turnstile renders; a request without a valid token is rejected.
- [ ] Empty `MAILERLITE_API_KEY` → registration succeeds with status `skipped`; with a key the subscriber call is made with the fields above.
- [ ] With the close-date constant set in the past, the form is replaced by the closed notice.
- [ ] `_redirects`: `/radionica` and `/workshop` → the workshop page, 302; `/about` and `/about.html` → `/about/`, 301.
- [ ] `npm run build` produces the static site plus one server function, no Astro warnings; sitemap contains exactly the five pages.
- [ ] No external CSS or JS except Turnstile's script; `/` under 150 KB including the WebP headshot.
- [ ] Layout works at 360 px and 1440 px; no horizontal scroll; the intro and the announcement halves stack on mobile and sit side by side at 768 px and up.
- [ ] Every colour pair in the token table meets the stated contrast; links are underlined; every interactive element shows the focus outline.
- [ ] Each page has one `h1`, no skipped heading level, `header`/`nav`/`main`/`footer` landmarks, and a working skip link. `<time>` elements carry ISO `datetime` values.
- [ ] JSON-LD on each page parses and matches the page: `WebSite` + `Person` on `/`, `ProfilePage` on `/about/`, `Event` + `BreadcrumbList` on the workshop page. Values come from shared data objects, not duplicated literals.
- [ ] `public/llms.txt`, `public/_headers`, and `public/_redirects` exist with the stated content; `rel="me"` is present on the three profile links.
- [ ] `npm run build` writes five 1200×630 cards to `dist/client/og/`, and each page's `og:image` is the absolute URL of its own card; `npm run check:csp` passes.
- [ ] Lighthouse mobile scores 100 / 100 / 100 / 100 on all five pages against the production build served locally (`wrangler pages dev dist` or `astro preview`); report the run in the handover.
- [ ] README documents local run, deploy, D1 create/bind/migrate, secrets, CSV export, DNS change.
- [ ] `git log` shows exactly one commit; `git status` clean; no `.dev.vars` in the tree; no token values anywhere.

## Out of scope
Serbian version, blog, other sites and sections, search, the GitHub scaffold repo for the workshop, the participant VPS, the DNS change itself.
