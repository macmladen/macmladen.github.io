# macmladen.com

## What this is

The personal site of Mladen Đurić (MacMladen): a small English-only Astro 7 site,
static output on Cloudflare, with exactly one server endpoint (the workshop
registration form). Plain CSS with tokens and cascade layers — no CSS framework,
no client-side framework.

Spec: `docs/spec-v1.md`. Working method, roles and conventions: `AGENTS.md`.
Tasks: `backlog/`, managed with the `backlog` CLI.

## Local development

Node version is pinned in `.nvmrc` (Node 26; `package.json` requires >= 22).

```sh
npm install
npm run dev
```

The dev server runs at <http://localhost:4321/> with hot module reloading.

## Build

```sh
npm run build     # writes dist/client (static site) and dist/server (worker)
npm run preview   # serves the production build locally
```

The Cloudflare adapter splits the output: `dist/client/` is the static site that
gets served, `dist/server/` holds the worker for the one server endpoint. Astro is
configured with `output: 'static'`, `trailingSlash: 'always'` and
`build.inlineStylesheets: 'always'`, so each page ships as a single HTML file with
its CSS inlined and no external stylesheet request. `robots.txt` and
`sitemap-index.xml` are generated at build time; the sitemap contains pages only.

## Deploy (Cloudflare Workers, static assets)

_Placeholder — MM-12 documents the git-triggered build, the project settings and the build output directory._

## D1

_Placeholder — MM-09/MM-12 document creating the database, the `DB` binding in `wrangler.toml`, and running the migrations in `migrations/`._

## Secrets

_Placeholder — MM-12 documents which of `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`, `TURNSTILE_SECRET` and `TURNSTILE_SITE_KEY` go where. Locally they live in `.dev.vars` (gitignored); see `.dev.vars.example`._

## Export registrations

_Placeholder — MM-12 documents the one wrangler command that exports the `registrations` table to CSV._

## DNS

_Placeholder — MM-12 documents the CNAME change for `macmladen.com` and `www`, done last and by Mladen's own hand._
