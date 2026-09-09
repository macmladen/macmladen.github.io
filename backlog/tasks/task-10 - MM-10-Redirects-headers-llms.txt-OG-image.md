---
id: TASK-10
title: 'MM-10: SEO pack: per-page OG images, headers, llms.txt, redirects'
status: To Do
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-09 12:28'
labels:
  - feature
milestone: m-3
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: . Per-page OG images generated at build (1200x630, name, page title, sand and ink, accent rule) and referenced by each page's og:image; public/_redirects (/radionica and /workshop → workshop page 302; /about, /about.html → /about/ 301); public/_headers (nosniff, referrer policy, permissions policy, CSP allowing self, inline styles, Turnstile script and frame on the form pages, and the contact page's inline script by hash); public/llms.txt; robots allowing all with the sitemap. Spec: URL hierarchy, Markup section.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Each redirect in the spec table resolves as stated in wrangler pages dev
- [ ] #2 _headers applied; CSP does not block Turnstile
- [ ] #3 llms.txt describes the person and lists the three pages
- [ ] #4 og.png referenced from every page's og:image with absolute URL
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Note 2026-09-09: the CSP must allow the inline topic-preselect script on /contact/ (hash it or move it to a file) and Turnstile on both /contact/ and the workshop page.
<!-- SECTION:NOTES:END -->
