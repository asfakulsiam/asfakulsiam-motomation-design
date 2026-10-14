# Evals

Proof that the skill does what it claims. Run them before a release.

## Benchmark v5 (in progress)

Five sites, one per motion tier. Sequential. Different agents
can complete different sites across sessions.

See `results/benchmark-v5/STATE.md` for progress.
See `results/benchmark-v5/HOW-TO-RUN.md` for the process.

v5 tests tier judgment: does the skill build at the tier the
brief names? A Tier 5 brief that produces a Tier 2 page fails
the tier check, not the gate.

Briefs: `briefs/v5/` (Tier 1 link-in-bio photographer, Tier 2 editorial magazine issue, Tier 3 product tour, Tier 4 design studio site with WebGL, Tier 5 narrative film pitch). One site per session: `run-agent-benchmark.mjs --tier <n> --one <brief>`.

## Earlier benchmarks (v3, v4: kept for comparison)

v3 and v4 tested five site categories (studio, hotel, ecommerce, saas, public) at whatever tier the skill chose; it chose Tier 2 for all of them. They are not re-run and stay as history: [v3](results/2026-10-12-benchmark-v3.md) · [v3 Codex](results/2026-10-12-benchmark-v3-codex.md) · [v3 motion](results/2026-10-12-benchmark-v3-motion.md) · [v3 competitors](results/2026-10-12-benchmark-v3-competitors.md) · [v4](results/2026-10-12-benchmark-v4.md) · [v4 motion](results/2026-10-12-benchmark-v4-motion/).

## How to run
1. Pick an agent (Claude Code, Codex, Cursor…) and a model. Note both.
2. For each brief in `briefs/`, run it **twice**: once **without** the skill (baseline), once **with** it (`/build <brief>`).
3. Take screenshots at 1440px and 390px, plus a short screen recording of scrolling.
4. Score both outputs with `rubric.md`, ideally with a judge (a person or a separate model) who doesn't know which output used the skill.
5. Record the results in `results/<date>-<agent>-<model>.md`.

## Automated runner (`run-agent-benchmark.mjs`)
`generate → measure → judge → score`, inside Claude Code (`claude -p`), blind cross-family judges, hard gates from measurements. Options added in v2.2.0:
- `--arms baseline,gated,skill`: the **gated** arm gets the baseline prompt plus `scripts/gate.mjs` (the tool only, none of the skill's docs) and is told to fix what it reports. Comparing gated with skill separates the value of the knowledge from the value of the measured gate. The default stays `baseline,skill`, so v2 is reproducible.
- `--pairs baseline:skill,gated:skill,baseline:gated`: which pairs `judge` and `score` compare. `baseline:skill` keeps v2's file names and summary shape.
- `--only portfolio,launch,festival --tier 4` (or `5`): the motion-heavy briefs 01, 06 and 08 at a forced tier. Every arm is told the same tier.

### Cache

`generate` keeps a content-addressed cache of finished runs (`evals/bench-cache.mjs`, default folder `evals/.cache/runs/`, gitignored). The key is sha256 over five things only: the brief as sent, the seed, the arm (the matched arm includes its turn budget), the hash of the skill tree under test, and the pinned model. A rerun with all five unchanged copies the stored run instead of calling the agent; changing any one of them misses. The cache is off when the model is not pinned (`--model`), because an adapter's default model can change underneath the key; `--cache-unpinned` keys on the adapter and its version instead. `--no-cache` turns it off, `--cache-dir` moves it. `run.json` records `cache: { hit, key }` and `meta.json` the hit and miss counts. Tested with a mock agent in `tests/evals/bench-cache.test.mjs`.

## Rerun one brief with your own key
The adapters in `adapters/` connect the runner to a model. `pplx-llm.py` and the two `*-bridge.py` files are what the published runs used; they need Perplexity's internal SDK and do not run elsewhere. These three are public and use only the Python standard library:

| Adapter | Key (environment only, never in a file) | Model names |
|---|---|---|
| `adapters/anthropic.py` | `ANTHROPIC_API_KEY` | Anthropic API ids |
| `adapters/openai.py` | `OPENAI_API_KEY` (`OPENAI_BASE_URL` for a compatible server) | OpenAI API ids |
| `adapters/openrouter.py` | `OPENROUTER_API_KEY` | OpenRouter slugs (`vendor/model`) |

All three follow the same contract as `pplx-llm.py`. Agent mode takes a JSON request on stdin (`--model-cmd`). Judge mode takes `<model> <prompt-file> <images-file>` as arguments (`--judge-cmd`). The reply goes to stdout and one JSON usage line goes to stderr. A missing key exits 2 with `{"error": "…_API_KEY is not set"}`. The model names below are examples; use any id your account can call.

Setup (Node 20+, Python 3.8+). `measure` and the raw-API agent's `look` tool need Playwright, installed from the repo root:
```bash
git clone https://github.com/asfakulsiam/asfakulsiam-motomation-design.git && cd asfakulsiam-motomation-design
npm i --no-save playwright axe-core && npx playwright install chromium
```

**No key: replay the published judgments.** `--replay` makes no network call. In judge mode it prints the judgment recorded next to the prompt file (`<base>.json`, field `raw`), so `judge` and `score` recompute v3's verdicts from the committed files:
```bash
cp -r evals/results/2026-10-12-benchmark-v3 /tmp/v3-replay
node evals/run-agent-benchmark.mjs judge --out /tmp/v3-replay --only studio --n 3 --force \
  --judge-cmd "python3 evals/adapters/anthropic.py --replay {model} {prompt} {images}"
node evals/run-agent-benchmark.mjs score --out /tmp/v3-replay --only studio --n 3
# /tmp/v3-replay/summary.json → briefs.studio has the same wins/losses/ties and scores as the committed summary.json
```
In agent mode, a live run with `MOTOMATION_RECORD=calls.jsonl` appends every answer, keyed by a hash of the request. `--replay` with the same variable then answers those requests from the file.

**Anthropic key: one brief end to end** (studio, one seed, baseline vs skill):
```bash
export ANTHROPIC_API_KEY=…            # your key; do not commit it
OUT=/tmp/mm-studio
node evals/run-agent-benchmark.mjs generate --out $OUT --only studio --n 1 --agent raw-api \
  --model claude-sonnet-4-5 --model-cmd "python3 evals/adapters/anthropic.py"
node evals/run-agent-benchmark.mjs measure  --out $OUT --only studio --n 1
node evals/run-agent-benchmark.mjs judge    --out $OUT --only studio --n 1 --models claude-opus-4-1 \
  --judge-cmd "python3 evals/adapters/anthropic.py {model} {prompt} {images}"
node evals/run-agent-benchmark.mjs score    --out $OUT --only studio --n 1 --models claude-opus-4-1
```
To run inside Claude Code instead of the raw-API loop (the agent the published runs used), install the `claude` CLI and drop `--agent raw-api --model … --model-cmd …`. Claude Code reads `ANTHROPIC_API_KEY` itself.

**OpenAI key:** the same four commands with `--model gpt-5 --model-cmd "python3 evals/adapters/openai.py"` and `--models gpt-5 --judge-cmd "python3 evals/adapters/openai.py {model} {prompt} {images}"`. **OpenRouter:** use `openrouter.py` with slugs, for example a Claude generator judged by `--models openai/gpt-5,google/gemini-2.5-pro`.

Results land in `$OUT/studio/` (`baseline-s7101/`, `skill-s7101/`, `judge/`) and `$OUT/summary.json`. The published runs judged with models from a family other than the generator's. With one key you get a single-family judge, so say so when you report it.

## Where the screenshots are
### Screenshots live on evals branch

Since v2.2.0, benchmark screenshots have lived on the [`evals` branch](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/evals/evals/results), and since 2026-10-13 every heavy artifact does: screenshots (`shot-*.webp`, `*.png`, `*.jpg`), built pages (`index.html`), `motion-report.html`, transcripts (`transcript.jsonl`, `transcript.jsonl.gz`), the docs screenshots under `docs/`, and the Tier 5 frame sequences (`evals/frames/`, restored by `node scripts/fetch-frames.mjs`). The full list is [`evals/MOVED-FROM-MAIN.txt`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/evals/MOVED-FROM-MAIN.txt) on that branch. Installing the skill doesn't download any of it.

Main keeps every report, `summary.json`, `run.json`, `meta.json`, `checks.json`, judge file and prompt. Report links to moved files point at the `evals` branch. To re-judge or re-measure an old run, check out its artifacts first: `git checkout origin/evals -- evals/results/<run>` (then `git restore --staged evals/results/<run>` so they are not committed back; `.gitignore` also blocks them).

## Agents tested so far
| Agent | Benchmarked | Notes |
|---|---|---|
| Claude Code 2.1.286 | yes: v1, v2 (`results/2026-10-11-benchmark*.md`) | the only agent with published runs |
| Codex CLI 0.130.0 | yes: v3, n=5 (5 briefs × 1 seed, baseline vs skill, `gpt_5_4`; [`results/2026-10-12-benchmark-v3-codex.md`](results/2026-10-12-benchmark-v3-codex.md)) | skill won 3 of 5 pairs, but mean gated scores are level: baseline 77.0 vs skill 76.2; a portability check, not a replication (not authenticated in the v2.2.0 run) |
| Cursor (`cursor-agent`), Gemini CLI, Aider | no | not installed in that environment |

Inventory: `which claude cursor-agent codex gemini aider`, then a one-line prompt to each. Until a second agent has a published run, the "works in 60+ agents" claim means "installs in", not "benchmarked in".

## Release gate
A release ships only if, compared with the baseline:
- the average total score is higher on **every** brief,
- **Variety** passes: running the same brief 3 times produces 3 different archetypes and signatures,
- no brief fails a **hard gate** (reduced motion, keyboard access, contrast, no placeholders).

## Variety test
Automated part: `node evals/variety.mjs` prints collision draws for 5 seeds and the fingerprint similarity matrix of published builds. Latest: [`results/2026-10-11-variety.md`](results/2026-10-11-variety.md).

Run `briefs/03-ceramics-shop.md` three times in the same project, without clearing `.motomation/log.json`. The archetype, signature and nav must differ each time.
