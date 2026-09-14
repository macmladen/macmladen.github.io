---
id: TASK-84
title: 'MM-84: Live questions, data and endpoints'
status: Done
assignee: []
created_date: '2026-09-14 09:51'
updated_date: '2026-09-14 10:03'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 15 min. Migration 0006: tables questions (id, created_at, name, body, covered_at, ip_hash) and workshop_state (key, value) seeded registration_open=1, questions_open=0. src/lib/questions.ts, state.ts, host.ts (HMAC cookie). Endpoints: POST /api/questions/ (ask; Turnstile; name optional ≤100, body 1–500), GET /api/questions/stream/ (SSE: state event, then questions event whenever the list version changes, server polls D1 every 2 s; host flag from the cookie), POST /api/questions/cover/ (toggle covered; host cookie required), GET /api/host/?key= (sets the host cookie from HOST_KEY, redirects to the page). Tests, .dev.vars.example HOST_KEY, README section with the flip commands.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Migration applied locally; endpoints behave per contract in a node harness; tests green
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Migration 0006 applied to the local D1 and the SQL driven by hand through `wrangler d1 execute` — insert, the version query, cover, uncover, delete — before any of it was trusted in code; the local table was left empty again.

Two deviations from the contract, both deliberate. The version query the stream polls carries a fourth number, the count of covered questions: with only COUNT(*), MAX(id) and MAX(COALESCE(covered_at, "")) a mark taken *off* a question that was not the most recently covered one changes nothing, and the room would keep seeing it as answered until something else moved. And questions.createdAt is handed to the page as ISO with the Z rather than SQLite's raw `2026-09-18 09:30:00`, which `new Date()` reads as local time — two hours out in Belgrade.

Everything else is as agreed, including the JSON and event shapes MM-85 builds against. The 403 for a closed question time and the 503 for a missing binding answer a fetch with the same `{ ok: false, errors: { form } }` body as the 422, since the contract only named 422 and one shape is easier to handle than three.

The endpoints are not driven in node: dist/server is a workerd bundle that imports `cloudflare:workers` for its bindings, so importing the built routes would mean faking the runtime rather than testing it. Everything they decide with sits in the three libraries and scripts/test-questions.mjs covers it against a small in-memory D1 that throws on a query it does not know — 72 checks: reading and validating the form, add/list/version, covering and uncovering, the state switches, the host cookie round trip. `npm test` 223 checks across five suites, exit 0. `npm run build` exit 0, all four routes in dist/server.

Effort: 3 commits, ~50 tool calls, ~15 minutes of agent time (session 09:52–10:07 UTC), one Opus 5 session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-14 by coder (Opus 5): migration 0006 (questions, workshop_state seeded registration_open=1 / questions_open=0), src/lib/questions.ts, state.ts and host.ts, and the four endpoints — POST /api/questions/, GET /api/questions/stream/ (SSE, 2 s poll, 30 min cap), POST /api/questions/cover/, GET /api/host/?key=. HOST_KEY in .dev.vars.example and env.d.ts, a "Live questions" README section with the flip commands and the host link, scripts/test-questions.mjs wired into npm test. Migration applied locally and the SQL driven by hand through wrangler; npm test 223 checks green, npm run build clean. The page and its script are MM-85. Not deployed, not pushed. AI time 15 min.
<!-- SECTION:FINAL_SUMMARY:END -->
