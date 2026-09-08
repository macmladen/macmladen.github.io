---
id: TASK-5
title: 'MM-05: Base layout, head, header, footer, structured data, shared data'
status: To Do
assignee: []
created_date: '2026-09-08 06:53'
labels:
  - feature
milestone: m-1
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . BaseLayout with Head component (title pattern, description, canonical, OG, Twitter, theme-color, lang en), skip link, header (name → /, nav with About only), footer (rel=me profile links, brand links, address with mladen@macmladen.com), StructuredData component, src/data/person.ts, workshop.ts (title, date 2026-09-18, start 12:20, end 13:40, venue Dom Omladine Beograda, Makedonska 22, Belgrade, closeDate 2026-09-15, wordcampUrl), speaking.ts. Spec: Markup, SEO section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Landmarks header/nav/main/footer present; skip link is the first focusable element
- [ ] #2 Head emits title, description, canonical, og:*, twitter:card, theme-color for any page using the layout
- [ ] #3 Footer links resolve to the URLs in the spec; LinkedIn, GitHub, Speaker Deck carry rel=me
- [ ] #4 Data files are the single source for values that appear in both HTML and JSON-LD
<!-- AC:END -->
