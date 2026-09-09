---
id: TASK-51
title: 'MM-51: Link previews in Telegram and WhatsApp'
status: Done
assignee: []
created_date: '2026-09-09 13:33'
updated_date: '2026-09-09 13:54'
labels:
  - bug
milestone: m-5
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Effort: S. Actual: . Billable: no. AI cost: pending script. AI time: . Telegram and WhatsApp show no preview card for macmladen.com links; Slack (with https://) and Viber do. Server side checked 2026-09-09: crawler user agents get 200 for the page and the 47 KB OG PNG, all og:* and twitter:* tags present. Remaining suspects: Telegram's cached preview of the old site (refresh via @WebpageBot), WhatsApp needing the https:// prefix, Cloudflare bot protection challenging the messengers' fetchers (check Security → Events).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A fresh https://macmladen.com/ link shows title, description and image in Telegram and WhatsApp
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Done 2026-09-09: server side verified clean; previews appear in Telegram and WhatsApp with the https:// prefix after Mladen lowered the zone security level and refreshed Telegram's cache. AI time 8 min.
<!-- SECTION:FINAL_SUMMARY:END -->
