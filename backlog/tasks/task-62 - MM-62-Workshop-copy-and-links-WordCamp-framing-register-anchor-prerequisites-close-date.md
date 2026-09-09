---
id: TASK-62
title: >-
  MM-62: Workshop copy and links: WordCamp framing, register anchor,
  prerequisites, close date
status: Done
assignee: []
created_date: '2026-09-09 20:02'
updated_date: '2026-09-09 20:11'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 9 min. Mladen's list 2026-09-09: (1) secondary button label 'WordCamp Belgrade 2026'; (2) home eyebrow gains a first line 'WordCamp Belgrade 2026 · workshop' with the event name bold, then the date line; the workshop page eyebrow becomes 'WordCamp Belgrade 2026 · Workshop' with the event bold, so it reads as part of WordCamp; (5) register CTAs link to the workshop page with #register and the registration section carries id=register; (6) Prerequisites section opens with the paragraph 'It is perfectly fine if you wish to watch and participate by following and asking.'; (7) 'Installing them in the room costs everybody their workshop.' becomes 'We will not have enough time to install it all in the workshop, so please follow the preparation guide on GitHub.' with 'preparation guide on GitHub' linking to repoUrl; (8) closeDate 2026-09-17 (Thursday) everywhere: copy, registrationOpen, JSON-LD validThrough, success text.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All eight changes visible in the built pages; JSON-LD validThrough is 2026-09-17; #register anchor works from home and speaking
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Six of Mladen's eight items were in scope here; the list in the description numbers them (1), (2), (5), (6), (7), (8) and items (3) and (4) are not described in this task.

- `src/data/workshop.ts`: `closesAt` is now `2026-09-17T23:59:59+02:00`. It stays the only place the close date is written — `closeDate` slices it, `isRegistrationOpen` parses it, the Event offer's `validThrough` reads it, and both the open and the closed copy format it through `src/lib/dates.ts` in Europe/Belgrade. `Intl` formats it "Thursday, 17 September 2026", so the weekday is the one Mladen asked for. The ready-made `subtitle` string ('Workshop · WordCamp Belgrade 2026') was removed: the eyebrow is markup now, not a string, and nothing else read it.
- `src/pages/index.astro`: the eyebrow is two lines in one `.eyebrow` block — `<strong>WordCamp Belgrade 2026</strong> · workshop`, a `<br>`, then the unchanged date/time/venue line. The primary CTA points at `${workshop.path}#register`; the secondary button's label is now just `{workshop.wordcampName}`.
- `src/pages/speaking.astro`: the register button points at `${workshop.path}#register`. The closed-state link ("The workshop page") still points at the page itself, which is right — it is not a register CTA.
- `src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro`: eyebrow `<strong>WordCamp Belgrade 2026</strong> · Workshop`; Prerequisites opens with "It is perfectly fine if you wish to watch and participate by following and asking." and the mandatory line now ends "We will not have enough time to install it all in the workshop, so please follow the preparation guide on GitHub." with the phrase linking to `workshop.repoUrl`; the registration band carries `id="register"`.
- `docs/spec-v1.md`: the home announcement bullet (Pages 1) and the workshop page's eyebrow, prerequisites and close-date bullets (Pages 3) now describe all of the above, including that the close date is written once and derived everywhere.

Verification, no server started: `npm run build` clean, five prerendered routes; `npm run check:csp` — 5 pages, 2 inline scripts, all covered. In the built HTML: the home eyebrow is `<strong>WordCamp Belgrade 2026</strong> · workshop<br><time…>`, both register links are `/speaking/2026/wordcamp-belgrade-ddev-ai/#register`, the secondary button reads "WordCamp Belgrade 2026", the workshop page has `<section id="register" …>`, the copy reads "Registration closes Thursday, 17 September 2026" and the Event offer carries `"validThrough":"2026-09-17T23:59:59+02:00"`. The built home page opened as a file in the browser pane renders the eyebrow as two lines (44 px tall at --text-sm), the conference name bold, the date line under it.

Flagged, not changed: the Prerequisites section now links `workshop.repoUrl` twice — once as "preparation guide on GitHub" in the new sentence and again in the older "Preparation guide and materials will be on GitHub by Friday 11 September." line. Mladen may want the second line folded into the first. `RegistrationSuccess.astro` still says "there is no time to install them in the room", the phrasing item (7) replaced on the page; item (7) named only the prerequisites sentence, so it was left alone.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by coder (Opus 5, xhigh): the WordCamp framing, the register anchor, the prerequisites copy and the close date. The home eyebrow is two lines — "WordCamp Belgrade 2026 · workshop" with the conference name bold, then the date line; the workshop page eyebrow is "WordCamp Belgrade 2026 · Workshop"; the secondary button on home is labelled "WordCamp Belgrade 2026". Both "Register for the workshop" links point at `/speaking/2026/wordcamp-belgrade-ddev-ai/#register` and the registration band carries `id="register"`. Prerequisites opens with Mladen's "It is perfectly fine if you wish to watch and participate by following and asking." and sends people to the preparation guide on GitHub instead of the old "costs everybody their workshop" line. `closesAt` is 2026-09-17T23:59:59+02:00, written once and derived by the copy, `isRegistrationOpen`, `validThrough` and the closed notice; the formatted weekday is Thursday. Spec updated in Pages 1 and Pages 3. Build clean, check:csp clean, built HTML verified. AI time 9 min, ~30 tool calls, one Opus 5 session.
<!-- SECTION:FINAL_SUMMARY:END -->
