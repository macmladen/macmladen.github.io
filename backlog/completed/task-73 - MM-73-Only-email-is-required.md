---
id: TASK-73
title: 'MM-73: Only email is required'
status: Done
assignee: []
created_date: '2026-09-10 06:57'
updated_date: '2026-09-10 07:03'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 1. Actual: . Billable: no. AI cost: pending script. AI time: 13. Privacy: only email is required on the registration form. Name, GitHub, OS, AI tool, terminal experience, SSH key, all optional; the required attribute and the 'required' marks come off everything but email; server validation requires email only and validates the others only when present (GitHub pattern, SSH key format, known option keys, at least one tool no longer required). Hints reworded where they said mandatory. Tests updated. Spec form table updated.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Submitting with only an email succeeds; other fields validated only when filled; marks removed; tests green
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented by coder (Claude Opus 5, xhigh) on 2026-09-10.

src/lib/validate.ts — validate() now insists on email alone. name is only length-checked, github, os, tool and terminal are checked only when they carry a value, and a value that was never on offer is still refused. messages.name dropped (nothing reaches it any more); messages.os, messages.tool and messages.terminal reworded from 'please answer' to 'that is not one of the answers offered', which is what they now mean.

src/components/RegistrationForm.astro — the required attribute and the 'required' mark stay on email only; name, github, the os radios and the terminal radios lost both, the os and terminal legends lost the mark. The AI tool hint no longer asks for at least one; it stays marked draft.

scripts/test-validate.mjs — 50 checks, green. New: the minimum is an email and nothing else, each of the five optional fields may be empty, no tool field at all passes. Removed: the missing-name, empty-github, empty-os, empty-tool and empty-terminal rejections.

docs/spec-v1.md — form table required column and the paragraph about the 'required' mark rewritten.

src/lib/mailerlite.ts — comment only: the custom fields may now travel as empty strings, deliberately.

Effort measured: 13 minutes of agent activity, 31 tool calls (17 of them the read-in of the form, endpoint, validator, page script, spec and README shared with MM-70..72). npm run build clean, npm test 50 + 38 green, npm run check:csp 5 pages / 2 inline scripts all covered; the built form was inspected control by control.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Only email is required. Everything else on the registration form is optional and validated only when filled in; the form, the validator, the tests and the spec say the same thing.
<!-- SECTION:FINAL_SUMMARY:END -->
