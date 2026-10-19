# Development checks and handoff validation (v3.0.2)

Two kinds of checking, never confused. **Development checks** are fast and partial: they guide the build. **Handoff validation** is the full gate on the approved files: it decides what the handoff may claim. The handoff status is computed by `scripts/handoff.mjs` from what actually ran. It is pasted, never typed.

Why this exists: in the v3.0.1 benchmark, three of the four builders never ran the journey check (axis J), because the full gate was too heavy for their machines. Two of them said so. The third wrote "All 3 core journeys connect without broken paths" in `GATE.md`, with J never run. Nothing in the toolchain could tell the two kinds of note apart. Now it can: `handoff.mjs --report GATE.md` rejects the second one (`fixtures/handoff/b2b-overclaim-GATE.md`, `tests/gate/handoff.test.mjs`).

## The two tiers

| Tier | Commands | When | What it may claim |
|---|---|---|---|
| **Development checks** | `node scripts/completeness.mjs <site>` (X, seconds) · `node scripts/gate.mjs --rules <page>` (C S P K, seconds) · `node scripts/gate.mjs --journey <site>` (J only, a few minutes) · `node scripts/gate.mjs <one page>` while fixing it | any time during the build, as often as useful | nothing beyond its own line. A `--journey` pass is not a handoff; a `--rules` pass says nothing about journeys |
| **Handoff validation** | `node scripts/gate.mjs <site>` (every axis, J included, on the approved files), then `node scripts/handoff.mjs <site> --report GATE.md` | once, at Checkpoint 6, after the author approved the design, and again after any later edit | exactly the status `handoff.mjs` printed |

Run J as a development check early, as soon as two routes and one form exist (`--journey`, a few minutes). Most J failures (an overflowing header, a form that claims to send) are cheaper to fix then than at the end.

## The record and the status

Every gate run writes `<project>/.motomation/gate-record.json`: the mode (`full`, `journey`, `rules`, or `not-verified` when the run could not finish), the date, the machine, each target's result, the journey summary, and a hash of the site's files (stamps pasted into pages, `GATE.md`, `CRITIQUE.md` and other notes do not count as changes). A URL target has no files to hash: pass `--record <project folder>`. `--no-record` writes nothing (fixtures, experiments).

`node scripts/handoff.mjs <project>` reads the record and prints one line, then the reasons:

| Status | When | Exit |
|---|---|---|
| `VALIDATED` | a full gate run passed on the current files; J ran, passed, and left nothing unverified | 0 |
| `CONDITIONAL` | the full run passed, but J listed something it could not verify: a form behind a state a fresh browser lacks (an empty cart, a signed-out account), a form that rejected the filled values, a submit kept disabled while empty, a Scope route no link reaches, a route beyond the page cap | 3 |
| `NOT VALIDATED` | no full run; only development checks ran; the full run was on older files; the run failed; the run ended "not verified" (no browser, a constrained machine, a timeout); J was not measured | 1 |
| `REFERENCE` | a design reference gated with `--reference`: J does not apply | 0 |

A build with an unverified critical journey never gets `VALIDATED`. Walking an exception by hand is useful and goes in `GATE.md` under **Judged** (`self (opinion): walked the checkout by hand at 375px, …`), but the status stays `CONDITIONAL`: a hand walk is a judgement, not a measurement.

**Prototype boundaries** are listed separately, not as exceptions: forms that save only in the browser, simulations that say so, features marked unavailable (`thinking/product-contract.md` → Forms and operations). They do not block `VALIDATED`, and the handoff names them, so nobody mistakes a labelled demo for a working flow.

## The handoff note

`GATE.md` and the handoff note (`gates/delivery-gate.md` → Handoff note) start with the `handoff:` line `handoff.mjs` printed, pasted. Then:

- `node scripts/handoff.mjs <site> --report GATE.md` checks the note against the record. It rejects a note with no `handoff:` line, a status other than the computed one, a line pasted before the last change (a different hash), and, unless the status is `VALIDATED`, any unqualified claim such as "fully validated", "all journeys connect", "production-ready" or "no known issues". A `CONDITIONAL` note must list every exception. Exit 2 means the note contradicts the record. Fix the note (or the site), not the checker.
- A note may never say a check passed when it did not run. "Rule-only results; the journey check did not run (CPU limit)" is honest and accepted. "Product integrity: all 3 core journeys connect" with J never run is rejected.

## When the full gate cannot run

On a constrained machine (2 CPUs, a short tool timeout) the full gate may not finish. Then:

1. Run the development checks that do finish: `completeness.mjs`, `gate.mjs --rules`, and `gate.mjs --journey` (J alone takes minutes, not the full gate's 2–5 minutes per page per width). Fix what they find.
2. Try the full gate once with the default budget and a tool timeout above it. `gate.mjs` already retries a failed scan in the light footprint (`--light`).
3. If it still cannot finish, the run ends `not verified — <reason>`, and the record says so. `handoff.mjs` prints `NOT VALIDATED` with that reason. Paste it. The handoff says the build was not validated, and why, and lists the development checks that did run under **Measured** with their own names (`gate.mjs --journey: journey: nav0 …`). Never as the full gate.
4. Validation is then a separate step on a machine that can run it (CI, a larger sandbox): `gate.mjs <site>` there, then `handoff.mjs`. That is the honest path, not a weaker gate.
