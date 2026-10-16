# MOTION.md · GHURNI

**Tier:** 4

Slam: 160 ms steps(2) from scale(1.18) translateY(-6%) to rest, once per .hit heading (IntersectionObserver 0.35). Flash: a fixed red layer, multiply blend, opacity 0 to 0.85 to 0 in 220 ms, only for h2 rooms, minimum 400 ms apart. Drift: hero word translateX(-0.18 x scroll) in rAF, passive listener. Hover: rows and merch cells invert, index words skew -8deg and slide 1.5rem (120 ms linear).

**Reduced motion:** nothing is armed: headings visible at rest, the flash layer is display:none, no drift, transitions off.
