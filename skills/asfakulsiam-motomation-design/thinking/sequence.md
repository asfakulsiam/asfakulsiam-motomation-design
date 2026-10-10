# The Thinking Sequence

This is the missing key: it makes an agent think like a designer instead of a template engine. Run all seven steps for every page. Write the results into the preview block. Each step has a test. If the test fails, redo the step.

---

## 1. Tension

Every good brief hides a conflict. Design lives in that conflict.

Ask: **what two true things about this brief pull against each other?**

| Brief | Tension |
|---|---|
| Boutique hotel in old Dhaka | Centuries-old lanes ↔ a hotel that wants to feel new |
| Developer tool for logs | Huge volumes of noise ↔ finding one line |
| Ceramic studio shop | Slow handmade objects ↔ fast online buying |
| Climate non-profit | Urgent emergency ↔ readers worn out by alarm |
| Designer portfolio | "Look at my range" ↔ "remember one thing about me" |

**Test:** could this tension belong to a different brief? If yes, it's too generic ("modern vs classic" fits everything). Make it specific.

---

## 2. Concept

The concept resolves the tension in one sentence. It is an idea, not a layout or a colour.

Formula: **"A site that [does something unexpected] so that [the tension resolves]."**

- Hotel: "The site is a slow walk down one lane, where each scroll step opens a door."
- Log tool: "Everything is noise until you type, then the page goes quiet around your one line."
- Ceramics: "Every product page is a kiln firing: it starts raw and finishes glazed as you scroll."
- Non-profit: "Instead of alarms, the page counts what is still saveable, and it grows as you read."
- Portfolio: "One name, set huge, that every project slides behind like a stage curtain."

**Test:** would a client repeat the sentence to a friend? Can you draw it in three frames? If not, sharpen it.

---

## 3. Archetype + Mutation

Pick a structure from `structures/archetypes.md` that suits the concept. Then **mutate** it: break one rule of that structure on purpose.

Mutation operators (or draw one with `node scripts/collide.mjs`):
- **Invert the axis.** Vertical becomes horizontal, or time runs backwards.
- **Change the scale.** One element becomes 10× bigger or smaller than expected.
- **Swap the material.** Paper becomes glass, a list becomes a map.
- **Remove the expected.** No nav, no hero image, no grid.
- **Make the UI the content.** The scrollbar is the timeline, the cursor is the product.
- **Slow it down / speed it up.** One section moves at film speed while the rest stay still.
- **Borrow a rule from print.** Marginalia, footnotes, a folio, a masthead, a colophon.

**Test:** name the original structure, then name the rule you broke. If you can't name the broken rule, you haven't mutated it.

---

## 4. Forced Collision

Take something from a world unrelated to the brief and steal **one property** from it. This is where original patterns come from.

Run `node scripts/collide.mjs --n 3`, or choose from `data/collisions.csv`. Examples:

| Source | Property stolen | Becomes |
|---|---|---|
| Railway departure board | Flipping characters, rows as a schedule | A menu that flips into place |
| Tailor's measuring tape | Numbered ruler, tension when pulled | A scroll progress bar that stretches |
| Darkroom | Images appear slowly in red light | Photos develop from blank as they enter view |
| Theatre curtain | Reveal by withdrawal | Sections open sideways, not upward |
| Seismograph | One continuous line that reacts | A hairline across the page that tracks the cursor |
| Library card catalogue | Index cards and tabs | Case studies as pull-out cards |

**Test:** the collision must be visible in the final site but not literal. No clip-art trains: steal the behaviour, not the picture.

---

## 5. Signature Move

Invent one interaction or motion that people will remember and describe. Use `signatures/` for inspiration, then make it specific to this concept.

Good signature moves are:
- **Tied to the concept.** For the hotel lane: doors that open on scroll. For the log tool: the page goes quiet as you type.
- **Felt in the first 5 seconds.**
- **Repeated with variation**, at least twice: introduced in the hero, echoed later.
- **Describable in one line**: "the name breaks into letters and each one runs into the header".

**Test:** if you removed it, would the site lose its identity? If not, it's decoration, not a signature.

---

## 6. Anti-Sameness Check

Compare your plan against three things:
1. **The AI-default list** in `gates/delivery-gate.md`. Count the matches.
2. **Project memory:** run `node scripts/memory.mjs check --archetype <x> --signature <y>`. If either was used in the last 5 runs, change it.
3. **The obvious version:** write down what a template would do. Your plan must differ in at least **three** of: structure, type, colour, motion, signature, imagery.

**Test:** if a stranger saw your site next to the last one you made, would they think the same person made them on autopilot? If yes, mutate again.

---

## 7. Restraint Gate

Now remove things.

- One signature move. Others become supporting details or get cut.
- One accent colour moment per screen.
- One display typeface (two only when the concept is about contrast).
- Every animation passes the four questions in `motion/tokens.md`.
- If a section has no job, delete it.

**Test:** read the plan aloud. Does each part serve the concept sentence? Cut whatever doesn't.

---

## Worked example: "Portfolio for a motion designer in Dhaka"

```
Tension   : 10 years of varied work ↔ clients remember one thing
Concept   : The site is a single film reel; each project is a frame you scrub through
Archetype : Film Reel (Tier 5 scroll-film) mutated by "invert the axis": the reel runs horizontally while the page scrolls vertically
Collision : 35mm contact sheet → frame numbers, sprocket holes as a progress rail, grease-pencil circles as hover marks
Signature : Hovering a project draws a grease-pencil circle around it; scrolling past the reel's end rewinds it with a film-leader countdown
Dials     : ENERGY 3 · RHYTHM 2 · MOTION 3 → Tier 5
Type      : Big Shoulders Display (condensed, cinematic) / Switzer (neutral text)
Palette   : Darkroom: #0E0D0B, #F2EEE6, accent safelight red #E0442B
Not doing : Bento grid of thumbnails with a centred "Hi, I'm…" hero
```
