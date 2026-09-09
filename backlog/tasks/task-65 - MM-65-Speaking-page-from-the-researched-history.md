---
id: TASK-65
title: 'MM-65: Speaking page from the researched history'
status: To Do
assignee: []
created_date: '2026-09-09 20:35'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . Rewrite src/data/speaking.ts from docs/speaking-research.md: every confirmed or likely appearance that has a deck or a recording, plus the confirmed events without one (Burgas 2024: workshop 'Drupal and Next: practical workshop', Drupal Developer Days, 26–28 June 2024; Drupal Camp Novi Sad 2024 opening and panel; DrupalCamp Pannonia 2018), the two podcast guest slots as kind podcast, the unclear DrupalCon Amsterdam 2019 row left out. Fields: year, date if known, event, city, title, kind (talk/workshop/panel/podcast/lecture), url (event or session page), deck, video. /speaking/ renders grouped by year, newest first, each entry with title, event and city, kind, and small inline-SVG icon links for deck and video (visually hidden labels); the current-workshop highlight and CTA stay on top; the 40+ events line stays. JSON-LD ItemList from the same data with the deck and video as sameAs. Speaker Deck link in the intro line remains.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 speaking.ts holds every approved row with sources; nothing invented; Burgas title as given
- [ ] #2 /speaking/ groups by year with deck and video icon links; JSON-LD parses
- [ ] #3 Build, tests and CSP check clean; no new scripts
<!-- AC:END -->
