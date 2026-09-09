---
id: TASK-39
title: 'MM-39: Home intro: subheading, then paragraph with a bigger floated portrait'
status: Done
assignee: []
created_date: '2026-09-09 10:33'
updated_date: '2026-09-09 10:44'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 39000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 4 min. The home intro becomes: h1 name; the tagline as a larger grey subheading (new .subtitle--lead: --text-xl or a step above, soft ink); then the two paragraphs with the portrait floated right and bigger (about 280 px on desktop, token), text wrapping around it; on phones the portrait sits above the paragraphs. The split grid goes for this section. Container stays narrow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 At 1440 px: name, larger grey tagline, then paragraphs wrapping around a ~280 px portrait on the right
- [x] #2 At 360 px: portrait above the paragraphs, no horizontal scroll
- [x] #3 Tokens only; the emitted portrait size fits the new slot
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The intro section is one column now, not a grid. `src/pages/index.astro` drops `split split--media-right split--media-quarter` and the inner `.flow` wrapper; the container is `container container--narrow flow flow-root` and holds, in source order, the `h1`, the standfirst, the portrait, then the two paragraphs. The portrait sits before the first paragraph precisely so the float has text to wrap, and `.flow-root` closes the container over it — the same arrangement `/about/` already uses, so the two pages share one pattern rather than each having its own.

Three small additions, all tokens:

- `--width-portrait-lg: 280px` and `--weight-medium: 500` in `src/styles/tokens.css`. The weight token is new because 500 had no token and the charter forbids a bare value where the file's other weights are tokens.
- `.portrait--float-lg` in `src/styles/layout.css` sets `--width-portrait: var(--width-portrait-lg)` and nothing else, so the existing `.portrait--float` rule still owns the float, the margins and the mobile fallback, and there is one place to change if the placement ever changes.
- `.subtitle--lead` in `src/styles/components.css`: `font-size: var(--text-xl)`, `font-weight: var(--weight-medium)`. No colour — it is always used together with `.subtitle`, which already gives it `--color-ink-soft`. With MM-38 in front of it, `--text-xl` is 28 px on desktop, so the tagline sits between the 48 px name and the 18 px body.

The `<Image>` width stays at 560. Three slots had to fit: the 280 px float from 768 px up (560 is exactly 2x); the mobile block, which fills the narrow container; and the widest stacked case, a 767 px viewport where `.container--narrow` gives 720 px less the 48 px gutter, so 672 px. 560 is 0.83x of that last one on a 1x screen, which is the only place it is short, and phones and tablets that wide are effectively all 2x or 3x. Holding it at 560 also keeps one emitted file for three consumers: the home `<img>`, the `Person` node's `image` (they share `headshotOptions`, which is why the JSON-LD cannot drift from the page) and `/about/`. The reasoning is written into the comment above `headshotOptions`. The emitted file is `dist/client/_astro/mladen-head-2020.CBFjc4X-_Z10BiUh.webp`, 22,686 bytes; `dist/client/index.html` is 18,832 bytes.

Verification, no server started. `npm run build` clean, five prerendered routes; `npm test` 36 + 38 checks passing. The built `index.html` was opened in the browser pane as a local file (a copy with the two `/_astro/` sources inlined as data URIs, because a `file://` page cannot resolve a root-relative asset path; the copy was deleted afterwards).

- **1440 px.** Container 720 px wide, 672 px of content. `float` computes to `inline-end`; the portrait box is 280 x 280 with its right edge on the content edge at 1056 px. The first paragraph's lines wrap short beside it and the second paragraph runs the full 672 px below. `h1` 48 px, `.subtitle--lead` 28 px, weight 500, `rgb(68, 68, 68)`, which is `--color-ink-soft`. Container `display: flow-root`, height 532 px, so it closes over the float. `document.scrollWidth` 1440.
- **360 px.** `float` computes to `none`; the portrait is a block above both paragraphs, 312 x 312, the full width of the column. `document.scrollWidth` 360, `body.scrollWidth` 360, and no element in the body has a right edge past 360. `h1` 30.9 px, standfirst 20.4 px.

Two things worth Mladen's eye, neither changed:

- **The portrait is full-column on a phone**, 312 px at 360 px wide, rather than 280. That is not new: before this task the image was `.media` at `inline-size: 100%` in a stacked split, so it already filled the column there, and `.portrait--float` below 768 px sets no width, letting the 560 px file scale down to the container. If a capped mobile portrait is wanted instead, it is one declaration on `.portrait--float-lg`.
- **`.split--media-right` and `.split--media-quarter` are now dead.** The home intro was their only user; the workshop block uses `.split--media-first`. They are left in `src/styles/layout.css` rather than removed, on the same footing as `.credit` and `.credit-frame`, which the spec records as deliberately kept while unused. Removing them is a separate decision about the layout vocabulary.

`docs/spec-v1.md` section "Pages, 1. `/` home" now describes the one-column intro, the float and its token, the 560 px reasoning and the `.subtitle .subtitle--lead` pair instead of the old quarter-row grid; the type table's `--text-xl` row names the home standfirst alongside `h3`.

Effort: 14 tool calls including six browser measurements and two screenshots; 4 minutes wall clock from In Progress to the closing commit; one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The home intro is a single narrow column: `h1`, the tagline as `.subtitle .subtitle--lead` (`--text-xl`, `--weight-medium`, soft ink, still draft-marked), then the two paragraphs with the headshot floated to the end of the line from 768 px at `--width-portrait-lg` 280 px and stacked above them below that. `split split--media-right split--media-quarter` and the inner `.flow` wrapper are gone from `src/pages/index.astro`; the container is `container container--narrow flow flow-root`. New tokens `--width-portrait-lg: 280px` and `--weight-medium: 500`, a two-line `.portrait--float-lg` that only overrides the width token, and `.subtitle--lead` in the components layer. The `<Image>` stays at 560 px, which is 2x the floated width and one file shared with the `Person` node and `/about/`; it emits at 22,686 bytes. Measured on the built page: 280 x 280 floated with the paragraphs wrapping at 1440 px, a 312 px block above them and no horizontal scroll at 360 px. The spec's home-page section and type table match.
<!-- SECTION:FINAL_SUMMARY:END -->
