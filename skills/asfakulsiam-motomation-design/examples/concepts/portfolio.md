# Brief to concept: A wayfinding designer's portfolio

Category: `categories/portfolio.md` · worked example 1 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Tasnim Ara designs wayfinding: signs, maps and floor numbering for hospitals and stations in Chattogram. She wants a portfolio that gets her the next public-building commission. Six projects, no photographs of people.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category portfolio --seed 251
COLLISION ENGINE · category: Portfolio · seed 251

Draw 1
  Archetype  : The Letter (letter): a personal letter with salutation and signature
  If it can't serve the brief, take: The Film Reel (film-reel), not a favourite
  Mutation   : Borrow a print rule: marginalia, footnotes, folios or a colophon
  Collision  : subway map (transport) → steal "lines, stations and interchanges"
               e.g. a process diagram as a transit map
  Kinetic    : a word flips, driven by scroll position
  Seed move  : Proximity Weight: letters near the cursor get heavier
  Fingerprint: layout=statement · tier=2 · signature_type=type

Draw 2
  Archetype  : The Index (index): a huge typographic list is the homepage
  If it can't serve the brief, take: The Film Reel (film-reel), not a favourite
  Mutation   : Remove the expected: no nav, no hero image or no grid
  Collision  : sewing pattern (fashion) → steal "dotted cut lines and notches"
               e.g. dashed guides that cut images into place
  Kinetic    : a grid cell tilts, driven by scroll position
  Seed move  : Lens: the cursor reveals an alternate layer
  Fingerprint: layout=rows · tier=2 · signature_type=cursor

Draw 3
  Archetype  : The Manifesto (manifesto): one argument set large like a speech
  If it can't serve the brief, take: The Gallery Wall (gallery-wall), not a favourite
  Mutation   : Invert the axis: vertical becomes horizontal or time runs backwards
  Collision  : boarding pass (travel) → steal "tear-off stub and perforation"
               e.g. CTA cards that tear when committed
  Kinetic    : an image develops, driven by hover
  Seed move  : Considerate Magnet: the primary button leans toward the cursor
  Fingerprint: layout=statement · tier=2 · signature_type=micro

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

Work that is meant to disappear (good signage is noticed only when it is missing) vs a portfolio that must be remembered.

## Rejected first idea

**First idea:** a grid of six project thumbnails with a hover zoom and a "Selected work" heading.
**Why it was rejected:** it is the AI-default portfolio (card grid, hover scale), it says nothing about wayfinding, and the Anti-Sameness Check rejects a card grid outright.

## What was kept from the draw

Draw 2's archetype and mutation (an index with no nav) with Draw 1's collision (the subway map), because a line map is how her own work is read.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** work that is meant to disappear (good signage is noticed only when it is missing) vs a portfolio that must be remembered.
- **Concept sentence:** The portfolio is a line map: each project is a station, and the services are the interchanges where lines cross.
- **Archetype + mutation:** Index, mutated by removing the expected (no nav bar: the line is the navigation).
- **Collision:** subway map (Draw 1) lends "lines, stations and interchanges".
- **Signature move:** Lens (Draw 2): hovering a station shows the real sign at that place under the map, the alternate layer.
- **Dials:** ENERGY 3 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** a grid of six project thumbnails with a hover zoom and a "Selected work" heading. (it is the AI-default portfolio (card grid)
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: index · mutation: remove-expected · signature: lens · tier: 2 */
```
