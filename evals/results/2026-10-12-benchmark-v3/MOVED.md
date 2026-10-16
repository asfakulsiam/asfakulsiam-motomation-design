# Moved to the evals branch

The runner output of the v3 benchmark (summary.json, checks.json per build, judge prompts and verdicts: 1036 files, 3.06 MB) moved off main on 2026-10-16. Main had reached its 15 MB budget, and this was the largest results folder on it. No script on main reads it; the report that cites it is [`../2026-10-12-benchmark-v3.md`](../2026-10-12-benchmark-v3.md).

The files are at [evals/results/2026-10-12-benchmark-v3 on the evals branch](https://github.com/asfakulsiam/asfakulsiam-motomation-design/tree/evals/evals/results/2026-10-12-benchmark-v3), byte for byte as they were on main (`evals/MOVED-FROM-MAIN.txt` there lists every path). To restore them locally:

    git fetch origin evals && git checkout origin/evals -- evals/results/2026-10-12-benchmark-v3
