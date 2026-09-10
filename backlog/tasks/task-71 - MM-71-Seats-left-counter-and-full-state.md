---
id: TASK-71
title: 'MM-71: Seats left counter and full state'
status: To Do
assignee: []
created_date: '2026-09-10 06:57'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . workshop.ts gets capacity 30. A tiny endpoint /api/seats/ (prerender false, GET, JSON {capacity, taken, left}, cache-control no-store) counts registrations with watch_only = 0. The workshop page shows 'N of 30 seats left' near the CTA and above the form, filled by the page script (static page stays static; a static fallback line '30 seats' without JS). When left is 0 the form shows a notice 'All 30 seats are taken; you can still register to watch' and the watch-only box is pre-checked; the endpoint enforces it server-side (a non-watching registration at capacity is stored as watch_only = 1 with a note in the success block). connect-src already allows self.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 /api/seats/ returns correct counts; page shows seats left; at capacity the form switches to watch-only and the server enforces it; tests cover the capacity rule
<!-- AC:END -->
