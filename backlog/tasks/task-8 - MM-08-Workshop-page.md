---
id: TASK-8
title: 'MM-08: Workshop page'
status: To Do
assignee: []
created_date: '2026-09-08 06:53'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . /speaking/2026/wordcamp-belgrade-ddev-ai/: header from workshop.ts, venue line, held in Serbian, WordCamp link; EN abstract from the handover section 2 with the two fixes; prerequisites checklist; prep guide placeholder line; registration close line; the form (nine fields, labels, fieldset, autocomplete, aria-describedby, aria-invalid, Turnstile widget); inline success state; closed state when past closeDate. Event (EducationEvent) + BreadcrumbList JSON-LD. Spec: Pages 3, Form fields.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Abstract carries the two fixes (rests on; DDEV in prerequisites)
- [ ] #2 Form has all nine fields with the stated names, labels and hints; works with JavaScript disabled
- [ ] #3 With closeDate in the past the form is replaced by the closed notice
- [ ] #4 JSON-LD Event and BreadcrumbList parse; breadcrumb URLs use the reserved index paths
- [ ] #5 Only Turnstile's script is loaded on this page
<!-- AC:END -->
