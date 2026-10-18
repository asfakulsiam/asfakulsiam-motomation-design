# Rubric

## v5 exception
For benchmark v5, imagery is out of scope. Placeholders,
missing images, and text-only stand-ins are not penalised and
are not an automatic zero. Judges score structure,
typography, layout, motion, copy, and delivery — not imagery.
This overrides any rule below that treats placeholders or
missing images as a zero.

## Gates come first (v6, skill v3.0.0)

Score in this order. Each gate is pass / fail and is reported on its own line; a failed gate is never averaged away by the visual axes, and the visual total is reported only as "not scored (gate failed: …)" when one fails.

| Gate | Passes when | Evidence |
|---|---|---|
| **Product integrity** | every required route in the brief exists; every core journey completes; no control looks working without working; deferred capabilities keep their interface and are labelled; the concept did not remove, rename or merge a contract item without the brief allowing it | `completeness.mjs` (X), `journey.mjs` (J), the route list, a click-through |
| **Usability** | the primary action is reachable by keyboard and by thumb at 375 px; navigation is findable; forms validate and recover; text is readable | `journey.mjs`, screenshots at 375 and 1440 of each journey step |
| **Accessibility** | the hard gates below | `gate.mjs` (c o w rm a n q k) |
| **Content truth** | no invented statistics, logos, testimonials or capabilities; no template leaks or filler | `realism.mjs`, reading |

Then score the axes below. For v6 briefs, add to Concept: "the direction is traceable to the brief and the research record". For a paired brief (12a / 12b), also report whether the pair differs (`scripts/originality.mjs`, every axis under 0.4) while both keep the shared contract.

Score each axis 1–5. The weighted total is out of 100.

| Axis | Weight | 1 | 3 | 5 |
|---|---|---|---|---|
| **Concept** | 20 | No idea, just sections | An idea exists but isn't carried through | One clear idea, felt in every section |
| **Originality** | 20 | Indistinguishable from a template | Some fresh choices | Structure, type and signature are unexpected yet right |
| **Typography** | 15 | Default fonts and timid scale | Good choices, uneven craft | Type is the identity; details are perfect |
| **Motion** | 15 | Decorative or broken | Purposeful but generic | Motion tells the story; tier matches the concept |
| **Craft** | 15 | Visual bugs, misalignment | Mostly clean | Pixel-tight on desktop and mobile |
| **Access & performance** | 15 | Fails reduced motion, keyboard or contrast | Passes basics | Designed fallbacks; fast; nothing hidden from assistive tech |

Weighted total = Σ(score × weight) / 5.

**Evidence for Motion.** Stills can't show motion, so when a scroll-frame strip is available (8 viewport frames at even scroll steps, from the benchmark's `measure` step or `gate.mjs --report`), score Motion from it first: what changes between frames, whether the sequence progresses with scroll, and whether that serves the concept. Use the reduced-motion capture for the fallback. Easing and timing can't be judged from frames, so don't reward or punish them without a recording. The axes, anchors and weights above are unchanged.

## Hard gates (any failure = 0 for that run)
- Lorem ipsum, placeholder components or `TODO`s in the output
- Any animation without a reduced-motion path
- Body text contrast under 4.5:1
- Keyboard users can't reach the primary action
- Invented statistics, logos or testimonials

"Body text" for contrast purposes means any text at or above 16px that carries reading content. Small secondary labels, captions, and metadata below 16px are not body text and do not trigger a hard-gate contrast failure, though they should still be legible (3:1 minimum).
