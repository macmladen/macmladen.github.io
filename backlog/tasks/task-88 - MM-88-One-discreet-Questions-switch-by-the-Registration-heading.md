---
id: TASK-88
title: 'MM-88: One discreet Questions switch by the Registration heading'
status: To Do
assignee: []
created_date: '2026-09-14 18:50'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Replace the host bar (MM-87) with one switch: a small 'Questions' label and a grey/green toggle to the right of the Registration h2, host-only. On: questions_open=1, the Questions band shows, the registration details folds (still openable, endpoint still accepting; registration_open stays 1). Off: questions_open=0, band hidden, registration unfolded. The fold is driven by questionsOpen in the page script; registrationOpen keeps its meaning for the endpoint and for a wrangler fallback. Next to the switch a host-only small link 'People' to the people page (MM-89 builds it).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Host sees label+switch+People link by the Registration heading, non-hosts nothing; one tap flips questions and folds/unfolds registration on every open page; /api/state/ unchanged; hostbar removed; tests, build, check:csp clean
<!-- AC:END -->
