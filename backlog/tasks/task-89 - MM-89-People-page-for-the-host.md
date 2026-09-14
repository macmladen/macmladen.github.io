---
id: TASK-89
title: 'MM-89: People page for the host'
status: To Do
assignee: []
created_date: '2026-09-14 18:50'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Route /speaking/2026/wordcamp-belgrade-ddev-ai/people/ (prerender false): host cookie required, else 404-style 'Not found' (do not reveal). Compact table of registrations newest first: #, when (HH:MM, day), name, city, email, OS, tools, terminal, SSH key (yes/no), own hosting, watching, news, confirmation status; a count line (total, working, watching); a link 'CSV' to /api/people.csv (host-only, text/csv, same columns). noindex, no-store, no JSON-LD, plain page in BaseLayout.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Host sees the table and CSV; others get 404; no-store and noindex; build, tests, check:csp clean
<!-- AC:END -->
