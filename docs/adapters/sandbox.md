# Measuring Tier 5 frame rates: what the agent sandbox can't do

Tier 5 (scroll-driven film) promises 60fps on desktop and at least 55fps on a mid-range phone. That promise can only be checked by measuring frame times while the page scrolls. **A 2-CPU agent sandbox cannot measure that honestly**, so no fps figure in this repository comes from one. The measurement runs on GitHub's runners in [`.github/workflows/tier5-fps.yml`](../../.github/workflows/tier5-fps.yml). Until a run of that workflow has produced a number, any page's fps is **pending**, not passed.

## The constraint

The sandbox this skill is developed and benchmarked in reports `nproc` = 2 (Intel Xeon @ 2.90GHz, 7.9 GB). Five things make frame times measured there meaningless as fps:

| # | Problem | Effect on the number |
|---|---|---|
| 1 | **Two CPUs shared by everything**: the browser process, the renderer, the GPU process, Playwright, Node, and whatever else the agent runs (`gate.mjs` scans, builds) | frame time measures contention on the host, not the page's cost |
| 2 | **No GPU.** Chromium rasterises and composites in software (SwiftShader), so canvas, WebGL, video and large layers are drawn by the same two CPUs | Tier 5's heaviest work, the canvas or frame sequence, is measured on the wrong hardware |
| 3 | **Headless frame pacing.** `requestAnimationFrame` intervals come in multiples of 16.7 ms, so a p95 reads 16.7, 33.4 or 50.1, never 22 | the result says whether a frame was missed, not the real frame rate |
| 4 | **CPU throttling ×4 multiplies the contention** in (1): Chromium slows the renderer's main thread four times over, on a host that is already shared | the mobile number mostly measures the sandbox |
| 5 | **Run-to-run noise** from neighbouring jobs on the same host | two runs of the same page disagree |

### Measured here, to show it (not a result)

The probe from `tier5-fps.yml` was run twice in a row on `examples/html/motomation-film.html` in this sandbox (Chromium 147.0.7727.15, load average under 0.6):

| Run | desktop 1440 p50 / p95 / max (ms) | mobile 375, CPU ×4: p50 / p95 / max (ms) | mobile frames over 33 ms |
|---|---|---|---|
| 1 | 16.7 / 16.8 / 33.3 | 16.7 / 33.4 / 50.1 | 23 |
| 2 | 16.7 / 16.7 / 16.8 | 16.7 / 33.4 / 50.0 | 30 |

The same page and the same commit, run back to back, gave different counts of slow frames, and every p95 lands on a multiple of the 16.7 ms pacing. The desktop numbers look perfect only because headless pacing hides the cost (problems 2 and 3). Neither run supports a claim of "60fps" or "55fps on mobile", in either direction.

## What the workflow does instead

[`tier5-fps.yml`](../../.github/workflows/tier5-fps.yml) runs on `ubuntu-latest`. You trigger it from the Actions tab (input: the pages), or by pushing to the `tier5-fps` branch. For each page, three passes:

1. Serve the page's folder over HTTP, so frame sets, video and fonts load as they would in production.
2. **Desktop:** 1440×900, no throttling. **Mobile:** 375×812, touch, device scale 2, CPU ×4 (`Emulation.setCPUThrottlingRate`).
3. Record every `requestAnimationFrame` interval while scrolling top → bottom at a steady pace (6–20 s, depending on page height).
4. Report p50, p95 and max frame time, plus the number of frames over 33 ms. Budgets: **desktop p95 ≤ 20 ms, mobile p95 ≤ 25 ms**, taken from the worst of the three passes.
5. Write a table to the job summary, upload the raw JSON (`tier5-fps` artifact), and fail the job if a page misses its budget (input `enforce`, default on).

The runner is a clean machine with nothing else running. The job prints its CPU count, CPU model and memory next to the numbers. It still has no GPU, so its numbers are a **consistent, reproducible proxy**, not a phone measurement: they catch main-thread regressions, such as layout thrash, a heavy scroll handler, or decoding on the main thread. A device check (Chrome DevTools Performance panel on a real mid-range Android, 6× slowdown off) remains the final word before claiming a figure on a client project.

## Rules that follow

- Agents and templates **must not write an fps number** that did not come from this workflow, or from a named real device.
- In the sandbox, `gate.mjs` frame-time checks report as **"not verified — sandbox"** rather than pass or fail on fps (see the gate's smoothness axis).
- A Tier 5 template is "fps pending" until a `tier5-fps.yml` run on its commit has passed. Its README links that run.
