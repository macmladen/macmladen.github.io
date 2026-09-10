---
id: TASK-64
title: 'MM-64: Speaking history reconstructed from Speaker Deck, LinkedIn and YouTube'
status: Done
assignee: []
created_date: '2026-09-09 20:07'
updated_date: '2026-09-09 20:35'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . Research pass: every talk and workshop findable on speakerdeck.com/macmladen (title, event, date, deck URL), Mladen's public LinkedIn profile, and YouTube (BalCCon talk and any other recordings), plus the events already in src/data/speaking.ts. Output: docs/speaking-research.md with one row per appearance (year, event, city, title, kind, deck URL, video URL, source, confidence) and a proposed replacement speaking.ts in the same doc, for Mladen's approval before it goes into the data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 docs/speaking-research.md lists every appearance found with sources; unknowns marked, nothing invented
- [x] #2 Proposed speaking.ts content included, awaiting Mladen's approval
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Mladen 2026-09-09: approved; scope = every appearance with a deck or a recording plus the confirmed events, grouped by year; Burgas 2024 = workshop 'Drupal and Next: practical workshop', Drupal Developer Days Burgas, 26–28 June 2024.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done: research doc approved as the source for the speaking data (MM-65 implements).
<!-- SECTION:FINAL_SUMMARY:END -->
