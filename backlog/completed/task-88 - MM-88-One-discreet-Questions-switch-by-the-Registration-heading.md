---
id: TASK-88
title: 'MM-88: One discreet Questions switch by the Registration heading'
status: Done
assignee: []
created_date: '2026-09-14 18:50'
updated_date: '2026-09-14 19:02'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 1 h. Actual: . Billable: no. AI cost: pending script. AI time: 13 min. Replace the host bar (MM-87) with one switch: a small 'Questions' label and a grey/green toggle to the right of the Registration h2, host-only. On: questions_open=1, the Questions band shows, the registration details folds (still openable, endpoint still accepting; registration_open stays 1). Off: questions_open=0, band hidden, registration unfolded. The fold is driven by questionsOpen in the page script; registrationOpen keeps its meaning for the endpoint and for a wrangler fallback. Next to the switch a host-only small link 'People' to the people page (MM-89 builds it).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Host sees label+switch+People link by the Registration heading, non-hosts nothing; one tap flips questions and folds/unfolds registration on every open page; /api/state/ unchanged; hostbar removed; tests, build, check:csp clean
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The host bar of MM-87 is gone — markup, `.hostbar` in the components layer,
`.hostbar__row` in the layout layer — and in its place, on the Registration
heading's own line, a `<span class="hostctl" data-hostctl hidden>` holding one
`role="switch"` button for `questions_open` and a small People link to
`${workshop.path}people/` (MM-89). The h2 keeps its id and its text; the two sit
in a `.register__head` flex row, `justify-content: space-between` and
`align-items: baseline`, wrapping under the heading on a narrow phone.

One switch now carries both halves of the same moment. The page script folds the
registration `<details data-registration>` when the stream says `questionsOpen`,
not `registrationOpen`: a room that has started asking is no longer a room
registering. Folded is not closed — the summary still opens the form and
`/api/register/` is still taking people — so the "Registration is closed" line
that MM-85 put beside the folded summary is gone with the fold that justified
it. `registrationOpen` no longer moves anything on the page; it keeps its
meaning for the endpoint and is written only by the wrangler line the run-book
now calls the emergency stop. `/api/state/`, `src/lib/state.ts`'s behaviour and
the stream's payload are untouched.

Files:
- `src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro` — the bar removed,
  the cluster added beside the h2, and in the inline script: `hostctl`/`flip`
  in place of `hostbar`/`flips`, `switches(open)` writing `aria-checked` from
  the stream, `toggle()` posting the opposite value for `questions_open`, the
  fold moved onto `questionsOpen`, `closedLine` and `registrationState()`
  dropped.
- `src/styles/components.css` — `.hostbar` rules replaced by `.hostctl`,
  `.switch`, `.switch__track` and its knob pseudo-element. Tokens only, with two
  exceptions that have no token and are commented in place: the pill's
  `border-radius: 0.625em` (half the track's height — `--radius-sm` is the 4px
  of inputs and buttons) and the knob's `50%`. Grey is `--color-border`, on is
  `--color-ok-ink`, the knob is `--color-field-bg`, which is the one token that
  stays the opposite of both track colours if the dormant dark palette is ever
  switched on. The only animation is `transition: translate 150ms ease` on the
  knob. No focus rule: `:focus-visible` in the base layer already gives the
  button the site's outline.
- `src/styles/layout.css` — `.hostbar__row` replaced by `.register__head`,
  `.hostctl` and the switch's own flex row.
- `public/_headers` — the workshop page's CSP hash moved to
  `sha256-Wom9uovAGLdqOTdAuySuqxJ4w5HAUZL0tk/lCjYL/+c=`, and the comment above
  it now names the switch instead of the bar.
- `README.md` — "Live questions" rewritten around one switch on the day: two
  hands on `questions_open` (the switch, the bookmark pair) with wrangler as the
  fallback under both and the only hand on `registration_open`; the run-book's
  "In the room" list, the two bookmark links, the endpoint table row and "Being
  the host" follow.
- `docs/spec-v1.md` — Pages 3: the host-bar bullet replaced by the cluster
  bullet, moved to sit after the registration bullet so the list keeps page
  order; the registration bullet's tail, the script bullet and the "Seven bands"
  line updated.
- `src/lib/state.ts`, `src/pages/api/state.ts` — comments only. Both described
  the host bar as the hand on both switches, which this task makes untrue; no
  code touched. Flagged rather than silently left wrong.

Verification, all without a server (rule 3):
- `npm run build` clean; `npm run check:csp` — 5 pages, 2 inline scripts, all
  covered; `npm test` — six suites, 280 checks, 0 failures (the sixth is MM-89's
  new `test-people.mjs`, running green alongside).
- The built page's inline script was extracted from
  `dist/client/speaking/2026/wordcamp-belgrade-ddev-ai/index.html` and driven
  headlessly against a DOM shim, as MM-87 was: 24 checks, all passing. host
  false — the cluster stays hidden, the band stays hidden, the registration
  stays unfolded. host true, `questionsOpen` false — the cluster is revealed,
  the switch unchecked, the band hidden, the registration unfolded. One tap —
  exactly one `POST /api/state/` carrying `key=questions_open` and `value=1`,
  the switch not moving on its own, the button re-enabled. A `state` event with
  `questionsOpen` true — the switch checked, the band shown, the registration
  folded. `registrationOpen` false with `questionsOpen` true — still folded;
  with `questionsOpen` false — unfolded all the same, which is the proof that
  the old flag no longer reaches the page. A tap while on posts `value=0`. And
  the built HTML carries no `data-hostbar` and no `data-flip="registration_open"`.
  The driver lives in the session scratchpad, not in the repo.

Not verified here, and the first things for Mladen's pass: the switch has never
been rendered in a browser, so the pill's proportions, the baseline alignment
with the h2 and the green at `--color-ok-ink` are unseen; and the two-device
behaviour (tap on the iPad, the fold landing on the projector within two
seconds) needs the preview server and the host cookie.

MM-89 was built in the same tree at the same time and landed first (23ed542).
Four files carry both tasks — README.md, docs/spec-v1.md, components.css and
layout.css — and the hunks are disjoint: theirs add the People section, the
spec's people bullet, `.table` and `.table-scroll`; mine are the run-book, the
switch bullet and the `.hostctl`/`.switch` rules. Nothing of theirs was reverted
and this commit carries none of it.

Effort: 13 min, 73 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-14. The host bar is gone and the day now has one control: beside the Registration heading, for the browser carrying the host cookie alone, a 'Questions' label and a pill that goes from --color-border grey to --color-ok-ink green, with a People link (MM-89) next to it. One tap posts key=questions_open with the opposite value to /api/state/ and nothing moves until the stream says the write landed. That one switch carries both halves of the moment: the questions band appears and the registration group folds itself away on every open page — folded, not closed, since the summary still opens the form and /api/register/ is still taking people. registrationOpen no longer reaches the page at all; it keeps its meaning for the endpoint and is written only by the wrangler line the run-book now calls the emergency stop, which is also why the 'Registration is closed' line of MM-85 is gone. /api/state/, src/lib/state.ts and the stream payload are untouched. Build clean, check:csp covered with the workshop page's new hash in public/_headers, six test suites and 280 checks green, and the built inline script driven headlessly against a DOM shim through all four states and both taps — 24 checks, all passing. What has not been seen is the rendering: the pill's proportions, its baseline against the h2 and the green itself want a browser, and the two-device behaviour wants the preview server and the host cookie. Coder (Opus 5): 13 min, 73 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
