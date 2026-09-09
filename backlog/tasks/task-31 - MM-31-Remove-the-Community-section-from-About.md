---
id: TASK-31
title: 'MM-31: Remove the Community section from About'
status: Done
assignee: []
created_date: '2026-09-09 09:33'
updated_date: '2026-09-09 09:38'
labels:
  - chore
milestone: m-2
dependencies: []
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: . The Community paragraph goes; /about/ is the h1, subtitle, portrait and the thirteen paragraphs.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No Community heading on /about/; heading order valid
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The `<section aria-labelledby="community-title">` block was deleted from `src/pages/about.astro` in one piece: the section element, the `<h2 id="community-title">Community</h2>`, the `<!-- draft: Mladen to approve -->` marker and the DaFED paragraph. Nothing else on the page changed, and no CSS was touched — the block used only shared `.section`/`.container--narrow`/`.flow` classes.

The facts in that paragraph (DaFED founder, Drupal Camp Novi Sad, the Drupal meetup, both communities) are not lost: the same ground is covered by `bio` in `src/data/person.ts`, which feeds meta descriptions, and the paragraph was draft copy Mladen had not approved.

Verification, no server started: `npm run build` clean, no warnings. In `dist/client/about/index.html` the headings are now `h1 About`, `h2 Speaking` and the footer's visually hidden `h2 Elsewhere` — one h1, no skipped level. The string "Community" does not occur anywhere in the built page. Landmarks intact: `header`, `nav aria-label="Main"`, one `main#main`, `footer`.

Flagged, not changed here: `docs/spec-v1.md` still describes a "Community" bullet under section 2 `/about/` and still lists "and the community paragraph" in its acceptance criteria. That prose belongs to the spec pass and was left for Mladen to decide on.

Effort: 3 tool calls for the change and its verification, about 4 minutes of agent activity, one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The Community section is gone from /about/. The page is now h1 About, the subtitle, the portrait, the thirteen paragraphs, and (until MM-30) the Speaking list. Build clean; the built page has one h1, valid heading order and no occurrence of the word Community.
<!-- SECTION:FINAL_SUMMARY:END -->
