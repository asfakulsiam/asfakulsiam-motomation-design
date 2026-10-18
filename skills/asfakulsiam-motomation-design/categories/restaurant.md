> This recipe is design guidance for the pages it names. It is
> not the scope and not a structure to follow (authority level 7,
> `principles/authority.md`). The product contract and the scope
> derived in Step 1 come first; if they disagree with this recipe,
> the derived scope wins. Use, adapt, combine or reject it, and say which.

# Category: Restaurant / Food & Drink

> **Standards vs style:** where this category's job conflicts with house-style defaults (canvas, type scale, grid, accent), the category wins; the universal standards in `principles/restraint.md` always apply.

**The real job:** appetite, then a table: hours, menu, booking, location.
**Starting dials** (the brief overrides; style is derived from the brief, with `styles/` as reference): ENERGY 2 · RHYTHM 2 · MOTION 2

**Archetypes that can fit (optional):** Letter (the chef's note) · Broadsheet (a menu as a newspaper) · Poster · Field Guide (ingredients)

**One possible section order (adapt or replace):** hook (the dish or the room) → menu (real, readable HTML, not a PDF) → story/people → booking → hours and location (also in the footer).
**Possible treatments (optional, at most one becomes a signature):** a Railway-board menu that flips on change · ingredient labels that annotate a dish photo · Ink Fill for the chef's statement
**Conventions users expect (check against the contract):** hours visible in under 3 seconds, a tappable phone number, a map link, menu prices, `Restaurant` structured data.
**Pitfalls:** heavy motion before the hours and menu, menus as images.

**Worked example, brief to concept:** `examples/concepts/restaurant.md`

## Recipe contract

| | |
|---|---|
| **Intended context** | restaurants, cafés and bars selling a table or an order |
| **Assumes** | one venue or a small group with a menu |
| **Does not cover** | delivery platforms or multi-location chains with ordering: research as commerce or ordering |
| **Usually required capabilities** (confirm in the contract) | hours, location and contact in the first screen; an HTML menu with prices; booking or ordering (interface even when the provider is deferred); dietary and allergen information |
| **Optional treatments** | railway-board menus, ingredient annotations, ink treatments; none of them is required, and the concept may invent something no recipe names |
| **Responsive and accessibility** | the primary action stays one tap away at 375px; every treatment has a keyboard, touch and reduced-motion path |
| **Reject or adapt when** | most visits are on phones, on the street, in a hurry: the hours-menu-book path must beat any atmosphere |
