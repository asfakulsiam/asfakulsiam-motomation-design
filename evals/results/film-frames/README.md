# Film frames: fresh-clone test (2026-10-17)

The choice is **option B, fetch on demand**. The two films' `frames/` and `frames-mobile/` come to about 7.2 MB
(product-launch 3.8 MB + 0.94 MB, motion-portfolio 1.8 MB + 0.62 MB), over the 5 MB limit for committing frames.
Main is at 12.86 MB of its 15 MB limit. `scripts/fetch-frames.mjs` already existed (d4bc28a, root entry point plus
`skills/asfakulsiam-motomation-design/scripts/fetch-frames.mjs`). It downloads the tarball named in each template's
`frames.lock.json` from the evals branch, checks its sha256, and unpacks it.

## The test

1. Clone main at 5c2c97b to `/tmp/fresh`.
2. Check which templates have their frames: `node scripts/fetch-frames.mjs --check`.
3. Open both films and measure the canvas. `canvas-check.mjs` (this folder) opens each film in Chromium (Playwright
   1.59.0, 1440×900, full motion, `?ambient=force`), scrolls into the film, and measures how much of the canvas is
   painted.
4. Fetch the frames: `node scripts/fetch-frames.mjs`.
5. Measure both films again.

```
$ node scripts/fetch-frames.mjs --check
✗ motion-portfolio: 0/180 desktop, 0 mobile frames on disk
✗ product-launch: 0/180 desktop, 0 mobile frames on disk

BEFORE fetch:
product-launch {"canvas":true,"size":"840x900","paintedPct":0,"colours":1,"frameRequests200":0,"frameRequestsFailed":180}
motion-portfolio {"canvas":true,"size":"1440x900","paintedPct":0,"colours":1,"frameRequests200":0,"frameRequestsFailed":180}

$ node scripts/fetch-frames.mjs
↓ motion-portfolio: https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/evals/evals/frames/motion-portfolio-frames.tar.gz … 2.2 MB, sha256 ok, 180 + 90 frames
↓ product-launch: https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/evals/evals/frames/product-launch-frames.tar.gz … 5.3 MB, sha256 ok, 180 + 90 frames
exit 0
✓ motion-portfolio: 180/180 desktop, 90 mobile frames on disk
✓ product-launch: 180/180 desktop, 90 mobile frames on disk

AFTER fetch:
product-launch {"canvas":true,"size":"840x900","paintedPct":100,"colours":101,"frameRequests200":180,"frameRequestsFailed":0}
motion-portfolio {"canvas":true,"size":"1440x900","paintedPct":100,"colours":50,"frameRequests200":180,"frameRequestsFailed":0}
```

Before the fetch, the canvas is blank: one colour, and all 180 frame requests return 404. After the fetch, the
canvas is fully painted: 101 and 50 distinct colours, and all 180 frame requests return 200. Screenshots were checked
by eye: the radio at step 2 of 4, and the portfolio's Shot 01 light line. `git status` in the clone stayed clean,
because the frames are gitignored.

Run it: `NODE_PATH=<dir with playwright> node evals/results/film-frames/canvas-check.mjs skills/asfakulsiam-motomation-design/examples/templates`
