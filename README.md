# macmladen.com

## What this is

The personal site of Mladen Đurić (MacMladen): a small English-only Astro 7 site,
static output on Cloudflare, with two server endpoints (the workshop registration
form and the contact form). Plain CSS with tokens and cascade layers — no CSS
framework, no client-side framework.

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
gets served, `dist/server/` holds the worker for the two server endpoints. Astro is
configured with `output: 'static'`, `trailingSlash: 'always'` and
`build.inlineStylesheets: 'always'`, so each page ships as a single HTML file with
its CSS inlined and no external stylesheet request. `robots.txt` and
`sitemap-index.xml` are generated at build time; the sitemap contains pages only.

## Deploy (Cloudflare Workers, static assets)

_Placeholder — MM-12 documents the git-triggered build, the project settings and the build output directory._

## D1

Registrations and contact messages go into one Cloudflare D1 database bound as
`DB`. The binding is declared in `wrangler.toml`; `database_id` there is a
placeholder until M5 creates the real database on Mladen's account. Locally the id
is not used — wrangler keys off `database_name` and keeps the data in
`.wrangler/state/`. The database is called `macmladen-registrations` because
registrations came first; it holds both tables.

Create the local database and apply every migration:

```sh
npx wrangler d1 migrations apply macmladen-registrations --local
```

That runs `migrations/0001_registrations.sql` (table `registrations`) and
`migrations/0002_messages.sql` (table `messages`). Both files' column names are
their form's field names, so the form, the validator and the table cannot drift.

Run the production build with that database bound:

```sh
npm run build && npm run preview
```

`astro preview` serves the built worker through the Cloudflare Vite plugin, so
`/api/register/` and `/api/contact/` run with the real `DB` binding and the
variables from `.dev.vars`. If a table is missing the endpoint answers 503 with a
"write to him directly" message rather than a stack trace.

Read the registrations:

```sh
npx wrangler d1 execute macmladen-registrations --local \
  --command "SELECT id, created_at, name, email, github, os, tool, own_hosting, watch_only, newsletter, mailerlite_status FROM registrations ORDER BY id"
```

Read the contact messages, newest first:

```sh
npx wrangler d1 execute macmladen-registrations --local \
  --command "SELECT id, created_at, name, email, topic, mail_status, substr(message, 1, 80) AS preview FROM messages ORDER BY id DESC"
```

`message` is left out of that list on purpose — it can be 2000 characters and
wrecks the table layout. Read one in full by id:

```sh
npx wrangler d1 execute macmladen-registrations --local \
  --command "SELECT message FROM messages WHERE id = 1"
```

The same commands work against the deployed database with `--remote` instead of
`--local`.

`registrations.mailerlite_status` is `pending` while the row is being written, then
`ok`, `skipped` (no API key configured) or `failed:<reason>`. A MailerLite failure
never fails a registration.

`messages.mail_status` works the same way for the MailerSend delivery: `pending`,
then `sent`, `skipped` (no `MAILERSEND_API_KEY`) or `failed:<reason>`. The message
is stored before the send is attempted, so a delivery failure never loses it — a
row sitting at `failed:` is a message to answer by hand.

## Secrets

No secret value is ever committed. `.dev.vars.example` is the committed template;
copy it to `.dev.vars` (gitignored) for local work.

| Name | Where it is read | What it is for |
|---|---|---|
| `MAILERLITE_API_KEY` | worker (`.dev.vars` locally, Worker secret in production) | Upserting the subscriber. Empty means the call is skipped and the row records `skipped`. |
| `MAILERLITE_GROUP_ID` | worker | The group the subscriber joins; the confirmation email is a MailerLite automation on that group. |
| `MAILERSEND_API_KEY` | worker (`.dev.vars` locally, Worker secret in production) | Sending a contact message to `mladen@macmladen.com` from `no-reply@macmladen.com`, `Reply-To` the sender. Empty means the message is stored and the row records `skipped`. The token to use is the scoped site token described in `docs/mail-setup.md`, `email_full` on `macmladen.com` only. |
| `TURNSTILE_SECRET` | worker | Server-side verification of the widget's token, for both forms. Missing means every submission is rejected — the endpoints fail closed. |
| `IP_HASH_SALT` | worker | Salt for the SHA-256 in `ip_hash`, in both tables. Missing means no IP is stored at all. |
| `PUBLIC_TURNSTILE_SITE_KEY` | **build** (`.env`, or the Workers Build environment) | Baked into both forms' widgets at build time. Falls back to Cloudflare's documented always-pass test key. |

`.dev.vars.example` ships Cloudflare's documented always-pass Turnstile test keys,
which are public by design. The site key is a build-time variable rather than a
runtime one because the form is a static page; setting it after the build has no
effect.

Production secrets are set on the Worker (`npx wrangler secret put <NAME>`) by
Mladen, in M5. No agent writes them anywhere.

## Export registrations

_Placeholder — MM-12 documents the one wrangler command that exports the `registrations` table to CSV._

## DNS

_Placeholder — MM-12 documents the CNAME change for `macmladen.com` and `www`, done last and by Mladen's own hand._
