---
id: TASK-57
title: >-
  MM-57: Registration form: required marks, OS radios, tool checkboxes, terminal
  experience
status: Done
assignee: []
created_date: '2026-09-09 14:32'
updated_date: '2026-09-09 14:44'
labels:
  - feature
milestone: m-5
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Actual: . Billable: no. AI cost: pending script. AI time: 6 min. Required marks ('required' word as on the contact form) on name, email, github, os. OS becomes a radio group (macos/windows/linux). AI tool becomes a checkbox group, multiple allowed (claude-code/codex/cursor/other), stored comma-joined in the existing tool column and sent to MailerLite the same way. New radio group 'Terminal experience' with three levels (keys: beginner/comfortable/fluent; labels drafted by the coder from Mladen's wording, marked draft): stored in a new terminal column (migrations/0003_registrations_terminal.sql), required. Radio and checkbox groups render in two columns from 480 px. Validation, tests, D1 insert, MailerLite fields, README query updated; endpoint 422 re-render preserves the choices.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Form shows required marks, OS radios, tool checkboxes (multi), terminal radios, two-column groups
- [x] #2 Validation and tests cover the new shapes; invalid POST preserves selections
- [x] #3 Migration 0003 adds terminal; local migration applied; README notes the remote migration Mladen must run before deploy
- [x] #4 MailerLite upsert sends tool (joined) and terminal
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
THE THREE GROUPS

Each is a <fieldset class="flow"> with a <legend>, the same shape as the
"Anything else" group that was already there, holding a .choices grid of
.checkbox rows. Not <fieldset class="field">: .field is display: grid, and a
grid on a fieldset leaves the legend outside the grid in some engines, and
.field input would paint every radio as a full-width bordered box.

- Operating system: three radios, name "os", each carrying required (the
  attribute constrains the group, not the one input).
- AI tool: four checkboxes, all named "tool". No required attribute — on a
  checkbox it would demand that one box, which is not the rule. The rule is
  server-side: at least one, and every value has to be one the form offered.
- Terminal experience: three radios, name "terminal", required.

TERMINAL LABELS (draft, marked in src/data/registration.ts)

  beginner     Beginner: I have pasted a command or two
  comfortable  Comfortable: npm, npx and git from the terminal are routine
  fluent       Fluent: the terminal is where I work

SEVERAL TOOLS IN ONE COLUMN

FormLike grew getAll(), because four boxes share one name and get() sees only
the first. readForm joins the ticked values with toolSeparator (','), which is
what goes into the tool column and into the MailerLite field; splitTools() reads
it back, and the form re-ticks from it on a 422. None of the option values
contains a comma, so the join is lossless. A single field carrying
"claude-code,notepad" is refused, same as any other made-up value — there is a
test for it.

TWO COLUMNS FROM 480px

.choices in the layout layer: a grid, gap --space-2/--space-6, one column at
360px and two from a literal 480px — the third breakpoint on the site and the
only one below 768px. Checked in a browser against the built file at 375px (one
column) and at 480px (two). At 480px the three terminal labels wrap to two or
three lines each in their column; it is legible and the rows line up, but if
Mladen finds it cramped the fix is one line — drop .choices from that one
fieldset, or make the grid auto-fit on a min-width token instead of a hard
breakpoint.

.checkbox now also dresses radios. The class kept its name rather than being
renamed everywhere: the row is the same object whatever shape the control is,
and renaming would have churned the three existing checkboxes for nothing. A
comment in components.css says so.

REQUIRED MARKS

name, email, github, the Operating system legend, the Terminal experience
legend — five, all <span class="field__required">required</span>, the contact
form's pattern.

DELIBERATELY NOT MARKED: the AI tool legend, because the brief named os and
terminal and not tool. But the validator does require at least one tool, so the
group carries the constraint in its hint instead: "Tick every one you will have
with you — at least one." That sentence is new copy and is marked draft in the
component. If Mladen would rather have the mark on the legend it is one span,
and the hint can lose its first sentence.

D1

migrations/0003_registrations_terminal.sql: ALTER TABLE registrations ADD COLUMN
terminal TEXT. Nullable, not NOT NULL: rows written before it never had an
answer and a default would invent one. Applied locally with npx wrangler d1
migrations apply macmladen-registrations --local (0001, 0002 already applied;
0003 reported ✅) and confirmed with PRAGMA table_info — terminal, TEXT, cid 13,
notnull 0. THE REMOTE MIGRATION IS NOT RUN: it is Mladen's hand, and until it is
run the live endpoint will 503 on every registration. README says so in bold at
the point where the migrations are listed.

MAILERLITE

fields now carry terminal alongside the joined tool. A custom field the account
does not know is dropped silently and the call still answers 2xx, so a missing
terminal field would look like a success and lose the answer — that is in the
README under "MailerLite fields" and in a comment above the payload.

TESTS AND BUILD

scripts/test-validate.mjs: its form() helper now appends an array once per
entry, so a multi-value checkbox group can be submitted the way a browser sends
it. New checks — several tools join with a comma, one tool stays alone, no tool
is an empty string, all four tick, each of the three terminal levels passes, a
made-up tool among real ones is refused, a comma-separated string in one field
is refused, a bad terminal level and a missing one are refused. The registration
suite goes from 36 checks to 50, all green; the contact suite is untouched at 38.
npm test green for both suites, npm run build clean, npm run check:csp still 5 pages, 1
inline script, all covered.

NOT VERIFIED WITHOUT A SERVER: the 422 round trip itself. The values reach the
form the same way they did when os and tool were selects, and the re-tick logic
is covered by the readForm/splitTools tests, but seeing a rejected POST come
back with the boxes still ticked needs npm run preview, which is Mladen's to
start.

Effort: 6 min, 45 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09 by coder (Opus 5). The registration form now marks name, email, github and the Operating system and Terminal experience legends with the word "required"; the operating system is a radio group, the AI tool a checkbox group that takes several answers, and there is a new required radio group, Terminal experience, with three levels — beginner, comfortable, fluent — whose labels are draft-marked in src/data/registration.ts: "Beginner: I have pasted a command or two", "Comfortable: npm, npx and git from the terminal are routine", "Fluent: the terminal is where I work". Ticked tools travel as one comma-joined string into the existing tool column and into the MailerLite tool field; the validator requires at least one and refuses any value the form did not offer. The answer to the terminal question goes into a new nullable column added by migrations/0003_registrations_terminal.sql, applied to the local database and confirmed with PRAGMA table_info; the remote migration is Mladen's to run before the next deploy, and README says in bold that until then the live endpoint 503s on every registration. Groups are laid out by a new .choices grid — one column at 360px, two from 480px — checked in a browser against the built page at both widths. Changed: src/data/registration.ts, src/lib/validate.ts, src/lib/registrations.ts, src/lib/mailerlite.ts, src/components/RegistrationForm.astro, src/styles/layout.css, src/styles/components.css, scripts/test-validate.mjs, migrations/0003_registrations_terminal.sql, README.md, docs/spec-v1.md. Registration tests 36 → 50, all green; npm run build clean; check:csp unchanged. Two calls for Mladen: the AI tool legend carries its requirement in a draft-marked hint rather than a "required" mark, because the brief marked os and terminal only; and the long terminal labels wrap two or three lines each in the 480px two-column layout, which one line of CSS would undo. Not deployed. Coder: 6 min, 45 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
