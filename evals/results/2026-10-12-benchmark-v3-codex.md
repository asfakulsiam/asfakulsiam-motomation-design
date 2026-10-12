# Benchmark v3 (2026-10-12): second agent, Codex CLI

The same five briefs, **one seed each** (the first seed of each brief), baseline vs skill, built by a different agent and a different model family: **Codex CLI 0.130.0** (`codex exec`, full-access sandbox, skills in `.agents/skills`) driving **`gpt_5_4`** through `evals/adapters/responses-bridge.py` (OpenAI Responses API → the same model service). 10 builds. Measured on the same GitHub Actions workflow as the other arms ([run 38230262854](https://github.com/asfakulsiam/asfakulsiam-motomation-design/actions/runs/38230262854), 10 of 10 shards passed) and judged by the same two judges as the [main report](2026-10-12-benchmark-v3.md). Note: `gpt_5_4` is both the generator and one of the two judges here; see caveats.

**Commit tested: `6f2724f5299a19cd55cb94cbad886c1c6af38fd6`** (skill folder tree `adf3ab499119d70059f2a1ac0d3cbc5c061a6fef`).

## Result

| | Baseline (Codex, no skill) | Skill (Codex) |
|---|---|---|
| Pairs won (of 5) | 2 | **3** (ties 0) |
| Mean gated | 77.0 | 76.2 |
| Mean raw | 77.0 | 76.2 |
| Pages failing a hard gate | 0 of 5 | 0 of 5 |
| Tool calls, median (range) | 20 (19–27) | 29 (27–48) |
| Mean time | 6.3 min | 20.1 min |

**The skill ran end to end in Codex, but it didn't help reliably, and the reason is the gate, not the design rules.** The skill won 3 of 5 pairs (studio +28.5, public +4.0, hotel +1.5) and lost 2 (ceramics −1.5, SaaS −36.5); mean gated scores are level (77.0 vs 76.2). No page in either arm failed a measured hard gate. The transcripts show why the skill didn't separate itself: **inside the Codex sandbox the skill's own `gate.mjs` often couldn't finish.** Its headless browser crashed (`not verified — the browser failed during the scan`) or timed out at 45 s and 120 s while three Codex builds and other measurements shared two CPUs. Only 2 of 5 skill runs ever got a verified gate result (studio passed; public failed 7 times, then passed). The other three never did, and two of them shipped with failures the CI measurement later found: ceramics with 64 contrast-failing elements, and SaaS with 33 overflowing elements. The SaaS hero collapsed into a 70-pixel column under the product panel; both judges marked it near-illegible (55 and 34). The skill says "not verified" and moves on rather than blocking. That is honest, but in a constrained sandbox it means the skill's main advantage (a verified gate pass) silently goes missing. Codex also took far longer with the skill (median 29 tool calls, 20.1 min vs 20 and 6.3 min).

## Per brief

| Brief | Outcome | Seed | Baseline (no skill) gated (raw) | Skill gated (raw) | Δ gated | Judges (baseline: gpt · gemini / skill: gpt · gemini) |
|---|---|---|---|---|---|---|
| 07 Architecture studio | consistent win (1W 0L 0T) | 7101 | 64.5 (64.5) | 93.0 (93.0) | +28.5 | 76 · 53 / 86 · 100 |
| 04 Boutique hotel | consistent win (1W 0L 0T) | 4101 | 78.0 (78.0) | 79.5 (79.5) | +1.5 | 79 · 77 / 83 · 76 |
| 03 Ceramics shop (e-commerce) | consistent loss (0W 1L 0T) | 3101 | 81.5 (81.5) | 80.0 (80.0) | -1.5 | 76 · 87 / 77 · 83 |
| 02 Developer tool (SaaS) | consistent loss (0W 1L 0T) | 2101 | 81.0 (81.0) | 44.5 (44.5) | -36.5 | 76 · 86 / 55 · 34 |
| 05 Climate non-profit (public) | consistent win (1W 0L 0T) | 5101 | 80.0 (80.0) | 84.0 (84.0) | +4.0 | 73 · 87 / 91 · 77 |

## Fails

**Pages that failed a measured hard gate:**
- none

**Pairs the skill lost:**
- 03 Ceramics shop (e-commerce) s3101: skill lost to Baseline (no skill) (81.5 vs 80.0)
- 02 Developer tool (SaaS) s2101: skill lost to Baseline (no skill) (81.0 vs 44.5)

## Caveats

- One seed per brief: 5 pairs, not 15. Treat it as a portability check (does the skill run end to end in a second agent and still help), not a second full benchmark.
- `gpt_5_4` generated these pages and is one of the two judges. Self-preference can't favour one arm (both arms are its own pages), but it may compress or inflate both. The per-judge totals are in the table so the Gemini-only view can be read off.
- Codex counts tool calls, not turns, so effort numbers aren't comparable with the Claude Code arms.

## Every run

| Brief | Arm | Seed | Turns | Time | gate.mjs counts (c o w rm a n) | Measured hard gates | Prompt sha256 |
|---|---|---|---|---|---|---|---|
| 07 Architecture studio | baseline | 7101 | 19 | 308s | 12 141 5 0 0 0 | none | `5e177e5fb5c9` |
| 07 Architecture studio | skill | 7101 | 29 | 888s | 0 0 0 0 0 0 | none | `69fb556cad7c` |
| 04 Boutique hotel | baseline | 4101 | 20 | 306s | 0 3 0 0 0 0 | none | `48961f16c100` |
| 04 Boutique hotel | skill | 4101 | 48 | 1360s | 0 0 0 0 0 0 | none | `4540b52368f8` |
| 03 Ceramics shop (e-commerce) | baseline | 3101 | 22 | 352s | 8 0 0 0 0 0 | none | `2143b90adf60` |
| 03 Ceramics shop (e-commerce) | skill | 3101 | 27 | 682s | 64 0 0 0 0 0 | none | `e94efd71f13f` |
| 02 Developer tool (SaaS) | baseline | 2101 | 27 | 633s | 0 0 0 0 0 0 | none | `df9b38c7bd29` |
| 02 Developer tool (SaaS) | skill | 2101 | 29 | 532s | 0 33 0 0 0 0 | none | `6a6e0787c65a` |
| 05 Climate non-profit (public) | baseline | 5101 | 19 | 302s | 9 1 0 0 0 1 | none | `823bf876fc47` |
| 05 Climate non-profit (public) | skill | 5101 | 39 | 2573s | 0 0 0 0 0 0 | none | `05abe90ebc1c` |

## Reproduce

```bash
python3 evals/adapters/responses-bridge.py --port 8788 --model gpt_5_4 --reasoning medium &
# ~/codexhome/config.toml: model_provider "bridge" → base_url http://127.0.0.1:8788/v1, wire_api "responses"
BRIDGE_KEY=bridge node evals/run-agent-benchmark.mjs generate --out evals/results/2026-10-12-benchmark-v3-codex --n 1 --arms baseline,skill --agent codex --codex-home ~/codexhome --parallel 3
node evals/run-agent-benchmark.mjs measure --out evals/results/2026-10-12-benchmark-v3-codex --n 1 --arms baseline,skill
node evals/run-agent-benchmark.mjs judge   --out evals/results/2026-10-12-benchmark-v3-codex --n 1 --pairs baseline:skill --judge-cmd "python3 evals/adapters/pplx-llm.py {model} {prompt} {images}"
node evals/run-agent-benchmark.mjs score   --out evals/results/2026-10-12-benchmark-v3-codex --n 1 --pairs baseline:skill
```
