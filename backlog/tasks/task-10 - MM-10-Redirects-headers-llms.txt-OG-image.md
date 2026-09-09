---
id: TASK-10
title: 'MM-10: Redirects, headers, llms.txt, OG image'
status: To Do
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-09 11:06'
labels:
  - feature
milestone: m-3
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 1.5 h. Actual: . Billable: no. AI cost: . AI time: . public/_redirects (/radionica and /workshop → workshop page 302; /about and /about.html → /about/ 301), public/_headers (nosniff, referrer policy, permissions policy, CSP allowing self, inline styles, Turnstile script and frame), public/llms.txt, static public/og.png 1200×630 with name and one line, robots allowing all crawlers with the sitemap. Spec: URL hierarchy, Markup section.
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
