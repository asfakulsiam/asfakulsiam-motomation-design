# The Three Dials

Every design sets three dials, each at **1, 2 or 3**. There are three levels, not ten, because a model and a reviewer can reliably tell calm from bold, but cannot reliably tell a 6 from a 7. Hold the dials across the site; a product may set them per route family (a store's launch story at MOTION 3, its checkout at MOTION 1), and says so.

| Dial | 1 (Calm) | 2 (Balanced) | 3 (Bold) | What it controls |
|---|---|---|---|---|
| **ENERGY** | Still, lots of air | Confident, clear contrast | Loud, huge type, strong colour moments | Type scale jumps, contrast, accent strength |
| **RHYTHM** | Uniform, predictable sections | Consistent with deliberate breaks | Every section a different composition | Layout variation, grid breaks, asymmetry |
| **MOTION** | Hover/focus/press only | Reveals, pinned moments, kinetic type | Scroll-as-film, choreography, WebGL | Motion tier and quantity |

## Dials → motion tier

| MOTION dial | Default tier | Allowed range |
|---|---|---|
| 1 | Tier 1 | 1 |
| 2 | Tier 2 | 1–3 |
| 3 | Tier 2–3; Tier 5 for a chapter only when the story has media to scrub | 2–5 (Tier 4 only if the concept is spatial) |

## Where the settings come from

There are no presets. Each dial is set from the brief: what the visitor must do, how the brand should feel in the brief's own words, and what the concept needs. When a visual language helps, `styles/` is the reference: each row of `data/styles.csv` carries the energy, rhythm and motion that language usually runs at. Treat those as a starting point to argue with, not a value to copy.

Set dials directly with `--energy=3 --rhythm=2 --motion=3`.

## Levers (how dials become decisions)

- **A clear first read per screen.** On storytelling screens that is usually one focal point (H-focal); on dense product screens it is a reading order (title → controls → results).
- **Hierarchy by contrast:** size, weight and colour differ on purpose.
- **Whitespace as structure:** space groups and separates; it is not leftover.
- **Disciplined accent:** zero accents is sterile; accent everywhere is noise (H-one-accent). Colour that carries information or brand is not accent.
- **An identity motif:** a gesture, a shape, a typographic habit or a system quality (density, rhythm, precision) that repeats and makes the site belong to its brand.

## Example settings

- Motion designer portfolio: ENERGY 3 · RHYTHM 2 · MOTION 3
- Boutique hotel: ENERGY 1 · RHYTHM 2 · MOTION 2
- Developer tool: ENERGY 2 · RHYTHM 1 · MOTION 2
- Government service: ENERGY 1 · RHYTHM 1 · MOTION 1
- Music festival: ENERGY 3 · RHYTHM 3 · MOTION 3
- B2B procurement catalogue: ENERGY 1 · RHYTHM 1 · MOTION 1 (identity from type and density)
- General marketplace: ENERGY 2 · RHYTHM 1 · MOTION 1–2 (storytelling only on campaign surfaces)

These are illustrations. The brief, the contract and research set the dials; `principles/heuristics.md` → H-rhythm explains when RHYTHM 3 hurts.
