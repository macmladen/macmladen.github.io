---
id: TASK-48
title: 'MM-48: Go live on macmladen.com'
status: Done
assignee: []
created_date: '2026-09-09 12:52'
updated_date: '2026-09-10 07:42'
labels:
  - feature
milestone: m-4
dependencies: []
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . MailerLite group id as a Worker var and the two custom domains in wrangler.toml; Mladen runs the deploy that attaches the domains (DNS change); verification on the live domain incl. Turnstile rendering and one test registration and one contact message; then GitHub Pages disabled and the repo pushed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 wrangler.toml carries vars and routes; dry run clean
- [x] #2 https://macmladen.com and www serve the Worker; Turnstile renders on both forms
- [x] #3 One test registration and one contact message arrive (D1 rows, MailerLite subscriber, MailerSend mail)
- [x] #4 GitHub Pages disabled; main pushed
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-10: domain live since 2026-09-09; both forms proven with live submissions (registration → D1 + MailerLite; contact → D1 + MailerSend mail received); GitHub Pages unpublished, master deleted, main default and pushed; test rows removed. AI time 45 min across the session.
<!-- SECTION:FINAL_SUMMARY:END -->
