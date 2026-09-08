---
id: TASK-9
title: 'MM-09: Registration endpoint'
status: Done
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 18:21'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: pending script. AI time: 34 min. POST /api/register (prerender false): Turnstile server-side verify, validation, duplicate email check, D1 insert first, MailerLite upsert with fields and group (skipped with status skipped when key empty), mailerlite_status recorded, errors re-render the form with values preserved. migrations/0001_registrations.sql, wrangler.toml with the D1 binding, .dev.vars.example. Spec: Endpoint behaviour.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Valid submission inserts one row into local D1 and renders the success state
- [x] #2 Missing required, bad GitHub name, malformed SSH key, duplicate email each re-render with field errors and preserved values
- [ ] #3 Request without a valid Turnstile token is rejected
- [ ] #4 Empty MAILERLITE_API_KEY yields mailerlite_status skipped; with a key the upsert is called with the documented fields
- [x] #5 No secret value anywhere in the tree
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Design decision worth Mladen's eye: /api/register is an Astro page
(src/pages/api/register.astro with prerender = false), not the .ts endpoint the
spec's file list assumed. A .ts endpoint cannot render Astro components, and the
answer to a submission has to be a rendered page — the form again with its errors,
or the success state. Only a page gets the site's inlined stylesheet, header and
footer; a .ts endpoint would have had to rebuild all of that by hand or render
through the Container API, which emits no component styles. Verified in the built
worker manifest: the /api/register route carries the whole inlined stylesheet, so a
failed submission comes back looking like the site rather than like a raw form.

The cost of that choice: trailingSlash is 'always' and applies to pages, so the
route is /api/register/ and the form's action says so. The spec's URL table says
/api/register. Nothing else changes; a POST to the slashless form would not carry
its body through a redirect, so the action is the slashed URL and that is the only
address the form ever uses. Say the word and it can go back to a .ts endpoint with
hand-built HTML.

Shape of the code:
- src/lib/validate.ts — pure, no Astro, no fetch, no database. readForm() turns
  FormData into values (trims, lowercases the email, checkboxes to booleans),
  validate() returns field errors, messages holds every string the visitor reads.
  Its two data imports carry explicit .ts extensions so plain node can load the file.
- src/lib/turnstile.ts — siteverify, failing closed: no secret, no token, non-OK
  response or a thrown fetch all mean rejected.
- src/lib/mailerlite.ts — the upsert. Empty key returns 'skipped' without calling
  out; a failure returns 'failed:<status>' and never throws.
- src/lib/registrations.ts — findByEmail, insertRegistration (RETURNING id),
  setMailerliteStatus, hashIp. D1 is typed structurally, so no Cloudflare types
  package was added. hashIp returns null when the IP or the salt is missing: an
  unsalted hash of an IP is not anonymous, so nothing is stored instead.
- src/pages/api/register.astro — POST only (GET answers 405 with Allow: POST),
  validate, then Turnstile, then the database: duplicate check, insert, MailerLite,
  status update. D1 first, MailerLite after, exactly as the spec orders it. Status
  codes 200 success, 422 validation or duplicate, 403 after the close date, 503 when
  the DB binding or the table is missing, 405 for GET. Cache-Control: no-store, and
  a robots noindex on the response.
- migrations/0001_registrations.sql — the nine form fields plus id, created_at,
  ip_hash and mailerlite_status, with a unique index on email.
- src/env.d.ts — types Astro.locals.runtime.env and PUBLIC_TURNSTILE_SITE_KEY.

Verification without a server:
1. node scripts/test-validate.mjs — 36 checks, all passing. Covers readForm
   (trimming, lowercasing, checkbox mapping, absent fields), the accepted cases,
   and every rejection: empty and overlong name, four malformed addresses, GitHub
   names with an underscore, a slash, 40 characters and none at all, unoffered os
   and tool values, four bad SSH keys, and that several bad fields are all reported
   at once. It also pins the registration window: open on 15 September, closed a
   second later.
2. The built worker was driven directly in node (imported the entrypoints chunk,
   constructed the App, called app.render with real Requests). Results:
   - GET /api/register/ -> 405 with Allow: POST.
   - POST with six bad fields -> 422, Cache-Control no-store, the inlined stylesheet
     present, robots noindex present, all six field errors rendered, the typed values
     preserved (email "nope", github "bad_name"), and the two ticked checkboxes still
     ticked.
   - POST with valid fields and no Turnstile token -> 422 with the anti-spam message.
   - Astro's built-in CSRF origin check answers 403 to a POST without a matching
     Origin header. Browsers send Origin on same-origin form posts, so this is
     correct, but a curl test of the endpoint has to pass -H "Origin: <site>".
3. The same harness with a fake D1 (same prepare/bind/first/run surface) and a
   stubbed fetch:
   - valid submission -> 200, success state, form gone, exactly one row with the
     columns in the right order, ip_hash a SHA-256 hex string, mailerlite_status
     updated from 'pending' to 'ok'.
   - the siteverify call carried secret, response and remoteip.
   - the MailerLite call carried Bearer auth and exactly the documented payload:
     email, fields name/github/os/tool/own_hosting/watch_only, groups [id].
   - the same address again -> 422 with the duplicate message on the email field and
     no second row.
   - MAILERLITE_API_KEY empty -> 200, mailerlite_status 'skipped', no call made.
   - no DB binding -> 503 with the "write to mladen@macmladen.com" message.
   - siteverify answering success:false -> 422 and no row written.

Left for Mladen's preview server (MM-11), which is why acceptance criteria 1, 3 and
4 stay unticked: a row in the real local D1, Turnstile actually rendering and
rejecting for real, and a real MailerLite call. The fake-D1 runs above are unit
evidence, not a substitute.

Two things to flag, neither fixed here:
- The Cloudflare adapter injects a SESSION KV namespace binding into the generated
  worker config (sessions are on by default) even though this site uses no sessions.
  A deploy in M5 may want that KV namespace to exist or sessions turned off.
- MailerLite receives no newsletter flag: the spec lists six custom fields and the
  newsletter checkbox is not among them, so marketing consent lives only in the D1
  column. If the automation should respect it, the field has to be added.

Also fixed here, one line: the sitemap serialize filter now drops /api/, which had
started appearing in sitemap-0.xml as a trailing-slash URL. The sitemap is back to
exactly the three pages.

Effort: 34 min, 24 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. The registration endpoint works end to end in the built worker: POST only, pure validation in src/lib/validate.ts with 36 passing node checks, Turnstile verified server-side and failing closed, duplicate email caught with a friendly message, D1 insert first and MailerLite after with its outcome recorded in mailerlite_status, and a failed submission re-rendering the same form component with every error and every typed value preserved. migrations/0001_registrations.sql, the D1 binding in wrangler.toml, IP_HASH_SALT in .dev.vars.example, and README sections for D1 and Secrets are in place. The endpoint is an Astro page rather than a .ts endpoint, so its responses carry the site's inlined CSS and chrome; the form therefore posts to /api/register/ with a trailing slash. Acceptance criteria 1, 3 and 4 stay unticked: they need a real local D1 and a real Turnstile round trip on Mladen's preview server, though all three were exercised against a fake D1 and a stubbed fetch. Coder (Opus): 34 min, 24 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
