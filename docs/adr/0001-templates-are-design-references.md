# ADR 0001: Templates are design references, not code to copy

- **Status:** accepted (v2.6.0)
- **Context:** concept fix T6

## Context

The page templates in `skills/asfakulsiam-motomation-design/examples/templates/` shipped as `<id>.html` files, with the
React source beside the design record (`<id>/page.tsx` next to `<id>/DESIGN.md`). An agent reading the folder saw an
HTML page as "the template" and copied its stack and file layout, whatever the brief asked for. That contradicts Step 0
(Stack) in `thinking/sequence.md`: the stack comes from the brief, the project or the user, never from an example.

Two options were on the table:

- **A.** Move each template to a design-only folder: `DESIGN.md` + screenshot + `structure.md`, no code.
- **B.** Ship three variants per template (`next/`, `react/`, `html/`) and use only the one matching Step 0.

## Decision

**Option A.** Each `examples/templates/<id>/` folder is the template, and it is design only:

| File | What it is |
|---|---|
| `DESIGN.md` | the decisions: tension, concept, type, colour, layout, imagery, Restraint Gate record |
| `structure.md` | stack-neutral structure: sections or chapters in order, what each does, mobile, reduced motion |
| `og.jpg` | the screenshot (Tier 5 films also have `poster.webp`, the film's first frame) |
| `log.json`, `MOTION.md` | the memory record the gate reads; the timing sheet (Tier 4–5) |

The code moved out. The React page that composes each design from `examples/sections/` is now
`examples/builds/<id>/page.tsx`, and `examples/templates/<id>.html` is its rendered preview: the page the Delivery Gate
measures and stamps, and GitHub Pages serves. Both are evidence that the design holds up in one stack, labelled as such
in `examples/README.md` and `examples/templates/README.md`.

## Why not B

- Three variants of eight pages is 24 builds to keep equal. They would drift, and the gate would have to measure and
  stamp each one, tripling the work without improving the design.
- Three stacks is still a menu. A brief that names Astro, SvelteKit or a CMS theme gets nothing, and the variant
  folders would again teach "pick the matching code", the habit this release removes (T5: fuel, not a menu).
- A design reference transfers to any stack. Code transfers only to its own.

## Consequences

- `scripts/build-templates.mjs` reads sources from `examples/builds/<id>/page.tsx` and writes each template's
  `structure.md` from the section headers, so the structure can't drift from what was built.
- `scripts/check-repo.mjs` counts template usage from `examples/builds/`.
- The rendered previews keep their paths (`examples/templates/<id>.html`): the gate finds a page's `DESIGN.md` and
  `log.json` in its own `<id>/` folder, and Pages, the perf test and the OG builder read these paths.
- **Exception:** the two Tier 5 film templates (`motion-portfolio`, `product-launch`) keep `index.html`, `scene.mjs`
  and their frame files in the folder. Their frames are rendered from `scene.mjs` and pinned by `frames.lock.json`
  to those paths; moving them would break `fetch-frames.mjs` and the frame check. Their `structure.md` says the code
  there is the reference build, not a layout to reproduce.
- Every rebuilt preview was gated again and re-stamped with the measured line.
