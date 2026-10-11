# Acknowledgements

Motomation Design is written and maintained by **asfakulsiam**. All text and code in this repository is original: no text or code was copied from the projects below. An overlap check of the skill against the closest design skills (Impeccable, Hallmark, anti-slop, taste-skill, ui-ux-pro-max, Emil Kowalski's skills, design-motion-principles) found only boilerplate in common, such as a shared cubic-bezier value.

Like any design practice, it was shaped by studying the work of others. These are the ideas it learned from, named so you can go to the source.

## Ideas this skill borrowed and rewrote

| Source | What was borrowed | Where it shows up here |
|---|---|---|
| [i-have-adhd](https://github.com/ayghri/i-have-adhd) | The benchmark design: a blind judge from a different model family, a results page that keeps the failures visible, before/after evidence instead of claims | `evals/` |
| [Anthropic skill-creator](https://github.com/anthropics/skills) | Running the same brief with and without the skill on the same model, scored against a rubric | `evals/run-agent-benchmark.mjs`, `evals/rubric.md` |
| [Hallmark](https://github.com/Nutlope/hallmark) | Logging and stamping a page, indexing its structure rather than its IDs; extended here into structural fingerprints | `scripts/memory.mjs`, the stamp in `gates/delivery-gate.md` |
| [anti-slop](https://github.com/miqdadbadjuber/anti-slop) | The split between standards that never bend and defaults a brief can override; the dials; the purpose gate | `principles/dials.md`, `principles/restraint.md` |
| [Impeccable](https://github.com/pbakaus/impeccable) | Bounded checks: a check is only as strong as what it measures, and says what it skipped | `scripts/gate.mjs` |

## Lineage: studied and learned from

| Source | What it taught |
|---|---|
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Reading the design brief before styling, and dialling variance, motion and density instead of picking a theme |
| [Emil Kowalski](https://github.com/emilkowalski/skills) | Motion judgement: when not to animate, easing choice, interruptible UI motion |
| [design-motion-principles](https://github.com/kylezantos/design-motion-principles) | Auditing motion against named principles rather than taste alone |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Curated design data in CSV files with a ranked search over them; curated much smaller here |
| [awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) | `DESIGN.md` as a portable record of a design system |
| [Miguel Clavel](https://github.com/miguelclavel/interaction-recipes) | Small interaction moments that notice the visitor: pixel trails, sticker bursts, a list that remembers what you opened, brand-coloured selection, a curve carousel. Several signatures here are original takes on those ideas |
| [GSAP](https://github.com/greensock/GSAP) | The animation runtime for Tiers 3–5. Used under GSAP's own Standard License (free, including commercial use), not MIT |
| [React Bits](https://github.com/DavidHDev/react-bits) by **David Haz** | A wide vocabulary of text, background, cursor and layout effects. Used as a reference library: `references/react-bits/` maps 19 of its components to this skill's tiers and links to each. No React Bits code is included, because its licence (MIT + Commons Clause) does not allow redistributing the components |

## Tools the skill points to

Where the skill points to outside tools (GSAP, Lenis, Three.js, Lottie, Rive, component libraries, font foundries), it links to them and uses them under their own licenses. It never bundles them.
