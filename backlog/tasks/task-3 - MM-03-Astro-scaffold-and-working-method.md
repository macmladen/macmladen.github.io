---
id: TASK-3
title: 'MM-03: Astro scaffold and working method'
status: In Progress
assignee: []
created_date: '2026-09-08 06:53'
updated_date: '2026-09-08 07:12'
labels:
  - chore
milestone: m-0
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: M. Estimate: 3 h. Actual: . Billable: no. AI cost: . AI time: . Astro 7 at the repo root with the Cloudflare adapter, sitemap and robots integrations, config per spec (static output, trailingSlash always, inlineStylesheets always, image service compile). DDEV generic config with the dev server as an extra daemon. Backlog, AGENTS.md, CLAUDE.md, project agents, spec and seed tokens moved in. README skeleton, .nvmrc, rewritten .gitignore. Spec: docs/spec-v1.md, sections Stack and Working method.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 npm run build succeeds with no warnings on a placeholder index page
- [x] #2 npm run dev serves the placeholder; ddev start serves it at https://macmladen.ddev.site with HMR on the exposed port
- [x] #3 astro.config.mjs sets output static, cloudflare adapter, trailingSlash always, build.inlineStylesheets always, sitemap with serialize filter, robots-txt
- [x] #4 .gitignore covers node_modules, dist, .astro, .wrangler, .dev.vars, .DS_Store, .idea; .dev.vars.example committed
- [x] #5 backlog/, AGENTS.md, CLAUDE.md, .claude/agents/{coder,performer}.md, docs/spec-v1.md, src/styles/tokens.css committed
- [x] #6 The former ~/Sites/macmladen.com folder no longer exists
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Fable review 2026-09-08: scaffold verified by the coder (build clean, preview 200, DDEV primary and dev port both 200, ddev stopped). Material decision recorded in docs/decisions/M1-DEPLOY-TARGET.md: deploy target is Workers static assets, not Pages; spec, AGENTS.md and README wording updated. Effort figures: main loop ~10 min (Fable); coder subagent 116,780 tokens, 57 tool calls, 16.7 min (Opus). AI cost: pending costing script.
<!-- SECTION:NOTES:END -->
