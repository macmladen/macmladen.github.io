# Verification pass, 2026-09-10 (MM-11)

Live site at v2.2 plus the fixes committed with this pass. Judge review (Opus, read-only) against every acceptance criterion in `spec-v1.md`, plus Lighthouse run locally with headless Chrome against https://macmladen.com.

## Lighthouse, mobile

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` | 100 | 95 | 100 | 100 |
| `/about/` | 100 | 95 | 100 | 100 |
| `/speaking/` | 100 | 95 | 100 | 100 |
| `/contact/` | 100 | 96 | 100 | 100 |
| workshop page | 100 | 96 | 100 | 100 |

The accessibility deduction is one audit, colour contrast: white on #F40 buttons (3.45:1) and #F40 text on the band (2.61:1). Mladen's decision of 2026-09-09 with the ratios known; the spec criterion now says 95 or better.

## Environment

Build clean; `npm test` 139 assertions green; `npm run check:csp` all covered. All pages, OG cards, `llms.txt`, `robots.txt`, sitemap and `keys.txt` answer 200 live. Both endpoints answer 422 to a bad Turnstile token and store nothing.

## Findings and what was done

1. `/contact/` meta description still promised a form "once the workshop registration is behind us". Fixed.
2. Forms cannot complete with JavaScript off: Turnstile mints its token in the browser. Validation and error re-render do work without JavaScript; the `<noscript>` block points to email. Recorded as a decision in the spec.
3. After the close date the prerendered page would keep showing the form, and the page script showed a generic failure on the endpoint's 403. Fixed: the closed notice carries `data-form-closed` and the script swaps it in. A rebuild on the 18th is on the roadmap regardless.
4. Contrast versus Lighthouse 100: the two criteria contradicted each other; reconciled in the spec (accessibility 95 or better by decision).
5. Spec drift corrected: credit strip on the announcement, four facts rows, ten form controls, no placeholder link, SSH keys row on Contact, per-task commits, no DDEV.
6. Cosmetic, on the roadmap: workshop OG card and the speaking highlight without date or venue; HSTS not set on the zone; www serves the site instead of redirecting; CSP allows the Cloudflare analytics beacon whether or not it is injected.
7. Three Adobe product links refuse automated clients (HTTP/2 error) but open in a browser; all other 78 outbound links answered 200. No broken internal link, no missing OG image, every JSON-LD block parses, heading order valid on every page.

## Not verified

A valid submission end to end in this pass (needs a real Turnstile token); proven separately on 2026-09-10 by Mladen's live test registration and contact message. Layout at 360 and 1440 px was checked in earlier tasks, not re-measured here.
