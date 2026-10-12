# DESIGN: Halo launch

- Concept: A dark room whose only light is the lamp; scroll turns the ring through 180 steps and each of three chapters relights the page.
- Archetype: stage, mutated by print marginalia (folio rail: frame and light). Collision: film leader 3-2-1 as "Light 1/3".
- Type mode: HOUSE STYLE (one object, one price). Instrument Serif display, Hanken Grotesk text.
- Palette: ink #0d0c0b, paper #f3ede4, muted #b9b0a4; accents are the lamp's three lights (#ffb067, #ffe6c8, #b8d4ff).
- Tier 4: one raw WebGL2 canvas, ring raymarched in a fragment shader, rendered on demand (no idle loop).

## Restraint Gate record
- Concept survived: yes
- Cut: Lenis smooth scroll — the scrub works with native scroll and keyboard intact
- Cut: price count-up — a number shown before it is corrected
- Cut: logo wall, feature grid, testimonials — no facts in the brief to fill them
- Rejected animation: cursor tilt on the ring — fails "what does it tell the user" (hover is not the touch control)
- Rejected animation: idle breathing glow loop — fails "should it move at all" (runs forever, off the scroll story)
