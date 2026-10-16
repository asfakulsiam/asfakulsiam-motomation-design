# Motomation Design: the ultimate cheatsheet

Every command, flag, tier, dial and script on one page, with a use case and a copy-paste prompt for each, plus full recipes for getting the most out of the skill. Behaviour is defined in [`SKILL.md`](../skills/asfakulsiam-motomation-design/SKILL.md), [`thinking/sequence.md`](../skills/asfakulsiam-motomation-design/thinking/sequence.md) and [`commands/overview.md`](../skills/asfakulsiam-motomation-design/commands/overview.md); this page is the quick map.

---

## 1. How a build runs: five checkpoints

The skill drafts, shows its reasoning, and **stops** after each checkpoint until you answer.

| # | Checkpoint | You see | You can answer |
|---|---|---|---|
| 1 | **Stack** | the proposed stack, why, the alternatives | "approve" · "use Astro instead" |
| 2 | **Research and concept** | 3 references and what was taken from each, the pattern being avoided, tension, concept, archetype + mutation, the collision draw, palette, type, motion tier, signature move, the reasoning | "approve" · "push it further" · "less safe" · "warmer palette" |
| 3 | **Scope** | routes, states, legal pages, admin, edge cases (requested / required / optional), what is deferred and why | "approve" · "cut the blog" · "add a wholesale page" |
| 4 | **Build plan** | section order, components to create, animation per section, page transitions | "approve" · "swap sections 2 and 3" · "calmer transitions" |
| 5 | **Ship** | the build, the gate output, the critique (pasted, never typed) | "accept" · "fix the mobile hero" |

Answers that work at every checkpoint:

- **"Show me alternatives"**: 2–3 options with reasons, then another wait. Ask for more ("show me 5") when you want a wider search.
- **"Change X"**: overrides any decision, including one from an earlier checkpoint. Only what depends on it is redone.
- **"Why?"**: more reasoning; the skill still waits.
- If the brief already answers a checkpoint ("use Next.js"), the skill states it and skips the question; you can still override.
- Running unattended (CI, benchmark, overnight)? End the brief with **"Approve every checkpoint."**

---

## 2. Flags (work with every command)

| Flag | Values | Use it when |
|---|---|---|
| `--tier=n` | 1–5 | you know how much motion the brief deserves |
| `--energy=n` | 1–3 | contrast, scale jumps, how loud the page is |
| `--rhythm=n` | 1–3 | how regular (1) or syncopated (3) the layout is |
| `--motion=n` | 1–3 | how much moves; sets the tier with the other dials |
| `--style=<name>` | `editorial` `swiss` `minimal` `dark-luxe` `kinetic-type` `organic` `neobrutalism` `flat` `glassmorphism` `neumorphism` | you want a visual language as the base |
| `--stack=<x>` | `next` `react` `vanilla` `astro` | you've already chosen the framework (skips the question at Checkpoint 1) |
| `--seed=n` | any number | you want collision draws you can repeat |
| `--review` | — | keep the checkpoints even when the brief pre-approves them |

---

## 3. Motion tiers

Choose the **lowest** tier that delivers the concept.

| Tier | Name | Tools | Use case |
|---|---|---|---|
| 1 | Basic | CSS: hover, focus, press, transitions | link-in-bio, docs, a page that must load on 3G |
| 2 | Intermediate | GSAP, ScrollTrigger, SplitText, Lenis | editorial, magazine, studio sites with reveals and smooth scroll |
| 3 | Pro | page transitions, Flip, Lottie, Rive, SVG morphing | product tours, multi-page brands where continuity matters |
| 4 | Max | WebGL, shaders, WebGPU, three.js / R3F | launches, studios, anything where an object is the hero |
| 5 | Motomation | scroll as film: pinned chapters, scrubbed sequences, image sequences, video | storytelling, flagship launches, film and motion portfolios |

Dials: **ENERGY / RHYTHM / MOTION**, each 1–3. They set the intensity and lead to a tier ([`principles/dials.md`](../skills/asfakulsiam-motomation-design/principles/dials.md)).

---

## 4. Commands, use cases and prompts

### Create

| Command | What it does | Use case |
|---|---|---|
| `/shape` | direction only: brief inference, the Thinking Sequence, dials, `DESIGN.md` + `SCHEMA.md` + `MOTION.md`; no code | the client approves a direction before anything is built |
| `/build` | the full flow: brief to finished, gated code and a sellable template | a complete page or site |
| `/invent` | collision engine plus three different concept cards (more with `--count`) | stuck, or the first idea feels familiar |
| `/signature` | one memorable move for the site or a section, with its implementation | the page works but nobody will remember it |
| `/motomate` | turns a section into a Tier 5 scroll-film: storyboard, technique, assets, code, fallback | a product, place or story should play like a film |
| `/animate` | adds motion to existing UI at a given tier | the design is done but static |
| `/type` | a typography pass: faces, fluid scale, tracking, numerals, variable axes | the page feels generic (usually it's the type) |

```text
/shape a tea estate in Sreemangal selling single-origin leaf to cafés in Dhaka and Berlin --energy=2 --rhythm=2
```
```text
/build portfolio for Rafi, a Dhaka motion designer with 8 years of music videos and broadcast idents, who wants title-sequence work --tier=5
```
```text
/invent independent bookshop in Nilkhet that also runs a reading room --count 5
```
```text
/signature the hero of the ceramics shop: it should feel like clay being turned
```
```text
/motomate the product chapter: a solar lantern switching on in a dark village home --tier=5
```
```text
/animate the pricing section --tier=2
```
```text
/type the whole site: editorial, warm, with Bangla support
```

### Tune

| Command | What it does | Use case |
|---|---|---|
| `/bolder` | ENERGY +1: bigger type jumps, stronger contrast, a braver accent | the client says "it's too safe" |
| `/quieter` | ENERGY and/or MOTION −1: more air, softer, slower | the client says "it's too much" |
| `/distill` | removes until only the essential remains (Restraint Gate, hard) | overdesigned, too many ideas |
| `/mutate` | same content and concept, new **structure** (a different archetype or mutation) | the layout looks like a template |
| `/overdrive` | generate → critique → improve, up to 3 rounds, until every critique axis is ≥ 4 | flagship pages |

```text
/bolder the home page, but keep the concept
```
```text
/quieter the about page --motion=1
```
```text
/distill the landing page to one signature and one accent
```
```text
/mutate the case-study template: it reads like every agency site
```
```text
/overdrive the launch page
```

### Evaluate

| Command | What it does | Use case |
|---|---|---|
| `/critique` | scores, the three biggest problems, fixes in priority order (no code changes unless asked) | an honest review of your own or a client's site |
| `/audit` | accessibility, performance, reduced motion, mobile matrix, SEO, the AI-default scan; pass/fail with file and line | before launch |
| `/study` | the **design DNA** of a reference (type, palette, layout, motion, signature) without copying it | "I love this site, make ours feel like that without copying it" |

```text
/critique https://your-site.com
```
```text
/audit ./my-site
```
```text
/study https://a-reference-you-love.com then write what to take and what to leave into DESIGN.md
```

### Ship

| Command | What it does | Use case |
|---|---|---|
| `/polish` | spacing, alignment, typographic details, focus/hover/press, empty/error/loading states, favicon, OG image, stamp, memory log | the last pass before handoff |

```text
/polish the whole site, then run the gate again and paste it into GATE.md
```

### Meta

`/dials` (show or set: `/dials energy=3 motion=2`) · `/help` · `/version` · `/check-update` · `/update-skill`

---

## 5. What every `/build` ships

- **The thinking:** `DESIGN.md` (rationale, tokens, references, divergence, scope, dependencies, decision trace), `MOTION.md` (timing sheets), `SCHEMA.md` (entities, routes, states, env vars, API surface, handoff), `DATA.md`.
- **The proof:** `GATE.md` (gate output, pasted) and `CRITIQUE.md` (critique output, pasted).
- **A sellable template:** `README.md` (what is real, what is demo, how to run and deploy), `LICENSE`, `CHANGELOG.md`, `.env.example`, a demo-labelled `data/` with its `schema.json`, `middleware.ts`, comments in every non-trivial file. It runs with `npm install && npm run dev` and no configuration.
- **Every micro-state:** buttons (default, hover, focus, active, disabled, loading), forms (validation error, submit loading, success, server error), lists (empty, loading, error, filled), images (loading, loaded, error), async actions (idle, pending, success, error).

---

## 6. Tools (run from the skill folder; Node 18+)

| Script | Use case | Example |
|---|---|---|
| `collide.mjs` | real random concept collisions | `node scripts/collide.mjs --n 5 --spread --category hotel --seed 42` |
| `search.mjs` | look up fonts, palettes, motion, signatures, components | `node scripts/search.mjs fonts "editorial serif warm"` · `node scripts/search.mjs motion "pinned scrub" --tier 5` |
| `memory.mjs` | what you already used, across every project | `node scripts/memory.mjs recent` · `node scripts/memory.mjs similar --brief "<brief>" --category ecommerce` |
| `contrast.mjs` | WCAG contrast of two colours | `node scripts/contrast.mjs "#111111" "#F4F1EA"` |
| `gate.mjs` | the Delivery Gate: contrast, overflow, reduced motion, a11y, SEO, security, performance, completeness, micro-states (needs Playwright) | `node scripts/gate.mjs ./my-site --tier 3` · `--rules` for a fast rules-only pass |
| `completeness.mjs` | gate axis X: is everything in the scope built (or excused with a reason)? | `node scripts/completeness.mjs ./my-site` |

---

## 7. Full-potential recipes

### A. Flagship Tier 5 story site

Flow: `/shape` → approve → `/build` → `/overdrive` → `/polish`

```text
/build --tier=5 --energy=3 --rhythm=3 --motion=3 --review

Use the skill at full potential: read gates/rules.md first; real research outside the skill
(award sites + references/sources/), 3 references with what you took, 3 techniques, the cliché
you avoid; run the memory check and diverge from my past builds; run collide.mjs --n 5 --spread
and paste the output; show 3 concept directions at Checkpoint 2; MOTION.md with timing sheets
per section; every micro-state; a real reduced-motion version; gate + /critique, fix, re-run,
paste the real output.

BRIEF: "Nodi", a Dhaka studio making documentary films about the rivers of Bangladesh.
Visitors: festival programmers, broadcasters, funders. Pages: home (the river as a film reel),
films ("Char" 2024, "Ilish Season" 2023, "The Last Ferry" 2025), film detail, about, contact
(email + press kit). Only these facts; no invented awards or numbers. English first, Bangla
ready. 60fps on a mid-range laptop, WCAG AA.
Success: a programmer remembers one image from the site a week later.
```

### B. Full e-commerce as a sellable template

Flow: `/build` (answer Checkpoint 3 carefully: that's the whole shop) → `/audit` → `/polish`

```text
/build --stack=next --tier=3 --review

Derive the FULL scope of a complete e-commerce site yourself: every route, function, state,
the legal pages Bangladesh requires, edge cases (out of stock, payment failed, empty cart,
slow network, bad promo code), the admin surface, a skeleton for every async surface. Mark
each requested / required / optional and say what you defer and why. Ship the template from
templates/TEMPLATE.md; it must run with npm install && npm run dev, zero config.

BRIEF: "Matir Kaaj", handmade terracotta from potters in Bogura and Dhamrai. ~40 products,
5 categories, each with the potter's name and village. bKash and card (stubs behind env vars),
cash on delivery in Dhaka. English and Bangla. Admin: products, orders, potters, stock.
Success: a buyer feels the hand that made the cup before they add it to the cart.
```

### C. WebGL product launch, invention first

Flow: `/invent` → pick a card → `/build` → `/motomate` the key chapter → `/audit`

```text
/invent solar lantern launch for off-grid villages --count 5
```
Then:
```text
/build card 2 --tier=4 --energy=3 --rhythm=2 --review
The 3D serves the story, not decoration. Designed fallbacks for no WebGL, low-power devices
and reduced motion that keep all content. A performance budget per section in MOTION.md.
Invent the signature for this brief; don't take one from the library.

BRIEF: "Shonar" solar lantern: one charge lasts 3 nights, charges a phone, survives monsoon
rain. For NGOs, distributors, press. One long launch page + specs + distributor form.
Only these facts; mark gaps as NEEDS CLARIFICATION. Smooth on a mid-range Android phone,
LCP under 2.5s on 4G, WCAG AA.
```

### D. Redesign an existing site that feels generic

Flow: `/critique` → `/study` a reference → `/mutate` → `/type` → `/signature` → `/polish`

```text
/critique https://current-site.com
/study https://reference-you-admire.com
/mutate the home page using what /study said to take, keep the content
/type the whole site
/signature the hero
/polish
```

### E. Small fix (short route)

```text
Fix the contrast on the pricing cards and the 375px overflow in the footer. Short route.
```
The skill says `Route: short`, names the cause, changes only what the cause needs, and runs the gate before and after (both reported). No new structure or signature.

### F. Unattended run (CI, benchmark, overnight)

```text
/build <brief> --tier=3 --seed=7101
Approve every checkpoint.
```

---

## 8. Tips for the best output

- **Give real facts, never ask it to invent them.** Names, dates, places, prices. The skill refuses fake numbers and logos, so a thin brief gets a thin site.
- **Name the audience and the success moment.** "A programmer remembers one image a week later" drives the concept better than "make it modern".
- **Spend your effort at Checkpoint 2.** That's where the concept lives. Ask for alternatives, ask "push it further", reject the safe one.
- **Spend it again at Checkpoint 3.** That's where the build's completeness is decided.
- **Ask for more than three** when you want range: `--count 5`, "look at 6 references", "show me 5 directions". Three is the minimum, not a limit.
- **Use `--seed`** when you want to repeat or compare a draw; leave it off for fresh randomness.
- **Read `GATE.md` and `CRITIQUE.md`.** They are measured and pasted, never typed. If a line says "not measured", the tool didn't run.
- **Don't fight the memory.** If it says your last build used the same archetype, let it diverge; that's how sites stop looking alike.
- **Tier is a ceiling, not a target.** Ask for Tier 5 only when the story needs a film.
