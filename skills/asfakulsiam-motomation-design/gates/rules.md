# Rules (design input)

Read before Step 1. Design inside these. `scripts/gate.mjs` measures them after the build; `gates/delivery-gate.md` verifies them.

## Contrast (gate `c`)

| Rule | Limit |
|---|---|
| Body text | ≥ 4.5:1 against the pixels behind it |
| Large text (≥ 24px, or ≥ 18.66px bold) | ≥ 3:1 |
| Widths measured | 375, 390, 768, 1440px |
| Sample judged | the 10th-percentile background sample, not the median |
| Scroll positions | every 0.7 viewport; every 0.15 viewport in pinned zones; 0/25/50/75/100% of page and zone |
| Scroll-sequence steps | AA in the active state and in every inactive (dimmed) state |
| Dimmed text | measured as rendered: text × opacity + background × (1 − opacity) |
| Forced colors | rendered ink ≥ 3:1 against its box |
| Accent | ≤ 5% of each screen |

## Overflow and long words (gate `o`, `w`)

| Rule | Limit |
|---|---|
| Horizontal scroll | none at 375, 390, 768, 1440px |
| Element past viewport or parent | ≤ 1px, unless a clipping ancestor |
| Display text at 375px (h1–h3, any text ≥ 32px) | fits its box, stays in the viewport, no word broken across lines |
| One word split across elements | never |
| Reflow at 320px | no horizontal scroll |

## Hierarchy (critique `H`, SEO `S`)

| Rule | Limit |
|---|---|
| `h1` | exactly one per page |
| Heading levels | no skipped level |
| Largest text on the first 375px screen | one |
| Body size | ≥ 16px |
| Measure | ≤ 75ch |

## Reduced motion (gate `rm`, `q`)

| Rule | Limit |
|---|---|
| `prefers-reduced-motion` path | every animation has one |
| Text visible in full motion | visible under reduced motion |
| Still page | no pixels change |
| Pinned zones | none pinned under reduced motion |
| Fallback | a designed still: unpinned plates, every step visible |
| Values | no value later corrected (no "0" before a count-up) |

## Motion quality and budgets (gate `q`, critique `M`, `V`)

| Rule | Limit |
|---|---|
| Pinned zone progression | median change between 8 samples > 0.5% of pixels |
| Smoothness, p95 rAF interval | ≤ 20 ms at 1440; ≤ 25 ms at 375 with CPU ×4 (unconstrained machine only) |
| Pinned sections | ≤ 2 |
| WebGL canvases | ≤ 1 |
| JS gzipped, Tier 1 | ≤ 30KB beyond the framework |
| JS gzipped, Tier 2 | ≤ 80KB |
| JS gzipped, Tier 3 | ≤ 140KB |
| JS gzipped, Tier 4–5 (or tier unknown) | ≤ 250KB |
| Section entrance patterns | no two top-level sections share one (static excluded) |
| UI feedback (press, hover, focus, toggle, tooltip) | ≤ <!--rule:ui_feedback_max_ms-->250ms<!--/rule--> |
| Entrances | no `scale(0)`, no ease-in |
| Animated properties | `transform`, `opacity`; never `top`, `left`, `width`, `height` |
| Off-screen loops and canvases | paused |
| Scroll | never hijacked: keyboard, anchors and screen readers keep working |

## Accessibility (gate `a`, `k`)

| Rule | Limit |
|---|---|
| `img` | has `alt`; decorative uses `alt=""` |
| Focusable elements | have an accessible name |
| Focus ring | changes ≥ 1% of the pixels around the element |
| Touch targets at 375 | ≥ 24×24px (inline links exempt); < 44px warns |
| 200% zoom (720×450 CSS viewport) | no text clipped, no control off screen or covered |
| Keyboard | no trap; every tabbable element reachable |
| Clickable elements | real `a`/`button`, never a clickable `div` |
| Landmarks and skip link | present |

## Content and defaults (Delivery Gate Part 2)

| Rule | Limit |
|---|---|
| Display face | not <!--rule:banned_display_fonts-->Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Arial, Helvetica or the system UI stack<!--/rule--> |
| Caution faces | <!--rule:caution_fonts-->Playfair Display and Space Grotesk<!--/rule--> only with a stated reason |
| Display faces | one (two only for a contrast concept) |
| Accent colours | one |
| Signature moves | one |
| Placeholder copy | none: no lorem ipsum, "Acme", "John Doe" |
| Statistics, logos, testimonials, awards | real and sourced, or `[NEEDS COPY]` |
| Links, domains, pages | only those the brief supplies or the build creates |
| Emoji as icons or bullets | none |
| Gradients, blobs, glass, bento, three-icon feature row | only with a concept reason |
| Code | no TODOs, `// ...rest`, `markers: true`, stray `console.log` |

## Copy (gate `rules: C`, `craft/copy.md`)

| Rule | Limit |
|---|---|
| copy-04 | no em dash in visible copy, `alt`, title or description |
| copy-09 | no aphorism formula ("It's not X, it's Y") |
| copy-11 | no warm-up opener |
| copy-15 | no two-beat antithesis ("Not just X, but Y") |
| copy-17 | no vague CTA label ("Learn more", "Submit", "Click here") |
| copy-06 | paragraphs ≤ 4 lines (warns) |
| copy-16 | no unsourced "trusted by N" claim (warns) |

## SEO (gate `rules: S`, `craft/seo.md`)

| Rule | Limit |
|---|---|
| seo-03 | no `noindex` on public pages |
| seo-04 | exactly one canonical |
| seo-05 | title ≤ 60 characters, unique |
| seo-06 | description ≤ 160 characters, unique |
| seo-07 | one `h1` |
| seo-08 | no skipped heading level |
| seo-10 | JSON-LD parses; schema where eligible (warns when missing) |
| seo-11 | ≥ 3 internal links to other pages |
| seo-16 | no mixed content |
| seo-17 | slugs lowercase, hyphenated, no IDs or query strings |
| seo-18 | `og:image` present, 1200 × 630 |
| seo-01, seo-02, seo-12 | sitemap, robots.txt, zero broken links (site level) |

## Performance (gate `rules: P`, `craft/performance.md`)

| Rule | Limit |
|---|---|
| perf-01 | raster images AVIF or WebP |
| perf-02 | below-the-fold images `loading="lazy"` |
| perf-03 | LCP image not lazy |
| perf-04 | JS gzipped within the tier budget |
| perf-11 | no empty inline scripts |
| perf-12 | no render-blocking head scripts |
| perf-07 | scripts > 2KB minified (warns) |
| Hero image | ≤ 200KB |
| `img`/`video` | `width` and `height` or an `aspect-ratio` box |
| Fonts | ≤ 1 preloaded file, `font-display: swap` |
| Core Web Vitals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (never claimed unmeasured) |

## Security (gate `rules: K`, `craft/security.md`)

Every [M] rule of `craft/security.md`. "warns" = heuristic, printed, never counted.

| Rule | Limit |
|---|---|
| sec-01 [M] | admin routes require auth and carry `noindex` |
| sec-03 [M] | row-level security on every user-data table where the database supports it |
| sec-06 [M] | auth cookies `HttpOnly`, `Secure`, `SameSite` (gate); no auth token in `localStorage`/`sessionStorage` (gate warns) |
| sec-07 [M] | no secret-shaped string in served HTML or JS (gate) |
| sec-08 [M] | `.env`, `.env.*` in `.gitignore`; only `.env.example` committed (gate warns, local targets) |
| sec-09 [M] | no `console.*` or log line that prints a token, key, password, session id or email (gate warns) |
| sec-11 [M] | every form input validated on the server with a schema |
| sec-12 [M] | no URL- or user-controlled value written with `innerHTML`/`outerHTML`/`document.write` (gate) |
| sec-13 [M] | uploads checked by real MIME type against an allow-list and by size |
| sec-15 [M] | rate limits on auth, contact and every mutation |
| sec-16 [M] | no `Access-Control-Allow-Origin: *` in production (gate) |
| sec-17 [M] | no debug mode, development build or public source map in production (gate warns) |
| sec-20 [M] | role, user id, tenant and price never taken from the client |
| sec-h1 | `Content-Security-Policy` sent (gate; header or meta; meta only over HTTP warns) |
| sec-h2 | `X-Content-Type-Options: nosniff` sent as a header (gate) |
| sec-h3 | `Referrer-Policy` sent, header or meta (gate) |
