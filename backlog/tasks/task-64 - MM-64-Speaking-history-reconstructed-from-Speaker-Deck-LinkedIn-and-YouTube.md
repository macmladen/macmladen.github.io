---
id: TASK-64
title: 'MM-64: Speaking history reconstructed from Speaker Deck, LinkedIn and YouTube'
status: In Progress
assignee: []
created_date: '2026-09-09 20:07'
updated_date: '2026-09-09 20:23'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . Research pass: every talk and workshop findable on speakerdeck.com/macmladen (title, event, date, deck URL), Mladen's public LinkedIn profile, and YouTube (BalCCon talk and any other recordings), plus the events already in src/data/speaking.ts. Output: docs/speaking-research.md with one row per appearance (year, event, city, title, kind, deck URL, video URL, source, confidence) and a proposed replacement speaking.ts in the same doc, for Mladen's approval before it goes into the data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 docs/speaking-research.md lists every appearance found with sources; unknowns marked, nothing invented
- [ ] #2 Proposed speaking.ts content included, awaiting Mladen's approval
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Sources consulted: speakerdeck.com/macmladen (24 decks, both listing pages, every deck page fetched for date/description/slide-count via curl+JSON-LD, slide count = count of CreativeWork entries per deck, exact); YouTube (search + macmladen's own channel + BalCCon's channel + Drupaljam's channel + Drupal Camp Skopje's channel + Drupal IronCamp's channel + Studio Present's channel, via browser tools; video publish dates pulled via curl to cross-check against deck dates); rs.linkedin.com/in/macmladen public view (not logged in — Experience section is sign-in gated, only recent Activity and Volunteer/Certifications visible); WebSearch and WebFetch for DrupalCamp Novi Sad 2024 (ns2024.drupal.rs), drupal.org/u/macmladen profile (fetched via WebFetch's summarizer only — raw curl is Cloudflare-blocked), drupal.rs, WordCamp Belgrade 2026 speaker page, thedroptimes.com, Merkle's Drupal blog, DrupalCamp Pannonia's own site and itcsubotica.org.rs.

Counts: 24 Speaker Deck decks catalogued in full (title, date, slide count exact, deck URL, description). Found 8 additional appearances beyond Speaker Deck (DrupalCamp Pannonia 2018, Serbian Drupal meetup 2023, DrupalCamp Novi Sad 2024 panel, Drupal Dev Days Burgas dated to 2024, DrupalCon Amsterdam 2019 unclear/attendee-only, 2 podcast guest slots) plus corroborating YouTube videos for 7 of the Speaker Deck talks. Total rows in docs/speaking-research.md table: 32.

Could not access/confirm: Drupal Dev Days Burgas session title (event site ddd2024.drupalcamp.bg is down, cert mismatch, not in Wayback Machine); LinkedIn's Experience section (sign-in gated); Varna (no hits under any search); thunder.org DrupalCon Amsterdam article (403 to WebFetch and to the browser, not archived).

AI time: this session, browser tool calls (~20 navigations/reads) + ~15 curl calls + 6 WebSearch + 6 WebFetch. Wall time approx. 45–55 minutes of agent activity.

Output: docs/speaking-research.md with full table (year/event/city/title/kind/deck/video/source/confidence) and a proposed speaking.ts array (7 entries: existing 5 with 2 corrections — DrupalJam Utrecht 2024 title, Drupal Dev Days Burgas year — plus 2 new: DrupalJam Utrecht 2023, DrupalCamp Pannonia 2018), with everything else (camp-tier 2011–2017 finds, BalCCon, meetup/lecture tier, podcasts) listed separately for Mladen's own call on inclusion, per the doc's 'Proposed speaking.ts' section.
<!-- SECTION:NOTES:END -->
