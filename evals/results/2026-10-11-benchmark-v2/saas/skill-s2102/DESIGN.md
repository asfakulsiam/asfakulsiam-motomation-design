# DESIGN.md: Tracewell

## Concept
- **Tension:** millions of lines of noise ↔ one line that explains the incident (the on-call engineer is tired and wants the answer, not a dashboard).
- **Concept sentence:** A page that strikes out the noise, line by line, until one line is left standing.
- **Archetype + mutation:** Console (the product is the interface) mutated by "one weight only": every face is set at weight 400, so hierarchy comes from size, face, case and colour.
- **Collision:** typewriter → carriage return and ink strike: struck-through lines on paper tape. Drawn with `--seed 2102` (draw 2); the Atlas archetype was rejected for Console because the brief asks for the product working.
- **Signature move:** Ink Strike. A strike line is drawn through every ordinary log line, leaving the one that matters, which is marked in the accent. Hero first, echoed once in the `why` output of the pinned demo.
- **Dials:** ENERGY 2 · RHYTHM 1 · MOTION 2 → Tier 2
- **Override (house style → content-led):** the product UI is what the visitor came for, so the display scale is used only for the hook and plan names; product panels use the compact scale. Light paper ground with dark product panels instead of a dark page.
- **Rejected:** green-on-black terminal page (the dev-tool default); hero + logo wall; three feature icons; any metric.

## Typography
| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Instrument Serif | 400 (only weight it has) | `--step-4` | Human voice against machine output; contrast in one dimension (serif vs mono) |
| Heading | Instrument Serif | 400 | `--step-2` | |
| Body | Instrument Serif | 400 | `--step-0` (20px) | prose stays short |
| Mono / labels | Geist Mono | 400 | `--ui-0` / `--ui--1` | commands, logs, labels, tabular-nums |

Instrument Serif because the page is about a human explanation, and it ships one weight, which is the mutation. Geist Mono because it is a clean technical mono that carries logs and commands.

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #F1EEE6 | — | page background (paper) |
| `--ink` | #16140F | 15.87 | text, strike lines |
| `--muted` | #5A554B | 6.39 | secondary text, ground only |
| `--accent` | #B3270E | 5.64 | the found line, active step, focus ring |
| `--panel` | #16140F | — | product panels (terminal, result view) |
| `--panel-ink` | #ECE7DA | 14.91 on panel · 5.29 on accent | text in panels |
| `--panel-muted` | #A8A294 | 7.24 on panel | secondary text in panels only |

## Layout
- Grid: 12 columns, `minmax(0,1fr)` tracks; 20px gutters at 375, 48px at 1440.
- Section spacing: `clamp(4.5rem, 9vw, 8rem)`.
- Nav: masthead row, wordmark left, three anchor links right (wrap on phones).
- Footer (sign-off): one line, wordmark + one-sentence description + anchors.
- Grid break: the hero tape bleeds past the right margin; the pinned demo's step rail is narrow and the stage wide.

## Components
- Buttons: ink fill, paper text, 2px accent focus ring; copy buttons are mono, 44px tall.
- Links: underline in ink, accent on hover/focus.
- Cards: none. Panels only where the product is shown.
- Forms: none.

## Imagery
- Source: none. All imagery is built in HTML/CSS: the paper tape, the terminal session, the result view.
- `[NEEDS ASSET]` list: none.

## Restraint Gate record
- Concept survived: yes
- Cut: customer logo wall and testimonials — the brief has none, and invented proof is banned
- Cut: a performance/speed metrics strip — no usage numbers exist
- Cut: second display face and any accent beyond the vermilion — one face and one accent are enough
- Rejected animation: a looping log stream in the hero — fails "should it move at all": it runs forever and tells nothing the single strike doesn't
- Rejected animation: cursor-follow glow on the panels — fails "what does it tell the user"
