# Fix 15: stamps filled with measured gate values

Every page of the five builds (26, including the 404s) was gated on its own: `node skills/asfakulsiam-motomation-design/scripts/gate.mjs <page>.html`. The "stamp → critique: … · gate: …" line each run printed is in `_build/stamps.json` and written into the page by `_build/stamp.py`. Transcripts: `_gate-pages/<build>/<page>.txt`. Before the gates ran, each of the five memory-log entries got its build folder as `dir` (`~/.motomation/log.json`, copy in `memory-log.json`), so S excludes the build's own entry; the metal band's entry had been logged with signature `impact-flash` while its stamp says `impact`, so the archetype/signature fallback could not find it.

Result: 21 of 26 pages PASS. The 5 that FAIL are the five 404 pages, each on one rule, seo-04 (no canonical tag); their stamps record that FAIL as measured.

## One stamp, before and after (01-funeral-home/contact.html)
```
<!-- motomation · archetype: timeline · mutation: single-object · signature: paper-feed · tier: 2 · critique: <paste> · gate: <paste> -->
<!-- motomation · archetype: timeline · mutation: single-object · signature: paper-feed · tier: 2 · critique: C5[restraint:kept] H4[375:1] S5[last5:none,self-excluded] R3[cuts:1,anim:1] M5[t2:pins0/2,webgl0/1,js2/80KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:11/11,tgt:0f5w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 06d4010002 · skipped 1/20@375 -->
```

## Verified against a fresh scan
```
$ node skills/asfakulsiam-motomation-design/scripts/gate.mjs --verify evals/results/diversity/01-funeral-home/contact.html
  PASS  stamp → critique: C5[restraint:kept] H4[375:1] S5[last5:none,self-excluded] R3[cuts:1,anim:1] M5[t2:pins0/2,webgl0/1,js2/80KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:11/11,tgt:0f5w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 06d4010002 · skipped 1/20@375

  stamp skips: 1/20@375 · fresh scan: 1/20@375 (5%)
STAMP VERIFIED · critique and gate numbers match a fresh scan · gate PASS
(exit 0)
```

## Per page

| Page | Gate |
|---|---|
| 01-funeral-home/404.html | FAIL |
| 01-funeral-home/contact.html | PASS |
| 01-funeral-home/index.html | PASS |
| 01-funeral-home/prices.html | PASS |
| 01-funeral-home/what-happens-next.html | PASS |
| 02-childrens-dentistry/404.html | FAIL |
| 02-childrens-dentistry/book.html | PASS |
| 02-childrens-dentistry/first-visit.html | PASS |
| 02-childrens-dentistry/index.html | PASS |
| 02-childrens-dentistry/treatments.html | PASS |
| 03-hardcore-metal-band/404.html | FAIL |
| 03-hardcore-metal-band/album.html | PASS |
| 03-hardcore-metal-band/index.html | PASS |
| 03-hardcore-metal-band/merch.html | PASS |
| 03-hardcore-metal-band/shows.html | PASS |
| 04-luxury-perfume/404.html | FAIL |
| 04-luxury-perfume/atelier.html | PASS |
| 04-luxury-perfume/index.html | PASS |
| 04-luxury-perfume/request.html | PASS |
| 04-luxury-perfume/the-oud.html | PASS |
| 05-municipal-water-authority/404.html | FAIL |
| 05-municipal-water-authority/bills.html | PASS |
| 05-municipal-water-authority/index.html | PASS |
| 05-municipal-water-authority/outages.html | PASS |
| 05-municipal-water-authority/report.html | PASS |
| 05-municipal-water-authority/water-quality.html | PASS |
