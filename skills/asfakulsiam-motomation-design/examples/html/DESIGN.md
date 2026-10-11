# DESIGN.md · motomation-film.html (demo)

The design record for the single-file Tier 5 demo. `scripts/gate.mjs` reads the Restraint Gate record below to derive the C and R critique axes of the demo's stamp.

## Concept
Scroll plays a film: the page is a reel, scrolling is the playhead.

## Collision
- Archetype: film-reel
- Mutation: tempo-shift
- Signature: timecode-rail (a running timecode and progress bar show where the visitor is in the film)
- Tier: 5

## Supporting details (not signatures)
- Proximity Weight on the hook headline: letters near a fine pointer get heavier. Kept as a supporting detail of the hook, not a second signature. It has no effect on touch or under reduced motion.

## Restraint Gate record
- Concept survived: yes
- Cut: Proximity Weight as a second signature — two signatures split attention; it stays only as a supporting hover detail on the hook, and the timecode rail is the one signature
