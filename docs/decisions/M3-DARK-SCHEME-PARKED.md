# M3 decision: light only for v1, the three-state scheme parked

Date: 2026-09-09. Decided by Mladen during M2 polish.

## What happened

MM-16 built the three-state colour scheme the spec called for: Auto, Light and
Dark, chosen from a `<select>` in the header, remembered in `localStorage` under
the key `theme`, applied by an inline script in `<head>` before first paint.
Seeing it running, Mladen decided the site should be light for now: the sand
palette is the site's identity, and a control that ships hidden until JavaScript
reveals it is a lot of machinery for a preference nobody has asked for yet.

## Decision

The site is **light in every scheme**. `:root` declares `color-scheme: light`,
there is no `prefers-color-scheme` media block, one unconditional
`<meta name="theme-color" content="#FED">`, no header control and no inline
script. `/` and `/about/` now ship zero JavaScript; the workshop page ships only
Turnstile.

The three-state scheme is **parked, not cancelled**. It is an "After launch"
entry in `ROADMAP.md`, and the measured dark palette below is kept — as a
dormant `:root[data-theme='dark']` block at the bottom of
`src/styles/tokens.css`, and as this table — so the work does not have to be
redone.

## The measured dark palette

Every text pair clears 4.5 : 1 and every accent pair clears 7 : 1 on both the
background and the alternate band.

| Token | Value | Use | On `--color-bg` `#222` | On `--color-bg-alt` `#333` |
|---|---|---|---|---|
| `--color-bg` | `#222` | page background | | |
| `--color-bg-alt` | `#333` | alternate section band | | |
| `--color-border` | `#555` | rules, input borders | 2.1 : 1, non-text separation | 1.7 : 1 |
| `--color-ink` | `#FED` | text | 14.0 : 1 | 11.2 : 1 |
| `--color-ink-soft` | `#CBA` | secondary text, dates, captions | 8.5 : 1 | 6.8 : 1 |
| `--color-accent` | `#FAF` | links, primary button background | 9.4 : 1 | 7.5 : 1 |
| `--color-accent-strong` | `#FCF` | link hover and active, focus ring | 11.6 : 1 | 9.2 : 1 |
| `--color-accent-ink` | `#111` | text on the accent | 11.2 : 1 on `#FAF` | 13.8 : 1 on `#FCF` |
| `--color-ok-bg` / `--color-ok-ink` | `#131` / `#CFC` | success state | 12.5 : 1 | |
| `--color-error-bg` / `--color-error-ink` | `#311` / `#FCC` | field errors | 12.0 : 1 (and `--color-ink` on it, an invalid field's fill, 15.1 : 1) | |
| `--color-field-bg` | `#111` | input, select and textarea fill | `--color-ink` on it 16.7 : 1 | |

`--color-accent` is `#FAF` rather than `#F9F`: `#F9F` reaches 8.5 : 1 on the
background but only 6.8 : 1 on the alternate band, and links have to clear
7 : 1 on both surfaces.

The bar tokens and the overlay tokens are deliberately absent: header, footer
and the photo scrim are ink in every scheme, so they are declared once on
`:root` and the dark block never touches them.

## Consequences

- The accent change in MM-18 applies to the dormant block too, so the parked
  palette stays current rather than drifting.
- Anything reintroducing the switcher has to restore three things at once: the
  `prefers-color-scheme` block for Auto, the `data-theme` handling, and the
  second `theme-color` tag. Ideally with `light-dark()`, which collapses the
  two dark blocks into one definition per token.
- The spec's Design section now reads "light only for now"; these figures live
  here rather than there.

## What would change it

Mladen asking for the switcher, or readers asking for dark. Neither is a v1
blocker.
