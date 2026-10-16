# verify-nextjs

A small, deliberately plain site that checks the Next.js output path works with zero configuration. It is a
functional test, not a design: if `npm install` and `npm run dev` succeed and the page loads at
http://localhost:3000, the toolchain works.

| Requirement | Where |
|---|---|
| App Router | `app/layout.tsx`, `app/page.tsx` |
| TypeScript | `tsconfig.json` (strict), every source file `.ts`/`.tsx` |
| Tailwind (v4, PostCSS plugin) | `postcss.config.mjs`, `app/globals.css` (`@import "tailwindcss"` + `@theme`) |
| GSAP scroll motion | `components/Chapters.tsx` (ScrollTrigger, scrubbed; nothing animates under reduced motion) |
| Mock data | `data/site.json`, `data/status.json` |
| Schema | `schema.json` (JSON Schema 2020-12); `npm run check:data` validates `data/` against it |
| Middleware | `middleware.ts`: sets `x-verify-middleware: ran` on every page, redirects `/home` → `/` |

```sh
cd templates/verify-nextjs
npm install
npm run dev        # http://localhost:3000
npm run check:data # data/*.json against schema.json
```

Versions are pinned exactly (Next 15.5.28, React 19.3.1, GSAP 3.15.0, Tailwind 4.3.3, TypeScript 5.9.3). Next 15 is
used because Next 16 renames `middleware.ts` to `proxy.ts`; this template is required to ship `middleware.ts`.
The run that verified it is in `evals/results/verify-nextjs/`.
