---
id: TASK-21
title: 'MM-21: Light only, theme switcher removed'
status: Done
assignee: []
created_date: '2026-09-09 07:03'
updated_date: '2026-09-09 07:07'
labels:
  - chore
milestone: m-2
dependencies: []
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: XS. Estimate: 0.5 h. Actual: . Billable: no. AI cost: pending script. AI time: 6 min. Remove the scheme control from the header, the inline theme script, the second theme-color tag and the prefers-color-scheme media block, so the site is always light (color-scheme: light). Keep the [data-theme=dark] token block dormant for a later task. Spec Design section: light for now, three-state scheme parked (ROADMAP entry).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No select, no inline script, no data-theme handling in the built HTML; pages ship no JavaScript except Turnstile
- [x] #2 OS dark mode does not change the site
- [x] #3 ROADMAP.md lists the theme switcher as future work; spec updated
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
REMOVED

- `src/components/ThemeScript.astro` deleted; its import and its `<ThemeScript />`
  element removed from `src/layouts/BaseLayout.astro`, so `<head>` is now
  `Head.astro` plus the page's own `<slot name="head">`.
- `src/components/Header.astro`: the `#theme` wrapper, its visually hidden label
  and the `<select id="theme-choice">` are gone, together with the
  `.theme__control` rules and their hover/focus outline. `.site-header__end`
  went with them — it existed only to sit the control beside the nav, and with
  one child left the `<nav>` is now a direct child of `.site-header__inner`,
  which already does the flex row. `.visually-hidden` stays in
  `src/styles/utilities.css`; `Footer.astro` still uses it.
- `src/components/Head.astro`: two media-qualified `theme-color` tags become one
  unconditional `<meta name="theme-color" content="#FED">`.
- `src/styles/tokens.css`: the whole `@media (prefers-color-scheme: dark)` block
  is gone, along with the long comment explaining why the dark values were
  written twice. The measured figures from that comment are not lost — they are
  in the decision record below.

KEPT DORMANT

`:root[data-theme='dark']` stays at the bottom of `src/styles/tokens.css` with a
three-line comment saying nothing sets the attribute, why it is kept, and where
the figures live. `:root` already declared `color-scheme: light`, so that needed
no change; with the media block gone it is now the only thing the OS sees.

DOCUMENTATION

- New: `docs/decisions/M3-DARK-SCHEME-PARKED.md` — what happened, the decision,
  the full measured dark palette table lifted verbatim out of the spec, the
  `#FAF`-not-`#F9F` note, why the bar and overlay tokens are absent from the
  dark block, and what reinstating the switcher would take.
- `docs/spec-v1.md`, four edits: the Design/Colour paragraph now says light only
  and points at the decision record and the roadmap; the dark table is gone (the
  light table and the scheme-independent table stay); the Layout paragraph loses
  the control and its `<select>`-versus-cycling-button rationale; the Markup
  bullet says one unconditional `theme-color` tag; the acceptance-criteria line
  "ship exactly one script: the inline colour-scheme script" becomes "ship no
  script at all; the workshop page ships only Turnstile".
- `ROADMAP.md`: a new "After launch" entry names the switcher, records that
  MM-16 built it and MM-21 removed it, points at the parked palette, lists the
  four things reinstating it needs, and says to use `light-dark()` rather than
  two dark blocks. That entry replaces the old "Collapse the duplicated dark
  token block with `light-dark()`" line, whose premise — a duplicated block —
  no longer exists. The Turnstile and border-contrast lines stay and are marked
  as hanging off the switcher.

VERIFIED (`npm run build` clean)

- `dist/client/index.html` and `dist/client/about/index.html` contain exactly one
  `<script>` each and it is `type="application/ld+json"` — data, not executable
  JavaScript. So both pages ship zero JS. The workshop page has its JSON-LD plus
  the Turnstile tag, unchanged.
- No `<select>` in either page.
- `prefers-color-scheme` appears zero times in all three built pages, so the OS
  setting cannot reach the site (AC #2).
- One `theme-color` tag, `#FED`, unqualified.
- The only `data-theme` occurrence is the dormant token block in the inlined CSS
  (`:root[data-theme=dark]{...}`). Nothing sets the attribute, so this is a
  never-matching selector, not handling — reading AC #1's "no data-theme
  handling" as being about behaviour, which is what the task asks for by also
  saying to keep the block.

Effort: 6 min, 16 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. The site is light in every scheme. Deleted src/components/ThemeScript.astro and removed it from BaseLayout.astro; removed the scheme <select>, its label and its CSS from Header.astro along with the now-empty .site-header__end wrapper; Head.astro ships one unconditional <meta name="theme-color" content="#FED"> instead of two media-qualified tags; src/styles/tokens.css loses the @media (prefers-color-scheme: dark) block entirely and keeps :root[data-theme='dark'] dormant behind a comment. The measured dark palette is preserved in the new docs/decisions/M3-DARK-SCHEME-PARKED.md, which also records why it was parked and what reinstating it needs. docs/spec-v1.md: the Design/Colour paragraph, the Layout paragraph, the theme-color markup bullet and the JavaScript acceptance line all updated; the dark table removed. ROADMAP.md gains a "Colour-scheme switcher" entry under After launch, replacing the stale light-dark() line. Verified on the built output: / and /about/ ship zero executable JavaScript (their one <script> is JSON-LD), no <select>, no prefers-color-scheme anywhere in the three pages, one theme-color tag; the only data-theme in the HTML is the dormant CSS selector nothing sets. Coder (Opus): 6 min, 16 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
