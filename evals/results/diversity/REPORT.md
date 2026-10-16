# Diversity arm, run 1 (skill v2.10.1, 2026-10-16)

Five deliberately unrelated briefs, one build each, compared on the six originality axes. **Result: FAIL.** 7 of 10 pairs repeat on at least one axis (≥ 0.4). Structure and signature never repeat. Interaction repeats in 5 pairs, image in 2, typography in 2. No pair's overall score reaches 0.4 (max 0.38).

| Brief | Build | Archetype · signature · tier | Gate |
|---|---|---|---|
| [01 funeral home](../../briefs/diversity/01-funeral-home.md) | [01-funeral-home/](01-funeral-home/) | Timeline → single sheet · paper feed · 2 | FAIL (q1: sticky call bar under reduced motion) |
| [02 children's dentistry](../../briefs/diversity/02-childrens-dentistry.md) | [02-childrens-dentistry/](02-childrens-dentistry/) | Field Guide · tooth passport · 3 | FAIL (c2, J mobile 2) |
| [03 hardcore metal band](../../briefs/diversity/03-hardcore-metal-band.md) | [03-hardcore-metal-band/](03-hardcore-metal-band/) | Room, no nav · impact · 4 | FAIL (k4: forced colours) |
| [04 luxury perfume](../../briefs/diversity/04-luxury-perfume.md) | [04-luxury-perfume/](04-luxury-perfume/) | Stage · seven-year ruler · 3 | FAIL (J mobile 1) |
| [05 municipal water authority](../../briefs/diversity/05-municipal-water-authority.md) | [05-municipal-water-authority/](05-municipal-water-authority/) | Manifesto · the sentence answers your ward · 1 | PASS |

Each build's home page (`index.html`) and `og.jpg` live on the [`evals` branch](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/evals/evals/results/diversity), like every heavy artifact (evals/README.md); everything else (the other pages, CSS, JS, DESIGN.md, MOTION.md, gate.txt) is on main. Restore them before a re-run: `git checkout origin/evals -- evals/results/diversity && git restore --staged evals/results/diversity`.

Re-run: `node evals/diversity.mjs` (matrix only, about 35 s) or `node evals/diversity.mjs --gate` (plus the Delivery Gate, about 20 min on 2 CPUs).

## Measured

**Similarity matrix**: `scripts/originality.mjs` via `node evals/diversity.mjs`, Chromium 147, 1440×900, on the final builds. Full per-axis 5×5 tables are in [matrix.md](matrix.md), and raw features and parts are in [matrix.json](matrix.json).

| Pair | structure | composition | image | typography | interaction | signature | overall |
|---|---:|---:|---:|---:|---:|---:|---:|
| funeral × dentistry | 0.18 | 0.12 | 0.00 | 0.41 ✗ | 0.58 ✗ | 0.17 | 0.24 |
| funeral × metal | 0.01 | 0.06 | 0.00 | 0.09 | 0.47 ✗ | 0.10 | 0.12 |
| funeral × perfume | 0.13 | 0.09 | 0.00 | 0.20 | 0.49 ✗ | 0.09 | 0.17 |
| funeral × water | 0.10 | 0.31 | 1.00 ✗ | 0.41 ✗ | 0.35 | 0.10 | 0.38 |
| dentistry × metal | 0.03 | 0.18 | 0.00 | 0.10 | 0.52 ✗ | 0.13 | 0.16 |
| dentistry × perfume | 0.05 | 0.04 | 0.67 ✗ | 0.16 | 0.38 | 0.00 | 0.22 |
| dentistry × water | 0.06 | 0.29 | 0.00 | 0.37 | 0.35 | 0.06 | 0.19 |
| metal × perfume | 0.16 | 0.04 | 0.00 | 0.08 | 0.64 ✗ | 0.05 | 0.16 |
| metal × water | 0.01 | 0.04 | 0.00 | 0.12 | 0.36 | 0.13 | 0.11 |
| perfume × water | 0.07 | 0.06 | 0.00 | 0.26 | 0.38 | 0.11 | 0.15 |
| **max** | 0.18 | 0.31 | 1.00 | 0.41 | 0.64 | 0.17 | 0.38 |

**Why each repeat scored what it did** (`parts` in matrix.json):

| Pair · axis | Sub-scores |
|---|---|
| every interaction repeat | `pointer` = 1.00 in all 10 pairs (no build has a custom cursor or pointer listener); `click` 0.5–1.0 (all use plain links and one form) |
| funeral × dentistry · interaction 0.58 | hover 0, click 1, scroll 0.33, pointer 1 |
| metal × perfume · interaction 0.64 | hover 0.2, click 1, scroll 0.29, pointer 1 |
| funeral × water · image 1.00 | `none: 1`: neither page has imagery, and the axis scores shared absence as identical |
| dentistry × perfume · image 0.67 | ratio/size 0, crop/mask 1, effects 1: one inline SVG each, unmasked, no filter |
| funeral × dentistry · typography 0.41 | families 0, scale 0.54, rhythm 0.48, hierarchy 0.66 |
| funeral × water · typography 0.41 | families 0, scale 0.60, rhythm 0.50, hierarchy 0.50 |

**Process, measured by the skill's own scripts** (evidence: [draws.txt](draws.txt), [memory-log.json](memory-log.json), each build's DESIGN.md `## Divergence`):

| Step | What happened |
|---|---|
| `collide.mjs` draws | 9101 and 9404 both drew **The Timeline**; 9404 and 9505 both drew the **tailor's measuring tape**; 4 of 5 draws carry fingerprint `layout=sequence` |
| `memory.mjs check` before build 4 | `✗ archetype "timeline" was used in 1 of the last 3 runs` → build 4 took the seeded fallback, The Stage |
| `memory.mjs check` before builds 2, 3, 4 | `✗ tier "2" was used …` each time; tiers moved 2 → 3 → 4, and before build 4 every tier used so far (2, 3, 4) was flagged |
| `memory.mjs check` before build 5 | every field fresh; the repeated collision (measuring tape) is not checked |
| Gate S (variety) in every stamp | `S1[last5:archetype-reused …]` even for The Stage, used by one build only: the build is compared with its own log entry |

**Delivery Gate**: `scripts/gate.mjs <build>`, final run. Logs are each build's `gate.txt`; the first-run logs are in [_gate-first-run/](_gate-first-run/).

| Build | First run | Fixed (functional only) | Final |
|---|---|---|---|
| 01 funeral | J mobile 2 (lines hidden by `clip-path` cannot be tapped), X 3 routes + 1 evidence, rm-flow | reveal → opacity + transform; Scope regex escaped; completeness `.html` fix | gate c0 o0 w0 rm0 a0 n0 q1 k0, rules C0 S0 P0 K0, J PASS, X ✓. FAIL on q1 only: sticky call bar still pinned under reduced motion |
| 02 dentistry | c2, J mobile 2 + forms 1 (server error read as success), X routes | "could not be sent" → "could not send" | c2 (cream on #a2a4ab, "Home" pill at 375/390), J mobile 2 (self-links), forms 5/5, X ✓ |
| 03 metal | c26 (red #e01b12 at 4.09:1), o3 (unlanded headings at scale 1.18), focus 1, forced 4, X routes | red → #f22b1f (4.85:1), rooms clip, black focus ring on red, forced-colours disarm | c0 o0, J PASS, X ✓; FAIL on k4: 4 texts illegible in forced colours |
| 04 perfume | target 1 ("Maison Ilham" 19px), J mobile 1 | `.house` padding | targets ✓; J mobile 1 (self-link "Maison Ilham" on /) |
| 05 water | targets 4 (22px links) | 44px stand-alone links | **PASS**, every axis and J 6/6 |

**Fixes to the measuring tools that this arm surfaced** (each was re-run on the existing evidence):

1. `originality.mjs` dropped inline `<svg>` roots from the image and composition axes, because `e.closest("svg")` matches the element itself. The first matrix ([matrix-first-run-svg-bug.md](matrix-first-run-svg-bug.md)) scored image = 1.00 on all 10 pairs. Fixed; painted `role="img"` boxes are now counted too.
2. `originality.mjs` needed content blocks to be half the viewport wide, so the funeral home's 38rem sheet had 0 blocks. They now need half of `<main>`'s width.
3. `completeness.mjs` did not match a Scope route written as `/prices.html` to the file `prices.html`. Fixed.
4. Task 1 evidence re-measured with fix 1 and 2: two builds overall 0.19 → 0.14, still PASS. Ten templates: 11 → 12 of 45 pairs clean ([originality-templates/README.md](../originality-templates/README.md)).

The matrix after the tool fixes and before the gate fixes is [matrix-before-gate-fixes.md](matrix-before-gate-fixes.md). The gate fixes moved no axis across 0.4.

## Judged

All opinions are `(opinion)` from `self`, the agent that built the five sites and also wrote the metric.

**Where the system avoids repetition (opinion, self)**
- Structure (max 0.18) and signature (max 0.17) never come close. The five sites are a paper sheet on a table, a booklet of rounded cards, full-bleed numbered rooms, a dark stage with one object, and a document with one large sentence. Their signatures (feed, stamp, slam, ruler, sentence) differ in trigger, property and element. The concept step works: each signature is derived from the brief's tension, not chosen from a list.
- Type and palette diverge in every pair (families = 0 everywhere). Five families, five palettes, no default stack.
- Memory did its job once in a way the draw could not. The collision engine handed the perfume the same archetype as the funeral home, and `memory.mjs check` refused it. Without the log, builds 1 and 4 would have shared their skeleton.

**Where it fails, and why (opinion, self)**
1. **Interaction is the weakest axis, and partly a measurement artefact.** `pointer = 1` in every pair is shared absence: none of the five briefs called for pointer play, so "no cursor work" counts as identical. The real part is `click`: every build is links plus at most one form, with no tabs, disclosures, dialogs or toggles except the water site's language switch. The skill produces different scroll and hover behaviour but always the same click vocabulary. The same pattern showed in Task 1's ten templates (29 of the 33 repeating pairs repeat on interaction).
2. **Image repeats are real, and one comes from shared absence.** Funeral × water = 1.00 because both briefs justify no imagery. The axis cannot tell "both chose none for different reasons" from "both look alike". Dentistry × perfume = 0.67 is a real habit: when there is no photography, the agent draws one inline SVG and leaves it unmasked and unfiltered.
3. **Typography rhythm repeats between the two calm text sites.** Funeral × dentistry and funeral × water share font-size steps, line-height and case patterns, and heading-to-body ratios (scale 0.54–0.60, rhythm 0.48–0.50, hierarchy 0.50–0.66) under entirely different families. The skill varies the family more than the proportions.
4. **The collision engine repeats itself across categories.** Two of five draws gave the same archetype and two gave the same collision source, and 4 of 5 share `layout=sequence`. The seeds are fixed per brief, so this is the engine's spread, not chance in this run. Its "Diversity (measured)" footer only checks within one call (`--n`), never across briefs.
5. **The memory checks have two blind spots and one over-reach.** Collisions are not compared, so the measuring tape repeated. The palette family logs as `?` unless `--palette-family` is passed, so palette divergence was never compared. The tier check flags any tier in the last three runs, so with five tiers it forces rotation regardless of the brief; I kept tier 3 for the perfume against the flag.
6. **Gate S counts a build against itself.** The skill logs to memory before the gate runs, so every stamp says `archetype-reused`.
7. **Three category labels for five briefs.** `collide.mjs` knows 12 categories. The funeral home, the children's clinic and the water authority all map to `organisation`, so category-level divergence cannot separate them.
8. **Gate failures left in place.**
   - The funeral home's sticky call bar fails rm-flow. I judge the rule over-broad: it is a non-animated 24-hour phone bar the brief requires. But the gate measured it, so it stays a FAIL.
   - The dentistry "Home" pill contrast, measured at 2.36:1 against a grey that is not in the palette. Its cause (likely edge sampling) is unverified.
   - The metal site fails forced colours on 4 texts. Cause not investigated.
   - Self-links ("Home" on /, a logo on /) count as taps that change nothing.

**Bias (opinion, self).** This run is not blind. One agent, in one session, wrote `originality.mjs`, chose the five briefs, built all five sites knowing they would be compared, and wrote this report. That pushes toward diversity on the axes the agent knew were measured, so these numbers are likely more flattering than a fresh agent's would be. The permanent arm exists to remove this: `node evals/diversity.mjs generate --out <dir>` has a fresh agent build each brief separately with the skill installed. It was not run here.

## After the fixes (v2.11, fix list 2)

The tables above are the run as first reported. These changes were made afterwards, one commit each; `matrix.md` / `matrix.json` are always the latest measurement.

- **Interaction axis (Fix 4): Option B, redefined.** It now measures press/tap feedback (`:hover`, `:active`, `:focus-visible` rules that apply on the page, as state × property groups), form patterns (field types, validation, live regions, fieldsets, submit) and navigation patterns (nav landmarks, in-page vs page links, menu toggle, skip link, breadcrumb, sticky header, tel/mailto, disclosures, dialogs). A part neither page has is not applicable and leaves the mean; before, shared absence (`pointer` = 1 in all 10 pairs) counted as a match. Re-run on the five builds: 10 distinct interaction scores (0.12–0.56); pairs at or above 0.4 went from 5 to 3 (funeral × metal 0.41, funeral × perfume 0.54, metal × perfume 0.56, all from `navigation` 0.6–0.75). `forms` is n/a in every pair: none of the five home pages has a form.
- **Image axis (Fix 5): not applicable when neither page has imagery.** Before, two image-less pages scored `none` = 1.00. Now the axis is `n/a` for that pair and leaves the overall mean; imagery on one side only still scores 0. Re-run: funeral × water (0 images each) went from image 1.00 to n/a, overall 0.38 → 0.25; dentistry × perfume stays 0.67 (both crop and effects match on their one image each), the only image repeat left.

## Not verified

- **The arm with a fresh agent:** `generate` was not run (no model calls, no benchmark in this session). Its code path (prompt, transcript, cost.json via cost.mjs, compare) is untested end to end.
- **Template package excused:** each build excuses README, SCHEMA, DATA, CRITIQUE, GATE, LICENSE, CHANGELOG, .env.example, middleware.ts, data/schema.json in its Scope with the reason "the diversity arm compares rendered sites". The water site keeps `data/` (demo-labelled).
- **No backends:** `/api/book`, `/api/notify`, `/api/request`, `/api/report` do not exist. Form states were measured by the gate's request interception, not against a server; sec-11/15 (server validation, rate limits) cannot be checked on static builds.
- **Copy and assets:** phone numbers, prices, dates, credentials, track titles and Bangla text are marked `[NEEDS COPY]`; photographs are `[NEEDS ASSET]`.
- **Stamps:** the `critique: <paste> · gate: <paste>` fields in each page's stamp comment were not filled in.
- **Smoothness:** "sandbox" in the stamps means the p95 frame interval was not measured on this 2-CPU machine.
- **References:** no live web search; DESIGN.md says so under `## References`.
- **Below 1440×900:** the matrix measures only 1440×900; mobile similarity was looked at by eye (screenshots, not committed), not measured.
