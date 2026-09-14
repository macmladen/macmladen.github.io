---
id: TASK-85
title: 'MM-85: Live questions, page and script'
status: To Do
assignee: []
created_date: '2026-09-14 09:51'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . Questions band on the workshop page (form: Name or email optional and prefilled from localStorage, question, Turnstile; list below; count line). Page script: EventSource subscription to /api/questions/stream/, renders open questions for everyone, ticks and a Covered group for the host, posts ticks, toggles the registration details (closed when registration_open is 0) and shows the band when questions_open is 1. CSS, CSP hash, spec.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Band renders; list updates from the stream without reload; host sees ticks; participants see a plain list; registration folds when the flag is off; check:csp clean
<!-- AC:END -->
