# Brief to concept: Appointment reminders for rural clinics

Category: `categories/saas.md` · worked example 3 of 10 (`examples/concepts/README.md`)

The client is invented for the example; places and crafts named are real. The collision draw below is the real output of the command shown, copied unedited except that the two closing hint lines are left out. No page was built: this example stops at the concept, which is what `/shape` writes into `DESIGN.md` before any code.

## The brief

Shomoy (invented) sends SMS appointment reminders for small clinics in Bangladesh. The buyer is a clinic manager with a paper register and one phone.

## The draw

```text
$ node scripts/collide.mjs --n 3 --category saas --seed 253
COLLISION ENGINE · category: SaaS · seed 253

Draw 1
  Archetype  : The Stage (stage): one fixed stage where content enters and leaves
  If it can't serve the brief, take: The Diptych (diptych), not a favourite
  Mutation   : Shift the tempo: one section moves at film speed while others stay still
  Collision  : stamp and postmark (post) → steal "ink impression with a date"
               e.g. a 'viewed' or 'booked' stamp with the real date
  Kinetic    : a grid cell travels, driven by cursor distance
  Seed move  : Width Sprint: variable width stretches with scroll speed
  Fingerprint: layout=stage · tier=2 · signature_type=type

Draw 2
  Archetype  : The Workbench (workbench): the product UI is the page
  If it can't serve the brief, take: The Letter (letter), not a favourite
  Mutation   : Single object: the whole site orbits one object
  Collision  : vinyl record (music) → steal "rotation, grooves and a needle drop"
               e.g. a circular progress dial that drops into chapters
  Kinetic    : a line flips, driven by a section entering
  Seed move  : Timecode Rail: a running timecode shows chapter progress
  Fingerprint: layout=product · tier=5 · signature_type=scroll

Draw 3
  Archetype  : The Poster (poster): one screen one image with layers beneath
  If it can't serve the brief, take: The Console (console), not a favourite
  Mutation   : Make the UI the content: the scrollbar is the timeline; the cursor is the product
  Collision  : dial phone (objects) → steal "rotating dial with finger stops"
               e.g. a rotary control for choosing a category
  Kinetic    : a letter counts, driven by idle time
  Seed move  : Neighbour Moves: each letter has its own hover move
  Fingerprint: layout=statement · tier=2 · signature_type=type

Diversity (measured)
  archetypes       : 3/3 unique  ✓
  signature seeds  : 3/3 unique  ✓
  mutations        : 3/3 unique  ✓
  collision sources: 3/3 unique  ✓
```

## Tension

A paper register that works vs software that promises fewer missed appointments.

## Rejected first idea

**First idea:** a dashboard screenshot tilted in 3D over a purple gradient, with three feature cards below.
**Why it was rejected:** a tilted mockup on a gradient is on the AI-default list, and the buyer has never seen a dashboard like it.

## What was kept from the draw

Draw 2 (Workbench, single object) with Draw 1's collision, because a reminder is a letter that has been sent.

## The concept, as written in DESIGN.md

```markdown
- **Tension:** a paper register that works vs software that promises fewer missed appointments.
- **Concept sentence:** The whole page is one appointment, from the register line to the SMS the patient gets, postmarked when it is sent.
- **Archetype + mutation:** Workbench, mutated to a single object (one appointment, followed end to end).
- **Collision:** stamp and postmark (Draw 1) lends "ink impression with a date": each reminder is stamped with the time it went out.
- **Signature move:** Timecode Rail (Draw 2): the clinic day runs as a timecode down the side, from 08:00 to the evening reminder.
- **Dials:** ENERGY 2 · RHYTHM 1 · MOTION 2 → Tier 2
- **Rejected:** a dashboard screenshot tilted in 3D over a purple gradient, with three feature cards below. (a tilted mockup on a gradient is on the AI-default list)
```

## Final stamp

The concept stamp the page will open with (the gate appends its critique and gate fields when a page is built and measured; none was built here):

```text
/* motomation · archetype: workbench · mutation: single-object · signature: timecode-rail · tier: 2 */
```
