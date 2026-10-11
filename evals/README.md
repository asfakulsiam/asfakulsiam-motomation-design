# Evals

Proof that the skill does what it claims. Run them before a release.

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

## Agents tested so far
| Agent | Benchmarked | Notes |
|---|---|---|
| Claude Code 2.1.286 | yes: v1, v2 (`results/2026-10-11-benchmark*.md`) | the only agent with published runs |
| Codex CLI 0.130.0 | no | installed in the v2.2.0 run's environment but not authenticated (HTTP 401) |
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
