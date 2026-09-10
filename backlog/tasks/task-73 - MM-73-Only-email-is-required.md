---
id: TASK-73
title: 'MM-73: Only email is required'
status: To Do
assignee: []
created_date: '2026-09-10 06:57'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Privacy: only email is required on the registration form. Name, GitHub, OS, AI tool, terminal experience, SSH key, all optional; the required attribute and the 'required' marks come off everything but email; server validation requires email only and validates the others only when present (GitHub pattern, SSH key format, known option keys, at least one tool no longer required). Hints reworded where they said mandatory. Tests updated. Spec form table updated.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Submitting with only an email succeeds; other fields validated only when filled; marks removed; tests green
<!-- AC:END -->
