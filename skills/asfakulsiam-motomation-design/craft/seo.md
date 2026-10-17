# SEO checklist

Twenty items, loaded on every build and redesign (SKILL.md). Each is tagged:

- **[M] mechanical**: a tool can decide it. Items marked **gate S** are measured on every page by `scripts/gate.mjs`
  (axis S, gate/4). The other [M] items are site-level (they need the whole site, a server or a crawl), so they are
  ticked in `gates/delivery-gate.md` "SEO" with the command or file that proves them.
- **[H] human**: the site owner does it in an outside tool. Write it in the hand-off as "owner to do", never as done.

The older notes in `craft/seo-performance.md` (content in the HTML, JSON-LD types per category, `hreflang`) still apply.

| ID | Tag | Item | How it is decided |
|---|---|---|---|
| seo-01 | [M] | `sitemap.xml` exists and lists every public route | site-level: compare the sitemap with the route list |
| seo-02 | [M] | `robots.txt` exists, with no accidental `Disallow: /` | site-level: read the file |
| seo-03 | [M] | No `noindex` on public pages | **gate S** (a `noindex` robots meta on the page) |
| seo-04 | [M] | A canonical tag on every route except error pages | **gate S** (exactly one `<link rel="canonical">` with an absolute URL). **Exempt:** 404, 500 and other error pages: a response with status ≥ 400, or a page named `404.html`, `500.html`, `error.html`, `not-found`, `_error`. An error page has no canonical URL: it is served at whatever address failed, and a canonical there would point every broken URL at one indexable page (a soft 404). A canonical present on an error page is a warning |
| seo-05 | [M] | Meta title unique per page, 60 characters or fewer | **gate S** (present, ≤ 60); uniqueness is site-level |
| seo-06 | [M] | Meta description unique per page, 160 characters or fewer | **gate S** (present, ≤ 160); uniqueness is site-level |
| seo-07 | [M] | Exactly one `<h1>` per page | **gate S** |
| seo-08 | [M] | Heading order skips no levels (no `h2` → `h4`) | **gate S** |
| seo-09 | [M] | Alt text on every meaningful image; decorative images use `alt=""` | gate `a` count (names check) |
| seo-10 | [M] | Schema markup where the page is eligible (Product, Article, FAQ, Event, Organization) | **gate S** warns when no JSON-LD block parses; eligibility is a judgement |
| seo-11 | [M] | At least 3 internal links per page (every other page when `sitemap.xml` lists fewer than 3; a one-page site needs none) | **gate S** (same-origin or relative `href`, not `#` alone) |
| seo-12 | [M] | Zero broken links | site-level: a link checker over the built site |
| seo-13 | [M] | Images compressed: WebP or AVIF, responsive sizes (`srcset`/`sizes` or `<picture>`) | gate axis P (perf-01) |
| seo-14 | [M] | Core Web Vitals targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 | field data or Lighthouse; never claimed unmeasured (`craft/performance.md`) |
| seo-15 | [M] | Mobile layout works at 375 px with no overflow | gate `o` and `w` counts |
| seo-16 | [M] | HTTPS enforced; no mixed content | **gate S** (no `http://` subresource in the page); the redirect is site-level |
| seo-17 | [M] | URL slugs: lowercase, hyphens, no IDs, no query parameters | **gate S** (internal `href`s and the canonical) |
| seo-18 | [M] | `og:image` present, 1200 × 630 | **gate S** (`og:image` present; `og:image:width`/`height` = 1200/630 when stated) |
| seo-19 | [H] | Search Console verified and the sitemap submitted | owner |
| seo-20 | [M] | `llms.txt` current: names the version and the latest report | site-level; for this repository, the root check-repo script |

## What gate S counts

Each failing item on the page adds one to the S count in the stamp (`rules: C0 S0 P0 K0`). The page passes S at 0.
Local files have no real origin, so a relative canonical is accepted for `file:` and `localhost` targets and reported
as "relative (local)". Schema markup only warns: whether a page is eligible is a judgement the gate does not make.

## Writing the tags

- Title: the page's subject first, the brand last: "Twelve rooms on Shankhari Bazar · Ghor Hotel".
- Description: one sentence a person would click, with the brief's facts, ≤ 160 characters.
- Canonical: the absolute URL the page should rank under, the same one the sitemap lists.
- `og:image`: a designed 1200 × 630 image, not a cropped screenshot. State `og:image:width` and `og:image:height`.
