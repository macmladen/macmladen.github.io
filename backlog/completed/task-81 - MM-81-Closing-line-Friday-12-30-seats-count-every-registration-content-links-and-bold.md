---
id: TASK-81
title: >-
  MM-81: Closing line Friday 12:30; seats count every registration; content
  links and bold
status: Done
assignee: []
created_date: '2026-09-14 08:13'
updated_date: '2026-09-14 08:15'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Mladen 2026-09-14: (1) the registration band says 'Registration closes Friday, 18 September 2026 at 12:30' (text only; the form is closed live by a rebuild, the endpoint stays open until the end); (2) /api/seats/ counts every registration, watchers included, and the page never shows the built-in '30 seats' line once the script has an answer; (3) the abstract, audience, ways to follow, prerequisites and OS note get links on the named tools and terms (Docker, DDEV, git, git worktree, WP-CLI, Claude Code, Codex, Cursor, WordPress, PHP, Invictus site, WordCamp) and bold on the key phrases (three pillars, 'one full loop', 'registration required').
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Closing line reads Friday 12:30; seats endpoint counts all rows; content carries links and bold; build, tests, check:csp clean
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-14 by Fable: closing line 'Friday, 18 September 2026 at 12:30' (text; form closed live by rebuild, endpoint open to the end); /api/seats/ counts every registration; abstract, audience, ways to follow, prerequisites and OS note carry links (Invictus, git, Docker, DDEV, git worktree, WordPress, repository, guides, Docker Desktop, DDEV get-started, git downloads, GitHub signup, Claude Code, Codex, Cursor) and bold on the key phrases; rendered with set:html. GitHub signup and OpenAI Codex answer 403 to curl but are the canonical pages. Not deployed. AI time 14 min.
<!-- SECTION:FINAL_SUMMARY:END -->
