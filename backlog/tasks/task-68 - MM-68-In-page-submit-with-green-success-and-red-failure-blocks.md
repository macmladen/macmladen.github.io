---
id: TASK-68
title: 'MM-68: In-page submit with green success and red failure blocks'
status: Done
assignee: []
created_date: '2026-09-10 05:53'
updated_date: '2026-09-10 06:09'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 16. Both forms submit with fetch from the page (no navigation): on success a green .notice--ok block is inserted above the form and the fields are cleared; on 422 a red .notice--error block with the general message, the server-rendered form (field errors, preserved values) replaces the current one; on network or 5xx a red block with a retry hint. Turnstile is reset (or re-rendered after a DOM swap) after every attempt. The endpoints keep rendering HTML; the script requests with a header and parses the response to lift the form or the success block, so there is one rendering path. Without JavaScript the full-page POST stays. Focus moves to the block; aria-live polite. Scripts hashed in the CSP (check:csp). Success copy stays as is.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Registration and contact: success shows a green block above the form, fields cleared, Turnstile reset; 422 shows a red block plus field errors with values kept; network failure shows a red block; no navigation
- [ ] #2 JavaScript off: full-page POST and the existing pages still work
- [x] #3 check:csp all covered; tests green
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Server side: no change to either endpoint. The hooks are attributes on what they already render — data-form-root="register" / "contact" on the form element itself (no wrapper div: the form is its own root, which keeps the submit listener alive across a swap of its contents), data-form-success on the success component root, and data-fail on the form carrying the one line the server never gets to say.

Client side: one inline script per page, merged with what was already there — copy buttons on the workshop page, topic preselect on /contact/ — so the CSP stays at one hash per page. On submit it POSTs the FormData with X-Requested-With: fetch, parses the answer with DOMParser, then: 200 with a success block, put the form back to the markup it had at page load (which clears values, field errors and aria-invalid in one move) and insert the lifted block as a green notice above it; an answer that carries a form (422, and 503 too, which keeps the server wording instead of a generic line), swap the form contents, move the general message out of the form into a red notice above it, keep the field errors and typed values; anything else or a thrown fetch, a red notice from data-fail with the form untouched. The notice is focused, role=status for success and role=alert for failure, and only ever one at a time.

Turnstile: a container Turnstile has filled gets reset(box); a container that arrived with new markup gets render(box, {sitekey, theme}). The first test written was box.querySelector("iframe") and it was wrong — Turnstile puts the iframe out of reach of that query, so every attempt took the render branch. Verified in the browser with the api calls wrapped: reset on the standing widget, render after a swap, and a fresh cf-turnstile-response input in the swapped form.

CSS: .notice--ok and .notice--error already existed; added .notice--live for the block a script inserts. It sets margin-block-start rather than --flow-space because --flow-space inherits and the success block is a .flow container of its own, so setting it there would push that block's own paragraphs apart.

Verification without a server: npm run build clean, npm test 38 passed, npm run check:csp 5 pages 2 inline scripts all covered. Both built pages opened in the browser pane with fetch stubbed: 422, 200 and a thrown fetch exercised on each, screenshots taken of the red and the green block. AC #2 (JavaScript off) is left unticked: nothing on the non-JS path changed and the noscript hints and form method/action are intact in the built HTML, but the POST itself needs Mladen's server run.

Found in passing, not touched (rule 4): githubPattern in src/data/registration.ts is [A-Za-z0-9-]{1,39}, and Chrome now compiles the pattern attribute with the v flag, where an unescaped - in a character class is invalid. The browser drops the pattern (verified: "not valid!!" passes checkValidity) and logs an error, so the client-side GitHub username check is dead; the server side still catches it. Escaping the hyphen fixes it. Worth its own task.

Effort figures: 16 minutes of agent activity, 78 tool calls, one coder session (Opus, xhigh).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Both forms now answer in place. The endpoints were not touched: they keep rendering the whole page, and each page's one inline script lifts the part that changed out of the answer — the success block into a green notice above a form put back to empty, or the re-rendered form with its errors and typed values, the general message moved above it in red. A request that never arrives gets its own red line from the markup. Focus moves to the block every time and Turnstile is reset or rendered again. CSP carries the two new page-script hashes; build, tests and check:csp are green. Files: src/components/{RegistrationForm,ContactForm,RegistrationSuccess,ContactSuccess}.astro, src/pages/contact.astro, src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro, src/styles/components.css, public/_headers, scripts/check-csp.mjs, docs/spec-v1.md.
<!-- SECTION:FINAL_SUMMARY:END -->
