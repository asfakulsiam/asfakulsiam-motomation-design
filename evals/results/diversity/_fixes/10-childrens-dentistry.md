# Fix 10: children's dentistry, Home pill contrast and self-links

Cause of the 2.36:1 (#fff8ee on #a2a4ab at 375/390): the gate measures a text element's own box. The text element was the <a> pill itself (border-radius 999px), so the sampler's corner points fell outside the navy fill, on anti-aliased edge pixels over the cream page; the 10th-percentile rule judged those. On screen the label is cream on navy. Fix (_build/site2.py): the label sits in a <span> inside the pill, so the measured box is the text; the current page's nav item is a marked <span aria-current="page"> instead of a link, and on / the "Little Molars" logo is a <span> (a link to the page you are on changes nothing when tapped). Other pages still link the logo to /.

## Before
```
        2.36:1 < 4.5:1  #fff8ee on #a2a4ab  17px  a  "Home"
        2.36:1 < 4.5:1  #fff8ee on #a2a4ab  17px  a  "Home"
     163×35  a.logo  "Little Molars"
               ✗ tap a "Little Molars" (/): nothing changed after a tap (no DOM change, focus, scroll, navigation or event)
               ✗ tap a "Home" (/): nothing changed after a tap (no DOM change, focus, scroll, navigation or event)
  FAIL  stamp → critique: C4[restraint:changed1] H5[375:0] S2[last5:archetype-reused,signature-reused,fp37] R3[cuts:1,anim:1] M5[t3:pins0/2,webgl0/1,js2/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:12/12,tgt:0f6w,zoom:0,reflow:0,fc:0,trap:0] · gate: c2 o0 w0 rm0 a0 n0
```

## After
```
  contrast  ✓ 0 below AA across 375/390/768/1440px  (measured against rendered pixels at each width)
  PASS  stamp → critique: C4[restraint:changed1] H5[375:0] S5[last5:archetype-new,signature-new,layout-new,palette-new,fp28,self-excluded] R3[cuts:1,anim:1] M5[t3:pins0/2,webgl0/1,js2/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:10/10,tgt:0f5w,zoom:0,reflow:0,fc:0,trap
(exit 0)
```
