# Tier 5 frame sequences

The Tier 5 templates (`motion-portfolio`, `product-launch`) scrub a canvas through a rendered frame sequence. The sequences
(`frames/`, `frames-mobile/`) and `film.mp4` were moved off `main` on 2026-10-13 to keep the skill small.

- `<template>-frames.tar.gz` holds `frames/`, `frames-mobile/` and `film.mp4`, relative to the template folder.
- `SHA256SUMS` lets the fetch script verify each tarball.
- `MOVED-FROM-MAIN.txt` lists every path that was in the tarballs.

Restore them on a checkout of `main` (repository root): `node scripts/fetch-frames.mjs`.
Regenerate them byte-identically from the scene instead: `node scripts/build-frames.mjs --scene examples/templates/<id>/scene.mjs --out examples/templates/<id>` (skill folder).
