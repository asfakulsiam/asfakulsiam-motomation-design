> This recipe is design guidance for the pages it names. It is
> not the scope and not a structure to follow (authority level 7,
> `principles/authority.md`). The product contract and the scope
> derived in Step 1 come first; if they disagree with this recipe,
> the derived scope wins. Use, adapt, combine or reject it, and say which.

# Category: SaaS / Software

> **Standards vs style:** where this category's job conflicts with house-style defaults (canvas, type scale, grid, accent), the category wins; the universal standards in `principles/restraint.md` always apply.

**The real job:** make one painful problem and its solution obvious, then prove it with the product itself.
**Starting dials** (the brief overrides; style is derived from the brief, with `styles/` as reference): ENERGY 2 · RHYTHM 1–2 · MOTION 2

**Archetypes that can fit (optional):** Workbench · Console · Letter (founder-led) · Stage · Diptych (before/after)

**One possible section order (adapt or replace):**
1. Hook: the problem in the user's words, with the product visible or usable immediately
2. Show, don't list: 2–3 product moments demonstrated in motion (scrubbed UI demos), not 9 feature icons
3. Proof: real customer quotes with names and roles, real metrics only if they exist
4. How it fits: integrations or workflow, shown as a diagram
5. Pricing: clear, comparable, honest
6. Ask: start free / book a demo (one primary)

**Possible treatments (optional, at most one becomes a signature):** a scrubbed product demo (Workbench) · Decode for technical labels · Timecode Rail for a workflow film · Diptych split for before/after
**Conventions users expect (check against the contract):** a real product UI (not a fake dashboard), docs link, a keyboard-friendly pricing toggle, performance under 2.5s LCP.
**Pitfalls:** hero + logos + 3 features + testimonials + pricing + CTA in that exact order, purple gradients, glowing orbs, invented "10x faster" claims.

**Award-site teardowns** (principles, no code): `references/teardowns/terminal-industries.md`

**Worked example, brief to concept:** `examples/concepts/saas.md`

## Recipe contract

| | |
|---|---|
| **Intended context** | software marketing sites explaining one product |
| **Assumes** | a product with a clear problem, a UI to show and pricing |
| **Does not cover** | the product app itself (dashboards, settings, data tables): use SERVICE STYLE and research the app's type; developer docs (search, nav tree, code samples) |
| **Usually required capabilities** (confirm in the contract) | product explanation with the real UI, pricing, sign-up and sign-in screens, docs or help link, security and legal pages, changelog where relevant |
| **Optional treatments** | scrubbed product demos, decode labels, timecode rails, console archetypes; none of them is required, and the concept may invent something no recipe names |
| **Responsive and accessibility** | the primary action stays one tap away at 375px; every treatment has a keyboard, touch and reduced-motion path |
| **Reject or adapt when** | the buyer is enterprise (security, compliance, procurement content matters more than a demo); the product is a platform with many use cases |
