---
id: TASK-65
title: 'MM-65: Speaking page from the researched history'
status: Done
assignee: []
created_date: '2026-09-09 20:35'
updated_date: '2026-09-09 20:49'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 9. Rewrite src/data/speaking.ts from docs/speaking-research.md: every confirmed or likely appearance that has a deck or a recording, plus the confirmed events without one (Burgas 2024: workshop 'Drupal and Next: practical workshop', Drupal Developer Days, 26–28 June 2024; Drupal Camp Novi Sad 2024 opening and panel; DrupalCamp Pannonia 2018), the two podcast guest slots as kind podcast, the unclear DrupalCon Amsterdam 2019 row left out. Fields: year, date if known, event, city, title, kind (talk/workshop/panel/podcast/lecture), url (event or session page), deck, video. /speaking/ renders grouped by year, newest first, each entry with title, event and city, kind, and small inline-SVG icon links for deck and video (visually hidden labels); the current-workshop highlight and CTA stay on top; the 40+ events line stays. JSON-LD ItemList from the same data with the deck and video as sameAs. Speaker Deck link in the intro line remains.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 speaking.ts holds every approved row with sources; nothing invented; Burgas title as given
- [x] #2 /speaking/ groups by year with deck and video icon links; JSON-LD parses
- [x] #3 Build, tests and CSP check clean; no new scripts
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Thirty-one entries in src/data/speaking.ts, each with a source: comment naming
its row in docs/speaking-research.md. Verified against the research
mechanically: every http URL in the data file appears verbatim in the research
document (one script pass, 44 URLs, all matched).

Built page checked in dist/client/speaking/index.html: ten year headings
(2025 down to 2011) in descending order, 30 list items plus the WordCamp
Belgrade highlight above them; 24 Speaker Deck marks and 11 YouTube marks with
their visually hidden labels; the JSON-LD parses, holds 31 ItemList items, 27
of them with sameAs and 35 sameAs URLs in total; the only <script> on the page
is the ld+json block. The two icon paths were rasterised with sharp and looked
at: a projector screen and a play button, both correct as outlines.

npm run build clean, npm test 38 passed 0 failed, npm run check:csp 5 pages
2 inline scripts all covered.

Effort figures: about 9 minutes of agent activity, roughly 50 tool calls,
one Opus 5 session, no subagents spawned.

Three judgement calls, all flagged to Mladen rather than settled silently:
the Serbian Drupal Community Meetup 2023 is in (likely confidence, recordings
said to exist on drupal.rs but no URL found); the second podcast row, which the
research dates to no year at all, sits in 2024 because the research calls it
the same or a companion recording to the Websites Workshop episode; and the
three VTS lectures are filed under the school's full name, Visoka tehnicka
skola strukovnih studija.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
/speaking/ now carries the whole researched record rather than five entries.
src/data/speaking.ts holds 31 appearances from 2011 to 2026, each sourced to
its row in docs/speaking-research.md; Appearance gained date, city, deck and
video, kind gained panel, podcast and lecture, and appearancesByYear groups the
sorted array into the sections the page renders. The page shows the WordCamp
Belgrade 2026 workshop on top with its register link, then one section per
year, newest first, each entry reading title, event and city, and a quiet row
with the kind and up to two marks - a projector screen to the deck, a play
button to the recording, drawn on the footer's pattern with visually hidden
names. The ItemList in the JSON-LD reads the same array and carries the deck
and the recording as sameAs, the recorded day as startDate and the city as
location. The spec's 2b paragraph and its JSON-LD list describe the page as
built. Nothing was invented: where the research leaves a cell empty the field
is null, and DrupalCon Amsterdam 2019 stays out.
<!-- SECTION:FINAL_SUMMARY:END -->
