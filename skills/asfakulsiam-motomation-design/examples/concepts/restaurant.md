# Brief to concept: An Old Dhaka biryani house

Category: `categories/restaurant.md` · worked example 5 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Haji Para Kitchen (invented) cooks one kacchi biryani a day in sealed pots, and the day's pots sell out. The site must say what is cooking today and take a table.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category restaurant --seed 255
COLLISION ENGINE · category: Restaurant · seed 255

Draw 1
  Archetype  : The Field Guide (field-guide): entries with illustrations notes and classes
  If it can't serve the brief, take: The Poster (poster), not a favourite
  Mutation   : Remove the expected: no nav, no hero image or no grid
  Collision  : library card catalogue (archives) → steal "index cards with tabs"
               e.g. case studies as pull-out cards
  Kinetic    : a line counts, driven by page exit
  Seed move  : Aperture: the next section opens through an iris or door
  Fingerprint: layout=rows · tier=2 · signature_type=scroll

Draw 2
  Archetype  : The Broadsheet (broadsheet): newspaper masthead columns and folios
  If it can't serve the brief, take: The Poster (poster), not a favourite
  Mutation   : Borrow a print rule: marginalia, footnotes, folios or a colophon
  Collision  : kiln firing (ceramics) → steal "colour changes with heat"
               e.g. products glaze from raw to finished on scroll
  Kinetic    : a grid cell magnifies, driven by the visitor's local time
  Seed move  : Decode: labels resolve from random glyphs
  Fingerprint: layout=columns · tier=2 · signature_type=type

Draw 3
  Archetype  : The Letter (letter): a personal letter with salutation and signature
  If it can't serve the brief, take: The Poster (poster), not a favourite
  Mutation   : Abuse the scale: one element 10x bigger or smaller than expected
  Collision  : newspaper press (print) → steal "rolling sheets and registration marks"
               e.g. page transitions with registration-mark crops
  Kinetic    : a letter counts, driven by page exit
  Seed move  : Velocity Skew Marquee: a marquee that leans with scroll speed
  Fingerprint: layout=statement · tier=2 · signature_type=scroll

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

One dish, made the same way every day, vs a site that must feel new each morning.

## Rejected first idea

**First idea:** a dark page, gold serif, a lit plate photograph.
**Why it was rejected:** dark-luxe is the default restaurant look and says "expensive", which this kitchen is not.

## What was kept from the draw

Draw 2 (Broadsheet, print rule). Its collision is bent: kiln firing's "colour changes with heat" becomes the sealed pot cooking. Its seed move (Decode) is replaced: glyphs resolving have nothing to do with food.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** one dish, made the same way every day, vs a site that must feel new each morning.
- **Concept sentence:** The site is the morning edition of one dish: today's pots, sold out or not, set as a newspaper.
- **Archetype + mutation:** Broadsheet, mutated by borrowing a print rule (folio with the date, a colophon listing the cooks).
- **Collision:** kiln firing (Draw 2) bent to the dum pot: the menu line warms from raw to cooked colour as the day goes on.
- **Signature move:** Ink Fill (from the category list, replacing the drawn Decode): today's line inks in like fresh print.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** a dark page, gold serif, a lit plate photograph. (dark-luxe is the default restaurant look and says "expensive")
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: broadsheet · mutation: print-rule · signature: ink-fill · tier: 2 */
```
