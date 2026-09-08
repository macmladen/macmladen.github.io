---
id: TASK-4
title: 'MM-04: Design tokens and CSS layers'
status: To Do
assignee: []
created_date: '2026-09-08 06:53'
labels:
  - feature
milestone: m-1
dependencies: []
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . tokens.css with the agreed palette (#FED bg, #EDC alt, #CBA border, #111 ink, #444 soft, #909 accent, #606 strong, #FFF accent ink, ok and error pairs), system font stacks, fluid type scale 1.2 ratio, space scale, radius 4px. Layers reset, base, layout (section, container, container--narrow, row, flow, grid), components (button, link, form controls, notice, credit overlay), utilities. Spec: Design section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Every colour pair in the spec table meets its stated contrast
- [ ] #2 Body text is 16px at 360px and 18px at 1440px; h1 30px to 40px; headings scale by ~1.2
- [ ] #3 No bare colour or size values in components; every value is a token
- [ ] #4 Layers declared once in order reset, base, layout, components, utilities; tokens unlayered
- [ ] #5 Links underlined; focus outline 2px #606 offset 2px on every interactive element
<!-- AC:END -->
