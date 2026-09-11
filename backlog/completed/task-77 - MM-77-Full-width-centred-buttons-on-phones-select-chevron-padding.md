---
id: TASK-77
title: 'MM-77: Full-width centred buttons on phones; select chevron padding'
status: Done
assignee: []
created_date: '2026-09-11 11:07'
updated_date: '2026-09-11 11:08'
labels:
  - fix
milestone: m-5
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . Feedback 2026-09-11. Below 480 px every .button is 100% wide with centred text (inline-size 100%, text-align center; the .row that holds two buttons stacks them). The select gets padding-inline-end equal to its start padding plus room for the native chevron so the arrow is not glued to the edge (appearance kept native; add a symmetric inner padding token).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 At 360 px both announcement buttons and the form buttons span the column with centred text; from 480 px unchanged
- [x] #2 Select chevron has the same clearance from the right edge as the text has from the left
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-11 by Fable: below 480 px .button is full width with centred text and .row stacks; select gets symmetric chevron clearance. Not deployed. AI time 5 min.
<!-- SECTION:FINAL_SUMMARY:END -->
