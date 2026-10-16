# Fix 12: luxury perfume, "Maison Ilham" self-link on /

Fix (_build/site4.py): on / the house name is a <span class="house">, not a link to the page you are on; on the other pages it still links to /. The nav marks the current page with <span aria-current="page"> instead of linking to itself.

## Before
```
     117×42  a.house  "Maison Ilham"
               ✗ tap a "Maison Ilham" (/): nothing changed after a tap (no DOM change, focus, scroll, navigation or event)
  FAIL  stamp → critique: C4[restraint:changed1] H5[375:0] S1[last5:archetype-reused,signature-new,fp100] R3[cuts:1,anim:1] M5[t3:pins1/2,webgl0/1,js3/140KB,rm0] V5[entrance-repeats:0] Q5[prog:Δ3%,smooth:sandbox,rm:flow] A5[focus:9/9,tgt:0f8w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 
```

## After
```
  J — journey (whole site, real browser; any missing state fails the page; not in the stamp or its id)
    journey: nav0 mobile0 forms0 loading- errors0 session0 → PASS
  PASS  stamp → critique: C4[restraint:changed1] H5[375:0] S1[last5:archetype-reused,signature-new,layout-reused,palette-new,fp100] R3[cuts:1,anim:1] M5[t3:pins1/2,webgl0/1,js3/140KB,rm0] V5[entrance-repeats:0] Q5[prog:Δ3%,smooth:sandbox,rm:flow] A5[focus:8/8,tgt:0f7w,zoom:0,reflow:0,fc:0,trap:0]
(exit 0)
```
