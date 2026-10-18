// Benchmark planning record. Generates only the two user-authorized output folders.
import {writeFileSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve(import.meta.dirname,'..');
const routes=['/','/shop','/tea/sylhet-black','/tea/assam-gold','/tea/ilam-green','/tea/darjeeling-first','/tea/nepal-white','/tea/bangladesh-green','/subscriptions','/subscriptions/build','/cart','/checkout','/confirmation','/account','/account/subscription','/estates','/brewing-guide','/shipping','/returns','/privacy','/terms','/contact','/404'];
const record=`
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
`;
for(const [folder,title,isB] of [['a-archival','Quiet archival',false],['b-poster','Loud poster',true]]){
 const root=resolve(base,folder); mkdirSync(root,{recursive:true});
 const direction=isB?'Origin on the wall':'A living tea ledger';
 const scope=routes.map(r=>`| ${['/shipping','/returns','/privacy','/terms'].includes(r)?'legal':'route'} | ${r} | requested | | interface |`).join('\n');
 writeFileSync(resolve(root,'DESIGN.md'),`# Leaf & Ledger · ${title}

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
  - On management, choose pause or skip, then save; status changes on the same route.
- **IA:** persistent Shop, Subscriptions, Estates, Account and Cart; footer contains brewing and policies. Tea detail is one step below shop; management one step below account.
- **Density:** medium catalogue and detail; compact checkout and management; generous but task-first marketing and estate stories.
- **States:** all selections and cart changes immediate; empty cart, no matching teas, invalid form, storage unavailable, saved subscription, pending save and demo confirmation. No simulated server success. Unknown routes return designed 404 with HTTP 404.
- **Responsive:** 375px single-column forms; filters remain visible; cart remains directly accessible; 768px intermediate grid; 1440px composed panels with a stable reading order. 320px reflow and 200% viewport checked in lightweight QA.
- **Constraints:** static frontend, localStorage persistence only, no packages, ports ${isB?'4312':'4311'} only for our preview server, shared two-CPU machine.
- **Exclusions:** real payment, identity verification, email delivery and order fulfillment; interfaces still ship and explicitly say demo. No admin panel because no backend exists.
- **Assumptions:** demonstration US shipping, flat $5 one-off shipping, subscription shipping included, two and three pouches at $24/$34 monthly; fiction disclosed on every page. Six named demo estate lots to support filters.
- **Success:** all core journeys complete at 375 and 1440, route parity, working persistence and no misleading controls.

## Scope
**Site type:** single-estate tea ecommerce, fictional US demo.
**Admin panel:** no (local demo, no staff data or backend).
**Delivery mode:** functional frontend

| Kind | Item | Mark | Evidence | Level |
|---|---|---|---|---|
${scope}
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

${record}

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

**Chosen for this folder:** ${isB?'B':'A'}, mandated by the paired client art direction; C rejected for weak identity. No template or theme swap. Separate page markup, section order, component structure, type, grids, illustration and motion. Shared state, product data, form fields, validation messages and accessibility primitives only.
**Comparison:** pair.mjs output will be appended after actual execution. No claim before execution.

## Concept
- **Tension:** single-estate tea rewards reading, but buying and managing it must be immediate.
- **Concept sentence:** ${isB?'Put each origin on a bold poster, with the next purchase step printed right on it.':'Open a living tea ledger where every specimen can become the next cup.'}
- **Structure:** derived from contract; archival folio vocabulary in A and poster bands in B, not a recipe replacing the shop.
- **Signature:** ${isB?'origin poster-to-product continuity':'numbered botanical folio'}.
- **Dials:** ENERGY ${isB?3:1}, RHYTHM ${isB?3:2}, MOTION ${isB?2:1}; Tier ${isB?3:1}. Task UI feedback stays Tier 1.
- **Tools:** archetype adapted only as archival caption vocabulary in A; no archetype dictates IA. Collision/mutation rejected because directions are explicit. Component dataset search attempted but script has no components dataset; native platform primitives chosen. No external component library.
- **Not doing:** ${isB?'long animated prelude, scrolling marquee or enormous checkout titles':'hidden cart, fake handwritten history or magazine-only shopping'}.

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
| ${isB?'Origin-specific saturated surfaces':'Paper surface and specimen captions'} | client direction and ${isB?'BP&O packaging case study':'Kew collection description'} |
| Native accessible form controls | static constraint; skill platform-first rule |
| Type mode | HOUSE STYLE on home and stories; SERVICE STYLE on filters, checkout and account, so tasks remain compact |
| H-one-accent adapted | B origin colours encode origin and are a requested brand system, not incidental accents |
| H-focal adapted | product screens use title → controls → items → price reading order instead of one dramatic focal point |

## Typography
Display: ${isB?'Barlow Condensed 800 for screen-printed poster rhythm':'Fraunces 400 for an organic, bookish register'}. Body: DM Sans 400–700 for clear controls. Mono: system monospace for A's folio labels only. Font display swap; no more than one preload.
${isB?'Hero clamp 62–150px; h1 task clamp 36–68px; h2 30–54px.':'Hero clamp 48–88px; task titles 36–58px; h2 28–44px.'} Body 16–18px; labels minimum 12px; prices tabular.

## Colour
${isB?'Ground #f5f0df; ink #18241e; Bangladesh #a8d84f; India #ff8259; Nepal #c3b5ed; hero #f5dd4a. All saturated colours carry origin or poster identity.':'Ground #f4f0e6; ink #263d32; muted #526052; paper #e9e5d8; green #294d3d; accent rust #8a422c for small folio notation.'}
Contrast ratios to be measured using contrast.mjs, not inferred.

## Layout
${isB?'Full-width bands, strong 2px rules, asymmetrical hero type/pack overlap, 3-column shop, banded operational screens.':'1248px folio, 40–64px margins, fine ruled sections, sidebar catalogue, 3-part detail and ruled form docket.'}
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
- Kept: ${isB?'large origin type':'botanical marginal numbering'}; passes Q2 because the brief specifically requests ${isB?'loud poster':'quiet archival'} character.
`);
 writeFileSync(resolve(root,'CHECKPOINTS.md'),`# Leaf & Ledger · ${title} · checkpoints

Benchmark instruction authorizes self-approval; no human reviewer is present.

## Checkpoint 1 of 6: Stack
MOTOMATION PLAN
Rules: gates/rules.md read; designing within it.
Stack: static HTML/CSS/vanilla JS, Node 20 static server, named by brief → adapters/vanilla.md.
Alternatives: Next.js default rejected because user forbids installs; a client-only SPA rejected because real static routes simplify 404 and route discovery.
Would ask: approve, redirect, or ask for alternatives?
Self-approved 2026-10-18 before product contract.

## Checkpoint 2 of 6: Product contract
Would show: DESIGN.md Product contract and Scope, all 23 routes, three core journeys, persistent cart, builder and pause/skip. No admin.
Deferred: payments with /checkout interface; auth with /account demo; mail with /contact local acknowledgement.
Would ask: approve scope, routes, assumptions and explicit backend deferrals?
Self-approved 2026-10-18 before concept. No contract items removed.

## Checkpoint 3 of 6: Research and direction
Would show: DESIGN.md research record, three product references, case-study and botanical references, limitations, comparison of three directions.
Tension: rich provenance versus immediate purchase.
Concept: ${direction}.
Direction: ${isB?'B, mandated poster with origin colour and pack continuity':'A, mandated archive with specimen folio'}.
Dials: ${isB?'3 / 3 / 2, Tier 3':'1 / 2 / 1, Tier 1'}.
Type mode: HOUSE on marketing, SERVICE on operations; ${isB?'Barlow Condensed':'Fraunces'} / DM Sans.
Would ask: approve synthesis, or redirect within the given direction?
Self-approved 2026-10-18. C rejected because it loses brand specificity; other mandated direction delivered separately.

## Checkpoint 4 of 6: Build plan
Would show: MOTION.md; static routes; shared state/validation but separately authored HTML/CSS.
Home: ${isB?'poster offer, pack fan, three origin links, subscription band':'opening folio, botanical plate, tea ledger, subscription note'}.
Shop: ${isB?'black filter band and origin-coded tiles':'left filter rail and specimen grid'}; mobile stacked controls before results.
Detail: ${isB?'colour pack stage then purchase panel and tasting strip':'specimen, tea notes and purchase docket'}.
Plans: ${isB?'two horizontal comparison bands':'two ruled plan columns'} → builder with visible count and summary.
Cart/checkout/confirmation: ${isB?'full-width headings, bands and receipt strip':'compact docket and right summary'}; mobile form follows total with no obscured controls.
Account/management: ${isB?'status poster and grouped action slab':'account ledger and ruled change form'}; pause/skip use explicit save.
Stories/legal/contact/404: complete content and navigation in each direction.
Motion: ${isB?'Tier 3 shared-element page continuity plus short pack settle':'Tier 1 ink/focus/press feedback'}; reduced-motion still retains complete interface.
Would ask: approve route-by-route build and mobile treatment?
Self-approved 2026-10-18 before implementation.
`);
 writeFileSync(resolve(root,'MOTION.md'),`# Leaf & Ledger · ${title} · motion

## Selection and purpose
Tier ${isB?'3 on marketing and product navigation; Tier 1 on checkout/account':'1 throughout'}.
No animation is required to use any route. Native scrolling, no pinned zones, no canvas, no loop.

| Behaviour | Where | Meaning | Technique and timing | Edges |
|---|---|---|---|---|
| ${isB?'Poster continuity':'Ink response'} | ${isB?'between same-origin documents':'links and main buttons'} | ${isB?'tea image remains recognizable between shelf and detail':'which element is actionable'} | ${isB?'cross-document View Transitions, 420ms ease-out':'CSS opacity 160ms ease-out'} | Unsupported browsers navigate normally; reduced motion instant |
| Press | all buttons | acknowledges touch | transform scale(${isB?'.97':'.99'}), 100ms | hit area fixed; reset on release |
| ${isB?'Pack settle':'Focus ink'} | ${isB?'home hero and product tiles':'keyboard focus'} | ${isB?'playful printed identity':'current control'} | ${isB?'one-off rotate/translate, 520ms ease-out':'instant 3px outline'} | ${isB?'not looped; reduced still arranges three packs upright':'no motion'} |
| Save feedback | builder, cart, management | confirms state change | text in live region, instant then 120ms fade optional | blocked storage shows error, no success claim |
| Pending | local form submit | prevents duplicate operation | disabled button with explicit saving text, one frame | failure re-enables control; no network success implied |

## Four questions
Every motion has feedback, continuity or brand-feeling purpose; CSS is the cheapest tool; UI feedback stays below 250ms; fast repeated actions remain possible. No scroll effects or layout-property animation. Form content is never hidden.

## Reduced-motion design
${isB?'Pack fan becomes three aligned printed origin swatches, all visible with origin labels; no rotation, travel or page transitions. This is a composed origin index, not a paused settle frame.':'Everything remains in natural document flow. No entrance obscures text; focus is instantaneous.'}
@media (prefers-reduced-motion: reduce) disables all animation and travel; page transitions are opt-in only under no-preference.

## Mobile
No pointer-follow effect. Full controls remain visible; hover feedback is optional and only enabled on fine pointers. 375px product stage reduces pack scale while preserving readable text outside the illustration.

## Verification boundary
Screenshots and a reduced-motion check are planned; full motion smoothness gate and CPU-throttled benchmark intentionally not run under user's CPU constraint. No performance score claimed.
`);
 writeFileSync(resolve(root,'SCHEMA.md'),`# Leaf & Ledger · frontend schema

## Entities
Tea: id string; slug string; name string; estate string; origin enum Bangladesh/India/Nepal; type enum Black/Green/White; caffeine enum Moderate/Low; notes string; price integer USD; weight 50g; brew temperature and minutes; demo true.
CartLine: id string; kind tea/subscription; quantity integer 1–10; teaId or plan id and teaIds. Prices resolved from catalogue, never trusted from stored price.
Plan: duo (2 × 50g, $24 monthly) or trio (3 × 50g, $34 monthly); exact distinct teas required; recurring monthly, no minimum.
Draft: plan and selected tea IDs persisted locally. Subscription: plan, tea IDs, status active/paused, skipped boolean; display next delivery relative to today. Receipt: local unique reference, lines, total, created timestamp; demo true; no personal address/email stored.
Contact form data: name, email, message, never transmitted or persisted.

## Routes
${routes.join(', ')}

## States
Cart empty / filled; no-match filters; builder incomplete / ready / pending / saved / storage error; checkout invalid / pending / demo confirmation / storage error; management active / paused / skipped / pending / saved / storage error; contact default / validation error / pending / local acknowledgement. Products are already rendered HTML, so no artificial list loading. Images reserve intrinsic size and use on-error illustration text fallback. Buttons have hover/focus/active/disabled/pending states.
Storage unavailable: alert explains changes cannot be saved, operation stays retryable. Malformed stored records are discarded with a recovery message. No server-error pretence: no backend exists. Error states describe local failures.

## Persistence and validation
localStorage keys ll-cart-v1, ll-draft-v1, ll-subscription-v1, ll-receipt-v1. Validate schema on every read; malformed data defaults safely. No auth token or PII stored. Plan selections exact; quantity integer clamped 1–10; all required form fields checked using native validity with visible error region.

## API and handoff
No API. Before real launch implement GET /teas, POST /checkout, signed payment confirmation, authenticated GET/PATCH /subscription, POST /contact with server validation and rate limits. Replace all fictional records, policies and prices. Payment card fields are disabled and labelled; demo order button never charges.
`);
 writeFileSync(resolve(root,'DATA.md'),`# Leaf & Ledger · ${title} · data

data/teas.json contains six demo-labelled tea records. data/schema.json describes the tea record. Both directions use identical product contract data; layout is not shared. No inventory, rating, customer or real estate sourcing claim is made.
Products and prices are fictional; currency USD. Checkout, receipt and management are browser-only demonstrations.
`);
 writeFileSync(resolve(root,'README.md'),`# Leaf & Ledger · ${title}

Functional static frontend for a fictional single-estate tea store.

All data in data/ is demo. Replace with real data before launch.

## Run
\`node server.mjs\` serves http://localhost:${isB?'4312':'4311'} with a real HTTP 404 for unknown routes. No package install or build is required. Stop with Ctrl+C.

## Real and demo
All routes, filters, cart, plan builder, client validation, local receipt, and subscription changes work in the browser. localStorage persists cart, builder and subscription. Payments, shipping, authentication and email are not integrated. Account is explicitly a demo; contact only acknowledges locally. Do not enter real payment or personal details.

## Files
DESIGN.md contains contract, scope, research and direction. MOTION.md, SCHEMA.md, DATA.md, MEDIA.md, CHECKPOINTS.md, GATE.md, CRITIQUE.md, RUN.md and qa/ hold the handoff and evidence. screens/ contains journey screenshots.

## Media and readiness
See MEDIA.md for original illustrations and font licences. No external image rights are assumed. This is not production-ready: fictional catalogue, policies and estate stories require replacement and review; real payments, authentication and fulfillment must be implemented.

## Deployment
Serve the folder with a static host that supports extensionless HTML routes and a 404.html error response; apply _headers. Canonicals currently reference the required localhost preview origin; replace them and sitemap.xml with the production origin before launch.
`);
 writeFileSync(resolve(root,'GATE.md'),`# Leaf & Ledger · ${title} · gate\n\n## Measured\nPending actual requested checks. No full-gate stamp claimed.\n\n## Judged\nReview follows lightweight browser QA.\n\n## Not verified\nFull gate and gate --journey prohibited by benchmark. Real payments, mail, authentication and fulfillment are not implemented.\n`);
 writeFileSync(resolve(root,'CRITIQUE.md'),`# Leaf & Ledger · ${title} · critique\n\n## Measured\nNo numeric critique score: full gate not run under benchmark constraint.\n\n## Judged\nReview pending actual screenshots.\n\n## Not verified\nAward-level quality not asserted. Full accessibility, motion frame-time and field performance measurement not performed.\n`);
}
console.log('Planning records written to the two authorized output folders.');
