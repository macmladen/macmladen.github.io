---
id: TASK-80
title: >-
  MM-80: Registration open until the workshop ends; Resources without the
  Registration item
status: Done
assignee: []
created_date: '2026-09-14 07:52'
updated_date: '2026-09-14 07:53'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Mladen's decision 2026-09-14: registration stays open through the workshop so participants can be directed to it from the stage; it closes when the workshop ends (13:40 on 18 September). The close date and the 12:30 cut-off go: closesAt/closeDate removed, startsAt replaced by endsAt = workshop.end; isRegistrationOpen = now < end; the 'Registration closes Thursday' line and RegistrationClosed component go; the endpoint refuses after the end; JSON-LD validThrough = end; the Resources list loses the Registration item; Register buttons on home and /speaking/ stay until the end; the post-event notice takes over after. Tests updated; spec Pages 3 and ROADMAP rebuild line (after 13:40) updated.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No close date anywhere; registration open until the end time; post-event state after it; Resources has four items; tests, build, check:csp clean
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-14 by Fable: closesAt/closeDate/startsAt removed, endsAt = workshop.end; isRegistrationOpen open until the end; RegistrationClosed reworded as the post-event notice for the endpoint; validThrough = end; Resources without Registration; tests 74 green; spec and roadmap updated. Not deployed. AI time 12 min.
<!-- SECTION:FINAL_SUMMARY:END -->
