# Scroll Sequences

A scroll sequence is any part of a page whose state is set by the scroll position: a pinned chapter, an image-sequence film, a sticky stage with a list of steps beside it, a scrubbed timeline, a list whose current item is lit. They are the most expensive thing on a page to get right, and they fail in three quiet ways that a screenshot of the finished page never shows.

## Why this file exists

Benchmark v3, ceramics shop, seed 3103 (`evals/results/2026-10-12-benchmark-v3/ecommerce/skill-s3103/` on the evals branch). The page had a sticky kiln stage and four firing steps; the step in the middle of the screen got `.on`, and every other step was dimmed with `.js-scrub .steps li:not(.on) { opacity: .4 }`. Lit, the step labels read at 6.62:1. Dimmed, the same labels read at **2.1:1** and the body text at 3.37:1, and a visitor reads the dimmed steps for most of the scroll, because only one step is lit at a time. The page shipped with a gate pass (the gate judged each element only at its most visible state; fixed in v2.5.0) and then failed the benchmark's hard gate on axe's contrast check, scoring 0.

The lesson isn't "don't dim". It's that a sequence has more states than its active one, and every state a visitor can read is a state that has to work.

## The review rule

Before shipping any page with a scroll sequence, review every step in every state it can rest in. Three checks, each by hand, each recorded in the handoff:

### 1. Contrast in both states: active and inactive

For every step, list the states it rests in (lit and dimmed, current and past, revealed and waiting) and measure the text in each:

- **Work out the colour a dimmed step actually renders.** Opacity blends the text with what is behind it: rendered = text × opacity + background × (1 − opacity). A dimmed label is not its CSS colour; it is that blend. Measure the blend against the background with `node scripts/contrast.mjs <blend> <background>`.
- **AA applies to every readable state.** 4.5:1 for body text, 3:1 for large text (≥ 24px, or ≥ 18.66px bold). If an inactive step can be read, it must pass. If it can't pass, don't dim it with opacity: dim it with a quieter colour that still meets AA, a weight change, a rule or marker beside the active step, or hide the inactive steps fully (`opacity: 0` / `visibility: hidden`) so nothing half-legible is left on screen.
- **Check the background in that state too.** A sticky stage that changes image per step changes what is behind every step.
- **Then let the gate confirm it.** Since v2.5.0, `scripts/gate.mjs` measures every element at every sampled scroll position (plus 0/25/50/75/100% of the page and of each pinned zone) and fails any inactive state below AA, printing each step's states (`active op 1: 6.62:1 ✓ · inactive op 0.4: 2.1:1 ✗`). The manual check comes first because the gate samples positions; the review covers every state by construction.

Quick reference for dimming dark text (#1f1a17) on paper (#f4efe6): opacity .34 → 2.1:1, .4 → 2.4:1, .6 → 4.3:1 (still fails body text), .8 → 8.3:1. On a dark ground the numbers are similar: light text at opacity .4 rarely passes. **Opacity below about .7 on body text almost never meets AA.**

### 2. The fallback is a designed still, not a poster

Under `prefers-reduced-motion: reduce` (and when the capability probe says no), the sequence must become a composition of its own, not the first frame:

- Unpin. Each step in normal flow as a plate, fully visible, with no dimmed inactive steps (a reduced-motion visitor never scrolls the lit state onto a step, so dimmed steps stay dimmed forever).
- Each plate has its own visual, from the storyboard (`motion/tier-5-motomation.md`) or the background's designed still (`principles/restraint.md`, "Designed stills").
- Look at the reduced-motion strip on its own (`node scripts/gate.mjs --report index.html`, third strip). If a frame of it could be mistaken for a paused frame of the full version, it's a poster: redesign it.

### 3. No step shows a value that is later corrected

A sequence that counts, totals, fills or prices as it scrubs must never show a wrong number while it waits:

- A step's number is correct in the HTML before any script runs (`0 hectares` waiting for a count-up is wrong; `412 hectares` that counts up from 0 only while it is in view and finishes on 412 is fine, if the starting value is never left on screen at rest).
- Under reduced motion every value is final on first paint.
- A step that is reached by jumping (a link, a refresh mid-page, the End key) shows its final value, not the value from the step before.

The gate's numbers check (`n`) reads values at scroll 0, at the end and under reduced motion; this review covers the steps in between.

## Review record (paste into the handoff)

```
Scroll sequence review: <selector of the sequence>, <n> steps
  1. contrast   step states: active <ratio>, inactive <ratio> (blend <hex> on <hex>) — PASS / FAIL
  2. fallback   reduced motion: unpinned plates with their own stills — PASS / FAIL (what it shows)
  3. values     no step shows a value later corrected — PASS / FAIL (which)
```

## Worked example: the v3 ceramics s3103 page, reviewed by this checklist

| Check | What the review finds | Result |
|---|---|---|
| 1. Contrast, active | `.steps li.on .label` #e8835a on #1c1714 → 6.62:1; body #efeae0 → 14.81:1 | pass |
| 1. Contrast, inactive | `li:not(.on)` at opacity .4: label blend #6e4230 on #1c1714 → **2.10:1** (needs 4.5); body blend #706b66 on #1c1714 → **3.37:1** (needs 4.5) | **FAIL** |
| 2. Fallback | under reduced motion the script returns before adding `.js-scrub` and marks every step `.on` ("finished cup, all steps readable"): all four steps fully visible, the stage shows the finished state; but `.stage{position:sticky}` is not inside a motion query, so the stage stays pinned while the steps scroll past | partial: no dimmed step (contrast passes), but it is not unpinned into plates — a finding to fix, separate from the contrast failure |
| 3. Values | step durations ("3 days", "36 hours") are static text | pass |

The review fails the page on check 1 before it ships, which is the failure axe found in v3 (4 contrast nodes at 1440) and the gate now finds too (14 inactive-step failures across 375/390/768/1440).
