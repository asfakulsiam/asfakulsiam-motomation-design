# Restraint

Restraint is what makes a minimal site feel expensive instead of empty. It is also a standard, not a style: a dense dashboard needs it as much as a minimal portfolio.

## Two kinds of rules

**Universal standards** apply to every brief, every style and every category. A brief can't switch them off.

| Standard | The rule | Where it's defined |
|---|---|---|
| Accessibility | WCAG 2.2 AA contrast (4.5:1 text, 3:1 large text and UI), keyboard reaches everything with a visible focus, nothing hidden from assistive tech | `craft/accessibility.md` |
| Restraint | the four cuts and the universal budgets below; one signature move | this file, Restraint Gate in `thinking/sequence.md` |
| Motion discipline | every animation passes the four questions; UI feedback ≤ 250ms; transform/opacity only | `motion/tokens.md` |
| Real content | no lorem ipsum, invented numbers, fake logos or testimonials | `gates/delivery-gate.md` |
| Reduced-motion fallback | a designed static version, not "animations off" | `craft/accessibility.md`, each tier file |
| Performance budgets | LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, JS budget per tier | `craft/performance.md` |

**House-style defaults** are asfakulsiam's point of view (`principles/house-style.md`). They apply when the brief is silent. A brief, a category or a named style can override them, and the override is not a failure:

| Default | Overridden when… |
|---|---|
| Minimal canvas (quiet ground, lots of air) | the content is dense by nature: dashboards, data tools, catalogues with filters, timetables |
| Maximal type (display at 8–28vw) | the data or the product UI is the hero; then type is compact, tabular and legible at a glance |
| Editorial grid (folios, hairlines, margin captions) | the task is operational; use a functional grid (panels, tables, toolbars) |
| Monochrome base, one accent as the only colour | colour encodes information (status, categories, series). Data colours are information, not accents; the one-brand-accent budget and the Restraint Gate still hold. |
| Typography as hero | imagery, data or the product is what the visitor came for |

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

## The "one more thing" test

When you want to add something, ask: *does this make the concept clearer or just busier?* If busier, don't add it. If clearer, remove something else to make room.
