---
id: TASK-92
title: >-
  MM-92: Slot 12:40–14:00; registration notice repeated; home button to the
  programme
status: Done
assignee: []
created_date: '2026-09-16 20:37'
updated_date: '2026-09-16 20:38'
labels:
  - fix
milestone: m-5
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . WordCamp moved the workshop to 12:40–14:00 (programme page, 2026-09-16): start, end and the closing line follow: the line reads 'Registration closes Friday, 18 September 2026 at 12:40', the new start; the endpoint stays open until 14:00. Notice wording 'This registration is for the workshop only…'; the same notice repeated at the top under the seats line; home secondary button 'WordCamp Belgrade' → programme URL https://belgrade.wordcamp.org/2026/sr/program/ (programUrl in workshop.ts); OG card and email derive from the data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Times 12:40–14:00 everywhere (facts, OG, email, JSON-LD, closing line 12:40); notice reworded and repeated at the top; home button to the programme; tests updated and green; build, check:csp clean
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-16 by Fable: start 12:40, end 14:00 (facts, OG card, email, JSON-LD, roadmap, spec); closing line 12:40; notice reworded 'This registration…' and repeated under the seats line at the top; home secondary button → programme page. Not deployed. AI time 10 min.
<!-- SECTION:FINAL_SUMMARY:END -->
