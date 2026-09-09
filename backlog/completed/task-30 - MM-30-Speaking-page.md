---
id: TASK-30
title: 'MM-30: Speaking page'
status: Done
assignee: []
created_date: '2026-09-09 09:33'
updated_date: '2026-09-09 09:47'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 5 min. The speaking list moves from /about/ to its own page /speaking/ (the reserved index path): h1 Speaking, the appearances from src/data/speaking.ts newest first with links, the 40+ events line and Speaker Deck link, the current workshop highlighted with its CTA. Nav gains Speaking. Breadcrumbs on the workshop page already point at /speaking/. Sitemap includes it.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 /speaking/ renders the list from speaking.ts, newest first, with the WordCamp Belgrade 2026 entry linking to the workshop page
- [x] #2 Speaking removed from /about/; nav shows About and Speaking
- [x] #3 JSON-LD on /speaking/: a CollectionPage or ItemList built from the same data
- [x] #4 Sitemap has four pages
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
`/speaking/` is a new page at `src/pages/speaking.astro`. Astro is happy with a `speaking.astro` file beside the existing `speaking/` directory: the build emits `dist/client/speaking/index.html` and `dist/client/speaking/2026/wordcamp-belgrade-ddev-ai/index.html` side by side.

The page: h1 "Speaking", then the intro line — `summaryLine` plus "Slides on Speaker Deck", moved verbatim from `/about/` and now above the list rather than below it — then the appearances as a `ul.appearances`. Each entry renders the event with its year where there is one, the title as a link where there is a url and as plain text otherwise, and the kind. The Drupal Dev Days Burgas entry, which records neither year nor title, renders as event and kind only, exactly as the data says.

Order: newest first. The sort lives in `src/data/speaking.ts` as a new `appearancesNewestFirst` export rather than in the page, because the page and the ItemList in the JSON-LD both need it and duplicating a sort is how the two would eventually disagree. Entries with a null year sort last (`(b.year ?? 0) - (a.year ?? 0)`, on a stable sort). Rendered order: WordCamp Belgrade 2026, WordPress Meetup Vršac 2025, DrupalJam Utrecht 2024, WordCamp Apatin 2023, Drupal Dev Days Burgas.

The highlighted entry is identified by data, not by name: the one appearance whose `url` equals `workshop.path`. It gets `class="notice"` — the existing component, so the card cost no new CSS — and a CTA below the three lines. While registration is open that CTA is the `.button` "Register for the workshop"; after the close date it is a plain link reading "The workshop page", marked draft in the frontmatter.

JSON-LD: one block, `CollectionPage` with `@id` `/speaking/#speaking`, `isPartOf` the WebSite and `about` the Person, whose `mainEntity` is an `ItemList` of five ListItems in the page's own order. Built in `src/lib/schema.ts` by a new `speakingPageNode`, with a private `appearanceNode` helper; every value is read from `speaking.ts` and nothing is typed out a second time. Each item is an `Event` (`additionalType: EducationEvent` where the kind is workshop) with the talk title as `name`, the conference as `superEvent`, the year as `startDate`, the url where there is one, and `performer` the Person. `absolute()` passes external urls through unchanged, so the Apatin link stays absolute.

Header nav is now About and Speaking, from the same `nav` array and the same exact-match `aria-current` logic as before — no change to how "you are here" is decided.

`/about/` lost its Speaking section together with the `appearances`/`summaryLine` imports and the `speakerDeck` constant. Its meta description was rewritten in the same pass: the old one promised "what he speaks about" and "where he is active in the WordPress and Drupal communities", and after MM-31 and this task the page has neither. The new description is draft-marked like the old one.

Three judgement calls worth naming:

1. The kind is rendered as a visible third line ("Talk" / "Workshop") in a new `.appearances__kind` — soft ink at `--text-sm`. The label map lives in the page, not in `speaking.ts`, because it is presentation.
2. The CollectionPage `name` is plain "Speaking" rather than the `About Mladen Đurić` shape `profilePageNode` uses. The page title tag is still "Speaking · Mladen Đurić".
3. `startDate` is the bare year, e.g. "2023". That is a valid ISO 8601 date and it is all the source material records; the alternative was inventing a month and a day.

Verification, no server started: `npm run build` clean, no warnings, four prerendered routes. `dist/client/sitemap-0.xml` lists exactly four pages — `/`, `/about/`, `/speaking/`, `/speaking/2026/wordcamp-belgrade-ddev-ai/`. On `/speaking/`: one h1 (plus the footer's hidden h2), skip link, `header`, `nav aria-label="Main"`, one `main#main`, `footer`; title "Speaking · Mladen Đurić", canonical `https://macmladen.com/speaking/`. The JSON-LD block parses with `json.loads` and its five ListItems come out in the page's order. The nav was read out of all four built pages: About and Speaking everywhere, `aria-current="page"` on About only on `/about/` and on Speaking only on `/speaking/` — the workshop page marks neither, which is what exact matching gives. `/about/`'s `<main>` now holds one section, fourteen paragraphs and no list, and contains neither "Speaking" nor "appearances".

The closed state was exercised rather than assumed: with `closesAt` temporarily set to 2020, a rebuild rendered the highlighted entry with no `.button` anywhere on the page and the plain "The workshop page" link instead. `src/data/workshop.ts` was then restored with `git checkout` and confirmed unmodified before the final build.

The built page was also opened as a local file in the browser pane at 1024px (a static file, no server): the highlighted card, the button and the three-line entries all read as intended. The scratch copy has been deleted.

Effort: 18 tool calls including the closed-state rebuild and the browser check, 5 minutes wall clock between the MM-29 commit and this one, one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The speaking list has its own page at /speaking/: h1, the 40+ events line with the Speaker Deck link, and the five appearances newest first, each with event, year, title link and kind. The WordCamp Belgrade 2026 entry is a highlighted .notice card carrying the register button while registration is open and a plain link to the workshop page after it closes. Order comes from a new appearancesNewestFirst export in speaking.ts, which the CollectionPage/ItemList JSON-LD built by speakingPageNode in schema.ts also reads, so page and structured data cannot drift. Nav is About and Speaking; /about/ lost the Speaking section and its now-inaccurate description. Sitemap has four pages, build clean.
<!-- SECTION:FINAL_SUMMARY:END -->
