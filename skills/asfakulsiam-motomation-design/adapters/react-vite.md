# Adapter: React + Vite

> **Dependency check (`craft/stack.md`, checked 2026-10-16):** `gsap` 3.15.0 fails check 1 (last release 2026-04-13, more than 6 months) and check 5 (GSAP Standard "no charge" licence, not MIT/Apache/ISC/BSD). Use GSAP only when the brief names it; otherwise the same technique is built with Motion, anime.js or the platform (CSS scroll-driven animations, WAAPI). Re-run the checks at build time.

```bash
npm create vite@latest site -- --template react-ts && cd site && npm i gsap @gsap/react lenis
```

- Use `useGSAP(() => …, { scope })` for every animation; it handles cleanup on unmount and in Strict Mode.
- Smooth scroll provider at the root, as in the Next adapter (no `"use client"` needed).
- Pre-render marketing pages (e.g. `vite-plugin-ssg`, or move to Astro/Next) if SEO matters. A client-only SPA hides content from crawlers until JS runs.
- Self-host fonts with `@fontsource-variable/<family>` packages where available.
- Code-split heavy scenes with `React.lazy(() => import("./Scene"))`.
