# Stack and dependencies

Step 0 of `thinking/sequence.md` decides the stack. This file holds the default and the three checks every dependency passes.

## The default

**Next.js (App Router, TypeScript, Tailwind CSS)** for anything with routes or data. Adapter: `adapters/next.md`.

| The brief | Stack |
|---|---|
| names a stack (or the project already has one) | that stack |
| says "ask me" | ask once, in the plan's single question, offering Next.js as the default |
| says "you choose", or names none, and the site has routes or data | Next.js |
| is a single static page (one route, no data, no build step wanted) | plain HTML/CSS/JS is fine (`adapters/vanilla.md`) |
| is e-commerce | Next.js. Never Astro or React + Vite for e-commerce unless the brief demands it |
| is a client-only embed or prototype the brief asks for as such | React + Vite (`adapters/react-vite.md`) |
| is content-only and the brief asks for Astro | Astro (`adapters/astro.md`) |

Never pick a stack because it was the last one used. The choice and its reason go in the plan and in `DESIGN.md` under `Stack`.

## Dependencies

A dependency is approved if it meets all three:

1. **Active** — the package is maintained. It has a release, a commit, or a verified maintainer response within the last 12 months, OR it is a stable, widely-used package whose API is settled and whose maintainers have committed to long-term support (React, Next.js, GSAP, three.js, and similar are examples).

2. **Not deprecated** — no deprecation notice on npm, in the package, or in its repository. No "use X instead" banner.

3. **Licence is free for commercial use** — MIT, Apache 2.0, ISC, BSD, or a permissive no-charge licence whose text clearly allows free commercial use. GSAP's Standard no-charge licence qualifies. AGPL, GPL, Commons Clause, and "for non-commercial use only" licences do not.

Do not measure by commit frequency alone. Do not measure by weekly download count alone. Popular, stable, well-maintained libraries with infrequent releases are approved.

Examples of approved libraries:
Motion (Framer Motion), GSAP, Lenis, Three.js, React Three Fiber, anime.js, lottie-web, SplitType, Swiper, Radix UI, shadcn/ui, Tailwind, Next.js, React, TypeScript, Zod, TanStack Query, TanStack Router, tRPC, Prisma, Drizzle

Before adding a package the agent checks npm and the repo for:

- deprecation notice
- last release date
- licence

If any is a fail, find an alternative or build from scratch.

Record every dependency in `DESIGN.md`:

```markdown
## Dependencies
| Package | Why (what the platform can't do) | 1 active (last release) | 2 deprecated | 3 licence |
|---|---|---|---|---|
| motion | layout and spring animation | 2026-10-15 | no | MIT |
```

## Eco-friendly

- **Use the platform first.** CSS scroll-driven animations, `view-transition`, WAAPI, `IntersectionObserver`, `<dialog>`, `popover` and native form validation before a library.
- **No heavy dependency for a small feature.** A 40KB library for one fade is a fail; write the fade.
- **Tree-shakeable only.** ES modules with named exports; import what is used (`import { animate } from "motion"`).
- **No unmaintained transitive dependencies.** Check `npm ls --all` after install; a deprecated transitive package fails check 2 for its parent.
- Every dependency counts against the tier's JS budget in `gates/rules.md`.

## Snapshot (checked 2026-10-16)

`npm view <pkg> version license deprecated time.modified` for the approved examples. Re-check at build time; this table goes stale.

| Package | Last publish | Deprecated | Licence | Result |
|---|---|---|---|---|
| motion 14.3.0 | 2026-10-15 | no | MIT | approved |
| gsap 3.15.0 | 2026-04-13 | no | GSAP Standard "no charge" licence (free commercial use) | approved (stable, settled API, long-term support) |
| lenis 1.3.27 | 2026-10-15 | no | MIT | approved |
| three 0.186.1 | 2026-09-24 | no | MIT | approved |
| @react-three/fiber 9.8.2 | 2026-10-14 | no | MIT | approved |
| animejs 4.5.0 | 2026-08-17 | no | MIT | approved |
| lottie-web 5.13.0 | 2025-05-21 | no | MIT | approved (stable, settled API) |
| split-type 0.3.4 | 2023-10-22 | no | ISC | approved (stable, settled API) |
| swiper 14.3.0 | 2026-09-28 | no | MIT | approved |
| @radix-ui/react-dialog 1.3.1 | 2026-10-14 | no | MIT | approved |
| shadcn 4.21.5 | 2026-10-14 | no | MIT | approved |
| tailwindcss 4.3.3 | 2026-10-15 | no | MIT | approved |
| next 16.4.2 | 2026-10-15 | no | MIT | approved |
| react 19.3.1 | 2026-10-15 | no | MIT | approved |
| typescript 7.0.2 | 2026-10-15 | no | Apache-2.0 | approved |
| @rive-app/canvas 2.44.2 | 2026-10-10 | no | MIT | approved |
| zod 4.6.7 | 2026-10-12 | no | MIT | approved |
| @tanstack/react-query 5.104.3 | 2026-10-15 | no | MIT | approved |
| @tanstack/react-router 1.170.44 | 2026-10-12 | no | MIT | approved |
| @trpc/server 11.19.0 | 2026-09-28 | no | MIT | approved |
| prisma 8.0.0-rc.23 | 2026-10-15 | no | Apache-2.0 | approved |
| drizzle-orm 0.45.4 | 2026-10-08 | no | Apache-2.0 | approved |
