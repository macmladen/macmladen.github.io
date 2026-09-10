#!/usr/bin/env node
/** Checks that `public/_headers` still describes what the build actually
 *  emits. Run after `npm run build`, as `npm run check:csp`.
 *
 *  The CSP allows each page's inline script by sha256 of its exact body,
 *  whitespace included, so reindenting one of those blocks in the source
 *  silently breaks that page's scripts in production. This walks every built
 *  page, hashes every inline script it finds, and fails if the policy does not
 *  carry that hash — and equally if a page has grown a new inline script nobody
 *  hashed. JSON-LD blocks are skipped: `type="application/ld+json"` is data,
 *  not script, and CSP does not apply to it. */

import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const clientDir = new URL('dist/client/', root);
const headersFile = new URL('public/_headers', root);

const SCRIPT = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;

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
  console.error('check:csp — no dist/client. Run `npm run build` first.');
  process.exit(1);
}

const policy = await readFile(headersFile, 'utf8');
const problems = [];
let hashed = 0;

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const [, attrs, body] of html.matchAll(SCRIPT)) {
    if (/type\s*=\s*["']application\/ld\+json["']/.test(attrs)) continue;
    if (/\bsrc\s*=/.test(attrs)) {
      const src = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/)?.[1] ?? '';
      const origin = src.startsWith('http') ? new URL(src).origin : null;
      if (origin && !policy.includes(origin)) {
        problems.push(`${fileURLToPath(page)}: script from ${origin} is not in script-src`);
      }
      continue;
    }
    const hash = `sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}`;
    hashed += 1;
    if (!policy.includes(hash)) {
      problems.push(`${fileURLToPath(page)}: inline script hash ${hash} is not in the policy`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check:csp — ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`check:csp — ${pages.length} pages, ${hashed} inline script(s), all covered.`);
