# Audit and overhaul: v3.0.0 (2026-10-18)

What was wrong with v2.10.1, what changed, and what has and has not been verified. Evidence from the real build is in `docs/audit-v3/` (pasted tool output only).

## Root causes of repetitive or unsuitable output

Found by reading the files named here. No claim below comes from a benchmark run (none was run, at the owner's request).

1. **The concept was approved before the product.** In the v2 Thinking Sequence the Concept was approved at Checkpoint 2 and the Scope only at Checkpoint 3, so a concept could silently redefine the product (drop the cart, merge pages, turn a shop into a poster).
2. **Random structure as the starting point.** `collide.mjs` told the agent to "treat these as constraints… start from them"; `mad-artist` said "you have to start from it"; "choose a structure first, before any visual decision". The 23 archetypes are whole-page metaphors and have no rows for marketplaces, dashboards or booking flows.
3. **Style opinions written as laws.** Examples: mandatory signature; mutation "Remove the expected. No nav"; house style "Navigation is minimal: wordmark plus 2–4 links", "Tier 5 for at least one chapter", "Lenis for Tier 2+"; dials "One focal point per screen, always"; one accent ≤5%; "no two top-level sections share an entrance"; "one deliberate grid break per screen"; forced divergence on all five dimensions; "Never pick the stack you used last"; research fixed at "3 references, 3 techniques". Applied together they produce the same expressive shape for every brief, whatever the product.
4. **The gates didn't put the product first.** The exit code depended on measured counts plus X and J; nothing checked that the product contract survived the concept. The rubric had no product-integrity axis, and the eval briefs were single pages with "Expect" lines about style.
5. **Narrow recipe coverage, with a bias.** Only 12 categories, and `categories.csv` pushed collisions about 60% toward the category's own archetypes.

Kept because they work: completeness X, journey J, originality O, the memory log, the measured gate, checkpoints, the restraint two-question gate, and Measured / Judged / Not verified reporting.

## Architectural decisions

- **Authority hierarchy** (`principles/authority.md`): user intent and product contract → accessibility and usability → content and brand truth → measured standards → research evidence → concept → house style and heuristics.
- **Product contract before concept** (`thinking/product-contract.md`; sequence: 0 Stack, 1 Product contract and scope [Checkpoint 2], 2 Design research, 3 Directions and synthesis [Checkpoint 3], 4 Memory and sameness, 5 Restraint). `/invent` keeps the contract, and `/strip` never cuts contract items.
- **Opinions become registered heuristics** (`principles/heuristics.md`): each one records its rationale, when it helps, when it fails, and what a justified override needs. `check-repo.mjs` fails if an old absolute comes back. This is a pipeline change, not a softer tone: the sequence, the commands and the gate authority table changed with it.
- **Exploration tools are optional:** collision, archetypes (now with a `fails_when` column), mutations and signatures. "No signature" and `archetype: none` are valid answers.
- **Research first, proportional to the brief** (`craft/research.md`): the Research record marks each item observed, inferred or unverified, and no live research is mandatory.
- **Gate authority:** product (X + J) and essential quality pass or fail; originality is measured; critique is advisory. A high visual score never hides a failed product gate.

## Recipes, opinions, components

- Recipes: all 12 `categories/*.md` were **kept and revised**, each ending in an enforced `Recipe contract` table (context, assumptions, required vs optional, limitations, when to reject). None were archived or deleted. The agent may reject every recipe.
- Archetypes: kept, revised (`fails_when`), demoted from starting point to optional tool.
- Opinions: moved into the heuristics registry, with each source file pointing there.
- New: `craft/components.md` (reuse / adapt / adopt / build, with an adoption checklist), `motion/selection.md`, `scripts/realism.mjs`.
- Lite edition: rebuilt for the new sequence (27.0 KB, about 7,889 tokens, under the 8,000 target). Dropped sections are listed by `build-lite.mjs`.

## Real build: Leaf & Ledger (paired briefs 12a / 12b)

A tea shop with subscriptions: 26 pages per direction, plain HTML/CSS/JS, no dependencies, functional frontend. Direction A is a ledger (Newsreader + IBM Plex Mono). Direction B uses estate colours (Bricolage Grotesque + Instrument Sans). The same agent that rewrote the skill built both, following the v3 workflow. It is evidence that the workflow runs end to end, **not a blind test**. The build is kept outside the repository; only its tool output is committed.

| Check | A | B |
|---|---|---|
| `gate.mjs <folder>` | exit 0 | exit 0 |
| completeness X | ✓ | ✓ |
| journey J | nav, mobile, errors, session pass; forms and loading n/a (the journey sample had no field form) | same |
| own commerce journeys, 375 touch + 1440 | 48/48 | 48/48 |
| originality vs the other direction (`--same-product`) | home and shop: different on every axis. /subscriptions/, /account/: repeat on structure and composition. Tea page: repeat on image and signature | pair **FAIL** |

The pair fails the brief's "differ measurably" criterion. Both directions render the plan builder and account pages from the same shared markup, and the screenshots confirm it: only type and colour change. The tools caught this, and it is left open rather than hidden.

### Skill defects the build exposed (fixed, each with a test that fails on the old code)

1. `realism.mjs` counted a site-wide footer sentence as repeated content.
2. `journey.mjs` tapped a natively `:disabled` button and reported it as dead.
3. The `gate.mjs` async advisory did not recognise `catch {` or `!r.ok`.
4. The `gate.mjs` memory axis mislabelled `archetype: none` as a missing stamp.
5. `originality.mjs` counted contract-required forms and navigation as a repeat between two expressions of one product → new `--same-product` mode.

Build defects the gate caught and that were fixed: touch targets under 24 px, a missing `og:image`, cart-badge contrast, 3-column overflow at 768 px, 24 px reflow at 320 px, and identical hover/focus feedback in both directions (moved out of the shared base).

## Tests executed (results observed)

- `node scripts/check-repo.mjs`: ✓ (v3.0.0, 154 docs).
- Exit 0: `tests/gate/{completeness,composition,journey,originality,richness,rulesets,variety,async-states}`, `tests/repo/{memory,size-guard,workflow-rules}`, `tests/templates/template-rules`, `tests/evals/briefs-v6`.
- **Not run:** CI workflows, the benchmark, `tests/components`, and the eval cost / run-meta tests (they drive the benchmark harness).

## Not verified

- Whether v3 reduces sameness across independent agents and briefs. That needs the v6 briefs run by agents that did not write the skill.
- Screen-reader behaviour. Only the automated name, focus, zoom, reflow and forced-colours checks ran.
- The memory S axis for `archetype: none` builds: it is not fingerprinted, and sameness is measured with `originality.mjs` instead.
- Stability of the V axis (entrance repeats): B read V5 on one run and V4 on the next.
- The journey check's form sampling: it reported "no form with fields" on 12 sampled pages although `/contact/` and `/checkout/` have forms. The forms were covered by the separate journey script.

## Next steps (priority order)

1. Run the v6 briefs (including 12a/12b) with independent agents and score them with `evals/rubric.md`.
2. Paired builds: have the sequence require that each direction re-expresses the shared functional pages (builder, account, checkout) instead of sharing their markup. That was the failure seen here.
3. Fingerprint memory for `archetype: none` builds (structure, palette and type tokens instead of the archetype key).
4. Make the journey check include routes that contain forms when it samples pages.
5. Stabilise the V axis measurement (wait for entrance animations to settle).
