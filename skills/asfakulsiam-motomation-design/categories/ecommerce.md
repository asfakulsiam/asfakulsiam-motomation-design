> This recipe is design guidance for the pages it names. It is
> not the scope and not a structure to follow (authority level 7,
> `principles/authority.md`). The product contract and the scope
> derived in Step 1 come first; if they disagree with this recipe,
> the derived scope wins. Use, adapt, combine or reject it, and say which.

# Category: E-commerce

> **Standards vs style:** where this category's job conflicts with house-style defaults (canvas, type scale, grid, accent), the category wins; the universal standards in `principles/restraint.md` always apply.

**The real job:** make the product desirable, then make buying fast and certain.
**Starting dials** (the brief overrides; style is derived from the brief, with `styles/` as reference): ENERGY 2 · RHYTHM 2 · MOTION 2 (Motomation for a hero product only)

**Archetypes that can fit (optional):** Catalogue · Shelf · Lookbook · Stage (single product) · Field Guide (many variants)

**A typical page set (verify against the contract):**
- **Home:** a story-led hero, then 2–3 curated collections, then a material/process story
- **Collection:** a dense, scannable grid with filters (Flip animation for filter changes), price and variant swatches visible
- **Product:** images first, the purchase panel sticky on desktop, specs as a clear table, delivery and returns visible above the fold
- **Cart and checkout:** zero decoration, maximum clarity, one accent for the main action

**Possible treatments (optional, at most one becomes a signature):** a Motomation turntable for the hero product · Darkroom Develop for lookbook images · Lens on materials · Hold to Commit only for high-value pre-orders
**Conventions users expect (check against the contract):** fast LCP (product image ≤ 2.5s), real stock and prices, accessible variant pickers, a visible currency (৳, $, €), structured data (`Product`, `Offer`).
**Pitfalls:** animation that delays the purchase, carousels as the main navigation, fake scarcity timers.

**Award-site teardowns** (principles, no code): `references/teardowns/scout-motors.md`

**Worked example, brief to concept:** `examples/concepts/ecommerce.md`

## Recipe contract

| | |
|---|---|
| **Intended context** | direct-to-consumer and boutique stores with a curated catalogue |
| **Assumes** | a catalogue small enough to browse by collection, product photography, one brand |
| **Does not cover** | general marketplaces (many sellers, huge catalogues), B2B procurement (account pricing, quotes, reorders), grocery (substitutions, delivery slots): research each as itself |
| **Usually required capabilities** (confirm in the contract) | search, category/collection listing, product detail with variants, cart, checkout with address, delivery and payment UI, order confirmation, account, returns and policy pages |
| **Optional treatments** | turntables, lookbook treatments, editorial interludes, archetype choices; none of them is required, and the concept may invent something no recipe names |
| **Responsive and accessibility** | the primary action stays one tap away at 375px; every treatment has a keyboard, touch and reduced-motion path |
| **Reject or adapt when** | catalogue size or task frequency makes browsing-by-story slow; the audience shops by spec, price or reorder; motion would delay purchase |
