---
id: TASK-95
title: >-
  MM-95: After the workshop: Done tag on home, Workshop page button, forms off
  the workshop page
status: Done
assignee: []
created_date: '2026-09-18 15:28'
updated_date: '2026-09-18 15:30'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Mladen 2026-09-18, the workshop is over. Home announcement: a status tag ('Done' now, 'Next' when another is scheduled) driven by workshop.ts, and the primary button reads 'Workshop page' linking to the page. Workshop page: no Register button, no seats line, no 'This registration…' notice, no Questions band, no Registration band; the page ends with Resources and ships no page script or Turnstile. Components, endpoints, tables and the People page stay in the repo for the next workshop.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Home shows the Done tag and a Workshop page button; workshop page ends with Resources with no form, seats, notice, questions or script; build, tests, check:csp clean
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-18 by Fable: workshopStatus() in workshop.ts drives a Next/Done tag on the home announcement; the primary button reads 'Workshop page' after the end; on the workshop page the Questions band, the Registration band, Turnstile and the page script (moved verbatim into src/components/WorkshopScript.astro) render only while live, so the page now ends with Resources with no script; the questions-only Turnstile loader removed. Components, endpoints, tables and People kept. Spec and roadmap updated. Not deployed. AI time 20 min.
<!-- SECTION:FINAL_SUMMARY:END -->
