---
id: TASK-50
title: 'MM-50: SSH public keys on the site'
status: Done
assignee: []
created_date: '2026-09-09 12:58'
updated_date: '2026-09-09 12:58'
labels:
  - feature
milestone: m-4
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . The 2017 site served /id_rsa.pub. Publish the current ed25519 and RSA public keys: /keys.txt (authorized_keys format, both keys), plus /id_ed25519.pub and /id_rsa.pub as single files, and a Keys row on /contact/ linking to /keys.txt.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 /keys.txt, /id_ed25519.pub and /id_rsa.pub served as text/plain from public/
- [x] #2 Contact page lists Keys → /keys.txt
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by Fable: keys copied from ~/.ssh (public halves only), served from public/, linked on /contact/. AI time 4 min.
<!-- SECTION:FINAL_SUMMARY:END -->
