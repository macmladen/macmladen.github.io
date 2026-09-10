---
id: TASK-52
title: 'MM-52: WordCamp links point at the session page'
status: Done
assignee: []
created_date: '2026-09-09 14:09'
updated_date: '2026-09-09 14:12'
labels:
  - fix
milestone: m-5
dependencies: []
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 9 min. workshop.ts gains sessionUrl https://belgrade.wordcamp.org/2026/session/wordpress-docker-i-ai-agenti-prakticno-sr/ ; the home announcement's secondary link and the workshop page's WordCamp link use it (label 'Session at WordCamp Belgrade 2026'); JSON-LD superEvent keeps the event URL and the Event gets sameAs the session URL.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Both links resolve to the session page; JSON-LD carries sameAs
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Done 2026-09-09. sessionUrl added to src/data/workshop.ts next to wordcampUrl, which is now used only by the Event's superEvent. Home announcement secondary button and the workshop page's header link both read workshop.sessionUrl and are labelled 'Session at {workshop.wordcampName}', so the label follows the data. eventNode in src/lib/schema.ts gained sameAs: workshop.sessionUrl. Spec Pages 1 and 3 updated. Verified in dist: both hrefs are the session URL, superEvent url is still https://belgrade.wordcamp.org/2026/, Event sameAs is the session URL, and the workshop page still ships only the JSON-LD block and Turnstile. AI time 9 min, 14 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09: both visible WordCamp links now point at the session page, wordcampUrl is reserved for the Event's superEvent, and the Event carries sameAs the session URL. Build clean, verified in dist. AI time 9 min, 16 tool calls.
<!-- SECTION:FINAL_SUMMARY:END -->
