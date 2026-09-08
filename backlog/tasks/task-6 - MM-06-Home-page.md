---
id: TASK-6
title: 'MM-06: Home page'
status: To Do
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 06:58'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . Intro section with the headshot (from jekyll branch, WebP via Astro Image, eager, fetchpriority high) and the approved two paragraphs verbatim. Workshop announcement block: Unsplash empty classroom photo with credit overlay (left), eyebrow 18 September · 12:20 · Dom Omladine Beograda, title, catchy two-sentence intro (draft, marked), CTA to /speaking/2026/wordcamp-belgrade-ddev-ai/ (right). WebSite + Person JSON-LD. Spec: Pages 1.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Sections in order intro, announcement, footer; halves stack on mobile and sit side by side at 768px and up
- [ ] #2 Approved copy verbatim; workshop intro marked draft in source
- [ ] #3 Unsplash image committed under src/assets with photographer credit and Unsplash link overlaid; file, source URL and size recorded in the task summary
- [ ] #4 JSON-LD WebSite and Person parse and match the page
- [ ] #5 No JavaScript shipped; page under 150 KB including images
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Unsplash image chosen by Fable 2026-09-08: "Rows of empty desks in a modern conference room" by runda choo, https://unsplash.com/photos/rows-of-empty-desks-in-a-modern-conference-room-8seo3zZSoBM, profile https://unsplash.com/@rundachoo, Unsplash License. Downloaded at 1600×1067, 233 KB, to src/assets/workshop-room.jpg (untracked until MM-06 commits it). Credit overlay text: "Photo: runda choo / Unsplash" linking to the photo page. Headshot extracted from the jekyll branch to src/assets/mladen-head-2020.jpg (1024×1024, 109 KB).
<!-- SECTION:NOTES:END -->
