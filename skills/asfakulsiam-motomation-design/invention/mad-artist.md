# Mad Artist Mode: Inventing New Patterns

Templates repeat because models choose the most likely next option. This file is a set of tools that force unlikely but sensible options. Use it when the Thinking Sequence produces something familiar, or when the user says "different", "wild", "never seen before", or `/invent`.

## Rule zero: real randomness

Language models can't be random; they drift to the same choices. **Run the script**:

```bash
node scripts/collide.mjs --n 3            # three independent draws
node scripts/collide.mjs --n 3 --spread   # force each draw from a different world
node scripts/collide.mjs --category studio --exclude-recent
```

Each draw returns an archetype, a mutation, a collision source, a material, a motion verb and a type move. Treat the draw as a **creative constraint**, not a final answer. Combine, reject or bend it, but you have to start from it.

Without a shell, use the seed method: take the brief's character count, divide it by the number of rows in each CSV, and use the remainder as the row index. Say which rows you used.

## Ten invention techniques

1. **Literalise a metaphor.** The brand says "we open doors", so the page is built from doors. Then stop before it becomes kitsch: keep the behaviour, drop the drawing.
2. **Steal a behaviour from an object.** Pick an object from `data/collisions.csv` and ask: how does it move? How do you use it? What sound would it make? Turn one answer into an interaction.
3. **Move the protagonist.** Usually the content moves and the frame stays still. Reverse it: the frame moves and the content stays.
4. **Give the cursor a job.** A torch, a magnifier, a magnet, a brush, a pencil, a needle. One job only.
5. **Make time visible.** Scroll position becomes a timecode, a date, the hour of the day or the phase of a process.
6. **Abuse the scale.** One word set at 40vw. A product photo 4px tall that grows to full screen. A footer bigger than the hero.
7. **Use the grid as a character.** Visible grid lines that react, bend or count.
8. **Hide the obvious and reveal it later.** No logo until the last section. No product until the user has read the story.
9. **Translate across senses.** Sound becomes waveform type, temperature becomes colour, texture becomes grain intensity.
10. **Design the transition, not the page.** Start from how one section turns into the next, then design the sections around those moments.

## Combination grid

When stuck, pick one from each column. That gives 10 × 10 × 10 = 1,000 starting points before the collision source.

| Subject (what moves) | Verb (how it moves) | Driver (what triggers it) |
|---|---|---|
| a letter | splits | scroll position |
| a word | travels | cursor distance |
| an image | develops | time on page |
| a line | bends | scroll velocity |
| a grid cell | flips | click |
| the background | breathes | section entering |
| a number | counts | hover |
| the cursor | magnifies | idle |
| a mask | wipes | page exit |
| the whole page | tilts | device orientation |

Example draw: "a line · bends · scroll velocity" → a hairline under the nav that bows like a plucked string when the user flicks the page.

## Taste filters (apply after inventing)

An invention survives only if it passes all four:
1. **Purpose.** It expresses the concept sentence.
2. **Legibility.** Content is still readable at every frame.
3. **Access.** It has a reduced-motion version and a keyboard/touch path.
4. **Cost.** It fits the tier's performance budget (`craft/performance.md`).

## Record what you invented

Log every signature you invent (`node scripts/memory.mjs log --signature <name>`). Over time, the project builds its own vocabulary, and the memory check prevents accidental repeats.
