# Commands

Type a command at the start of a message. Commands combine with flags. Without a command, the skill runs `/build` when the request is to create something, and `/critique` when it's to review.

## Flags (work with every command)

| Flag | Values | Effect |
|---|---|---|
| `--tier` | 1–5 | Force a motion tier |
| `--energy` `--rhythm` `--motion` | 1–3 | Set a dial (see `principles/dials.md`) |
| `--mood` | quiet · editorial · play | Set all three dials from a preset |
| `--style` | a file in `styles/` | Apply a visual language |
| `--stack` | next · react · vanilla · astro | Target framework (default: detect, else Next.js) |
| `--seed` | any number | Repeatable collision draws |
| `--review` | — | Stop after the preview block and wait for approval |

---

## Create

### `/shape [brief]`
**What:** turns a brief into a design direction without code: brief inference, the Thinking Sequence, dials, and a `DESIGN.md` + `MOTION.md`.
**When:** at the very start, or when the client must approve a direction first.
**Output:** preview block + `DESIGN.md` + `MOTION.md` (from `templates/`).

### `/build [brief]`
**What:** the full flow, from brief to finished, gated code.
**When:** you want a complete page or site.
**Output:** preview block → complete code → Delivery Gate scores → handoff note.

### `/invent [topic]`
**What:** runs the collision engine (`scripts/collide.mjs --n 3 --spread`; `--count N` for more) and proposes **three different concepts**, each with tension, concept, archetype + mutation, collision and signature.
**Guarantees (enforced by the script, reported in its "Diversity (measured)" block):** the three draws never share an archetype or a signature seed; mutations and collision worlds don't repeat either while their pools last (12 mutations, 20 archetypes, 22 signature seeds). When `--count` asks for more than a pool holds, the script says which pool ran out and from which draw repeats start; it never overlaps silently. Copy that block into the output. Without a shell, draw by hand and state that uniqueness was checked by eye.
**When:** you're stuck, or the first idea feels familiar.
**Output:** three concept cards plus the measured diversity line. Pick one and continue with `/build`.

### `/signature [section]`
**What:** invents one signature move for the site or a section, bent from `signatures/` to the concept.
**When:** the page works but nobody will remember it.
**Output:** the move in recipe format (idea, why, build, detail, off-switch, prompt) and its implementation.

### `/motomate [section]`
**What:** turns a section into a Tier 5 scroll-film: storyboard in `MOTION.md`, technique choice (DOM, image sequence, video, WebGL), asset pipeline, code and fallbacks.
**When:** a product, place or story should play like a film as you scroll.
**Output:** storyboard table + ffmpeg commands (if needed) + code + static fallback.

### `/animate [target] --tier=n`
**What:** adds motion to existing UI at the given tier, following the four questions.
**When:** the design is done but static.
**Output:** a motion plan (what moves, why, tokens) + code.

### `/type [target]`
**What:** a typography pass: face choice with reasons, fluid scale, tracking, wrapping, numerals, variable-axis opportunities.
**When:** the page feels generic, and the type is usually why.

---

## Tune

### `/bolder [target]`
Raises ENERGY by one step: bigger type jumps, stronger contrast, a braver accent moment, one more grid break. Keeps the concept.

### `/quieter [target]`
Lowers ENERGY and/or MOTION by one step: more air, fewer moving parts, softer accent, slower reveals.

### `/distill [target]`
Removes until only the essential remains. Runs the Restraint Gate hard: one signature, one accent, fewer sections.

### `/mutate [target]`
Keeps the content and concept but changes the **structure**: a different archetype or mutation, drawn with `collide.mjs`. Use it when the layout feels like a template.

### `/overdrive [target]`
A generate → critique → improve loop, up to 3 rounds. Each round scores the six critique axes and fixes the lowest one. Stops when every axis is 4 or more. Use it for flagship pages.

---

## Evaluate

### `/critique [target or URL]`
A design review in the format of `commands/critique-format.md`: scores, the three most important problems, and fixes in priority order. Doesn't change code unless asked.

### `/audit [target]`
A technical gate: accessibility, performance, reduced motion, mobile matrix, SEO and the AI-default scan. Returns pass/fail per item with file and line references.

### `/study [reference URL or screenshot]`
Extracts the **design DNA** of a reference (structure, type logic, colour roles, motion language, signature) **without copying it**. Returns principles you can apply to a different brief, plus what not to copy.

---

## Ship

### `/polish [target]`
The final pass: spacing rhythm, alignment, typographic details (quotes, dashes, numerals), focus states, hover/press states, empty and error states, loading, favicon and OG image, the stamp comment and the memory log.

---

## Meta

| Command | What it does |
|---|---|
| `/dials` | Shows the current dials and tier, or sets them: `/dials energy=3 motion=2` |
| `/help` | Lists commands with one-line descriptions and suggests the next step |
| `/version` | Prints the installed version from `VERSION` |
| `/check-update` | Compares the installed version with the latest on GitHub (see `commands/update.md`) |
| `/update-skill` | Explains how to update: `npx skills update asfakulsiam-motomation-design` |

## Typical sequences

- New site: `/shape` → approve → `/build` → `/critique` → `/polish`
- Stuck on ideas: `/invent` → pick → `/build --review`
- Existing site feels generic: `/critique` → `/mutate` → `/type` → `/signature`
- Product launch: `/shape --mood=play` → `/motomate hero-product` → `/audit`
