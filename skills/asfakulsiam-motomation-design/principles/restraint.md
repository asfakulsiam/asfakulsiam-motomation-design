# Restraint

Restraint is what makes a minimal site feel expensive instead of empty. It is also a standard, not a style: a dense dashboard needs it as much as a minimal portfolio.

## Two kinds of rules

**Universal standards** apply to every brief, every style and every category. A brief can't switch them off.

| Standard | The rule | Where it's defined |
|---|---|---|
| Accessibility | WCAG 2.2 AA contrast (4.5:1 text, 3:1 large text and UI), keyboard reaches everything with a visible focus, nothing hidden from assistive tech | `craft/accessibility.md` |
| Restraint | the four cuts and the universal budgets below; one signature move | this file, Restraint Gate in `thinking/sequence.md` |
| Motion discipline | every animation passes the four questions; UI feedback ≤ <!--rule:ui_feedback_max_ms-->250ms<!--/rule-->; prefer transform/opacity, clip-path when it serves the concept, paint-heavy effects only with a perf check and a static fallback, layout properties never | `motion/tokens.md` ("What to animate") |
| Real content | no lorem ipsum, invented numbers, fake logos or testimonials | `gates/delivery-gate.md` |
| Reduced-motion fallback | a designed still that reads as its own composition, not "animations off" and not one frame of the animation (see "Designed stills" below) | `craft/accessibility.md`, each tier file, "Designed stills" below |
| Performance budgets | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, JS budget per tier | `craft/performance.md` |

**House-style defaults** are asfakulsiam's point of view (`principles/house-style.md`). They apply when the brief is silent. A brief, a category or a named style can override them, and the override is not a failure:

| Default | Overridden when… |
|---|---|
| Minimal canvas (quiet ground, lots of air) | the content is dense by nature: dashboards, data tools, catalogues with filters, timetables |
| Maximal type (display at 8–28vw) | the data or the product UI is the hero; then type is compact, tabular and legible at a glance (compact scale in `principles/typography.md` §3) |
| Editorial grid (folios, hairlines, margin captions) | the task is operational; use a functional grid (panels, tables, toolbars) |
| Monochrome base, one accent as the only colour | colour encodes information (status, categories, series). Data colours are information, not accents; the one-brand-accent budget and the Restraint Gate still hold. |
| Typography as hero ("set it large", Law 2) | imagery, data or the product is what the visitor came for. Type still leads by clarity, and is still chosen first and with a reason. |

Test: if obeying a rule would make the brief worse at its real job, and the rule is in the second table, override it and say so in one line of the plan. If it's in the first table, the brief is wrong, not the rule.

## The four cuts

Before delivery, make four passes and remove:
1. **Decoration without a job**: blobs, random gradients, floating shapes, icons next to every heading.
2. **Duplicate messages**: two sections saying the same thing, or a headline repeated in the subtitle.
3. **Motion without meaning**: anything that fails the four questions in `motion/tokens.md`.
4. **Choices made twice**: a second display font, a second accent colour, a second signature move.

## Budgets

| Item | Budget per page | Kind |
|---|---|---|
| Signature moves | 1, echoed at most twice | standard |
| Simultaneous animations on screen | ≤ 3 groups | standard |
| WebGL canvases | 1 | standard |
| Pinned sections | ≤ 2 on Tier 2–3; Motomation chapters ≤ 2 | standard |
| Display typefaces | 1 (2 only if the concept is about contrast); a dashboard may have none | standard |
| Accent colours | 1 brand accent (data and status colours encode information and don't count) | standard |

## Designed stills (reduced motion at Tier 3–5)

Benchmark v3 judged reduced-motion strips on their own: the skill's Tier 4 pages lost to a plain baseline 6 of 9 times (2.50 of 5) because the reduced version was the same page with the shader frozen and the hero still pinned. A frozen frame is a downgrade; a still is a design. Under `prefers-reduced-motion: reduce`:

1. **Don't mount the canvas.** Render a still composed for the purpose, in SVG or CSS. Every Tier 4 background in `examples/components/backgrounds/` ships one (aurora → a long-exposure plate, meteors → star trails, globe → a chart plate, particle-field → a star chart, beams → pools of light on the floor, mesh-gradient → a colour study, liquid-field → a marbled sheet).
2. **Translate the motion into the picture.** What moved becomes something drawn: time as trails, flow as bands, a path as a line, a sequence as numbered plates. The still says what the motion said.
3. **Keep the mood, change the frame.** Same palette, same density, same weight of composition; a different arrangement from any frame of the animation. If a screenshot of the still could be mistaken for a paused frame, it's a poster, not a still.
4. **Unpin.** A pinned chapter or scrubbed sequence becomes a stack of plates: each step in normal flow, fully visible, each with its own still. Nothing stays pinned while text scrolls past it.
5. **Complete on its own.** Judged alone, with no knowledge of the full version, the still must look finished: a focal point, the type set against it with AA contrast, no empty box where the canvas was.

Check it the way v3 judged it: capture the reduced-motion strip (`gate.mjs --report`), look at it without the full-motion strip, and ask whether it is a designed page or a page with the motion switched off.

## The "one more thing" test

When you want to add something, ask: *does this make the concept clearer or just busier?* If busier, don't add it. If clearer, remove something else to make room.
