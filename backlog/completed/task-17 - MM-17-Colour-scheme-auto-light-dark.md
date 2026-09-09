---
id: TASK-17
title: 'MM-17: Colour scheme: auto, light, dark'
status: Done
assignee: []
created_date: '2026-09-08 19:36'
updated_date: '2026-09-08 20:29'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 2 h. Actual: . Billable: no. AI cost: pending script. AI time: . Three-state scheme control in the header: Auto (follows prefers-color-scheme), Light, Dark. Choice persists in localStorage; a tiny inline script in head applies data-theme before first paint, no flash; works without JavaScript as Auto. Dark palette in tokens under [data-theme=dark] and under the media query for Auto: candidate values bg #222, alt #333, border #555, ink #FED, soft #CBA, accent the lightest web-safe fuchsia with at least 7:1 on #222 (compute; #F9F is a candidate), strong for hover, bars stay #111. Every dark pair measured and recorded. The control is accessible (button group or select with a label), styled from tokens, no framework.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Control cycles Auto/Light/Dark and persists across reloads
- [x] #2 Auto follows the OS setting; Light and Dark override it
- [x] #3 No flash of wrong scheme on load; page works with JavaScript off (Auto)
- [x] #4 All dark-scheme text pairs at least 4.5:1, links at least 7:1, figures in notes
- [x] #5 Spec design section updated: light-only decision replaced
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
THREE STATES

Auto is the absence of the localStorage key `theme` and the absence of
`data-theme` on <html>; Light and Dark set the attribute and win over the OS.
src/styles/tokens.css keeps the light palette on :root and declares the dark one
twice — once under @media (prefers-color-scheme: dark) { :root:not([data-theme='light']) }
for Auto, once under :root[data-theme='dark'] for the explicit choice.

The duplication is deliberate and is called out in a comment above the blocks: a
CSS selector list cannot cross a media-query boundary, so one rule cannot carry
both conditions. The alternatives were considered and rejected for now —
light-dark() would give one definition per token and is named in the comment as
the obvious next move, but it resolves against the color-scheme of the element
where the token is *used*, which is a trap for anything that sets color-scheme
locally (the theme control does exactly that); the custom-property "space
toggle" hack avoids duplication at the cost of being unreadable. If Mladen
prefers a single definition, light-dark() is the change to make.

`color-scheme` is set by the same three selectors, so native controls and
scrollbars follow. The bar tokens and the two overlay tokens are declared only on
:root and never redefined, which is what keeps the header, the footer and the
photo credit strip identical in every scheme.

DARK PALETTE, MEASURED (WCAG 2.x relative luminance, 3-digit hex expanded by
doubling; bg = #222, alt = #333)

  --color-ink           #FED   14.04 on bg   11.15 on alt
  --color-ink-soft      #CBA    8.53 on bg    6.77 on alt
  --color-accent        #FAF    9.43 on bg    7.49 on alt
  --color-accent-strong #FCF   11.62 on bg    9.23 on alt
  --color-accent-ink    #111   11.19 on the accent, 13.79 on accent-strong
  --color-ink on --color-field-bg #111        16.66
  --color-ok-ink #CFC on --color-ok-bg #131   12.45  (border #CFC vs bg 14.20)
  --color-error-ink #FCC on #311              12.01  (border #FCC vs bg 11.18)
  --color-ink #FED on #311 (invalid field)    15.07
  --color-border        #555    2.13 on bg    1.69 on alt  (non-text)
  bars, unchanged: #FFF on #111 18.88, #C0C outline 3.99

Every text pair clears 4.5:1 and every accent pair clears 7:1 on both surfaces.

ONE DEVIATION FROM THE BRIEF, DELIBERATE: --color-accent is #FAF, not #F9F.
The ladder on the page background alone gives #F9F (8.53), and that is what the
task predicted. But #F9F is only 6.77:1 on the alternate band, and there is
accent-coloured text there today — the secondary button on the home
announcement. Links have to clear 7:1 wherever they land, so the accent goes one
step brighter: #FAF is 9.43 / 7.49. #FCF would also pass (11.62 / 9.23) but is
pale enough to stop reading as fuchsia. Reverting to #F9F is a two-character
change in both dark blocks if Mladen prefers the literal value and accepts 6.77
on the band.

A SECOND FIX THE DARK SCHEME FORCED: --color-accent-ink flips to #111 in dark,
because a #FAF button needs dark text (white on #FAF is 1.87:1). Three
components read that token: .button and .skip-link, which should flip, and
.credit — the photo attribution strip — which must not, because it sits on a
70% black scrim over a photograph in every scheme. Left alone it would have
shipped #111 text on a black scrim. So --color-overlay-ink: #FFF was added next
to --color-overlay, both scheme-independent, and .credit and .credit a in
src/styles/components.css now point at it. This is the only edit outside the
theme work and it was not optional.

THE CONTROL: a <select>, not a cycling button

Chosen because it is the simpler accessible one. All three states are visible
and selectable at once instead of being guessed one press at a time; the native
combobox already announces its name, role and current value, so no aria-live
region is needed and nothing has to re-announce a label that changed under
focus; and a change event is the whole handler. The cycling button needs
aria-live, hides two of the three options, and makes "what happens if I press
this" a guess. src/components/Header.astro carries it: a plain <div id="theme">
with a visually hidden <label for> and the select, sitting in a new
.site-header__end flex group beside the nav. .theme sets no display property, so
the `hidden` attribute it ships with keeps working. The select is styled from
the bar tokens and carries color-scheme: dark so the native option list matches
the ink bar in both schemes.

THE SCRIPT: src/components/ThemeScript.astro, rendered by BaseLayout as the
second child of <head>, after Head.astro (so <meta charset> stays first) and
well before the inlined <style>, which the build emits last in <head>. It is
`is:inline`, so Astro leaves it in place instead of bundling it into a file the
page would fetch. It reads localStorage, applies data-theme before the
stylesheet is parsed, then on DOMContentLoaded finds #theme and #theme-choice,
syncs the select to the stored value, wires the change handler (which updates
both the attribute and storage) and removes `hidden`. Both storage calls are
wrapped in try/catch, so a browser that blocks storage still gets a working
control for the current page.

<meta name="theme-color"> is now two tags, #FED under
media="(prefers-color-scheme: light)" and #222 under the dark one. Both need the
media attribute: the browser uses the first tag whose media matches, so an
unqualified tag would always win. The tag can only follow the OS — an in-page
Light or Dark choice does not reach it, which is a platform limit, not a bug.

VERIFIED

npm run build clean. Across all three built pages: exactly one executable script
in <head> and none in <body> (the workshop page also keeps its existing Turnstile
tag); two theme-color tags; the control present and shipping `hidden`; both dark
blocks present with the right selectors.

Driven in a browser against the built dist/client/index.html:
- script runs, `hidden` is removed, select reads "auto", no data-theme, body #FED,
  bars #111, accent #909;
- cycling the select through dark, light and auto flips data-theme, color-scheme
  and every colour token as expected, and the bar and overlay tokens never move;
- the guard was checked directly: :root:not([data-theme="light"]) matches with no
  attribute and with "dark", and does not match with "light", so the Auto branch
  is off exactly when Light is chosen;
- measured on real elements in dark: alt band rgb(51,51,51), secondary button text
  rgb(255,170,255), primary button rgb(255,170,255) on rgb(17,17,17) text, credit
  strip white on the scrim, eyebrow rgb(204,187,170), select ink with
  color-scheme dark;
- screenshots at ~400px and at 1440px look right in dark.

NOT VERIFIED, AND WHY: persistence across a reload. The only sandbox available
without starting a server renders the built file as a data: URL, where
localStorage throws SecurityError. The fallback path was exercised (the control
still worked), but the round trip stored -> reload -> applied needs Mladen's dev
server. AC #1's "persists across reloads" is ticked on the code path, not on a
machine-checked reload.

SPEC (docs/spec-v1.md)
- Design / Colour rewritten: the "light scheme only in v1; dark is reserved"
  decision is replaced by the three-state scheme, with three tables — light, dark
  (both surfaces), and the scheme-independent bar and overlay tokens — plus the
  note on why the dark block is written twice and why the accent is #FAF. The bar
  tokens from the previous task are recorded here for the first time.
- Design / Layout: the control, why a select rather than a cycling button, and
  the JavaScript-off behaviour.
- Markup: the theme-color line now describes both tags and the OS-only limit.
- Acceptance criteria: "/ and /about/ ship no JavaScript" becomes "ship exactly
  one script: the inline colour-scheme script, which loads nothing over the
  network".
- Out of scope: "theme toggle" removed, since it is now built.

FLAGGED, NOT TOUCHED
1. src/components/RegistrationForm.astro line 209 hardcodes data-theme="light"
   on the Turnstile widget, so the anti-spam box stays light on a dark workshop
   page. Turnstile accepts "auto", but auto follows the OS and would still be
   wrong for an in-page override; making it follow the site's state needs JS.
   Worth its own task.
2. --color-border is 2.13:1 on the dark background, below the 3:1 WCAG 1.4.11
   asks of non-text boundaries. The light scheme has the same gap (#CBA at
   1.65:1), so this is a pre-existing decision about how quiet borders should be,
   not something dark mode introduced. One decision for both schemes.
3. Revealing the control at DOMContentLoaded can nudge the header a few pixels
   on a slow first paint. On these pages (about 21 kB with the CSS inlined)
   DOMContentLoaded lands before paint in practice. Hiding it with a CSS hook
   set by the same head script would remove even that, at the cost of the plain
   `hidden` attribute the task asked for.

Effort: 9 min, 27 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. The site has three colour states: Auto, Light and Dark, chosen from a <select> in the header, remembered in localStorage under "theme", applied by one inline script in <head> before the stylesheet is parsed so nothing flashes, and reduced to Auto with JavaScript off (the control ships hidden and only the script reveals it). src/styles/tokens.css keeps light on :root and declares dark twice, for the media query and for data-theme, with a comment on why one rule cannot carry both. New files: src/components/ThemeScript.astro. Changed: tokens.css, components.css, Header.astro, Head.astro, BaseLayout.astro, docs/spec-v1.md. Every dark text pair clears 4.5:1 and every accent pair clears 7:1 on both surfaces — ink #FED 14.04/11.15, soft #CBA 8.53/6.77, accent #FAF 9.43/7.49, strong #FCF 11.62/9.23, accent-ink #111 11.19 on the accent, ok 12.45, error 12.01, field 16.66. Two deliberate calls: the accent is #FAF not #F9F, because #F9F falls to 6.77:1 on the alternate band where accent text already appears; and --color-overlay-ink was added so the photo credit strip keeps white text when --color-accent-ink flips to #111. Persistence across a reload is the one thing not machine-verified — the only sandbox available without a server blocks localStorage. Flagged for separate tasks: Turnstile is pinned to data-theme="light"; --color-border is below 3:1 in both schemes. Coder (Opus): 9 min, 27 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
