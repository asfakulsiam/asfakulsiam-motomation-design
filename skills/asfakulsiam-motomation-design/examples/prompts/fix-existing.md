# Worked example: fixing an existing page (the short route)

A real failing page, fixed with the short route from `SKILL.md` ("When to use the short route"): name the cause, change only what the cause needs, run the gate before and after. No Thinking Sequence, no collision draw, no new signature.

| | |
|---|---|
| The page | A boutique-hotel homepage written by an agent **without** the skill: the v2 benchmark's hotel baseline, seed 4103 ([`evals/results/2026-10-11-benchmark-v2/hotel/baseline-s4103/`](../../../../evals/results/2026-10-11-benchmark-v2/hotel/baseline-s4103/)). Not made up for this example |
| Agent | Perplexity Computer (orchestrator model Claude Opus 5.5), following the skill by hand, every command run in a terminal |
| Skill | v2.4.0-dev, `gate/2`, Playwright 1.59.0, Chromium 1217 |
| Files | [`before.html`](../../../../docs/examples/fix-existing/before.html) · [`after.html`](../../../../docs/examples/fix-existing/after.html) · [`fix.diff`](../../../../docs/examples/fix-existing/fix.diff) · gate [before](../../../../docs/examples/fix-existing/gate-before.txt) / [after](../../../../docs/examples/fix-existing/gate-after.txt) |

## The broken page

![The hotel homepage at 1440px: small brass capitals "SHANKHARI BAZAR · PURAN DHAKA" above a large serif headline, an arched green door, and a dark booking bar fixed to the bottom of the window](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/fix-existing/before-1440.webp?raw=true)

It looks finished. The gate disagrees: every small brass label on the page is below WCAG AA.

## The prompt

```text
Use the asfakulsiam-motomation-design skill. My hotel homepage (index.html) fails its accessibility check on colour contrast. Fix it. Don't redesign the page.
```

## The route, stated first

```text
Route: short. A contrast fix on an existing page: no new structure, concept or signature is needed, so no Thinking
Sequence, archetype or collision. Restraint Gate, reduced motion and accessibility still apply, and the Delivery Gate
runs before and after.
```

## 1. Name the cause (gate before)

```text
$ node scripts/gate.mjs index.html
DELIVERY GATE · index.html
  contrast  ✗ 32 below AA across 375/390/768/1440px  (measured against rendered pixels at each width)
      375px  ✗ 8 below AA  (55 measured; 2 skipped; 0 not visible at scan time)
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  p.eyebrow  "Shankhari Bazar · Puran Dhaka"
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  p.eyebrow  "Twelve rooms"
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  p.eyebrow  "Rooftop breakfast"
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  p.eyebrow  "Walking tours"
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  span  "01"
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  span  "02"
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  span  "03"
        3.07:1 < 4.5:1  #a77b35 on #efe6d6  13px  p.eyebrow  "The house"
      390px  ✗ 8 below AA …   768px  ✗ 8 below AA …   1440px  ✗ 8 below AA …   (the same 8 at every width)
  overflow  ✓ 0 at 375/390/768/1440px
  words     ✓ 0 display-text problems at 375px  (15 display elements checked)
  motion    ✓ 0 text elements hidden only under reduced motion; pixels changing on a still page: 0%  (62 compared)
  names     ✓ 0 missing alt / accessible names  (15 interactive elements checked)
  numbers   ✓ 0 values shown wrong before they settle  (21 numbers checked …)
  structure  8 sections, entrances: static | static | fade | fade | fade | fade | static | static → 3 repeat(s); pins 1, WebGL canvases 0, JS 2KB gzipped
  FAIL  stamp → … · gate: c32 o0 w0 rm0 a0 n0 · gate/2 · be8117ae0c
```

**Cause:** one token. `--brass: #a77b35` is used as the text colour of every 13px label (`.eyebrow` and the numbered walks list). Brass on the plaster ground measures 3.07:1; small text needs 4.5:1. The same brass is also used for the large italic breakfast time (64–120px, where 3:1 is enough, so it passes) and for the focus ring (a non-text indicator, 3:1 needed, passes). So the brass itself is fine; it is wrong only as **small text**.

The fix follows from that: a darker brass for small text only, from the page's own palette, checked before it is used.

```text
$ node scripts/contrast.mjs "#8a6528" "#efe6d6"   → 4.26:1  body FAIL
$ node scripts/contrast.mjs "#7f5d24" "#e6dac5"   → 4.35:1  body FAIL   (on the second plaster)
$ node scripts/contrast.mjs "#7a5a22" "#efe6d6"   → 5.11:1  body PASS
$ node scripts/contrast.mjs "#7a5a22" "#e6dac5"   → 4.58:1  body PASS
```

`#7a5a22` passes on both plaster grounds the page uses. The dark sections already override the label colour (`.dark .eyebrow { color: #d7b26d }`), so they are untouched.

## 2. Change only what the cause needs

The whole fix, three lines ([`fix.diff`](../../../../docs/examples/fix-existing/fix.diff)):

```diff
-  --door:#3b4a3f; --door-dk:#2b372f; --iron:#1d1a18; --brass:#a77b35; --line:#cdbfa8;
+  --door:#3b4a3f; --door-dk:#2b372f; --iron:#1d1a18; --brass:#a77b35; --brass-text:#7a5a22; --line:#cdbfa8;
-.eyebrow{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass);font-weight:600}
+.eyebrow{font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:var(--brass-text);font-weight:600}
-.walks li span{font:600 13px var(--sans);letter-spacing:.1em;color:var(--brass);padding-top:8px}
+.walks li span{font:600 13px var(--sans);letter-spacing:.1em;color:var(--brass-text);padding-top:8px}
```

![The numbered walks list before (brass numbers, 3.07:1) and after (darker brass, 5.11:1); the list is otherwise identical](https://github.com/asfakulsiam/asfakulsiam-motomation-design/blob/evals/docs/examples/fix-existing/walks-before-after.webp?raw=true)

**Restraint Gate (short route):** what the fix did *not* add. The labels were not enlarged, made bold or turned into ink: any of those also passes, but changes the design. No second accent was introduced. The large brass time and the focus ring keep the original brass because they already pass. **Reduced motion:** no motion was touched. **Accessibility:** contrast fixed; accessible names were already at 0 missing and stay at 0; the focus ring is unchanged.

**Noticed, not changed:** the gate's critique notes `V2[entrance-repeats:3]`: four sections in a row enter with the same fade. That is a design note, not a contrast failure, and the prompt said not to redesign, so it is reported here and left alone. Fixing it would be a separate, short-route task ("vary the entrances") or part of a redesign.

## 3. Gate after

```text
$ node scripts/gate.mjs index.html
  contrast  ✓ 0 below AA across 375/390/768/1440px  (measured against rendered pixels at each width)
  overflow  ✓ 0 at 375/390/768/1440px
  words     ✓ 0 display-text problems at 375px  (15 display elements checked)
  motion    ✓ 0 text elements hidden only under reduced motion; pixels changing on a still page: 0%  (62 compared)
  names     ✓ 0 missing alt / accessible names  (15 interactive elements checked)
  numbers   ✓ 0 values shown wrong before they settle  (21 numbers checked …)
  structure  8 sections, entrances: static | static | fade | fade | fade | fade | static | static → 3 repeat(s); pins 1, WebGL canvases 0, JS 2KB gzipped
  PASS  stamp → … · gate: c0 o0 w0 rm0 a0 n0 · gate/2 · 16a09ecf7c
```

| Check | Before | After |
|---|---|---|
| Contrast below AA (4 widths) | 32 | **0** |
| Overflow | 0 | 0 |
| Display words | 0 | 0 |
| Reduced motion | 0 | 0 |
| Names | 0 | 0 |
| Numbers | 0 | 0 |
| Gate | FAIL | **PASS** |
| Lines changed | | 3 |

No stamp was written: the page had none, and the short route only stamps when the page already had one or you were asked.

## What this example found in the gate

Run with the v2.3.0 gate, the same page reported **44** contrast failures, not 32 ([old output](../../../../docs/examples/fix-existing/gate-before-old-gate.txt)). The extra 12 read like `1:1 #2a211b on #2a211b h2 "Rooms, plainly."`: text measured while it scrolled under the page's fixed booking bar, whose colour is `#2a211b`. The gate already skipped text covered by another layer, but it tested only five points (rows at 30–70% of the text box) while it sampled colours on a 6×3 grid (rows at 17/50/83%). Text whose bottom row sat under the bar slipped through, and the bar was read as its background.

v2.4.0 tests every sampled point for occlusion (`scripts/gate.mjs`, the `pts` grid in `contrast()`). The 12 false failures are gone, the 32 real ones remain, and the gate's fixture suite still passes. The same bug touched the v2 hotel scores, which is one reason the v3 benchmark was run on the fixed gate.

## Apply it to your own page

1. Say the route: `Route: short (<what is broken>; no new structure or signature)`.
2. Run `node <skill>/scripts/gate.mjs your-page.html` and find the **cause**, not the symptoms. Here 32 failures had one cause: one token used at the wrong size.
3. Fix the cause with the page's own materials. Check any new colour with `scripts/contrast.mjs` against every ground it sits on.
4. Run the gate again and put before and after side by side.
5. Write down what you noticed and didn't change. If the fix needs a new structure or signature, stop and switch to the full route, and say so.
