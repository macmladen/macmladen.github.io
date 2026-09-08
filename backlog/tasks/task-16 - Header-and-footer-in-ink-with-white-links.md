---
id: TASK-16
title: Header and footer in ink with white links
status: Done
assignee: []
created_date: '2026-09-08 19:36'
updated_date: '2026-09-08 19:44'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 0.75 h. Actual: . Billable: no. AI cost: pending script. AI time: . Header and footer bars get an ink background (#111) with white text and links; link hover and focus show a fuchsia outline (contrast at least 3:1 against #111, choose the lightest web-safe fuchsia that passes and record the ratio). New tokens for bar background, bar ink, bar hover. Mladen may ask for a lighter variant after seeing it.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Header and footer render #111 with white text at both widths
- [x] #2 Hover and focus on bar links show the fuchsia outline; ratio recorded in notes
- [x] #3 Body remains sand; no other component changes colour
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Three tokens added to src/styles/tokens.css, defined once on :root and
deliberately never redefined per scheme, so the bars look the same in light and
dark:

  --color-bar-bg: #111
  --color-bar-ink: #FFF
  --color-bar-hover: #C0C

Contrast, measured with the WCAG 2.x relative-luminance formula (3-digit hex
expanded by doubling):

  #FFF on #111  18.88 : 1   bar text and links
  #C0C on #111   3.99 : 1   the hover / focus outline against the bar
  #C0C on #FFF   4.73 : 1   the same outline against the white it surrounds

--color-bar-hover was chosen by walking the true web-safe fuchsia ladder from the
darkest end and taking the first value that clears 3:1 on #111:
#303 1.07, #606 1.58, #909 2.53, #C0C 3.99, #F0F 6.02. So #C0C is the deepest
fuchsia that passes; anything lighter passes too but is less saturated. The task
wording said "lightest", which reads the other way round; the value it points at
(#C0C, first in the task's own candidate list) is the one this rule produces, so
that is what was implemented.

src/components/Header.astro: the bar takes background and colour from the tokens
and loses its bottom rule — the colour already separates it from the sand.
`.site-header a` is white with no underline; `:hover`, `:active` and
`:focus-visible` share one rule that keeps the colour white and draws
`var(--focus-width) solid var(--color-bar-hover)` at `var(--focus-offset)`, which
also overrides the #606 focus ring base.css sets globally (that ring is 1.58:1 on
ink and would have been invisible). The hover underline is scoped to
`.site-header__nav a`, not to `.site-header a`, so the wordmark can never pick it
up — that avoids a specificity fight with Astro's scoping attribute, which adds a
class-weight token to every compound selector.

`.site-header__name` now only carries size and weight; white comes from the
`.site-header a` rule.

Two colours had to move because they were unreadable on ink, both inside the two
bars and nowhere else:
- `.site-header__nav [aria-current="page"]` was --color-accent-strong (#606,
  1.58:1 on #111). It is now semibold plus a permanent underline: weight and a
  rule instead of a colour. A resting underline here is the "you are here" state,
  not a link's default appearance, so it does not contradict "underline only on
  hover".
- `.site-footer__copy` was --color-ink-soft (#444, 1.40:1 on #111). It now
  inherits --color-bar-ink from `.site-footer` (18.88:1).

src/components/Footer.astro got the same bar treatment and lost its top rule.
Nothing in the footer underlines: both links are marks with no visible text.

Not touched, flagged instead:
- SkipLink keeps --color-accent (#909) with white text, 7.5:1, readable wherever
  it lands over the ink header.
- <meta name="theme-color"> is still #FED, the body sand. Whether it should follow
  the ink bar instead is a call for the colour-scheme task or for Mladen.
- Body, sections, buttons, notices, fields and the credit overlay are unchanged.

Verified with npm run build (clean) against dist/client/index.html: the token
block carries --color-bar-bg:#111, --color-bar-ink:#fff, --color-bar-hover:#c0c;
both .site-header and .site-footer set background-color and color from the bar
tokens; both have the combined hover/active/focus-visible outline rule; the nav
underline rule is scoped to .site-header__nav; --color-bg is still #FED.

Effort: 7 min, 8 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. Header and footer are ink (#111) bars with white text and links; links underline only on hover (nav only — the wordmark never does) and both hover and focus-visible draw a 2px #C0C outline. New tokens --color-bar-bg #111, --color-bar-ink #FFF, --color-bar-hover #C0C in src/styles/tokens.css, defined once so the bars stay the same in every scheme. Ratios: white on ink 18.88:1, the outline 3.99:1 on ink and 4.73:1 on the white it surrounds; #C0C is the deepest web-safe fuchsia clearing 3:1 (#909 reaches only 2.53:1). Two unreadable colours inside the bars moved: the current-nav marker is now weight plus underline, the copyright line is white. Body sand and every other component unchanged. Coder (Opus): 7 min, 8 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
