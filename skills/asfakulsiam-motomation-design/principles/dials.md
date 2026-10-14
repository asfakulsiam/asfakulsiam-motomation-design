# The Three Dials

Every design sets three dials, each at **1, 2 or 3**. There are three levels, not ten, because a model and a reviewer can reliably tell calm from bold, but cannot reliably tell a 6 from a 7. Hold the dials from the first section to the last.

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
| 3 | Tier 5 for one chapter, Tier 2–3 elsewhere | 2–5 (Tier 4 only if the concept is spatial) |

## Where the settings come from

There are no presets. Each dial is set from the brief: what the visitor must do, how the brand should feel in the brief's own words, and what the concept needs. When a visual language helps, `styles/` is the reference: each row of `data/styles.csv` carries the energy, rhythm and motion that language usually runs at. Treat those as a starting point to argue with, not a value to copy.

Set dials directly with `--energy=3 --rhythm=2 --motion=3`.

## Levers (how dials become decisions)

- **One focal point per screen**, always, whatever the energy.
- **Hierarchy by contrast:** size, weight and colour differ on purpose.
- **Whitespace as structure:** space groups and separates; it is not leftover.
- **One accent moment:** zero accents is sterile; accent everywhere is noise.
- **One identity motif:** a gesture, a shape or a typographic habit that repeats and makes the site belong to its brand.

## Example settings

- Motion designer portfolio: ENERGY 3 · RHYTHM 2 · MOTION 3
- Boutique hotel: ENERGY 1 · RHYTHM 2 · MOTION 2
- Developer tool: ENERGY 2 · RHYTHM 1 · MOTION 2
- Government service: ENERGY 1 · RHYTHM 1 · MOTION 1
- Music festival: ENERGY 3 · RHYTHM 3 · MOTION 3
