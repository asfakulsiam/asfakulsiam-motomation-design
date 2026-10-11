# MOTION.md: Mati

Tier 2 (GSAP + ScrollTrigger from CDN, no Lenis, no pinning; sticky is CSS).

| Moment | What it tells | Tool | Reduced motion |
|---|---|---|---|
| Hero lines rise on load (clip mask, 700 ms, ease-out-strong) | what to read first | CSS keyframes | none, text visible |
| The Stitch (scrub): clip-path reveal of the stitched line + needle dot along the 3 stages | how far into the firing we are | ScrollTrigger scrub on the stage list | line fully stitched, needle hidden |
| Cup state (scrub, same trigger): fired / flame / glaze layer opacity via CSS variables | what changed in the cup | same timeline | final fired + glazed cup |
| Cart count pulse, Add button "Added" (160 ms / 1.2 s) | what changed | CSS | no pulse, text still changes |
| Cart dialog open | where it came from | CSS transition on transform (240 ms) | instant |

Easing: ease-out-strong for reveals, none inside the scrub. Touch: no hover-only content. Single scrub trigger, one pin-free sticky column.
