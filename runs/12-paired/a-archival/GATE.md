# Leaf & Ledger · Quiet archival · verification

## Measured

scripts/completeness.mjs:
```text
bench/runs/12-paired/a-archival/DESIGN.md
  X — completeness (single-estate tea ecommerce, fictional US demo., admin panel: no) [functional frontend]  ✓
      Routes:      19/19 required present
      Journeys:    3/3 connected
      Functions:   4/4 present · 3 not required (reason given)
      States:      1/1 defined
      Legal:       4/4 present
      Edge cases:  2/2 handled
      Admin:       0/0 present · 1 not required (reason given)
      Skeletons:   0/0 present · 1 not required (reason given)
      Template:    17/17 present · 3 not required (reason given)
```

scripts/realism.mjs:
```text
  Content realism  ✓
```

scripts/gate.mjs --rules, every sitemap route and /404:
```text

http://localhost:4311/
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/shop
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/tea/sylhet-black
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/tea/assam-gold
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/tea/ilam-green
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/tea/darjeeling-first
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/tea/nepal-white
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/tea/bangladesh-green
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/subscriptions
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/subscriptions/build
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/cart
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/checkout
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/confirmation
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/account
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/account/subscription
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/estates
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/brewing-guide
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/shipping
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/returns
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/privacy
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/terms
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/contact
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4311/404
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
gate: constrained machine (2 CPUs); a failed scan is retried once in the light footprint
```

scripts/pair.mjs, both directions and all 22 shared sitemap routes, desktop and mobile:
```text
PAIR · a-archival × b-poster · 22 of undefined shared route(s) compared at 1440x900, 375x812 · threshold 0.4 (lower = more different)
  route parity     ✓ 22 / 22 route(s)
  coherence        a-archival 1 (fraunces / dm sans) · b-poster 1 (barlow condensed / dm sans)
  shared files     presentation 0 · logic/data 8 (SCHEMA.md, _headers, assets/DM-Sans-OFL.txt, catalogue.js): expected

| Route | class | structure | composition | image | typography | interaction | signature | overall | markup | forms parity | nav parity |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| / | partial | 0.30 | 0.44 | 0.40 | 0.44 | 0.11 | 0.25 | 0.28 | 0.49 | n/a | 0.67 |
| /shop | partial | 0.02 | 0.40 | 0.00 | 0.50 | 0.18 | 0.38 | 0.23 | 0.37 | 1.00 | 0.57 |
| /tea/sylhet-black | partial | 0.22 | 0.44 | 0.33 | 0.49 | 0.17 | 0.00 | 0.33 | 0.41 | n/a | 1.00 |
| /tea/assam-gold | partial | 0.22 | 0.44 | 0.33 | 0.49 | 0.17 | 0.00 | 0.33 | 0.41 | n/a | 1.00 |
| /tea/ilam-green | partial | 0.22 | 0.43 | 0.33 | 0.49 | 0.17 | 0.00 | 0.33 | 0.41 | n/a | 1.00 |
| /tea/darjeeling-first | partial | 0.22 | 0.44 | 0.33 | 0.49 | 0.17 | 0.00 | 0.33 | 0.41 | n/a | 1.00 |
| /tea/nepal-white | partial | 0.22 | 0.43 | 0.33 | 0.49 | 0.17 | 0.00 | 0.33 | 0.41 | n/a | 1.00 |
| /tea/bangladesh-green | partial | 0.22 | 0.44 | 0.33 | 0.49 | 0.17 | 0.00 | 0.33 | 0.41 | n/a | 1.00 |
| /subscriptions | partial | 0.38 | 0.61 | n/a | 0.51 | 0.15 | 0.00 | 0.35 | 0.44 | n/a | 0.67 |
| /subscriptions/build | recomposed | 0.29 | 0.38 | n/a | 0.51 | 0.16 | n/a | 0.32 | 0.50 | 1.00 | 0.67 |
| /cart | partial | 0.31 | 0.40 | n/a | 0.58 | 0.15 | 0.11 | 0.31 | 0.44 | n/a | 0.67 |
| /checkout | partial | 0.31 | 0.47 | n/a | 0.56 | 0.17 | 0.00 | 0.32 | 0.44 | 1.00 | 0.67 |
| /confirmation | partial | 0.52 | 0.37 | 0.00 | 0.52 | 0.15 | 0.00 | 0.31 | 0.50 | n/a | 0.67 |
| /account | partial | 0.05 | 0.72 | n/a | 0.44 | 0.11 | 0.00 | 0.29 | 0.48 | n/a | 0.67 |
| /account/subscription | partial | 0.22 | 0.45 | n/a | 0.57 | 0.17 | 0.00 | 0.28 | 0.41 | 1.00 | 1.00 |
| /estates | recomposed | 0.30 | 0.20 | 0.00 | 0.47 | 0.22 | 0.00 | 0.20 | 0.42 | n/a | 0.67 |
| /brewing-guide | partial | 0.05 | 0.57 | n/a | 0.46 | 0.15 | n/a | 0.29 | 0.43 | n/a | 0.67 |
| /shipping | partial | 0.26 | 0.53 | n/a | 0.56 | 0.22 | n/a | 0.37 | 0.43 | n/a | 1.00 |
| /returns | partial | 0.26 | 0.53 | n/a | 0.56 | 0.22 | n/a | 0.34 | 0.43 | n/a | 1.00 |
| /privacy | partial | 0.26 | 0.55 | n/a | 0.57 | 0.22 | 0.00 | 0.35 | 0.43 | n/a | 1.00 |
| /terms | partial | 0.26 | 0.58 | n/a | 0.56 | 0.22 | n/a | 0.37 | 0.43 | n/a | 1.00 |
| /contact | recomposed | 0.33 | 0.31 | n/a | 0.37 | 0.17 | n/a | 0.29 | 0.48 | 1.00 | 1.00 |

  visual axes: similarity with forms and navigation left out (--same-product), worst viewport · markup: element skeleton, form internals collapsed · parity: required to be high
  · /: partial (composition at or above 0.4); check the screenshots
  · /shop: partial (composition at or above 0.4); check the screenshots
  · /tea/sylhet-black: partial (composition at or above 0.4); check the screenshots
  · /tea/assam-gold: partial (composition at or above 0.4); check the screenshots
  · /tea/ilam-green: partial (composition at or above 0.4); check the screenshots
  · /tea/darjeeling-first: partial (composition at or above 0.4); check the screenshots
  · /tea/nepal-white: partial (composition at or above 0.4); check the screenshots
  · /tea/bangladesh-green: partial (composition at or above 0.4); check the screenshots
  · /subscriptions: partial (composition at or above 0.4); check the screenshots
  · /cart: partial (composition at or above 0.4); check the screenshots
  · /checkout: partial (composition at or above 0.4); check the screenshots
  · /confirmation: partial (structure at or above 0.4); check the screenshots
  · /account: partial (composition at or above 0.4); check the screenshots
  · /account/subscription: partial (composition at or above 0.4); check the screenshots
  · /brewing-guide: partial (composition at or above 0.4); check the screenshots
  · /shipping: partial (composition at or above 0.4); check the screenshots
  · /returns: partial (composition at or above 0.4); check the screenshots
  · /privacy: partial (composition at or above 0.4); check the screenshots
  · /terms: partial (composition at or above 0.4); check the screenshots
  limits: does not judge quality, brief fit, accessibility, journeys or motion: run gate.mjs (and --journey) on each direction

PASS  one product, 22 route(s) recomposed or partial, no shared presentation, routes and functions at parity
```

Custom lightweight Playwright qa/journeys.mjs (not skill axis J):
```text
375: one-off / → /shop → /tea/sylhet-black → /cart → /checkout → /confirmation PASS
375: monthly / → /subscriptions → /subscriptions/build → /checkout → /confirmation PASS
375: /account → /account/subscription → pause saved → reload → resume → skip saved → reload PASS
768: one-off / → /shop → /tea/sylhet-black → /cart → /checkout → /confirmation PASS
768: monthly / → /subscriptions → /subscriptions/build → /checkout → /confirmation PASS
768: /account → /account/subscription → pause saved → reload → resume → skip saved → reload PASS
1440: one-off / → /shop → /tea/sylhet-black → /cart → /checkout → /confirmation PASS
1440: monthly / → /subscriptions → /subscriptions/build → /checkout → /confirmation PASS
1440: /account → /account/subscription → pause saved → reload → resume → skip saved → reload PASS
Route inspection: 44 route/viewport combinations.
Console errors: 0.
Issues: 0.
PASS lightweight frontend QA: all three journeys complete at 375, 768 and 1440; pause/skip persist; HTTP 404 verified.
```

Custom lightweight Playwright qa/extra-states.mjs:
```text
PASS three-pouch plan: exact tea count, $34.00 total, selection persists after reload.
PASS cart removal: final line removed, empty state survives reload, focus moves to browse link.
PASS corrupt cart recovery: safe empty state, explicit warning, valid subsequent save and reload.
PASS image-error fallback: explanation is visible and purchase control remains usable.
Console errors: 0.
PASS extra frontend states.
```

scripts/contrast.mjs, selected declared token combinations only:
```text
#263d32 on #f4f0e6: 10.27:1  body PASS · large PASS · AAA PASS

#526052 on #e9e5d8: 5.28:1  body PASS · large PASS · AAA —

#f4f0e6 on #294d3d: 8.30:1  body PASS · large PASS · AAA PASS

#8a422c on #f4f0e6: 6.37:1  body PASS · large PASS · AAA —
```

## Judged

- (opinion, self) The botanical plate, numbered margins, fine rules and Fraunces headings communicate the archival brief without concealing Shop, Account or Cart.
- (opinion, self) The catalogue filter rail and three-part tea record make provenance available beside a direct purchase control; checkout is a compact docket rather than a reading gate.
- (opinion, self) Paper, deep green and botanical linework form one coherent system across commerce and policy routes. Extra decoration, invented reviews, scarcity counters and cinematic scrolling were deliberately rejected.
- (opinion, self) Remaining pair “partial” classifications are acceptable here: product tasks retain conventional reading order, but markup, grids, illustrations, type and interaction styling differ. This is a trade-off, not a claim of total recomposition.

## Not verified

- Full scripts/gate.mjs scan and --journey were deliberately not run: benchmark prohibits them on this shared two-CPU machine. No gate stamp, complete accessibility pass, axis J pass or numeric critique score is claimed.
- Rendered pixel contrast for every element, forced colours, complete keyboard traversal, screen readers, real devices, browser compatibility outside installed Chromium, and motion frame-time were not measured; lightweight checks are bounded.
- The viewport reflow checks are not an actual browser 200% zoom audit. Only the skip link received a keyboard assertion; other journeys used standard control interaction.
- No live payments, authentication, mail, shipping, order processing or server-error response was exercised: those services do not exist in this functional frontend.
- No independent visual judge or unrelated-build originality comparison ran: no prior comparison build was available. Pair comparison is same-product direction difference, not aesthetic quality.
- No measured field performance, Lighthouse, SEO indexing or social-preview ingestion; localhost canonicals need a production origin.
- Only selected palette tokens were checked by contrast.mjs; this is not the full rendered-pixel contrast gate.
- Cross-tab synchronization, simultaneous edits and unusual localStorage partial-write failures were not separately asserted; the demonstrated persistence contract covers same-browser reloads.
- cost.mjs could not derive token/tool totals without a runner transcript.jsonl and run.json in the build folder; zero or missing cost fields are not measured free usage.
