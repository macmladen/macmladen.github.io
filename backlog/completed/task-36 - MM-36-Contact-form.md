---
id: TASK-36
title: 'MM-36: Contact form'
status: Done
assignee: []
created_date: '2026-09-09 10:01'
updated_date: '2026-09-09 10:19'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 8 min. A form on /contact/: name, email, topic select (Casual chat / We need a website / We need training / We are calling you as a speaker), message textarea, Turnstile; POST to /api/contact/ (same pattern as the registration endpoint: validation module, no-JS friendly, 422 re-render with errors and values, success state inline). Storage: D1 table messages (id, created_at, name, email, topic, message, ip_hash, mail_status) via migrations/0002_messages.sql. Delivery: MailerSend API (domain macmladen.com is verified, see docs/mail-setup.md) sends the message to mladen@macmladen.com from a no-reply address on macmladen.com with Reply-To the sender; env MAILERSEND_API_KEY; empty key means status skipped and the row is still stored; a send failure never fails the submission. README: D1 migration, the new secret, how to read messages. .dev.vars.example gains MAILERSEND_API_KEY=. Spec: Pages gains the contact page and form; endpoint section extended; ROADMAP contact-form line removed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Form with the five fields renders on /contact/ with labels, hints, autocomplete, fieldset-free select, Turnstile
- [x] #2 Validation module unit-tested by a node script; invalid POST re-renders with field errors and preserved values; valid POST inserts a row and renders the success state (fake D1 in a node harness; runtime ACs against Mladen's preview)
- [ ] #3 MailerSend call made with the documented payload when the key is set; skipped status without it; failure recorded, submission still succeeds
- [x] #4 migrations/0002_messages.sql, README, .dev.vars.example, spec and ROADMAP updated; no secret values in the tree
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The contact form follows the registration form file for file, deliberately: a reader who knows one knows the other.

New files:

- `src/data/contact.ts` — the four topics as `{value, label}`, the values and errors types, `emptyValues`, and `topicLabel()`. Values are what D1 stores, labels are display only, so a label can be reworded without rewriting rows. Kept separate from `src/data/registration.ts` rather than merged into a shared form module: the two forms answer to different tables and already differ, and one abstraction over both would have to be undone the first time they drift.
- `src/lib/validate-contact.ts` — pure functions, `.ts` extensions on its imports so plain node can load it. Name 1–100, email by the same pattern and 254-character cap as the registration validator, topic one of the four keys, message 10–2000 characters after trimming.
- `src/lib/messages.ts` — `insertMessage` (RETURNING id, `mail_status` `pending`) and `setMailStatus`. No unique index and no duplicate check: the same person may write twice. It imports `hashIp` and the structural `D1Like` type from `src/lib/registrations.ts` and re-exports them, so the endpoint takes everything about its row from one module without the hash being written a second time.
- `src/lib/mailersend.ts` — `POST https://api.mailersend.com/v1/email`, Bearer token, `from` `no-reply@macmladen.com`, `to` `person.email`, `reply_to` the sender, subject `[macmladen.com] <topic label> from <name>`, plain-text body, and per-message `settings.track_clicks`/`track_opens` false, which `docs/mail-setup.md` says is necessary because the plan refuses to turn tracking off at domain level. Empty key returns `skipped` without calling out; a non-OK answer returns `failed:<status>`; a thrown fetch returns `failed:network`. It never throws.
- `src/components/ContactForm.astro` and `src/components/ContactSuccess.astro` — the same `describedBy`/`invalid` helpers as `RegistrationForm.astro`, the same Turnstile block with the always-pass test key as fallback, the same `noscript` fallback pointing at the mailto. The success notice says the message was received, not that the email arrived, because delivery is a separate step recorded in `mail_status`.
- `src/pages/api/contact.astro` — `prerender = false`, POST only (405 with `Allow: POST`), validate, then Turnstile, then D1 first and MailerSend after. 200 / 422 / 503 / 405, `Cache-Control: no-store`, `robots` `noindex`.
- `migrations/0002_messages.sql` and `scripts/test-validate-contact.mjs`.

Changed: `src/pages/contact.astro` gains a second band — a `.section--alt` section with an h2 "Or write from here", a draft-marked line and the form — replacing "A contact form is coming."; `src/env.d.ts` gains `MAILERSEND_API_KEY`; `.dev.vars.example` gains it too with a comment; `package.json`'s `test` script now runs both validators.

One CSS rule was added, `.field--prose textarea` in `src/styles/components.css`: body face at body size. The existing `.field textarea` rule sets the mono family at `--text-sm`, which was written for the SSH key field where character-by-character legibility is the point; a 2000-character prose message in mono reads as a terminal. The modifier leaves the SSH field alone. That is a judgement call, easily reverted by dropping `field--prose` from one div.

Verification, no server started:

1. `npm test` — 36 registration checks and 38 contact checks, all passing. The contact script covers the topic list (four keys in the documented order, labels present, `topicLabel` and its fallback), `readForm` (trimming, lowercasing, a non-string field, missing fields), the accepted cases including every topic and the exact 10- and 2000-character boundaries, and every rejection: empty, whitespace-only and overlong name, five malformed addresses, an unoffered topic, a topic sent as a label instead of a key, a message under and over the limits, all four fields wrong at once, and an entirely empty form.
2. The built worker was driven directly in node with a fake D1 and a stubbed fetch, the MM-09 shape (harness in the scratchpad, not committed — it reads the hashed chunk name out of `dist/server`, which changes every build). 55 checks, all passing:
   - GET → 405 with `Allow: POST`.
   - Four bad fields → 422, `no-store`, `noindex`, the inlined stylesheet present, all four field errors rendered, the typed email and message preserved, the unoffered topic selecting nothing, and no siteverify call made at all.
   - Turnstile answering `success: false` → 422, the anti-spam message, no row written; the siteverify call carried secret, response and remoteip.
   - Valid submission with a key → 200, success state, form gone, exactly one row: name as typed, email lowercased, the topic key rather than the label, the message, `ip_hash` a 64-character hex string, `mail_status` `pending` → `sent`. The MailerSend call went to `https://api.mailersend.com/v1/email` with Bearer auth, `from` `no-reply@macmladen.com`, `to` `mladen@macmladen.com`, `reply_to` the sender, subject `[macmladen.com] We need a website from Ana Anić`, the message in the text body, tracking off, and no HTML part.
   - No `MAILERSEND_API_KEY` → 200, row written, `mail_status` `skipped`, no outbound call.
   - MailerSend answering 422 → submission still 200, `mail_status` `failed:422`. MailerSend throwing → still 200, `failed:network`.
   - No `IP_HASH_SALT` → `ip_hash` null.
   - No `DB` binding → 503 with the fallback address and the form back. A `prepare` that throws → 503, not a stack trace.
   - The same address twice → both accepted, two rows.
3. `npm run build` clean, no warnings, five prerendered routes plus the two server routes. `dist/client/contact/index.html`: one h1 and two h2s with no skipped level, both sections `aria-labelledby` their own heading, exactly one Turnstile script and no other script but the JSON-LD, the `ContactPage` JSON-LD still parsing, both draft comments surviving, 18.8 KB.
4. The built page and the endpoint's own 422 and 200 responses were rendered in the browser pane as local files. At 1440 px the form band is 720 px and the controls 672 px; at 360 px nothing overflows (`scrollWidth` 360, no element past the right edge). The 422 page shows the summary notice, four field errors, the tinted invalid controls and the preserved values; the 200 page shows the success notice with the topic label and the address. The two dumped files were deleted afterwards.

Acceptance criterion 3 stays unticked. The payload, the `skipped` path and both failure paths are verified against a stubbed fetch, but no real MailerSend call has been made from this code — that needs `MAILERSEND_API_KEY` in `.dev.vars` and Mladen's own `npm run preview`. Criterion 2 is ticked because its own text names the fake-D1 harness as the method; the same runtime caveat applies to a row in the real local D1 and to Turnstile rejecting for real.

Ambiguities settled, worth Mladen's eye:

- **The From address.** The task said "a no-reply address"; `docs/mail-setup.md` records a smoke test from `noreply@macmladen.com`, no hyphen. The code uses `no-reply@macmladen.com`. Any address on the verified domain works, but if the hyphenless one is preferred it is one constant in `src/lib/mailersend.ts`.
- **One database, two tables.** `messages` goes into the existing `macmladen-registrations` D1, since a second database would need a second binding and a second id in M5 for no gain. The name is now slightly wrong for what it holds; renaming it is a decision for M5, not a change to make now.
- **`mail_status` vocabulary** is `sent`, not `ok`, so the two tables read differently (`mailerlite_status` uses `ok`). `sent` says more about what happened; left as it is rather than changing an existing column's vocabulary.
- **The success copy and the two page lines are draft**, marked in source, and the h2 "Or write from here" is mine. All of it is his to rewrite.

Flagged, not changed:

- `AGENTS.md` still says "one server endpoint for the workshop registration form". It is now two. That file is the project charter, so the sentence is left for Mladen rather than edited by an agent.
- MM-10 has not run, so there is no `public/_headers` yet. When it does, its Content-Security-Policy has to allow the Turnstile script and frame for `/contact/` as well as the workshop page.
- The spec acceptance criteria still say "all three pages" in several places; there are five. Pre-existing, untouched.

Effort: 30 tool calls including the node harness, the two response dumps and four browser measurements; 8 minutes wall clock from setting the task In Progress to the closing commit; one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The contact form is live on /contact/ in a .section--alt band under the contact details: name, email, a four-topic select, a message textarea and Turnstile, posting to a new server-rendered /api/contact/. New modules mirror the registration ones — src/data/contact.ts, src/lib/validate-contact.ts, src/lib/messages.ts (D1 insert plus the shared hashIp) and src/lib/mailersend.ts — with ContactForm.astro and ContactSuccess.astro, migrations/0002_messages.sql for the messages table in the existing D1, and scripts/test-validate-contact.mjs wired into npm test alongside the registration checks. The endpoint stores first and sends after, so mail_status moves pending → sent | skipped | failed:<reason> and no delivery failure ever loses a message. 36 + 38 unit checks pass; a node harness with a fake D1 and a stubbed fetch drove the built worker through 55 checks covering 405, 422, 200, 503, the MailerSend payload, the skipped path, both failure paths and two messages from one address. README D1 and Secrets, .dev.vars.example, the spec (page 4, contact form fields, /api/contact endpoint behaviour, URL table) and ROADMAP are updated. AC 3 stays unticked: the MailerSend payload is verified against a stub, not against MailerSend.
<!-- SECTION:FINAL_SUMMARY:END -->
