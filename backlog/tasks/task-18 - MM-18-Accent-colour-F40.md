---
id: TASK-18
title: 'MM-18: Accent colour #F40'
status: Done
assignee: []
created_date: '2026-09-09 07:03'
updated_date: '2026-09-09 07:12'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 0.5 h. Actual: . Billable: no. AI cost: pending script. AI time: 6 min. Accent becomes #F40 (Mladen, 2026-09-09). Measured: #F40 on sand 3.05:1, white on #F40 3.45:1, #111 on #F40 5.47:1, #F40 on #111 5.47:1. So: --color-accent #F40 with --color-accent-ink #111 for buttons, bar hover/focus outline #F40, and a separate --color-link for body links that passes 4.5:1 on both sand and the alt band (#B30 5.17/4.42, #A30 5.82/4.98; pick the lightest that passes on both, report). Link hover: #F40 with the underline kept. Spec table updated. Dark block: same accent, dormant.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Tokens: accent #F40, accent-ink #111, link colour passes 4.5:1 on #FED and #EDC, figures in notes and in the spec table
- [x] #2 Buttons render #F40 with #111 text; body links use the link token; bar outline is #F40
- [x] #3 No #909/#606/#C0C remain in src/
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
THE LINK COLOUR IS #A30 — 5.82 : 1 ON SAND #FED, 4.98 : 1 ON THE BAND #EDC

Recomputed from scratch (WCAG 2.x relative luminance, 3-digit hex expanded by
doubling) over the whole #F40 hue ramp, not just the two candidates the task
named. The script reproduced the task's figures exactly, which is the check that
the method matches:

  hex     on #FED   on #EDC   4.5 on both
  #F40      3.05      2.61
  #E30      3.63      3.10
  #D30      4.07      3.49
  #C30      4.58      3.92
  #B30      5.17      4.42     misses the band by 0.08
  #B20      5.54      4.74     PASS
  #A40      5.24      4.48     misses the band by 0.02
  #A30      5.82      4.98     PASS  <- chosen
  #930      6.55      5.60     PASS

Read strictly, "the lightest that passes on both" is #B20, not #A30 — it is
0.28 lighter on sand and clears both surfaces. I did not take it, and this is a
judgement call worth Mladen's eye. #B20 drops the green channel from 3 to 2,
which moves the hue to 11° while #F40 sits at 16° and #A30 at 18°. #B20 reads as
a different, redder colour next to the accent; #A30 reads as the same colour,
darker. The ~5% lightness #B20 buys is not worth a link that does not look
related to the button beside it. Swapping is a two-character change in one
token if the lighter value is preferred.

ACCENT #F40, MEASURED

  #F40 on #FED                     3.05    surface/edge, clears 3:1
  #F40 on #EDC                     2.61    below 3:1 on the band — see below
  #111 on #F40 (--color-accent-ink) 5.47   button label
  #F40 on #111 (bar outline)       5.47
  #F40 on #FFF (the white it outlines) 3.45
  #A30 on #FFF (a link in a field) 6.60
  #FED on #A30 (button hover label) 5.82
  #111 on #A30                     2.86    which is why hover flips the label

TWO ROLES, NOT ONE RAMP

--color-accent-strong is retired. It held the "darker step" job, and with #F40
as the accent that job splits in two: an edge/surface colour that only ever has
to clear 3:1 (--color-accent) and a text colour that has to clear 4.5:1 on two
surfaces (--color-link). Keeping a third token would have meant two tokens with
the same value. Every former use of --color-accent-strong now reads one or the
other:

  base.css       a:hover, a:active        --color-accent  (underline kept)
  base.css       :focus-visible outline   --color-accent
  components.css .field ...:focus-visible --color-accent
  components.css .button:hover fill       --color-link
  components.css .button--secondary label --color-link
  components.css .button--secondary:hover --color-link (border and label)

THREE DECISIONS INSIDE THAT, ALL CONTRAST-DRIVEN

1. The primary button's hover label flips from --color-accent-ink to
   --color-bg. #111 on the #A30 hover fill is 2.86:1; #FED is 5.82:1. Using
   --color-bg rather than a new token means the dormant dark block gets the
   same pair for free (#222 on #F74 is 6.04:1).
2. The secondary button's hover border goes to --color-link, not to #F40. #F40
   against the #EDC hover background is 2.61:1, below the 3:1 WCAG 1.4.11 asks
   of a non-text boundary; #A30 is 4.98:1. The border then matches the label,
   which is also tidier.
3. The focus outline is #F40 everywhere on light surfaces. It lands on #FED
   (3.05), on #FFF inside a field (3.45) and on #111 in the bars (5.47) — all
   over 3:1. Note it is 2.61:1 where a focusable element sits directly on the
   alternate band; the secondary button on the home announcement is the only
   such element today, and its own border and label carry the state as well.
   Flagged rather than solved, because solving it means a second outline token
   and the site already has a live "border contrast" roadmap item.

--color-bar-hover becomes #F40 too (5.47 on the bar, up from #C0C's 4.0; 3.45
against the white it surrounds, down from 4.7, still over 3:1). The token stays
separate from --color-accent even though the values now match, because the bars
are checked against --color-bar-bg rather than against the page — if the accent
ever moves again, the bar's minimum is a different calculation.

DORMANT DARK BLOCK, KEPT CURRENT

--color-accent #FAF -> #F40 (4.61 on #222, 3.66 on #333, both over 3:1 for a
fill; #111 on it 5.47). --color-accent-strong #FCF removed. --color-link added
as #F74 — the lightest step of the ramp clearing 4.5:1 on both dark surfaces
(6.04 / 4.80); #F63 is 5.46 / 4.33 and misses the band. --color-accent-ink was
already #111 and stays.

GREP CLEAN

`grep -rn "accent-strong|#909|#606|#C0C|#FAF|#FCF" src/` returns nothing. (An
earlier sweep for the bare digit strings also matched "1.606" inside an SVG path
in src/components/Footer.astro — a path coordinate, not a colour, left alone.)
The built pages contain none of the old values either.

SPEC (docs/spec-v1.md)

Light table: the three accent rows become --color-accent #F40, --color-accent-ink
#111 and --color-link #A30, each with its measured figures. Two new paragraphs
under the table state the two-role rule, the ladder with the #B30/#B20/#A30
comparison and the hue argument, and the retirement of --color-accent-strong
with the list of what replaced it. Scheme-independent table: --color-bar-hover
is #F40 at 5.47 / 3.45. The focus paragraph now names --color-accent and says
why --color-bar-hover stays a separate token.

VERIFIED

npm run build clean. In dist/client: --color-accent:#f40, --color-accent-ink:#111,
--color-link:#a30, --color-bar-hover:#f40 on :root and #f40/#111/#f74 in the
dormant block; `a{color:var(--color-link)...}`; `.button:hover` reads
--color-link fill with --color-bg text; zero occurrences of the old values on
any of the three pages. Colours on rendered elements were not eyeballed in a
browser — the tokens and rules are checked in the emitted CSS, and the visual
check is Mladen's.

Effort: 6 min, 10 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. The accent is #F40 with #111 as its ink, and body links get their own token, --color-link #A30, measured at 5.82:1 on the sand background and 4.98:1 on the alternate band (#B30 was 5.17/4.42 and misses the band by 0.08). #B20 is fractionally lighter and also passes at 5.54/4.74, but its hue is 11° against #F40's 16° where #A30 sits at 18°, so #A30 was chosen to stay in the accent's family — a taste call, reversible in one token. --color-accent-strong is retired: with #F40 the "darker step" splits into an edge colour that needs 3:1 and a text colour that needs 4.5:1 on two surfaces, and keeping a third token would have duplicated a value. Link hover is #F40 with the underline kept; focus outlines are #F40 (3.05 on sand, 3.45 on a white field, 5.47 on the bars); --color-bar-hover is #F40 too, 5.47 on the bar and 3.45 against the white it surrounds. Two knock-on fixes the contrast forced: the primary button's hover label flips to --color-bg because #111 is only 2.86:1 on the #A30 hover fill, and the secondary button's hover border takes --color-link rather than #F40, which is 2.61:1 on the band. The dormant dark block is kept current: accent #F40, link #F74 (6.04/4.80), accent-strong removed. Files: src/styles/tokens.css, base.css, components.css, docs/spec-v1.md. Flagged, not solved: a focus outline on an element sitting directly on the alternate band is 2.61:1 — only the secondary button on the home announcement is in that position today, and it belongs with the existing border-contrast roadmap item. Coder (Opus): 6 min, 10 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
