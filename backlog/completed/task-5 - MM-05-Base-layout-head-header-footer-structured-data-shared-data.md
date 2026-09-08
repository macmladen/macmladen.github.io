---
id: TASK-5
title: 'MM-05: Base layout, head, header, footer, structured data, shared data'
status: Done
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 10:19'
labels:
  - feature
milestone: m-1
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . BaseLayout with Head component (title pattern, description, canonical, OG, Twitter, theme-color, lang en), skip link, header (name → /, nav with About only), footer (rel=me profile links, brand links, address with mladen@macmladen.com), StructuredData component, src/data/person.ts, workshop.ts (title, date 2026-09-18, start 12:20, end 13:40, venue Dom Omladine Beograda, Makedonska 22, Belgrade, closeDate 2026-09-15, wordcampUrl), speaking.ts. Spec: Markup, SEO section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Landmarks header/nav/main/footer present; skip link is the first focusable element
- [x] #2 Head emits title, description, canonical, og:*, twitter:card, theme-color for any page using the layout
- [x] #3 Footer links resolve to the URLs in the spec; LinkedIn, GitHub, Speaker Deck carry rel=me
- [x] #4 Data files are the single source for values that appear in both HTML and JSON-LD
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Created src/data/person.ts, workshop.ts, speaking.ts; src/components/Head.astro,
StructuredData.astro, SkipLink.astro, Header.astro, Footer.astro;
src/layouts/BaseLayout.astro; public/favicon.svg. src/pages/index.astro now uses
BaseLayout around a placeholder h1 so the shell renders; MM-06 fills it.

Data files are the only source: the footer link list is built from
person.profiles (rel="me") and person.brands, person.sameAs is derived from
person.profiles so HTML and JSON-LD can never drift, speaking.ts imports
workshop.ts for the WordCamp Belgrade entry, and Head.astro takes the site name
and OG site_name from person.name.

Head.astro emits charset, viewport, title, description, canonical (absolute, built
from Astro.site), theme-color #FED, og:type/title/description/url/image/locale
en_US/site_name, twitter:card summary_large_image and the SVG favicon. Titles are
"<page> · Mladen Đurić"; the fullTitle prop lets the home page pass its own
complete title. og:image defaults to /og.png, which MM-10 still has to produce.
No favicon.ico existed in the repo, so only the SVG is referenced.

Header and Footer carry their own scoped CSS wrapped in @layer components, so
component styles stay inside the layer order instead of overriding it from
outside; verified in the built CSS, where .site-header lands inside
@layer components.

Verified with npm run build (no warnings) against dist/client/index.html:
one inlined <style>, zero <link rel="stylesheet">, zero <script>, 11.7 kB total;
skip link is the first element in the body, then header > nav[aria-label="Main"],
main#main, footer; every footer href matches the spec and the three profile links
carry rel="me". StructuredData.astro was smoke-tested through a temporary build
(renders a single application/ld+json script into the head slot) and the temporary
markup was reverted. speaking.ts and workshop.ts were likewise exercised through a
temporary build: 5 appearances, registrationOpen true today.

Two things the source material does not settle:
1. Drupal Dev Days Burgas has no year and no title anywhere in the handover, so
   Appearance.year and Appearance.title are typed `number | null` / `string | null`
   and that entry carries nulls rather than an invented year. Needs Mladen.
2. registrationOpen is evaluated at build time (static output), so it flips only on
   the next build. Cut-off is the end of 2026-09-15 in Europe/Belgrade.
The home page's meta description is person.bioShort (340 chars) as a placeholder;
MM-06 should replace it with a purpose-written one.

Effort: 18 min, 10 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. Shared data (person, workshop, speaking), Head, StructuredData, SkipLink, Header, Footer, BaseLayout, SVG favicon, and index.astro reduced to the layout shell for MM-06. Build clean; dist/client/index.html has one inlined style, no external CSS or JS, all four landmarks, the skip link first, rel=me on the three profile links. Open: Drupal Dev Days Burgas has no year or title in the source (nulls in speaking.ts), /og.png is still owed by MM-10. Commit f59f498. Coder (Opus): 18 min, 10 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
