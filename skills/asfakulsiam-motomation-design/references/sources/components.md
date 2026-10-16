# Sources: Component libraries and design systems

> Concepts only. Read these for **method and principle**; never copy code, markup, shaders or assets into a build
> (`craft/research.md`). Status checked 2026-10-16 with the GitHub API (stars · last push · licence). Re-check before
> relying on one: a source that is archived, unlicensed or untouched for a year is a reference, never a dependency
> (dependencies are chosen in Step 0, `thinking/sequence.md`). Never use anything from CreativeAgencyStyle (reported as malware).

Read for **anatomy, accessibility and API shape**: how a dialog traps focus, how a combobox announces, how a motion component exposes timing. The skill's own `examples/components/` is one reference among these, not the limit.

| Source | What it is | What to take (a principle, not code) | Status |
|---|---|---|---|
| [`shadcn-ui/ui`](https://github.com/shadcn-ui/ui) | copy-in components on Radix/Base UI with Tailwind | own the code you ship; composition over configuration | ★125,724 · pushed 2026-10-15 · MIT |
| [`magicuidesign/magicui`](https://github.com/magicuidesign/magicui) | animated components and effects | catalogue of current effect vocabulary: see what is common so you can avoid it | ★22,688 · pushed 2026-10-11 · MIT |
| [`DavidHDev/react-bits`](https://github.com/DavidHDev/react-bits) | large library of animated, interactive React components | text and background effects as building blocks; check the licence before any reuse | ★49,337 · pushed 2026-10-15 · custom (read it) |
| [`ibelick/motion-primitives`](https://github.com/ibelick/motion-primitives) | animated UI kit on Motion | small motion primitives composed into bigger behaviour | ★6,703 · pushed 2026-09-28 · MIT |
| [`danielpetho/fancy-components`](https://github.com/danielpetho/fancy) | experimental typography and motion components | type as interaction: letters as objects | ★3,247 · pushed 2026-03-14 · MIT · now `danielpetho/fancy` · the listed name does not exist; the library is `danielpetho/fancy` |
| [`animate-ui/animate-ui`](https://github.com/imskyleen/animate-ui) | animated component distribution (React, Tailwind, Motion) | motion baked into primitives (tabs, accordions) instead of added after | ★4,391 · pushed 2025-12-31 · custom (read it) · now `imskyleen/animate-ui` |
| [`nolly-studio/cult-ui`](https://github.com/nolly-studio/cult-ui) | 150+ animated shadcn-style components | polish details: springs, layered shadows, tactile press states | ★6,540 · pushed 2026-10-14 · MIT |
| [`origin-space/originui`](https://github.com/cosscom/ui) | Origin UI, now coss.com/ui (Cal.com's design system) | dense, production form and input patterns | ★10,700 · pushed 2026-10-15 · AGPL-3.0 · now `cosscom/ui` · AGPL-3.0: never copy, concepts only |
| [`heroui-inc/heroui`](https://github.com/heroui-inc/heroui) | React UI library (formerly NextUI) | complete state coverage per component (hover, pressed, disabled, loading) | ★30,948 · pushed 2026-10-16 · Apache-2.0 |
| [`radix-ui/primitives`](https://github.com/radix-ui/primitives) | unstyled accessible primitives | keyboard and ARIA behaviour as the baseline for any custom control | ★19,397 · pushed 2026-10-14 · MIT |
| [`mui/base-ui`](https://github.com/mui/base-ui) | unstyled accessible components from the Radix/Floating UI/MUI teams | headless behaviour separated from styling | ★11,156 · pushed 2026-10-16 · MIT |
| [`adobe/react-spectrum`](https://github.com/adobe/react-spectrum) | React Aria, React Stately, Spectrum | the most complete accessibility behaviour reference (i18n, touch, screen readers) | ★15,951 · pushed 2026-10-16 · Apache-2.0 |
| [`chakra-ui/ark`](https://github.com/chakra-ui/ark) | unstyled components across React, Vue, Solid, Svelte | state machines per component: every state named | ★5,421 · pushed 2026-10-16 · MIT |
| [`saadeghi/daisyui`](https://github.com/saadeghi/daisyui) | Tailwind component classes and themes | semantic theme tokens over raw utilities | ★42,608 · pushed 2026-10-13 · MIT |
| [`pmndrs/uikit`](https://github.com/pmndrs/uikit) | UI for react-three-fiber | layout and type inside a 3D scene | ★3,248 · pushed 2026-10-15 · custom (read it) |
| [`flohoeller/affectui`](https://github.com/flohoeller/affectui) | one-file components and motion for AI products | one file per component, calm motion, dark mode (same pattern as this library's headers) | ★37 · pushed 2026-10-15 · MIT |
| [`21st-dev/skill`](https://github.com/21st-dev/skill) | 21st.dev skill: search, install, publish components | registry workflow for finding before building | ★19 · pushed 2026-09-09 · Apache-2.0 |
| [`21st-dev/magic-mcp`](https://github.com/21st-dev/magic-mcp) | component search and generation over MCP | see skills.md | ★6,044 · pushed 2026-09-09 · ISC |
