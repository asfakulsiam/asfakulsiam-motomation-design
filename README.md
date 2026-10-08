# asfakulsiam-motomation-design

**Ultimate award-level web design skill for AI agents and humans.**

Author: **asfakulsiam**  
GitHub: [asfakulsiam](https://github.com/asfakulsiam)

This skill turns any coding agent (Claude, Cursor, Codex, v0, Lovable, Google AI Studio, Antigravity, Grok, ChatGPT, and 60+ others) into a senior design engineer who produces original, minimal, modern, typographically strong, and deeply animated websites. The signature capability is **motomation** — scroll-driven experiences that feel like watching a high-end After Effects film while the user scrolls.

It forces unique thinking every time through a mandatory design-thinking sequence, so output never collapses into generic templates.

## What this skill delivers

- Complete design principles (typography, layout, color, hierarchy, restraint)
- Full aesthetic languages: minimal, flat, neobrutalism, neumorphism, glassmorphism, editorial, and more
- Five motion tiers from pure CSS micro-interactions up to scroll-scrubbed 3D video-like sequences
- Category-specific systems (portfolio, e-commerce, studio, hotel, SaaS, nonprofit, landing, magazine…)
- Craft layer: responsiveness, performance, reduced-motion, accessibility
- Invention layer: original pattern generation so every site feels like a mad artist’s unique work
- Command vocabulary for iterative direction (`/shape`, `/motomate`, `/mutate`, `/overdrive`…)
- Searchable data for styles, palettes, type pairings, and categories

Primary aesthetic target: **minimal · modern · unique · strong typography · heavy but purposeful motion · motomation**

## Install

Requires Node.js 18+.

```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design
```

Or with full URL:

```bash
npx skills add https://github.com/asfakulsiam/asfakulsiam-motomation-design
```

Target specific agents:

```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design --agent claude-code
npx skills add asfakulsiam/asfakulsiam-motomation-design --agent cursor
npx skills add asfakulsiam/asfakulsiam-motomation-design --agent '*'
```

Install only the main skill if the CLI asks:

```bash
npx skills add asfakulsiam/asfakulsiam-motomation-design --skill asfakulsiam-motomation-design
```

After install the skill appears in the agent’s skills directory and is automatically loaded when the conversation involves web design, UI, motion, or landing pages.

### Manual install (any agent)

Copy the entire repository into the agent’s skills folder, or paste the contents of `SKILL.md` + relevant reference files into the system prompt / project rules.

Supported environments include Claude Code, Cursor, Windsurf, Codex, Antigravity, v0, Lovable, Google AI Studio, and every agent that understands the Agent Skills format or `AGENTS.md`.

## How to use

### Basic invocation

Just describe the project. The skill activates automatically when the request involves design, layout, animation, or website building.

Examples:

- “Build a portfolio site for a motion designer using motomation”
- “Create an e-commerce landing page, minimal + strong type + scroll video feel”
- “Studio website, glassmorphism, tier-4 motion”
- “Hotel site that feels like a cinematic scroll experience”

### Tag / command style

You can steer with tags or slash commands:

```
/flat + micro
/minimal + motomation
/neobrutalism + overdrive
/mutate
/shape
/quieter
/bolder
/distill
/critique
/polish
/motomate
```

The router in `SKILL.md` parses these and loads only the needed reference files.

### Recommended workflow for agents

1. Read the brief.
2. Run the mandatory **thinking sequence** (see `thinking/`).
3. Choose style + motion tier + category.
4. Apply restraint gate before any animation.
5. Build.
6. Run `/critique` or `/polish` if needed.

### Motion tiers at a glance

| Tier | Name              | Technology                  | Feel                          |
|------|-------------------|-----------------------------|-------------------------------|
| 1    | Basic             | Pure CSS                    | Micro-interactions            |
| 2    | Intermediate      | GSAP + ScrollTrigger + Lenis| Scroll-linked DOM choreography|
| 3    | Pro               | View Transitions + Lottie/Rive | App-like page morphs       |
| 4    | Max               | Three.js + GLSL shaders     | Real-time 3D / particles      |
| 5    | Motomation        | Scroll-scrubbed canvas/WebGL + pinned timelines | Full video-like experience while scrolling |

Tier 5 is the signature of this skill.

## File map

```
asfakulsiam-motomation-design/
├── SKILL.md                 ← main router + thinking protocol
├── AGENTS.md                ← same core for agents that prefer AGENTS.md
├── README.md                ← this file
├── thinking/                ← how a designer thinks (tension → concept → collision → signature)
├── principles/              ← typography, layout, color, hierarchy, restraint
├── styles/                  ← minimal, flat, neobrutalism, neumorphism, glass…
├── motion/
│   ├── tier-1-basic.md
│   ├── tier-2-intermediate.md
│   ├── tier-3-pro.md
│   ├── tier-4-max.md
│   └── tier-5-motomation.md
├── categories/              ← portfolio, ecommerce, studio, hotel, saas…
├── craft/                   ← responsive, performance, a11y, reduced-motion
├── invention/               ← mad-artist rules for original patterns
├── commands/                ← detailed command definitions
├── data/                    ← searchable CSVs + search helper
├── agents/                  ← short notes for specific tools
└── references/              ← pattern notes distilled from high-end sites
```

## Philosophy (author rules)

- Motion is never decoration. Every animation must answer “why does this exist?”
- Restraint is a feature. Most ideas should be killed by the restraint gate.
- Strong typography carries 70 % of the visual identity.
- Negative space is active, not empty.
- Originality is forced by the thinking sequence. Never ship the first idea that looks “nice”.
- Prefer transform and opacity. Never animate layout properties on the main thread without reason.
- Prefer-reduced-motion is mandatory. Always provide a graceful static fallback.
- The site should feel expensive even when the content is simple.

## License

MIT — use freely, commercially or personally. Credit is appreciated but not required.

---

Built by asfakulsiam.  
Push this folder to your GitHub under `asfakulsiam/asfakulsiam-motomation-design` and the `npx skills` install command works immediately.