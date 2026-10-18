# Motion selection: the experience decides the technique

Motion gets the same research and selection as layout. No tool is the universal answer: not GSAP, not Motion (Framer Motion), not CSS, not Lenis, not WebGL. Choose by the experience being designed, the existing stack, and real performance and accessibility constraints. Then apply `motion/tokens.md` (the four questions) and the tier files for the how.

## 1. Classify every significant animation

| Class | Purpose | Rules |
|---|---|---|
| **Functional feedback** | press, hover, focus, selection, validation, toggles, add-to-cart confirmation | always present where it helps; fast (≤ 250ms), never blocks input, works with keyboard and touch |
| **Navigation and state transitions** | page-to-page continuity, opening a sheet, filtering a grid, expanding a row | communicates where something came from or went; interruptible; never delays the task |
| **Decorative** | ambient texture, idle loops, cursor flourishes | earns its place through the Restraint Gate; pausable if it loops; off under reduced motion |
| **Narrative and immersive** | scroll-told chapters, scrubbed sequences, 3D scenes | lives on storytelling surfaces, not task flows; has a designed still for reduced motion |

The experience must stay understandable with every decorative and narrative animation removed. Award-level motion does not mean animating everything; it means the right few things are exceptional.

## 2. Research the motion language

For the chosen direction, ask what motion should communicate, then look at how strong references do it (`craft/research.md`; `references/sources/motion.md`, `references/effects-vocabulary.md`, Codrops, case studies, official docs). Topics worth researching when the project has them:

- typography and text reveals · image and media transitions · scroll-linked storytelling · page transitions
- navigation and menu interactions · product discovery and filtering · hover, focus, selection and feedback states
- cursor interactions (desktop only, never essential) · SVG and vector animation · 3D and shaders (when the concept is spatial, material or lit)
- loading, skeleton and state transitions · microinteractions

Write the motion language in `MOTION.md` as a small set of named behaviours with timing and purpose, consistent across the site, rather than a different preset per section.

## 3. Choose the technique

Pick the lowest-cost technique that delivers the experience, inside the project's stack:

| Need | Usually enough | Reach further when |
|---|---|---|
| Feedback, hover, focus, simple reveals | CSS transitions and `@keyframes`, WAAPI | — |
| Same-page state changes, list reorder, shared elements | View Transitions API, FLIP (CSS or a small helper), Motion layout animations in React | the browser support matrix rules View Transitions out |
| Cross-page continuity | cross-document View Transitions (MPA), framework router transitions | a Tier 3 concept needs choreographed handoffs |
| Scroll-linked effects | CSS scroll-driven animations (`animation-timeline`) with a fallback | sequencing, pinning or scrubbing needs GSAP ScrollTrigger |
| Text splitting and kinetic type | CSS on hand-split spans | GSAP SplitText for line-aware splits |
| React component motion | Motion (Framer Motion) when the project already uses React | heavy timelines suit GSAP better |
| Illustrated or vector motion | SVG + CSS, Lottie or Rive for designer-made assets | — |
| Smooth scroll | native scroll | a scrubbed timeline genuinely needs sync; Lenis is optional (`principles/heuristics.md` → H-lenis) |
| Spatial, material, lit concepts | CSS 3D transforms | Three.js / OGL / shaders, with a static fallback and a performance check |

A library the project doesn't have is a dependency: it passes `craft/components.md`. Don't add GSAP for three fades, or WebGL for a gradient.

## 4. Guardrails

- **Respect reduced motion** with a designed still, not "animations off" (`principles/restraint.md` → Designed stills).
- **No scroll hijacking.** Native scroll speed, direction and keyboard paging keep working; pinned sections are short and escapable.
- **Restrained parallax:** small offsets, never on text the user is reading.
- **No perpetual distraction** near tasks; loops pause off-screen and on request.
- **Never block a task** with an animation: checkout, search, filtering and forms respond immediately.
- **Touch and keyboard paths** exist for every hover or cursor behaviour that carries meaning.

## 5. Validate in a real browser

Animation code is not evidence. Run the page: the gate's motion checks (`scripts/gate.mjs`), reduced motion emulated, a 4× CPU throttle on the heaviest chapter, a phone-sized viewport with touch, and keyboard-only navigation through each core journey. Record what was checked in `GATE.md`.
