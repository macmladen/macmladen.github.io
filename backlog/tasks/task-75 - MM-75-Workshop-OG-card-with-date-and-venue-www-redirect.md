---
id: TASK-75
title: 'MM-75: Workshop OG card with date and venue; www redirect'
status: Done
assignee: []
created_date: '2026-09-10 08:03'
updated_date: '2026-09-10 08:14'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 6. The workshop OG card (scripts/og.mjs + src/data/og.ts) gains a second line: 'Friday, 18 September 2026 · 12:20 · Dom Omladine Beograda' from workshop.ts; the /speaking/ highlight block shows the date line too. The www rule was checked against Cloudflare's docs and left out: a static-asset redirect's source must be a file path and domain-level redirects are listed as unsupported, so www → apex is a zone-level Redirect Rule in the dashboard (Mladen's hand). The finding is documented in the head of public/_redirects, in ROADMAP.md and in the spec.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Workshop card shows the date line; /speaking/ highlight shows the date; www rule present and documented
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-10.

src/lib/dates.ts — two helpers on top of the existing formatters, both in Europe/Belgrade like everything else in the file. `dateAndTime(iso)` gives "Friday, 18 September 2026 · 12:20" (the comma is Intl's own en-GB output, the same form `fullDate` already produces in the closed-registration notice). `whenAndWhere(iso, place)` appends the place. Two helpers rather than one because markup wants the halves apart: the date and the time belong inside a `<time>`, the venue does not.

src/data/og.ts — `OgCard` gains an optional `subtitle`, and the workshop card sets it to `whenAndWhere(workshop.start, workshop.venue)`. The import carries its `.ts` extension like the other two, and `src/lib/dates.ts` is plain TypeScript with no Astro in it, so `scripts/og.mjs` still runs under bare Node with type stripping.

scripts/og.mjs — the card takes the registry entry rather than just the title and draws the subtitle between the title and the accent rule: 30px, the same size as the footer row, in `INK_SOFT`, with a 28px gap above. Cards without a subtitle draw no row at all. Checked by eye at 1200×630: the line sits on one row with room to spare.

src/pages/speaking.astro — the highlighted entry gains a `.appearances__when` line under the event: `<time datetime="2026-09-18T12:20:00+02:00">Friday, 18 September 2026 · 12:20</time> · Dom Omladine Beograda`.

src/styles/components.css — `.appearances__when` joins `.appearances__event` on the one rule (block, soft ink); no new declarations.

public/_redirects — the www rule was NOT added, because Cloudflare does not support it. Checked against https://developers.cloudflare.com/workers/static-assets/redirects/ (page dated 2026-08-25, read 2026-09-10). The `source` field is documented as "A file path." — only `destination` is "A file path or external link." — and the Advanced redirects table has the row "Domain-level redirects | ❌ | workers.example.com/* workers.example.com/blog/:splat 301". The finding, the quotes and the alternative are written into the head of the file so nobody adds the rule again. wrangler.toml attaches both macmladen.com and www.macmladen.com to the Worker as custom domains, so www serves the site; sending it to the apex is a zone-level Redirect Rule or a Bulk Redirect in the dashboard, which is Mladen's hand.

ROADMAP.md — the "OG card and highlight carry no date" line is gone (done); the www line now says why `_redirects` cannot do it and what will, with the curl to run afterwards.

docs/spec-v1.md — the sharing-cards bullet describes the optional second line and names the helper; a paragraph under the URL hierarchy says host canonicalisation is a zone rule, not a `_redirects` line.

Verified: `npm run og` redrew all five cards, `npm run build` clean with "Parsed 4 valid redirect rules" (the new comment block is ignored, as comments are), `npm test` 72 + 38 + 19 + 19 green, `npm run check:csp` 5 pages / 2 inline scripts all covered. The workshop card was opened and read; the built /speaking/ highlight carries the date line with its datetime attribute.

Effort measured: 6 minutes of agent activity, 22 tool calls, two of them the fetch of the Cloudflare docs page (HTML, then the .md rendering of the same page for a readable body).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The workshop's sharing card and the /speaking/ highlight now say when and where before anyone opens the link, both composed from src/data/workshop.ts through one pair of helpers in src/lib/dates.ts. The www redirect turned out not to be a _redirects matter at all: Cloudflare lists domain-level redirects as unsupported there, so the rule is documented as a dashboard job rather than added.
<!-- SECTION:FINAL_SUMMARY:END -->
