---
id: TASK-46
title: 'MM-46: Turnstile widget, secrets, site key'
status: Done
assignee: []
created_date: '2026-09-09 12:52'
updated_date: '2026-09-09 12:52'
labels:
  - chore
milestone: m-4
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Turnstile widget for macmladen.com created by Mladen (API creation blocked for agents); site key 0x4AAAAAAEt3ii4d2TprNmPs in the gitignored .env for the build; secrets TURNSTILE_SECRET, MAILERLITE_API_KEY, MAILERSEND_API_KEY, IP_HASH_SALT put by Mladen with wrangler; MailerLite group 198135774424598339 created by Fable via API and exposed as a Worker var.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 wrangler secret list shows the four secrets
- [x] #2 Built pages carry the real site key
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. Secrets by Mladen, site key baked by Fable, group created via API. AI time 5 min.
<!-- SECTION:FINAL_SUMMARY:END -->
