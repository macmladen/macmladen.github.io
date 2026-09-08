# M1 decision: deploy target is Cloudflare Workers with static assets, not Pages

Date: 2026-09-08. Raised by the MM-03 scaffold build.

## What happened

`@astrojs/cloudflare` 14 is a Workers adapter. It emits `dist/client` (the static site) and `dist/server` (the worker for the form endpoint). Setting `pages_build_output_dir` in `wrangler.toml` makes wrangler treat the project as Pages and the build fails on the adapter's reserved `ASSETS` binding. The spec said "Cloudflare Pages"; the tool in hand says Workers.

## Decision

Deploy as a **Worker with static assets**. Everything the spec needs exists there, checked against Cloudflare's own Pages-to-Workers migration guide on 2026-09-08:

- `_headers` and `_redirects` files are handled natively from the assets directory.
- Custom domains work when the zone's nameservers are on Cloudflare, which macmladen.com's are.
- Git-integrated builds (Workers Builds) and preview URLs exist.
- D1, KV and R2 bindings work the same way.
- Static asset requests are free; the single form endpoint is billed as a Worker invocation, same rate as a Pages Function.

Cloudflare's guide presents Workers as the platform with the broader feature set and cost parity, and the gaps it lists (file-based routing, Early Hints, non-Cloudflare nameservers, branch alias controls) do not touch this site.

## Consequences

- DDEV docroot is `dist/client`.
- `wrangler.toml` carries `name`, `compatibility_date`, `assets` and the D1 binding; no `pages_build_output_dir`.
- README and spec say "Cloudflare Workers" where they said "Pages". Deploy procedure is written in MM-12 and verified in M5.
- The DNS flip is a Workers custom domain, not a Pages CNAME.

## What would change it

An adapter or platform change that makes Pages the only path for static-plus-one-endpoint sites. Not expected; Cloudflare is steering new projects to Workers.
