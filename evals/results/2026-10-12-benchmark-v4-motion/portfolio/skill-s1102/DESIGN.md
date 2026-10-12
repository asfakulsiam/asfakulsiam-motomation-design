# DESIGN.md: Rafi, motion designer, Dhaka

## Concept
- **Tension:** A portfolio that wants to be hired for title sequences, but a page of stills can't show the one thing a title sequence does: pull the eye onto a name.
- **Concept sentence:** A site that opens like a title sequence, one projector pulling focus onto each project's name as you scroll, so the visitor sees the job Rafi wants.
- **Archetype + mutation:** Poster (one screen, one image) mutated by Single object: the whole site orbits one lens ring and its bokeh.
- **Collision:** darkroom enlarger (photography) → focus knob and projected light: the shader's blur is the focus control, and the title text blurs and sharpens with it.
- **Signature move:** Focus pull. Hero on load, once per project, once at the contact.
- **Dials:** ENERGY 2 · RHYTHM 2 · MOTION 3 → Tier 4 (forced by the run)
- **Rejected:** Showreel video grid (no footage in the brief); a marquee of project names (decoration).

## Typography
Type mode: HOUSE STYLE (typography-led), because a portfolio for a motion designer is judged on taste and titling.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Big Shoulders Display | 800–900, uppercase | min(36vw, 52svh) hero; min(23vw, 40svh) chapters | cinematic condensed; the title-card face |
| Body / labels | Switzer | 400, 500 | 1.0625rem / 0.875rem caps | disappears next to the display |

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | #0a0908 | n/a | projection-room dark |
| `--ink` | #efe8da | 16.3:1 | titles |
| `--muted` | #cdc4b2 | 5.6:1 on the brightest light pool | captions |
| `--accent` | #ffb03a | 10.9:1 | the light: shader, ring, link underline |

## Layout
- Grid: 12 columns; text hangs left, the lens ring sits right of centre.
- Chapters: 200svh sections with a CSS-sticky 100svh stage (no JS pin).
- Nav: none; one mail link top right, skip link.
- Footer (sign-off): name, role, city.

## Components
- Buttons: one text link with an amber underline that thickens on hover (150ms).
- Imagery: none sourced. The image is the shader; reduced motion gets SVG plates.
- `[NEEDS COPY]`: Rafi's email address (the brief says email only and gives none).

## Restraint Gate record
- Concept survived: yes
- Cut: a numeric focus readout (f-stop counter) — a live number with no job
- Cut: Lenis smooth scroll — native scroll keeps keyboard and anchors safe, and the lens carries the weight
- Cut: a nav bar with project links — three projects on one scroll don't need one
- Rejected animation: letter-by-letter title reveal — fails "what does it tell the user"; the focus pull already says it
- Rejected animation: custom cursor follower — a second signature move; the pointer only nudges the light
