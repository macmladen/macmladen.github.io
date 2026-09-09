---
id: TASK-23
title: 'MM-23: Announcement image credit line'
status: Done
assignee: []
created_date: '2026-09-09 07:33'
updated_date: '2026-09-09 07:38'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Estimate: 0.25 h. Actual: . Billable: no. AI cost: pending script. AI time: 4 min. Restore a small credit strip on the announcement image with the text: Image: AI-generated (OpenAI). No link.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Credit strip shows the text on the classroom image at both widths
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
CHANGED

- `src/pages/index.astro`: the announcement `<Image>` is wrapped in
  `<figure class="credit-frame">` and followed by
  `<figcaption class="credit">Image: AI-generated (OpenAI)</figcaption>`.
  No link, no brand, no title attribute. The figure takes the image's place
  as the second grid child of `.split--media-first`, so the
  `> :nth-child(2) { order: -1 }` rule still puts the media first.
- `src/styles/components.css`: the `.credit a` rule is removed. Nothing in
  the source puts a link inside a credit strip any more, so it was dead. The
  block comment above `.credit-frame` now records the figure/figcaption
  structure and the scrim's contrast.

CONTRAST ON THE SCRIM (the task's second half)

`.credit` still reads `--color-overlay` `rgb(0 0 0 / 0.7)` and
`--color-overlay-ink` `#FFF`, and MM-22 touched neither: they sit in the
scheme-independent group of `src/styles/tokens.css`, not in the accent
group. Worst case is a fully white photograph under the scrim, which
composites to `#4D4D4D`; white on that is 8.45:1. Any darker pixel gives
more. So the strip reads regardless of what MM-22 did to the accent.

VERIFIED (`npm run build` clean)

- `dist/client/index.html` contains
  `<figure class="credit-frame"><img ... class="media"><figcaption class="credit">Image: AI-generated (OpenAI)</figcaption></figure>`.
- The inlined CSS carries `.credit-frame{position:relative}` and the full
  `.credit` rule; `.credit a` is absent from the built output.
- Both widths: `.credit` is absolutely positioned at the bottom-right inset
  of the figure and shrink-to-fit, so it does not depend on the breakpoint.
  At 360 px the media column is 360 - 2 x 24 px gutter = 312 px and the strip
  is roughly 215 px (28 characters at `--text-sm` plus `--space-3` either
  side), so it fits without wrapping or overflow. Not checked visually — no
  server was started; the visual pass is in Mladen's verification list.

Effort: 4 min, 6 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. The announcement image on the home page is back inside a figure with a credit strip. src/pages/index.astro wraps the workshop <Image> in <figure class="credit-frame"> and adds <figcaption class="credit">Image: AI-generated (OpenAI)</figcaption>, with no link; the figure keeps the image's position as the second grid child so .split--media-first still leads with the media. src/styles/components.css loses the now-dead .credit a rule and gains a comment recording the structure and the scrim's contrast. The strip's colours are untouched by MM-22: --color-overlay and --color-overlay-ink are scheme-independent tokens, and white on a 70% black scrim is 8.45:1 even over a white photograph. Verified on the built output: the figure, image and figcaption are in dist/client/index.html, the .credit rules are in the inlined CSS, and .credit a is gone. The strip is absolutely positioned and shrink-to-fit, so it behaves the same at both widths; at 360 px it is roughly 215 px inside a 312 px column. Not checked visually, as no server was started. Coder (Opus): 4 min, 6 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
