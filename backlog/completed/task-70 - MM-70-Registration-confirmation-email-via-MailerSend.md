---
id: TASK-70
title: 'MM-70: Registration confirmation email via MailerSend'
status: Done
assignee: []
created_date: '2026-09-10 06:57'
updated_date: '2026-09-10 07:12'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 1.5. Actual: . Billable: no. AI cost: pending script. AI time: 5. After a successful registration the endpoint sends the confirmation through MailerSend (same module as contact) to the registrant, from no-reply@macmladen.com, Reply-To mladen@macmladen.com, plain text approved by Mladen 2026-09-10 (subject 'You are registered: WordPress, Docker and AI agents, WordCamp Belgrade'; body: on the list, date/time/venue, install Docker/DDEV/git/AI tool + GitHub account, repo link with the guide landing by Friday 11 September, watching without a laptop is fine, signed Mladen). A send failure never fails the registration; status recorded in a new column confirmation_status (migration 0004). The success block on the page is reworded to match: 'You are on the list. A confirmation is on its way to {email}; the preparation guide and demo project are on GitHub (link).' MailerLite automation (MM-49) no longer needed for the confirmation; MM-49 closes as superseded.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Valid registration triggers one MailerSend call with the approved text; failure recorded, registration still succeeds; tests cover the payload
- [x] #2 Success block reworded; migration 0004 applied locally and noted for remote
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-10.

src/lib/mailersend.ts — refactored: send(payload, env) is the one POST both mails go through, returning 'sent' | 'skipped' | 'failed:<reason>' and never throwing; it also carries the per-message tracking-off settings. sendMessage() now builds its payload and hands it over. FROM is exported, and the two imports carry .ts extensions so the module loads in plain node for the new test.

src/lib/confirmation.ts — new. confirmationText(name), confirmationPayload(values) and sendConfirmation(values, env). The day and hours, the venue and street, the repository and the date the guide lands all come from workshop.ts; reply_to from person.ts. Someone who gave no name is greeted 'Hi there' and the To carries no name field. The text is Mladen's approved copy, so it is not marked draft.

src/lib/dates.ts — weekdayAndDate() added: 'Friday 18 September', the one format the mail needed and the file did not have.

migrations/0004_registrations_confirmation.sql — ALTER TABLE registrations ADD COLUMN confirmation_status TEXT. Applied to the local D1 (wrangler d1 migrations apply --local, 2 commands executed, PRAGMA table_info shows cid 14 confirmation_status TEXT nullable). NOT applied remotely: that is Mladen's hand, and the README now says 0003 and 0004 both have to go before the next deploy.

src/lib/registrations.ts — setConfirmationStatus(). src/pages/api/register.astro sends the confirmation after the MailerLite upsert and records the outcome; both sit inside the same try as the insert, exactly as mailerlite_status does.

src/components/RegistrationSuccess.astro — reworded to the approved two lines, with the repository linked; the 'bring a laptop with everything installed' paragraph is gone because the email says it.

scripts/test-confirmation.mjs — new, 19 checks, wired into npm test: the addresses, the approved subject unchanged, every fact in the body, the plain-text shape and the nameless greeting.

docs/spec-v1.md and README.md — the confirmation is code through MailerSend, not a MailerLite automation; MailerLite is the mailing list only. Migration list, both read queries, the export query, the status paragraphs and the secrets table updated.

Effort measured: 5 minutes of agent activity, 14 tool calls. npm run build clean, npm test 63 + 38 + 19 green, npm run check:csp all covered. The rendered body was printed and read line by line against the approved text; the built worker chunk carries both the new copy and the subject.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The registrant gets a confirmation from the site itself, through MailerSend, with the approved text built from the workshop data; the outcome is recorded in confirmation_status and never fails a registration.
<!-- SECTION:FINAL_SUMMARY:END -->
