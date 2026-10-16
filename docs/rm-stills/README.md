# Reduced motion as its own composition (Tier 4 and the Tier 5 film)

Under `prefers-reduced-motion: reduce`, a Tier 4 background or a pinned film chapter must not be "the animation, stopped". It becomes a **still composition designed for stillness**: normal document flow, no pin, no `<canvas>` mounted, and a picture that says the same thing as the motion in a form that only works when it is still (a long exposure, a chart plate, a contact sheet).

Rules (each one checked by `tests/components/rm-stills.test.mjs` and, for pages, by the gate's Q axis `rm:`):

1. **No canvas, no pin.** Nothing is mounted that only exists to animate. A pinned chapter becomes a sequence in normal flow (gate: `rm:flow`; a still-pinned fallback fails as `rm:pinned`).
2. **Nothing changes.** The reduced-motion page is pixel-identical after 1 s (test: ≤ 0.5% of pixels change).
3. **Its own picture.** The still differs from the full-motion frame by at least 5% of the demo's pixels. A frozen first frame would differ by ~0%; meteors failed this at 0.9% (trails too faint to read as a photograph) and was redesigned to 17.5%.
4. **All the words.** Every caption and heading of the full-motion version is present (gate: `rm:text-missing` otherwise).

## Worked example: the Tier 5 film (`examples/html/motomation-film.html`)

Full motion: one pinned stage, a canvas scrubbed by scroll through four scenes (Darkness, Orbit, Exploded, Whole), a timecode rail, captions fading in over the frame.

Reduced motion: **a contact sheet**. The stage is unpinned and the four scenes are laid out as plates in normal flow, 14vh apart. Each plate is an `<img>` painted once from the film's own render at the scene's key moment (p = 0.05, 0.35, 0.62, 0.95) into a detached canvas that is never put in the document. The caption sits beside each plate in an 8 + 4 column split, set larger and uppercase like a storyboard slug. There is no rail and no timecode: there is nothing to scrub. The scene links still jump to each plate.

![Film: full motion vs reduced motion](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/motomation-film.webp?raw=true)

## Worked example: the Tier 4 template (`examples/templates/event.html`)

Full motion: the hero is the poster under moving stage light (Beams): soft shafts sweep across the dark; the date flips in on a split-flap board.

Reduced motion (v2.13): **one follow-spot**, a different picture. The rig runs across the top, and a single cone drops from one lamp onto an empty stage to the right of the title. It lands as a sharp oval pool, with dust only inside the light. The moving version is five shafts passing ("light passing"); the still is one fixed cone ("the stage is set"). The split-flap shows the date at once, in its tiles. The earlier still kept the same five shafts at the same angle and only hardened their edges, which read as the animation paused; it measured 47.1% different and passed the check below, so that number alone cannot tell a stopped frame from a new composition.

![Event: full motion vs reduced motion](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/event.webp?raw=true)

## Tier 4 backgrounds

| Component | Reduced-motion still | Canvas full → reduced | Still changes in 1 s | Differs from full motion |
|---|---|---|---|---|
| [aurora](../site/c/aurora.html) | A long-exposure plate: the curtains settle into three smooth ribbons of the same two colours over a dark ridge, under circular star trails. | 0 → 0 | 0% | 52.9% |
| [beams](../site/c/beams.html) | One follow-spot (v2.13; was the five shafts held hard-edged, which read as the animation paused): a single cone from the rig onto an empty stage, a sharp oval pool, dust only inside the light. | 0 → 0 | 0% | 44.2% |
| [globe](../site/c/globe.html) | A chart plate of the globe facing the first marker, drawn in line: graticule, rim, the markers ringed and joined. | 0 → 0 | 0% | 15.1% |
| [liquid-field](../site/c/liquid-field.html) | A marbled sheet: combed bands of the same three colours, like marbled paper keeping the trace of moving ink. | 1 → 0 | 0% | 65% |
| [mesh-gradient](../site/c/mesh-gradient.html) | A colour study: the four colours laid out as soft horizontal fields (horizon, body, ground) with a fine grain. | 0 → 0 | 0% | 69.9% |
| [meteors](../site/c/meteors.html) | The photograph an astronomer would take: an hour of star trails round the pole, the one meteor that crossed them, the sky glow of the nearest town and the ridge the camera stood on. | 0 → 0 | 0% | 17.5% |
| [particle-field](../site/c/particle-field.html) | A star chart: the motes keep their density and depth, and a few are joined into constellations. | 0 → 0 | 0% | 15.4% |

Each pair: [`aurora.webp`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/aurora.webp), [`beams.webp`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/beams.webp), [`globe.webp`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/globe.webp), [`liquid-field.webp`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/liquid-field.webp), [`mesh-gradient.webp`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/mesh-gradient.webp), [`meteors.webp`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/meteors.webp), [`particle-field.webp`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/rm-stills/particle-field.webp).

**Caveat about the left-hand images.** In the 2-CPU sandbox where these were taken, the WebGL backgrounds' own capability probe (≤ 2 cores, or software WebGL → poster only) shows their CSS poster in full motion, so for aurora, beams, globe, mesh-gradient, meteors and particle-field the comparison is poster vs reduced-motion still, not live frame vs still. On a 4+ core machine with hardware WebGL the left side is the live shader; the reduced-motion side is the same either way.

**Not verified here:** the P1 brief asks for judges to score these ≥ 4.0 in a motion-only rerun. That rerun is a benchmark run and was not run in this session (benchmarks run on GitHub Actions). The numbers above are measurements, not judge scores.

Reproduce: `node tests/components/rm-stills.test.mjs` (writes these images and `results.json`).
