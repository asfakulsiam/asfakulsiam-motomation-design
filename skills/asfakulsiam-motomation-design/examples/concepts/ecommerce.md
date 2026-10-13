# Brief to concept: Single-estate tea, sold online

Category: `categories/ecommerce.md` · worked example 2 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Chandmoni Tea Garden (invented) in Moulvibazar sells four single-estate teas online, by flush. Buyers are tea drinkers abroad who already know what a first flush is.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category ecommerce --seed 252
COLLISION ENGINE · category: E-commerce · seed 252

Draw 1
  Archetype  : The Diptych (diptych): two halves in permanent dialogue
  If it can't serve the brief, take: The Stage (stage), not a favourite
  Mutation   : Wrong room: use another category's structure
  Collision  : subway map (transport) → steal "lines, stations and interchanges"
               e.g. a process diagram as a transit map
  Kinetic    : the background breathes, driven by scroll velocity
  Seed move  : Pixel Wake: the cursor leaves fading pixels
  Fingerprint: layout=split · tier=2 · signature_type=cursor

Draw 2
  Archetype  : The Field Guide (field-guide): entries with illustrations notes and classes
  If it can't serve the brief, take: The Stage (stage), not a favourite
  Mutation   : Swap the material: paper becomes glass; a list becomes a map
  Collision  : film leader (cinema) → steal "countdown 3-2-1 before a reel"
               e.g. an intro countdown that hands into a Motomation chapter
  Kinetic    : a letter counts, driven by time on page
  Seed move  : Ink Fill: statements fill with ink as you read
  Fingerprint: layout=rows · tier=2 · signature_type=type

Draw 3
  Archetype  : The Shelf (shelf): products as objects on shelves
  If it can't serve the brief, take: The Stage (stage), not a favourite
  Mutation   : Single object: the whole site orbits one object
  Collision  : seismograph (science) → steal "one continuous line reacting to force"
               e.g. a hairline tracking cursor or scroll speed
  Kinetic    : a line bends, driven by the visitor's local time
  Seed move  : Sticker Scatter: the logo bursts into on-brand stickers
  Fingerprint: layout=product · tier=2 · signature_type=micro

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

A product that is judged by taste vs a screen that cannot be tasted.

## Rejected first idea

**First idea:** a full-width photograph of a steaming cup on a wooden table with "Shop now".
**Why it was rejected:** stock lifestyle imagery is ruled out for products (`principles/imagery.md`), and it is what every tea shop shows.

## What was kept from the draw

Draw 2 (Field Guide, swap the material), with its collision replaced: a film leader's countdown has no reason to be on a tea page. The brief's own object took its place: the taster's cupping sheet.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** a product that is judged by taste vs a screen that cannot be tasted.
- **Concept sentence:** Each tea is an entry in a field guide written by the taster: leaf, flush, altitude and a cupping score, then the buy button.
- **Archetype + mutation:** Field Guide, mutated by swapping the material (the product list becomes the taster's cupping sheet).
- **Collision:** a cupping sheet (the brief's own object, replacing Draw 2's film leader) lends "a score per cup, in the taster's hand".
- **Signature move:** Ink Fill (Draw 2): the tasting notes ink in as they are read, the way a taster writes them.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** a full-width photograph of a steaming cup on a wooden table with "Shop now". (stock lifestyle imagery is ruled out for products (`principles/imagery.md`))
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: field-guide · mutation: swap-material · signature: ink-fill · tier: 2 */
```
