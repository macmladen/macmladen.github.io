---
id: TASK-83
title: 'MM-83: Laptop fields in a collapsible Advanced group'
status: Done
assignee: []
created_date: '2026-09-14 08:36'
updated_date: '2026-09-14 08:38'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . The five laptop-only blocks (GitHub, OS/AI-tool row, terminal experience, SSH key, own hosting) move into <details class="advanced"> with <summary>Advanced</summary> and a one-line hint; bordered, alt background; open by default, closed when 'I will watch' is ticked, reopened when unticked; no JS: open. The data-laptop-only hidden toggling is replaced by the details open state. Server behaviour unchanged.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Advanced summary always visible; body open by default, closes on watch-only, reopens on untick; no-JS open; keyboard operable; tests, build, check:csp clean
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-14 by Fable: GitHub, OS/AI tool, terminal, SSH key and own hosting inside <details class=advanced open> with summary Advanced and a hint line; the script sets open = !watch_only; no JS keeps it open; bordered box on the alt band; CSP hash updated. Not deployed. AI time 10 min.
<!-- SECTION:FINAL_SUMMARY:END -->
