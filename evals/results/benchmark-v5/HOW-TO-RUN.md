# Benchmark v5 — How to run one site

Instructions for a single agent completing a single site. Read all of it before you start.

## What this benchmark is

Five sites, one per motion tier. Sequential. Each site is built by one agent in one session, or deleted and retried by
the next.

| # | Brief file (`<brief>`) | Tier | Site |
|---|---|---|---|
| 1 | `tier-1-linkinbio` | 1 — Basic | link-in-bio photographer |
| 2 | `tier-2-editorial` | 2 — Intermediate | editorial magazine issue |
| 3 | `tier-3-product-tour` | 3 — Pro | product tour |
| 4 | `tier-4-studio-webgl` | 4 — Max | design studio site (WebGL) |
| 5 | `tier-5-film-pitch` | 5 — Motomation | narrative film pitch |

v3 and v4 tested site categories at whatever tier the skill chose (Tier 2 every time). v5 tests tier judgment: the
skill is told the tier, and the benchmark checks whether it builds to that tier honestly.

## Before you start

- Read `evals/results/benchmark-v5/STATE.md`.
- Your brief is the first row marked ⬜.
- Read the brief in `evals/briefs/v5/`.

## What you build

Two versions of the same site:

- baseline: a plain agent, no skill, standard prompt
- skill:    the same brief, with the Motomation skill loaded

One seed each. Same model for both. Same conditions.

Both arms are told the tier in the prompt, stated, not inferred. The runner does this for you:

```bash
OUT=evals/results/benchmark-v5/<brief>/work      # working folder (not committed; see "What you save")
node evals/run-agent-benchmark.mjs generate --tier <n> --one <brief> --out "$OUT" --dry-run   # check the plan first
node evals/run-agent-benchmark.mjs generate --tier <n> --one <brief> --out "$OUT" --model <model id>
node evals/run-agent-benchmark.mjs measure  --tier <n> --one <brief> --out "$OUT"
```

`--dry-run` lists the runs and writes nothing; it must show exactly two runs (`baseline` and `skill`) for your brief
and nothing else. `--one` never touches another brief's folders. Pin the model with `--model` and use the same one for
both arms.

The briefs name no stack. The skill's Step 0 asks for one; in a benchmark run nobody can answer, so both arms are told
the client's answer is "you choose" and must say which stack they used and why. Record that line in `summary.md`.

## What you measure

- Run `gate.mjs` on both builds.
- Compare the gate stamp: contrast, overflow, motion, accessibility, SEO, performance, security.
- Tier check: did the skill actually build at the tier the brief named? A Tier 5 brief that produced a Tier 2 page
  fails the tier check.

Run the gate from the tested skill folder on each arm's output. It takes a single `.html` file, a project folder (its
`index.html`, else its build output in `out/`, `dist/`, `build/` …) or the URL of a running dev or preview server:

```bash
node skills/asfakulsiam-motomation-design/scripts/gate.mjs "$OUT/<brief>/baseline-s<seed>/" > baseline-gate.txt
node skills/asfakulsiam-motomation-design/scripts/gate.mjs "$OUT/<brief>/skill-s<seed>/"    > skill-gate.txt
```

The tier check is judged from the build, not from the plan: what actually moves, and with what. Write it into
`judge.json` and `summary.md` as pass or fail with the evidence (for example "Tier 5 named; one pinned canvas scrubbing
frames with a timecode rail: pass", or "Tier 4 named; no WebGL canvas, CSS reveals only: fail"). A tier fail is a
benchmark result, not a gate failure: the gate measures quality, the tier check measures judgment.

## What you save

On main:
  evals/results/benchmark-v5/<brief>/baseline/gate.txt
  evals/results/benchmark-v5/<brief>/skill/gate.txt
  evals/results/benchmark-v5/<brief>/DESIGN.md
  evals/results/benchmark-v5/<brief>/MOTION.md
  evals/results/benchmark-v5/<brief>/judge.json
  evals/results/benchmark-v5/<brief>/summary.md

On the evals branch:
  screenshots, built site files, transcripts

`DESIGN.md` and `MOTION.md` are the skill arm's own records. `summary.md` holds the model, the seed, the stack each arm
chose, both gate verdicts side by side, the tier check and anything that did not run. The working folder (`work/`) is
never committed to main.

## What you commit

- The six files above.
- Update `STATE.md` — mark the brief ✅ done.
- Push.

In `STATE.md`, set Status to `✅ done`, Agent to your agent and model, Committed to the date and short commit hash,
and update "Last update".

## If your session runs out of budget

- Delete the working folder for the brief you were building.
- Do not touch STATE.md.
- Do not commit anything.
- Push nothing.
- Stop.

The next agent starts that brief fresh. Partial evidence is worse than no evidence, because it forces the next agent to
reason about a stranger's half-build.

## Decisions

Stack: during a benchmark run, both arms are told the client answered 'you choose.' Each arm must state the stack it chose and why. This keeps the comparison fair. Imagery: placeholders. Not judged in v5.

## What you do NOT do

- Do not run other briefs.
- Do not run the full benchmark.
- Do not re-run v3 or v4.
- Do not write an fps number that did not come from tier5-fps.yml.
