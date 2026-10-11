# DESIGN.md: Mati (ceramics shop)

## Concept
- **Tension:** Slow wood-fired objects (days of stacking, firing, cooling) ↔ a visitor who wants to buy in two taps.
- **Concept sentence:** Buying is instant and prints a receipt line; the story is slow and is read backwards, from the cup in your hand to the fire that marked it.
- **Archetype + mutation:** The Letter (a note from Rina and Sohel) mutated by "invert the axis: time runs backwards" (the firing is told last step first).
- **Collision:** Receipt printer (retail) → paper feeding line by line.
- **Signature move:** Every add-to-cart prints a line of paper from the header slip; the same slip is the cart.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 2 → Tier 2
- **Rejected:** Product-grid-with-carousel storefront with a spinning cup turntable.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Fraunces | 600, opsz 144, SOFT 100 | `clamp(3.4rem, 11vw, 9.5rem)` | warm, soft old-style; falls back to Hind Siliguri for ৳ |
| Heading | Fraunces | 500 | `clamp(2rem, 5vw, 4rem)` | |
| Body | Instrument Sans | 400 | 1.0625rem | |
| Mono / labels | DM Mono | 400 | 0.8125rem | receipt, log, metadata |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #EDE6DA | — | ash paper |
| `--ink` | #1F1A16 | >14:1 | text |
| `--muted` | #5E544A | 5.3:1 on #E2D9C9 | secondary text |
| `--accent` | #A63A18 | 5.23:1 | ember: buttons, firing bar |
| `--kiln` | #1B1511 | text #EDE6DA | firing log ground |

## Layout
- Grid: two-column hero (text / cup), single-column log rows, receipt-style leader rows for the shelf.
- Margins / gutters: 5vw / 24px.
- Section spacing: 96–160px.
- Nav: wordmark, two anchors (from 480px), Receipt button with count.
- Footer (sign-off): made by Rina and Sohel, Rajshahi.

## Components
- Buttons: flat, 2px radius, ember fill, 48px tall.
- Links: underlined.
- Cards (only if needed): none; shelf is a ruled list.
- Forms: none.

## Imagery
- Source: inline SVG ware (cup, plate, vase, jug, bowls) with ash-glaze gradient and per-piece flame mark.
- Treatment: flat, one gradient pair.
- `[NEEDS ASSET]` list: real photographs of the pieces.

## Restraint Gate record
- Concept survived: yes
- Cut: second display face — one serif is enough for the concept
- Cut: customer reviews and "as seen in" strip — the brief has none, and inventing them is banned
- Cut: per-product detail pages and filters — six products fit one ruled list, and buying stays two taps
- Rejected animation: spinning cup turntable — fails "what does it tell the user" (it only decorates)
- Rejected animation: hover tilt on shelf rows — fails "should it move at all" (seen many times, tells nothing)
- Rejected animation: parallax on the hero cup — fails "what does it tell the user"
- Rejected animation: fade-up on every section — fails "what does it tell the user"
