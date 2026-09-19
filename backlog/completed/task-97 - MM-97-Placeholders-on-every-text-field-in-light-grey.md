---
id: TASK-97
title: 'MM-97: Placeholders on every text field, in light grey'
status: Done
assignee: []
created_date: '2026-09-19 09:59'
updated_date: '2026-09-19 09:59'
labels:
  - fix
milestone: m-5
dependencies: []
ordinal: 97000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . Registration form: placeholders on name, email, GitHub username and SSH key (city has one; contact and questions forms are complete). Placeholder colour becomes a light grey token (--color-placeholder #AAA) instead of the soft ink, Mladen's choice 2026-09-19; a placeholder is a hint, the label and the hint line carry the meaning.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Every text input and textarea on the three forms has a placeholder; placeholders render #AAA; build, tests, check:csp clean
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-19 by Fable: placeholders on name, email, GitHub and SSH key in the registration form (city, contact and questions forms already had theirs); --color-placeholder #AAA replaces the soft ink in .field ::placeholder. Not deployed. AI time 6 min.
<!-- SECTION:FINAL_SUMMARY:END -->
