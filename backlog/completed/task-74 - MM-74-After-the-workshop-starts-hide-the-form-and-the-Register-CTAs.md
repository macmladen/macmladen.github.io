---
id: TASK-74
title: 'MM-74: After the workshop starts, hide the form and the Register CTAs'
status: Done
assignee: []
created_date: '2026-09-10 08:03'
updated_date: '2026-09-10 08:09'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 8. workshop.ts gains startsAt (2026-09-18T12:30:00+02:00 as the cut-off, Mladen's decision) and isBeforeStart(now). Build-time rule: after start, the workshop page renders no form (a short 'The workshop has taken place' notice; the archive content stays), and the Register CTAs on home, /speaking/ and the workshop page are not rendered (home announcement keeps the WordCamp link; /speaking/ highlight becomes a plain link). Pages are prerendered, so the roadmap keeps a rebuild+deploy on 18 September after 12:30; the endpoint refuses after start too (same 403 path as the close date). Post-event page content (summary, video, deck, resources) is a later task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 With startsAt in the past, no form and no Register CTA on any page; endpoint refuses; tests cover isBeforeStart
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-10.

src/data/workshop.ts — a second cut-off, `startsAt` = 2026-09-18T12:30:00+02:00, ten minutes past the scheduled 12:20 start, exported on the workshop object so the tests and any later page read the one value. `isBeforeStart(now = Date.now())` is the new predicate, with the same injectable-number signature as `isRegistrationOpen` (the workerd module-scope caveat from MM-08 applies to it too, so it is called from a page, never at module scope). `isRegistrationOpen` now reads `now <= closesAt && isBeforeStart(now)`: the close date is a day earlier so the second clause never fires today, but it makes "registration is open" impossible to read as true during the session if the close date is ever moved again.

src/pages/index.astro — the announcement's primary button is wrapped in `registrationOpen &&`. Once it goes the block keeps its eyebrow, its title, the teaser and the secondary WordCamp button, which is what the visitor still has a use for.

src/pages/speaking.astro — no branch to add: the highlight already swapped the register button for a plain link to the workshop page on `!registrationOpen`, and that predicate is now false after the start as well. Comments say so, on the branch and on the draft `closedLinkText`.

src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro — three states instead of two. `beforeStart` gates the intro seats line, and the registration band renders the form (open), the closed notice (closed, still ahead), or a plain `.notice` reading "The workshop has taken place. Slides and the recording will appear here." The band's heading follows: "Registration" before, "After the workshop" after. Both new strings are marked draft for approval. The page's inline script is left in place unconditionally so its CSP hash is the same in either state; with no form and no seats lines on the page it simply finds nothing to do.

src/pages/api/register.astro — comments only. `isRegistrationOpen()` already covers both cut-offs, so the existing 403 branch refuses a submission from a page cached before the start without reading the form data.

scripts/test-validate.mjs — nine new checks in a "the workshop itself (MM-74)" block: isBeforeStart true a second before the cut-off and false at it, a minute after and the next day; the cut-off is exactly ten minutes past `workshop.start` and still inside the session; isRegistrationOpen false at the cut-off and during the session; closesAt before startsAt. Every instant is derived from the data object, so moving the cut-off moves the checks with it.

ROADMAP.md — the "rebuild and deploy on 18 September" line now names 12:30 and says what the rebuild changes.

Verified: `npm run build` clean, `npm test` 72 + 38 + 19 + 19 green, `npm run check:csp` 5 pages / 2 inline scripts all covered. The after state was exercised by backdating `startsAt` to 2026-09-01, rebuilding and reading dist: workshop page 0 `<form>`, 0 `class="seats"`, 0 Turnstile script, the "After the workshop" heading and the notice present; 0 occurrences of "Register for the workshop" in the home, /speaking/ and workshop pages; the /speaking/ highlight rendering the plain link; check:csp still all covered. `startsAt` was then restored and the tree rebuilt.

Effort measured: 8 minutes of agent activity, 32 tool calls (10 of them the read-in of the data file, the three pages, the endpoint, the form components, the scripts and the spec, shared with MM-75 and MM-76).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The site now knows when the workshop is over. A second cut-off in src/data/workshop.ts, ten minutes past the scheduled start, drops the registration form, both seats lines and every Register button from the build, leaves a short notice in the form's place, and shuts the endpoint; nine new tests hold the two date predicates in place.
<!-- SECTION:FINAL_SUMMARY:END -->
