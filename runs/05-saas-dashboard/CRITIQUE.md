# Ledgerly critique
## Visual judgment, distinct from measured scores
The service UI keeps conventional navigation, table headers, visible filters and compact forms. Warmth comes from oatmeal ground, restrained forest ink, orange action and a small Georgia wordmark accent; not from a hero, editorial archetype or scroll choreography.

The 375px review initially exposed validation styling that did not clear and an offscreen skip link appearing in full-page captures. Both were corrected. The mobile navigation now gives its longest destination adequate width; 320px wraps rather than truncates. Secondary form guidance remains below the task on small screens. The invoice is visually distinct from the app shell without hiding preview/edit/mark-sent controls.

The interface remains deliberately familiar. It is not an award-level visual claim, a bespoke identity system or a substitute for research with actual shop owners. Invoice line grouping, visible filtering and status views are suitable for this brief; their market usability is inferred, not proven by the benchmark.

## First actual gate critique, superseded after fixes
Source: checks/full-gate-01.log, exit 1. Its advisory trace was:

`C5[restraint:kept] H4[375:1] S5[last5:none,self-excluded] R5[cuts:4,anim:3] M5[t1:pins0/2,webgl0/1,js19/30KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A3[focus:31/31,tgt:1f13w,zoom:0,reflow:0,fc:1,trap:0]`

The focal-point/display-scale advisories are not addressed by enlarging the app heading into a marketing hero: data-entry density is a stated product pressure. The actual failing target/forced-color/overflow and journey issues were addressed instead. These numbers are tool heuristics, not self-assigned quality or accessibility scores. The final measured trace is appended only after the next full scan completes.

## Second actual full scan
checks/full-gate-02.log returned exit 1. J measured `nav0 mobile0 forms0 loading- errors0 session0 → PASS`; the sole remaining quality failure was one table cell inside a closed cash-flow disclosure under forced colors. Explicit closed-table display:none now aligns its layout/visibility with native disclosure behavior. The targeted test, checks/forced-colors-01.log (exit 0), verifies zero cell rectangles while closed and visible black-on-white system text when open; both forced-color states were inspected as screenshots. The full third scan is still required to determine the handoff.

## Final measured critique

Full scan 03 returned exit 0. It was then superseded by the final signed-amount sort, business-monogram and corrupt-sign-in fixes. `checks/full-gate-04.log` returned exit 0 on that final source, 2026-10-19T06:04:04.512Z–06:13:47.600Z. Actual advisory trace:

```text
C5[restraint:kept] H5[375:0] S5[last5:none,self-excluded] R5[cuts:4,anim:3] M5[t1:pins0/2,webgl0/1,js20/30KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:31/31,tgt:0f10w,zoom:0,reflow:0,fc:0,trap:0]
```

The tool's `S5` has no external comparison corpus (`last5:none,self-excluded`); it is not evidence that this interface is original relative to other products. `A5` records sampled measurements, not a screen-reader or complete accessibility certification. Ten 24–43px targets remain warnings. The focal-mass and display-scale advisories remain deliberately unresolved: making a compact finance workspace into a hero-led composition would undermine the task.

The computed handoff is `VALIDATED` for the current file hash and recorded scope; prototype boundaries and exact sampling are retained in `GATE.md`. Authentication, bank sync and real email remain deferred. Next useful work would be moderated task testing with shop owners and an assistive-technology review, not more decorative motion.
