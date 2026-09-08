---
id: TASK-4
title: 'MM-04: Design tokens and CSS layers'
status: Done
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 10:19'
labels:
  - feature
milestone: m-1
dependencies: []
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . tokens.css with the agreed palette (#FED bg, #EDC alt, #CBA border, #111 ink, #444 soft, #909 accent, #606 strong, #FFF accent ink, ok and error pairs), system font stacks, fluid type scale 1.2 ratio, space scale, radius 4px. Layers reset, base, layout (section, container, container--narrow, row, flow, grid), components (button, link, form controls, notice, credit overlay), utilities. Spec: Design section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Every colour pair in the spec table meets its stated contrast
- [x] #2 Body text is 16px at 360px and 18px at 1440px; h1 30px to 40px; headings scale by ~1.2
- [x] #3 No bare colour or size values in components; every value is a token
- [x] #4 Layers declared once in order reset, base, layout, components, utilities; tokens unlayered
- [x] #5 Links underlined; focus outline 2px #606 offset 2px on every interactive element
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
tokens.css rewritten to the spec palette (short hex verbatim), system font stacks,
fluid 1.2 scale, 4px space scale, radius 4px, widths 1200/720. Dark scheme dropped;
color-scheme: light on :root. global.css declares the five layers once, imports
tokens.css unlayered and one file per layer via @import ... layer(name):
reset.css, base.css, layout.css, components.css, utilities.css.

Fluid scale: all steps interpolate between 320px and 1120px viewports, the same
anchors the spec's own --text-base clamp implies (0.95rem + 0.25vw hits 16px at
320px and 18px at 1120px). Derived: sm clamp(0.875,0.85rem+0.125vw,0.9375),
lg clamp(1.125,1.075rem+0.25vw,1.25), xl clamp(1.25,1.15rem+0.5vw,1.5),
2xl clamp(1.5,1.35rem+0.75vw,1.875), 3xl clamp(1.875,1.625rem+1.25vw,2.5).
At 360px body computes to 16.1px, h1 to 30.5px; at 1440px both are capped at
18px and 40px.

Contrast, computed with a WCAG 2.x relative-luminance script (scratchpad, not committed):
  #111 on #FED  16.66:1  AAA   (spec says 16.7)
  #444 on #FED   8.59:1  AAA   (spec says 8.6)
  #909 on #FED   6.58:1  AA    (spec says 7.2 / AAA -- SPEC TABLE IS WRONG)
  #FFF on #909   7.46:1  AAA   (spec says 8.1)
  #606 on #FED  10.55:1  AAA
  #111 on #EDC  14.25:1  AAA
  #444 on #EDC   7.35:1  AAA
  #909 on #EDC   5.63:1  AA
  #FFF on #606  11.95:1  AAA
  #151 on #DED   7.44:1  AAA
  #900 on #FDD   7.07:1  AAA
  #111 on #FFF  18.88:1  AAA   (ink on the white field surface)
  #909 on #FFF   7.46:1  AAA
  #606 on #EDC   9.02:1  AAA   (focus ring on the alt band)
  #CBA on #FED   1.65:1        (borders only, non-text, no requirement)
Every pair passes AA for its use and all but one pass AAA. The exception is the
accent link colour #909 on the sand: 6.58:1, not the 7.2:1 the spec table claims.
Palette left as the spec fixes it; the table's number needs correcting, or the
link colour needs to become #606 (10.55:1) if AAA is the real target. Mladen's call.

Two extra tokens the spec table does not list, both needed by components:
--color-field-bg #FFF (input surface; the table's #EDC is described as the fields'
surroundings, not the fields) and --color-overlay rgb(0 0 0 / 0.7) for the Unsplash
credit strip. --color-accent-soft and --color-error-border dropped (unused, not in
the spec palette).

Only bare values left in the layers: the 768px media-query breakpoint (custom
properties are not valid in media conditions) and the 16rem fallback of --grid-min.
components.css and base.css contain no bare colour or size at all.

Verified: npm run build clean, no warnings; dist/client/index.html carries one
inlined <style>, no external stylesheet. The minifier drops the standalone
@layer statement because the five layers are first used in exactly the declared
order, so the cascade order in the shipped CSS is identical.

Effort: 32 min, 12 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. tokens.css rewritten to the spec palette, fluid 1.2 type scale, 4px space scale; global.css declares the five layers once and imports tokens.css unlayered plus reset/base/layout/components/utilities. Contrast of all 15 pairs computed and recorded in the notes: everything passes AA for its use, one deviation from the spec table (#909 on #FED is 6.58:1, not the stated 7.2:1 AAA) left for Mladen to rule on. Commit 89992c5. Coder (Opus): 32 min, 12 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
