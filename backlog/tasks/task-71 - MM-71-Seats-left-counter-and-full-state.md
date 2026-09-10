---
id: TASK-71
title: 'MM-71: Seats left counter and full state'
status: Done
assignee: []
created_date: '2026-09-10 06:57'
updated_date: '2026-09-10 07:18'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 2. Actual: . Billable: no. AI cost: pending script. AI time: 6. workshop.ts gets capacity 30. A tiny endpoint /api/seats/ (prerender false, GET, JSON {capacity, taken, left}, cache-control no-store) counts registrations with watch_only = 0. The workshop page shows 'N of 30 seats left' near the CTA and above the form, filled by the page script (static page stays static; a static fallback line '30 seats' without JS). When left is 0 the form shows a notice 'All 30 seats are taken; you can still register to watch' and the watch-only box is pre-checked; the endpoint enforces it server-side (a non-watching registration at capacity is stored as watch_only = 1 with a note in the success block). connect-src already allows self.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 /api/seats/ returns correct counts; page shows seats left; at capacity the form switches to watch-only and the server enforces it; tests cover the capacity rule
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-10.

src/data/workshop.ts — capacity: 30, with the reason next to it: watching does not take a working seat.

src/lib/registrations.ts — countSeatsTaken() (COUNT of rows with watch_only = 0), readSeats(db, capacity) returning { capacity, taken, left } with left never below zero, and placeAtCapacity(values, seats), the pure rule that turns a registration into a watching one when the last seat has gone.

src/pages/api/seats.ts — new. GET, prerender false, JSON with Cache-Control: no-store; 503 with { error: 'unavailable' } when the binding is missing or the query throws. A .ts route: the built route pattern is ^\/api\/seats\/$, so trailingSlash 'always' gives /api/seats/ exactly as for the two .astro endpoints — checked in the build manifest.

src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro — two <p class="seats" data-seats> lines, one under the facts block and one directly above the form, built as '30 seats'. The page script's new seats() fills both with 'N of 30 seats left', or 'All 30 seats are taken; you can still register to watch' and then ticks the watch-only box and fires its change event so the laptop fields fold away. Anything short of a clean JSON answer leaves the built line alone.

src/pages/api/register.astro — counts the seats after the duplicate check and before the insert, places the registration with placeAtCapacity, and tells the registrant in the success block. Never refuses. RegistrationSuccess.astro takes a "watching" prop; its line is new copy and is marked draft for Mladen.

src/styles/components.css — .seats, a small semibold line in the accent's quiet step, beside .eyebrow.

scripts/test-seats.mjs — new, 19 checks, wired into npm test: the count query, an empty answer, the arithmetic from an empty room to an over-full one, and the placement rule including that a watcher and a registration with a seat left are both handed back untouched. The database is a fake D1 built in the test.

public/_headers — the workshop page's script hash is now sha256-9s0k51N71QbOvgnQEWkEzLYfF2bVOjqBivbC6GD0ylA=; the comment names the fourth thing the script does. connect-src 'self' already allowed the fetch.

docs/spec-v1.md — the seats lines on the page, a new 'Endpoint behaviour (/api/seats)' section, and the capacity rule under /api/register. README.md — the count query and the capacity note under D1.

Verified in the browser pane on the built page with fetch stubbed: built lines read '30 seats' and stay that way when the fetch fails; with { taken: 22, left: 8 } both read '8 of 30 seats left'; with left 0 both read 'All 30 seats are taken; you can still register to watch', the watch-only box is checked and all five data-laptop-only blocks are hidden.

Effort measured: 6 minutes of agent activity, 16 tool calls. npm run build clean, npm test 63 + 38 + 19 + 19 green, npm run check:csp 5 pages / 2 inline scripts all covered.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The page says how many of the 30 seats are left, read from /api/seats/, and the room is enforced where it matters: at capacity the endpoint registers the person to watch instead of turning them away.
<!-- SECTION:FINAL_SUMMARY:END -->
