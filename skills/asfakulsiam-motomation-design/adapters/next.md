# Adapter: Next.js (App Router)

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
- Metadata: export `metadata` / `generateMetadata` per route, plus `app/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts` and `public/llms.txt`.
