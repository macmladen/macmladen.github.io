# Roadmap

Future work by name. An item becomes a backlog task when it is needed and gets the next MM number then; the number is written here at that moment. Nothing below has a number until that happens.

## After launch (v1 is live)

- Contact form on `/contact/` through the registration endpoint pattern (page: MM-32).
- AI cost script: price each task's transcript tokens at API list rates and print cost and active minutes per task; replace the approximate figures in the backlog.
- Per-page OG image generation (SVG to PNG at build) replacing the single static `og.png`.
- Colour-scheme switcher: bring back Auto, Light and Dark. Built once in MM-16 and removed in MM-21 so v1 ships light only; the measured dark palette is parked in `docs/decisions/M3-DARK-SCHEME-PARKED.md` and kept dormant in `src/styles/tokens.css`. Reinstating it means the header control, the inline head script, the `prefers-color-scheme` block for Auto and a second `theme-color` tag — write it with `light-dark()` rather than two dark blocks. The next two items hang off it.
- Turnstile widget follows the site's colour scheme instead of staying light.
- Border contrast decision: `#CBA` on sand and `#555` on dark are below 3:1 for non-text boundaries; keep as deliberate softness or raise.
- Serbian bio block on the about page if the WordCamp audience asks for it.

## Sections reserved in the URL hierarchy (see `docs/spec-v1.md`)

- `/speaking/<year>/` indexes, generated from `src/data/speaking.ts`; talk decks and recordings under each appearance. The `/speaking/` index itself is built (index: MM-30).
- `/work/`: three short write-ups.
- `/writing/` with `/rss.xml`: the blog; first post is the rebuild.
- `/now/`, `/cv/` with print stylesheet, `/colophon/`.
- `/sr/` prefix if the site ever goes bilingual.

## Estate (other properties, see `docs/analisys/f-2.md`)

- bluefish.rs, koder.rs, razgovori.rs, the conference site: each in its own repo and session, sharing tokens and the subscribe spine.
