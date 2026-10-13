# Brief to concept: Swimming lessons for children

Category: `categories/education.md` · worked example 10 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Bhashan (invented) is a community swimming school in Sunamganj teaching children to swim in ten lessons in a fenced pond. The site is for parents.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category education --seed 2510
COLLISION ENGINE · category: Education · seed 2510

Draw 1
  Archetype  : The Timeline (timeline): history on one axis with years as nav
  If it can't serve the brief, take: The Field Guide (field-guide), not a favourite
  Mutation   : Reverse the reveal: start complete and take away as you scroll
  Collision  : rickshaw art (Dhaka street culture) → steal "bold painted panels and borders"
               e.g. a Play-mood frame system for a Bangladeshi brand
  Kinetic    : a grid cell travels, driven by scroll position
  Seed move  : Darkroom Develop: photos develop from blank paper
  Fingerprint: layout=sequence · tier=2 · signature_type=scroll

Draw 2
  Archetype  : The Workbench (workbench): the product UI is the page
  If it can't serve the brief, take: The Field Guide (field-guide), not a favourite
  Mutation   : Second person: the visitor becomes a character in the layout
  Collision  : ticket stub (events) → steal "a numbered admission stub"
               e.g. a numbered progress counter for a launch
  Kinetic    : the cursor flips, driven by the visitor's local time
  Seed move  : Timecode Rail: a running timecode shows chapter progress
  Fingerprint: layout=product · tier=5 · signature_type=scroll

Draw 3
  Archetype  : The Manifesto (manifesto): one argument set large like a speech
  If it can't serve the brief, take: The Field Guide (field-guide), not a favourite
  Mutation   : Wrong room: use another category's structure
  Collision  : newspaper press (print) → steal "rolling sheets and registration marks"
               e.g. page transitions with registration-mark crops
  Kinetic    : a number counts, driven by the visitor's local time
  Seed move  : Remembered List: the list marks what you already opened
  Fingerprint: layout=statement · tier=1 · signature_type=micro

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

Parents' fear of water vs a skill that removes it.

## Rejected first idea

**First idea:** Draw 3 as drawn: a manifesto set large like a speech.
**Why it was rejected:** a speech is wrong when parents need the schedule, the safety rules and who the teachers are.

## What was kept from the draw

Draw 1 (Timeline, reverse the reveal, rickshaw art). Its seed move (Darkroom Develop) is replaced: the school does not publish photographs of children.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** parents' fear of water vs a skill that removes it.
- **Concept sentence:** Ten lessons on one line: the page starts with every fear a parent listed and takes one away per lesson, painted like rickshaw panels.
- **Archetype + mutation:** Timeline, mutated by reversing the reveal (start with the full list of fears and remove one per lesson).
- **Collision:** rickshaw art (Draw 1) lends "bold painted panels and borders": each lesson is a painted panel.
- **Signature move:** Thread (from the category list, replacing Darkroom Develop): a waterline thread rises down the page, lesson by lesson.
- **Dials:** ENERGY 2 · RHYTHM 1 · MOTION 2 → Tier 2
- **Rejected:** Draw 3 as drawn: a manifesto set large like a speech. (a speech is wrong when parents need the schedule)
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: timeline · mutation: reverse-reveal · signature: thread · tier: 2 */
```
