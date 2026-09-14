---
id: TASK-87
title: 'MM-87: Host bar with switches for questions and registration'
status: Done
assignee: []
created_date: '2026-09-14 12:37'
updated_date: '2026-09-14 12:49'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 14 min. POST /api/state/ (host cookie required; fields key in {questions_open, registration_open}, value '0'|'1'; 204 for fetch, 303 back otherwise; GET with the same query params also accepted for a link from the iPad, host cookie required). On the workshop page a host-only bar (hidden until the stream says host) at the top of the Questions/Registration area with two toggle buttons showing the live state from the stream; tapping posts the flip. README run-book updated: the bar replaces the wrangler lines, which stay as fallback.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Host sees the bar with the two states; a tap flips within two seconds on every open page; non-hosts see nothing and get 403 on the endpoint; tests, build, check:csp clean
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Endpoint: src/pages/api/state.ts, prerender false, POST and GET sharing one flip() — host cookie or 403, missing DB 503, anything that is not one of the two keys or one of the two values 422, then setState. POST answers 204 to X-Requested-With: fetch and 303 to workshop.path#questions otherwise; GET always 303, so a bookmarked link lands back on the page. GET that writes is deliberate and argued in the file header: on a lectern a bookmark that does the thing beats a page with a form on it, the cookie keeps crawlers out and the write is idempotent.

Library: src/lib/state.ts gains StateKey/StateValue, readStateChange(source) — a pure parse over anything with a FormData- or URLSearchParams-shaped get(), null when the key or the value is not one of the allowed two — and setState(db, key, value), an UPDATE rather than an upsert so an unmigrated database is not silently seeded.

Page: src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro carries <div class="hostbar" data-hostbar hidden> as the first child of <article>, above the first section, with two .button--secondary buttons carrying data-flip and aria-pressed. The script's live() gained switches(data) — reveals the bar on host, writes 'Questions: on/off' and 'Registration: on/off' plus aria-pressed from the stream's state event — and flip(button), which posts the opposite of the current aria-pressed to /api/state/ and updates nothing itself. Labels move only when the stream says the write landed.

Styles: .hostbar and .hostbar .button in src/styles/components.css (alt band, rule underneath, small compact buttons; inline-size: auto beats the below-480px full-width .button rule on specificity), .hostbar__row in src/styles/layout.css (flex, wraps rather than stacks — .row is built to stack, which is wrong for a control strip).

Tests: scripts/test-questions.mjs gained 'flipping a switch' (6 checks against the fake D1, which learned the UPDATE workshop_state statement) and 'what /api/state/ accepts' (12 checks on readStateChange, including a URLSearchParams). 72 -> 90 checks, all green.

CSP: the workshop page's hash moved to sha256-yi3G0yPti8yIGTsnL6HOOSAmm4TxnwIzmFmkkgtdMTk= in public/_headers; npm run check:csp reports 5 pages, 2 inline scripts, all covered.

Docs: README 'Live questions' now names three hands on the switches (bar, bookmarked link, wrangler as fallback), the endpoints table gained both /api/state/ rows, and the run-book leads with the bar and the four bookmarkable URLs, keeping the two wrangler lines underneath as the fallback. docs/spec-v1.md Pages 3 gained the host bar paragraph and the band-order line mentions it.

Verification: npm run build clean, npm test 90/90, npm run check:csp covered. The browser-pane check asked for could not be run as specified — the preview pane renders local files as static snapshots with no JavaScript, and no Chrome extension is connected — so the built page's own inline script was extracted from dist/client/.../index.html and driven headlessly against a DOM shim (scratchpad, not committed): host false leaves the bar hidden, host true with questionsOpen false and registrationOpen true gives 'Questions: off | Registration: on' with aria-pressed false|true, a click sends one POST to /api/state/ with X-Requested-With: fetch, credentials same-origin and fields key=questions_open value=1, the label does not move until the next state event, and a state event with host false hides the bar again. 21 checks, all passing. The appearance was checked on a Quick Look render of the built page with the bar revealed: a slim sand band under the header carrying the two outlined buttons.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The two workshop switches moved from a wrangler command line to a tap on the page. /api/state/ takes a key and a value behind the same host cookie that marks questions covered, by POST from the bar and by GET from a bookmark; the bar itself is hidden in every copy of the page and revealed only by the stream's host flag, and its labels are written from the stream rather than from the click, so a flip that does not land leaves the label where it was. Raw figures: about 14 minutes of agent activity, roughly 70 tool calls, one Opus coder session. Build, 90 unit checks and check:csp all clean; the browser-pane verification was replaced by a headless drive of the built page's own script, because the preview pane does not run JavaScript on local files.
<!-- SECTION:FINAL_SUMMARY:END -->
