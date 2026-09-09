---
id: TASK-15
title: 'MM-15: Footer: centred LinkedIn and GitHub icons, no email'
status: Done
assignee: []
created_date: '2026-09-08 19:36'
updated_date: '2026-09-08 20:29'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 0.5 h. Actual: . Billable: no. AI cost: pending script. AI time: . Footer holds only LinkedIn and GitHub as inline SVG icons with visually hidden labels and rel=me, centred; the brand links and the email go; the copyright line stays centred under the icons. A Contact page is a separate task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Footer shows two icon links, centred, with accessible names and rel=me
- [x] #2 No mailto in the footer; person.ts keeps the email for JSON-LD
- [x] #3 Icons are inline SVG, no external request
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
src/components/Footer.astro was rewritten. A `marks` record in the frontmatter
holds one 24px path per brand (LinkedIn and GitHub, official glyphs), and the
footer renders `person.profiles.filter((p) => p.name in marks)`. That is why
Speaker Deck disappears from the footer without a hardcoded exclusion list: it has
no mark. The URLs still come from person.profiles, so person.sameAs and the footer
cannot drift apart.

Each link is `<a class="site-footer__icon" href rel="me">` wrapping
`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">`
with a single `<path>`, followed by `<span class="visually-hidden">LinkedIn</span>`
(or GitHub) which is the link's whole accessible name. No external request: the
paths are inline in the document.

The `<address>` block with the mailto is gone and so are the three brand links.
src/data/person.ts is untouched: email, brands and profiles are all still there for
the JSON-LD, and the Person node still emits `"email": "mailto:mladen@macmladen.com"`.

The list is centred with justify-content: center and gap --space-2; each link adds
--space-2 of padding, so the marks sit about 24px apart and the tap target is 40px.
The copyright line is text-align: center under it. The icon link sets
text-decoration: none — there is no text in it to underline; hover colour comes
from the inherited a:hover rule and the SVG follows it through currentColor.
Task 16 adds the outline on hover and focus.

docs/spec-v1.md line 93 (Pages, home, footer bullet) was rewritten to describe the
two icon links, the visually hidden labels, rel="me" and the centring, and to say
that Speaker Deck, the brands and the email now live only in person.ts for the
JSON-LD.

Two other places in the spec still describe the old three-link footer and were
deliberately NOT changed, because they are outside what this task was scoped to and
one of them is an acceptance criterion Mladen ticks:
- the "Markup, SEO, machine readability" bullet "rel=me on the LinkedIn, GitHub and
  Speaker Deck links in the footer";
- the acceptance criterion "rel=me is present on the three profile links".
Both now read as two links, not three. Mladen's call.

Verified with npm run build (clean) against all three built pages: footer has two
rel="me" links, accessible names LinkedIn and GitHub, no mailto and no brand URL
inside <footer>. The only mailto left on / and /about/ is inside the JSON-LD; the
workshop page's second one is its existing noscript fallback, untouched.

Effort: 5 min, 9 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-08. The footer is now two centred inline-SVG icon links, LinkedIn and GitHub, each with rel="me" and a visually hidden text label, with the copyright centred under them. Speaker Deck, the three brand links and the mailto address are out of the footer; src/data/person.ts keeps all of them for the JSON-LD. src/components/Footer.astro rewritten, docs/spec-v1.md Pages 1 footer bullet rewritten. Flagged, not changed: two other spec lines still say three profile links. Build clean, all three pages verified. Coder (Opus): 5 min, 9 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
