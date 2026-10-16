# Adapter: Plain HTML / CSS / JS

> **Dependency check (`craft/stack.md`, checked 2026-10-16):** `gsap` 3.15.0 fails check 1 (last release 2026-04-13, more than 6 months) and check 5 (GSAP Standard "no charge" licence, not MIT/Apache/ISC/BSD). Use GSAP only when the brief names it; otherwise the same technique is built with Motion, anime.js or the platform (CSS scroll-driven animations, WAAPI). Re-run the checks at build time.

The most portable route: works in any host, and in chat tools that can only produce one file.

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js" defer></script>
```

- Pin versions in production (e.g. `gsap@3.15.0`) and self-host if you can.
- Add `class="js"` to `<html>` in an inline script, so CSS can hide static fallbacks only when JS runs.
- Wrap all motion in `gsap.matchMedia()` exactly as in the framework examples.
- A complete single-file reference lives in `examples/html/motomation-film.html`.
