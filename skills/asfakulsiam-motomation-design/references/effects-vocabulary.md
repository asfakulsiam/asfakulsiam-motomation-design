# Effects Vocabulary

A shared language for effects, so a designer and an agent mean the same thing. Each entry is a **concept**, described in this skill's own words, with the tier it needs and when it earns its place. Many of these ideas are popular in open-source effect libraries such as React Bits (reactbits.dev). The **Reference** column links every concept to this skill's own signature or example, or to its React Bits page; `references/react-bits/INDEX.md` adds tier, cost, slop warnings and reduced-motion behaviour for the 19 React Bits components this skill relies on.

React Bits is a reference library here, not a dependency. Its licence (MIT + Commons Clause) forbids redistributing the components themselves, alone or in a bundle, so this skill never contains their source; that is a licence term, not a style preference. Build the concept yourself (the default), or, when the user wants the exact component, install or copy it into **their project** from reactbits.dev with its notice kept. See `references/react-bits/SELECTION.md`.

## Text effects

| Concept | What it does | Tier | Earns its place when | Reference |
|---|---|---|---|---|
| Line rise | Lines slide up from behind masks | 2 | Default editorial reveal | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/text-animations/split-text) |
| Blur focus | Words sharpen from blur into focus | 2 | The concept is about clarity or focus | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/text-animations/blur-text) |
| Decode | Characters resolve from random glyphs | 2 | Technical, secret or data-led brands; short labels only | signature `decode` in `signatures/type-signatures.md` |
| Proximity weight | Weight/width follows cursor distance | 2 | Type-led identities; one word only | signature `proximity-weight` in `signatures/type-signatures.md` · `examples/typography/proximity-weight.tsx` |
| Pressure type | Letters stretch or compress toward the cursor | 2 | Playful, elastic brands | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/text-animations/text-pressure) |
| Scroll float | Letters bob into place as they scroll in | 2 | Play mood display lines | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/text-animations/scroll-float) |
| Ink fill | Words fill from muted to ink while reading | 2 | Manifestos, about statements | signature `ink-fill` in `signatures/type-signatures.md` |
| Velocity type | Text skews or widens with scroll speed | 2 | Sport, speed, launches | signature `velocity-skew` in `signatures/scroll-signatures.md` |
| Split-flap | Characters flip like a departure board | 2 | Schedules, menus, travel | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/text-animations/split-flap-text) |
| Curved text | Text runs along a circle or path | 1–2 | Badges, stamps, seals | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/text-animations/circular-text) |
| Text gradient sweep | A highlight runs across the text | 1 | A single key word, rarely | [React Bits](https://reactbits.dev/text-animations/gradient-text) |
| Type film | A headline choreographed across a pinned chapter | 5 | Motomation hooks | `motion/tier-5-motomation.md` · `examples/html/motomation-film.html` |

## Backgrounds and atmosphere

| Concept | What it does | Tier | Earns its place when | Reference |
|---|---|---|---|---|
| Grain | Animated or static film noise | 1–2 | Analogue, photographic or warm moods | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/animations/noise) |
| Liquid field | Flowing colour like silk or ink in water | 4 | The material is liquid, fabric or light | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/backgrounds/silk) |
| Dot / grid field | A grid of dots or lines that reacts to the cursor | 2–4 | Technical, structural concepts | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/backgrounds/dot-grid) |
| Aurora / light bands | Soft moving light | 4 | Night, sky, northern brands. Overused, needs a strong reason | [React Bits](https://reactbits.dev/backgrounds/aurora) |
| Dither / halftone | Images rendered as print dots | 2–4 | Print, retro, newspaper concepts | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/backgrounds/dither) |
| Particles / galaxy | Fields of points in space | 4 | Space, data or scale concepts. Usually decoration | [React Bits](https://reactbits.dev/backgrounds/particles) · [React Bits](https://reactbits.dev/backgrounds/galaxy) |
| Shader distortion | Images ripple or bend on hover/scroll | 4 | Water, heat, memory | [React Bits](https://reactbits.dev/animations/ripple-distortion) · `motion/tier-4-max.md` |

## Cursor and interaction

| Concept | What it does | Tier | Earns its place when | Reference |
|---|---|---|---|---|
| Image trail | Images spawn along the cursor path | 2 | Photographers, archives | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/animations/image-trail) |
| Pixel wake | Pixel squares trail the cursor | 2 | Digital, pixel, retro concepts | signature `pixel-wake` in `signatures/cursor-and-micro-signatures.md` |
| Lens | A circle reveals an alternate layer | 2 | Before/after, sketch/final, day/night | signature `lens` in `signatures/cursor-and-micro-signatures.md` |
| Magnet | Elements lean toward the cursor | 2 | 1–2 primary actions only | signature `considerate-magnet` in `signatures/cursor-and-micro-signatures.md` · `examples/micro-interactions/magnetic-button.tsx` |
| Target cursor | The cursor locks to interactive elements | 2 | Precision tools, games | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/animations/target-cursor) |
| Splash / fluid cursor | The cursor stirs a fluid simulation | 4 | Liquid concepts only | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/animations/splash-cursor) |
| Tilt card | Cards rotate in 3D toward the cursor | 2 | Physical objects (cards, tickets, products) | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/components/tilted-card) |

## Layout and galleries

| Concept | What it does | Tier | Earns its place when | Reference |
|---|---|---|---|---|
| Stacked deck | Sticky cards stack while scrolling | 2 | Sequences and case studies | signature `stacked-deck` in `signatures/scroll-signatures.md` |
| Horizontal reel | Vertical scroll drives a horizontal strip | 2 | Film, gallery, timeline concepts | signature `horizontal-reel` in `signatures/scroll-signatures.md` |
| Dome / sphere gallery | Images on a 3D sphere you drag | 4 | Exploration, archives | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/components/dome-gallery) |
| Curve carousel | Cards ride a curved path, the focused one in front | 2 | Case studies, products | [miguelclavel/curve-carousel](https://github.com/miguelclavel/curve-carousel) (MIT) |
| Infinite canvas | Drag to pan an endless grid of work | 2–4 | Gallery Wall archetype | Gallery Wall archetype in `structures/archetypes.md` |
| Bento | A modular grid of mixed tiles | 1 | Only when content truly has mixed weights. Overused | [React Bits](https://reactbits.dev/components/magic-bento) |
| Flowing menu | Menu items reveal a marquee image on hover | 2 | Portfolio and studio navigation | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/components/flowing-menu) |
| Dock | Icons magnify near the cursor | 2 | App-like tool collections | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/components/dock) |

## Micro-interactions

| Concept | What it does | Tier | Earns its place when | Reference |
|---|---|---|---|---|
| Hold to commit | Press and hold fills, then confirms | 1–2 | Important, irreversible actions | signature `hold-to-commit` in `signatures/cursor-and-micro-signatures.md` |
| Count-up | Numbers count to their value | 2 | Real figures with sources only | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/text-animations/count-up) |
| Click spark | Small burst on click | 1 | Playful brands; rarely | `references/react-bits/INDEX.md` · [React Bits](https://reactbits.dev/animations/click-spark) |
| Sticker scatter | Logo bursts into stickers | 2 | Play mood, personal sites | signature `sticker-scatter` in `signatures/cursor-and-micro-signatures.md` |
| Squish switch / jelly radio | Elastic toggles | 1–2 | Play mood products | `motion/tier-1-basic.md` · `motion/tokens.md` |
| Swipe to confirm | Slide to commit an action | 2 | Mobile-first flows | `motion/tier-2-intermediate.md` · `craft/accessibility.md` (keep a tap alternative) |

Use this vocabulary in briefs and critiques: "Replace the aurora background with a grain + lens concept tied to the darkroom idea."
