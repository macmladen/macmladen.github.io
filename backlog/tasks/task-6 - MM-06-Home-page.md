---
id: TASK-6
title: 'MM-06: Home page'
status: Done
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 18:01'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: pending script. AI time: 7 min. Intro section with the headshot (from jekyll branch, WebP via Astro Image, eager, fetchpriority high) and the approved two paragraphs verbatim. Workshop announcement block: Unsplash empty classroom photo with credit overlay (left), eyebrow 18 September · 12:20 · Dom Omladine Beograda, title, catchy two-sentence intro (draft, marked), CTA to /speaking/2026/wordcamp-belgrade-ddev-ai/ (right). WebSite + Person JSON-LD. Spec: Pages 1.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Sections in order intro, announcement, footer; halves stack on mobile and sit side by side at 768px and up
- [x] #2 Approved copy verbatim; workshop intro marked draft in source
- [x] #3 Unsplash image committed under src/assets with photographer credit and Unsplash link overlaid; file, source URL and size recorded in the task summary
- [x] #4 JSON-LD WebSite and Person parse and match the page
- [x] #5 No JavaScript shipped; page under 150 KB including images
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
src/pages/index.astro renders two sections plus the shared footer. Both use
.split with .split--media-first, so the image is the second child in the source
(the headings stay first for reading order) and lands first on mobile and left of
the text from 768px up.

Copy: the two approved paragraphs are in src/data/person.ts as `intro`, verbatim
from docs/spec-v1.md, kept separate from `bio` (the longer EN bio /about/ uses).
The workshop teaser is two sentences preceded by <!-- draft: Mladen to approve -->,
which survives into dist/client/index.html. The meta description is purpose-written
and carries the same draft marker as a frontmatter comment; it replaces the
person.bioShort placeholder MM-05 left behind.

New shared code: src/lib/schema.ts (graph, personNode, personRef, webSiteNode,
profilePageNode — every value from src/data, absolute URLs built from Astro.site)
and src/lib/dates.ts (Intl formatters pinned to Europe/Belgrade: dayAndMonth,
fullDate, timeOfDay). src/styles/components.css gained .section--alt (sets
--section-bg to --color-bg-alt) and .media (image fills its column, 4px radius).

Images: src/assets/mladen-head-2020.jpg (1024x1024, 109 kB, from the jekyll branch)
and src/assets/workshop-room.jpg (1600x1067, 233 kB, Unsplash, "Rows of empty desks
in a modern conference room" by runda choo,
https://unsplash.com/photos/rows-of-empty-desks-in-a-modern-conference-room-8seo3zZSoBM,
Unsplash License) are both committed here. Astro emits
mladen-head-2020...webp 560x560 at 22.7 kB (eager, fetchpriority high, decoding sync)
and workshop-room...webp 800x534 at 37.1 kB (lazy). getImage() is called with exactly
the headshot's <Image> options so the Person node's image URL is the file the page
renders; the build produces two webp files, not four.

Verified against dist/client after npm run build (clean, no warnings):
index.html 14,481 B; total home-page weight 72.8 kB including both webp images and
the favicon, against a 150 kB budget. Zero <link rel="stylesheet">, one inlined
<style>, and the only <script> is the application/ld+json block (data, not code).
The JSON-LD parses with node and contains WebSite and Person with the values from
src/data/person.ts. Landmarks header/nav/main/footer present, one h1, h2 for the
announcement, both sections aria-labelledby their own heading, both <time> elements
carry ISO datetime values.

Not verified here: the 360/1440 px visual check and Lighthouse, which need the
server Mladen starts (MM-11).

Effort: 7 min wall clock (4 min on the task, 3 min of shared reading:
AGENTS.md, docs/spec-v1.md, tasks 6-9, the existing components and CSS),
15 tool calls after the task went In Progress.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. Home page built: intro split (headshot + the two approved paragraphs) and the workshop announcement split (Unsplash room photo with credit overlay, eyebrow with two <time> elements, h2, draft-marked two-sentence teaser, primary CTA to the workshop page and a secondary link to WordCamp Belgrade 2026), WebSite + Person JSON-LD from src/lib/schema.ts. Added src/lib/schema.ts, src/lib/dates.ts, person.intro, .section--alt and .media in components.css, and both images under src/assets. Build clean; home page 72.8 kB total, no executable JavaScript, JSON-LD parses. Coder (Opus): 7 min including the shared reading, 15 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
