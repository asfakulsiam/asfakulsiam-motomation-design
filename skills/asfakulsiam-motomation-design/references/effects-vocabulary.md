# Effects Vocabulary

A shared language for effects, so a designer and an agent mean the same thing. Each entry is a **concept**, described in this skill's own words, with the tier it needs and when it earns its place. The **In this skill** column points to this skill's own component (`examples/components/`, catalogue in `examples/components/README.md`), signature or example. Everything referenced here was written for this skill.

Find before build (see `SKILL.md`, step 6): for a standard effect, check the project's own components first, then this table and the component library, before writing it from scratch. The signature move is never swapped for a ready-made effect.

## Text effects

| Concept | What it does | Tier | Earns its place when | In this skill |
|---|---|---|---|---|
| Line rise | Lines slide up from behind masks | 2 | Default editorial reveal | `examples/animation/line-curtain.tsx` |
| Blur focus | Words sharpen from blur into focus | 2 | The concept is about clarity or focus | `examples/components/type/blur-focus.tsx` |
| Decode | Characters resolve from random glyphs | 2 | Technical, secret or data-led brands; short labels only | signature `decode` · `examples/components/type/decode.tsx` |
| Proximity weight | Weight/width follows cursor distance | 2 | Type-led identities; one word only | signature `proximity-weight` in `signatures/type-signatures.md` · `examples/typography/proximity-weight.tsx` |
| Pressure type | Letters stretch or compress toward the cursor | 2 | Playful, elastic brands | `examples/components/type/pressure-type.tsx` |
| Scroll float | Letters bob into place as they scroll in | 2 | Buoyant, light-hearted display lines | `examples/components/type/scroll-float.tsx` |
| Ink fill | Words fill from muted to ink while reading | 2 | Manifestos, about statements | signature `ink-fill` · `examples/components/type/ink-fill.tsx` |
| Velocity type | Text skews or widens with scroll speed | 2 | Sport, speed, launches | signature `velocity-skew` · `examples/components/scroll/velocity-marquee.tsx` · `examples/components/type/width-sprint.tsx` |
| Split-flap | Characters flip like a departure board | 2 | Schedules, menus, travel | `examples/components/type/split-flap.tsx` |
| Curved text | Text runs along a circle or path | 1–2 | Badges, stamps, seals | `examples/components/type/curved-text.tsx` |
| Text gradient sweep | A highlight runs across the text | 1 | A single key word, rarely | concept only (CSS `background-clip: text` with a moving gradient; one word) |
| Type film | A headline choreographed across a pinned chapter | 5 | Motomation hooks | `motion/tier-5-motomation.md` · `examples/html/motomation-film.html` |
| Neighbour moves | Each letter of a name has its own small move on hover, so the word feels like a cast | 2 | Light-hearted names and logotypes of 3–12 letters | `examples/components/type/neighbour-moves.tsx` |
| Letter relay | The hero name shrinks and travels into the header letter by letter as the first screen scrolls away | 2 | The name is the identity (portfolios, personal brands) | `examples/components/type/letter-relay.tsx` |

## Backgrounds and atmosphere

| Concept | What it does | Tier | Earns its place when | In this skill |
|---|---|---|---|---|
| Grain | Animated or static film noise | 1–2 | Analogue, photographic or warm brands | `examples/components/backgrounds/grain.tsx` |
| Liquid field | Flowing colour like silk or ink in water | 4 | The material is liquid, fabric or light | `examples/components/backgrounds/liquid-field.tsx` |
| Dot / grid field | A grid of dots or lines that reacts to the cursor | 2–4 | Technical, structural concepts | `examples/components/backgrounds/dot-field.tsx` |
| Aurora / light bands | Soft moving light | 4 | Night, sky, northern brands. Overused, needs a strong reason | `examples/components/backgrounds/light-sweep.tsx` (one band) · `motion/tier-4-max.md` |
| Dither / halftone | Images rendered as print dots | 2–4 | Print, retro, newspaper concepts | `examples/components/backgrounds/halftone.tsx` |
| Particles / galaxy | Fields of points in space | 4 | Space, data or scale concepts. Usually decoration | `motion/tier-4-max.md` |
| Shader distortion | Images ripple or bend on hover/scroll | 4 | Water, heat, memory | `motion/tier-4-max.md` |
| Contour lines | Topographic lines that drift slowly, like a map breathing | 2 | Land, climate, outdoors and mapping stories | `examples/components/backgrounds/contour-lines.tsx` |

## Cursor and interaction

| Concept | What it does | Tier | Earns its place when | In this skill |
|---|---|---|---|---|
| Image trail | Images spawn along the cursor path | 2 | Photographers, archives | `examples/components/cursor/image-trail.tsx` |
| Pixel wake | Pixel squares trail the cursor | 2 | Digital, pixel, retro concepts | signature `pixel-wake` · `examples/components/cursor/pixel-wake.tsx` |
| Lens | A circle reveals an alternate layer | 2 | Before/after, sketch/final, day/night | signature `lens` · `examples/components/cursor/lens.tsx` |
| Magnet | Elements lean toward the cursor | 2 | 1–2 primary actions only | signature `considerate-magnet` in `signatures/cursor-and-micro-signatures.md` · `examples/micro-interactions/magnetic-button.tsx` |
| Target cursor | The cursor locks to interactive elements | 2 | Precision tools, games | `examples/components/cursor/target-cursor.tsx` |
| Splash / fluid cursor | The cursor stirs a fluid simulation | 4 | Liquid concepts only | `motion/tier-4-max.md` (Tier 4 only) |
| Tilt card | Cards rotate in 3D toward the cursor | 2 | Physical objects (cards, tickets, products) | `examples/components/cursor/tilt-card.tsx` |
| Seismograph line | A hairline divider bends toward the cursor and springs back with a small wobble | 2 | One living detail on a calm editorial page; sound and measurement brands | `examples/components/cursor/seismograph-line.tsx` |

## Scroll

| Concept | What it does | Tier | Earns its place when | In this skill |
|---|---|---|---|---|
| Aperture | The next section opens through a growing circle or door shape as you scroll into it | 2 | A real threshold: entering a room, a lens, a reveal of the product | `examples/components/scroll/aperture.tsx` |
| Darkroom develop | A photo develops from blank paper (pale, then contrast, then tone) as it scrolls in | 2 | Photography, archives, memory, analogue brands | `examples/components/scroll/darkroom-develop.tsx` |
| Thread | One line draws itself down the page with scroll, linking sections like a seam or a route | 2 | Journeys, timelines, craft and process pages | `examples/components/scroll/thread.tsx` |
| Reading rail | A thin rail fills as you read the article | 1 | Long reads and documentation | `examples/components/scroll/reading-rail.tsx` |

## Layout and galleries

| Concept | What it does | Tier | Earns its place when | In this skill |
|---|---|---|---|---|
| Stacked deck | Sticky cards stack while scrolling | 2 | Sequences and case studies | signature `stacked-deck` · `examples/components/scroll/stacked-deck.tsx` |
| Horizontal reel | Vertical scroll drives a horizontal strip | 2 | Film, gallery, timeline concepts | signature `horizontal-reel` · `examples/components/scroll/horizontal-reel.tsx` |
| Dome / sphere gallery | Images on a 3D sphere you drag | 4 | Exploration, archives | `motion/tier-4-max.md` (Tier 4 only) |
| Curve carousel | Cards ride a curved path, the focused one in front | 2 | Case studies, products | `examples/components/layout/curve-carousel.tsx` |
| Infinite canvas | Drag to pan an endless grid of work | 2–4 | Gallery Wall archetype | Gallery Wall archetype · `examples/components/layout/infinite-canvas.tsx` |
| Bento | A modular grid of mixed tiles | 1 | Only when content truly has mixed weights. Overused | `examples/components/layout/bento-reveal.tsx` |
| Flowing menu | Menu items reveal a marquee image on hover | 2 | Portfolio and studio navigation | `examples/components/layout/flowing-menu.tsx` |
| Dock | Icons magnify near the cursor | 2 | App-like tool collections | `examples/components/layout/dock.tsx` |
| Sticky index | A side index highlights the section being read, with a marker that slides between entries | 1 | Long case studies, reports and documentation | `examples/components/layout/sticky-index.tsx` |

## Micro-interactions

| Concept | What it does | Tier | Earns its place when | In this skill |
|---|---|---|---|---|
| Hold to commit | Press and hold fills, then confirms | 1–2 | Important, irreversible actions | signature `hold-to-commit` · `examples/components/micro/hold-to-commit.tsx` |
| Count-up | Numbers count to their value | 2 | Real figures with sources only | `examples/components/micro/count-up.tsx` |
| Click spark | Small burst on click | 1 | Playful brands; rarely | `examples/components/micro/click-spark.tsx` |
| Sticker scatter | Logo bursts into stickers | 2 | Light-hearted personal sites | signature `sticker-scatter` · `examples/components/micro/sticker-scatter.tsx` |
| Squish switch / jelly radio | Elastic toggles | 1–2 | Light-hearted products | `examples/components/micro/squish-switch.tsx` · `motion/tier-1-basic.md` |
| Swipe to confirm | Slide to commit an action | 2 | Mobile-first flows | `motion/tier-2-intermediate.md` · `craft/accessibility.md` (keep a tap alternative) |

Use this vocabulary in briefs and critiques: "Replace the aurora background with a grain + lens concept tied to the darkroom idea."
| Remembered list | Links you have opened get a quiet tick, remembered on this device | 1 | Archives, project lists and course modules people return to | `examples/components/micro/remembered-list.tsx` |
| Brand selection | Text selection uses the accent and ground instead of the browser blue | 1 | Almost always, if the pair passes 4.5:1 | `examples/components/micro/brand-selection.tsx` |
| Copy confirm | A copy button morphs its icon into a tick and says "Copied" for two seconds | 1 | Install commands, codes, email addresses | `examples/components/micro/copy-button.tsx` |

