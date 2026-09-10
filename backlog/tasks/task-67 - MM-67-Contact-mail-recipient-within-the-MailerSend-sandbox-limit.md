---
id: TASK-67
title: 'MM-67: Contact mail recipient within the MailerSend sandbox limit'
status: In Progress
assignee: []
created_date: '2026-09-10 05:26'
updated_date: '2026-09-10 05:27'
labels:
  - bug
milestone: m-5
dependencies: []
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . Live contact messages were stored with mail_status failed:422: MailerSend answers 'You have reached sandbox account unique recipients limit' because the account is still a sandbox and mladen@macmladen.com is a new recipient. Interim: send to info@macmladen.com, which the sandbox already accepted and which the Cloudflare catch-all forwards to the same inbox. Permanent: Mladen requests account approval in the MailerSend dashboard, then the recipient can go back.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A live contact message reaches the inbox; mail_status sent
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Deployed 2026-09-10 as v2.1.2: recipient info@macmladen.com while the MailerSend account is a sandbox; MailerLite custom fields github, os, tool, terminal, own_hosting, watch_only created via API (they did not exist, so the first registration arrived with empty fields; re-pushed for the test subscriber). Awaiting Mladen's live contact test to tick the criterion. AI time 10 min.
<!-- SECTION:FINAL_SUMMARY:END -->
