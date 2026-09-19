---
id: TASK-96
title: 'MM-96: Registration reopened for those who attended'
status: Done
assignee: []
created_date: '2026-09-18 17:00'
updated_date: '2026-09-18 17:00'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 96000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 25. Mladen, 2026-09-18, after the workshop: he wants to register the people who were in the room, so registration reopens; the removal of the forms (MM-95) waits on branch `after-workshop` and is merged after the conference. The session end (`workshop.end`, 14:00) and the registration close (`endsAt`) become two instants; registration closes Sunday 20 September 2026, 23:59. After the session the confirmation mail is a thank-you with the slides and the repository instead of the install instructions (draft, marked), the ticket notice gives way to a line for attendees (draft, marked), and the closing line names the new date. Task id written by hand: MM-95 lives on the branch, so the CLI would have reused its number.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The live endpoint accepts registrations again; facts, JSON-LD endDate and OG still say 12:40–14:00
- [x] #2 After-session confirmation text and page line in place, draft-marked; tests green
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-18 by Fable. main reset to the deployed state (e59e4ec) with MM-95 parked on `after-workshop` (961e5b3); `sessionEnd` and `endsAt` separated in workshop.ts; `isAfterSession`; confirmation.ts after-session variant; page notices; tests green. Deployed as v2.5.4.
<!-- SECTION:FINAL_SUMMARY:END -->
