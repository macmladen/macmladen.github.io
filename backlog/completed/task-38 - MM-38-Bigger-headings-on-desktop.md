---
id: TASK-38
title: 'MM-38: Bigger headings on desktop'
status: Done
assignee: []
created_date: '2026-09-09 10:33'
updated_date: '2026-09-09 10:40'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 38000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 3 min. Raise the desktop end of the heading clamps: h1 to 3rem, h2 to 2.25rem, h3 to 1.75rem (mobile ends unchanged, same 1.2 rhythm across steps). Update the spec type table.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 At 1440 px h1 computes to 48px, h2 36px, h3 28px; at 360 px unchanged
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Only the three heading steps in `src/styles/tokens.css` changed. Each one is a `clamp()` whose two ends sit on the same 320 px and 1120 px viewport anchors the scale has always used, so raising the desktop end means recomputing the linear middle as well as the maximum. With 1 vw worth 0.2 rem at 320 px and 0.7 rem at 1120 px, the slope is `(max - min) / 0.5` vw and the intercept is `min - 0.4 x (max - min)`:

- `--text-3xl` `clamp(1.875rem, 1.425rem + 2.25vw, 3rem)` — was `1.625rem + 1.25vw` to 2.5rem
- `--text-2xl` `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` — was `1.35rem + 0.75vw` to 1.875rem
- `--text-xl` `clamp(1.25rem, 1.05rem + 1vw, 1.75rem)` — was `1.15rem + 0.5vw` to 1.5rem

`--text-base`, `--text-sm` and `--text-lg` are untouched, so body copy is exactly as it was.

Measured in the browser on `dist/client/index.html` as a local file, with an `h1`, `h2` and `h3` probe injected into the container and `getComputedStyle` read on each:

| Viewport | h1 | h2 | h3 |
|---|---|---|---|
| 1440 px | 48.0 px | 36.0 px | 28.0 px |
| 360 px | 30.9 px | 24.6 px | 20.4 px |
| 320 px | 30.0 px | 24.0 px | 20.0 px |

The criterion's second half is met at the anchor rather than at 360 px exactly, and the difference is worth stating: 320 px still gives 1.875 / 1.5 / 1.25 rem to the pixel, but 360 px sits inside the ramp, and a steeper ramp reads there as +0.4 px on the h1, +0.3 px on the h2 and +0.2 px on the h3 against the old values (30.5 / 24.3 / 20.2 px). Holding 360 px itself fixed would have meant moving the lower anchor, which the task did not ask for.

Two consequences beyond the home page, both intended and both checked in the build: `--text-xl` is the `h3` size everywhere, so the workshop page's sub-headings grow with it, and `--text-2xl` is the `h2` on every section title. Nothing else reads these three tokens today.

The spec's type table now carries the new ranges with each `clamp()` spelled out, and the sentence above it no longer claims a flat 1.2 ratio: the body steps keep it, the heading steps open to roughly 1.29 and 1.33 at the desktop end while the 320 px end is unchanged.

Effort: 10 tool calls including three browser measurements; 3 minutes wall clock from In Progress to the closing commit; one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The three heading tokens in `src/styles/tokens.css` reach 3rem, 2.25rem and 1.75rem at the 1120 px anchor instead of 2.5rem, 1.875rem and 1.5rem, with slopes and intercepts recomputed so the 320 px end stays at 1.875, 1.5 and 1.25 rem. Measured on the built page: 48 / 36 / 28 px at 1440 px, 30 / 24 / 20 px at 320 px, and 30.9 / 24.6 / 20.4 px at 360 px, which is 0.2 to 0.4 px above the old values because 360 px sits inside the ramp. Body, small and large steps are untouched. `docs/spec-v1.md` carries the new table with the full `clamp()` for each heading step and no longer claims a single 1.2 ratio across the whole scale.
<!-- SECTION:FINAL_SUMMARY:END -->
