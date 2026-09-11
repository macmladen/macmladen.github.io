---
id: TASK-78
title: 'MM-78: Optional City field on registration'
status: Done
assignee: []
created_date: '2026-09-11 11:07'
updated_date: '2026-09-11 11:13'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 9. Registration form gains City (text, optional, autocomplete address-level2) after Name; stored in a new city column (migration 0005); laptop-independent (stays visible for watchers); sent to MailerLite as custom field city (create the field via API); validation length 1–100 when present; tests; README query and spec form table updated; remote migration noted for the next deploy.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 City field renders after Name, optional; stored, sent to MailerLite; tests green; migration 0005 applied locally
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-11.

src/data/registration.ts — `city` added to the `TextField` union, to `RegistrationValues` (with a comment saying why it is laptop-independent) and to `emptyValues`, in each case directly after `name`, so the declaration order matches the order the form asks in.

src/lib/validate.ts — `limits.city = 100`, `messages.cityLong`, `city: text(form, 'city')` in `readForm()` and a length check in `validate()`. The rule "1-100 characters when present" needs no minimum test: `text()` already trims, so a whitespace-only answer arrives as the empty string and an answer that is present is at least one character by definition. The only way to fail is to be over 100. `dropLaptopAnswers()` is deliberately NOT touched — city is asked of watchers too, so it survives a watch-only submission.

src/components/RegistrationForm.astro — the field sits between Name and Email: `<label for="city">City</label>` and a text input with `placeholder="Novi Sad"`, `autocomplete="address-level2"`, `maxlength="100"`, `aria-describedby`/`aria-invalid` through the same two helpers as every other field. No `required`, no word beside the label, and no `data-laptop-only` on the wrapper, with a comment saying that last part is the point.

migrations/0005_registrations_city.sql (new) — `ALTER TABLE registrations ADD COLUMN city TEXT`. Nullable and without a default, for the same reason 0003 and 0004 are: the rows written before it were never asked, and a default would invent an answer. Applied locally, and `PRAGMA table_info` confirms `city TEXT` at cid 15.

src/lib/registrations.ts — `city` added to the INSERT column list and one more placeholder to VALUES; the bound value is `orNull(values.city)`, so an unanswered city is stored as NULL like `terminal` and `ssh_key` rather than as an empty string.

src/lib/mailerlite.ts — `city: values.city` in the upsert's `fields`, after `name`.

MailerLite field: the POST to /api/fields answered 422 "Field name must be unique", which the task anticipated. The reason is worth recording: `city` is one of MailerLite's built-in fields, key `city`, name "City", type text. A listing of /api/fields confirms it, and the key is what the upsert sends, so nothing had to be created and nothing has to be created before the next registration either.

scripts/test-validate.mjs — `city: 'Novi Sad'` in the `complete` fixture, then eight new checks: it comes through as typed; it is trimmed (`'  Nis  '` to `Nis`); a whitespace-only answer becomes the empty string; an absent one becomes the empty string; a registration with no city validates; a city of exactly 100 characters validates; 101 characters gives `messages.cityLong`; and a watch-only registration keeps its city while every laptop answer is dropped.

README.md — the migration list names 0005, the "**Before the next deploy**" paragraph now reads "`0003`, `0004` and `0005`" in bold, both registration SELECT commands (the read query and the CSV export) carry `city` after `name`, and the "MailerLite fields" section lists `city` with the note that it is a built-in field and needed no creating.

docs/spec-v1.md — a `city` row in the form-fields table after `name` (type, placeholder, autocomplete, 100-character limit, and that it carries no `data-laptop-only`); the paragraph about the extra D1 columns now names 0005 and says all three added columns are nullable; and the sentence about how empty answers are stored lists `city` among the nullable ones.

Verified: `npm run build` clean, and the built workshop page renders the input between Name and Email with exactly the intended attributes and no `data-laptop-only` on its wrapper. `npm test` 80 + 38 + 19 + 19 green (the registration suite was 72 before). `npm run check:csp` 5 pages, 2 inline scripts, all covered — the page's inline script was untouched, so public/_headers needed no change. The INSERT statement was run once against the local D1 with its new column list and returned an id and the stored city; that probe row was deleted and the table is back at 0 rows.

Not done, by design: the remote migration. `npx wrangler d1 migrations apply macmladen-registrations --remote` is Mladen's hand and has to run before the next deploy, together with the still-unapplied 0003 and 0004, or every registration on the live site will fail on the missing column and answer 503.

Effort measured: about 9 minutes of agent activity, 40 tool calls, two of them the MailerLite API calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The registration form asks for a city between Name and Email: optional, free text up to 100 characters, autocomplete address-level2, and visible to watchers as well as to people bringing a laptop, so dropLaptopAnswers() leaves it alone. It is stored in a new nullable column added by migrations/0005_registrations_city.sql and sent to MailerLite as the field city, which turned out to be one of their built-in fields and so needed no creating. Tests, README and the spec form table follow; the remote migration is still to run before the next deploy.
<!-- SECTION:FINAL_SUMMARY:END -->
