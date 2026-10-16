# Stack and dependencies

Step 0 of `thinking/sequence.md` decides the stack. This file holds the default and the rule every dependency passes.

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

## The five checks

Every dependency, direct or added later, passes all five before it is installed:

| # | Check | Passes when | How to check |
|---|---|---|---|
| 1 | **Maintained** | a commit or release within the last 6 months | `npm view <pkg> time.modified`; the repo's last commit (`gh api repos/<owner>/<repo> --jq .pushed_at`) |
| 2 | **Popular** | 10,000+ weekly npm downloads | `curl -s https://api.npmjs.org/downloads/point/last-week/<pkg>` |
| 3 | **Not deprecated** | no deprecation notice on npm or in the repo | `npm view <pkg> deprecated` prints nothing; the README and repo are not archived |
| 4 | **Modern** | supports Node 20+ and React 19 (when it touches React) | `npm view <pkg> engines peerDependencies` |
| 5 | **Licensed** | MIT, Apache-2.0, ISC or BSD | `npm view <pkg> license` |

Before adding a package, run `npm view <pkg> name version license deprecated time.modified engines peerDependencies`, open its GitHub repo, and check the last release and any deprecation. **If any check fails, find an alternative that passes, or build it from scratch.** A brief that names a specific library overrides the check for that library only (the same way a named stack wins); record it in `DESIGN.md` under `Dependencies` with the failing check.

Record every dependency in `DESIGN.md`:

```markdown
## Dependencies
| Package | Why (what the platform can't do) | 1 maintained | 2 weekly downloads | 3 deprecated | 4 Node 20 / React 19 | 5 licence |
|---|---|---|---|---|---|---|
| motion | layout and spring animation | 2026-10-15 | 25.2M | no | yes / yes | MIT |
```

## Eco-friendly

- **Use the platform first.** CSS scroll-driven animations, `view-transition`, WAAPI, `IntersectionObserver`, `<dialog>`, `popover` and native form validation before a library.
- **No heavy dependency for a small feature.** A 40KB library for one fade is a fail; write the fade.
- **Tree-shakeable only.** ES modules with named exports; import what is used (`import { animate } from "motion"`).
- **No unmaintained transitive dependencies.** Check `npm ls --all` after install; a deprecated transitive package fails check 3 for its parent.
- Every dependency counts against the tier's JS budget in `gates/rules.md`.

## Snapshot (checked 2026-10-16)

Re-check at build time; this table goes stale.

| Package | Last publish | Weekly downloads | Licence | Node / React | Result |
|---|---|---|---|---|---|
| next 16.4.2 | 2026-10-15 | 67.5M | MIT | ≥ 20.9 / ^19 | passes |
| react 19.3.1 | 2026-10-15 | 188.0M | MIT | — | passes |
| tailwindcss 4.3.3 | 2026-10-15 | 137.3M | MIT | — | passes |
| motion 14.3.0 | 2026-10-15 | 25.2M | MIT | — / ^19 | passes |
| lenis 1.3.27 | 2026-10-15 | 1.9M | MIT | — / ≥ 17 | passes |
| three 0.186.1 | 2026-09-24 | 21.4M | MIT | — | passes |
| @react-three/fiber 9.8.2 | 2026-10-14 | 6.2M | MIT | — / ≥ 19 < 19.4 | passes |
| animejs 4.5.0 | 2026-08-17 | 1.1M | MIT | — | passes |
| @rive-app/canvas 2.44.2 | 2026-10-10 | 1.3M | MIT | — | passes |
| zod 4.6.7 | 2026-10-12 | 346.9M | MIT | — | passes |
| gsap 3.15.0 | 2026-04-13 | 6.0M | GSAP Standard "no charge" licence | — | **fails 1 and 5**: use Motion, anime.js or the platform unless the brief names GSAP |
| lottie-web 5.13.0 | 2025-05-21 | 7.9M | MIT | — | **fails 1**: prefer Rive or the platform |
| split-type 0.3.4 | 2023-10-22 | 57K | ISC | — | **fails 1**: split text by hand (`Intl.Segmenter`) |
