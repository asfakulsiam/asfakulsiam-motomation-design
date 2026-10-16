# Next.js zero-config check (templates/verify-nextjs), 2026-10-16

`templates/verify-nextjs` is a functional test, not a design:
- App Router, TypeScript, Tailwind v4 (`@tailwindcss/postcss`), GSAP ScrollTrigger for the chapter motion;
- `data/*.json` mock data, checked against `schema.json` by `npm run check:data` (a separate script, not part of the build);
- `middleware.ts`, which adds `x-verify-middleware: ran` and redirects `/home` to `/`.

The run, in a fresh shell (`env -i`) with `node_modules` and `.next` deleted first, Node 20.20.2, npm 10.8.2:

| Step | Result | Output |
|---|---|---|
| `npm install` | exit 0: added 53 packages, 0 vulnerabilities | `npm-install.txt` |
| `npm run dev` | Next.js 15.5.28, ready in 1.5 s, `GET / 200` | `npm-run-dev-first-20-lines.txt` |
| page checks | `GET /` 200 · middleware header present · `/home` → 307 to `/` · GSAP faded chapters 1–2 in on scroll (opacity 1.00, 1.00, 0.00, 0.00) · no console errors | `page-checks.txt` |
| `npm run build` | exit 0; `/` static, middleware 34.1 kB | `npm-run-build-tail.txt` |
| `npm run check:data` | exit 0: "data/*.json match schema.json (2 files)" | (run after the build) |

The first install, before the postcss override in `package.json`, reported 2 moderate vulnerabilities: Next 15 bundles postcss ≤ 8.5.22. The `overrides` pin postcss 8.5.30.

Screenshots (evals branch): [the running page](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/verify-nextjs/running-page.webp) · [after scrolling](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/results/verify-nextjs/running-page-scrolled.webp).
