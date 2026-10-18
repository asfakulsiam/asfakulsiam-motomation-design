> This recipe is design guidance for the pages it names. It is
> not the scope and not a structure to follow (authority level 7,
> `principles/authority.md`). The product contract and the scope
> derived in Step 1 come first; if they disagree with this recipe,
> the derived scope wins. Use, adapt, combine or reject it, and say which.

# Category: Event / Festival / Conference

> **Standards vs style:** where this category's job conflicts with house-style defaults (canvas, type scale, grid, accent), the category wins; the universal standards in `principles/restraint.md` always apply.

**The real job:** excitement, then the facts (date, place, line-up, tickets) in seconds.
**Starting dials** (the brief overrides; style is derived from the brief, with `styles/` as reference): ENERGY 3 · RHYTHM 3 · MOTION 3

**Archetypes that can fit (optional):** Poster · Stage · Timeline (schedule) · Index (line-up)

**One possible section order (adapt or replace):** hook (the poster, moving) → date, place and tickets (visible in the first screen) → line-up / speakers → schedule → venue and travel → FAQ → tickets again.
**Possible treatments (optional, at most one becomes a signature):** a Velocity Skew line-up marquee · Width Sprint on the event name · a Motomation poster film · Sticker Scatter on the logo
**Conventions users expect (check against the contract):** add-to-calendar, ticket links that work on mobile, an accessible schedule table, `Event` structured data.
**Pitfalls:** the date hidden under the animation, countdown timers as the only content.

**Award-site teardowns** (principles, no code): `references/teardowns/cartier-watches-wonders-2025.md`

**Worked example, brief to concept:** `examples/concepts/event.md`

## Recipe contract

| | |
|---|---|
| **Intended context** | festivals, conferences and one-off events selling attendance |
| **Assumes** | a dated event with a programme and tickets |
| **Does not cover** | a ticketing marketplace or a venue with a year-round calendar: research as listings and booking |
| **Usually required capabilities** (confirm in the contract) | date, venue and tickets in the first screen; schedule; speakers or line-up; ticket purchase flow; venue and access info; add to calendar |
| **Optional treatments** | poster films, line-up marquees, kinetic names; none of them is required, and the concept may invent something no recipe names |
| **Responsive and accessibility** | the primary action stays one tap away at 375px; every treatment has a keyboard, touch and reduced-motion path |
| **Reject or adapt when** | the schedule is the product (multi-track conference): a searchable, filterable agenda beats any poster treatment |
