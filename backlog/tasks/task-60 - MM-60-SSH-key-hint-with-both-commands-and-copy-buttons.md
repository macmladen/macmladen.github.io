---
id: TASK-60
title: 'MM-60: SSH key hint with both commands and copy buttons'
status: Done
assignee: []
created_date: '2026-09-09 14:53'
updated_date: '2026-09-09 14:54'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . Hint reads: Optional, for the deploy part. Print yours with cat ~/.ssh/id_rsa.pub or cat ~/.ssh/id_ed25519.pub; it starts with ssh-ed25519 or ssh-rsa. Each command gets a small copy icon button that copies it to the clipboard (inline script on the workshop page, hashed in the CSP; without JavaScript the command is plain selectable text).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Both commands shown with a copy button; clicking copies and shows brief feedback; CSP hash covers the script
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by Fable: CopyCommand component (code + hidden icon button revealed by a small inline script on the workshop page), both commands in the hint, CSP hash added, check:csp covers 2 inline scripts. Not deployed. AI time 8 min.
<!-- SECTION:FINAL_SUMMARY:END -->
