---
id: TASK-54
title: 'MM-54: Workshop page section spacing 3rem'
status: Done
assignee: []
created_date: '2026-09-09 14:09'
updated_date: '2026-09-09 14:13'
labels:
  - fix
milestone: m-5
dependencies: []
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 5 min. Sections on the workshop page get padding-block --space-12 (3rem) at all widths via a .section--compact modifier applied on that page only; home keeps its spacing.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Workshop page sections measure 3rem padding at 360 and 1440 px; home unchanged
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Done 2026-09-09. .section--compact { padding-block: var(--space-12) } added to src/styles/layout.css immediately after .section--tight, i.e. after the @media (min-width: 768px) block, so at equal specificity the later rule wins and 3rem holds at every width. Applied to all four sections of src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro (workshop, audience, prerequisites, registration); the registration band keeps .section--alt alongside it. Home page markup untouched: its two sections are still .section and .section .section--alt .section--tight. Spec Page 3 gained a Rhythm bullet. Verified in the built HTML (CSS is inlined, no external stylesheet): .section--compact{padding-block:var(--space-12)} is emitted after the 768px media block inside the layout layer. AI time 5 min, 8 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09: workshop page bands run at 3rem padding-block at all widths through .section--compact; home unchanged. Build clean, ordering confirmed in the emitted CSS. AI time 5 min, 10 tool calls.
<!-- SECTION:FINAL_SUMMARY:END -->
