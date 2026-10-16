# Adapter: React + Vite

> **Dependencies (`craft/stack.md`, checked 2026-10-16):** `gsap` 3.15.0 and `lenis` 1.3.27 are approved: active, not deprecated, licence free for commercial use (GSAP Standard no-charge licence; Lenis MIT). Re-check npm and the repo (deprecation, last release, licence) at build time.

```bash
npm create vite@latest site -- --template react-ts && cd site && npm i gsap @gsap/react lenis
```

- Use `useGSAP(() => …, { scope })` for every animation; it handles cleanup on unmount and in Strict Mode.
- Smooth scroll provider at the root, as in the Next adapter (no `"use client"` needed).
- Pre-render marketing pages (e.g. `vite-plugin-ssg`, or move to Astro/Next) if SEO matters. A client-only SPA hides content from crawlers until JS runs.
- Self-host fonts with `@fontsource-variable/<family>` packages where available.
- Code-split heavy scenes with `React.lazy(() => import("./Scene"))`.
