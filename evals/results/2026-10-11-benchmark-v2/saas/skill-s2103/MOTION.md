# MOTION.md: Tracewell (Tier 2, MOTION 2)

| Where | What | Says | Tool | Reduced motion |
|---|---|---|---|---|
| Hero ledger | Lines start bright and dim top to bottom (0.05s stagger); key line keeps amber bar (scaleX) and contours draw | Noise goes quiet around one line | GSAP timeline | Final state, static |
| How it works | Active step lit, others muted as each crosses the viewport middle | One step at a time | ScrollTrigger | All steps lit |
| Terminal | Output lines appear in sequence once on enter (opacity + 6px y, 0.3s ease-out) | The tool answering | ScrollTrigger once | All visible |
| Result view | Rarity bars grow from left once (scaleX) | Ranking by unusualness | ScrollTrigger once | Full bars |
| Copy buttons | Label swap, 150ms | Feedback | CSS/JS | Same |

Easing: `power3.out`. Durations 0.3–0.6s. Touch: no hover-only behaviour. Everything is final-state in CSS; JS only animates *from* a start state, so a CDN failure leaves a complete page.
