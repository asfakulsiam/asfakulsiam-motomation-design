# Contributing

Thank you for helping make AI-made websites less alike.

## Ground rules
1. **Original work only.** Write in your own words and code. Don't paste text or code from other skills, component libraries or repositories. Study how something works, then build it your own way. New components go in `skills/asfakulsiam-motomation-design/examples/components/<family>/` with a `// @motomation-component` header; run `node scripts/build-components.mjs` and rebuild the gallery.
2. **Short, single-purpose files.** SKILL.md is a router. Put detail in topic files.
3. **Every motion example** needs a reduced-motion path, a touch path and cleanup.
4. **Data rows** need a unique kebab-case id and must not break the CSV columns. Palettes must pass `node skills/asfakulsiam-motomation-design/scripts/contrast.mjs --palettes`.
5. **New behaviour** needs an eval brief in `evals/briefs/`.

## Cloning

The evidence branches (`benchmarks/*`, `bench-v4`, `evals`) hold builds and screenshots: a full clone is about 230 MiB, `main`'s own history about 140 MiB (older evidence that was committed before it moved off `main`), while the current tree is under the 15 MB budget. `git clone --single-branch` skips the evidence branches; `--depth 1` or `--filter=blob:none` is enough to work on the skill. Fetch an evidence branch only when you need it.

## Before opening a PR
```bash
node scripts/build-dist.mjs     # regenerate the single-file edition (and build-lite.mjs, build-sections.mjs if you touched them)
npm test                        # the canonical fast check: check-repo + unit tests, no browser, no network, no model calls
npm test -- --list              # every test tier and what runs it
```

`npm test` is the same list the CI `check` job runs (`scripts/test.mjs`). It runs every check, prints PASS or FAIL for each, exits 1 if any failed, and reports the browser tiers as NOT VERIFIED: a green `npm test` does not verify a page in a browser.

| Tier | What | Where it runs |
|---|---|---|
| Fast | repository lint, registry counts, gate and repo unit tests, eval tests with a fake `claude`, MCP session | `npm test`, CI `check` (Node 18 and 20) |
| Browser | gate fixtures, journey, pair, originality, composition, richness, entrance timing, reduced-motion stills | CI `gate-fixtures` (Playwright + Chromium); locally after `npm i playwright && npx playwright install chromium` |
| Components | per-component screenshots, interaction, SSR, RTL, adversarial text, grapheme-safe splitting (Bangla, Arabic, emoji) | `.github/workflows/components.yml` with the pinned toolchain |
| Distribution | `dist/` and Lite are regenerated and current, versions agree | `node scripts/build-dist.mjs && node scripts/build-lite.mjs`, then `npm test` (check-repo compares) |
| Benchmarks | generation and judging with real models | `evals/` and the `bench-*` workflows, by hand only; never routine CI |

A test file that no tier runs fails `check-repo.mjs`: add it to `scripts/test.mjs` (fast), to a workflow, or to `NOT_RUN` with the reason it is manual.

## Good first contributions
- A new signature move in recipe format (idea, why, build, detail, off-switch, prompt)
- A new collision source with a clear, stealable property
- A font with axes and licence details
- An eval run with screenshots, recorded in `evals/results/`
