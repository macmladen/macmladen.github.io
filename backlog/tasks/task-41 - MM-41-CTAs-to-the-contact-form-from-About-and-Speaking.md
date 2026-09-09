---
id: TASK-41
title: 'MM-41: CTAs to the contact form from About and Speaking'
status: Done
assignee: []
created_date: '2026-09-09 10:59'
updated_date: '2026-09-09 11:05'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 41000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: 6 min. About ends with a primary button 'Request a proposal' → /contact/?topic=website; Speaking ends with 'Invite me to speak' → /contact/?topic=speaker (labels are drafts, marked; alternatives in the report). The contact page preselects the topic from the query string with a tiny inline script (page stays static and works without it), and the form's success/error re-render keeps the chosen topic.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Buttons render at the end of /about/ and /speaking/ with the stated hrefs
- [x] #2 Opening /contact/?topic=speaker preselects 'We are calling you as a speaker'; without the parameter the select is unchanged
- [x] #3 Only this one inline script is added, on /contact/
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
The topic key for the speaker CTA is `speaking`, not `speaker`: the four stored
keys in src/data/contact.ts are chat, website, training, speaking. The task text
and the AC both said `?topic=speaker`, which matches no option and would have
been silently ignored by the script. Both links use the real keys, so
`/contact/?topic=website` and `/contact/?topic=speaking`.

src/pages/about.astro ends with
`<p><a class="button" href="/contact/?topic=website">Request a proposal</a></p>`
and src/pages/speaking.astro with
`<p><a class="button" href="/contact/?topic=speaking">Invite me to speak</a></p>`,
each preceded by a `<!-- draft: Mladen to approve -->` marker, so the labels stay
flagged until approved. Both sit inside the page's `.flow` container, so the
spacing above them is the one the flow rule already gives every sibling; no new
CSS.

src/pages/contact.astro gains one `<script is:inline>`, an IIFE placed after the
form section and inside `<main>` so the select is parsed before it runs. It reads
`topic` from `location.search`, checks the value against `select.options`, and
assigns only on a match; an unknown key leaves the form on "Choose one".

The guard is `select.value !== ''` rather than a data attribute: the placeholder
option carries `value=""`, so an untouched form reads as empty and anything else
means a topic is already chosen. That is exactly the condition the task asked for
and it needs no extra markup. In practice /api/contact/ renders its own page,
which does not include this script, so the 422 and 200 re-renders are already out
of reach; the guard is what keeps that true if the script ever moves into
ContactForm.astro.

docs/spec-v1.md: Pages 2 now records the /about/ CTA; a new "2b. /speaking/"
entry records the /speaking/ CTA and states that the query keys are the stored
topic keys, not the labels, so a label may be reworded without breaking a link.
The /api/contact/ progressive-enhancement bullet and the JavaScript acceptance
criterion both now allow this one inline script on /contact/ and name it as the
only inline script on the site.

Verified: `npm run build` clean, no warnings. dist/client/about/index.html and
dist/client/speaking/index.html each carry their button with the stated href;
neither ships executable JavaScript (their single `<script>` is the
application/ld+json block, as on `/`). dist/client/contact/index.html has three
script tags — JSON-LD, Turnstile, and this one — and the inline script sits after
the `<select>` and before `</main>`. The logic was exercised outside the browser
against a stub select, six cases, all passing: untouched + ?topic=speaking and
?topic=website preselect; no query, an unknown key (`?topic=speaker`) and an
empty key leave it alone; a form that already carries a chosen topic is not
overwritten. A browser check of the live page is Mladen's, since agents do not
start servers here. `npm test` 38 passed, 0 failed.
Effort measured: about 6 minutes of agent activity, 20 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by coder (Claude Opus 5): "Request a proposal" at the end of
/about/ and "Invite me to speak" at the end of /speaking/, both draft-marked,
both pointing at /contact/ with a real topic key (`website`, `speaking` — the AC
said `speaker`, which is not a key). One inline script on /contact/ preselects
the topic and stands down when a topic is already chosen. Spec updated in three
places. AI time 6 min.
<!-- SECTION:FINAL_SUMMARY:END -->
