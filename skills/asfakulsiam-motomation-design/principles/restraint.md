# Restraint

Restraint is what makes a minimal site feel expensive instead of empty. It is also a standard, not a style: a dense dashboard needs it as much as a minimal portfolio.

## Two kinds of rules

**Universal standards** apply to every brief, every style and every category. A brief can't switch them off.

| Standard | The rule | Where it's defined |
|---|---|---|
| Accessibility | WCAG 2.2 AA contrast (4.5:1 text, 3:1 large text and UI), keyboard reaches everything with a visible focus, nothing hidden from assistive tech | `craft/accessibility.md` |
| Restraint | the two-question gate: cut what serves neither hierarchy, feedback or storytelling nor the product's identity; never cut a contract item | this file, Restraint Gate in `thinking/sequence.md` |
| Motion discipline | every animation passes the four questions; UI feedback ≤ <!--rule:ui_feedback_max_ms-->250ms<!--/rule-->; prefer transform/opacity, clip-path when it serves the concept, paint-heavy effects only with a perf check and a static fallback, layout properties never | `motion/tokens.md` ("What to animate") |
| Real content | no lorem ipsum, invented numbers, fake logos or testimonials | `gates/delivery-gate.md` |
| Reduced-motion fallback | a designed still that reads as its own composition, not "animations off" and not one frame of the animation (see "Designed stills" below) | `craft/accessibility.md`, each tier file, "Designed stills" below |
| Performance budgets | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, JS budget per tier | `craft/performance.md` |

**House-style defaults** are asfakulsiam's point of view (`principles/house-style.md`). They apply when the brief is silent. A brief, a category or a named style can override them, and the override is not a failure:

| Default | Overridden when… |
|---|---|
| Minimal canvas (quiet ground, lots of air) | the content is dense by nature: dashboards, data tools, catalogues with filters, timetables |
| Maximal type (display at 8–28vw) | the data or the product UI is the hero; then type is compact, tabular and legible at a glance (compact scale in `principles/typography.md` §3) |
| Folio grid (index numbers, hairlines, margin captions) | the task is operational; use a functional grid (panels, tables, toolbars) |
| Monochrome base, one accent as the only colour | colour encodes information (status, categories, series). Data colours are information, not accents; the one-brand-accent budget and the Restraint Gate still hold. |
| Typography as hero ("set it large", Law 2) | imagery, data or the product is what the visitor came for. Type still leads by clarity, and is still chosen first and with a reason. |

Test: if obeying a rule would make the brief worse at its real job, and the rule is in the second table, override it and say so in one line of the plan. If it's in the first table, the brief is wrong, not the rule.

**Budgets are heuristics, not standards.** One signature move at most, one display face, a disciplined accent and the motion budget are advisory (authority level 6, `principles/heuristics.md`): they stop noise, and they are ceilings, not quotas. A product with no signature move is not under-designed if its identity comes from its system.

## The Restraint Gate (two questions)

Step 5 of `thinking/sequence.md` asks two questions of every element:

1. **Does this serve hierarchy, feedback, or storytelling?**
2. **Does the brief need this to feel like itself?**

**Cut only what fails both.** An element that fails question 1 but passes question 2 is kept, and the `DESIGN.md` record says why (`- Kept: <element> — fails Q1, passes Q2: <the brief's reason>`). An element that fails both is cut (`- Cut: <element> — fails Q1 and Q2`). The budgets below and the universal standards above apply either way: question 2 keeps an element, it never overrides a budget.

The single-question version ("does it serve hierarchy, feedback or storytelling?") cut real design as decoration: a bakery's hand-drawn wheat sprigs, a darkroom's film grain, a festival's sticker chaos. Those carry no information and are still how the brand is recognised. Question 2 exists so restraint removes noise, not identity.

**Worked example (kept).** Brief: "Site for a family bakery in Old Dhaka, running since 1962; it should feel like the shop." Element: hand-drawn wheat sprigs in the margins of the menu.
- Q1: fails. They don't order the content, don't respond to input, don't advance a story.
- Q2: passes. The brief asks for the feel of the shop, and the shop's paper bags and signboard carry these sprigs. Without them the page reads as any bakery.
- Decision: **kept.** `- Kept: hand-drawn wheat sprigs in the menu margins — fails Q1, passes Q2: the shop's own bag and sign ornament ("feel like the shop")`

**Counter-example (cut).** Brief: "Landing page for a B2B invoice-reconciliation API." Element: three blurred gradient blobs floating behind the hero.
- Q1: fails. They sit behind the headline without ordering it, respond to nothing, and tell no story.
- Q2: fails. Nothing in the brief (developers, accuracy, an API) asks for soft floating colour; it is the AI-default look the delivery gate bans.
- Decision: **cut.** `- Cut: gradient blobs behind the hero — fails Q1 and Q2`

## Too little (the richness advisory)

Restraint cuts noise; it is not a licence for an empty page. A page fails its brief from the thin side too: a homepage with no opening statement, a category page that is a bare grid with no title or count, an about page with one paragraph. Before delivery, check the other direction:

- At least 3 meaningful sections above the fold (navigation, heading, text, picture, call to action).
- A homepage has a hero or an opening statement.
- A category page's grid has a title and a count.
- An about page has at least 2 content blocks.

`scripts/gate.mjs` measures these four as an advisory `richness` block (`gates/delivery-gate.md`, Part 0). It only warns and never fails the gate. When it warns, ask question 2 the other way round: does the brief need something here to feel like itself? If the thin version is the concept (a one-line poster hero), keep it and say so in the plan.

## The four cuts

Before delivery, make four passes through the Restraint Gate and remove what fails both questions:
1. **Decoration without a job**: blobs, random gradients, floating shapes, icons next to every heading, when the brief doesn't need them to feel like itself (question 2).
2. **Duplicate messages**: two sections saying the same thing, or a headline repeated in the subtitle.
3. **Motion without meaning**: anything that fails the four questions in `motion/tokens.md`.
4. **Choices made twice**: a second display font, a second accent colour, a second signature move.

## Budgets

| Item | Budget per page | Kind |
|---|---|---|
| Signature moves | at most 1, echoed at most twice; 0 is valid | heuristic (H-signature) |
| Simultaneous animations on screen | ≤ 3 groups | standard (attention and vestibular safety) |
| WebGL canvases | 1 | standard (performance) |
| Pinned sections | ≤ 2 on Tier 2–3; Motomation chapters ≤ 2 | standard |
| Display typefaces | 1 (2 only if the concept is about contrast); a dashboard may have none | heuristic (H-one-display) |
| Accent colours | 1 brand accent (data, status and brand-system colours encode information and don't count) | heuristic (H-one-accent) |

## Designed stills (reduced motion at Tier 3–5)

Benchmark v3 judged reduced-motion strips on their own: the skill's Tier 4 pages lost to a plain baseline 6 of 9 times (2.50 of 5) because the reduced version was the same page with the shader frozen and the hero still pinned. A frozen frame is a downgrade; a still is a design. Under `prefers-reduced-motion: reduce`:

1. **Don't mount the canvas.** Render a still composed for the purpose, in SVG or CSS. Every Tier 4 background in `examples/components/backgrounds/` ships one (aurora → a long-exposure plate, meteors → star trails, globe → a chart plate, particle-field → a star chart, beams → pools of light on the floor, mesh-gradient → a colour study, liquid-field → a marbled sheet).
2. **Translate the motion into the picture.** What moved becomes something drawn: time as trails, flow as bands, a path as a line, a sequence as numbered plates. The still says what the motion said.
3. **Keep the feel, change the frame.** Same palette, same density, same weight of composition; a different arrangement from any frame of the animation. If a screenshot of the still could be mistaken for a paused frame, it's a poster, not a still.
4. **Unpin.** A pinned chapter or scrubbed sequence becomes a stack of plates: each step in normal flow, fully visible, each with its own still. Nothing stays pinned while text scrolls past it.
5. **Complete on its own.** Judged alone, with no knowledge of the full version, the still must look finished: a focal point, the type set against it with AA contrast, no empty box where the canvas was.

Check it the way v3 judged it: capture the reduced-motion strip (`gate.mjs --report`), look at it without the full-motion strip, and ask whether it is a designed page or a page with the motion switched off.

## The "one more thing" test

When you want to add something, ask: does this make the concept clearer, or the brand more itself? If neither, it is just busier: don't add it. If it does, remove something else to make room.
