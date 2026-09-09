---
id: TASK-20
title: 'MM-20: About text from the 2014 site'
status: Done
assignee: []
created_date: '2026-09-09 07:03'
updated_date: '2026-09-09 07:17'
labels:
  - feature
milestone: m-2
dependencies: []
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Estimate: 0.5 h. Actual: . Billable: no. AI cost: pending script. AI time: 6 min. The About page body becomes the text of the old site's about page, verbatim: git show jekyll:about.html (strip the front matter and HTML, keep the paragraphs in order, keep the inline code word gem as code). It replaces the EN bio on /about/ only; person.bio stays for JSON-LD. Speaking list and community paragraph stay below it.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All paragraphs of the old about page appear verbatim and in order on /about/
- [x] #2 person.ts gains an about array; the page renders from it
- [x] #3 Heading order and ProfilePage JSON-LD unchanged
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
EXTRACTION

`git show jekyll:about.html`, YAML front matter dropped, thirteen `<p>...</p>`
blocks pulled out with a script rather than by hand so the text is provably
unedited. The only substitution made is the one the task asks for: the source's
literal backticks around gem (`` `gem` ``, a Markdown habit that Jekyll never
rendered inside raw HTML, so the 2014 page showed the backticks) become
`<code>gem</code>`.

ONE AMBIGUITY, DECIDED AND FLAGGED

"Strip the HTML" and "verbatim" pull against each other, because four paragraphs
carry inline markup the author put there: `<em>Deep Space 9</em>`,
`<em>fought</em>`, `<em>public</em>` and `<strong>About</strong>`. I kept all
four. Stripping them would be a silent edit to Mladen's own emphasis, and the
task already forces some inline markup into the strings by requiring `<code>`
for gem — once one tag survives, dropping the rest is inconsistent rather than
simpler. So "strip the HTML" is read as "strip the `<p>` wrappers", which is
what turns the page into an array. If Mladen wants flat text, it is a
three-tag deletion and the `set:html` can go with it.

The other verbatim call: the typos and the 2014 phrasing stand. "tuining" for
tuning in the eleventh paragraph, "learned me a lot" in the sixth, "since I'm
aware of myself" in the fifth. All his, all untouched. Worth a glance during
review, because they will read as our mistakes to anyone who does not know the
text is fifteen years old.

DATA AND RENDERING

`src/data/person.ts` gains `export const about: string[]` with a JSDoc block
saying where the text came from, that it is Mladen's own copy so it carries no
draft marker, and that entries hold `<em>`, `<strong>` and one `<code>` so they
must be rendered with `set:html`. `about` is added to the `person` object
alongside `intro`.

`src/pages/about.astro` replaces `<p>{person.bio}</p>` with a map over
`person.about` rendering `<p><Fragment set:html={paragraph} /></p>`. `set:html`
is safe here and the comment says why: the strings are fixed authored content in
the repo, never input. The `.flow` container already spaces sibling paragraphs,
so nothing in the CSS changed. The Speaking section, the community paragraph
and the headshot are untouched.

FLAGGED: person.bio IS NOT IN THE JSON-LD

The task says "person.bio stays for JSON-LD". It stays — but it is not in the
JSON-LD and never was. `personNode()` in `src/lib/schema.ts` emits name,
alternateName, jobTitle, url, image, email, sameAs, worksFor and address; there
is no `description` field. `<p>{person.bio}</p>` on this page was `bio`'s only
consumer, so as of this task `bio` is an exported constant nothing reads.
(`bioShort` was already in that position before this task — it has no consumer
anywhere in `src/`.) Three ways out, none of them taken here because AC #3 says
the JSON-LD is unchanged:

  1. Leave both as data, which is what the task literally asks and what shipped.
  2. Add `description: person.bio` to `personNode` — the natural home for a bio
     in schema.org, and it would make the task's stated rationale true. This
     changes the JSON-LD, so it needs Mladen's word.
  3. Delete `bioShort` if nothing will use it.

Recommend 2 as a small follow-up task; it is the reason the constant exists.

SPEC (docs/spec-v1.md)

The `/about/` bullet said "Headshot and the full EN bio verbatim from section 6
of wordcamp-belgrade-2026-workshop-handover.md". Rewritten to describe the 2014
text, where it came from, that the inline markup and the typos are preserved,
that it renders from `about: string[]` with `set:html`, and that the handover
bio stays in `person.ts` as `bio`. The matching acceptance line now reads
"the thirteen paragraphs of the 2014 about text verbatim and in order".

VERIFIED

`npm run build` clean. A script re-extracted the paragraphs from
`jekyll:about.html` and compared them against the ones in
`dist/client/about/index.html` (entity-decoding both sides, since the renderer
escapes `&` and `>` in text): thirteen out of thirteen identical, in order.
`<code>gem</code>` is present. The old bio text no longer appears anywhere on
the page. Heading order is unchanged — h1 "About", then h2 "Speaking", h2
"Community", h2 "Elsewhere" in the footer. The JSON-LD block parses and its
`@graph` is still the single `ProfilePage`, with no `description` field before
or after.

Effort: 6 min, 12 tool calls.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09. The body of /about/ is now the 2014 site's about text, all thirteen paragraphs verbatim and in order. Recovered with git show jekyll:about.html by a script rather than by hand, front matter and <p> wrappers stripped, and the source's literal backticks around gem turned into <code>gem</code> as the task asked. They live in src/data/person.ts as `about: string[]` with a JSDoc block recording the provenance, and src/pages/about.astro renders them as <p><Fragment set:html={paragraph} /></p> in place of the single bio paragraph; the headshot, the speaking list and the community paragraph are untouched, and no CSS changed. One ambiguity decided: "strip the HTML" is read as "strip the <p> wrappers", so the four inline tags the author put in — <em>Deep Space 9</em>, <em>fought</em>, <em>public</em>, <strong>About</strong> — are kept rather than flattened, on the same "verbatim, no edits" ground that keeps the 2014 typos ("tuining", "learned me a lot"). Reversing that is a three-tag deletion. Flagged and not acted on: the task says person.bio stays for the JSON-LD, but bio is not in the JSON-LD and never was — personNode in src/lib/schema.ts has no description field, and about.astro was bio's only consumer, so bio (like bioShort before it) is now an exported constant nothing reads. Adding `description: person.bio` to personNode would make that rationale true and is worth its own task; it was not done here because AC #3 requires the JSON-LD unchanged. docs/spec-v1.md: the /about/ bullet and its acceptance line rewritten. Verified by re-extracting the paragraphs from the jekyll branch and diffing them against dist/client/about/index.html — 13 of 13 identical; heading order and the ProfilePage JSON-LD unchanged. Coder (Opus): 6 min, 12 tool calls. AI cost pending script.
<!-- SECTION:FINAL_SUMMARY:END -->
