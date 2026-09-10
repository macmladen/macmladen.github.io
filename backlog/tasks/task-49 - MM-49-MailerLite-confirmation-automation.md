---
id: TASK-49
title: 'MM-49: MailerLite confirmation automation'
status: Done
assignee: []
created_date: '2026-09-09 12:52'
updated_date: '2026-09-10 06:57'
labels:
  - chore
milestone: m-4
dependencies: []
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Automation in the MailerLite dashboard on group 198135774424598339: on subscriber added, send the confirmation email (prep guide link, participant URL, teardown date). Content from the workshop project. Mladen's hand.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A test subscriber receives the confirmation within a minute
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Superseded 2026-09-10: the confirmation is sent by the Worker through MailerSend (MM-70); no MailerLite automation needed.
<!-- SECTION:FINAL_SUMMARY:END -->
