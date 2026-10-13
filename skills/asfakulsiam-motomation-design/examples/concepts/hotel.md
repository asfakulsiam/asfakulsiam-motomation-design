# Brief to concept: A houseboat on the haor

Category: `categories/hotel.md` · worked example 4 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Jolchhobi (invented) is a wooden houseboat with four cabins on Tanguar Haor, Sunamganj. Guests come in the monsoon, when the haor is a sea.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category hotel --seed 254
COLLISION ENGINE · category: Hotel · seed 254

Draw 1
  Archetype  : The Broadsheet (broadsheet): newspaper masthead columns and folios
  If it can't serve the brief, take: The Diptych (diptych), not a favourite
  Mutation   : Borrow a print rule: marginalia, footnotes, folios or a colophon
  Collision  : topographic map (geography) → steal "contour lines for height"
               e.g. section depth shown as contour rules
  Kinetic    : the whole page counts, driven by idle time
  Seed move  : Neighbour Moves: each letter has its own hover move
  Fingerprint: layout=columns · tier=2 · signature_type=type

Draw 2
  Archetype  : The Index (index): a huge typographic list is the homepage
  If it can't serve the brief, take: The Timeline (timeline), not a favourite
  Mutation   : Remove the expected: no nav, no hero image or no grid
  Collision  : monsoon window (weather) → steal "rain streaks distorting the view"
               e.g. a shader that streaks images on scroll velocity
  Kinetic    : a mask wipes, driven by a section entering
  Seed move  : Horizontal Reel: vertical scroll pulls a film strip sideways
  Fingerprint: layout=rows · tier=2 · signature_type=scroll

Draw 3
  Archetype  : The Gallery Wall (gallery-wall): free-placed images on a wall to roam
  If it can't serve the brief, take: The Letter (letter), not a favourite
  Mutation   : Invert the axis: vertical becomes horizontal or time runs backwards
  Collision  : thermal camera (science) → steal "heat shown as colour"
               e.g. hover heat maps on a product
  Kinetic    : an image flips, driven by click
  Seed move  : Darkroom Develop: photos develop from blank paper
  Fingerprint: layout=canvas · tier=2 · signature_type=scroll

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

A place you go for the rain vs booking pages built for sunshine.

## Rejected first idea

**First idea:** an autoplaying drone video of the boat on blue water with "Book now" over it.
**Why it was rejected:** autoplay video is a hotel pitfall (`categories/hotel.md`), and a sunny drone shot hides the reason people come.

## What was kept from the draw

Draw 2's mutation, collision and signature; its Index archetype cannot hold a stay, so the draw's own fallback (Timeline) took its place.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** a place you go for the rain vs booking pages built for sunshine.
- **Concept sentence:** The page is one monsoon day on the boat, seen through a wet cabin window, from first light to the lanterns.
- **Archetype + mutation:** Timeline (the draw's fallback for Index), mutated by removing the expected (no hero image: the window is the hero).
- **Collision:** monsoon window (Draw 2) lends "rain streaks distorting the view".
- **Signature move:** Horizontal Reel (Draw 2): vertical scroll pulls the shore past the window sideways, the way it moves when the boat does.
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** an autoplaying drone video of the boat on blue water with "Book now" over it. (autoplay video is a hotel pitfall (`categories/hotel.md`))
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: timeline · mutation: remove-expected · signature: horizontal-reel · tier: 2 */
```
