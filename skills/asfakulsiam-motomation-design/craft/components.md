# Components: reuse, adapt, adopt or build

`examples/components/` is a toolkit at authority level 7 (`principles/authority.md`). It gives leverage; it is not a design system the build must use, and it is never a visual ceiling. Excellent results can come from library components, from external ones, from custom ones, or from a deliberate mix.

## The selection order

For each non-trivial piece of UI (from the build plan, Checkpoint 4):

1. **The project's own system first.** An existing codebase's components, tokens and UI kit are authority level 3. Extend them before adding anything.
2. **Inspect the relevant built-in components** (`node scripts/search.mjs components "<effect or pattern>"`). Read the header: `use-when`, `avoid-when`, `tier`, `deps`, `reduced-motion`, `touch`, `a11y`.
3. **Decide fit** against three things: the chosen concept, the product contract (does it support the journey, the density, the states?), and the stack.
4. **Reuse** when it fits as is. **Adapt** (props, timing, markup, or a fork with its own header) when it is close. **Compose** several when the pattern is a combination.
5. **Research alternatives** when nothing fits or the pattern is standard UI with solved accessibility: headless and registry libraries (shadcn/ui, Radix UI, React Aria, Headless UI, Ark UI), specialised libraries (charts, maps, 3D, virtualised tables, date pickers), open-source repositories. These are examples, not mandatory dependencies.
6. **Build a custom component** when existing options are inadequate, or when the piece is the concept itself (the signature, the hook). Give it the library header so it can be reused.

Say in one line which of reuse, adapt, adopt or build you chose for each piece, and why.

**Never** force a library component into a design because Motomation ships it. **Never** rebuild an accessible, maintained solution (dialog, combobox, menu, tabs, date picker, toast) from scratch without a reason; focus management and keyboard models are where hand-built components fail.

## Before adopting external code or a library

| Check | Question |
|---|---|
| Compatibility | Does it support the project's framework and version (React 19, App Router, SSR, Astro islands)? |
| Maintenance | Released recently, issues answered, not deprecated (`craft/stack.md`, the three checks)? |
| API stability | Pre-1.0, or a history of breaking changes? |
| Accessibility | Keyboard model, focus, ARIA, reduced motion: documented and tested? |
| Responsive and touch | Works at 375px and with touch, not just a mouse? |
| Performance | Bundle cost (bundlephobia or the package's own size), runtime cost, does it tree-shake? Within the tier budget (`craft/performance.md`)? |
| Licence | MIT, Apache-2.0, BSD or ISC for commercial use; attribution recorded when required |
| Security | Install scripts, transitive dependencies, a single unknown maintainer? |
| Worth it | Does the benefit justify a dependency, or would 40 lines of platform code do? |

Respect the user's stack and package constraints. Don't install a dependency to reproduce a reference; don't introduce a second component system next to the project's own. Record each adopted dependency with its checks in `DESIGN.md` under `Dependencies`.

## Found code is not trusted code

Whatever is reused, adapted, adopted or built still passes `gates/rules.md`, the tier budget, the micro-states (`thinking/sequence.md`) and the reduced-motion rules. Read it before shipping it.
