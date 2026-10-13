# Brief to concept: Legal aid for garment workers

Category: `categories/organisation.md` · worked example 6 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Shuta Legal Aid (invented) takes unpaid-wage cases for garment workers to the labour court. The page asks lawyers to volunteer and donors to fund one case.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category organisation --seed 256
COLLISION ENGINE · category: Organisation / Non-profit · seed 256

Draw 1
  Archetype  : The Letter (letter): a personal letter with salutation and signature
  If it can't serve the brief, take: The Timeline (timeline), not a favourite
  Mutation   : Self-imposed constraint: one colour, one size or one font weight only
  Collision  : chess clock (games) → steal "two timers pressing in turn"
               e.g. a diptych where scroll hands time from one side to the other
  Kinetic    : the cursor develops, driven by scroll velocity
  Seed move  : Sticker Scatter: the logo bursts into on-brand stickers
  Fingerprint: layout=statement · tier=2 · signature_type=micro

Draw 2
  Archetype  : The Field Guide (field-guide): entries with illustrations notes and classes
  If it can't serve the brief, take: The Manifesto (manifesto), not a favourite
  Mutation   : Abuse the scale: one element 10x bigger or smaller than expected
  Collision  : newspaper press (print) → steal "rolling sheets and registration marks"
               e.g. page transitions with registration-mark crops
  Kinetic    : a mask bends, driven by cursor distance
  Seed move  : Letter Relay: the hero name travels letter by letter into the header
  Fingerprint: layout=rows · tier=2 · signature_type=type

Draw 3
  Archetype  : The Atlas (atlas): a map or diagram you move through
  If it can't serve the brief, take: The Timeline (timeline), not a favourite
  Mutation   : Second person: the visitor becomes a character in the layout
  Collision  : sewing pattern (fashion) → steal "dotted cut lines and notches"
               e.g. dashed guides that cut images into place
  Kinetic    : the whole page tilts, driven by a section entering
  Seed move  : Pixel Wake: the cursor leaves fading pixels
  Fingerprint: layout=canvas · tier=2 · signature_type=cursor

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

Slow courts vs wages owed today.

## Rejected first idea

**First idea:** Draw 3 as drawn: an atlas of the factory floor, "you are the worker", with sewing-pattern lines.
**Why it was rejected:** putting a donor in a worker's shoes is appropriative, and a sewing pattern on a garment cause is the literal first pun.

## What was kept from the draw

Draw 1 (Letter, one colour) and its chess clock, with the seed move replaced: Sticker Scatter is playful where the subject is unpaid wages.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** slow courts vs wages owed today.
- **Concept sentence:** A letter from the legal team with two clocks running side by side: days since the wage was due, days until the hearing.
- **Archetype + mutation:** Letter, mutated by a self-imposed constraint (one colour: the ink of a court filing).
- **Collision:** chess clock (Draw 1) lends "two timers pressing in turn".
- **Signature move:** Thread (from the category list, replacing Sticker Scatter): one line drawn down the letter joins the case's dates.
- **Dials:** ENERGY 1 · RHYTHM 1 · MOTION 2 → Tier 2
- **Rejected:** Draw 3 as drawn: an atlas of the factory floor, "you are the worker", with sewing-pattern lines. (putting a donor in a worker's shoes is appropriative)
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: letter · mutation: constraint · signature: thread · tier: 2 */
```
