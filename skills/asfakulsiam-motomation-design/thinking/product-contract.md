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

## The contract vs the concept

- The concept may **reorganise** presentation: merge two routes into one scrolling page, turn a filter sidebar into a sheet, tell the brand story through the catalogue.
- The concept may **not** remove a required journey, bury an essential function more than one interaction deeper than the contract allows, or turn a required interface into decoration.
- The agent may **recommend** a scope change at any checkpoint ("this boutique doesn't need faceted search; 40 products, browse by collection"). The recommendation is shown, reasoned and approved by the user, or it doesn't happen. Never invent approval.

## Test

Before any concept work: does `DESIGN.md` have a `Product contract` with jobs, at least one core journey written as a route sequence, the IA model, density, responsive expectations and exclusions with reasons? Is every deferred backend paired with the interface that still ships? If not, research for the concept doesn't start.
