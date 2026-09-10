---
id: TASK-63
title: 'MM-63: Footer: text links row and Speaker Deck icon'
status: Done
assignee: []
created_date: '2026-09-09 20:02'
updated_date: '2026-09-09 20:17'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 30000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 7 min. Footer holds one centred row: About · Speaking · Contact, a thin vertical separator, then the LinkedIn, GitHub and Speaker Deck icons (inline SVG for Speaker Deck drawn from its logo shape, rel=me, visually hidden label). Spacing from tokens; wraps to two rows on narrow phones with the icons row second. Copyright line below.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Footer shows the three text links, a separator and three icons in one row at 768 px; wraps cleanly at 360 px; Speaker Deck has rel=me
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- `src/data/nav.ts` is new: the three section links (About, Speaking, Contact) written once. "The footer carries the same hrefs as the header" is now a property of the data rather than a rule two components have to remember. `src/components/Header.astro` imports it in place of its own local array; its markup, its `aria-current` and its styles are untouched.
- `src/components/Footer.astro`: the row is a `<nav aria-label="Footer">` around one `<ul>` — the three section links, an `aria-hidden` separator `<li>`, then the three `person.profiles` marks with `rel="me"` and a visually hidden label each. The visually hidden `<h2>Elsewhere</h2>` is gone: the landmark is named now, and "Elsewhere" stopped being true once half the row pointed at this site.
- Speaker Deck's mark is drawn in the component, not lifted from their site: a rounded frame with a diagonal band, one path on the 24 px grid with `fill-rule="evenodd"` — the frame's hole is a second subpath wound the same way as the first, and the band inside the hole is the third, which the even-odd rule paints again. `marks` is now `Record<string, { d, fillRule? }>` so one glyph can ask for even-odd without changing the other two. LinkedIn and GitHub are the same official glyph paths as before, byte for byte.
- The separator is the wrap point as well as the rule. Below 480 px it is an empty item with `flex-basis: 100%` and no border, so the marks land on a second row in one predictable place instead of wherever the words happen to run out; from 480 px it is `--space-5` tall with a `--border-width` `--color-border` inline-start edge. 480 px is the breakpoint the registration choices already use.
- Hover and focus are what they were: no underline, `--color-accent` on hover, the bar's fuchsia outline on `:focus-visible`. The copyright line is unchanged and still centred below.
- `docs/spec-v1.md`: the footer bullet under Pages 1 was rewritten, and the one-line footer description in the Layout paragraph (which still promised an `<address>` with the email) was corrected.

Verification, no server started: `npm run build` clean; `npm run check:csp` — 5 pages, 2 inline scripts, all covered. The built footer is byte-identical on all five pages (same md5), carries three `rel="me"` links, `<nav aria-label="Footer">`, `<li class="site-footer__separator" aria-hidden="true">` and `fill-rule="evenodd"` on the Speaker Deck path. Heading order after dropping the hidden h2: home h1 + h2, about h1, contact h1 + h2, speaking h1, workshop h1 + three h2 — one h1 each, nothing skipped.

Measured in the browser pane on the built `dist/client/index.html` opened as a file, viewport emulated:
- 768 px — one row, centred: About/Speaking/Contact, the 1px `rgb(204, 187, 170)` (#CBA) rule 20 px tall, then the three 40 px mark links; all vertically centred on the same line; `scrollWidth` 768.
- 480 px — still one row; `scrollWidth` 480.
- 479 px — two rows, words at 590 and marks at 628, separator collapsed to a zero-height full-width item at 620.
- 360 px — two rows, words centred (89–271 of 360), marks centred (104–256), 15 px between the rows, `scrollWidth` 360, no horizontal scroll. Same at 320 px.
The three marks were also rasterised at 120 px with sharp and inspected: LinkedIn and GitHub unchanged, the Speaker Deck frame and its diagonal band read cleanly at the size they are used.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by coder (Opus 5, xhigh): the footer is one centred row in a `<nav aria-label="Footer">` — About, Speaking, Contact, a thin vertical rule, then LinkedIn, GitHub and Speaker Deck as inline marks with `rel="me"` and visually hidden labels — with the copyright line centred below. The section links come from a new `src/data/nav.ts` that the header reads too, so the two bars cannot drift. The Speaker Deck glyph is drawn in the component, a rounded frame with a diagonal band on the 24 px grid, one path with `fill-rule="evenodd"`. The separator doubles as the wrap point: below 480 px it drops its rule and becomes a full-width flex item, which puts the marks on a second row. Measured on the built page opened as a file: one row at 768 px and at 480 px, two rows at 479, 360 and 320 px, no horizontal scroll at any of them. Build clean, check:csp clean. AI time 7 min, ~25 tool calls, one Opus 5 session.
<!-- SECTION:FINAL_SUMMARY:END -->
