---
id: TASK-72
title: 'MM-72: Watch-only switch above GitHub hides the laptop fields'
status: Done
assignee: []
created_date: '2026-09-10 06:57'
updated_date: '2026-09-10 07:08'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 1. Actual: . Billable: no. AI cost: pending script. AI time: 5. The 'I will watch, not work on my own laptop' checkbox moves up, directly after email. When checked, the fields GitHub username, Operating system, AI tool, Terminal experience, SSH public key and 'I have my own hosting' are hidden (hidden attribute on their wrappers, values kept) and skipped by client validation; unchecked shows them again. Works without JS (all fields visible). Server side: watch-only registrations ignore those fields.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Checkbox above GitHub toggles the six fields; no-JS shows all; server ignores laptop fields for watch-only
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-10.

src/components/RegistrationForm.astro — the watch-only checkbox is now its own .field/.checkbox block directly under email, with the same label. Five wrappers carry data-laptop-only: the GitHub .field, the .fieldset-row holding the operating-system and AI-tool fieldsets, the terminal fieldset, the SSH-key .field and the own-hosting .checkbox. The newsletter box stays in 'Anything else' and is never hidden.

src/pages/speaking/2026/wordcamp-belgrade-ddev-ai.astro — the page script gained laptopFields(), which sets hidden on every [data-laptop-only] from the box's state on load and on change, and wire(), which runs enhance() and laptopFields() together; wire() replaces the two enhance() calls after a re-render, so the switch survives both the success swap and the error swap. Nothing is emptied, so the values come back on unticking.

src/lib/validate.ts — dropLaptopAnswers() clears github, os, tool, terminal, ssh_key and own_hosting on a watch-only submission. src/pages/api/register.astro applies it between readForm() and validate(), so a stale value in a hidden field is neither stored nor sent to MailerLite and cannot fail the submission. It fires only on a box the visitor ticked; a registration the endpoint later turns into a watching one (MM-71) keeps its answers.

src/lib/registrations.ts — orNull() stores an empty terminal or ssh_key as NULL. github, os and tool are NOT NULL from migration 0001 and keep the empty string; that is the resolved ambiguity in 'store nulls'.

public/_headers — the workshop page's script hash is now sha256-s5dAHCSS26pdF6tw0a/Aois7E3+TfmaWNUxo+ESx2oU= (was sha256-vTtDa9goiZwRfrp+zsyjlFuUEXoWxtVhNOIp+WfvK0o=); the comment above the policy names the third thing the script does.

docs/spec-v1.md — the watch_only row and a new paragraph describing the switch, the no-JS behaviour and the server rule; the endpoint bullet and the progressive-enhancement bullet.

Verified: npm run build clean, npm test 63 + 38 green, npm run check:csp 5 pages / 2 inline scripts all covered. The built page was driven in the browser pane: ticking hides all five blocks, unticking shows them, a value typed into GitHub survives the round trip, and the control order reads name, email, watch_only, github, os.

Effort measured: 5 minutes of agent activity, 17 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
The watch-only switch sits under the email field and hides the six laptop answers while it is ticked; the server clears them for a watch-only registration whether the script ran or not.
<!-- SECTION:FINAL_SUMMARY:END -->
