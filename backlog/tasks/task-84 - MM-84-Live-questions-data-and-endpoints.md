---
id: TASK-84
title: 'MM-84: Live questions, data and endpoints'
status: To Do
assignee: []
created_date: '2026-09-14 09:51'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . Migration 0006: tables questions (id, created_at, name, body, covered_at, ip_hash) and workshop_state (key, value) seeded registration_open=1, questions_open=0. src/lib/questions.ts, state.ts, host.ts (HMAC cookie). Endpoints: POST /api/questions/ (ask; Turnstile; name optional ≤100, body 1–500), GET /api/questions/stream/ (SSE: state event, then questions event whenever the list version changes, server polls D1 every 2 s; host flag from the cookie), POST /api/questions/cover/ (toggle covered; host cookie required), GET /api/host/?key= (sets the host cookie from HOST_KEY, redirects to the page). Tests, .dev.vars.example HOST_KEY, README section with the flip commands.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Migration applied locally; endpoints behave per contract in a node harness; tests green
<!-- AC:END -->
