---
id: TASK-13
title: 'MM-13: Home intro: image on the right, half the size'
status: Done
assignee: []
created_date: '2026-09-08 19:36'
updated_date: '2026-09-08 20:29'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Estimate: 0.25 h. Actual: . Billable: no. AI cost: pending script. AI time: . In the home intro split, the headshot moves to the right of the text and its column shrinks to about half its current width (text takes the rest). Mobile keeps image first, stacked. Mladen's request 2026-09-08.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 At 1440 px the headshot sits right of the paragraphs and is about half its previous rendered width
- [x] #2 At 360 px the image is above the text
- [x] #3 No new bare values; the split gets a modifier and a width token
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
.split gained a --split-media custom property (layout.css) that names the width of
the media column; it defaults to 1fr, so the two halves stay equal for every
existing user of .split and the workshop announcement is untouched.

Two modifiers were added next to it. .split--media-right pulls the second child
ahead of the first while the halves are stacked (same rule as
.split--media-first, so they share one selector list) and resets order to 0 and
the tracks to `1fr var(--split-media)` from 768px up, which puts the media in the
second column. .split--media-quarter sets --split-media to 25%, which is where the
one literal width lives — it is the token's definition, not a bare value at a use
site.

src/pages/index.astro: the intro row is now
`container split split--media-right split--media-quarter`; the announcement row
still reads `container split split--media-first`.

Rendered widths in the 1200px container (1152px of content, 2rem gap): the media
column was (1152 - 32) / 2 = 560px and is now 25% of 1152 = 288px, so a shade over
half its previous width. Below 768px there is a single column with the image first,
unchanged.

The headshot is still generated at 560px (headshotOptions feeds both <Image> and
the Person node's image in the JSON-LD), so the 288px column now gets a roughly 2x
source. Left alone deliberately: shrinking it would change the JSON-LD image too.

Verified with npm run build (clean) and by reading dist/client/index.html: the
intro div carries the two new classes and the inlined CSS contains
.split{--split-media:1fr…}, the shared order:-1 rule, .split--media-quarter{--split-media:25%}
and the two min-width overrides.

Effort: 6 min, 9 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. The home intro headshot now sits right of the text at 768px and up and takes a quarter of the row (288px instead of 560px in the 1200px container); at 360px it is still stacked above the text. Implemented as --split-media on .split (default 1fr) plus .split--media-right and .split--media-quarter in src/styles/layout.css, applied in src/pages/index.astro. The announcement block is unchanged. Build clean, verified in dist/client/index.html. Coder (Opus): 6 min, 9 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
