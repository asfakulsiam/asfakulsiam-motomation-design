# Sources: Animation engines and motion references

> Concepts only. Read these for **method and principle**; never copy code, markup, shaders or assets into a build
> (`craft/research.md`). Status checked 2026-10-16 with the GitHub API (stars · last push · licence). Re-check before
> relying on one: a source that is archived, unlicensed or untouched for a year is a reference, never a dependency
> (dependencies are chosen in Step 0, `thinking/sequence.md`). Never use anything from CreativeAgencyStyle (reported as malware).

Read for **timing models and techniques**: timelines, springs, scroll-linked progress, page transitions, text splitting. Choose the engine in Step 0 with the dependency checks; take the technique from here.

| Source | What it is | What to take (a principle, not code) | Status |
|---|---|---|---|
| [`greensock/GSAP`](https://github.com/greensock/GSAP) | GSAP: timelines, ScrollTrigger, SplitText | timeline as the score; scrub to scroll progress, not to time | ★29,280 · pushed 2026-04-13 · no licence file |
| [`greensock/gsap-skills`](https://github.com/greensock/gsap-skills) | official GSAP skills for AI agents | correct GSAP use: cleanup, contexts, reduced motion | ★16,466 · pushed 2026-07-29 · MIT |
| [`motiondivision/motion`](https://github.com/motiondivision/motion) | Motion (formerly Framer Motion) for React and JS | layout animation and springs driven by state | ★34,177 · pushed 2026-10-16 · MIT |
| [`darkroomengineering/lenis`](https://github.com/darkroomengineering/lenis) | smooth scroll | scroll that stays native for keyboard, anchors and screen readers | ★16,575 · pushed 2026-10-15 · MIT |
| [`darkroomengineering/satus`](https://github.com/darkroomengineering/satus) | Next.js App Router starter for content sites | how an award-level studio structures a Next.js project | ★1,003 · pushed 2026-10-15 · MIT |
| [`theatre-js/theatre`](https://github.com/theatre-js/theatre) | motion design editor for the web | keyframed sequences edited visually and played in code | ★12,773 · pushed 2024-08-14 · Apache-2.0 · last push 2024: reference, not a dependency |
| [`rive-app/rive-wasm`](https://github.com/rive-app/rive-wasm) | Rive web runtime | state-machine animations: designed states, not tweens | ★1,000 · pushed 2026-10-16 · MIT |
| [`airbnb/lottie-web`](https://github.com/airbnb/lottie-web) | After Effects animations on the web | when an illustrator's motion should stay the illustrator's | ★32,239 · pushed 2025-09-01 · MIT |
| [`juliangarnier/anime`](https://github.com/juliangarnier/anime) | anime.js | lightweight timelines and staggers without a framework | ★73,639 · pushed 2026-08-21 · MIT |
| [`locomotivemtl/locomotive-scroll`](https://github.com/locomotivemtl/locomotive-scroll) | viewport detection and smooth scroll with parallax | scroll-position data exposed to CSS | ★8,877 · pushed 2026-06-30 · MIT |
| [`barbajs/barba`](https://github.com/barbajs/barba) | page transitions for multi-page sites | the transition as continuity between pages | ★12,999 · pushed 2024-12-02 · MIT · last push 2024 |
| [`swup/swup`](https://github.com/swup/swup) | page transitions for server-rendered sites | progressive enhancement: pages work without the transition | ★5,242 · pushed 2026-10-06 · MIT |
| [`formkit/auto-animate`](https://github.com/formkit/auto-animate) | drop-in transitions for list changes | animate add/remove/reorder so state changes are legible | ★13,934 · pushed 2026-07-10 · MIT |
| [`react-spring/react-spring`](https://github.com/pmndrs/react-spring) | spring physics animation for React | interruptible motion: springs keep velocity when the target changes | ★29,167 · pushed 2026-10-15 · MIT · now `pmndrs/react-spring` |
| [`lukePeavey/SplitType`](https://github.com/lukePeavey/SplitType) | split text into lines, words, characters | split for animation without breaking accessible text | ★733 · pushed 2023-12-03 · no licence file · last push 2023, no licence file: concept only |
| [`mojs/mojs`](https://github.com/mojs/mojs) | motion graphics toolbelt | bursts and shape motion for celebratory feedback | ★18,815 · pushed 2026-07-30 · MIT |
| [`flackr/scroll-timeline`](https://github.com/flackr/scroll-timeline) | ScrollTimeline polyfill | scroll-driven animations in CSS first; JS only where CSS can't | ★1,167 · pushed 2024-08-26 · Apache-2.0 · last push 2024 |
