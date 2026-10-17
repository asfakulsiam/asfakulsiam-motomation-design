# Adapter: Next.js (App Router)

> **Dependencies (`craft/stack.md`, checked 2026-10-16):** `gsap` 3.15.0 and `lenis` 1.3.27 are approved: active, not deprecated, licence free for commercial use (GSAP Standard no-charge licence; Lenis MIT). Re-check npm and the repo (deprecation, last release, licence) at build time.

```bash
npm i gsap @gsap/react lenis
```

- Motion components are client components (`"use client"`). Keep pages and layouts as server components, and pass content down as props, so text is server-rendered for SEO.
- Fonts: `next/font/google` or `next/font/local`, exposed as CSS variables:
  ```ts
  import { Fraunces, Inter_Tight } from "next/font/google";
  const display = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], variable: "--font-display" });
  ```
- Register GSAP plugins once in a client module (`lib/gsap.ts`) and import from there.
- Smooth scroll: a client `<SmoothScroll>` provider in `app/layout.tsx` using `ReactLenis` with `autoRaf: false`, driven by `gsap.ticker`. See `examples/providers/smooth-scroll.tsx`.
- Route changes: call `ScrollTrigger.refresh()` after the new page mounts; `useGSAP` reverts the old page's triggers on unmount.
- Images: `next/image` with `sizes` and `priority` on the LCP image. Image sequences live in `/public/film/…` and are drawn to a canvas (no `next/image`).
- Three.js: `dynamic(() => import("./Scene"), { ssr: false })`.
- Stamp: the build minifies CSS and drops ordinary comments, so write the stamp (`SKILL.md` → Output rules) at the top of `app/globals.css` as `/*! motomation · … */` and check it survives in `.next/static/css/` or `out/_next/static/css/`.
- Metadata: export `metadata` / `generateMetadata` per route, plus `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts` and `public/llms.txt`.
