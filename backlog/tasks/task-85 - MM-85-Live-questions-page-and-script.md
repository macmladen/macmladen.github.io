---
id: TASK-85
title: 'MM-85: Live questions, page and script'
status: Done
assignee: []
created_date: '2026-09-14 09:51'
updated_date: '2026-09-14 10:06'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 14 min. Questions band on the workshop page (form: Name or email optional and prefilled from localStorage, question, Turnstile; list below; count line). Page script: EventSource subscription to /api/questions/stream/, renders open questions for everyone, ticks and a Covered group for the host, posts ticks, toggles the registration details (closed when registration_open is 0) and shows the band when questions_open is 1. CSS, CSP hash, spec.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Band renders; list updates from the stream without reload; host sees ticks; participants see a plain list; registration folds when the flag is off; check:csp clean
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified against the built page with the stream stubbed, because agents start no server here: `dist/client/.../wordcamp-belgrade-ddev-ai/index.html` was copied with a small stub in the head that replaces `EventSource` and `fetch`, then driven from the browser pane. A `state` event with questionsOpen true and host false revealed the band and listed two of three questions with no tick buttons and no Covered group; host true gave both open items a Covered button, the third an Uncover button inside the Covered group, and turned the count line into "2 open · 1 covered"; registrationOpen false folded the registration group and put "Registration is closed" beside the folded summary; questionsOpen false hid the band again. The Covered button posted to /api/questions/cover/, a 201 cleared the question and left the name with a green "Asked" notice, and a 422 put each message next to its own field with aria-invalid and aria-describedby. Checked again at 375px; no console errors. The stubbed copy was deleted.

Three decisions the brief left open. The "Registration is closed" line is a sibling *after* the details rather than a child of it: a folded `details` renders its summary and nothing else, so a line inside it would never be seen. The "Asked" notice is not focused, unlike the registration form's — it is `role="status"` and removes itself after four seconds, so the person keeps the caret in the textarea for the next question. And the questions form carries no Turnstile loader: the registration form below it already brings `api.js`, and the page emits a loader itself only in the state where that form is gone, so the script is never loaded twice onto one page.

The registration half of the inline script is unchanged line for line but now sits inside a `registration()` function and its selector names the form: it used to take the first `[data-form-root]` on the page, which since this task is the questions form. `challenge()` and `submitting()` take the form as an argument and are shared by both. `npm run build` clean, `npm run check:csp` 5 pages / 2 inline scripts all covered, `npm test` 223 checks green. The new workshop hash is `sha256-OmwgnIJpft85N9QDpvdWL/ZJrrmNCdFn7lQeo3qJwJM=`; `connect-src 'self'` already covered the EventSource.

Effort: 2 commits, ~50 tool calls, ~14 minutes of agent time (session 09:56-10:10 UTC), one Opus 5 session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-14 by coder (Opus 5): src/components/QuestionsForm.astro and QuestionsList.astro, the hidden Questions band between Resources and Registration on src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro, the registration content wrapped in a collapsible group, and the page's inline script extended with the EventSource on /api/questions/stream/ that reveals the band, renders the open list for everyone and the ticks and Covered group for the host, posts covers, folds registration and submits the ask form as JSON. Styles in src/styles/components.css, the new hash in public/_headers, spec Pages 3 updated. Verified against the built page with the stream stubbed in the browser pane; build, check:csp and the test suite all clean. Not deployed, not pushed. AI time 14 min.
<!-- SECTION:FINAL_SUMMARY:END -->
