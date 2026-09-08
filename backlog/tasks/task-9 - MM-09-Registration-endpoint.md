---
id: TASK-9
title: 'MM-09: Registration endpoint'
status: To Do
assignee: []
created_date: '2026-09-08 06:53'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . POST /api/register (prerender false): Turnstile server-side verify, validation, duplicate email check, D1 insert first, MailerLite upsert with fields and group (skipped with status skipped when key empty), mailerlite_status recorded, errors re-render the form with values preserved. migrations/0001_registrations.sql, wrangler.toml with the D1 binding, .dev.vars.example. Spec: Endpoint behaviour.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Valid submission inserts one row into local D1 and renders the success state
- [ ] #2 Missing required, bad GitHub name, malformed SSH key, duplicate email each re-render with field errors and preserved values
- [ ] #3 Request without a valid Turnstile token is rejected
- [ ] #4 Empty MAILERLITE_API_KEY yields mailerlite_status skipped; with a key the upsert is called with the documented fields
- [ ] #5 No secret value anywhere in the tree
<!-- AC:END -->
