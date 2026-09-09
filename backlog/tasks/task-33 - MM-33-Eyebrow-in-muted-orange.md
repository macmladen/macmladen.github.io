---
id: TASK-33
title: 'MM-33: Eyebrow in muted orange'
status: Done
assignee: []
created_date: '2026-09-09 10:01'
updated_date: '2026-09-09 10:05'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Actual: . Billable: no. AI cost: pending script. AI time: 3 min. The .eyebrow text colour becomes a muted orange: new token --color-accent-muted, a desaturated/darker step of #F40 in web-safe short hex, at least 4.5:1 on sand and on the alt band (candidates #C63, #B53, #A52; measure, pick the warmest that passes, record).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Eyebrow renders the muted orange token on the home announcement; ratios in notes and spec table
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The token is `--color-accent-muted: #853` and `.eyebrow` now reads it instead of `--color-ink-soft`.

**None of the three named candidates passes.** Measured against `--color-bg` `#FED` and `--color-bg-alt` `#EDC` with the WCAG 2.x relative-luminance formula:

| Candidate | on `#FED` | on `#EDC` | Verdict |
|---|---|---|---|
| `#C63` | 3.36 : 1 | 2.87 : 1 | fails both |
| `#B53` | 4.15 : 1 | 3.55 : 1 | fails both |
| `#A52` | 4.60 : 1 | 3.93 : 1 | passes on sand, fails on the band |
| `#853` (chosen) | 5.46 : 1 | 4.67 : 1 | passes both |

The eyebrow is body-size text, so the bar is 4.5 : 1, and `#EDC` is the binding side because the announcement eyebrow sits on the alternate band. To settle it rather than guess, the whole web-safe short-hex space was enumerated and filtered to orange hues (12°–48°) with at least 45% saturation and at least 4.5 : 1 on both grounds: 64 values survive, and the lightest of them sit at about 4.6–4.7 : 1 on the band. Anything lighter than that — the whole `#Axx` and `#Bxx` range the three candidates live in — is out of reach at this contrast bar.

So "the warmest that passes" was read as the lightest survivor in the same terracotta family as the three candidates, which is `#853` rgb(136, 85, 51): hue 24°, saturation 63%. `#854` is a hair lighter (5.40 / 4.62) but at 50% saturation reads brown-grey; `#850` is marginally darker and, with no blue at all, turns amber and leaves the family. `#853` is also clearly distinct from `--color-accent-hover` `#A30`, which matters — a muted step that looked like the hover fill would be a bug, not a colour.

`#853` was **not** added to the dormant `:root[data-theme="dark"]` block. That block already omits `--color-accent-hover`, so leaving it out is consistent with how the parked palette treats accent steps; adding an unmeasured dark value would be worse than the gap. Flagged below.

Files: `src/styles/tokens.css` (token plus the measurement comment), `src/styles/components.css` (`.eyebrow`), `docs/spec-v1.md` (token table row, a paragraph recording why the three candidates were rejected, and the home announcement bullet, which said the eyebrow is `--color-ink-soft`).

Verification, no server started: `npm run build` clean, five prerendered routes. `dist/client/index.html` carries `--color-accent-muted:#853` and `.eyebrow{color:var(--color-accent-muted);…}` in the inlined stylesheet.

Flagged, not changed: the dormant dark palette in `src/styles/tokens.css` has no `--color-accent-hover` and now no `--color-accent-muted` either. When the switcher comes back off the ROADMAP, both need measuring against `#222` and `#333`.

Effort: 12 tool calls in the task itself, on top of the shared reading pass over the spec, pages and stylesheets at the start of the session; 3 minutes wall clock from setting the task In Progress to this commit; one Opus session, no subagents.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The eyebrow is muted orange: new token --color-accent-muted #853, read by .eyebrow in place of --color-ink-soft. All three candidates the task named were measured and all three fail the 4.5:1 bar on the alternate band where the eyebrow actually sits (#C63 3.36/2.87, #B53 4.15/3.55, #A52 4.60/3.93), so the whole short-hex orange space was enumerated and the lightest passing value of the same terracotta family taken: #853 at 5.46:1 on #FED and 4.67:1 on #EDC. Spec token table, the colour prose and the announcement bullet updated with the figures. Build clean, built HTML carries both the token and the rule.
<!-- SECTION:FINAL_SUMMARY:END -->
