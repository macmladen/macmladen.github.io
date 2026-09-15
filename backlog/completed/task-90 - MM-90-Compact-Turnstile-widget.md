---
id: TASK-90
title: 'MM-90: Compact Turnstile widget'
status: Done
assignee: []
created_date: '2026-09-15 05:45'
updated_date: '2026-09-15 05:55'
labels:
  - fix
milestone: m-5
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . All three Turnstile containers get data-size=compact: Cloudflare offers normal (300×65), flexible (full width, 65 tall) and compact (150×140); the compact one is the smallest.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All three widgets render compact; build and check:csp clean
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Reverted 2026-09-15: compact is taller (150×140) and looked bigger; back to the normal widget. Invisible mode is a widget-type choice in the Turnstile dashboard, free, noted on the roadmap. AI time 5 min.
<!-- SECTION:FINAL_SUMMARY:END -->
