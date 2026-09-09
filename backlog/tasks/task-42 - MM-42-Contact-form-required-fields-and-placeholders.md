---
id: TASK-42
title: 'MM-42: Contact form required fields and placeholders'
status: Done
assignee: []
created_date: '2026-09-09 10:59'
updated_date: '2026-09-09 11:02'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 42000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 5 min. Name, email and message get the required attribute and a visible 'required' hint; placeholders: name 'Your name', email 'you@example.com', message 'What is on your mind?'. Topic keeps a default. Server validation unchanged.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 The three fields carry required and the placeholders; server-side rules unchanged; tests pass
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
src/components/ContactForm.astro: name, email and message already carried
`required` (all four fields did, topic included), so the change is the three
placeholders — "Your name", "you@example.com", "What is on your mind?" — and a
visible required marker in each of the three labels,
`<span class="field__required">required</span>`. Topic is untouched: its
`<option value="" disabled selected>Choose one</option>` is the default and says
the same thing in place.

Ambiguity resolved, worth Mladen's eye: the task asked for a required-hint
pattern "consistent with RegistrationForm.astro", but RegistrationForm has no
such pattern — it marks nothing as required, visually or textually. There was
nothing to reuse, so this introduces one: the word "required" rather than an
asterisk, because an asterisk needs a legend somewhere to explain it, while the
word reads the same to the eye and to a screen reader, which announces it as part
of the label. RegistrationForm was deliberately not retrofitted (rule 4); doing
so is a separate task, and there the marker would have to earn its keep against
the optional SSH key and the three checkboxes.

src/styles/components.css gains two rules next to .field__hint: .field__required
(soft ink, --text-sm, normal weight) and .field ::placeholder (soft ink, explicit
opacity 1 so Firefox does not fade it further). The browser default placeholder
grey does not meet the contrast the token table promises; --color-ink-soft is
#444 on white and #CBA on #111, so both schemes hold.

Server side untouched: src/lib/validate-contact.ts, src/pages/api/contact.astro
and src/data/contact.ts were read but not edited.

Verified: `npm test` 38 passed, 0 failed (registration and contact validators);
`npm run build` clean, no warnings. In dist/client/contact/index.html the three
placeholders are present, the three labels carry the required span, and the
inlined stylesheet contains
`.field__required{color:var(--color-ink-soft);font-size:var(--text-sm);font-weight:var(--weight-normal)}`
and `.field ::placeholder{color:var(--color-ink-soft);opacity:1}`.
Effort measured: about 5 minutes of agent activity, 26 tool calls, including the
shared reading pass over the contact form, the validator, the endpoint and the
spec that also served MM-41.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by coder (Claude Opus 5): placeholders on name, email and message
and a "required" word in those three labels; two appearance rules for the marker
and for placeholder contrast. `required` was already on all four fields. Server
validation and the tests are unchanged; npm test 38/38, npm run build clean.
AI time 5 min.
<!-- SECTION:FINAL_SUMMARY:END -->
