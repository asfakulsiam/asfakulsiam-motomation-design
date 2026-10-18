# The product contract (Step 1, before any art direction)

The product contract records what the product must let people do, independent of how it looks. It is written and approved (Checkpoint 2) before research for the concept begins, so that no art direction can silently redefine the product. It sits at authority level 4 (`principles/authority.md`): only the user, or a higher-level constraint, changes it.

**Preserve the ideal product; innovate in how it is expressed.**

## What it records

Write it in `DESIGN.md` under `## Product contract`, then derive the Scope table from it (`thinking/sequence.md`, Step 1).

| Field | Answer |
|---|---|
| **Product** | what is being built and why, in one or two lines; the exact subtype (a luxury boutique is not a grocery store, though both sell things) |
| **Audience** | who uses it, their context (device, connection, expertise, accessibility needs), how often they return |
| **Jobs** | what users need to accomplish, in their words, ordered by importance |
| **Business model** | how it makes money or delivers value, and what that demands of the site (conversion, retention, trust, lead capture, compliance) |
| **Core journeys** | the essential paths, each as a route sequence: `Home → Category → Product → Cart → Checkout → Confirmation` |
| **Information architecture** | navigation model (top nav, mega-menu, sidebar, tabs, search-first), route families, how deep it goes |
| **Content and density** | what content each route family carries and how dense it is (a procurement table vs a lookbook); data relationships |
| **Essential interactions and states** | search, filters, compare, saved items, forms, auth-dependent views; empty, loading, error, success |
| **Responsive expectations** | what changes on mobile, tablet and desktop: what collapses, what becomes a sheet, what must stay one tap away |
| **Constraints** | stack, existing architecture, dependencies, content availability, region and regulation, performance and bandwidth |
| **Explicit exclusions** | what is out, each with its reason and who decided (the user, or a proposal awaiting approval) |
| **Success criteria** | how the user will judge it, when stated |

Questions the brief doesn't answer: answer them from type research (Step 1 includes a short look at real products of this exact type, `craft/research.md` → Type research) and mark the answer as an assumption. A consequential ambiguity (it changes routes or journeys) is asked at Checkpoint 2; a minor one is assumed and stated. Never fill a gap with a design idea.

## Capability levels: what "has checkout" means

A capability can exist at five levels. The contract names the level each one ships at; the gap between them is never hidden.

| Level | Means | Example (checkout) |
|---|---|---|
| `interface` | the screen and its states exist and are designed | the checkout page with address, delivery and payment-method UI, validation and error states |
| `interaction` | it works in the browser on demo data | choosing a payment method updates the summary; submitting shows the pending and confirmation states |
| `persisted` | state survives a reload (local storage, URL, a mock API) | the cart is still there after refresh |
| `backend` | a real server capability | orders are written to a database |
| `integration` | a real third-party service | a payment provider charges a card |

Rules:

1. **Deferring a backend never removes the interface.** Deferring payment-provider integration does not justify omitting the payment-selection UI; deferring auth infrastructure does not justify omitting sign-in and registration screens. The Scope row for a deferred backend or integration names the interface that still ships: `not required for this brief, reason: payment provider deferred; interface: /checkout`. `scripts/completeness.mjs` fails a deferral that cites a backend or integration and names no interface.
2. **Never present a nonfunctional control as working.** A control that only exists at `interface` level is labelled (`Demo: payments are not processed`) or disabled with an explanation. A "Pay now" that silently does nothing is a defect.
3. **Delivery mode sets the floor.** Design exploration ships `interface` for every required journey; functional frontend ships `interaction` (and `persisted` where users expect it, such as a cart); production template ships what `templates/TEMPLATE.md` lists. A higher level is never claimed without evidence.
4. **A form says what it really did.** See Forms and operations below.

## Forms and operations: honest success states (v3.0.2)

A frontend prototype may simulate a flow. It may not pretend. Every submit is one of four operations, and its wording matches the one it is:

| Operation | Capability level | Declare on the `<form>` (optional) | What the user sees on a valid submit | What the gate checks (axis J forms) |
|---|---|---|---|---|
| **Server-backed** | `backend`, `integration` | `data-capability="backend"` | pending while the request is out, then success after the server answers, or the error it returned | default, validation, loading, success, server error (the request is held, answered 200, answered 500), and **duplicate**: a second submit while the first request is pending sends nothing |
| **Browser-only** | `persisted` | `data-capability="persisted"` | "Saved in this browser", "Saved. Your plan is paused": what was saved, and where | default, validation, feedback, **persisted** (something was written to localStorage, sessionStorage, cookies or IndexedDB, and it is still there after a reload), **honest** |
| **Simulated** | `interaction` | `data-capability="interaction"` | the outcome, labelled: "Demo: nothing was sent", "Prototype: no payment is taken" | default, validation, feedback, **honest** (a disclosure is visible) |
| **Unavailable** | `interface` | `data-capability="interface"` | why it cannot be used yet, and what to do instead: "Online booking is not available yet. Call the front desk." | **honest**: no success wording, and the unavailability is stated |

Rules:

1. **Never say it happened when it did not.** No "sent", "received", "registered", "booked", "order placed", "payment processed", "we'll be in touch" or "a specialist will contact you" unless a request carried it, or the same message says it did not happen ("Demo only: nothing was sent"). `scripts/journey.mjs` (`CLAIM_RX`, `DISCLOSE_RX`) fails a form that makes no request, saves nothing, discloses nothing and still claims success. Denials ("nothing was booked") are not claims. The word "demo" alone is not a disclosure: a site that sells demos ("Schedule Demo", "your demo instance") must still say what happened to the request.
2. **Not every interaction needs a request.** A browser-only save or a labelled simulation passes on its own states. The request states (loading, success, server error) apply only to server-backed forms. Without a declaration, the gate reads the operation from behaviour: a storage write is browser-only, a disclosure is simulated, an unavailability notice is unavailable.
3. **No artificial latency.** A pending state shows real work: a request, a heavy computation. A `setTimeout` that fakes a server's delay ("Transmitting inquiry…" for 400 ms, then success) is theatre: show the outcome at once, or send the request. A simulated step that does show a short pending state must also be labelled ("Creating demo receipt…").
4. **A flow page reached by a form** (a confirmation, a receipt) is written for what really happened: "Request saved in this browser. Demo only: nothing was sent", not "Our team will contact you within 24 hours". It is `noindex`, and stays out of `sitemap.xml` (or declares `<meta name="motomation:entry" content="flow">`). A page shared by direct link only declares `content="deep-link"`.
5. **The handoff lists every browser-only, simulated and unavailable operation** (`scripts/handoff.mjs` prints them as prototype boundaries). They are the honest edge of the prototype, not defects, as long as the interface says so.

## The contract vs the concept

- The concept may **reorganise** presentation: merge two routes into one scrolling page, turn a filter sidebar into a sheet, tell the brand story through the catalogue.
- The concept may **not** remove a required journey, bury an essential function more than one interaction deeper than the contract allows, or turn a required interface into decoration.
- The agent may **recommend** a scope change at any checkpoint ("this boutique doesn't need faceted search; 40 products, browse by collection"). The recommendation is shown, reasoned and approved by the user, or it doesn't happen. Never invent approval.

## Test

Before any concept work: does `DESIGN.md` have a `Product contract` with jobs, at least one core journey written as a route sequence, the IA model, density, responsive expectations and exclusions with reasons? Is every deferred backend paired with the interface that still ships? If not, research for the concept doesn't start.
