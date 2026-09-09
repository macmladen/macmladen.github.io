---
id: TASK-53
title: 'MM-53: Workshop facts block: date, time, venue with a map pin'
status: Done
assignee: []
created_date: '2026-09-09 14:09'
updated_date: '2026-09-09 14:18'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 12 min. The header facts on the workshop page (date and time, venue and address, language) become a styled facts block: a definition-style list with small labels in the eyebrow colour, values in body ink, the venue linking to Google Maps (https://www.google.com/maps/search/?api=1&query=Dom+omladine+Beograda%2C+Makedonska+22%2C+Beograd) with an inline SVG pin icon; no map embed. Same block reused on the home announcement eyebrow if it fits. Tokens only.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Facts block renders date/time, venue with a working Maps link and pin icon, language; readable at 360 px
- [x] #2 JSON-LD location unchanged; page still ships no JavaScript beyond Turnstile
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Done 2026-09-09. New component src/components/Facts.astro renders <dl class="facts"> with three rows: When (fullDate + timeOfDay from src/lib/dates.ts, both ends wrapped in <time> with the ISO values from workshop.ts), Where (an aria-hidden inline map-pin SVG, then the venue name linking to the Google Maps search URL, then the address), Language (Serbian). It replaces the four <li> header lines on src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro; the unused timeOfDay import was dropped from that page.

Two calls worth naming. First, the WordCamp link was the fourth <li> of the old list but is not one of the three facts the task specifies, so it now sits as a plain paragraph under the block, keeping MM-52's label and target. Second, the task said to style the block in components.css, but .contact — the same dt/dd shape — is split across the two layers, so the grid placement went into layout.css beside it and only colour and type into components.css. The charter's layout/appearance separation won over the letter of the instruction; the visible result is the one asked for.

The pin sits outside the anchor so it does not collect the underline every body link carries, and it is spaced with margin-inline-end rather than a source space, which the build's minifier strips. Home announcement keeps its eyebrow line: three labelled rows would crowd the narrow half of the two-half block, where one compact line reads better.

Verified: build exit 0; the dl, the pin path, the Maps href and the session link all present in dist; JSON-LD location node byte-identical to before; still only the ld+json block and Turnstile in <script>; home page HTML unchanged. Rendered the built file at 375 px and at 900 px in the browser pane (static file, no server): rows stack on the phone and sit label-beside-value on the wide view, values aligned in one column. AI time 12 min, 22 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09: workshop page header is now a three-row facts block (Facts.astro) with a map-pin link to the venue; the WordCamp session link moved below it. Home keeps its eyebrow. Spec Page 3 and the accent-muted notes updated. Build clean, checked in dist and rendered at 375 and 900 px. AI time 12 min, 24 tool calls.
<!-- SECTION:FINAL_SUMMARY:END -->
