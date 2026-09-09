---
id: TASK-37
title: 'MM-37: Name as Mladen Djuric'
status: Done
assignee: []
created_date: '2026-09-09 10:33'
updated_date: '2026-09-09 10:37'
labels:
  - chore
milestone: m-2
dependencies: []
ordinal: 37000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 4 min. English site: person.name becomes Mladen Djuric (ASCII) everywhere it renders: h1, titles, footer copyright, JSON-LD, alt text, About. Speaker bios in data keep whatever spelling they carry inside quoted text.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No Đurić in built HTML except inside verbatim quoted bio text; title pattern reads · Mladen Djuric
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
`person.name` is now `Mladen Djuric`, so every place that reads it changed at once: the home `h1`, all four `<title>` strings, `og:site_name`, the footer copyright line and the `Person` / `ProfilePage` JSON-LD. Four hand-written strings carried the spelling separately and were changed with it: the `alt` on both headshots (`src/pages/index.astro`, `src/pages/about.astro`), the `/contact/` meta description, and the `Props` comment in `src/components/Head.astro` that documents the title pattern. In `docs/spec-v1.md` the head-tag line now reads `"Page · Mladen Djuric" (home: "Mladen Djuric · MacMladen")`.

Verbatim copy was left alone, as the task says. Four occurrences of `Đurić` remain in the repo's text, all of them inside quoted approved copy: `person.bio` and `person.bioShort` (the WordCamp handover bio), `person.intro` (the home paragraphs Mladen approved on 2026-09-08), and the block quote of that same intro in `docs/spec-v1.md`. Exactly one of them reaches the built HTML — the first sentence of the home intro, three lines under the `h1` that now reads `Mladen Djuric`. The two spellings therefore sit side by side on the home page. That is what the task asks for, but it is the one thing worth Mladen's eye: if the intro should read `Djuric` too, it is a one-word change to approved copy and his to make.

Two occurrences outside the task's scope were left as they are and are flagged rather than changed:

- `public/favicon.svg` draws the monogram `MĐ` and its `aria-label` says `MĐ`. Changing it to `MD` is a design decision about the mark, not a text fix.
- `src/data/speaking.ts` has `WordPress Meetup Vršac`, a place name, which is correct as written.

One edit was made outside the two paths the task named: `README.md` line 5 described the site as "The personal site of Mladen Đurić (MacMladen)". It is our own prose stating the same fact the task changes everywhere else, so leaving it would have made the README stale the moment this task closed. Stated here because it was a judgement call, not something the task text asked for.

Verification, no server started: `npm run build` clean, five prerendered routes. In `dist/client`, `grep -rlF "Đurić"` matches one file, `index.html`, with one occurrence, and it is inside the intro paragraph. The four titles read `Mladen Djuric · MacMladen`, `About · Mladen Djuric`, `Speaking · Mladen Djuric`, `Contact · Mladen Djuric`; `og:site_name`, both JSON-LD `name` values, both `alt` attributes and the footer's `© 2026 Mladen Djuric` all carry the ASCII form.

Effort: 12 tool calls, 4 minutes wall clock from In Progress to the closing commit; one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
`person.name` in `src/data/person.ts` is `Mladen Djuric`, which carries the ASCII spelling into the home `h1`, every `<title>`, `og:site_name`, the footer copyright and the JSON-LD; the two headshot `alt` strings, the `/contact/` meta description, the `Head.astro` Props comment, the spec's head-tag line and the README line were changed to match. The quoted bio copy is untouched: `person.bio`, `person.bioShort`, `person.intro` and the spec's block quote of the intro keep `Đurić`, and one of those — the home intro's first sentence — is the single remaining occurrence in the built HTML, which is what the acceptance criterion allows. `public/favicon.svg`'s `MĐ` monogram is flagged, not changed.
<!-- SECTION:FINAL_SUMMARY:END -->
