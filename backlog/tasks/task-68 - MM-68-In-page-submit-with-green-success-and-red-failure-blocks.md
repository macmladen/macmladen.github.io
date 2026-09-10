---
id: TASK-68
title: 'MM-68: In-page submit with green success and red failure blocks'
status: To Do
assignee: []
created_date: '2026-09-10 05:53'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . Both forms submit with fetch from the page (no navigation): on success a green .notice--ok block is inserted above the form and the fields are cleared; on 422 a red .notice--error block with the general message, the server-rendered form (field errors, preserved values) replaces the current one; on network or 5xx a red block with a retry hint. Turnstile is reset (or re-rendered after a DOM swap) after every attempt. The endpoints keep rendering HTML; the script requests with a header and parses the response to lift the form or the success block, so there is one rendering path. Without JavaScript the full-page POST stays. Focus moves to the block; aria-live polite. Scripts hashed in the CSP (check:csp). Success copy stays as is.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Registration and contact: success shows a green block above the form, fields cleared, Turnstile reset; 422 shows a red block plus field errors with values kept; network failure shows a red block; no navigation
- [ ] #2 JavaScript off: full-page POST and the existing pages still work
- [ ] #3 check:csp all covered; tests green
<!-- AC:END -->
