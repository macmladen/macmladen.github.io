---
id: TASK-8
title: 'MM-08: Workshop page'
status: Done
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 18:14'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: pending script. AI time: 9 min. /speaking/2026/wordcamp-belgrade-ddev-ai/: header from workshop.ts, venue line, held in Serbian, WordCamp link; EN abstract from the handover section 2 with the two fixes; prerequisites checklist; prep guide placeholder line; registration close line; the form (nine fields, labels, fieldset, autocomplete, aria-describedby, aria-invalid, Turnstile widget); inline success state; closed state when past closeDate. Event (EducationEvent) + BreadcrumbList JSON-LD. Spec: Pages 3, Form fields.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Abstract carries the two fixes (rests on; DDEV in prerequisites)
- [x] #2 Form has all nine fields with the stated names, labels and hints; works with JavaScript disabled
- [x] #3 With closeDate in the past the form is replaced by the closed notice
- [x] #4 JSON-LD Event and BreadcrumbList parse; breadcrumb URLs use the reserved index paths
- [x] #5 Only Turnstile's script is loaded on this page
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Page: src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro, built as an
<article> holding four sections, each .container--narrow and each aria-labelledby its
own heading: the header and abstract (h1), Who it is for (h2), Prerequisites (h2),
Registration (h2, on the --color-bg-alt band). Rendered heading order is h1, h2, h2,
h2 plus the footer's visually hidden h2.

Copy moved into src/data/workshop.ts so the page template holds no prose: abstract
(five paragraphs), audience, prerequisites, optionalPrerequisite, summary,
prepRepoUrl, prepDeadline, plus street/city (the PostalAddress and the visible venue
line now come from the same two values) and wordcampName/Start/End. The abstract is
the EN translation from section 2 of the handover, character for character, with the
two flagged fixes: the workflow "rests on" three things, and DDEV is in the
prerequisites list, which the submitted text omitted. Straight quotes and apostrophes
were kept exactly as the source has them, so the paragraphs are literally verbatim;
if Mladen wants typographic quotes it is a one-line change in workshop.ts.
workshop.summary and the placeholder prep link are marked in the source (draft and
placeholder respectively) — prepRepoUrl points at github.com/macmladen until the
scaffolding repository is public.

Form: src/components/RegistrationForm.astro takes optional values and errors
props, so the same component renders the empty form on this page and the filled-in
form with errors from /api/register/ (MM-09). Nine fields with the spec's names:
name, email, github (pattern [A-Za-z0-9-]{1,39}), os, tool, ssh_key, own_hosting,
watch_only, newsletter. Labels are real <label for>, the three checkboxes sit in a
<fieldset> with a <legend>, hints and errors are wired through aria-describedby
(both ids when both are present) and failed fields get aria-invalid="true".
autocomplete is name / email / off. The Turnstile widget uses
import.meta.env.PUBLIC_TURNSTILE_SITE_KEY and falls back to Cloudflare's documented
always-pass test key. Field names and select options live in src/data/registration.ts
so the validator in MM-09 reads the same list.

The form posts to /api/register/ WITH a trailing slash, which is a deviation from the
spec's URL table (/api/register). Reason in MM-09's notes: the endpoint is an Astro
page, not a .ts endpoint, and trailingSlash: 'always' applies to pages.

Without JavaScript the form still submits and the server still validates and
re-renders (full-page POST, no script involved); Turnstile itself cannot produce a
token without JavaScript, so a <noscript> block names that honestly and gives the
email fallback rather than pretending.

Bug found and fixed here: registrationOpen was a module-scope constant
(MM-05). Under the Cloudflare adapter both the prerender and the deployed worker run
in workerd, where Date.now() returns 0 during module evaluation — the constant was
therefore true for ever, and the closed state could never ship. Proved it in a build
(module logged 1970-01-01 while the page's own call returned the right answer).
workshop.ts now exports only isRegistrationOpen(now?), which the page calls at render
time; closeDate is derived from closesAt so the two cannot drift.

Verified statically after npm run build (clean, 3 pages):
- dist/client/speaking/2026/wordcamp-belgrade-ddev-ai/index.html is 21,602 B, has zero
  <link rel="stylesheet">, one inlined <style>, and exactly two <script> tags: the
  application/ld+json block and Turnstile's api.js. Nothing else is loaded.
- The JSON-LD parses with node: Event (additionalType EducationEvent, Offline
  attendance, EventScheduled, inLanguage sr, Place with the split address, superEvent
  WordCamp Belgrade 2026, performer and organizer @id-referencing the Person node that
  travels in the same graph, offers 0 EUR validThrough the close date), the Person, and
  a BreadcrumbList Home -> /speaking/ -> /speaking/2026/ -> this page, exactly the
  reserved index paths.
- Values and errors: a throwaway prerendered page rendered the form with values and
  three errors; the built markup carried value="Ana Anić", the selected os and tool
  options, checked own_hosting and newsletter, the .notice--error summary with
  role="alert", both field errors, aria-invalid="true" and aria-describedby listing
  the hint and the error id. The throwaway page was deleted.
- Closed state: with closesAt set to a past date the build replaced the form with the
  closed notice and dropped Turnstile's script with it; the real date was restored and
  the form came back.

Not verified here: anything that needs a running server — Turnstile actually rendering,
submitting the form, Lighthouse. Those are MM-11 against Mladen's preview.

Effort: 9 min, 21 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. The workshop page is built: article header from workshop.ts (date and time in <time> elements, venue, held in Serbian, WordCamp link), the EN abstract with the two flagged fixes, the audience paragraph, the mandatory prerequisites checklist with DDEV added, the placeholder-marked preparation line, the close date, and the nine-field registration form as a reusable component that takes values and errors. Event + Person + BreadcrumbList JSON-LD parses and uses the reserved /speaking/ index paths. Success and closed-state components added; the closed state was exercised by building with a past close date. Fixed a real defect on the way: registrationOpen was computed at module scope, where workerd reports Date.now() as 0, so it was permanently true; openness is now asked at render time through isRegistrationOpen(). The form posts to /api/register/ with a trailing slash — see MM-09. Coder (Opus): 9 min, 21 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
