---
id: TASK-10
title: 'MM-10: SEO pack: per-page OG images, headers, llms.txt, redirects'
status: Done
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-09 12:45'
labels:
  - feature
milestone: m-3
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 22. Per-page OG images generated at build (1200x630, name, page title, sand and ink, accent rule) and referenced by each page's og:image; public/_redirects (/radionica and /workshop → workshop page 302; /about, /about.html → /about/ 301); public/_headers (nosniff, referrer policy, permissions policy, CSP allowing self, inline styles, Turnstile script and frame on the form pages, and the contact page's inline script by hash); public/llms.txt; robots allowing all with the sitemap. Spec: URL hierarchy, Markup section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Each redirect in the spec table resolves as stated in wrangler pages dev
- [ ] #2 _headers applied; CSP does not block Turnstile
- [x] #3 llms.txt describes the person and lists the three pages
- [x] #4 og.png referenced from every page's og:image with absolute URL
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Note 2026-09-09: the CSP must allow the inline topic-preselect script on /contact/ (hash it or move it to a file) and Turnstile on both /contact/ and the workshop page.

Note 2026-09-09 (implementation): the sharing cards are drawn by scripts/og.mjs, run as npm's prebuild hook, not by an Astro endpoint. The endpoint was built first and does not work here: @astrojs/cloudflare v14 prerenders routes inside workerd rather than Node, so a prerendered /og/[slug].png can neither read a font off disk nor call an image library (build fails with 'No such module "chunks/sharp"'). Before that, the adapter's ssr.noExternal had already refused @resvg/resvg-js, a native .node binary it tries to inline. sharp does the rasterising instead — Astro builds with it already, the adapter externalises it, and satori embeds every glyph as a <path>, so the rasteriser needs no font of its own.

Note 2026-09-09: ACs 1 and 2 are left unticked on purpose. Both ask for behaviour under a running wrangler preview, and agents do not start servers here (AGENTS.md rule 3). What was verified without one: the four rules and the full header block are copied verbatim into dist/client/_redirects and dist/client/_headers; the CSP names https://challenges.cloudflare.com in script-src, frame-src and connect-src; and npm run check:csp rehashes every inline script in the build against the policy and passes.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
SEO pack shipped in three commits on main: a4ec6e1 (sharing cards), 45b5964 (_redirects, _headers, llms.txt, check:csp), cfa8c6b (spec, README, roadmap).

Cards: five 1200x630 PNGs, one per page, drawn by scripts/og.mjs with satori and sharp into public/og/ (git-ignored, redrawn by npm's prebuild hook) — home 46,906 B, about 29,941 B, speaking 32,712 B, contact 31,340 B, workshop 48,864 B, every one 1200x630 by file(1) and sips. src/data/og.ts is the registry both the script and Head.astro read; Head.astro takes an ogSlug prop defaulting to the card registered for the page's canonical path, and emits an absolute og:image plus og:image:type/width/height and twitter:image. The old image prop and its /og.png default are gone. Inter latin 400 and 700 are checked into src/assets/fonts with the OFL text.

Headers and redirects: public/_headers carries nosniff, strict-origin-when-cross-origin, the three denied permissions, and a CSP whose script-src holds Turnstile's origin and sha256-fRHl85QdtBhJRtJKFXcWtpmWojToC3hZzoFuIEBMyBM=, the hash of the one inline script on /contact/. npm run check:csp recomputes that from dist and passes: five pages, one inline script, JSON-LD blocks skipped as data. public/_redirects keeps the /about rule although Cloudflare's default html_handling would normalise it, because it does so with a 307 and the spec says 301. public/llms.txt lists all five pages. robots.txt needed no change.

Verification without a server: npm run build clean, no warnings; both files copied verbatim into dist/client; npm test 38 passed. ACs 1 and 2 wait on Mladen's wrangler preview run.

Effort: ~22 minutes of agent activity, ~75 tool calls, one coder subagent session (Claude Opus 5). AI cost pending the costing script.
<!-- SECTION:FINAL_SUMMARY:END -->
