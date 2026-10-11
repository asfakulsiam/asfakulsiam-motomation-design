# React Bits · selection

Which [React Bits](https://reactbits.dev) components this skill uses as a **reference library**, and at which motion tier. Checked against React Bits at commit `90b2750` (11 October 2026).

## Why reference, not vendor

React Bits is published under MIT + Commons Clause ([LICENSE.md](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md), © 2026 David Haz). It allows using the components *as part of an application, website, or product*, including commercial ones. It does **not** allow anyone to "sell, sublicense, or redistribute the components themselves, whether alone, in a bundle, or as a ported version". A skill repository that ships their source to every agent that installs it is a bundle of the components, whether or not anyone pays for it. So this skill holds **no React Bits code**. It holds the concept, the tier, the judgement, and a link.

There are two ways to use an effect in a project:

1. **Build it from the concept** (the default). Use the description in `INDEX.md`, the tier rules in `motion/`, and this skill's own examples. The result is original code in the user's project.
2. **Use the React Bits component in the project itself.** This means installing it into the user's site from React Bits' official registry or copying it from reactbits.dev into that project. Their licence allows this because the component becomes part of a website. Do this only when the user asks for that exact component, and keep their notice in the copied file.

## Selection rules

- Pick a component only if it covers a concept in `references/effects-vocabulary.md` that this skill has **no signature move for**.
- Skip components that duplicate a signature in `data/signatures.csv`. The signature is this skill's own version.
- Skip components the vocabulary already calls decoration or overused unless a brief proves the case: Aurora, Particles, Galaxy, Shiny Text, Gradient Text.

## Selected (19)

| Group | React Bits component | Vocabulary concept | Tier |
|---|---|---|---|
| Text | Split Text | Line rise | 2 |
| Text | Blur Text | Blur focus | 2 |
| Text | Text Pressure | Pressure type | 2 |
| Text | Scroll Float | Scroll float | 2 |
| Text | Split Flap Text | Split-flap | 2 |
| Text | Circular Text | Curved text | 1 |
| Text | Count Up | Count-up | 2 |
| Background | Noise | Grain | 1 |
| Background | Silk | Liquid field | 4 |
| Background | Dot Grid | Dot / grid field | 3 |
| Background | Dither | Dither / halftone | 4 |
| Cursor | Image Trail | Image trail | 2 |
| Cursor | Target Cursor | Target cursor | 2 |
| Cursor | Splash Cursor | Splash / fluid cursor | 4 |
| Cursor | Tilted Card | Tilt card | 2 |
| Scroll / layout | Dome Gallery | Dome / sphere gallery | 4 |
| Scroll / layout | Flowing Menu | Flowing menu | 2 |
| Scroll / layout | Dock | Dock | 2 |
| Micro | Click Spark | Click spark | 1 |

## Not selected, because a signature already covers it

| React Bits component | Covered by |
|---|---|
| Variable Proximity | `proximity-weight` |
| Decrypted Text, Scrambled Text | `decode` |
| Scroll Reveal | `ink-fill` |
| Scroll Velocity | `velocity-skew` |
| Magnet | `considerate-magnet` |
| Pixel Trail | `pixel-wake` |
| Scroll Stack | `stacked-deck` |
| Scroll Expand | `aperture` |
