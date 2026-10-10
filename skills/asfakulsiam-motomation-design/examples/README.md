# Examples

Production-ready reference components. Each one is typed (strict TypeScript), cleans up after itself, and has a reduced-motion and touch path. Copy them into a project and **bend them to the concept**. They are starting points, not finished designs.

**Requirements (React examples):** `react@19`, `gsap@^3.13` (all plugins free), `@gsap/react`, `lenis@^1.3`, Tailwind CSS v4 (utility classes) and CSS variables `--ground --surface --ink --muted --accent --line --font-display`.

| File | Tier | What it shows |
|---|---|---|
| `lib/gsap.ts` | — | One place to register plugins, plus shared `matchMedia` queries |
| `providers/smooth-scroll.tsx` | 2 | Lenis driven by the GSAP ticker (one loop), refresh after fonts load |
| `hero/cinematic-hero.tsx` | 2 | Edge-anchored display type, line reveal, the hero recedes on scroll |
| `animation/line-curtain.tsx` | 2 | Real line-by-line masked reveal with SplitText (`autoSplit`) |
| `typography/proximity-weight.tsx` | 2 | Variable-font weight follows the cursor; screen readers get the plain word |
| `micro-interactions/magnetic-button.tsx` | 1–2 | Considerate Magnet: the label moves, the hit area doesn't; all button props pass through |
| `backgrounds/atmospheric.tsx` | 2 | Drifting light on canvas, DPR-aware, paused off-screen and in hidden tabs |
| `product/feature-demo.tsx` | 2 | Workbench pattern: scroll-driven product steps; stacked on mobile |
| `scroll/pinned-chapter.tsx` | 2 | One idea in three beats; shorter on mobile; static under reduced motion |
| `motomation/image-sequence-film.tsx` | 5 | Pinned image-sequence film with scene type, timecode rail, bounded playhead-first frame loading and a static storyboard fallback |
| `html/motomation-film.html` | 5 | **Single file, no build:** the whole Motomation pattern in vanilla JS. Open it in a browser |

Open the HTML demo locally:
```bash
npx serve skills/asfakulsiam-motomation-design/examples/html   # or just double-click the file
```

Placeholder copy in these files is deliberately plain. Replace it with the brief's real words. Never ship it.
