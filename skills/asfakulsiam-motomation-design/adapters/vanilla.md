# Adapter: Plain HTML / CSS / JS

> **Dependencies (`craft/stack.md`, checked 2026-10-16):** `gsap` 3.15.0 and `lenis` 1.3.27 are approved: active, not deprecated, licence free for commercial use (GSAP Standard no-charge licence; Lenis MIT). Re-check npm and the repo (deprecation, last release, licence) at build time.

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
