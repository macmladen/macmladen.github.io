---
id: TASK-40
title: 'MM-40: Bigger H1 with a thin orange underline'
status: Done
assignee: []
created_date: '2026-09-09 10:55'
updated_date: '2026-09-09 10:56'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 40000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . H1 20% bigger at both ends of the clamp; a thin accent underline across the column under every h1 with more space below it; on home the tagline hugs the line and the space below the tagline grows.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 h1 computes ~36px at 320px and ~58px at 1440px, with a 1px #F40 bottom border spanning the column
- [x] #2 Space below the h1 (or below the home tagline) is --space-8; the tagline sits --space-2 under the line
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by Fable: --text-3xl clamp(2.25rem, 1.71rem + 2.7vw, 3.6rem); h1 gets a 1px accent bottom border with --space-2 padding; the sibling after an h1 or a subtitle (or after the floated portrait that follows the subtitle) opens --space-8; the subtitle keeps hugging the line at --space-2. AI time 6 min.
<!-- SECTION:FINAL_SUMMARY:END -->
