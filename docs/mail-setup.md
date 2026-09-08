# Mail setup — macmladen.com

MailerSend (transactional), MailerLite (newsletter) and Cloudflare (DNS +
inbound forwarding). Pattern copied from Neusatz NS-72, which used MailerSend
over SMTP with SPF/DKIM verified at the relay; MailerLite is new here.

Status as of 2026-09-07:

| Step | State |
|---|---|
| MailerSend account, API token | done (token in `docs/mailersend_token.txt`, untracked) |
| MailerSend domain `macmladen.com` added | **done via API**, id `69oxl586692l785k` |
| MailerSend DNS records on Cloudflare | **done via API** (SPF, DMARC, ms1/ms2 DKIM, mta return-path) |
| MailerSend domain verified | **done** — `dkim: true, spf: true, rp_cname: true` (2026-09-07) |
| MailerSend site token | **done** — scoped token `macmladen.com site (Cloudflare Pages)`, `email_full` on this domain only, in `docs/mailersend_site_token.txt` (gitignored) |
| MailerSend tracking off | **refused by plan** — trial/free plan cannot change domain tracking settings; opens/clicks stay on at domain level, see Site integration |
| MailerLite account, API token | done (token in `docs/mailerlite_token.txt`, untracked) |
| MailerLite DKIM CNAME on Cloudflare | **done via API** (`litesrv._domainkey`), SPF include in the merged record |
| MailerLite group | **done via API** — `macmladen.com newsletter`, id `197942356817740919` |
| MailerLite domain authentication | **done** 2026-09-07 in the dashboard — status Authenticated (custom tracking domain is a paid feature, skipped) |
| Cloudflare Email Routing enabled, MX records | **done via API**, status `ready`; Cloudflare also added its own `cf2024-1._domainkey` DKIM TXT |
| Destination `macmladen@gmail.com` | **verified** 2026-09-07 09:11 UTC |
| Catch-all rule → Gmail | **done**, enabled — every address at macmladen.com now lands in Gmail |
| Site integration (Astro on Cloudflare Pages) | not started, separate task — see Site integration below |

## Current DNS (before changes)

Zone is on Cloudflare (`ivan.ns` / `lily.ns`). Root and `www` are proxied A
records. **No MX, no SPF, no DMARC, no DKIM** exist — clean slate, no merge
conflicts with anything pre-existing.

## Target DNS records

All in the `macmladen.com` zone. Every CNAME below must be **DNS only (grey
cloud)** — proxying a DKIM or return-path CNAME breaks verification.

### One SPF record for everything

Only one `v=spf1` TXT may exist at the root. MailerLite's help text says
"delete any other SPF record"; the correct move is to merge, which every
provider accepts:

| Type | Name | Content |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net include:_spf.mailersend.net include:_spf.mlsend.com ~all` |

Three includes, well under the 10-lookup limit.

### MailerSend (from `GET /v1/domains/69oxl586692l785k/dns-records`)

| Type | Name | Content | Purpose |
|---|---|---|---|
| CNAME | `ms1._domainkey` | `ms1._domainkey.mailersend.net` | DKIM |
| CNAME | `ms2._domainkey` | `ms2._domainkey.mailersend.net` | DKIM |
| CNAME | `mta` | `mailersend.net` | Return-Path (envelope alignment, same as Neusatz) |
| CNAME | `email` | `links.mailersend.net` | Click tracking — **skip**; tracking stays off, as on Neusatz |
| MX | `inbound` | `inbound.mailersend.net` prio 10 | Inbound routing — **skip**, Cloudflare handles inbound |

### MailerLite

| Type | Name | Content | Purpose |
|---|---|---|---|
| CNAME | `litesrv._domainkey` | `litesrv._domainkey.mlsend.com` | DKIM |
| TXT | `@` | SPF include `_spf.mlsend.com` — already in the merged record above |

Confirm the exact values on the MailerLite Domains page when adding the
domain there; the help docs describe the record names but the dashboard is
authoritative.

### Cloudflare Email Routing (forward all @macmladen.com → macmladen@gmail.com)

Enabling Email Routing adds these itself; listed so the zone can be checked:

| Type | Name | Content |
|---|---|---|
| MX | `@` | `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net` (priorities assigned by Cloudflare) |
| TXT | `@` | `include:_spf.mx.cloudflare.net` — in the merged SPF above. Cloudflare will offer to add its own SPF; refuse, the merged one covers it |

Plus a destination address `macmladen@gmail.com` (Cloudflare sends a
verification link to Gmail; the rule is inert until clicked) and a catch-all
rule → forward to that address.

### DMARC

Neither provider requires it, but Gmail and Yahoo reject bulk mail without it,
and MailerLite is bulk mail:

| Type | Name | Content |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@macmladen.com; adkim=r; aspf=r` |

`p=none` to start; reports arrive via the catch-all in Gmail. Tighten to
`quarantine` after a few weeks of clean reports.

## Cloudflare execution

Done with the Global API Key from Keychain (service `cloudflare`, account
`api-token`) plus `X-Auth-Email: mladen@bluefish.rs`. Zone id
`270a326a4ee57591794e1be7a6f016f3`, account `76fa1934e8f75e205568d4de79588386`
(Bluefish). A scoped token would be cleaner; permissions if one is ever made:
Zone Read, DNS Edit, Email Routing Rules Edit, Account Email Routing Addresses
Edit.

Gotcha: `POST /zones/{id}/email/routing/dns` is the *subdomain* enable and
rejects the apex with "must be a subdomain". The apex enable is
`POST /zones/{id}/email/routing/enable`. Cloudflare accepted the pre-existing
merged SPF and did not add a second one.

Endpoints used:

```
GET  /zones?name=macmladen.com                          → zone_id, account_id
POST /zones/{zone_id}/dns_records                       → SPF, DMARC, 3× MailerSend CNAME, 1× MailerLite CNAME
POST /zones/{zone_id}/email/routing/enable              → adds MX records
POST /accounts/{account_id}/email/routing/addresses     → {"email":"macmladen@gmail.com"}
PUT  /zones/{zone_id}/email/routing/rules/catch_all     → forward all to that address
```

## Site integration (Astro on Cloudflare Pages)

Decision 2026-09-07: the site is Astro, deployed on Cloudflare. That rules
out the Neusatz SMTP shape — Workers have no raw TCP for SMTP — and makes the
HTTP APIs the only path. No SMTP user was created; nothing to create later.

**Secrets**, set on the Pages project, never in the repo or `wrangler.toml`
vars:

| Secret | Value from | Used for |
|---|---|---|
| `MAILERSEND_API_TOKEN` | `docs/mailersend_site_token.txt` | contact form → `POST https://api.mailersend.com/v1/email` |
| `MAILERLITE_API_TOKEN` | `docs/mailerlite_token.txt` | subscribe form → `POST https://connect.mailerlite.com/api/subscribers` with `groups: ["197942356817740919"]` |

Set with `wrangler pages secret put <NAME>` once the project exists (or
Dashboard → Pages project → Settings → Environment variables, type Secret).
The site token is scoped to `email_full` on `macmladen.com` only; the account
token in `docs/mailersend_token.txt` stays local for admin work.

**Sending rules**
- `from` must be `@macmladen.com` — the only verified domain. Suggested
  `noreply@macmladen.com` for the form, `reply_to` the visitor.
- Tracking: the plan refuses domain-level off, so pass
  `"settings": {"track_clicks": false, "track_opens": false}` per message.
- Trial restriction: until MailerSend approves the account, delivery is only
  guaranteed to the account owner's address. Since the contact form sends *to*
  Mladen, that is the one address that works during trial — the restriction
  is not a blocker here as it was on Neusatz.
- Both endpoints need a server-side call (Astro endpoint under `src/pages/api/`
  with `export const prerender = false`, Cloudflare adapter). Never call them
  from the browser; the tokens would leak.
- MailerLite: add `double opt-in` in the group settings before going live, so
  the subscribe endpoint cannot be used to spam a third party.

**MailerLite dashboard**: domain authenticated 2026-09-07. An embedded form
is optional — the API path above does not need one.

**Smoke test 2026-09-07 09:28 UTC**: two messages sent with the site token
(`POST /v1/email`, from `noreply@macmladen.com`, per-message tracking off),
both `delivered` in the activity feed within 4 s:
`info@macmladen.com` (lands via Cloudflare catch-all → Gmail) and
`mladen@bluefish.rs`. The second recipient is not the account owner's
address, so the trial-only-to-owner restriction is **not** in effect on this
account. Activity API needs `date_from`/`date_to` in unix seconds and refuses
`date_to` in the future — clamp to now.

**Verify from local**: `dig +short TXT macmladen.com`, `dig +short CNAME
ms1._domainkey.macmladen.com`, `dig +short MX macmladen.com`, and a mail to
any `@macmladen.com` address arriving in Gmail.

**DNS still pointing at GitHub Pages**: root A records and `www` CNAME serve
the old Jekyll site. Switching them is part of the Astro deploy (Pages →
Custom domains), not this task. The mail records are independent of it.

## Secrets hygiene

`docs/` is untracked right now, but both token files sit next to committable
docs. Move them to Keychain (`macmladen-mailersend-api`,
`macmladen-mailerlite-api`, matching the Neusatz naming) and add
`docs/*_token.txt` is in `.gitignore` (added 2026-09-07), so the files are safe even once `docs/` is committed.
