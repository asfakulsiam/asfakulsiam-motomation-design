# Shapla R1 · a kitchen radio you tune by hand (Tier 5 film template)

## Get the frames first

Run `node scripts/fetch-frames.mjs` before building the film templates. Frames are kept off the repo to keep install small.

```sh
node scripts/fetch-frames.mjs product-launch      # this template only; no id fetches every film template
node scripts/fetch-frames.mjs --check   # no network: which templates have their frames on disk
```

The command works from the repository root or from the skill folder. It downloads the tarball named in `frames.lock.json` (https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/evals/evals/frames/product-launch-frames.tar.gz). It checks the tarball's sha256, then unpacks `frames/`, `frames-mobile/` and `film.mp4` into this folder. These are gitignored. Without them, a fresh clone shows a blank film canvas: every `frames/NNNN.webp` request returns 404. Reduced motion is unaffected, because it uses `storyboard/`, which is on main.

To work offline, rebuild the frames with `scripts/build-frames.mjs` (see `MOTION.md` and `DESIGN.md`, "Frame storage").

**Storage choice: fetch on demand (option B).** Committing the frames (option A) was rejected because the two films' `frames/` and `frames-mobile/` come to about 7.2 MB, over the 5 MB limit for committing frames. Main is already at 12.86 MB of its 15 MB limit.

## Files

- `index.html`: the page
- `scene.mjs`: the scene the frames are rendered from
- `frames.json`: the frame manifest
- `frames.lock.json`: where the frames live, and their sha256
- `poster.webp`: first paint and the no-JS image
- `storyboard/`: the reduced-motion stills
- `DESIGN.md`, `MOTION.md` (the timing sheet), `structure.md`, `log.json`
