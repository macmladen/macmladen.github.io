---
id: TASK-34
title: 'MM-34: Home intro block narrower'
status: Done
assignee: []
created_date: '2026-09-09 10:01'
updated_date: '2026-09-09 10:07'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 34000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 2 min. The home intro section uses the narrow container (720 px) instead of the full content width; portrait column stays about a quarter of the row.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 At 1440 px the intro is 720 px wide with the portrait on the right; at 360 px unchanged
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
One class added in `src/pages/index.astro`: the intro section container is now `container container--narrow split split--media-right split--media-quarter`. `.split--media-right` and `.split--media-quarter` are untouched, so the portrait keeps its place on the right and its quarter of the row; nothing was added to the stylesheets.

Measured in the browser pane against the built file (`dist/client/index.html` opened as a local file, no server):

| Viewport | Container | Text column | Portrait | Horizontal scroll |
|---|---|---|---|---|
| 1440 px | 720 px | 472 px | 168 px, on the right | none |
| 768 px | 720 px | — | 168 px, on the right | none |
| 767 px | 720 px | — | 672 px, above the text | none |
| 360 px | 360 px | 312 px | 312 px, above the text | none |

**The `<Image>` width stays at 560.** The desktop slot is now 168 CSS px, so 560 looks like three times more than needed — but the desktop slot is not what sizes this file. Below the 768 px breakpoint the halves stack and `.media` fills the column, and the widest that column ever gets is 672 px, at a 767 px viewport. The emitted 560 px file is therefore not larger than needed; it is 112 px *smaller* than the widest slot and is upscaled slightly there. Dropping the width would trade an invisible saving on desktop for a visible softening on tablets. This task in fact improved that case: with the old 1200 px container the same 767 px viewport stretched the portrait to 719 px.

The one set of options is still shared by `<Image>` and the JSON-LD `Person` node, so changing the width would also change the image the structured data points at — another reason not to move it for a desktop-only saving.

Verification, no server started: `npm run build` clean, five prerendered routes, no warnings. The built markup carries `container container--narrow split split--media-right split--media-quarter` and the same `mladen-head-2020…webp` at `width="560" height="560"`.

Flagged, not changed: the intro block is now 720 px while the workshop announcement directly under it is still 1200 px, so the two bands have visibly different measures on a wide screen. That reads as deliberate (prose narrow, announcement wide) or as a mismatch depending on taste; it is Mladen's call, and the task asked only for the intro. Also worth a look at the same time: at 168 px the home portrait is smaller than the 240 px float on `/about/`; `.split--media-quarter` could become a third if he wants them closer.

Effort: 11 tool calls including four browser measurements against the built file; 2 minutes wall clock from setting the task In Progress to this commit; one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The home intro sits in .container--narrow: 720 px at 1440 px, text 472 px, portrait 168 px on the right, and unchanged below 768 px where the halves still stack with the image first. .split--media-right and .split--media-quarter untouched, no CSS added. The <Image> width stays 560 because the stacked layout, not the desktop slot, sizes that file — the widest the portrait ever renders is 672 px at a 767 px viewport, and this change reduced that from 719 px. Measured at 1440, 768, 767 and 360 px in the browser pane against the built file; no horizontal scroll at any of them. Flagged for Mladen: the intro is now 720 px while the announcement under it is still 1200 px.
<!-- SECTION:FINAL_SUMMARY:END -->
