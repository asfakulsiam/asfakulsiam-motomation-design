# DESIGN.md: Ledgerly

## Stack
- Stack: native HTML/CSS/JavaScript, Node 20 static server.
- Source: builder choice under benchmark pre-approval.
- Reason: browser-only persistence and no installs; static route files support every required URL without a framework runtime. Next default deliberately yields to minimal local prototype architecture.
- Adapter: adapters/vanilla.md read. No GSAP/Lenis needed.
- Conflicts: explicit localStorage requirement overrides generic website skill's backend-storage default; explicit no publishing/deployment overrides its preview deployment requirement.

## Dependencies
No application dependencies. Node built-ins for serving/building; preinstalled Playwright only for tests and the skill's real validation. DM Sans is an asset under OFL, not executable code. No package installs.

## Product contract
Approved at Checkpoint 2 before direction implementation; see CHECKPOINTS.md and thinking/product-contract.md.
- Product: fictional small-shop finance workspace, signed-in app rather than marketing.
- Audience: owner-operators returning daily, desktop and 375px touch, variable bookkeeping expertise.
- Jobs: see today's position, record an expense, prepare and mark an invoice sent, retrieve a past transaction.
- Business model: value from daily financial clarity; pricing/subscription management not specified.
- **Core journeys:**
  - `/sign-in → /dashboard → /expenses/new → /expenses/saved → /dashboard`
  - `/dashboard → /invoices → /invoices/new → /invoices/preview → /invoices/sent`
  - `/dashboard → /transactions → /transactions/detail`
- IA: fixed desktop rail, main overview / transactions / invoices / customers / settings; standalone demo sign-in; task detail depth two.
- Density: high tables, medium forms, compact summaries, tabular figures.
- States: field errors, save success and storage-write failure, empty filters/account, offline local work, unreadable storage, missing route, invoice draft/sent/paid/overdue.
- Responsive: mobile five-item visible nav, one-column forms, semantic table transformed to labelled records, visible mobile sort select; tablet collapses secondary panels first. No required action is hover-only.
- Constraints: localStorage, no actual bank/email/auth integration, no purchases/publishing/push.
- Exclusions: public marketing/legal/admin, payments and real authentication deliberately outside this local fictional frontend.
- Success: complete the three core journeys at 375px and 1440px; honest deferred interfaces; actual skill validation and screenshots.
- Assumptions: USD, fixed sample reference date October 19 2026, fictional shop Juniper Supply; every visible sample number derives from the marked demo ledger.

## Scope
**Site type:** signed-in small-business finance dashboard; local fictional evaluation, no launch region.
**Admin panel:** no, owner workspace only.
**Delivery mode:** functional frontend

| Kind | Item | Mark | Evidence | Level |
|---|---|---|---|---|
| route | /sign-in | requested | | persisted |
| route | /dashboard | requested | | persisted |
| route | /transactions | requested | | persisted |
| route | /transactions/detail | requested | | persisted |
| route | /expenses/new | requested | | persisted |
| route | /expenses/saved | requested | | persisted |
| route | /invoices | requested | | persisted |
| route | /invoices/new | requested | | persisted |
| route | /invoices/preview | requested | | persisted |
| route | /invoices/sent | required | | persisted |
| route | /customers | requested | | persisted |
| route | /settings | requested | | persisted |
| route | /empty | requested | | interaction |
| route | /error | requested | | interaction |
| route | /offline | requested | | interaction |
| route | /404 | requested | | interface |
| journey | Record expense | requested | /sign-in → /dashboard → /expenses/new → /expenses/saved → /dashboard | persisted |
| journey | Invoice lifecycle | requested | /dashboard → /invoices → /invoices/new → /invoices/preview → /invoices/sent | persisted |
| journey | Find transaction | requested | /dashboard → /transactions → /transactions/detail | persisted |
| function | Date/category filters, sorting and pagination | requested | src/app.js#drawResults | persisted |
| function | Profile business notifications | requested | src/app.js#settings | persisted |
| function | Customer create and edit | required | src/app.js#customerDialog | persisted |
| function | Local persistence and export | requested | src/app.js#localStorage.setItem | persisted |
| function | Authentication backend | not required for this brief, reason: explicitly deferred; interface: /sign-in | | backend |
| function | Bank sync | not required for this brief, reason: explicitly deferred; interface: /settings | | integration |
| function | Email delivery | not required for this brief, reason: local mark-sent only; interface: /invoices/preview | | integration |
| state | Local write and read errors | required | src/app.js#Your changes could not be saved | interaction |
| state | New-account empty state | requested | src/app.js#Start empty workspace | persisted |
| state | Offline notice | requested | src/app.js#offline-banner | interaction |
| state | Button disabled validation success | required | src/styles.css#aria-invalid | interface |
| edge | Due date before issue and invalid amounts | required | src/app.js#Due date must be | interaction |
| skeleton | Async lists | not required for this brief, reason: synchronous local data without fetch or XHR | | interface |
| legal | Public policies | not required for this brief, reason: no public marketing service or real data collection | | interface |
| admin | Admin surface | not required for this brief, reason: single local owner workspace not a hosted SaaS platform | | interface |
| template | README.md | required | README.md | interface |
| template | MOTION.md | required | MOTION.md | interface |
| template | MEDIA.md | required | MEDIA.md | interface |
| template | SCHEMA.md | required | SCHEMA.md | interface |
| template | DATA.md | required | DATA.md | interface |
| template | Middleware and environment setup | not required for this brief, reason: no backend framework or secret configuration; Node static server sends headers | | interface |
| template | data/ | required | data/ | interface |
| template | data/schema.json | required | data/schema.json | interface |

## Type research
| Site | Type | Routes | Functionality | States | Admin | Legal | Notes |
|---|---|---|---|---|---|---|---|
| Wave, https://support.waveapps.com/hc/en-us/articles/25233855417492-Filter-and-sort-your-transactions | Small-business finance | Transactions (docs observed); live route unverified | Category/date/search/sort documented | Filtered result states inferred | Unverified | Unverified | Full mobile filter capability retained in Ledgerly rather than Wave's documented limitation. |
| Xero, https://www.xero.com/ae/accounting-software/dashboard/ | Small-business finance | Dashboard described, signed-in route unverified | Cash flow, bills, invoice amounts described | Empty/offline unverified | Unverified | Unverified | Outstanding invoice emphasis, no fake bank balance. |
| Namtech, https://namtech.sg/work/this-accounting-revolution/ | Mobile accounting | Dashboard and settings described, not live observed | Financial summary and reports described | Unverified | Unverified | Unverified | Adjacent mobile case study; warm surfaces without copying app composition. |

Gaps: no authenticated competitor journeys, mobile screenshots or animation were inspected. Assumptions come from this benchmark contract, not claims of observed product behavior.

## Research record
Access: web searched and pages fetched 2026-10-19. Full questions, evidence, source URLs, intended use and limitations: craft/research.md.
Questions: retrieving old transactions; priority of owner metrics; warmth versus data density; native accessible primitives.

| Source (name, URL) | Kind | Observation | Intended use | Limitation |
|---|---|---|---|---|
| Wave, https://support.waveapps.com/hc/en-us/articles/25233855417492-Filter-and-sort-your-transactions | Official help | Category/date filters and description search documented | Visible, clearable table filters on desktop and mobile | Not signed-in visual evidence |
| Carbon, https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines | Design system | Table toolbar, sorting headers, bottom pagination | Single attached pagination footer and stable header rhythm | Native implementation, not imported component |
| Namtech, https://namtech.sg/work/this-accounting-revolution/ | Case study | Warm cream, calm financial hierarchy described | Warm shell with distinct high-contrast forest/orange system | Studio narrative, outcomes not independently verified |
| Wave, https://www.waveapps.com/blog/full-invoicing-cycle | Product article, search excerpt | Preview feature before sending | Separate invoice editor/preview | Live email integration deliberately excluded |

Techniques considered: native dialog/select/date adopted; CSS press feedback used; external UI library not installed because native primitives solve this scope. Scroll transitions/WebGL rejected for daily entry tasks. Pattern avoided: cinematic hero or large editorial section inside the app.

## Directions
| | A Warm working ledger | B Dark register terminal | C Daily inbox |
|---|---|---|---|
| Idea | Keep the books as approachable as the shop | Operator console for every record | One task at a time |
| Structure | Stable sidebar, summary and ledger, explicit form pages | Commands plus dense table | Task cards ahead of lists |
| Type/motion | Service sans, instant states | Monospace, cursor hints | Service labels, step transitions |
| Journeys | Direct discovery, low learning cost | Preserved but mobile commands hurt | Preserved but old-record search slower |
| Contract comparison | Strong warmth, access, touch, technical simplicity, own identity | Distinct but specialist, less approachable | Touch friendly but wrong repeated-work density |

Chosen A. Full comparison in craft/research.md. No archetype or signature; the system's calm repetition is its identity.

## Divergence
- No log in the isolated benchmark project: first build, no earlier local comparison.
- Similarity in SERVICE STYLE, semantic tables and conventional navigation is justified by the contract.
- AI-default scan: no gradients, no blobs, no hero, no icon-feature trio, no oversized dashboard typography. Discrete panels are needed to compare separate financial datasets; they are not a marketing bento.
- O: not verified, no earlier independent build supplied for comparison.

## Decision trace
| Decision | Traces to |
|---|---|
| Stable app rail and required routes | Brief required route inventory |
| Visible date/category controls | Wave documented retrieval workflow |
| Bottom pagination, sorting headers | Carbon data-table guidelines |
| Warm surfaces | Brief warmth pressure, Namtech case-study principle |
| Forest cash-in, ochre cash-out, dark orange actions | Semantic financial coding plus distinct local palette, contrast floor |
| DM Sans compact information UI | Brief dense tables/forms; Google Fonts/OFL asset evidence |
| No signature, hero or scroll choreography | Brief bias probe and daily entry speed |
| Native primitives / custom ledger | Contract browser-only capability and no-install constraint |
| H-focal adapted | Dense product has title/controls/results reading order, not a single marketing focal point |
| H-grid-break ignored | Tables need stable aligned columns, not expressive broken grids |

## Concept
- Tension: dense bookkeeping information versus an owner's need for warmth and quick entry.
- Concept sentence: A working ledger that feels as approachable as your neighborhood shop.
- Structure: contract-derived app shell, no archetype.
- Exploration tools: collision/mutation/category recipe rejected; outside product docs and platform primitives used.
- Signature: none, identity from warm neutral system, forest ink, modest type and row rhythm.
- Dials: ENERGY 1, RHYTHM 1, MOTION 1, Tier 1 throughout.
- Rejected: cold terminal, guided story, fake bank balance, real-sign-in theatre.

## Typography
SERVICE STYLE across app. DM Sans regular/bold is locally hosted, chosen for legible low-contrast compact reading. Georgia is a small wordmark/sign-in accent, not a typographic hero.
Body/forms 16px; dense controls/rows 12–15px; secondary captions 10–12px initially, with any measured issues recorded and corrected before final delivery. Headings 16–28px, KPI 26–29px. Tabular figures. Dense caption exceptions are not a claim of universal body-size compliance.

## Colour
Ground #f5f3ed; surface #ffffff; ink #232b25; muted #596157; forest #294b3e; action #9b4229; line #dedfd5; semantic cash-out #c58c62. All text uses solid color, not opacity. Real contrast commands and gate measurements are authoritative, not estimated ratios.

## Layout
224px desktop rail, 38px main gutters, 22–24px panel gaps, 8px-derived internal rhythm. Summary → cash/position → recent/radar. No marketing footer. 375px uses 20px gutters, five visible nav destinations, stacked panels/forms and labelled transaction records. 320px uses 14px gutters. Full required sorting is available through an explicitly labelled select on mobile.

## Components
Adopt: native input, select, date, dialog, button, anchor, table primitives. Build: shared shell, local storage adapter, cash-flow chart, filter/pagination controller, invoice editor, status views. Reuse these across all routes. Native dialog supplies focus trapping/Escape instead of a custom overlay.

### Review refinements
Final integrity review additionally made the amount sort use the signed amount displayed to the owner (expense negatives before income positives), derives the business monogram from the saved name, and prevents sign-in from overwriting unreadable stored data before recovery. These are state/data consistency fixes, not a new design direction.
The cash-flow disclosure explicitly uses display:none on its table while closed, in addition to native details behavior. This keeps closed-table layout/visibility consistent across browser pixel checks; opening the disclosure retains the real semantic table and black-on-white system colors under forced colors.
Rendered review prompted a 12px caption floor, corrected-field validation cleanup, and clipped-until-focused keyboard skip navigation so full-page captures do not expose an offscreen link. At 320px, the navigation wraps into three columns; 375px retains the compact five destinations. Same-origin links use a small History API router with native direct-entry fallbacks, making already-loaded offline expense saves genuinely navigable and preserving transaction filters on detail return. Cold offline starts/reloads remain unsupported and are explicitly explained in the offline interface. Active forms are blocked after a cross-tab update until reload rather than silently overwriting newer records.

## Imagery
No photography/video required by an accounting workspace. Original inline SVG utility icons and data-derived bars; local font files, original share card. MEDIA.md has provenance.

## Restraint Gate record
- Concept survived: yes
- Cut: decorative greeting hero, fails both usefulness and daily workspace identity.
- Cut: bank balance card, no source of bank truth in this frontend.
- Cut: receipt upload box, no requested receipt-persistence capability and unnecessary form distraction.
- Cut: oversized side-rail word art, consumes task space without a product purpose.
- Kept: calm serif wordmark, brief warmth pressure gives a small brand cue without slowing a task.
- Rejected animation: chart count-up, hides actual financial numbers before settling.
- Rejected animation: route entrance delays, violates immediate repeated data entry.
- Rejected animation: scroll choreography, wrong for signed-in finance task surfaces.
