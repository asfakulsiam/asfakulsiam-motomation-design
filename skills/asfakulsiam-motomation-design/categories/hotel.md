> This recipe is design guidance for the pages it names. It is
> not the scope and not a structure to follow (authority level 7,
> `principles/authority.md`). The product contract and the scope
> derived in Step 1 come first; if they disagree with this recipe,
> the derived scope wins. Use, adapt, combine or reject it, and say which.

# Category: Hotel / Hospitality

> **Standards vs style:** where this category's job conflicts with house-style defaults (canvas, type scale, grid, accent), the category wins; the universal standards in `principles/restraint.md` always apply.

**The real job:** make someone feel the place before they book, then make booking effortless.
**Starting dials** (the brief overrides; style is derived from the brief, with `styles/` as reference): ENERGY 1 · RHYTHM 2 · MOTION 2 (an "arrival" chapter can fit; not required)

**Archetypes that can fit (optional):** Room · Atlas · Letter · Timeline (heritage) · Diptych (day/night)

**One possible section order (adapt or replace):**
1. Hook: the arrival, the place's light, sound or view, with a single line of type
2. Rooms: each as a room you enter (image-led, with size, bed and view as clear facts)
3. The neighbourhood: a map or walk (Atlas)
4. Food and spaces
5. Booking: dates and guests always reachable (sticky or one tap away)
6. Sign-off: address, how to arrive, contact

**Possible treatments (optional, at most one becomes a signature):** an Aperture "doorway" between sections · a Motomation arrival walk (image sequence) · a day/night Diptych · Darkroom Develop on heritage photos
**Conventions users expect (check against the contract):** booking engine integration, real rates or "from" prices, accessibility information, `Hotel` structured data, fast images (AVIF/WebP with sizes).
**Pitfalls:** autoplay videos with sound, cluttered carousels, stock "luxury" copy ("an oasis of tranquillity").

**Worked example, brief to concept:** `examples/concepts/hotel.md`

## Recipe contract

| | |
|---|---|
| **Intended context** | independent and boutique hotels where place and atmosphere sell the stay |
| **Assumes** | a single property or a small group, with a booking engine |
| **Does not cover** | a hotel chain or OTA (search by destination, dates, rooms, price comparison): research as booking platforms |
| **Usually required capabilities** (confirm in the contract) | dates-and-guests booking entry reachable from every screen, rooms with rates, availability and booking flow (interface even when the engine is deferred), location, policies, accessibility information |
| **Optional treatments** | arrival walks, doorway transitions, day/night diptychs; none of them is required, and the concept may invent something no recipe names |
| **Responsive and accessibility** | the primary action stays one tap away at 375px; every treatment has a keyboard, touch and reduced-motion path |
| **Reject or adapt when** | guests arrive with dates already chosen (return visitors, corporate): booking must lead, story follows |
