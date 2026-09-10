---
id: TASK-72
title: 'MM-72: Watch-only switch above GitHub hides the laptop fields'
status: To Do
assignee: []
created_date: '2026-09-10 06:57'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . The 'I will watch, not work on my own laptop' checkbox moves up, directly after email. When checked, the fields GitHub username, Operating system, AI tool, Terminal experience, SSH public key and 'I have my own hosting' are hidden (hidden attribute on their wrappers, values kept) and skipped by client validation; unchecked shows them again. Works without JS (all fields visible). Server side: watch-only registrations ignore those fields.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Checkbox above GitHub toggles the six fields; no-JS shows all; server ignores laptop fields for watch-only
<!-- AC:END -->
