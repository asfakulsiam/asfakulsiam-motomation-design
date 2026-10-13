# Acknowledgements

Motomation Design is written and maintained by **asfakulsiam**. All code is original. Concept lineage for named components is credited below. An overlap check of the skill against the closest design skills (Impeccable, Hallmark, anti-slop, taste-skill, ui-ux-pro-max, Emil Kowalski's skills, design-motion-principles) found only boilerplate in common, such as a shared cubic-bezier value.

Like any design practice, it was shaped by studying the work of others. These are the ideas it learned from, named so you can go to the source.

## Ideas this skill borrowed and rewrote

| Source | What was borrowed | Where it shows up here |
|---|---|---|
| [i-have-adhd](https://github.com/ayghri/i-have-adhd) | The benchmark design: a blind judge from a different model family, a results page that keeps the failures visible, before/after evidence instead of claims | `evals/` |
| [Anthropic skill-creator](https://github.com/anthropics/skills) | Running the same brief with and without the skill on the same model, scored against a rubric | `evals/run-agent-benchmark.mjs`, `evals/rubric.md` |
| [Hallmark](https://github.com/Nutlope/hallmark) | Logging and stamping a page, indexing its structure rather than its IDs; extended here into structural fingerprints | `scripts/memory.mjs`, the stamp in `gates/delivery-gate.md` |
| [anti-slop](https://github.com/miqdadbadjuber/anti-slop) | The split between standards that never bend and defaults a brief can override; the dials; the purpose gate | `principles/dials.md`, `principles/restraint.md` |
| [Impeccable](https://github.com/pbakaus/impeccable) | Bounded checks: a check is only as strong as what it measures, and says what it skipped | `scripts/gate.mjs` |

## Lineage: studied and learned from

| Source | What it taught |
|---|---|
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Reading the design brief before styling, and dialling variance, motion and density instead of picking a theme |
| [Emil Kowalski](https://github.com/emilkowalski/skills) | Motion judgement: when not to animate, easing choice, interruptible UI motion |
| [design-motion-principles](https://github.com/kylezantos/design-motion-principles) | Auditing motion against named principles rather than taste alone |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Curated design data in CSV files with a ranked search over them; curated much smaller here |
| [awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) | `DESIGN.md` as a portable record of a design system |
| [Miguel Clavel](https://github.com/miguelclavel/interaction-recipes) | Small interaction moments that notice the visitor: pixel trails, sticker bursts, a list that remembers what you opened, brand-coloured selection, a curve carousel. Several signatures here are original takes on those ideas |
| [GSAP](https://github.com/greensock/GSAP) | The animation runtime for Tiers 3–5. Used under GSAP's own Standard License (free, including commercial use), not MIT |

## Concept lineage

45 of the 68 components share a name or an idea with a component in [React Bits](https://github.com/DavidHDev/react-bits) (MIT + Commons Clause), [Magic UI](https://github.com/magicuidesign/magicui) (MIT) or [Aceternity UI](https://ui.aceternity.com/components) (Aceternity licence). The idea came first from those libraries; the code here was written from scratch for this skill (props, reduced-motion path, touch behaviour, shared `_lib/motion.ts` helpers). No file, function or line was copied: a line-by-line comparison of six of these components against their upstream counterparts found 0 identical non-trivial lines. Upstream names were checked against each library's catalogue on 2026-10-13. Components not listed here (for example Ink Fill, Width Sprint, Darkroom Develop, Seismograph Line, Remembered List) have no upstream counterpart in these three libraries.

| Component | Upstream concept | Implementation |
|---|---|---|
| Blur Focus (`type/blur-focus`) | React Bits BlurText; Magic UI Blur Fade | independent implementation |
| Curved Text (`type/curved-text`) | React Bits CurvedLoop, CircularText; Magic UI Spinning Text | independent implementation |
| Decode (`type/decode`) | React Bits DecryptedText; Magic UI Hyper Text; Aceternity Encrypted Text | independent implementation |
| Pressure Type (`type/pressure-type`) | React Bits TextPressure, VariableProximity | independent implementation |
| Scroll Float (`type/scroll-float`) | React Bits ScrollFloat | independent implementation |
| Split Flap (`type/split-flap`) | React Bits SplitFlapText; Aceternity Text Flipping Board | independent implementation |
| ASCII Text (`text/ascii-text`) | React Bits ASCIIText; Aceternity ASCII Art | independent implementation |
| Glitch (`text/glitch`) | React Bits GlitchText | independent implementation |
| Rotating Words (`text/rotating-words`) | React Bits RotatingText; Magic UI Word Rotate; Aceternity Flip Words | independent implementation |
| Scramble on Hover (`text/scramble-on-hover`) | React Bits ScrambledText; Magic UI Hyper Text | independent implementation |
| Shiny Text (`text/shiny-text`) | React Bits ShinyText; Magic UI Animated Shiny Text | independent implementation |
| Typewriter (`text/typewriter`) | React Bits TextType; Magic UI Typing Animation; Aceternity Typewriter Effect | independent implementation |
| Stacked Deck (`scroll/stacked-deck`) | React Bits ScrollStack; Aceternity Card Stack | independent implementation |
| Velocity Marquee (`scroll/velocity-marquee`) | React Bits ScrollVelocity; Magic UI Scroll Based Velocity | independent implementation |
| Image Trail (`cursor/image-trail`) | React Bits ImageTrail | independent implementation |
| Lens (`cursor/lens`) | Magic UI Lens; Aceternity Lens | independent implementation |
| Pixel Wake (`cursor/pixel-wake`) | React Bits PixelTrail (and Miguel Clavel's pixel-trail, credited above) | independent implementation |
| Target Cursor (`cursor/target-cursor`) | React Bits TargetCursor; Aceternity Following Pointer | independent implementation |
| Tilt Card (`cursor/tilt-card`) | React Bits TiltedCard; Aceternity 3D Card Effect | independent implementation |
| Aurora (`backgrounds/aurora`) | React Bits Aurora; Aceternity Aurora Background | independent implementation |
| Beams (`backgrounds/beams`) | React Bits Beams; Aceternity Background Beams | independent implementation |
| Dot Field (`backgrounds/dot-field`) | React Bits DotField | independent implementation |
| Globe (`backgrounds/globe`) | Magic UI Globe; Aceternity 3D Globe, GitHub Globe | independent implementation |
| Grain (`backgrounds/grain`) | React Bits Noise; Magic UI Noise Texture | independent implementation |
| Meteors (`backgrounds/meteors`) | Magic UI Meteors; Aceternity Meteors | independent implementation |
| Particle Field (`backgrounds/particle-field`) | React Bits Particles; Magic UI Particles | independent implementation |
| Bento Reveal (`layout/bento-reveal`) | React Bits MagicBento; Magic UI Bento Grid; Aceternity Bento Grid | independent implementation |
| Curve Carousel (`layout/curve-carousel`) | React Bits CircularCarousel (and Miguel Clavel's curve-carousel, credited above) | independent implementation |
| Dock (`layout/dock`) | React Bits Dock; Magic UI Dock; Aceternity Floating Dock | independent implementation |
| Flowing Menu (`layout/flowing-menu`) | React Bits FlowingMenu | independent implementation |
| Animated List (`ui/animated-list`) | React Bits AnimatedList; Magic UI Animated List | independent implementation |
| Confetti (`ui/confetti`) | Magic UI Confetti | independent implementation |
| Device Mockup (`ui/device-mockup`) | Magic UI Safari, iPhone, Android | independent implementation |
| Glare Card (`ui/glare-card`) | React Bits GlareHover; Magic UI Glare Hover; Aceternity Glare Card | independent implementation |
| Glow Border (`ui/glow-border`) | React Bits BorderGlow; Magic UI Shine Border, Border Beam; Aceternity Glowing Effect | independent implementation |
| Icon Cloud (`ui/icon-cloud`) | Magic UI Icon Cloud | independent implementation |
| Orbiting Circles (`ui/orbiting-circles`) | Magic UI Orbiting Circles | independent implementation |
| Rainbow Border (`ui/rainbow-border`) | Magic UI Rainbow Button | independent implementation |
| Shimmer Button (`ui/shimmer-button`) | Magic UI Shimmer Button | independent implementation |
| Spotlight Card (`ui/spotlight-card`) | React Bits SpotlightCard; Aceternity Card Spotlight | independent implementation |
| Terminal (`ui/terminal`) | Magic UI Terminal; Aceternity Terminal | independent implementation |
| Click Spark (`micro/click-spark`) | React Bits ClickSpark | independent implementation |
| Count Up (`micro/count-up`) | React Bits CountUp; Magic UI Number Ticker | independent implementation |
| Hold to Commit (`micro/hold-to-commit`) | React Bits HoldButton | independent implementation |
| Squish Switch (`micro/squish-switch`) | React Bits SquishSwitch | independent implementation |

## Tools the skill points to

Where the skill points to outside tools (GSAP, Lenis, Three.js, Lottie, Rive, component libraries, font foundries), it links to them and uses them under their own licenses. It never bundles them.
