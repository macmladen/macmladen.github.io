---
id: TASK-28
title: 'MM-28: About page: corrected text, subheading, source links'
status: Done
assignee: []
created_date: '2026-09-09 09:19'
updated_date: '2026-09-09 09:26'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 12 min. Replace the about paragraphs with Mladen's corrected text (supplied 2026-09-09, in the task notes of the coder brief), add the subheading 'This is what I do.' under the h1 as on the old site, and add quality links (Wikipedia or the official source) on the named technologies, machines and cultural references, at most one link per term, first occurrence only.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All fourteen paragraphs verbatim as supplied, in order; gem as code; About in strong
- [x] #2 Subheading 'This is what I do.' directly under the h1
- [x] #3 Links present on the named terms, each to Wikipedia or the official site, opening in the same tab, no nofollow
- [x] #4 Build clean; heading order unchanged
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Mladen's corrected about copy replaces the 2014 text in `src/data/person.ts`. Thirteen paragraphs, not fourteen: the brief said fourteen but supplied thirteen, and thirteen is what the old array held too, so thirteen is taken as correct. AC #1 is ticked against the thirteen supplied.

The array entries are now template literals, so the `href` double quotes and Mladen's apostrophes both sit in the source unescaped. Straight apostrophes throughout, matching the rest of the file. British spellings kept: socialise, optimisation, practising.

Markup added on top of the verbatim text, and nothing else: `<code>` around gem, `<strong>` around About, and one `<a>` on the first occurrence of each named term. Same tab, no `rel`, no `target` — checked in the built HTML.

The three `<em>` spans the 2014 copy carried (Deep Space 9, fought, public) are not in the corrected text as supplied and were not reinstated. Deep Space 9 is now a link instead; "fought" and "public" lost their emphasis. Flagged for Mladen.

Two link-text judgement calls: the term list says "Ruby gem", so the anchor wraps the code element (`<a>Ruby <code>gem</code></a>`); and the sentence reads "Indecent (job) Proposal", so the anchor wraps the whole phrase including the parenthesis rather than splitting it in two.

Links, all verified with `curl -I` on 2026-09-09, all 200 except where noted:

- Ruby gem — https://rubygems.org/
- Star Wars — https://en.wikipedia.org/wiki/Star_Wars
- Deep Space 9 — https://en.wikipedia.org/wiki/Star_Trek:_Deep_Space_Nine
- gnostic — https://en.wikipedia.org/wiki/Gnosticism
- Buddhist — https://en.wikipedia.org/wiki/Buddhism
- Texas Instruments TI-57 — https://en.wikipedia.org/wiki/TI-57
- BASIC — https://en.wikipedia.org/wiki/BASIC
- Z80 — https://en.wikipedia.org/wiki/Zilog_Z80
- Tandy Radio Shack TRS-80 — https://en.wikipedia.org/wiki/TRS-80
- Sinclair ZX-81 — https://en.wikipedia.org/wiki/ZX81
- Spectrum — https://en.wikipedia.org/wiki/ZX_Spectrum
- Commodore 64 — https://en.wikipedia.org/wiki/Commodore_64
- C — https://en.wikipedia.org/wiki/C_(programming_language)
- x86 — https://en.wikipedia.org/wiki/X86
- DOS — https://en.wikipedia.org/wiki/MS-DOS
- Commodore 128D — https://en.wikipedia.org/wiki/Commodore_128
- CP/M — https://en.wikipedia.org/wiki/CP/M
- 6502 — https://en.wikipedia.org/wiki/MOS_Technology_6502
- RISC — https://en.wikipedia.org/wiki/Reduced_instruction_set_computer
- CISC — https://en.wikipedia.org/wiki/Complex_instruction_set_computer
- Apple ][ — https://en.wikipedia.org/wiki/Apple_II
- Macintoshes — https://en.wikipedia.org/wiki/Macintosh
- DTP — https://en.wikipedia.org/wiki/Desktop_publishing
- Adobe Photoshop — https://www.adobe.com/products/photoshop.html
- Illustrator — https://www.adobe.com/products/illustrator.html
- InDesign — https://www.adobe.com/products/indesign.html
- Drupal — https://www.drupal.org/ (302 to https://new.drupal.org/, which is 200; www.drupal.org kept as the canonical address)
- Indecent (job) Proposal — https://en.wikipedia.org/wiki/Indecent_Proposal
- The Meaning of Life — https://en.wikipedia.org/wiki/Meaning_of_life

Subheading: `<p class="subtitle">This is what I do.</p>` sits directly under the h1 in `src/pages/about.astro`. No such class existed, so `.subtitle` was added to `src/styles/components.css`: `--color-ink-soft`, `--text-lg`, and `--flow-space: var(--space-2)` so it hugs the heading instead of taking the flow layer's default 1rem gap. Tokens only, no bare values.

Verification, no server started: `npm run build` clean. The thirteen paragraphs plus the subtitle were extracted from `dist/client/about/index.html`, stripped of tags and entities, and diffed against the supplied copy — identical. Twenty-nine content anchors in the about section, each with `href` and nothing else; one `<code>gem</code>`, one `<strong>About</strong>`. Heading order unchanged: h1 About, h2 Speaking, h2 Community, plus the footer's hidden h2. The ProfilePage JSON-LD was not touched.

Effort: 20 tool calls, roughly 12 minutes of agent activity, one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The about text is now Mladen's corrected copy, thirteen paragraphs verbatim, with twenty-nine source links, one code element and one strong element as the only markup added. 'This is what I do.' sits under the h1 on a new .subtitle class built from tokens. Build clean, built page text diffed identical to the supplied copy, heading order and JSON-LD untouched.
<!-- SECTION:FINAL_SUMMARY:END -->
