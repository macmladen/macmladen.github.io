---
id: TASK-7
title: 'MM-07: About page'
status: Done
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 18:05'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 1.5 h. Actual: . Billable: no. AI cost: pending script. AI time: 2 min. Narrow container. Headshot, full EN bio verbatim from the handover section 6, speaking list from speaking.ts with the Apatin and Speaker Deck links and the 40+ events line, community paragraph. ProfilePage JSON-LD with the Person as mainEntity. Spec: Pages 2.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Bio verbatim; speaking entries rendered from src/data/speaking.ts
- [x] #2 JSON-LD ProfilePage parses; one h1; no skipped heading levels
- [x] #3 No JavaScript shipped
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
src/pages/about.astro: three sections, each .container--narrow, each
aria-labelledby its own heading. h1 "About", then h2 "Speaking" and h2 "Community" —
one h1, no skipped level.

The bio paragraph renders person.bio, which MM-05 had already taken verbatim from
section 6 of the handover; nothing is retyped here. The speaking list is rendered
from src/data/speaking.ts: the event line is the event plus the year only when the
year is not null, the title line only appears when the title is not null, and the
title becomes a link only when the entry has a url. Drupal Dev Days Burgas therefore
renders as the event name alone, as the data demands — no year and no title were
invented. The summary line and the Speaker Deck link come from speaking.summaryLine
and the Speaker Deck entry in person.profiles.

The community paragraph is new copy written from the facts the spec lists (DaFED
founder, Drupal Camp Novi Sad, Drupal meetup, WordPress and Drupal communities). It
is marked <!-- draft: Mladen to approve --> in the source, as is the meta description,
because both are wording Mladen has not seen. Nothing beyond the spec's facts is
claimed.

The portrait is rendered at 240x240 with densities [1, 2], so the built markup has a
srcset with a 5 kB 1x and a 16 kB 2x file. The Person node in the JSON-LD points at
the same 560px webp the home page renders (getImage with the home page's options), so
both pages describe the entity with one image URL.

Verified against dist/client/about/index.html after npm run build (clean):
15,047 B, zero <link rel="stylesheet">, one inlined <style>, and the only <script> is
the application/ld+json block. The JSON-LD parses with node: a ProfilePage whose
mainEntity is the Person, isPartOf the home page's WebSite node.

Effort: 2 min, 7 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. /about/ built in the narrow container: headshot (240px, 2x srcset), the full EN bio verbatim from person.bio, the speaking list rendered from speaking.ts (null year and null title render as absence, not invention), the 40+ events line with the Speaker Deck link, and the community paragraph. ProfilePage JSON-LD with the Person as mainEntity parses. .portrait and the .appearances rules were added to components.css. The community paragraph and the meta description are marked draft in the source because the wording is new. Coder (Opus): 2 min, 7 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
