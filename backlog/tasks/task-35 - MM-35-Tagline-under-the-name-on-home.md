---
id: TASK-35
title: 'MM-35: Tagline under the name on home'
status: Done
assignee: []
created_date: '2026-09-09 10:01'
updated_date: '2026-09-09 10:08'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 2 min. Under the h1 on the home intro a tagline line in the subtitle style. Draft text, marked for approval: 'Senior developer, architect, IA and AI guy.' Alternatives listed in the report. The tagline also becomes person.jobTitle-adjacent data: keep jobTitle as is, add person.tagline used by the page.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Tagline renders under the name as .subtitle, draft-marked in source, from person.ts
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
`person.tagline` is a new export in `src/data/person.ts`, "Senior developer, architect, IA and AI guy.", carried into the `person` object next to `jobTitle`. `jobTitle` is unchanged and is still the only one of the two the JSON-LD `Person` node reads; nothing in `src/lib/schema.ts` was touched. The export carries a JSDoc `draft: Mladen to approve` marker saying why the two strings are allowed to differ — one is the formal title the machines get, the other is the spoken line the page shows.

`src/pages/index.astro` renders it as `<p class="subtitle">{person.tagline}</p>` immediately after the h1 inside the intro `.flow` column, preceded by `<!-- draft: Mladen to approve -->`. That comment survives into the built HTML, so the draft state is visible in the artefact and not only in the source.

No CSS was written. `.subtitle` already exists in `src/styles/components.css` from `/about/` and already sets `--flow-space: var(--space-2)`, which pulls the line tight under the heading; the intro column is a `.flow`, so it picks that up with no further work.

`docs/spec-v1.md`, home intro bullet: the sentence said "No positioning slogan, no \"what I do\" list." A tagline under the name is a positioning slogan, so leaving that sentence as written would have put the spec straight into conflict with the page. It now reads "No \"what I do\" list." followed by a sentence naming `person.tagline`, its `.subtitle` styling, its draft state and the fact that `jobTitle` is unchanged.

Verification, no server started: `npm run build` clean, five prerendered routes. `dist/client/index.html` carries `<h1 id="intro-title">Mladen Đurić</h1><!-- draft: Mladen to approve --><p class="subtitle">Senior developer, architect, IA and AI guy.</p>` and the inlined `.subtitle` rule.

Flagged, not changed: the same spec bullet still says "Image left, text right at 768 px and up", which has been wrong since MM-13 put the portrait on the right. That is a separate correction and was left alone. Also: "IA" is unexplained on the page — a reader who does not know information architecture reads it as a typo next to "AI". That is a copy decision for Mladen, and the three alternatives went to him in the report rather than into the source.

Effort: 8 tool calls; 2 minutes wall clock from setting the task In Progress to this commit; one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
person.tagline is a new draft-marked export in src/data/person.ts, "Senior developer, architect, IA and AI guy.", carried on the person object beside an unchanged jobTitle; the JSON-LD still reads jobTitle only. The home intro renders it as <p class="subtitle"> directly under the h1, preceded by an HTML draft comment that survives into the built page. No CSS written — .subtitle already existed for /about/ and already pulls itself tight under a heading. The spec bullet that said "No positioning slogan" was corrected, since the tagline is one. Three alternative taglines went to Mladen in the report.
<!-- SECTION:FINAL_SUMMARY:END -->
