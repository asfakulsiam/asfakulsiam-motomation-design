# Adapter: React + Vite

```bash
npm create vite@latest site -- --template react-ts && cd site && npm i gsap @gsap/react lenis
```

- Use `useGSAP(() => …, { scope })` for every animation; it handles cleanup on unmount and in Strict Mode.
- Smooth scroll provider at the root, as in the Next adapter (no `"use client"` needed).
- Pre-render marketing pages (e.g. `vite-plugin-ssg`, or move to Astro/Next) if SEO matters. A client-only SPA hides content from crawlers until JS runs.
- Self-host fonts with `@fontsource-variable/<family>` packages where available.
- Code-split heavy scenes with `React.lazy(() => import("./Scene"))`.
