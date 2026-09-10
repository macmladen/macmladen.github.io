---
id: TASK-69
title: 'MM-69: GitHub username pattern valid under the RegExp v flag'
status: Done
assignee: []
created_date: '2026-09-10 06:10'
updated_date: '2026-09-10 06:10'
labels:
  - bug
milestone: m-5
dependencies: []
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . Chrome compiles the pattern attribute with the v flag, where an unescaped hyphen inside a class is invalid, so the browser dropped the pattern and any text passed client-side validation (server still rejected). Escape the hyphen.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 pattern attribute compiles in Chrome; 'not valid!!' fails checkValidity; server tests unchanged
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-10 by Fable: pattern emits [A-Za-z0-9\-]{1,39}, compiles under the v flag (checked with node). Not deployed. AI time 4 min.
<!-- SECTION:FINAL_SUMMARY:END -->
