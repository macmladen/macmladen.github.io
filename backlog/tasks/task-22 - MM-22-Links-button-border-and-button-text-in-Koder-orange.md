---
id: TASK-22
title: 'MM-22: Links, button border and button text in Koder orange'
status: Done
assignee: []
created_date: '2026-09-09 07:33'
updated_date: '2026-09-09 07:37'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Estimate: 0.5 h. Actual: . Billable: no. AI cost: pending script. AI time: 9 min. Mladen's decision 2026-09-09, contrast figures seen and accepted: body links #F40 (--color-link = #F40), secondary button border and label #F40, primary button #F40 with white text (--color-accent-ink #FFF). Hover: underline thickens, no colour change needed; primary button hover may darken to #A30 with white text. Record in the spec table that #F40 text is 3.05:1 on sand by decision.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Links, secondary button border and label, primary button background are #F40; primary button text white
- [x] #2 Spec table and a one-line decision note updated
- [x] #3 No #A30 in link or button text at rest
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
CHANGED

- `src/styles/tokens.css`: `--color-link` `#A30` -> `#F40`;
  `--color-accent-ink` `#111` -> `#FFF`; new `--color-accent-hover: #A30`,
  the one darker step, used only in hover states. New
  `--underline-thickness-strong: 2px` beside the existing
  `--underline-thickness: 1px`. The "Two roles, not one ramp" comment is
  rewritten: one accent carrying both roles, the three ratios spelled out,
  and Mladen's decision of 2026-09-09 named in the file.
- `src/styles/base.css`: `a:hover, a:active` no longer changes colour (link
  and accent are now the same `#F40`, so it was a no-op) and instead sets
  `text-decoration-thickness: var(--underline-thickness-strong)`. The state
  is carried by the rule, not by colour.
- `src/styles/components.css`: `.button:hover` fills
  `--color-accent-hover` and keeps `--color-accent-ink` white (6.60:1),
  where before it filled `--color-link` and flipped to `--color-bg`.
  `.button--secondary` border moves from `--color-border` `#CBA` to
  `--color-accent` `#F40`, label stays `--color-link`, now `#F40`.
  `.button--secondary:hover` darkens border and label to
  `--color-accent-hover` over the `--color-bg-alt` fill.
- `docs/spec-v1.md`: table rows for `--color-accent`, `--color-accent-ink`
  and `--color-link` updated, a `--color-accent-hover` row added; the two
  paragraphs that argued the `#A30` link step rewritten; the link-hover
  sentence now says hover keeps the colour and thickens the underline.

JUDGEMENT CALL

The task fixes the secondary button's resting border and label at `#F40` and
the primary button's hover at `#A30`, but says nothing about the secondary
button's hover. With the border already `#F40` at rest, the old hover
signal (border `#CBA` -> `#A30`) disappears, and the remaining
`--color-bg-alt` fill is invisible on `.section--alt`, which is exactly
where the secondary button sits on the home page. So the secondary hover
darkens border and label to `--color-accent-hover` together with the fill.
That is the only place `#A30` appears beyond the primary hover the task
named, and it is a hover state, per the instruction to leave `#A30` only in
hover states.

RATIOS, RECOMPUTED HERE AND MATCHING THE SPEC'S EXISTING FIGURES

`#F40` on `#FED` 3.05:1, on `#EDC` 2.61:1, on `#FFF` 3.45:1. `#FFF` on
`#F40` 3.45:1, on `#A30` 6.60:1. `#A30` on `#FED` 5.82:1, on `#EDC` 4.98:1.
The resting link and both button labels are therefore under 4.5:1 by
decision; the underline, the focus outline and the hover step are what
carry state and legibility.

VERIFIED (`npm run build` clean)

- `grep -rn A30 src/` returns four lines: the `--color-accent-hover` token
  and three comment mentions. No `#A30` in any resting colour.
- Built inline CSS in `dist/client/index.html` carries
  `--color-accent-ink:#fff`, `--color-link:#f40`,
  `--color-accent-hover:#a30`, `--underline-thickness-strong:2px`, and
  `.button--secondary{border-color:var(--color-accent);color:var(--color-link)}`.
- The dormant `:root[data-theme='dark']` block is untouched on purpose: it
  is a parked palette with its own decision record
  (`docs/decisions/M3-DARK-SCHEME-PARKED.md`), and it still sets
  `--color-accent-ink:#111` and `--color-link:#f74`. It has no
  `--color-accent-hover`, so a reinstated dark scheme would inherit `#A30`
  from `:root`. Flagged, not fixed — out of scope for this task.

Effort: 9 min, 20 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. Links, the secondary button's border and label, and the primary button's fill are all #F40; text on the accent is white. src/styles/tokens.css sets --color-link: #F40 and --color-accent-ink: #FFF, adds --color-accent-hover: #A30 for hover only and --underline-thickness-strong: 2px, and its comment now records the accepted ratios and Mladen's decision of 2026-09-09 rather than the retired two-step argument. src/styles/base.css drops the colour change on a:hover and thickens the underline instead. src/styles/components.css moves the primary button's hover fill to --color-accent-hover with the white label kept (6.60:1), puts --color-accent on the secondary button's resting border, and darkens the secondary button's border and label to --color-accent-hover on hover so the state stays visible on .section--alt. docs/spec-v1.md has the four table rows and the two rationale paragraphs rewritten, including the sentence that #F40 for links and button text is Mladen's decision of 2026-09-09 with the ratios known. grep for A30 in src/ leaves only the hover token and comments. npm run build clean; the built inline CSS carries every new value. Coder (Opus): 9 min, 20 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
