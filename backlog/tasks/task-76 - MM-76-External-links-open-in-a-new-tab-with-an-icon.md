---
id: TASK-76
title: 'MM-76: External links open in a new tab with an icon'
status: Done
assignee: []
created_date: '2026-09-10 08:03'
updated_date: '2026-09-10 08:21'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 8. Every link to another origin gets target=_blank and rel=noopener, and a small external-link icon after the text. Mechanism: scripts/external-links.mjs, run as npm's postbuild hook, rewrites every HTML file in dist/client, adding the attributes to anchors whose href is absolute http(s) and not macmladen.com; rel is merged so the footer's me survives; data-no-external opts an anchor out. The icon is a[target=_blank]::after in components.css, an inline SVG mask in currentColor, sized to the text, suppressed inside .site-footer and on .button. Sources stay clean except where the postbuild step cannot reach: Footer, RegistrationClosed and RegistrationSuccess are rendered at runtime by the endpoints and carry the attributes themselves. check:csp unaffected.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All external links in dist have target=_blank rel=noopener and show the icon; internal links untouched; footer icons and buttons without icon; runtime-rendered form responses match
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-10.

scripts/external-links.mjs (new) — walks every HTML file in dist/client and gives each anchor that leaves the site `target="_blank"` and `rel="noopener"`. Outward means an href starting `http://` or `https://` whose host is neither macmladen.com nor www.macmladen.com; the two hosts are derived from `person.url` rather than typed out. Relative links, fragments and mailto: are untouched, and `data-no-external` on an anchor skips it entirely. `rel` is merged, never replaced, so the footer's `me` survives as `rel="me noopener"`. No HTML parser is in the dependency tree (checked: no parse5, no htmlparser2, no cheerio) and one attribute on one element did not justify adding one, so it is a regex that matches whole `<script>` and `<style>` elements — skipping them wholesale, which is what keeps the page's inline script and the JSON-LD blocks out of reach — or an anchor's opening tag. Idempotent: a second run rewrites nothing. It prints the file it changed, then a summary line and the host tally.

package.json — `"links": "node scripts/external-links.mjs"` with `"postbuild": "npm run links"`, mirroring the existing `"og"` / `"prebuild"` pair. NOT chained into `"build"` as the task notes suggested: npm's postbuild hook already runs it inside `npm run build`, and doing both would run the rewriter twice on every build. `prebuild` and `build` are unchanged.

src/styles/components.css — `a[target="_blank"]:not(.button):not(.site-footer a)::after` draws the arrow: Material Design's "open_in_new" on a 24px grid, inlined as a mask so it takes currentColor, 0.8em square with a 0.2em gap, both prefixed and unprefixed mask properties because the build runs no autoprefixer. It is in components.css and not base.css as the task notes suggested, because base.css opens with "Bare tags only. No class ever appears in this file." and the selector needs two class exclusions; the icon is pure appearance, which is what components.css is for.

Source attributes where the postbuild step cannot reach — the two endpoints render their answers at runtime, so those responses are not files: src/components/Footer.astro (the three profile links, `rel="me noopener" target="_blank"`), src/components/RegistrationClosed.astro (the WordCamp desk link) and src/components/RegistrationSuccess.astro (the GitHub repo link) carry the attributes in their own markup, each with a comment saying why. RegistrationForm.astro and ContactForm.astro needed nothing: their only links, including the ones in the `<noscript>` blocks, are `mailto:`, and there is no Turnstile link in either.

docs/spec-v1.md — a new bullet in the Markup section describing the rule, the exclusions, the mechanism and the runtime exception. README.md — `npm run links` added to the Build list, and the paragraph about `prebuild` now covers `postbuild` too.

Verified against dist/client: 141 anchors over the five pages, of which 92 are external across 15 hosts (speakerdeck.com 30, en.wikipedia.org 24, www.youtube.com 11, github.com 7, rs.linkedin.com 6, then eight more). All 92 carry target="_blank" and noopener in rel; 46 internal anchors and 3 mailto: links carry neither. /about/ alone has 32 external anchors — 29 in the prose, 3 in the footer. The built pages were opened from disk in the browser: the arrow renders after the body links in the link colour, and computed styles confirm ::after has content on a body external link (13.23px wide, mask set) and `none` on the footer profile marks, the footer nav, the header links, the primary button and the secondary WordCamp button. RegistrationClosed was rendered by backdating closesAt to check its spacing — "Ask at the WordCamp Belgrade 2026 desk" comes out right — and closesAt restored. `npm run build` clean with the postbuild step running inside it, a second run of the script rewrites 0 files, `npm test` 72 + 38 + 19 + 19 green, `npm run check:csp` 5 pages / 2 inline scripts all covered (no script was added, so public/_headers is untouched).

Effort measured: 8 minutes of agent activity, 27 tool calls, four of them the browser checks against the built files on disk.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Links that leave the site now say so: a new tab, rel=noopener, and a small arrow after the text. The attributes are added to the built pages by scripts/external-links.mjs as npm's postbuild hook, so the components keep saying only where a link goes; the three components the endpoints render at runtime carry the attributes in their own source, because a runtime response is not a file the build can rewrite.
<!-- SECTION:FINAL_SUMMARY:END -->
