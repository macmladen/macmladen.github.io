# Roadmap

Future work by name. An item becomes a backlog task when it is needed and gets the next MM number then; the number is written here at that moment. Nothing below has a number until that happens.

## After launch (v1 is live)

- Contact page at `/contact/`: email, profile links, later a form through the registration endpoint pattern.
- AI cost script: price each task's transcript tokens at API list rates and print cost and active minutes per task; replace the approximate figures in the backlog.
- Per-page OG image generation (SVG to PNG at build) replacing the single static `og.png`.
- Turnstile widget follows the site's colour scheme instead of staying light.
- Border contrast decision: `#CBA` on sand and `#555` on dark are below 3:1 for non-text boundaries; keep as deliberate softness or raise.
- Collapse the duplicated dark token block with `light-dark()` once the theme control sets `color-scheme` at the root only.
- Serbian bio block on the about page if the WordCamp audience asks for it.

## Sections reserved in the URL hierarchy (see `docs/spec-v1.md`)

- `/speaking/` and `/speaking/<year>/` indexes, generated from `src/data/speaking.ts`; talk decks and recordings under each appearance.
- `/work/`: three short write-ups.
- `/writing/` with `/rss.xml`: the blog; first post is the rebuild.
- `/now/`, `/cv/` with print stylesheet, `/colophon/`.
- `/sr/` prefix if the site ever goes bilingual.

## Estate (other properties, see `docs/analisys/f-2.md`)

- bluefish.rs, koder.rs, razgovori.rs, the conference site: each in its own repo and session, sharing tokens and the subscribe spine.
