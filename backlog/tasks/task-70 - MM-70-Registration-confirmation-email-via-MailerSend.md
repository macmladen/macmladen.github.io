---
id: TASK-70
title: 'MM-70: Registration confirmation email via MailerSend'
status: To Do
assignee: []
created_date: '2026-09-10 06:57'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . After a successful registration the endpoint sends the confirmation through MailerSend (same module as contact) to the registrant, from no-reply@macmladen.com, Reply-To mladen@macmladen.com, plain text approved by Mladen 2026-09-10 (subject 'You are registered: WordPress, Docker and AI agents, WordCamp Belgrade'; body: on the list, date/time/venue, install Docker/DDEV/git/AI tool + GitHub account, repo link with the guide landing by Friday 11 September, watching without a laptop is fine, signed Mladen). A send failure never fails the registration; status recorded in a new column confirmation_status (migration 0004). The success block on the page is reworded to match: 'You are on the list. A confirmation is on its way to {email}; the preparation guide and demo project are on GitHub (link).' MailerLite automation (MM-49) no longer needed for the confirmation; MM-49 closes as superseded.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Valid registration triggers one MailerSend call with the approved text; failure recorded, registration still succeeds; tests cover the payload
- [ ] #2 Success block reworded; migration 0004 applied locally and noted for remote
<!-- AC:END -->
