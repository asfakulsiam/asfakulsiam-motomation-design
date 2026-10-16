# Sources: Production-grade foundation

> Concepts only. Read these for **method and principle**; never copy code, markup, shaders or assets into a build
> (`craft/research.md`). Status checked 2026-10-16 with the GitHub API (stars · last push · licence). Re-check before
> relying on one: a source that is archived, unlicensed or untouched for a year is a reference, never a dependency
> (dependencies are chosen in Step 0, `thinking/sequence.md`). Never use anything from CreativeAgencyStyle (reported as malware).

Read for **production defaults**: framework conventions, tokens, colour, fonts, measurement and testing. These are what a sellable template is built on.

| Source | What it is | What to take (a principle, not code) | Status |
|---|---|---|---|
| [`vercel/next.js`](https://github.com/vercel/next.js) | Next.js | App Router conventions: layouts, loading and error files per route, middleware | ★143,027 · pushed 2026-10-16 · MIT |
| [`withastro/astro`](https://github.com/withastro/astro) | Astro | content-first static output; islands only where needed | ★63,263 · pushed 2026-10-16 · custom (read it) |
| [`sveltejs/kit`](https://github.com/sveltejs/kit) | SvelteKit | load functions and form actions: data and mutation per route | ★20,861 · pushed 2026-10-16 · MIT |
| [`tailwindlabs/tailwindcss`](https://github.com/tailwindlabs/tailwindcss) | Tailwind CSS | design tokens as the only source of values | ★97,879 · pushed 2026-10-15 · MIT |
| [`storybookjs/storybook`](https://github.com/storybookjs/storybook) | Storybook | every component state rendered and reviewable in isolation | ★91,314 · pushed 2026-10-15 · MIT |
| [`amzn/style-dictionary`](https://github.com/style-dictionary/style-dictionary) | Style Dictionary | one token source compiled to every platform | ★4,861 · pushed 2026-10-10 · Apache-2.0 · now `style-dictionary/style-dictionary` |
| [`argyleink/open-props`](https://github.com/argyleink/open-props) | Open Props | a complete token scale as CSS custom properties | ★5,546 · pushed 2026-10-11 · MIT |
| [`culori/culori`](https://github.com/Evercoder/culori) | culori colour library | OKLCH maths for palettes and contrast | ★1,241 · pushed 2026-10-15 · MIT · now `Evercoder/culori` · the listed `culori/culori` does not exist |
| [`fontsource/fontsource`](https://github.com/fontsource/fontsource) | self-hosted open-source fonts as npm packages | self-host fonts: no third-party request, CSP stays `self` | ★6,201 · pushed 2026-10-14 · MIT |
| [`GoogleChrome/lighthouse`](https://github.com/GoogleChrome/lighthouse) | Lighthouse | measured performance, accessibility and SEO, never claimed | ★30,894 · pushed 2026-10-15 · Apache-2.0 |
| [`GoogleChrome/web-vitals`](https://github.com/GoogleChrome/web-vitals) | web-vitals | LCP, INP, CLS from real users | ★8,648 · pushed 2026-10-15 · Apache-2.0 |
| [`microsoft/playwright`](https://github.com/microsoft/playwright) | Playwright | the browser this skill's gate runs in; test states, not screenshots alone | ★97,818 · pushed 2026-10-16 · Apache-2.0 |
