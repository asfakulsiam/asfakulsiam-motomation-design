# CI status: a correction

This note corrects a claim made in an earlier report. It is not a changelog entry, and the report it corrects stays as it was.

## The claim

The master run report (A1–A7, B1–B11, C1–C12) said that C1 fixed the Components CI. `CHANGELOG.md` records the same claim:

> **C1:** fixed the failing Components workflow (measuring swipe-row text, infinite WAAPI animations held at frame 0, the forced-colors clip). Thresholds are unchanged.

## What actually happened

The Components CI has been red since `b0ebd8d`, before the master run started. The master run's C1 did not fix it. The `components (ui)` shard failed on every run after that: `b0ebd8d`, `7db198e`, `3d5a981`, `476766b`, the C1 commit `5ac5bdb`, `2ad373a`, `69e9b16` and `f506e41`. C1 was reported as fixed from local runs; nobody checked it against a finished CI run.

The cause is three UI demos whose text cannot be measured at 375px. The gate correctly reported them as not verified, because more than its 30% coverage limit was skipped:

| component | skipped at 375px | why (`tests/components/why-skipped.mjs`) |
|---|---|---|
| icon-cloud | 15 of 21 (71%) | moving: the labels turn in a rAF loop and never settle |
| glare-card | 2 of 5 (40%) | occluded: the glint layer paints over both lines of the card |
| device-mockup | 7 of 22 (32%) | 6 off-screen (a tall browser frame on touch hid its page below the fold), 1 occluded (the phone's notch over the heading) |

The gate's 30% threshold is unchanged. The demos were fixed, not the gate.

A second fault hid the cause. `tests/components/per-component.mjs` kept one shared variable for the reason, so every failing page was reported with icon-cloud's coverage reason.

## The fix

- `bd30edf`: `tests/components/why-skipped.mjs` names the reason for each skipped element. Its counts match the gate's on all 13 UI demos.
- `2af4c6e`: the three demos are fixed.
  - icon-cloud: the ball is the picture (aria-hidden), and the trees are a real, visible list.
  - glare-card: the text sits above the sheen.
  - device-mockup: the phone screen gets a safe area below the notch. A tall screen with no hover glide shows its whole page. The glide now scrolls the screen, so the wheel, keyboard and 200% zoom can reach every line.
- `77684ff`: each failing page reports its own reason. This was checked with the three old demos as deliberate failures.

Gate at 375px after the fix (`gate.mjs` on each demo page):

```
device-mockup  375px  ✓ 0 below AA  (22 measured; 0 skipped; 0 not visible at scan time)
               coverage   ✓ worst width 375px: 0 of 22 text elements skipped (0%; limit 30% at every width)
               zoom200 ✓ 0 lost · forced ✓ 0 of 22
glare-card     375px  ✓ 0 below AA  (5 measured; 0 skipped; 0 not visible at scan time)
               coverage   ✓ worst width 375px: 0 of 5 text elements skipped (0%; limit 30% at every width)
icon-cloud     375px  ✓ 0 below AA  (20 measured; 0 skipped; 0 not visible at scan time)
               coverage   ✓ worst width 375px: 0 of 20 text elements skipped (0%; limit 30% at every width)
               forced ✓ 0 of 21
```

`per-component.mjs --only icon-cloud,glare-card,device-mockup` reports "gate pass" for all three, meaning the core counts are 0. Run standalone, the gate exits 1 on each demo page. The only failures are the whole-page rule sets: S (SEO: seo-04/06/11/18) and K (security headers: sec-h1/2/3). The harness excludes these for every component demo, and all 13 UI demos fail them the same way.

## Not verified here

The Components workflow on `77684ff` was triggered but not waited on. It is the first CI run of these fixes, and this note does not claim its result. Check the [Components workflow runs](https://github.com/asfakulsiam/asfakulsiam-motomation-design/actions/workflows/components.yml).
