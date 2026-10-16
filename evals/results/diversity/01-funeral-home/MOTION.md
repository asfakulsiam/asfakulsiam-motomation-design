# MOTION.md · Shanti Ghat Funeral Service

**Tier:** 2

One move: `.line` elements rise 0.6em and fade in (0.7 s, cubic-bezier(.2,.7,.2,1)), queued in DOM order 110 ms apart as they enter the viewport (feed.js, IntersectionObserver). Nothing loops, nothing is pinned, no scroll handlers. (First version clipped each line with clip-path; gate J showed a clipped link cannot be tapped, so the reveal became opacity + transform.)

**Reduced motion:** feed.js returns before adding `.feed`, so every line is visible and still from the first paint.
