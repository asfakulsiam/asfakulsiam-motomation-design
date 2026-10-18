# Leaf & Ledger · Quiet archival

## Stack
- **Stack:** static HTML, CSS, vanilla JavaScript; Node 20 static server.
- **Source:** named in benchmark brief.
- **Reason:** no installs, no bundler; every required route has its own HTML file.
- **Adapter:** adapters/vanilla.md read.
- **Route:** full; both are new designs.
- **Conflict:** user stack and limited-check instructions override skill framework default and full-gate requirement.

## Dependencies
No runtime package dependencies. Node built-ins serve files; preinstalled Playwright is QA-only. Self-hosted font licences appear in MEDIA.md.

## Product contract
Approved at Checkpoint 2 before concept selection.
- **Product:** fictional single-estate tea storefront for Bangladesh, India and Nepal, with one-off purchase and monthly subscription.
- **Audience:** English-reading home tea drinkers, novice and returning, using mobile or desktop, keyboard or touch.
- **Jobs:** choose a tea; choose a plan and its teas; complete a demo checkout; return to pause or skip a delivery.
- **Business model:** one-off 50g pouches and recurring two- or three-pouch plans. All prices USD. No real sale in this frontend.
- **Core journeys:**
  - / → /shop → /tea/sylhet-black → /cart → /checkout → /confirmation
  - / → /subscriptions → /subscriptions/build → /checkout → /confirmation
  - /account → /account/subscription
  - On management, choose pause or skip, then save; the status changes on the same route.
- **IA:** persistent Shop, Subscriptions, Estates, Account and Cart; footer contains brewing and policies. Tea detail is one step below shop; management one step below account.
- **Density:** medium catalogue and detail; compact checkout and management; generous but task-first marketing and estate stories.
- **States:** all selections and cart changes immediate; empty cart, no matching teas, invalid form, storage unavailable, saved subscription, pending save and demo confirmation. No simulated server success. Unknown routes return designed 404 with HTTP 404.
- **Responsive:** 375px single-column forms; filters remain visible; cart remains directly accessible; 768px intermediate grid; 1440px composed panels with a stable reading order. 320px reflow and 200% viewport checked in lightweight QA.
- **Constraints:** static frontend, localStorage persistence only, no packages, ports 4311 only for our preview server, shared two-CPU machine.
- **Exclusions:** real payment, identity verification, email delivery and order fulfillment; interfaces still ship and explicitly say demo. No admin panel because no backend exists.
- **Assumptions:** demonstration US shipping, flat $5 one-off shipping, subscription shipping included, two and three pouches at $24/$34 monthly; fiction disclosed on every page. Six named demo estate lots to support filters.
- **Success:** all core journeys complete at 375 and 1440, route parity, working persistence and no misleading controls.

## Scope
**Site type:** single-estate tea ecommerce, fictional US demo.
**Admin panel:** no (local demo, no staff data or backend).
**Delivery mode:** functional frontend

| Kind | Item | Mark | Evidence | Level |
|---|---|---|---|---|
| route | / | requested | | interface |
| route | /shop | requested | | interface |
| route | /tea/sylhet-black | requested | | interface |
| route | /tea/assam-gold | requested | | interface |
| route | /tea/ilam-green | requested | | interface |
| route | /tea/darjeeling-first | requested | | interface |
| route | /tea/nepal-white | requested | | interface |
| route | /tea/bangladesh-green | requested | | interface |
| route | /subscriptions | requested | | interface |
| route | /subscriptions/build | requested | | interface |
| route | /cart | requested | | interface |
| route | /checkout | requested | | interface |
| route | /confirmation | requested | | interface |
| route | /account | requested | | interface |
| route | /account/subscription | requested | | interface |
| route | /estates | requested | | interface |
| route | /brewing-guide | requested | | interface |
| legal | /shipping | requested | | interface |
| legal | /returns | requested | | interface |
| legal | /privacy | requested | | interface |
| legal | /terms | requested | | interface |
| route | /contact | requested | | interface |
| route | /404 | requested | | interface |
| journey | one-off order | required | / → /shop → /tea/sylhet-black → /cart → /checkout → /confirmation | persisted |
| journey | subscription order | required | / → /subscriptions → /subscriptions/build → /checkout → /confirmation | persisted |
| journey | subscription management | required | /account → /account/subscription | persisted |
| function | origin, type and caffeine filters | requested | store.js#filter | interaction |
| function | cart quantity and removal | requested | store.js#quantity | persisted |
| function | plan selection and tea choices | requested | store.js#builder | persisted |
| function | pause and skip saved | requested | store.js#subscription | persisted |
| function | real payment | not required for this brief, reason: backend payment deferred; interface: /checkout | | backend |
| function | authentication | not required for this brief, reason: fictional demo account; interface: /account | | backend |
| function | contact email delivery | not required for this brief, reason: no mail server; interface: /contact | | integration |
| state | empty, filled, loading, error, success and validation | required | SCHEMA.md#States | interaction |
| edge | storage failure and corrupt cart recovery | required | store.js#storage | interaction |
| edge | not found response | required | 404.html | interface |
| skeleton | async product list | not required for this brief, reason: catalogue is complete static HTML and has no network fetch | | |
| admin | staff administration | not required for this brief, reason: no staff workflows in requested frontend | | |
| template | package.json | not required for this brief, reason: Node built-ins with no package installs; run node server.mjs | | |
| template | .env.example | not required for this brief, reason: no environment variables read by site | | |
| template | middleware.ts | not required for this brief, reason: server.mjs sets static security headers; no auth backend | | |


## Type research
| Site | Type | Routes and functionality | States | Admin and legal | Evidence status |
|---|---|---|---|---|---|
| [Teabox](https://www.teabox.com/) | single-estate tea ecommerce | Homepage lists tea weight, origin, price and add options | Stock and purchase behavior unverified | Admin unverified | Observed text; visual responsive behavior unverified |
| [Art of Tea](https://www.artoftea.com/pages/tea-of-the-month) | tea subscriptions | Tracks, lengths, quantities and prepaid terms | Pause via contact described; management screen unverified | Admin unverified; subscription terms observed | Observed content; no transaction completed |
| [Upton Tea Imports](https://www.uptontea.com/collections/single-estate-teas) | single-estate catalogue | Category, filters and lot explanation | Loading products in extracted content | Admin unverified | Observed text; catalogue details partly inaccessible |

**Gaps:** No checkout, account, responsive behavior or live motion of references was tested. Those are requirements from the brief, not claims about references. Estate names, products, prices, policies and account records here are explicitly fictional demo content.

## Research record
**Access:** web searched and pages fetched 2026-10-18. No reference imagery or proprietary code reused.
**Questions:** How do shoppers compare origin and taste quickly? What must a subscription choice explain before purchase? How can botanical archive and saturated poster systems support identical tasks?

| Source and URL | Kind | Observation | Intended use | Limitation |
|---|---|---|---|---|
| [Teabox](https://www.teabox.com/) | production | Weight, named tea, tasting notes and price are present together | Keep price and 50g quantity visible on every product card | Text extraction, not a visual review; their statistics are not reused |
| [Art of Tea](https://www.artoftea.com/pages/tea-of-the-month) | production | Quantity, billing length and renewal policy are explicit | Put monthly charge and pause/skip terms before plan selection | Our recurring monthly demo differs from their prepaid model |
| [Upton](https://www.uptontea.com/collections/single-estate-teas) | production | Explains estate lots as distinct and seasonal; filter affordance present | Origin/type/caffeine filters and estate context beside products | Actual filtering not tested |
| [BP&O / Teahouse Exclusives](https://bpando.org/2015/02/26/packaging-teahouse-exclusives/) | design case study | Article describes custom typography, pen illustration and fluorescent colour differentiating variants | Synthesize printed illustration in A and origin-coded colour in B | Article reviewed as text; no artwork copied; packaging is not proof of ecommerce usability |
| [Kew tea plant](https://www.kew.org/plants/tea-plant) | botanical reference | Search excerpt describes shiny leaves and white flowers | Original leaf and blossom illustration, not a scientific plate reproduction | Search excerpt only; anatomy simplified and not a scientific identification aid |
| [Kew illustration collection](https://www.kew.org/science/collections-and-resources/collections/illustrations-and-artefacts-collection) | archive reference | Search excerpt explains systematically arranged plant illustrations | A's folio captions, numbered specimens and botanical separation | Search excerpt only; no collection image reused |
| [MDN View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using) | implementation docs | Same-origin documents opt in using navigation:auto | B's brief Tier 3 cross-document continuity | Progressive enhancement; reduced-motion behavior authored separately |
| [Fraunces licence](https://github.com/google/fonts/blob/main/ofl/fraunces/OFL.txt), [Barlow Condensed licence](https://github.com/google/fonts/blob/main/ofl/barlowcondensed/OFL.txt), [DM Sans licence](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt) | official repository | OFL 1.1 licences allow embedding with notices | Self-host fonts and include original licence notices | No modified font files |

**Changed by research:** Replaced an image-first product tile idea with a tile that always shows origin, flavour, weight and price. Put exact monthly quantities and recurring price at plan selection; no hidden renewal terms. Archive reading content remains secondary to a visible Shop and Cart.
**Techniques considered:** Native details for mobile navigation; native inputs for filters and selections; cross-document view transitions in B; no GSAP or WebGL because platform animation meets the brief.
**Pattern avoided:** Multi-screen cinematic intro before the shop; no fabricated trust claims, testimonials or scarcity.


## Directions
| Criterion | A: living tea ledger | B: origin on the wall | C: tasting counter |
|---|---|---|---|
| Idea | Specimen plates and editorial ledger | Bright origin posters and oversized pack forms | Compact utilitarian catalogue |
| Route structure | Intro with marginal index; sidebar shop; three-part detail; folio checkout | Horizontal poster header; origin colour grid; product stage; banded checkout | Search-first product shelf throughout |
| Type and motion | Fraunces / DM Sans; Tier 1 ink and state feedback | Barlow Condensed / DM Sans; Tier 3 page and pack continuity | One compact sans, Tier 1 |
| Suitability and audience | Thoughtful discovery with prices visible; quiet brief fit | Quick origin recognition, energetic brief fit | Efficient but misses both requested identities |
| Usability and accessibility | Native forms and links, ample contrast | Native forms and links, dark ink on saturated colour | Native forms |
| Responsive and technical | Plate stacks after purchase intro; static SVG inexpensive | Hero shortens, packs stack; standard scroll and CSS transitions | Easy but visually generic |
| Originality and distinction | Original botanical studies, marginal record numbers | Original pack silhouettes and typographic origin bands | Rejected as under-specific |
| Core journeys | All three survive | All three survive | All three would survive |

**Chosen for this folder:** A, mandated by the paired client art direction; C rejected for weak identity. No template or theme swap. Separate page markup, section order, component structure, type, grids, illustration and motion. Shared state, product data, form fields, validation messages and accessibility primitives only.
**Comparison:** Actual scripts/pair.mjs output follows. The provided script prints “undefined shared route(s)” in its title; the route-parity line and JSON enumerate the actual 22 routes. This display defect is left intact; the read-only skill was not edited. “Partial” is advisory and is not misrepresented as every route being recomposed.

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


## Concept
- **Tension:** single-estate tea rewards reading, but buying and managing it must be immediate.
- **Concept sentence:** Open a living tea ledger where every specimen can become the next cup.
- **Structure:** derived from contract; archival folio vocabulary in A and poster bands in B, not a recipe replacing the shop.
- **Signature:** numbered botanical folio.
- **Dials:** ENERGY 1, RHYTHM 2, MOTION 1; Tier 1. Task UI feedback stays Tier 1.
- **Tools:** archetype adapted only as archival caption vocabulary in A; no archetype dictates IA. Collision/mutation rejected because directions are explicit. Component dataset search attempted but script has no components dataset; native platform primitives chosen. No external component library.
- **Not doing:** hidden cart, fake handwritten history or magazine-only shopping.

## Divergence
- **Prior similar build:** isolated project memory has no logged builds. User-wide history is read only; no writes outside output folders.
- **Same, justified:** one product requires identical route list, field labels, validation and business logic.
- **Diverging:** markup, grid, type roles, colour system, botanical illustration versus pack artwork, section rhythm and transition language.
- **AI-default scan:** no centred dual-button screenshot hero, blobs, glass, feature-icon trio, trust logos or unsourced statistics.

## Decision trace
| Decision | Traces to |
|---|---|
| All routes and persisted state | paired brief |
| Price, weight, flavour beside each tea | Teabox content finding |
| Monthly terms before plan choice | Art of Tea content finding |
| Paper surface and specimen captions | client direction and Kew collection description |
| Native accessible form controls | static constraint; skill platform-first rule |
| Type mode | HOUSE STYLE on home and stories; SERVICE STYLE on filters, checkout and account, so tasks remain compact |
| H-one-accent adapted | B origin colours encode origin and are a requested brand system, not incidental accents |
| H-focal adapted | product screens use title → controls → items → price reading order instead of one dramatic focal point |

## Typography
Display: Fraunces 400 for an organic, bookish register. Body: DM Sans 400–700 for clear controls. Mono: system monospace for A's folio labels only. Font display swap; no more than one preload.
Hero clamp 48–88px; task titles 36–58px; h2 28–44px. Body 16–18px; labels minimum 12px; prices tabular.

## Colour
Ground #f4f0e6; ink #263d32; muted #526052; paper #e9e5d8; green #294d3d; accent rust #8a422c for small folio notation.
Selected token pairs actually measured by scripts/contrast.mjs:

```text
#263d32 on #f4f0e6: 10.27:1  body PASS · large PASS · AAA PASS

#526052 on #e9e5d8: 5.28:1  body PASS · large PASS · AAA —

#f4f0e6 on #294d3d: 8.30:1  body PASS · large PASS · AAA PASS

#8a422c on #f4f0e6: 6.37:1  body PASS · large PASS · AAA —
```

Rendered-element pixel contrast is not verified by these token calculations.

## Layout
1248px folio, 40–64px margins, fine ruled sections, sidebar catalogue, 3-part detail and ruled form docket.
Mobile 20px gutters, one-column or carefully sized two-column product grid; 44px minimum main controls. Desktop content and mobile content share the contract, not forced identical placement.

## Components
Build original static product tiles, folio/pack imagery, cart views and plan layouts because these are the direction's expression. Adopt platform native select, checkbox, radio, details and input primitives rather than rebuilding keyboard patterns. Share storage/validation only.

## Imagery
Original custom SVG botanical illustrations for A; original custom SVG pack illustrations for B. Explicitly illustrative, not alleged product photographs. MEDIA.md inventories fonts, SVGs and QA screenshots.

## Restraint Gate record
- Concept survived: yes
- Cut: fake review strip; fails Q1 and Q2, no supplied evidence.
- Cut: repeated sustainability claims; fails Q1 and Q2, not supplied by brief.
- Rejected animation: ambient leaf or pack loop; no information and persistent distraction.
- Rejected animation: scroll pin before catalogue; blocks task.
- Kept: botanical marginal numbering; passes Q2 because the brief specifically requests quiet archival character.
