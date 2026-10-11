# DESIGN — Ittaghor Studio

Tension: houses are made of heavy, fixed brick ↔ everything the clients value is light, which never stays still.
Concept: A site where one hour-of-day dial moves the light across every plan and every wall, so brick is shown as the thing that holds the light.
Archetype: The Room (each project is a room you walk into), mutation "Wrong room": the structure of a sun almanac — one time dial governs every room.
Collision: thermal camera (heat shown as colour) → light shown as a warm band that crosses surfaces.
Signature: The Hour — one sticky dial; the sun band crosses the hero wall, each project image, and the lit area of each plan.
Dials: ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 2 (GSAP + ScrollTrigger, only for one clip reveal and the opening sweep).
Type: Instrument Serif (display, condensed warm serif at large size) / Instrument Sans (text).
Palette: paper #F3ECE1, ink #1F1814, brick #8F3D2A, sun #EDB560 (graphics only, never text).
Not doing: a masonry grid of project thumbnails with a centred hero and stock-photo look.

## Restraint Gate record
- Concept survived: yes
- Cut: Custom cursor — the dial is the only interaction that needs to be remembered
- Cut: Parallax on project images — it moved the picture, not the light
- Cut: Stroke-draw animation on plans — plans should be readable immediately, not performed
- Rejected animation: Auto-playing day loop — fails "does it tell the user something?" and keeps pixels changing
- Rejected animation: Fade-up on every section — fails "what does it explain?"
