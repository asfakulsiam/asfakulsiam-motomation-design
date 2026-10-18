# Authority: which instruction wins

Motomation has many kinds of guidance. They are not equal. When two of them disagree, the higher level wins, and the plan says so in one line (`Conflict: <lower> yields to <higher>: <why>`). The most emphatic sentence never wins just by being emphatic.

| Level | What it is | Examples | Can be overridden by |
|---|---|---|---|
| **1. Explicit user requirements and constraints** | what the user asked for, excluded or approved | "must have a cart", "no dark mode", "use our Vite app", an approved Scope row | only the user |
| **2. Safety, accessibility, correctness** | standards that protect people and keep the product working | WCAG 2.2 AA, keyboard and focus, reduced-motion paths, no fake claims, no copied protected work, security headers, licences | nothing in this skill; a user request that breaks one is raised, not silently obeyed |
| **3. Project architecture and technical constraints** | what the existing codebase, stack, runtime and budget allow | the project's framework, its component system, its package policy, performance budgets | levels 1–2 |
| **4. The product contract** | what this product must let people do, derived before any art direction (`thinking/product-contract.md`) | journeys, routes, required states, IA, information density | levels 1–3, or the user approving a scope change |
| **5. Research evidence** | what real products and references show for this project | type research, reference findings with their limitations | levels 1–4 |
| **6. Design heuristics and opinions** | the skill's taste, stated as advisory rules with rationale (`principles/heuristics.md`, `principles/house-style.md`, `principles/dials.md`) | one focal point per screen, one accent, a minimal nav | levels 1–5; ignoring one needs a one-line reason, not permission |
| **7. Recipes, archetypes, examples, components, draws** | starting material: `categories/`, `structures/`, `styles/`, `signatures/`, `examples/`, `data/`, `scripts/collide.mjs` | "Ledger" archetype, the ecommerce recipe, a library card component | everything above; a recipe that fights the contract is adapted or dropped |

## How to use the table

- **The product contract outranks every aesthetic idea.** A concept may reorganise how the product is presented. It may not remove a journey, hide an essential function or cut a required route to make the composition cleaner. If a concept only works without a required capability, the concept changes.
- **Heuristics guide; they don't decide.** Every opinion in this skill exists to solve a design problem (`principles/heuristics.md` names the problem). When the problem isn't present, the opinion doesn't apply. Following a heuristic that makes the product worse is a failure, not loyalty.
- **Recipes are evidence of one way it was done, never the answer.** The agent may discover a better solution than anything in the library; it is expected to look.
- **Measured gate checks are level 2 or 4.** The gate's hard checks (contrast, overflow, reduced motion, accessibility names, completeness X, journey J) protect people and the product, and they fail the build. The critique scores (H, R, S, V, M) are diagnostics at level 6: a low score asks a question, it does not override the contract (`gates/delivery-gate.md`, Part 4).
- **A user can lower level 6 or 7 at will** ("make it conventional"), and can change level 4 by approving a scope change. Nobody, including the agent, changes level 4 silently.

## Conflicts that come up often

| Conflict | Resolution |
|---|---|
| "Keep navigation minimal" vs a marketplace with 40 categories | the IA the product needs wins; restraint is applied to the nav's styling, not its contents |
| A signature move vs a dense task screen (checkout, dashboard) | the task screen stays conventional and fast; the signature lives where the product has room for it, or the site has none |
| Archetype draw vs the product's information architecture | the IA wins; the archetype may shape one storytelling surface or nothing |
| Memory says "diverge on all five" vs a brief that needs the same type mode as last time | diverge where the brief doesn't justify the similarity; never diverge into a worse fit, and say which similarity is justified |
| Banned display font vs a product whose brand system already uses it | the brand's existing system (level 1 or 3) wins; note it |
| Accent ≤ 5% vs a colour-coded product (transit lines, grocery categories, a kids' brand) | colour that carries information or brand is not "accent"; the contrast floor still holds |
| A backend deferred vs its interface | deferring payment, auth or search infrastructure never removes the screen; the interface ships, labelled as demo (`thinking/product-contract.md`) |
