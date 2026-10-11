# MOTION.md: Haveli 1893 (Tier 2)

| Moment | Trigger | Motion | Says |
|---|---|---|---|
| Hero doorway | load | leaves scaleX 1 → .16, 1.6s ease-out | you have arrived, the house is open |
| Room doors | row enters view, once | same swing, 0.9s, staggered | each room is a threshold |
| The house | enters | lines rise 24px + fade | text arrives |
| Breakfast | enters | text slides 32px in x | morning light from the side |
| Walks lane | scrub | stroke draws top to bottom | the walk is a path |
| Reduced motion | `prefers-reduced-motion: reduce` | no JS motion; doors drawn open, lane fully drawn | same content, still |
| Touch | no hover effects used | | |
