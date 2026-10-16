# Fix 11: hardcore metal band, 4 texts illegible in forced colours

Cause: in forced colours Chromium paints an opaque Canvas backplate behind every text run. The giant title (transformed by the scroll drift) and the oversized .hit headings paint above their non-positioned siblings, so their backplates covered span.sub and the three p.room-no labels: the gate's screenshot of each box held no ink (1:1). A probe in forced-colours emulation showed blank crops before and the text after.

Fix (_build/site3.py): .room-no and .sub get position: relative; z-index: 3, so they paint above the headings' backplates. No content removed; the normal-colour rendering is unchanged (both already sat in clear space).

## Before
```
  forced    ✗ 4 of 21 texts illegible in forced colors (rendered ink under 3:1 against its box, or no ink)
     1:1  span.sub  "Lohar Shohor. Eight tracks. Ou"  forced-color-adjust: auto
     1:1  p.room-no  "ROOM 01"  forced-color-adjust: auto
     1:1  p.room-no  "ROOM 02"  forced-color-adjust: auto
     1:1  p.room-no  "ROOM 03"  forced-color-adjust: auto
     scale     ✓ display:body 1:12.8  (388.8px / 30.4px; warn below 1:6)
  FAIL  stamp → critique: C4[restraint:changed1] H5[375:0] S3[last5:archetype-reused,signature-new,fp81] R3[cuts:1,anim:1] M5[t4:pins0/2,webgl0/1,js2/250KB,rm0] V3[entrance-repeats:2] Q5[prog:n/a,smooth:n/a,rm:n/a] A4[focus:8/8,tgt:0f2w,zoom:0,reflow:0,fc:4,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k
```

## After
```
  forced    ✓ 0 of 21 texts illegible in forced colors (rendered ink under 3:1 against its box, or no ink)
  PASS  stamp → critique: C4[restraint:changed1] H5[375:0] S3[last5:archetype-reused,signature-new,layout-reused,palette-new,fp81] R3[cuts:1,anim:1] M5[t4:pins0/2,webgl0/1,js2/250KB,rm0] V3[entrance-repeats:2] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:8/8,tgt:0f2w,zoom:0,reflow:0,fc:0,trap:0] · gat
(exit 0)
```
