# Rule-set fixtures (gate/4 axes C S P K)

Eight pages, one good and one bad per rule set, checked by `scripts/check-fixtures.mjs` with
`node skills/asfakulsiam-motomation-design/scripts/gate.mjs <page> --rules --tier 1 --json` (Tier 1: a 30 KB gzipped JS budget).

| Fixture | Expected | Deliberate violations (one per rule the gate measures) |
|---|---|---|
| `copy-good`, `seo-good`, `perf-good`, `sec-good` | `rules: C0 S0 P0 K0` | none: canonical, description, one h1, ≥ 3 internal links, og:image 1200×630, JSON-LD, lazy image below the fold, CSP and referrer meta, `_headers` with nosniff |
| `copy-bad` | C5 | copy-04 em dash · copy-09 "It's not a hotel, it's a home." · copy-11 "In today's fast-paced world" · copy-15 "Not just rooms, but…" · copy-17 "Learn more" |
| `seo-bad` | S11 | seo-03 noindex · seo-04 two canonicals · seo-05 84-char title · seo-06 199-char description · seo-07 two h1 · seo-08 h2 → h4 · seo-10 JSON-LD with a trailing comma · seo-11 one internal link · seo-16 an image over plain http · seo-17 `Rooms_List.html?id=4` · seo-18 og:image 800×600 |
| `perf-bad` | P6 | perf-01 PNG hero with no AVIF/WebP · perf-02 eager image below the fold · perf-03 the hero (LCP) lazy-loaded · perf-04 `app.js` over the Tier 1 30 KB gzipped budget · perf-11 an inline script holding only a comment · perf-12 `app.js` in head without defer |
| `sec-bad` | K7 | sec-06 cookie without HttpOnly/Secure/SameSite · sec-07 `api_key` string in `app.js` (a made-up value) · sec-12 `location.hash` → `innerHTML` · sec-16 `Access-Control-Allow-Origin: *` · sec-h1 no CSP · sec-h2 no nosniff · sec-h3 no Referrer-Policy |
| `sec-secret-bundle` | K1 | sec-07 `client_secret` string in the client bundle `bundle.js` (a made-up value); warns sec-06 (`localStorage.setItem("authToken", …)`) and sec-09 (`console.log` of an email), which are heuristic and never counted (v2.7.0) |

The bad pages are otherwise identical to the good one, so each fails only its own set. The secret in `sec-bad/app.js`
is invented and shaped to match the gate's generic "secret assignment" pattern, not any real provider's key format.
