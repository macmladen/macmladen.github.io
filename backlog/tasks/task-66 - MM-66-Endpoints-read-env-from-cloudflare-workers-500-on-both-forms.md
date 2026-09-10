---
id: TASK-66
title: 'MM-66: Endpoints read env from cloudflare:workers (500 on both forms)'
status: Done
assignee: []
created_date: '2026-09-10 05:19'
updated_date: '2026-09-10 05:20'
labels:
  - bug
milestone: m-5
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . Live: both /api/register/ and /api/contact/ answered 500. Worker log: 'Astro.locals.runtime.env has been removed in Astro v6. Use import { env } from cloudflare:workers'. The node harness had stubbed locals, so this never showed. Fix: read env via the cloudflare:workers import in both endpoints; type it with WorkerEnv.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Both endpoints answer 422 (bad token) not 500 on the live site; a valid submission works
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-10 by Fable: both endpoints import env from cloudflare:workers; deployed as v2.1.1; live probes with a bad token answer 422 instead of 500. Lesson recorded: the node harness must not stub Astro.locals.runtime. AI time 12 min.
<!-- SECTION:FINAL_SUMMARY:END -->
