# Brief to concept: A boat race on the river

Category: `categories/event.md` · worked example 7 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

A one-day nouka baich (traditional long-boat race) on a river near Sylhet, organised by a village committee (invented). The page needs the heats, the times and how to get there.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category event --seed 257
COLLISION ENGINE · category: Event · seed 257

Draw 1
  Archetype  : The Timeline (timeline): history on one axis with years as nav
  If it can't serve the brief, take: The Stage (stage), not a favourite
  Mutation   : Borrow a print rule: marginalia, footnotes, folios or a colophon
  Collision  : theatre curtain (performance) → steal "reveal by withdrawal sideways"
               e.g. sections that open from the centre
  Kinetic    : a word flips, driven by time on page
  Seed move  : Lens: the cursor reveals an alternate layer
  Fingerprint: layout=sequence · tier=2 · signature_type=cursor

Draw 2
  Archetype  : The Poster (poster): one screen one image with layers beneath
  If it can't serve the brief, take: The Stage (stage), not a favourite
  Mutation   : Wrong room: use another category's structure
  Collision  : tide chart (sea) → steal "periodic rise and fall"
               e.g. content density rising and falling with scroll
  Kinetic    : the whole page counts, driven by hover
  Seed move  : Brand Selection: text selection uses the brand accent
  Fingerprint: layout=statement · tier=1 · signature_type=micro

Draw 3
  Archetype  : The Index (index): a huge typographic list is the homepage
  If it can't serve the brief, take: The Stage (stage), not a favourite
  Mutation   : Remove the expected: no nav, no hero image or no grid
  Collision  : x-ray (medicine) → steal "seeing through to structure"
               e.g. a lens revealing the inside of a product
  Kinetic    : the cursor flips, driven by idle time
  Seed move  : Letter Relay: the hero name travels letter by letter into the header
  Fingerprint: layout=rows · tier=2 · signature_type=type

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

A race that depends on the river vs a schedule that must be fixed in advance.

## Rejected first idea

**First idea:** a neon countdown timer over a gradient.
**Why it was rejected:** a countdown on a gradient is the generic event page and says nothing about boats or water.

## What was kept from the draw

Draw 2 (Poster, wrong room) and its tide chart; its seed move (Brand Selection) is too small for an event and is replaced from the category list.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** a race that depends on the river vs a schedule that must be fixed in advance.
- **Concept sentence:** A race poster set like a tide table: each heat is a high water, with its time and the boats in it.
- **Archetype + mutation:** Poster, mutated by wrong room (the structure of a tide table, from navigation, instead of an event line-up).
- **Collision:** tide chart (Draw 2) lends "periodic rise and fall": heats rise and fall through the day.
- **Signature move:** Velocity Skew (from the category list, replacing Brand Selection): the boats' names lean with scroll speed, like oars.
- **Dials:** ENERGY 3 · RHYTHM 3 · MOTION 3 → Tier 3
- **Rejected:** a neon countdown timer over a gradient. (a countdown on a gradient is the generic event page and says nothing about boats or water.)
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: poster · mutation: wrong-room · signature: velocity-skew · tier: 3 */
```
