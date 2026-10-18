# v3.0.1 independent benchmark runs (2026-10-18)

Builds by agents that did not write the skill, following a frozen copy of it. This folder holds the text evidence.
The full sites and screenshots are on the orphan branch [`benchmarks/v3.0.1-runs`](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs), kept off the main line for the size budget. Evaluator outputs (`*.txt`) were produced afterwards by the
updated scripts, not by the builders.

| Run | Brief | Builder model | Skill version | Status |
|---|---|---|---|---|
| [03-b2b](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/03-b2b) ([screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/03-b2b/screens)) | `evals/briefs/v6/03-b2b.md` | gemini_3_8_flash | 226085d (v3.0.0) | built; evaluated |
| [08-travel-booking](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/08-travel-booking) ([screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/08-travel-booking/screens)) | `evals/briefs/v6/08-travel-booking.md` | gpt_6_1_sol | 226085d (v3.0.0) | built; evaluated |
| 12-paired: [a-archival](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/a-archival) ([screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/a-archival/screens)), [b-poster](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/b-poster) ([screens](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/benchmarks/v3.0.1-runs/runs/12-paired/b-poster/screens)) | `evals/briefs/v6/12a`, `12b` | gpt_6_1_sol | v3.0.1 working tree | built; evaluation running |

Builders were told not to run the full gate or `--journey` (2 shared CPUs); the evaluator ran them afterwards. That
condition is why journey defects reached handoff: the skill's own workflow runs `--journey` before handoff.

## 03-b2b, evaluator findings

- completeness X ✓ (17/17 routes, 3/3 journeys), content realism ✓ (`completeness.txt`).
- journey J ✗ (`journey.txt` = v3.0.1 scripts before the overflow fix, `journey-old.txt` = v3.0.0 scripts, same result):
  - every page lays out at 481px in a 375px viewport (`div.header-cta`, and an 818px table on /pricing). Before the
    v3.0.1 overflow fix the check reported this as 58 unrelated "nothing changed after a tap" fails.
  - forms: /contact shows success without any request; /demo is a native submit (no designed loading/error states).
  - /demo/confirmed is listed in sitemap.xml but only reachable by submitting the form.
