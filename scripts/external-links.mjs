#!/usr/bin/env node
/** Marks every link that leaves this site. Run after `astro build`, as npm's
 *  `postbuild` hook, over the pages in `dist/client`.
 *
 *  A link to another origin gets `target="_blank"` and `rel="noopener"`, and
 *  the stylesheet then draws the small arrow after it (`a[target="_blank"]` in
 *  `src/styles/components.css`). Doing it here rather than in the components
 *  keeps the sources readable: `<a href={profile.url}>` says what it is, and
 *  no author has to remember two attributes on every outward link. The pages
 *  that are rendered at runtime by the two endpoints never pass through this
 *  script, so the handful of components those responses use — Footer,
 *  RegistrationClosed, RegistrationSuccess — carry the attributes in their
 *  source instead. This script leaves those alone: it adds nothing that is
 *  already there.
 *
 *  What counts as leaving: an `href` that starts with `http://` or `https://`
 *  and whose host is neither `macmladen.com` nor `www.macmladen.com`. Anything
 *  relative, any fragment, `mailto:` and every other scheme is untouched. An
 *  anchor marked `data-no-external` is skipped whatever its href says — the
 *  escape hatch for a link that should not open a tab.
 *
 *  Why a regex and not a parser: the markup is ours and Astro's, there is no
 *  HTML parser in the dependency tree, and adding one to rewrite one attribute
 *  on one element is more machinery than the job deserves. The pattern below
 *  never looks inside `<script>` or `<style>`, matches an anchor's opening tag
 *  only, and reads the attributes it needs off that tag. */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { person } from '../src/data/person.ts';

const root = new URL('../', import.meta.url);
const clientDir = new URL('dist/client/', root);

/** This site's own hosts, from the one place the canonical URL is written
 *  down. A link to either of them is an internal link however it is spelt. */
const selfHost = new URL(person.url).hostname.toLowerCase();
const internalHosts = new Set([selfHost, `www.${selfHost}`]);

/** Either a whole script or style element — skipped wholesale, so nothing that
 *  looks like an anchor inside JavaScript or JSON-LD is ever touched — or an
 *  anchor's opening tag, which is the only thing this script rewrites. */
const TOKEN = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<a\b[^>]*>/gi;

const HREF = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i;
const REL = /\brel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i;
const HAS_TARGET = /\btarget\s*=/i;
const OPTED_OUT = /\bdata-no-external\b/i;

/** The captured value of an attribute, whichever quoting was used. */
const value = (match) => match[1] ?? match[2] ?? match[3] ?? '';

/** Adds an attribute at the end of an opening tag. A trailing slash, which
 *  nothing in this build emits on an anchor, would be meaningless on one
 *  anyway and is dropped. */
const withAttribute = (tag, attribute) =>
  `<${tag.slice(1, -1).replace(/\/$/, '').trimEnd()} ${attribute}>`;

const counts = { files: 0, rewritten: 0, anchors: 0, external: 0, optedOut: 0 };
const hosts = new Map();

function markAnchor(tag) {
  counts.anchors += 1;

  if (OPTED_OUT.test(tag)) {
    counts.optedOut += 1;
    return tag;
  }

  const href = tag.match(HREF);
  if (!href || !/^https?:\/\//i.test(value(href))) return tag;

  let host;
  try {
    host = new URL(value(href)).hostname.toLowerCase();
  } catch {
    return tag;
  }
  if (internalHosts.has(host)) return tag;

  counts.external += 1;
  hosts.set(host, (hosts.get(host) ?? 0) + 1);

  let marked = tag;
  if (!HAS_TARGET.test(marked)) marked = withAttribute(marked, 'target="_blank"');

  const rel = marked.match(REL);
  if (!rel) {
    marked = withAttribute(marked, 'rel="noopener"');
  } else {
    // rel takes a list, and this link may already be carrying `me` on a
    // profile it verifies back to. Add to the list, never replace it.
    const tokens = value(rel).split(/\s+/).filter(Boolean);
    if (!tokens.some((token) => token.toLowerCase() === 'noopener')) {
      marked = marked.replace(REL, `rel="${[...tokens, 'noopener'].join(' ')}"`);
    }
  }

  return marked;
}

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) found.push(...(await htmlFiles(child)));
    else if (entry.name.endsWith('.html')) found.push(child);
  }
  return found;
}

let pages;
try {
  pages = await htmlFiles(clientDir);
} catch {
  console.error('external-links — no dist/client. Run `npm run build` first.');
  process.exit(1);
}

for (const page of pages) {
  counts.files += 1;
  const html = await readFile(page, 'utf8');
  const marked = html.replace(TOKEN, (token) =>
    token.slice(0, 2).toLowerCase() === '<a' ? markAnchor(token) : token,
  );
  if (marked === html) continue;
  counts.rewritten += 1;
  await writeFile(page, marked);
  console.log(`external-links: ${fileURLToPath(page)}`);
}

const named = [...hosts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
console.log(
  `external-links — ${counts.files} pages, ${counts.anchors} anchors, ` +
    `${counts.external} external across ${hosts.size} hosts, ` +
    `${counts.rewritten} file(s) rewritten` +
    (counts.optedOut > 0 ? `, ${counts.optedOut} opted out` : '') +
    '.',
);
console.log(`external-links: ${named.map(([host, n]) => `${host} ${n}`).join(', ')}`);
