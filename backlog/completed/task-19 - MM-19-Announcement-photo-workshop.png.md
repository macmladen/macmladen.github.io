---
id: TASK-19
title: 'MM-19: Announcement photo: workshop.png'
status: Done
assignee: []
created_date: '2026-09-09 07:03'
updated_date: '2026-09-09 07:14'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Estimate: 0.25 h. Actual: . Billable: no. AI cost: pending script. AI time: 4 min. Replace the Pexels photo with docs/workshop.png (1536x1024, AI-generated classroom with code on the projector, supplied by Mladen). Move it to src/assets/workshop.png, remove workshop-room.jpg, drop the credit overlay (own image, no attribution), alt text describes the room. Keep the WebP pipeline; source stays PNG.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 src/assets/workshop.png committed, workshop-room.jpg removed, docs/workshop.png gone
- [x] #2 No credit overlay on the announcement; alt text present
- [x] #3 Home page under 150 KB
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
THE MOVE

`docs/workshop.png` was untracked, so `git mv` had nothing to rename — a plain
`mv docs/workshop.png src/assets/workshop.png` followed by `git rm
src/assets/workshop-room.jpg`. Git therefore records this as one addition and
one deletion rather than a rename; there is no shared history between the two
files anyway.

The source is 1536 × 1024 PNG, 2,116,395 B. It stays PNG in the repo, as the
task asked, and 2 MB of binary is what that costs. Astro's pipeline is what the
visitor sees.

INDEX.ASTRO

- `import roomPhoto from '../assets/workshop-room.jpg'` →
  `'../assets/workshop.png'`. The variable name `roomPhoto` is unchanged; it
  still describes the subject.
- Rendered at `width={800} height={533}`, `format="webp"`. 533 rather than the
  previous 534 because 1536 : 1024 is exactly 3 : 2 and 800 / 1.5 = 533.33, so
  533 is the value that does not stretch the image.
- `alt="Training classroom with laptops and code on the projector screen"`.
- The `<figure class="credit-frame">` wrapper and its `<figcaption class="credit">`
  are both gone. The `<Image>` is now a direct child of the `.split` grid, which
  is what the intro section above it already does with the headshot. Nothing in
  the layout depends on the element type — `.split--media-first > :nth-child(2)`
  matches the image just as it matched the figure — and `reset.css` zeroes all
  margins, so a `<figure>` was contributing nothing but a level of nesting.

CSS UNTOUCHED, ON PURPOSE

`.credit`, `.credit a` and `.credit-frame` stay in `src/styles/components.css`,
and `--color-overlay` / `--color-overlay-ink` stay in `src/styles/tokens.css`.
Nothing uses them now. They are three short rules and two tokens, the pattern is
described in the spec, and the next photograph that is not Mladen's own will
need them back. `.credit-frame{position:relative}` still appears in the built
HTML for that reason; it matches nothing.

WEIGHT

  dist/client/index.html                          17,473 B  (CSS inlined, no external CSS or JS)
  /_astro/mladen-head-2020...webp (560×560)       22,686 B
  /_astro/workshop...webp (800×533)               47,716 B
  ------------------------------------------------------
  HOME PAGE TOTAL                                 87,875 B  = 85.8 KB

Well inside AC #3's 150 KB. The new WebP is 47,716 B against the old
workshop-room WebP's 32,432 B — 15 KB more, because the AI-generated image has
far more fine detail (people, laptops, screen text) than the empty room it
replaces. Astro reports the compression as 2,066 kB → 46 kB. `/favicon.svg`
(310 B) is the only other request the page makes.

SPEC (docs/spec-v1.md)

The home-page markup bullet still described "an Unsplash photograph … with the
photographer credit and Unsplash link overlaid … per Unsplash's attribution
guideline" — stale since MM-14 swapped in a Pexels photo, and doubly stale now.
Rewritten to name `src/assets/workshop.png` as Mladen's own image, state that
there is no attribution and no overlay, give the 800 × 533 WebP rendering, and
say the `.credit` pattern is kept unused for a future photograph that does need
it. The acceptance-criteria line that read "the announcement carries the
Unsplash credit overlay" now reads "carries the classroom image with no credit
overlay".

VERIFIED

`npm run build` clean. In `dist/client/index.html`: no `figcaption` anywhere, no
`credit` class in any markup (the only match is the `.credit-frame` CSS rule),
and the img tag is
`<img src="/_astro/workshop.DDVTMr-4_21D2gH.webp" alt="Training classroom with
laptops and code on the projector screen" loading="lazy" decoding="async"
width="800" height="533" class="media">`. `docs/workshop.png` no longer exists;
`src/assets/workshop-room.jpg` is deleted in the index. The image itself was not
looked at — whether the render is a good picture is Mladen's call.

Effort: 4 min, 9 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. The announcement photo is Mladen's own: docs/workshop.png moved to src/assets/workshop.png with a plain mv (git mv was not possible, the file was untracked) and src/assets/workshop-room.jpg removed with git rm. src/pages/index.astro imports the new file and renders it at 800 × 533 WebP — 533, not 534, because 1536 × 1024 is exactly 3 : 2 — with alt "Training classroom with laptops and code on the projector screen". The figure wrapper and its figcaption credit are gone; the Image is now a direct child of the .split grid, matching how the intro section renders the headshot. The .credit, .credit a and .credit-frame rules and the two overlay tokens stay in place, unused, for a future photograph that needs attribution, and the spec now says so. Home page total is 87,875 B = 85.8 KB: 17,473 B of HTML with the CSS inlined, a 22,686 B headshot and the 47,716 B classroom WebP, plus a 310 B favicon. That is 15 KB heavier than the photo it replaces, because the new image has much more fine detail; still well inside the 150 KB criterion. docs/spec-v1.md: the home-page markup bullet described an Unsplash photo with an attribution overlay, stale since MM-14 and wrong now, so it was rewritten, and the matching acceptance line with it. The source PNG is 2.1 MB in the repo, as the task specified. Coder (Opus): 4 min, 9 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
