# GATE.md · Tannery Row Coffee

Written at Checkpoint 6 from the gate output on the reviewed build (`npm run build`, static export to `out/`). The skill
under test is the working tree of `asfakulsiam-motomation-design` at main 96b1b51 plus this maintenance pass's gate fixes.

## Measured

```
./ (out/) · gate.mjs gate/4 · 2026-10-17 · Playwright Chromium build chromium-1217
$ node skills/asfakulsiam-motomation-design/scripts/gate.mjs ./
gate: ./ → its build output out/
gate: constrained machine (2 CPUs); a failed scan is retried once in the light footprint
DELIVERY GATE · /home/user/workspace/tannery-row/out
  contrast  ✓ 0 below AA across 375/390/768/1440px  (measured against rendered pixels at each width)
      375px  ✓ 0 below AA  (63 measured; 1 skipped; 0 not visible at scan time)
      390px  ✓ 0 below AA  (63 measured; 1 skipped; 0 not visible at scan time)
      768px  ✓ 0 below AA  (63 measured; 1 skipped; 0 not visible at scan time)
     1440px  ✓ 0 below AA  (63 measured; 1 skipped; 0 not visible at scan time)
  overflow  ✓ 0 at 375/390/768/1440px
  words     ✓ 0 display-text problems at 375px  (8 display elements checked)
  motion    ✓ 0 text elements hidden only under reduced motion; pixels changing on a still page: 0%  (64 compared)
  names     ✓ 0 missing alt / accessible names  (24 interactive elements checked)
  numbers   ✓ 0 values shown wrong before they settle  (11 numbers checked at scroll 0, scroll end and reduced motion; 5 live values skipped)
  progress  ✓ 0 of 0 pinned/scrubbed zone(s) static (median change between 8 scroll samples ≤ 0.5% of pixels)
  smooth    – no pinned zone, not measured
  rm-flow   – no pinned zone
  rm-still  – no motion that needs a still (no zone, canvas, video or looping animation)
  focus     ✓ 0 of 24 focused elements show no visible focus indicator  (24 tabbable)
  targets   ✓ 0 under 24px, 11 under 44px (warning) at 375 touch  (17 checked; inline links exempt)
     327×30  a.masthead__name  "Tannery Row Coffee"
     166×43  a  "Directions and access"
     101×24  a  "Flat white"
     179×24  a  "V60, single origin"
  zoom200   ✓ 0 lost at 200% (1440×900 → 720×450): text clipped or controls unreachable that were fine at 100%
  reflow    ✓ 0px horizontal scroll at 320px
  forced    ✓ 0 of 63 texts illegible in forced colors (rendered ink under 3:1 against its box, or no ink)
  kbd-trap  ✓ 24 of 24 tabbable reached in 54 Tabs, no cycle
  C copy     ✓ 0 rule(s) failing  (craft/copy.md; 0 warning(s))
  S SEO      ✓ 0 rule(s) failing  (craft/seo.md; 0 warning(s))
  P perf     ✓ 0 rule(s) failing  (craft/performance.md; 0 warning(s))
  K security ✓ 0 rule(s) failing  (craft/security.md; 0 warning(s))
  composition (advisory: heuristics, never fail the gate, not in the stamp)
     pin fill  – no pinned zone
     focal     ⚠ 2 of 3 screen(s) with text have one clear focal point (heaviest text mass ≥ 1.5× the next); no clear lead on screen 2 (1.01×)
     scale     ✓ display:body 1:6.1  (104px / 17px; warn below 1:6)
  richness (advisory: "too little" warnings, never fail the gate, not in the stamp)
     page      home (from path; set with --page home|category|about|page)
     fold      ✓ 9 meaningful section(s) above the fold at 1440×900: nav header.masthead, heading h1#lead-title, heading h2#today-title.today__title, text p.dek, text p.lead__actions, text p.today__address, text p, media img, action a.button  (warn below 3)
     opening   ✓ h1 "Coffee you can watch being made."
  micro-states (advisory: missing states are warnings, never fail the gate, not in the stamp)
     buttons   – none on the page
     forms     – none on the page
     lists     – 1 static list(s): not judged (mark data lists with data-entity)
     images    ✓ 3 image(s)  (have: loading, loaded, error)
     async     ✓ fetch/XHR in scripts  (have: pending, success, error)
  hierarchy  h1×1, 0 skipped heading levels, 1 element(s) tied for largest on the first 375px screen
  structure  5 sections, entrances: static | static | static | static | static → 0 repeat(s); pins 0, WebGL canvases 0, JS 16KB gzipped beyond the framework (+101KB framework runtime, from .next/build-manifest.json)
  records    DESIGN.md: /home/user/workspace/tannery-row/DESIGN.md · memory log: /home/user/workspace/tannery-row/.motomation/log.json · stamp fields: {"archetype":"broadsheet","mutation":"list-becomes-map","signature":"cup-cross-section","tier":"1"}
  critique → C4[restraint:changed1] H5[375:0] S5[last5:none,self-excluded] R3[cuts:1,anim:1] M5[t1:pins0/2,webgl0/1,js16/30KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:24/24,tgt:0f11w,zoom:0,reflow:0,fc:0,trap:0]
  coverage   ✓ worst width 375px: 1 of 64 text elements skipped (2%; limit 30% at every width)
  X — completeness (independent specialty coffee bar, single site (UK-style content; fictional town), admin panel: no) [functional frontend]  ✓
      Routes:      4/4 required present
      Functions:   5/5 present · 1 not required (reason given)
      States:      4/4 defined
      Legal:       1/1 present
      Edge cases:  2/2 handled
      Template:    19/19 present · 2 not required (reason given)
      ⚠ media: 6 asset(s) in MEDIA.md must be replaced or cleared before production; not production-ready until they are  (warning)
  J — journey (whole site, real browser; any missing state fails the page; not in the stamp or its id)
    nav      ✓ 5/5 route(s) reachable from home in ≤ 3 clicks (/:0 /visit:1 /menu:1 /contact:1 /privacy:1)
               · sitemap.xml: 5 route(s)
               · 5 page(s) loaded
    mobile   ✓ 44/44 interactive element(s) respond at 375px · tap 44/44 · swipe n/a · long-press n/a
               · 5 page(s); an element shared by several pages (header, footer) is tapped once
               · 4 mailto/tel link(s) are handed to the OS and counted as responding
               · 5 element(s) parked off-canvas (skip links, closed drawers) are keyboard-only by design and not tapped
               · no element declares a long press
    forms    ✓ 5/5 form state(s) rendered · Your name (/contact/): default✓ validation✓ loading✓ success✓ serverError✓
    loading  – n/a: 16 request(s) after load, but nothing on the page changed when they returned: no async surface
    errors   ✓ 1/1 designed not-found view (unknown route → HTTP 404)
               · probed /__motomation-missing-mvcemvzc/
    session  ✓ 6/6 · load ✓ · open a second route ✓ · back button ✓ · forward button ✓ · full reload ✓ · two tabs ✓
               · second page: /visit
    journey: nav0 mobile0 forms0 loading- errors0 session0 → PASS
  PASS  stamp → critique: C4[restraint:changed1] H5[375:0] S5[last5:none,self-excluded] R3[cuts:1,anim:1] M5[t1:pins0/2,webgl0/1,js16/30KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:24/24,tgt:0f11w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 89ac3bdb6e · skipped 1/64@375
```

Earlier runs on this project, in order, for the record (each fixed before the next):
1. FAIL: two standalone links under 24px at 375; tapping the already-chosen drink and a licence link wrapped over two
   lines "did nothing"; the form's success state was not seen. The first two were site defects (fixed here); the last
   two were gate defects (fixed in `scripts/journey.mjs`, regression fixture `fixtures/journey/form-replaced/`).
2. PASS, but critique S and M unmeasured: the stamp sat in the stylesheet and the gate read only `index.html` (gate fixed:
   `stampSource` in `scripts/gate.mjs`); the Next build had also stripped the comment (`/*! … */` now, `adapters/next.md`).
3. FAIL perf-04 (155 KB vs 30 KB) once the tier was readable: the gate counted the Next.js runtime and a `nomodule`
   polyfill against a budget documented as "beyond the framework" (gate fixed: `frameworkFiles`).

The stamp in `app/globals.css` carries run 4's segments; pasting it changed the stylesheet, so this final run's page id
differs (89ac3bdb6e vs 2957b8fae9). Every axis value is the same.

## Judged

- self (opinion): C 4 · R 3, from `DESIGN.md` → Restraint Gate record
- self (opinion): AI-default scan answered by eye: no gradient, glass, bento or three-icon row; one accent; no emoji; no
  stock "hero latte" opening. One point against: the front page photo is a third-party kitchen counter with book spines
- self (opinion): craft checklist by eye: failed items: none found
- judge (opinion): none

## Not verified

- Lighthouse and field performance: not measured
- Real phones and screen readers: not tested (Chromium touch emulation and the gate's accessibility checks only)
- The gate's `loading` journey check: n/a, the site has no async surface on load
- A URL target (a live host serving `out/`): not gated; there the framework is not subtracted and perf-04 would count about 117 KB against Tier 1's 30 KB
