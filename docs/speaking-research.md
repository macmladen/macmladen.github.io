# Speaking history — research (MM-64)

Reconstructed from Speaker Deck, YouTube, LinkedIn's public view, and web
search. Sources are linked per row; where a claim rests only on a summarized
fetch (a tool that reads a page and reports back, rather than raw text I
could grep myself) that is noted in Notes and confidence is capped at
`likely`.

Unknown cells are left empty. Nothing is invented.

## Full table

| Year | Event | City | Title | Kind | Deck URL | Video URL | Source URL | Confidence | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 2026 | WordCamp Belgrade | Belgrade | WordPress, Docker and AI agents — hands-on | workshop | | | https://belgrade.wordcamp.org/2026/speaker/mladen-duric-en/ | confirmed | Already in `src/data/speaking.ts` via `workshop.title`/`workshop.path`. The public WordCamp listing currently shows the title as "WordPress, Docker, and AI Agents — Practically [SR]" — differs from the internal `workshop.ts` title. Not changed here (src/ is off-limits for this task); flagging for Mladen. |
| 2025 | WordPress Meetup Vršac | Vršac | Decoupled WordPress — architecture and challenges | talk | https://speakerdeck.com/macmladen/decoupled-wordpress-architecture-and-challenges-2025-wp-vrsac | | Speaker Deck description; corroborated by a LinkedIn post dated the same day | confirmed | 66 slides. Deck description: "big birthday edition of WordPress Meetup Vršac (#WPVŠ 03/25, Tačka Susretanja, March 28, 2025)". Matches existing `speaking.ts` entry exactly. |
| 2024 | Drupal Camp Novi Sad | Novi Sad | Ceremonial opening + panel discussion | panel | | | https://ns2024.drupal.rs/sr/session/svecano-otvaranje , https://ns2024.drupal.rs/sr/session/panel-diskusija , https://ns2024.drupal.rs/en/team | confirmed | Event held 2024-10-19. He co-organized (team role "Speakers and everything") and appeared in the opening and a panel alongside Miki Stojković, Franko Antičević, Vladimir Zdravković — not a solo talk, so "panel" doesn't fit the current `AppearanceKind` union (`talk`/`workshop`). |
| 2024 | Drupal Dev Days Burgas | Burgas | | talk | | | https://www.drupal.org/u/macmladen (via summarized fetch); https://ddd2024.drupalcamp.bg/drupal-dev-days-2024/session/advanced-drupal-and-ddev (session found, speaker not independently confirmed) | likely | drupal.org's own profile page lists "Drupal Developer Days 2024 Burgas (June 26, 2024)" under "Events Where He Spoke." A session titled "Advanced Drupal and DDEV" exists on the event site and matches his usual subject, but I could not load that page directly (its TLS cert doesn't match its own hostname, and it isn't in the Wayback Machine) to confirm he's the speaker, so the title is left empty rather than guessed. This resolves the year for the existing null-year `speaking.ts` entry. |
| 2024 | DrupalJam Utrecht | Utrecht | DDEV and Drupal, BFF | workshop | https://speakerdeck.com/macmladen/2024-drupaljam-utrecht-drupal-and-ddev-workshop | https://www.youtube.com/watch?v=PwtHE6b_JKU (Drupaljam's own channel, "DDEV and Drupal, BFF - Mladen Djuric") | confirmed | 52 slides. Deck date 2024-06-12. The real session title, per Drupaljam's own LinkedIn announcement and the YouTube upload, is "DDEV and Drupal, BFF" — the existing `speaking.ts` entry uses the generic "Drupal and DDEV workshop" instead. Venue: DeFabrique, Utrecht. |
| 2023 | Serbian Drupal Community Meetup | Novi Sad (per drupal.org profile; not stated on the Merkle post itself) | Local development with DDEV | talk | | recordings "available on the drupal.rs website" per source, not tracked down to a specific URL | https://drupal.merkle.com/post/2023/05/serbian-drupal-community-meetup/ (via summarized fetch); drupal.org profile lists "Drupal meetup Serbia - Novi Sad (May 20, 2023)" | likely | Month/title corroborated by two independent sources; exact day and the city attribution both come from the drupal.org summary, not read first-hand. |
| 2023 | DrupalJam Utrecht | Utrecht | NextJS with Drupal | talk | https://speakerdeck.com/macmladen/nextjs-with-drupal-drupaljam-utrecht-2023 | https://www.youtube.com/watch?v=1tRC4IOCw3Q ("Drupaljam 2023 Next-Drupal demo", his own channel) | Speaker Deck deck page | confirmed | 64 slides, deck dated 2023-06-01. Not currently in `speaking.ts` — only the 2024 DrupalJam workshop is. |
| 2023 | WordCamp Apatin | Apatin | WordPress with Cloudflare CDN | talk | https://speakerdeck.com/macmladen/wordpress-with-cloudflare-cdn-wordcamp-apatin-2023 | | https://apatin.wordcamp.org/2023/session/wordpress-with-cloudflare-cdn/ (already in speaking.ts) | confirmed | 33 slides, deck dated 2023-05-27, matches WordCamp's own date. Matches existing `speaking.ts` entry exactly. |
| 2018 | DrupalCamp Pannonia | Palić / Subotica | Drupal, Docker, Composer, Gulp, oh my! | talk | | https://www.youtube.com/watch?v=HdCLICY6xno ("DrupalCampPannonia - Mladen Đurić - Koder...", channel DrupalCamp Pannonia) | https://drupal.rs/blog/mladen-duric-koder-drupal-docker-composer-gulp-oh-my-drupalcamppannonia ; https://www.itcsubotica.org.rs/en/first-ever-drupalcamp-pannonia-palic (event: Nov 2–3, 2018) | confirmed | Not on Speaker Deck. Video published 2018-11-20, days after the event. Not in the existing "40+ events" city list even though Subotica/Palić is. |
| 2018 | Drupal-Nis meetup | Niš | Good Guy Gulp | talk | https://speakerdeck.com/macmladen/drupal-nis-good-guy-gulp | (deck notes a YouTube video "soon to be published"; not found) | Speaker Deck deck page | confirmed | 55 slides, dated 2018-05-19. "Second Drupal meetup in Niš." |
| 2018 | VTS lecture (Visoka tehnička škola strukovnih studija) | Novi Sad | JavaScript 2018, State and Trends | talk | https://speakerdeck.com/macmladen/vts185-javascript-2018-state-and-trends | (deck notes a YouTube video "soon to be published"; not found) | Speaker Deck deck page | confirmed | 96 slides, dated 2018-05-10. Fifth lecture in the series. |
| 2018 | VTS lecture | Novi Sad | Gulp, task runner | talk | https://speakerdeck.com/macmladen/vts184-gulp-task-runner | https://youtu.be/kRqu-uvlxxc (= https://www.youtube.com/watch?v=kRqu-uvlxxc, his own channel, "koder-vts184 gulp") | Speaker Deck deck page | confirmed | 55 slides, dated 2018-04-26. Fourth lecture in the series. |
| 2018 | VTS lecture | Novi Sad | Sass, CSS on steroids | talk | https://speakerdeck.com/macmladen/vts183-sass-css-on-steroids | | Speaker Deck deck page | confirmed | 44 slides, dated 2018-04-19. Third lecture in the series. |
| 2018 | WordPress Meetup Novi Sad | Novi Sad | Gulp based Sass frontend workflow with Bootstrap 4 | talk | https://speakerdeck.com/macmladen/gulp-based-sass-frontend-workflow-with-bootstrap-4 | | Speaker Deck deck page | confirmed | 46 slides, dated 2018-01-18. |
| 2017 | Drupal Meetup Subotica (Palić) | Subotica / Palić | Docker-Drupal meetup Palic 2017 (Docker4Drupal 2.x) | talk | https://speakerdeck.com/macmladen/docker-drupal-meetup-palic-2017 | https://www.youtube.com/watch?v=V7LmdFEfmpM ("Docker4Drupal 2.x - Mladen Đurić - Drupal Meetup Subotica 2017", channel Studio Present) | Speaker Deck deck page | confirmed | 97 slides, deck dated 2017-09-02; video published 2017-09-18, 16 days later — same event. |
| 2017 | DrupalHeart Camp | Zagreb | Docker Driven Drupal Development™ | talk | https://speakerdeck.com/macmladen/docker-driven-drupal-development | https://www.youtube.com/watch?v=EmHw9TJCGFo (channel: Sveučilište u Zagrebu Sveučilišni računski centar (Srce)) | Speaker Deck deck page | confirmed | 101 slides, deck dated 2017-05-19; video published 2017-06-26. |
| 2017 | DrupalHeart Camp | Zagreb | Gulp based Sass frontend workflow with Bootstrap framework and theme | talk | https://speakerdeck.com/macmladen/gulp-based-sass-frontend-workflow-with-bootstrap-framework-and-theme | | Speaker Deck deck page | confirmed | 52 slides, same day (2017-05-19) and event as the Docker talk above — a second session at the same camp. |
| 2017 | WordPress meetup | Zrenjanin | Docker 4 WordPress | talk | https://speakerdeck.com/macmladen/docker-4-wordpress | | Speaker Deck deck page | confirmed | 31 slides, dated 2017-04-28. |
| 2017 | WordPress Meetup Novi Sad (6th) | Novi Sad | Docker based Web development | talk | https://speakerdeck.com/macmladen/docker-based-web-development | | Speaker Deck deck page; https://www.meetup.com/WP-Meetup-NS/events/236189966 | confirmed | 28 slides, dated 2017-04-17. |
| 2017 | Drupal Serbia meetup (1st) | Niš | Docker + Wodby + Docksal technology and comparison | talk | https://speakerdeck.com/macmladen/docker-plus-wodby-plus-docksal-technology-and-comparison | | Speaker Deck deck page; https://www.meetup.com/top-lista-drupalista/events/238489719/ | confirmed | 26 slides, dated 2017-04-08. |
| 2016 | Ironcamp (1st) | Prague | Docker 4 Drupal | talk | https://speakerdeck.com/macmladen/docker-4-drupal | https://www.youtube.com/watch?v=GKzfuAzR6dk (channel: Drupal IronCamp) | Speaker Deck deck page | confirmed | 13 slides, deck dated 2016-11-26; video published 2017-01-17. |
| 2015 | Drupal Camp Skopje | Skopje | BOA — Barracuda on Aegir (Drupal hosting) | talk | https://speakerdeck.com/macmladen/boa-drupal-camp-skopje-2015 | https://www.youtube.com/watch?v=WemboKD6oBA ("Mladen Đurić — Run your own server on cheap like a pro with BOA", channel Drupal Camp Skopje) | Speaker Deck deck page | confirmed | 31 slides, deck dated 2015-05-03; video published 2015-05-22. drupal.org profile independently lists "DrupalCamp Macedonia 2015". |
| 2014 | Drupal Camp Serbia | Novi Sad | BOA — Barracuda on Aegir (Drupal hosting) | talk | https://speakerdeck.com/macmladen/boa-drupal-camp-serbia-2014 | | Speaker Deck deck page | confirmed | 35 slides, dated 2014-10-31. drupal.org profile independently lists "DrupalCamp Novi Sad 2014". |
| 2013 | BalCCon (Balkan Computer Congress) | Novi Sad | Ethics — what it (actually) is and why is it important | talk | https://speakerdeck.com/macmladen/balccon-2013-ethics-what-it-actually-is-and-why-is-it-important | (none found — searched YouTube specifically, no result) | Speaker Deck deck page | confirmed | 28 slides, dated 2013-09-07, "Master Center on Novi Sad Fair". Off-topic for a WordPress/Drupal speaking history (ethics/philosophy) — flagged for Mladen's call on whether to include at all. |
| 2013 | BalCCon | Novi Sad | Mac OS X — How Apple learned to stop worrying and fell in love with UNIX | talk | https://speakerdeck.com/macmladen/balccon-2013-mac-os-x-how-apple-learned-to-stop-worrying-and-fell-in-love-with-unix | https://www.youtube.com/watch?v=Xzj1KP06kmw (channel: BalCCon - Balkan Computer Congress) | Speaker Deck deck page | confirmed | 30 slides, dated 2013-09-06. Same off-topic flag as above. |
| 2013 | Drupal meetup Serbia | Novi Sad | .tpl vs Panels vs Display Suite ...vs Drupal Front-end developer (DrupalRS_17) | talk | https://speakerdeck.com/macmladen/drupalrs-17-tpl-vs-panels-vs-display-suite-dot-dot-dot-vs-drupal-front-end-developer | | Speaker Deck deck page | confirmed | 17 slides, dated 2013-07-29. Deck's own description jokes it was "(not) presented" to an audience of two people because of the heat — worth knowing before treating it as a normal talk. |
| 2013 | DaFED #9 | Novi Sad | CSS vs LESS vs SASS vs Frontend Designer | talk | https://speakerdeck.com/macmladen/dafed-9-css-vs-less-vs-sass-vs-frontend-designer | | Speaker Deck deck page | confirmed | 35 slides, dated 2013-04-03. |
| 2011 | Drupal Balkan Summit (1st ever) | Novi Sad | How Do We Theme Drupal | talk | https://speakerdeck.com/macmladen/drupal-balkan-summit-2011-how-do-we-theme-drupal | | Speaker Deck deck page | confirmed | 14 slides, dated 2011-10-08. Event ran Oct 8–9, 2011. |
| 2011 | Drupal Balkan Summit | Novi Sad | How Much Is Site? | talk | https://speakerdeck.com/macmladen/drupal-balkan-summit-2011-how-much-is-site | | Speaker Deck deck page | confirmed | 6 slides, dated 2011-10-09. Second talk at the same summit as above. |
| 2019 | DrupalCon Amsterdam | Amsterdam | | unclear | | | thunder.org article "DrupalCon Amsterdam – here we come!" (title/snippet only — the page itself returned 403 to direct fetch and to the browser, and wasn't in the Wayback Machine) | unclear | A search snippet quotes him saying he'd bring "mask and snorkel" for a "Linux Server Deep Dive" session and mentions looking forward to Karaoke and Games Night — reads like an attendee's pre-conference post, not confirmation he spoke. Could not verify further. Not proposed for `speaking.ts`. |
| 2024 (approx.) | Websites Workshop (podcast) | | Guest appearance discussing Drupal CMS | unclear | | https://www.youtube.com/watch?v=0Ok-K-4EMpk ("Websites Workshop epizoda 6, gost Mladen Djuric, Drupal CMS") | YouTube search result | unclear | A podcast/webshow guest slot, not a conference talk — doesn't fit the `talk`/`workshop` model `speaking.ts` uses. Listed for completeness only. |
| — | Podcast, episode 6 | | "Podcast epizoda 6, tema Drupal CMS; predavač Mladen Đurić!" | unclear | | https://www.youtube.com/watch?v=ne1ZzPl26ZI | YouTube search result | unclear | Possibly the same or a companion recording to the row above; year not established. Same "not a conference talk" caveat. |

## What I could not confirm

- **Drupal Dev Days Burgas title.** The event and 2024 date are solid (drupal.org's own "Events Where He Spoke" list), but the session title is not. `ddd2024.drupalcamp.bg` is down (its TLS certificate now points at an unrelated `dropsolid.com` deployment) and isn't archived on the Wayback Machine, so "Advanced Drupal and DDEV" — a session that exists in search results and matches his usual subject — stays unconfirmed as his.
- **Amsterdam and Varna**, both named in the existing `summaryLine`. Amsterdam turned up one hit (DrupalCon Amsterdam 2019, attendee-shaped, see table). Varna turned up nothing at all under any spelling I tried — it may be an informal/small event not indexed anywhere, or conflated with Burgas (both Bulgarian Drupal events, ~90 km apart) in the original handover. Flagging rather than guessing.
- **LinkedIn.** The public view (not logged in) shows recent activity (2024–2025 posts) and the volunteer/certification section, but not a full work/talk history — LinkedIn hides most of "Experience" behind a sign-in wall for logged-out visitors. What's visible is folded into the table above; nothing beyond that was accessible without logging in, which I did not do.
- **Slide counts** are exact for every Speaker Deck row: Speaker Deck's own page embeds one JSON-LD `CreativeWork` entry per slide, so counting them is exact, not estimated.

## Proposed `speaking.ts`

Judgment call, flagged rather than silently applied: `speaking.ts` currently
holds five appearances even though the site's own `summaryLine` says "40+
events" — the array is clearly meant for named camps/cons/jams/wordcamps, not
every meetup or lecture. I kept that bar. Below is the array with that same
bar, newest first, restricted to `confirmed`/`likely` rows above. Everything
`unclear`, plus every meetup/lecture/podcast-tier row (VTS lectures, DaFED,
BalCCon, the Niš/Subotica/Zrenjanin/Novi Sad meetups), is left out of the
array on purpose — it's already represented by `summaryLine`, and promoting
any one of them is Mladen's call, not mine.

Two changes to *existing* entries are proposed inline (both flagged in the
table above too): the DrupalJam Utrecht 2024 title, and the Drupal Dev Days
Burgas year.

```ts
export const appearances: Appearance[] = [
  {
    event: 'WordCamp Belgrade',
    year: 2026,
    title: workshop.title,
    kind: 'workshop',
    url: workshop.path,
  },
  {
    event: 'WordPress Meetup Vršac',
    year: 2025,
    title: 'Decoupled WordPress — architecture and challenges',
    kind: 'talk',
  },
  {
    // The handover records neither a year nor a title for this one; the
    // year is now confirmed via drupal.org's own event list. Title still
    // unconfirmed — see "What I could not confirm" above.
    event: 'Drupal Dev Days Burgas',
    year: 2024,
    title: null,
    kind: 'talk',
  },
  {
    // Title corrected from the generic "Drupal and DDEV workshop" to the
    // session's real name, per Drupaljam's own announcement and the
    // YouTube upload.
    event: 'DrupalJam Utrecht',
    year: 2024,
    title: 'DDEV and Drupal, BFF',
    kind: 'workshop',
    url: 'https://speakerdeck.com/macmladen/2024-drupaljam-utrecht-drupal-and-ddev-workshop',
  },
  {
    // New: not currently in speaking.ts. A separate DrupalJam Utrecht
    // appearance the year before the DDEV workshop.
    event: 'DrupalJam Utrecht',
    year: 2023,
    title: 'NextJS with Drupal',
    kind: 'talk',
    url: 'https://speakerdeck.com/macmladen/nextjs-with-drupal-drupaljam-utrecht-2023',
  },
  {
    event: 'WordCamp Apatin',
    year: 2023,
    title: 'WordPress with Cloudflare CDN',
    kind: 'talk',
    url: 'https://apatin.wordcamp.org/2023/session/wordpress-with-cloudflare-cdn/',
  },
  {
    // New. Not on Speaker Deck; found via YouTube and drupal.rs. Kind is
    // 'talk' as a best fit, though it's an unusually large regional camp
    // for a first-ever edition.
    event: 'DrupalCamp Pannonia',
    year: 2018,
    title: 'Drupal, Docker, Composer, Gulp, oh my!',
    kind: 'talk',
    url: 'https://www.youtube.com/watch?v=HdCLICY6xno',
  },
];
```

Not carried into the array, listed here for Mladen to decide on individually:

- **Drupal Camp Novi Sad 2024** (opening + panel) — doesn't fit `talk`/
  `workshop` as a solo appearance; would need either a new `AppearanceKind`
  value or to be described as something else entirely.
- **Serbian Drupal Community Meetup, Novi Sad, 2023** ("Local development
  with DDEV") — `likely` confidence, meetup-tier.
- **DrupalHeart Camp Zagreb 2017** — two talks the same day (Docker Driven
  Drupal Development™; Gulp based Sass frontend workflow). Camp-tier, so
  arguably belongs alongside DrupalCamp Pannonia above; left out only
  because there are two of them and I didn't want to guess which one (or
  both) Mladen would want on the site.
- **Ironcamp Prague 2016** (Docker 4 Drupal) and **DrupalCamp Skopje 2015**
  and **DrupalCamp Serbia/Novi Sad 2014** (both BOA — Barracuda on Aegir) —
  all camp-tier, all `confirmed`, all with video. Same reasoning: I drew the
  line at "the site currently only reaches back to 2023" and didn't want to
  silently extend that by four entries.
- **Drupal Balkan Summit 2011** (two talks, the first-ever such summit) —
  oldest confirmed talks found; camp-tier by any reasonable definition.
- **BalCCon 2013** (Ethics; Mac OS X/UNIX) — confirmed, has one video, but
  off-topic for a WordPress/Drupal-flavoured speaking history. Mladen's call
  on whether "speaker at conferences" should include a security congress.
- All VTS lectures, DaFED, and city meetups (Niš, Subotica, Zrenjanin, Novi
  Sad) — meetup/lecture-series tier, already represented by `summaryLine`.
- Both podcast rows — not conference talks.
