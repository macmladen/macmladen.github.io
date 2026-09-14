---
id: TASK-79
title: 'MM-79: Workshop page aligned with the v2 description; Resources section'
status: Done
assignee: []
created_date: '2026-09-14 07:23'
updated_date: '2026-09-14 07:30'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 6. Mirror the v2 text sent to the organisers (wordcamp-page-request.md, 2026-09-13) in English: new abstract (workshop, Invictus, three pillars, chat contrast, the one-full-loop paragraph; the theme-and-plugin paragraph goes), new one-sentence audience, a 'Three ways to follow' list, prerequisites keep the list plus the OS/ddev start note, the stale 'by Friday 11 September' line removed. New 'Resources' section as the last content section before the registration band: Registration (anchor), Preparation guide and repository, Slides on Speaker Deck, Slides on Google Slides, Session page at WordCamp Belgrade. JSON-LD: maximumAttendeeCapacity 30, deck URLs in sameAs. Facts: seats line mentions 'for working on your own laptop'.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Page text matches the v2 description in English; Resources section last before the form with the five links; JSON-LD carries capacity and deck URLs; build, tests, check:csp clean
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-14.

src/data/workshop.ts — `abstract` is now four paragraphs translated from the v2 description (wordcamp-page-request.md, 2026-09-13): the "neither hype nor a luxury" sentence unchanged; the Invictus paragraph and the three pillars merged into one, as v2 has them; the "chat" contrast shortened to what v2 says, so the sentence about it being "a good practice you adapt to your team" is gone with the original; and the one-full-loop paragraph with the arrow chain and what everyone leaves with. The theme-and-plugin paragraph is removed. `audience` is the single v2 sentence. New: `waysToFollow` (three strings), `osNote` and the two deck URLs, `slidesSpeakerDeck` and `slidesGoogle`. `prepDeadline` is removed. Every new string carries an `approved-pending` comment naming MM-79 rather than the `draft:` marker, since Mladen approves the translation rather than writing it.

`osNote` is an object of three parts — `before`, `command`, `after` — not one string. The note has to render `ddev start` inside `<code>`, and three fields in the data file are simpler and safer than a template that cuts a sentence apart at a substring.

src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro — a new "Three ways to follow" band (`aria-labelledby="ways-title"`) between "Who it is for" and the prerequisites, rendering `waysToFollow` as a `<ul>`. The prerequisites lose the "Preparation guide and materials will be on GitHub by Friday 11 September" line and gain the OS note as their closing paragraph, with the command in `<code>`. A new "Resources" band (`aria-labelledby="resources-title"`) is the last content section before `#register`: a `<ul>` of Registration (`#register`, rendered only while `isRegistrationOpen()`), Preparation guide and repository, Slides on Speaker Deck, Slides on Google Slides, and Session page at WordCamp Belgrade 2026. Both built-in seats lines read "30 seats for working on your own laptop"; the postbuild link step gives the four outward links their target and rel as it does every other external link.

The page's inline script: the two filled variants now say what the seats are for — "N of 30 seats left for working on your own laptop" and "All 30 seats for working on your own laptop are taken; you can still register to watch" — and the comment that quotes the built-in line was corrected with them.

src/lib/schema.ts — the Event gains `maximumAttendeeCapacity: workshop.capacity` and `sameAs` is now the array [sessionUrl, slidesSpeakerDeck, slidesGoogle] instead of the single session URL.

src/lib/confirmation.ts and scripts/test-confirmation.mjs — `prepDeadline` had one other reader, the confirmation email, not RegistrationSuccess.astro as the task guessed. Following the same instruction, the mail's preparation sentence now ends at the repository URL and says nothing about a date; the deadline it named (Friday 11 September) had already passed. The test's "names the day the guide lands" check is replaced by two: the sentence ends at the repository, and no preparation deadline is left in the text. The header comment records the one change to copy Mladen approved on 2026-09-10.

public/_headers — the workshop page's inline script changed, so its CSP hash did: sha256-KQmpuos6a2ww4i8HpvOVQGiI2oMakCwkuVTylV1lGNc= becomes sha256-t5W0p2sopyUF9qUkdCNlY85tGDI1fB13uJGAY4tC3Qo=. The /contact/ hash is untouched.

docs/spec-v1.md — Pages 3 rewritten where it describes this page: the abstract bullet names the v2 source and the four paragraphs, new bullets for "Who it is for" and "Three ways to follow", the prerequisites bullet carries the OS note and records that the deadline line went with `prepDeadline`, a new Resources bullet lists the five links and the condition on the first, the seats sentences carry the new wording, the JSON-LD bullet names `maximumAttendeeCapacity` and the three `sameAs`, and a bullet lists the six bands in order. The rhythm bullet's "four bands" is now "six bands", which is the same page's own sentence rather than unrelated code.

Verified: `npm run build` clean. `npm test` green — 80 + 38 + 20 + 19 (the confirmation suite gained one check). `npm run check:csp` 5 pages, 2 inline scripts, all covered. The built HTML has the sections in order (title/facts/abstract, Who it is for, Three ways to follow, Prerequisites, Resources, Registration), both seats lines read "30 seats for working on your own laptop", the prerequisites end with the OS note and `<code>ddev start</code>`, and the Resources list carries all five links. The JSON-LD parses: Event, Person, BreadcrumbList, with maximumAttendeeCapacity 30 and three sameAs URLs. Both deck URLs answer 200 to curl, neither redirecting.

Judgement calls, for the record: the all-seats-taken script line puts "for working on your own laptop" beside "seats" rather than at the very end, where it would have followed "you can still register to watch" and read as if the watching were the thing on the laptop. The OS note sits after the optional SSH line, as the task's order lists it, rather than beside the install list where the Serbian has it.

Effort measured: about 6 minutes of agent activity, 37 tool calls, two of them the curl checks on the deck URLs. No server was started and nothing was deployed or pushed.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The workshop page now says what the v2 description sent to the WordCamp organisers says: a four-paragraph abstract built around the Invictus project, the three things the workflow rests on and one full loop live on the participants' machines; a one-sentence "Who it is for"; a "Three ways to follow" list, so the install list is visibly not the price of admission; prerequisites closing with the guides-per-OS note and `ddev start` to run at home; and a "Resources" section holding every link this workshop has — registration, the repository, both decks and the session page — as the last thing before the registration band. The seats lines say what a seat is for, the Event carries its capacity and all three sameAs URLs, and the stale preparation deadline is gone from the page, the data file and the confirmation email. The new strings are marked approved-pending: the translation is Mladen's to approve.
<!-- SECTION:FINAL_SUMMARY:END -->
