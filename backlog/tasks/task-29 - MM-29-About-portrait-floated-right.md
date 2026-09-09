---
id: TASK-29
title: 'MM-29: About portrait floated right'
status: Done
assignee: []
created_date: '2026-09-09 09:33'
updated_date: '2026-09-09 09:42'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 4 min. On /about/ the portrait floats right of the text at 768 px and up so paragraphs wrap around it; on phones it stays above the text, centred or full width. Tokens for the float margin and width.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 At 1440 px the text wraps around the portrait on the right; at 360 px the portrait sits above the text
- [x] #2 No new bare values
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The portrait now carries `portrait portrait--float` in `src/pages/about.astro`; its `<Image>` attributes (src, width 240, height 240, densities [1,2], format webp, alt, loading lazy) are untouched, and the built `<img>` still ships `srcset` 1x/2x, `width`, `height`, `loading` and `alt`.

The placement rules live in `src/styles/layout.css`, not `components.css`: float, width and margins are placement, and the layer split in this project is by concern, not by class. `.portrait` keeps its corner radius in the components layer, exactly as `.section` reads `--section-bg` in the layout layer while `.section--alt` sets it in the components layer.

Below 768px: `display: block; margin-inline: auto` — the portrait is a block of its own above the paragraphs, centred in the column at its intrinsic 240px. From 768px, inside the file's existing `@media (min-width: 768px)` block: `float: inline-end`, `inline-size: var(--width-portrait)`, `margin-inline: var(--space-6) 0` and `margin-block-end: var(--space-4)`.

Three judgement calls:

1. A new token `--width-portrait: 240px` was added to the Layout group of `src/styles/tokens.css` rather than repeating the bare 240px the image already carries as an HTML attribute. No other bare value was introduced.
2. `float: inline-end` rather than `float: right`, for consistency with the logical properties used everywhere else in these stylesheets. Where it is not understood the portrait degrades to the mobile layout — a block above the text — which is an acceptable fallback.
3. Clearing: the page has no heading after the portrait to hang a `clear` on, so the containment is done at the container instead. A new `.flow-root { display: flow-root; }` class sits next to `.flow` in `layout.css` and is added to the about page's `container container--narrow flow` div. The float can then never spill past the end of its section. It was added as an explicit class rather than folded into `.flow` so that the change touches one page and not every `.flow` on the site.

Verification, no server started: `npm run build` clean, no warnings. In the inlined CSS of `dist/client/about/index.html` the base rule is `.portrait--float{margin-inline:auto;display:block}` and the floated rule sits inside `@media (width>=768px)`. The built page was then copied with the portrait inlined as a data URI and opened as a local file in the browser pane (a static file, no server): at 1440px the portrait sits at the right edge of the 720px reading column with the first two paragraphs wrapping around it and the third clearing underneath; at 360px it is a centred block above the text, 240px wide with a 60px inset either side of the 312px content box. Screenshots were taken at both widths; the scratch copy has been deleted.

Effort: 12 tool calls including the two browser checks, 4 minutes wall clock between the MM-31 commit and this one, one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The /about/ portrait floats to the right of the text from 768px up and stays a centred block above it below that. Placement in src/styles/layout.css (.portrait--float plus a .flow-root container class), width from a new --width-portrait token, margins from the space scale; appearance stays on .portrait in components.css. Verified in the built HTML at 1440px and 360px.
<!-- SECTION:FINAL_SUMMARY:END -->
