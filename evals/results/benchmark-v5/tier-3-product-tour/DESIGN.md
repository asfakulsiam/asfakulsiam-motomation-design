# DESIGN.md: Tally · a four-step product tour

> How it looks. Written at Thinking Sequence time (before any code), read by every later command. Overrides the house defaults.

## Read the room (thinking/brief-inference.md)
1. **Who:** a flatmate in Dhaka who has just been sent a link by the one person in the flat who keeps the notebook of who paid for what.
2. **Job:** walk four steps in order (what it is, what it does, what it costs, start) and leave on one obvious action.
3. **True and specific:** the name Tally; the line "Split it once. Stop doing the maths."; "Mitu owes Sabbir ৳ 640"; the three features; Free (up to 2 groups, unlimited expenses); Tally Plus (৳ 149 / month or ৳ 1,290 / year, unlimited groups, receipts, export to CSV); Google Play and browser links; ios@tally.example.com; web and Android; a small Dhaka startup.
4. **Feel, in the brief's words:** "four calm steps", "the same object moving forward, not a new page loading".
5. **Stack:** not named; client said "you choose" (Step 0 below).
6. **Tier:** forced Tier 3 (`--tier=3`), and the brief argues for it.
7. **Must not happen:** blank flash, layout jump, a reload feel, broken Back, no-VT browsers left without a page change, motion that ignores reduced motion, focus left on the old link.
8. **The lazy version:** a SaaS landing page split into four tabs: centred hero with a phone mockup, three icon cards, a three-column pricing table, a "Get started" banner, all fading up on scroll.

Gaps: `[NEEDS ASSET: the client's four Lottie or Rive files]` (stand-ins authored here); `[NEEDS COPY: the site's own domain]` (assumed `https://tally.example.com/`, the brief's own example domain). Two gaps, so assumptions stated and no question asked.

## Stack
- **Stack:** plain HTML/CSS/JS (four static `.html` documents, one shared stylesheet, one small deferred script, lottie-web light player vendored)
- **Source:** "you choose"
- **Reason:** cross-document View Transitions are native to plain multi-page navigation, so four real reloadable URLs need no router, no build and no framework; the result opens from a static folder as the brief and host require.
- **Adapter:** `adapters/vanilla.md`

## Concept
- **Tension:** Tally must be four separate URLs a visitor can share and reload ↔ the founders want it to feel like one balance card moving forward, never a page loading.
- **Concept sentence:** The tour is one Tally slip that prints a new line at every step and carries itself to the next page; Back rolls the last line back in.
- **Archetype + mutation:** Atlas as reference (a diagram you move through): the tour is a four-station route drawn across the top of every page, and the slip is the thing that travels it. Mutation, remove the expected: no nav bar and no hero picture. The route is the only navigation, and the only "picture" is the slip itself.
- **Collision:** receipt printer (seed 9301) → steal "paper feeding line by line": each step feeds exactly one numbered line onto the slip (01 balance, 02 expense added, 03 plan, 04 ready), with a perforated tear edge at the foot of the slip. Behaviour, not clip-art: no printer is drawn.
- **Signature move:** **The slip carries forward.** The slip is the same view-transition element on all four pages; on every page change it travels to its new place while its earlier lines ride with it and the new line feeds out under them. Back reverses it: the line retracts and the slip travels back. Introduced on Intro → Features, repeated three times with variation (right → left, left → right, right → centre).
- **Dials:** ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 3 (forced with `--tier=3`; MOTION 2 allows 1–3, and the brief's "Why this tier" asks for page-to-page continuity, not scroll choreography)
- **Rejected:** the obvious version above; Tier 2 scroll reveals (the brief says they miss the point); a phone mockup as the Intro picture (the brief asks for "one picture of the balance", which is the slip); the drawn seed move "Hold to Commit" on Start (it would put friction on the one action the tour exists for).

Anti-sameness (thinking/sequence.md step 6): AI-default list matches 0 of 29 (no centred hero with two buttons, no icon row, no bento, no gradient, no fade-up on scroll). Memory: `memory.mjs check --archetype atlas --signature slip-carry --tier 3` → archetype fresh, signature fresh, no logged run to compare. Differs from the template in structure (route of four documents), type (Young Serif + mono slip), colour (receipt paper and stamp blue), motion (shared-element page travel), signature (slip-carry), imagery (none: the slip is the picture). Note: the skill's own `examples/templates/saas-landing.html` also uses the name "Tally" (a different product, Workbench archetype, Bricolage/Hanken, green): this build shares none of its archetype, faces, palette or signature.

## Typography
Type mode: SERVICE STYLE (information-led) — because the tour is a short decision about money: the visitor reads amounts, compares two plans and acts. The slip and the plans carry tabular figures in a mono. One HOUSE-scale element per page, the step's `h1`, sits above that service layer and is the largest type on each screen.

| Role | Family | Weight/axes | Size token | Notes |
|---|---|---|---|---|
| Display | Young Serif | 400 | `--display` clamp(2.25rem, 1.4rem + 3.4vw, 4.5rem) | friendly heavy old-style: households and flatmates, not a bank; only the `h1` per step |
| Heading | Young Serif | 400 | `--ui-3` clamp(1.375rem, 1.2rem + .8vw, 1.875rem) | plan names, feature names |
| Body | Instrument Sans | 400 / 600 | `--ui-1` 1.0625rem | precise neutral grotesk that stays out of the way |
| Mono / labels | JetBrains Mono | 400 | `--ui--1` .8125rem | the slip's printed lines, step numbers, station labels; tabular figures |
| ৳ and Bangla glyphs | Hind Siliguri | 400 / 600 | inherits | fallback in every stack so ৳ renders in a designed face |

Line-height: display 1.02, headings 1.15, body 1.55. Measure 60ch. `text-wrap: balance` on headings, `pretty` on paragraphs. Longest display word at 375: "themselves" (10 × 36px × 0.5 = 180px) fits.

## Colour
| Token | Value | Contrast vs ground | Use |
|---|---|---|---|
| `--ground` | `#ECE8DF` | — | the counter the slip lies on |
| `--paper` | `#FBFAF5` | — | the slip and plan surfaces |
| `--ink` | `#171613` | 14.79:1 (ground) · 17.31:1 (paper) | text |
| `--muted` | `#59554C` | 6.07:1 (ground) · 7.10:1 (paper) | secondary text, hairlines |
| `--accent` | `#2B3CB0` | 7.22:1 (ground) · 8.45:1 (paper); paper on accent 8.45:1 | carbon-stamp blue: the newest line's number on the slip, the route marker, the forward action |

Checked with `scripts/contrast.mjs`. Accent stays under 5% of each screen.

## Layout
- Grid: 12 columns, outer margin clamp(20px, 5vw, 88px). The slip is a constant 22rem wide on every page (so the view-transition snapshot never stretches); only its height grows, one line per step.
- Slip placement per step (desktop ≥ 900px): Intro right of the line, Features left of the list, Pricing right of the plans, Start centred above the action. Under 900px the slip sits under the heading on steps 1–3 and above it on Start.
- Margins / gutters: gutter clamp(16px, 2vw, 32px); vertical rhythm on an 8px base.
- Section spacing: one screen per step; the stage has a min-height of one viewport minus the route so the pager never jumps.
- Nav: the route. Four numbered stations across the top ("01 Intro · 02 Features · 03 Pricing · 04 Start") with a stamp-blue marker under the current one, and a visible "Step 2 of 4" label. A pager at the foot of each stage: Back (to the previous step by name) and the forward action (by name).
- Footer (sign-off): one line colophon: "Tally · shared expenses for flatmates and families · made in Dhaka" plus the waitlist email.

## Components
- Buttons: the forward action is a filled stamp-blue link with paper text, 2px radius (receipt-precise); Back is a text link with an arrow. Press scales to .97 in 120ms.
- Links: underlined, 1px, offset .2em; focus ring 2px accent with 3px offset.
- Cards (only if needed): the slip (a discrete object) and the two plans (two discrete offers). No shadow + border + radius stack: the slip separates by paper colour and a tear edge only.
- Forms: none. Start links out to the app, the store and an email address.

Find before build: route, pager, slip and plan blocks were looked for in the project (empty folder), in `examples/components/` (read `data/components.csv` for step, toggle, pager, progress and transition: the nearest are Reading Rail, a scroll-fill rail inside one page, and Squish Switch, a toggle; both are React `.tsx` and neither is a step rail across documents), and in a headless registry (none fits a no-build static site). Written custom. The slip is the signature, so it is exempt.

## Imagery
- Source: none. Imagery is out of scope; the slip is the product picture.
- Treatment: product animations are Lottie stand-ins authored for this build (`assets/lottie/*.json`), drawn as flat ink and stamp-blue shapes inside the slip's print window.
- `[NEEDS ASSET]` list: the client designer's four files (balance card, expense added, plan toggle, check mark) to replace `assets/lottie/balance.json`, `add-expense.json`, `plan-toggle.json`, `check.json` at the same 320 × 120 artboard. Until each loads, the print window shows an inline SVG of that animation's final frame.

## Restraint Gate record
<!-- Filled in at step 7 of the Thinking Sequence. scripts/gate.mjs derives the C and R critique scores from these lines, so keep the exact prefixes. -->
- Concept survived: yes
- Cut: a phone mockup or hero picture on Intro — fails Q1 and Q2 (the slip already is the "one picture of the balance"; the brief needs no device frame)
- Cut: a top navigation bar and a hamburger menu — fails Q1 and Q2 (the route already navigates; a second nav competes with it)
- Cut: a comparison table under the plans and a savings badge on the yearly price — fails Q1 and Q2 (two plans read as two blocks; a savings figure is not in the brief)
- Rejected animation: fade-up reveals on the feature list and plan blocks — Q2, it tells the user nothing: the page change already brought them in
- Rejected animation: Hold to Commit on the Start action (drawn seed) — Q1, should it move at all: it slows the one action the tour exists for
- Rejected animation: looping Lottie illustrations — Q4, edges: a loop keeps moving while the visitor reads and repeats on every visit; each plays once and rests on its final frame
- Kept: the perforated tear edge at the foot of the slip — fails Q1, passes Q2: the receipt-printer collision needs the slip to read as one paper object that keeps growing

## Measured
Pasted from `scripts/gate.mjs` (full output of the four final runs: `gate-all.txt`; `--verify` on all four: STAMP VERIFIED, `qa/verify-all.txt`). The runs predate the memory log entry, so S reads `last5:no-log`; a re-scan after the log will report the archetype as used.

- `index.html`: `critique: C5[restraint:kept] H5[375:0] S5[last5:no-log] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:7/7,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 557be0b795 · skipped 1/24@375`
- `features.html`: `critique: C5[restraint:kept] H5[375:0] S5[last5:no-log] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:8/8,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 67a4cc11f1 · skipped 1/30@375`
- `pricing.html`: `critique: C5[restraint:kept] H5[375:0] S5[last5:no-log] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:8/8,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · f4aa3d6ded · skipped 1/39@375`
- `start.html`: `critique: C5[restraint:kept] H5[375:0] S5[last5:no-log] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:10/10,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 0eff3f7381 · skipped 1/36@375`

## Handoff
```
Chose     : Atlas (four-station route) mutated by remove-expected (no nav bar, no hero picture); signature slip-carry; Young Serif / Instrument Sans / JetBrains Mono (+ Hind Siliguri for ৳); receipt paper #ECE8DF/#FBFAF5, ink #171613, stamp blue #2B3CB0; Tier 3 (cross-document View Transitions + Lottie)
Rejected  : a four-tab SaaS landing page (centred hero, phone mockup, icon cards, pricing table, fade-ups); Tier 2 scroll choreography; Hold to Commit on Start
Needs     : [NEEDS ASSET] the client's four Lottie/Rive files (same names, 320 × 120); [NEEDS COPY] the site's real domain (tally.example.com assumed for canonical, og:url, sitemap); owner to do: Search Console, Lighthouse field numbers, a host that serves _headers (nosniff)
Measured  : four PASS stamps above, verified
Try next  : /critique the Pricing step on a 375px phone, where the slip sits below the two plans
```
