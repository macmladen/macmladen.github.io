---
id: TASK-32
title: 'MM-32: Contact page'
status: Done
assignee: []
created_date: '2026-09-09 09:33'
updated_date: '2026-09-09 09:50'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . /contact/ (reserved path, from ROADMAP): h1 Contact, one short line in Mladen's voice (draft, marked), email mladen@macmladen.com as a mailto link, LinkedIn and GitHub links, a note that a form comes later. Nav gains Contact after Speaking. ContactPage JSON-LD with the Person. Sitemap includes it. ROADMAP.md: the Contact line gets MM-32 noted and its form part stays as future work.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 /contact/ renders email and the two profile links from person.ts
- [x] #2 Nav order: About, Speaking, Contact
- [x] #3 JSON-LD ContactPage parses
- [x] #4 ROADMAP.md updated; sitemap has five pages
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
`/contact/` is a new page at `src/pages/contact.astro`: h1 "Contact", one short paragraph in first person carrying `<!-- draft: Mladen to approve -->`, a definition list of the three ways to reach him, and the line "A contact form is coming."

The paragraph deliberately echoes the closing paragraph of the about text ("feel free to contact me somehow. Even better, meet me in person. Somewhere.") so the two pages sound like the same person. It is draft copy and marked as such. It sits inline in the page rather than in `person.ts`, following the home page's announcement paragraph: `person.ts` is for values that appear in both the HTML and the JSON-LD, and this one appears once.

The list is a `<dl>`: Email with a `mailto:` built from `person.email`, then LinkedIn and GitHub read from `person.profiles`, each with `rel="me"`. The two are selected by name, the way `Footer.astro` selects the profiles it has marks for; Speaker Deck is the third profile and is left out because it is a slide archive and is already linked from `/speaking/`. The visible link text is the address with the scheme stripped, derived from the same url string, so the line and the href cannot disagree.

JSON-LD: one block, `ContactPage` with `@id` `/contact/#contact`, `isPartOf` the WebSite, and `mainEntity` the Person node — the same `personNode` builder the home and about pages use, called without an image because this page renders none. `contactPageNode` was added to `src/lib/schema.ts` alongside `profilePageNode`, which it mirrors.

Styling, split by concern as everywhere else in this codebase: `.contact` is a two-column grid in `src/styles/layout.css` (placement) and `.contact dt` carries the semibold weight in `src/styles/components.css` (appearance). Three rows and two short labels, so it holds at 360px without a breakpoint. Header nav is now About, Speaking, Contact, from the same array and the same exact-match `aria-current` logic.

Documentation:

- `ROADMAP.md` — the contact item is now "Contact form on `/contact/` through the registration endpoint pattern (page: MM-32)", so only the form is left as future work; the reserved-sections item is now "`/speaking/<year>/` indexes … The `/speaking/` index itself is built (index: MM-30)".
- `docs/spec-v1.md` — the URL table gains `/speaking/` and `/contact/` as built rows, the reserved list loses both (`/speaking/<year>/` stays reserved), and the layout sentence now reads "three nav items on the right ("About", "Speaking", "Contact")" and notes that the workshop is reached from the home CTA and from the `/speaking/` index.
- The `/about/` row of that table said "story, bio, speaking history, links" and now says "the long-form story", because MM-30 and MM-31 took the other three off the page. That cell was inside the table this task had to edit; the rest of the spec was left alone.

Verification, no server started: `npm run build` clean, no warnings, five prerendered routes. `dist/client/sitemap-0.xml` lists exactly five pages. On `/contact/`: title "Contact · Mladen Đurić", canonical `https://macmladen.com/contact/`, one h1 (plus the footer's hidden h2), skip link, `header`, `nav aria-label="Main"`, one `main#main`, `footer`. The JSON-LD parses with `json.loads` as a ContactPage whose mainEntity is the Person. The dl was read out of the built HTML: `mailto:mladen@macmladen.com`, `https://rs.linkedin.com/in/macmladen` and `https://github.com/macmladen`, the last two with `rel="me"`. The draft comment survives into the built page. The nav was read out of all five built pages: About, Speaking, Contact in that order everywhere, with `aria-current="page"` on exactly the page you are on, and on none of them on the workshop page.

The built page was opened as a local file in the browser pane (a static file, no server) at 1024px and at 360px: the label/address grid holds at both, the nav wraps under the wordmark on the narrow one, and nothing overflows. The scratch copy has been deleted.

Flagged, not changed: `docs/spec-v1.md` section "2. `/about/`" still lists a "Speaking" bullet and a "Community" bullet, and the acceptance criteria still ask for "the speaking list with the Apatin and Speaker Deck links, and the community paragraph" on `/about/`. MM-30 and MM-31 removed both. Rewriting that prose is a content decision for Mladen rather than a mechanical edit, so it was left for him.

Effort: 12 tool calls including the two browser checks, about 16 minutes of agent activity, one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Contact lives at /contact/: h1, a draft-marked paragraph in Mladen's voice, a definition list with the mailto from person.email and the LinkedIn and GitHub profiles with rel="me", and the line that a form is coming. ContactPage JSON-LD with the shared Person node as mainEntity, built by a new contactPageNode in schema.ts. Nav is About, Speaking, Contact. ROADMAP now carries only the form as future work with (page: MM-32) and notes the speaking index as built (index: MM-30); the spec URL table gains both pages, the reserved list loses them, and the nav sentence names all three. Sitemap has five pages, build clean.
<!-- SECTION:FINAL_SUMMARY:END -->
