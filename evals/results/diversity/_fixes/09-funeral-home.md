# Fix 9: funeral home, sticky call bar under reduced motion

Option B: the gate ignores thin sticky elements (< 15% of the viewport). The call bar (a full-width strip with the phone number) is page chrome; it holds no scroll sequence, so there is nothing for reduced motion to unpin. A sticky element that covers 15% or more of the viewport inside a parent of 1.5 screens or more is still a pinned zone and still must flow under reduced motion.

## Before (gate.txt as committed)
```
     ✓ sticky div.callbar  1382px  Δ median 9.3% · 7/7 transitions change  [14.72 9.29 9.3 9.07 8.19 7.82 13.94]
  rm-flow   ✗ under reduced motion: 1 zone(s) still pinned (sticky div.callbar), 0 text(s) missing · 0 visible canvas(es)
     pin fill  ⚠ 0 of 1 pinned zone(s) at least 60% filled  (sticky div.callbar 12%)
  FAIL  stamp → critique: C5[restraint:kept] H5[375:0] S1[last5:archetype-reused,signature-reused,fp100] R3[cuts:1,anim:1] M5[t2:pins1/2,webgl0/1,js2/80KB,rm0] V3[entrance-repeats:2] Q3[prog:Δ9.3%,smooth:sandbox,rm:pinned] A5[focus:12/12,tgt:0f4w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q1 k0 · rules: C0 S0 P0 K0 · gate/4 · 9786947bba · skipped 1/44@375
```

## After
```
  chrome    · sticky chrome, not a pinned zone (< 15% of the viewport): div.callbar 7%
  rm-flow   – no pinned zone
  PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none,self-excluded] R3[cuts:1,anim:1] M5[t2:pins0/2,webgl0/1,js2/80KB,rm0] V3[entrance-repeats:2] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:12/12,tgt:0f4w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · bcb6133fed · skipped 1/44@375
(exit 0)
```
