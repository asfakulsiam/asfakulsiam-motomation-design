# Brief to concept: A Bangla science writer's newsletter

Category: `categories/personal-brand.md` · worked example 9 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Nadia Rahman (invented) writes one long science essay a month in Bangla. Readers subscribe by email. The site is the latest essay.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category personal-brand --seed 259
COLLISION ENGINE · category: Personal brand · seed 259

Draw 1
  Archetype  : The Index (index): a huge typographic list is the homepage
  If it can't serve the brief, take: The Broadsheet (broadsheet), not a favourite
  Mutation   : Borrow a print rule: marginalia, footnotes, folios or a colophon
  Collision  : sundial (time) → steal "a shadow moving with the hour"
               e.g. layout lit by the visitor's local time
  Kinetic    : a number flips, driven by idle time
  Seed move  : Velocity Skew Marquee: a marquee that leans with scroll speed
  Fingerprint: layout=rows · tier=2 · signature_type=scroll

Draw 2
  Archetype  : The Specimen (specimen): the page is a type specimen
  If it can't serve the brief, take: The Broadsheet (broadsheet), not a favourite
  Mutation   : Reverse the reveal: start complete and take away as you scroll
  Collision  : chess clock (games) → steal "two timers pressing in turn"
               e.g. a diptych where scroll hands time from one side to the other
  Kinetic    : the background magnifies, driven by scroll position
  Seed move  : Line Curtain: headlines rise line by line from masks
  Fingerprint: layout=statement · tier=2 · signature_type=type

Draw 3
  Archetype  : The Letter (letter): a personal letter with salutation and signature
  If it can't serve the brief, take: The Broadsheet (broadsheet), not a favourite
  Mutation   : Single object: the whole site orbits one object
  Collision  : museum label (culture) → steal "small precise caption next to the work"
               e.g. margin captions for every image
  Kinetic    : a grid cell wipes, driven by a section entering
  Seed move  : Stacked Deck: sticky cards stack into a table of contents
  Fingerprint: layout=statement · tier=2 · signature_type=scroll

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

Hard science vs readers who opened the email on a phone at night.

## Rejected first idea

**First idea:** a big portrait, "Hi, I'm Nadia", and a subscribe box.
**Why it was rejected:** portrait plus greeting plus box is the AI-default personal site, and it puts the writer before the writing.

## What was kept from the draw

Draw 3 (Letter, single object, museum label). Its seed move (Stacked Deck) is replaced: cards break up a letter.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** hard science vs readers who opened the email on a phone at night.
- **Concept sentence:** The site is this month's essay, with every hard term given a small museum label in the margin.
- **Archetype + mutation:** Letter, mutated to a single object (one essay, nothing else above the fold).
- **Collision:** museum label (Draw 3) lends "small precise caption next to the work": each technical term gets a caption beside the line it is in.
- **Signature move:** Remembered List (from the category list, replacing Stacked Deck): the archive marks which essays you have already read.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** a big portrait, "Hi, I'm Nadia", and a subscribe box. (portrait plus greeting plus box is the AI-default personal site)
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: letter · mutation: single-object · signature: remembered-list · tier: 2 */
```
