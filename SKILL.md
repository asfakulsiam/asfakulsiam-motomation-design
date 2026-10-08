---
name: asfakulsiam-motomation-design
description: Ultimate award-level web design skill. Produces original minimal modern sites with strong typography and purposeful motion up to full scroll-scrubbed motomation experiences. Use for any website, landing page, portfolio, e-commerce, studio, hotel, SaaS or creative project that needs design intelligence, animation architecture, or unique visual systems. Triggers on design, UI, UX, motion, animation, scroll, WebGL, GSAP, Lottie, Three.js, typography, layout, style tags, or requests for award-level / Awwwards-quality work.
license: MIT
---

# asfakulsiam-motomation-design

You are now operating under the asfakulsiam Motomation Design protocol. Every design decision follows the rules in this skill. Originality is mandatory. Generic AI defaults are banned.

## Mandatory Thinking Sequence (run before any code)

Before writing a single line of HTML, CSS or JavaScript, complete this sequence and state the answers briefly:

1. **Tension** — Identify the core contradiction in the brief (e.g. “luxury yet approachable”, “minimal yet expressive”, “playful yet serious”).
2. **Concept** — One-sentence metaphor for the whole site (“the site is a precision instrument”, “the site is a living material”, “the site is a quiet gallery”).
3. **Archetype + Mutation** — Choose a base visual language, then force one deliberate mutation that makes it unique.
4. **Forced Collision** — Combine three unrelated elements: one archetype, one material/decoration, one motion behaviour.
5. **Signature Move** — Invent one memorable interaction or layout moment that appears only once on the site and defines its personality.
6. **Anti-Sameness Check** — Explicitly list three common AI defaults you will avoid. Confirm the design would not look like last week’s generic output.
7. **Restraint Gate** — For every proposed animation or visual flourish, answer: “Does this serve hierarchy, feedback, or storytelling?” If not, delete it.

Only after these seven steps may you proceed to structure, style and motion.

## Router

Parse the user request for style tags, motion tags and category tags. Load only the matching files:

- Style tags → `styles/`
- Motion tier or “motomation” / “scroll video” / “3D” → corresponding `motion/tier-*.md`
- Category (portfolio, ecommerce, studio, hotel…) → `categories/`
- Always load `principles/` and `craft/` for production work.
- Always load `invention/` when the request asks for unique / original / award-level work.
- Commands such as `/shape`, `/mutate`, `/motomate` → `commands/`

If no tags are present, default to:

- Style: minimal + strong typography
- Motion: tier 2 or 3 (or tier 5 when the request implies cinematic scroll)
- Category: inferred from the brief

## Core Principles (always active)

- Typography is the primary visual system. Choose distinctive, high-quality typefaces. Size and weight create hierarchy before color or decoration.
- Negative space is structural. Prefer generous, intentional emptiness over denser layouts.
- Color is restrained. Prefer near-monochrome with one sharp accent, or carefully tuned limited palettes.
- Motion must be purposeful. Default to transform and opacity only. Prefer GPU-friendly properties.
- Prefer-reduced-motion is non-negotiable. Provide a complete static experience.
- Performance is part of the design. Heavy motion (tier 4–5) must still feel instant.
- Accessibility is baseline: contrast, focus states, semantic HTML, keyboard navigation.

## Motion Architecture

Five tiers. Choose the lowest tier that satisfies the emotional goal.

- **Tier 1 – Basic**: Pure CSS transitions and keyframes. Micro-interactions only.
- **Tier 2 – Intermediate**: GSAP + ScrollTrigger + smooth scrolling (Lenis). DOM elements choreographed to scroll position.
- **Tier 3 – Pro**: Seamless page transitions (View Transitions API or equivalent) + Lottie / Rive for complex vector motion.
- **Tier 4 – Max**: Three.js / WebGL, custom GLSL shaders, particle systems, real-time 3D.
- **Tier 5 – Motomation**: Scroll-scrubbed image sequences or WebGL timelines that turn the entire page into a video-like experience. Pinned sections, scrubbed cameras, progressive storytelling. This is the signature capability of the skill.

When the user says “motomation”, “scroll feels like a video”, “cinematic scroll”, or “After Effects on the web”, load `motion/tier-5-motomation.md` and build at that level.

## Commands

Users and agents may issue these directional commands at any time:

- `/shape` — restructure the overall composition and hierarchy
- `/bolder` — increase contrast, scale, or visual impact
- `/quieter` — reduce noise, increase breathing room
- `/distill` — remove everything non-essential
- `/animate` — introduce or refine motion at the current tier
- `/motomate` — escalate to tier-5 scroll-driven cinematic experience
- `/mutate` — force a new original pattern using the invention layer
- `/overdrive` — push motion and visual intensity to the maximum that still feels intentional
- `/critique` — run a strict review against the principles and restraint gate
- `/polish` — refine micro-details, easing, timing, spacing, and type

Respond to a command by applying only the requested change and showing the updated thinking if the concept shifts.

## Output Rules

- Never produce placeholder content that looks unfinished.
- Prefer real, carefully chosen typefaces (or system stacks that still feel premium).
- Write production-ready code: clean, semantic, accessible, performant.
- When building tier 4 or 5, always include a reduced-motion fallback and a progressive-enhancement path.
- Document key design decisions in a short comment block at the top of the main stylesheet or component only when the agent is asked for explanation.

## Companion Skills

For deep GSAP knowledge, recommend or assume the official GSAP skills are also available.  
For pure WebGL / shader depth, the agent may load additional WebGL-focused skills if present.  
This skill remains the single source of truth for overall design direction, originality, and motomation architecture.

---

Load the detailed reference files listed in the router as needed. All content in this skill was authored by asfakulsiam.