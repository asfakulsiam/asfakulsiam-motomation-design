# Evals

Proof that the skill does what it claims. Run them before a release.

## How to run
1. Pick an agent (Claude Code, Codex, Cursor…) and a model. Note both.
2. For each brief in `briefs/`, run it **twice**: once **without** the skill (baseline), once **with** it (`/build <brief>`).
3. Take screenshots at 1440px and 390px, plus a short screen recording of scrolling.
4. Score both outputs with `rubric.md`, ideally with a judge (a person or a separate model) who doesn't know which output used the skill.
5. Record the results in `results/<date>-<agent>-<model>.md`.

## Release gate
A release ships only if, compared with the baseline:
- the average total score is higher on **every** brief,
- **Variety** passes: running the same brief 3 times produces 3 different archetypes and signatures,
- no brief fails a **hard gate** (reduced motion, keyboard access, contrast, no placeholders).

## Variety test
Run `briefs/03-ceramics-shop.md` three times in the same project, without clearing `.motomation/log.json`. The archetype, signature and nav must differ each time.
