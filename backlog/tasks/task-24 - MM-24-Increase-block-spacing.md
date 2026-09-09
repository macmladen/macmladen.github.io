---
id: TASK-24
title: 'MM-24: Increase block spacing'
status: Done
assignee: []
created_date: '2026-09-09 07:33'
updated_date: '2026-09-09 07:39'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Estimate: 0.25 h. Actual: . Billable: no. AI cost: pending script. AI time: 4 min. Sections feel tight. Raise the vertical padding of .section (mobile and desktop steps) by roughly half again, and the gap between the two halves of .split, via tokens only. Report the before and after values.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Section vertical padding and split gap increased through tokens; values in notes
- [x] #2 No horizontal scroll at 360 px
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
BEFORE AND AFTER

| Rule | Token before | Value before | Token after | Value after |
|---|---|---|---|---|
| `.section` `padding-block`, under 768px | `--space-12` | 3rem / 48px | `--space-18` | 4.5rem / 72px |
| `.section` `padding-block`, 768px and up | `--space-16` | 4rem / 64px | `--space-24` | 6rem / 96px |
| `.split` `gap`, under 768px (row gap only) | `--space-6` | 1.5rem / 24px | `--space-9` | 2.25rem / 36px |
| `.split` `gap`, 768px and up | `--space-8` | 2rem / 32px | `--space-12` | 3rem / 48px |

Every step is exactly x1.5. Three of the four values were already on the
scale; two new steps were needed, and both keep the 4px base:
`--space-9: 2.25rem` (36px) and `--space-18: 4.5rem` (72px), added to
`src/styles/tokens.css` in scale order. Nothing in `src/styles/layout.css`
carries a bare length; only the token names changed.

`--space-16` is now used by `src/components/Footer.astro` alone
(`margin-block-start`) and `--space-6` by `.grid` and `--gutter`, so neither
becomes dead.

VERIFIED (`npm run build` clean)

- The inlined CSS in `dist/client/index.html` carries `--space-9:2.25rem`
  and `--space-18:4.5rem`, `.section{...padding-block:var(--space-18)}`,
  `.split{...gap:var(--space-9)...}`, and inside the 768px query
  `.section{padding-block:var(--space-24)}` and
  `.split{...gap:var(--space-12)}`.
- No horizontal scroll at 360px: both changed properties are vertical or
  cross-axis only. `padding-block` never affects inline size. Below 768px
  `.split` has no `grid-template-columns`, so it is a single column and its
  `gap` resolves to a row gap. From 768px the columns are `1fr 1fr` or
  `25% 1fr`, and the `1fr` track absorbs the larger column gap, so the row
  still totals the content box width. `.container` keeps
  `padding-inline: var(--gutter)` with `box-sizing: border-box`, unchanged.
  Reasoned from the built CSS, not measured in a browser: no server was
  started, so the 360px pass is in Mladen's verification list.

Effort: 4 min, 4 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. Section padding and the split gap are half again as large at both steps, through tokens only. src/styles/tokens.css gains --space-9 (2.25rem / 36px) and --space-18 (4.5rem / 72px), both on the 4px base and placed in scale order. src/styles/layout.css: .section padding-block goes from --space-12 (3rem / 48px) to --space-18 (4.5rem / 72px) on mobile and from --space-16 (4rem / 64px) to --space-24 (6rem / 96px) from 768px; .split gap goes from --space-6 (1.5rem / 24px) to --space-9 (2.25rem / 36px) on mobile and from --space-8 (2rem / 32px) to --space-12 (3rem / 48px) from 768px. Every step is exactly x1.5 and no bare length was introduced. Verified in the built inline CSS that all four rules and both new tokens are present. Horizontal scroll at 360 px is unaffected by construction: padding-block is vertical, and below 768px .split is a single column so its gap is a row gap; reasoned from the CSS rather than measured, since no server was started. Coder (Opus): 4 min, 4 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
