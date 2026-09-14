---
id: TASK-89
title: 'MM-89: People page for the host'
status: Done
assignee: []
created_date: '2026-09-14 18:50'
updated_date: '2026-09-14 19:00'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 14. Route /speaking/2026/wordcamp-belgrade-ddev-ai/people/ (prerender false): host cookie required, else 404-style 'Not found' (do not reveal). Compact table of registrations newest first: #, when (HH:MM, day), name, city, email, OS, tools, terminal, SSH key (yes/no), own hosting, watching, news, confirmation status; a count line (total, working, watching); a link 'CSV' to /api/people.csv (host-only, text/csv, same columns). noindex, no-store, no JSON-LD, plain page in BaseLayout.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Host sees the table and CSV; others get 404; no-store and noindex; build, tests, check:csp clean
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Built (files, all new unless said):

- `src/lib/people.ts` — the read side of the `registrations` table: `listRegistrations`
  (newest first, `ORDER BY id DESC`; `ip_hash` never selected), `peopleCounts`
  (total, working, watching), `toCsv` (RFC 4180 quoting, CRLF, D1 column names as
  the header) and `whenInBelgrade` (`dd.MM HH:mm`, Europe/Belgrade). `ssh_key` is
  read only to answer yes or no; no key material leaves the module.
- `src/pages/speaking/2026/wordcamp-belgrade-ddev-ai/people.astro` — the page,
  `prerender = false`, behind `isHost`. Without the cookie it returns a minimal
  404 "Not found" document rather than a 403, so the route is not confirmed.
  BaseLayout, `noindex`, `Cache-Control: no-store`, h1, the count line, a
  "Download CSV" link and a thirteen-column `.table` in a `.table-scroll` box.
  No inline script.
- `src/pages/api/people.csv.ts` — the same rows as a file, host-only with the
  same 404, `text/csv; charset=utf-8`, `Content-Disposition: attachment;
  filename="registrations.csv"`, `no-store`. It re-reads D1 rather than reusing
  the page's rows.
- `src/styles/components.css`, `src/styles/layout.css` — appended only: the
  `.table` appearance (compact, `--text-sm`, token borders, zebra on
  `--color-bg-alt`) and `.table-scroll { overflow-x: auto; }`.
- `scripts/test-people.mjs` + the `test` line in `package.json` — 39 checks on a
  fake D1: order, the columns, the counts, CSV quoting (a name with a comma and
  a quote, a comma-joined tool list, an embedded line break), that no SSH key
  ever reaches the CSV, and the Belgrade clock including midnight.
- `astro.config.mjs` — the sitemap `serialize` now drops `/people/` as it drops
  `/api/`. The build had published the host-only URL in `sitemap-0.xml`; caught
  by inspecting `dist/client/sitemap-0.xml` after the first build.
- `README.md` (a "People" section under "Export registrations") and
  `docs/spec-v1.md` (a "3b." paragraph after Pages 3).

Verified: `npm run build` clean, with
`/speaking/2026/wordcamp-belgrade-ddev-ai/people` and `/api/people.csv` in the
server manifest (patterns `^/speaking/2026/wordcamp-belgrade-ddev-ai/people/$`
and `^/api/people\.csv$` — the dotted segment takes no trailing slash, so the
link on the page is right); `npm test` 39/39 green for this script and green
throughout; `npm run check:csp` "5 pages, 2 inline script(s), all covered";
`sitemap-0.xml` back to five URLs. Not verified: nothing was run against a
server — no dev server, no wrangler, no deploy — so the cookie gate, the
download header and the table's look on a phone are Mladen's to check.

Decisions where the spec left room: `github` is not shown or exported (the task
named the columns twice without it, though `/api/register/` still stores it);
`mailerlite_status` is in the CSV but not on the page, which the task's column
list ends at Confirmation; the title prop is "People · WordPress, Docker and AI
agents" and BaseLayout appends " · Mladen Djuric" as it does on every page; the
row `#` is the registration id, not a position, so page and CSV agree.

Effort: agent activity 20:50–21:01 local, about 14 minutes; roughly 40 tool
calls; one model, no subagents. AI cost pending the costing script.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The host's People page and its CSV are in: /speaking/2026/wordcamp-belgrade-ddev-ai/people/ lists every registration newest first behind the host cookie and answers 404 to everyone else, with /api/people.csv beside it as a download. Neither ever carries an SSH key. The reading lives in src/lib/people.ts and is covered by scripts/test-people.mjs (39 checks, fake D1). Build, tests and check:csp are clean; the page was also taken out of the sitemap, which had published its URL.
<!-- SECTION:FINAL_SUMMARY:END -->
