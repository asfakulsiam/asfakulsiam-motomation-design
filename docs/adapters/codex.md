# Motomation Design in Codex CLI

Codex reads the skill from `.agents/skills/asfakulsiam-motomation-design/` (or the `.codex-plugin` manifest) and follows `AGENTS.md`. The design rules work the same as in Claude Code. The one thing that behaves differently is the Delivery Gate, because `scripts/gate.mjs` drives a real headless Chromium and Codex runs commands inside a sandbox.

## What went wrong in benchmark v3

In the v3 Codex arm ([report](../../evals/results/2026-10-12-benchmark-v3-codex.md)), only 2 of 5 skill runs got a verified gate result. The transcripts show three failure modes, all from the sandbox, none from the pages:

| Failure | What the agent saw | Why |
|---|---|---|
| Chromium died mid-scan | `not verified — the browser failed during the scan (Error); run again` | three Codex builds and other measurements shared two CPUs; the renderer crashed or was killed |
| Budget too short | `not verified — timed out after 45s` / `120s` / `15s` / `10s` | the agent passed `--timeout 45` etc.; a full scan (4 widths, every scroll position) takes 2–5 minutes on 2 CPUs |
| Killed from outside | `EXIT:124`, `EXIT:143`, no output at all | the agent wrapped the gate in `timeout 60s`; the gate was killed before it could say anything |

The skill reported "not verified" honestly, but its main advantage (a measured pass before handoff) silently went missing, and two pages shipped with failures CI found later (64 contrast failures, 33 overflowing elements).

## What the gate does now (v2.5.0)

1. **Probes the machine first** and prints what it found to stderr: CPUs, load, free memory, cgroup memory limit, `/dev/shm`, an address-space cap (`ulimit -v`), and the sandbox (`MOTOMATION_SANDBOX`, `CODEX_SANDBOX`, `CODEX_SANDBOX_NETWORK_DISABLED`). The benchmark runner sets `MOTOMATION_SANDBOX=codex` for Codex runs.
2. **Retries once in a light footprint** when Chromium fails to start, crashes, or an operation times out: one renderer process (`--renderer-process-limit=1 --no-zygote`), `--disable-gpu`, `--disable-dev-shm-usage`, a capped JS heap, and every operation timeout ×3. The checks are identical; only the browser is lighter and more patient. (`--single-process` was tried and rejected: on Chromium 147 it kills the browser when Playwright opens its second context.)
3. **If the retry fails too**, prints one line and exits 3:
   ```
   not verified — sandbox too constrained: 2 CPUs, address space capped at 1465 MB (ulimit -v) (attempt 1, standard footprint: browser did not start (…); attempt 2, light footprint (one renderer, no GPU, no /dev/shm, timeouts ×3): browser did not start (…); machine: 2 CPU, load 0.7, 7587 MB free, /dev/shm 3979 MB, address space 1465 MB)
   ```
4. **Never exits silently.** A `SIGTERM`/`SIGINT`/`SIGHUP` from an outer `timeout` prints `not verified — interrupted (SIGTERM after 45s; machine: …)`. An unhandled error prints `not verified — the browser failed during the scan (<first line of the real error>)`, not just `(Error)`. With `--out`, a not-verified run still writes a JSON file (`{ "verified": false, "reason": … }`).
5. **Warns about short budgets.** On a constrained machine, a `--timeout` under 240 s prints a warning that a timeout there says nothing about the page.

Reproduction (old v2.4.0 gate vs this one, on the v3 Codex studio page; outputs in the v2.5.0 run log):

| Scenario | v2.4.0 gate | v2.5.0 gate |
|---|---|---|
| Renderer killed 25 s into the scan | `not verified — the browser failed during the scan (Error)`, exit 3 | standard footprint crashed (`Target crashed`), retried light, **PASS** with stamp, exit 0 |
| `timeout 45s node gate.mjs …` | misleading `browser failed (Error)` line, exit 124 | `not verified — interrupted (SIGTERM after 45s; machine: …)`, exit 124 |
| `ulimit -v 1500000` (Chromium can't start) | `not verified — no browser (…)`, which suggests installing Playwright | `not verified — sandbox too constrained: … address space capped at 1465 MB …`, both attempts listed, exit 3 |

## How to run the gate in Codex

- **Give it time.** Run `node .agents/skills/asfakulsiam-motomation-design/scripts/gate.mjs index.html` with the default budget (600 s). Don't pass `--timeout 45`. If you wrap it in `timeout`, make the outer timeout longer than the gate's (`timeout 660s … --timeout 600`).
- **One gate at a time.** Don't start a second gate while one is running, and don't run several Codex builds that each run the gate on a 2-CPU machine (`--parallel 1` in `evals/run-agent-benchmark.mjs --agent codex` on small runners).
- **Start light on a known-small machine.** `--light` skips the standard attempt.
- **Serve over HTTP if `file://` is blocked.** `python3 -m http.server 4173` and gate `http://127.0.0.1:4173/index.html`.
- **Report what it says.** If the last line is `not verified — sandbox too constrained: …`, paste it verbatim into the handoff (`Measured: not verified — sandbox too constrained: …`), leave the `gate:` segment out of the stamp, and say the page needs a gate run on a machine that can run Chromium. Don't write a pass you didn't measure.

## Other adapters

The same probe and retry apply wherever the gate runs: Claude Code, Cursor and Gemini CLI on small machines, GitHub Actions runners (2 CPUs, 7 GB), and Docker containers with a small `/dev/shm` (the gate adds `--disable-dev-shm-usage` automatically when `/dev/shm` is under 128 MB). `AGENTS.md` and `gates/delivery-gate.md` point here.
