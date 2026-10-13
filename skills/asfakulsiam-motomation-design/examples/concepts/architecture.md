# Brief to concept: Bamboo community halls

Category: `categories/architecture.md` · worked example 8 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Bash Ghor (invented) is a small practice that designs bamboo community halls on hill slopes in the Chittagong Hill Tracts. The site is for funders and district engineers.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category architecture --seed 258
COLLISION ENGINE · category: Architecture / Real estate · seed 258

Draw 1
  Archetype  : The Timeline (timeline): history on one axis with years as nav
  If it can't serve the brief, take: The Catalogue (catalogue), not a favourite
  Mutation   : Single object: the whole site orbits one object
  Collision  : lighthouse (navigation) → steal "a rotating beam in the dark"
               e.g. a torch-cursor that lights a dark page
  Kinetic    : the cursor flips, driven by idle time
  Seed move  : Aperture: the next section opens through an iris or door
  Fingerprint: layout=sequence · tier=2 · signature_type=scroll

Draw 2
  Archetype  : The Lookbook (lookbook): full-bleed editorial spreads page by page
  If it can't serve the brief, take: The Catalogue (catalogue), not a favourite
  Mutation   : Shift the tempo: one section moves at film speed while others stay still
  Collision  : topographic map (geography) → steal "contour lines for height"
               e.g. section depth shown as contour rules
  Kinetic    : a letter splits, driven by scroll velocity
  Seed move  : Stacked Deck: sticky cards stack into a table of contents
  Fingerprint: layout=sequence · tier=2 · signature_type=scroll

Draw 3
  Archetype  : The Atlas (atlas): a map or diagram you move through
  If it can't serve the brief, take: The Catalogue (catalogue), not a favourite
  Mutation   : Second person: the visitor becomes a character in the layout
  Collision  : subway map (transport) → steal "lines, stations and interchanges"
               e.g. a process diagram as a transit map
  Kinetic    : a letter counts, driven by page exit
  Seed move  : Decode: labels resolve from random glyphs
  Fingerprint: layout=canvas · tier=2 · signature_type=type

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

A light, temporary-looking material vs buyers who need to trust that it lasts.

## Rejected first idea

**First idea:** Draw 1 as drawn: a lighthouse beam sweeping a dark page.
**Why it was rejected:** the halls are open-sided daylight buildings; a dark page with a beam contradicts the work.

## What was kept from the draw

Draw 2 (Lookbook, tempo shift, topographic map, Stacked Deck) as drawn.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** a light, temporary-looking material vs buyers who need to trust that it lasts.
- **Concept sentence:** Each hall is a spread that starts with the contour lines of its slope and builds up to the roof, with one joint detail shown at film speed.
- **Archetype + mutation:** Lookbook, mutated by shifting the tempo (the lashing of one bamboo joint moves at film speed while the spreads stay still).
- **Collision:** topographic map (Draw 2) lends "contour lines for height": each hall sits on the contours of its real site.
- **Signature move:** Stacked Deck (Draw 2): the halls stack into a table of contents as you pass them.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Draw 1 as drawn: a lighthouse beam sweeping a dark page. (the halls are open-sided daylight buildings; a dark page with a beam contradicts the work.)
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: lookbook · mutation: tempo-shift · signature: stacked-deck · tier: 2 */
```
