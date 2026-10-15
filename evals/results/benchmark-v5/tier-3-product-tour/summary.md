# Benchmark v5 · Tier 3 · summary

Brief:      tier-3-product-tour (Tally, a four-step product tour for a shared-expenses app: Intro, Features, Pricing, Start)
Tier:       3 — Pro (cross-document View Transitions with shared elements + Lottie/Rive product animations)
Model:      same default delegated-agent model for both arms (model id not exposed); one seed: 9301
Stack used: baseline: plain static HTML + CSS + vanilla JS, cross-document View Transitions, lottie-web light 5.12.2 vendored, four folder URLs (`/`, `/features/`, `/pricing/`, `/start/`); "native page transitions need four real HTML pages rather than a framework router, and it opens from the folder with no build." · skill: plain HTML/CSS/JS (adapters/vanilla.md), four `.html` documents, lottie-web light 5.12.2 vendored, self-hosted fonts; "page-to-page View Transitions work natively across plain HTML pages, so four real, reloadable URLs need no router or build step and open from a static folder."
Gate:       baseline FAIL on all 4 pages (c32–36; rules S2 P1 K3) · skill PASS on all 4 pages (all 0, stamps reproduced)
Tier check: skill PASS · baseline PASS (informational)
Judge:      skill (2 of 2 judges) · baseline 74 / 70 raw (judge-1 also called a contrast hard gate → 0) · skill 90 / 84 (mean 87.0)
Failures:   see below
Notes:      see below

## Gate stamps (all four pages)

Run by the orchestrating agent after each arm finished, `skills/asfakulsiam-motomation-design/scripts/gate.mjs` (gate/4).

baseline (served from a static server rooted at `work/baseline/`; see Failures for why):
- `/`: `FAIL  stamp → critique: C?[no-record] H5[375:0] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:7/7,tgt:0f5w,zoom:0,reflow:0,fc:0,trap:0] · gate: c36 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S2 P1 K3 · gate/4 · 141719bea0 · skipped 1/21@375`
- `/features/`: `FAIL  stamp → critique: C?[no-record] H5[375:0] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:8/8,tgt:0f5w,zoom:0,reflow:0,fc:0,trap:0] · gate: c32 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S2 P1 K3 · gate/4 · bc6eb2b0b1 · skipped 1/27@375`
- `/pricing/`: `FAIL  stamp → critique: C?[no-record] H5[375:0] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:10/10,tgt:0f7w,zoom:0,reflow:0,fc:0,trap:0] · gate: c32 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S2 P1 K3 · gate/4 · defd194860 · skipped 1/35@375`
- `/start/`: `FAIL  stamp → critique: C?[no-record] H5[375:0] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:10/10,tgt:0f5w,zoom:0,reflow:0,fc:0,trap:0] · gate: c32 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S2 P1 K3 · gate/4 · d6f4ee1fe4 · skipped 1/29@375`

skill (each `.html` file passed directly):
- `index.html`: `PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:7/7,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 557be0b795 · skipped 1/24@375`
- `features.html`: `PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:8/8,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 67a4cc11f1 · skipped 1/30@375`
- `pricing.html`: `PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:8/8,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · f4aa3d6ded · skipped 1/39@375`
- `start.html`: `PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:3,anim:3] M5[t3:pins0/2,webgl0/1,js49/140KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:10/10,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · 0eff3f7381 · skipped 1/36@375`

The re-run reproduced the skill arm's own four stamp hashes. (The arm's own stamps showed `S5[last5:no-log]`; the re-run shows `S5[last5:none]` because the arm wrote its memory log after gating. The hashes match.) Full output: [baseline/gate.txt](baseline/gate.txt), [skill/gate.txt](skill/gate.txt).

## Tier check

Tier 3 means cross-document View Transitions for page changes plus Lottie or Rive for one or two animated elements; no WebGL, Three.js or shaders, and not just scroll animations between static pages. Measured in headless Chromium (Playwright) with `work/tier-check.mjs` (on the evals branch): every page at rest, forward clicks 1→2→3→4, browser Back 4→3→2→1 with a capture ~220 ms into each transition, mobile 375, then `reducedMotion: "reduce"`.

| Check | skill | baseline |
|---|---|---|
| View Transitions | `@view-transition { navigation: auto }` on all 4 pages | `@view-transition { navigation: auto }` + `<meta name="view-transition">` on all 4 |
| Shared elements (computed `view-transition-name`) | `slip`, `line-1`…`line-4` (one more per step), `here` (route marker), `top`, `foot` | `tally-card`, `card-balance`, `card-content`, `tour-copy`, `steps`, `progress-fill`, `brand`, `nav-back`, `nav-next` |
| Page-to-page navigation transitions | yes: mid-transition captures show the slip in flight between its positions (right → left → right → centre) and the new line feeding out | yes: the card travels between left and right positions, copy slides, progress bar grows |
| Back reverses | yes: `navigation.activation` sets `data-dir="back"` before first frame; mirrored captures (attribute is removed again once the transition finishes) | yes: `data-dir="back"` set on all three Back steps |
| Focus after transition | `H1#title` on all 6 in-tour navigations; "Step n of 4" in text | `H1#tour-title` on all 6; "Step n of 4" label (text-transformed uppercase) |
| Lottie / Rive | lottie-web light loaded on all 4 pages, one animation each (balance, add-expense, plan-toggle, check); inline SVG final-frame poster until it loads | lottie-web light on all 4, one animation each; SVG final-frame poster until it loads |
| Reduced motion | every shared name dropped to `root` only (150 ms cross-fade); every Lottie paused on its last frame (71/72, 77/78, 59/60, 65/66); 0 hidden text | shared names dropped to `root` only; Lottie paused on last frame on 3 pages, frame 0/31 on Pricing (the toggle's "Monthly" resting state); 0 hidden text |
| `<canvas>` / WebGL / Three.js / shaders | 0 / 0 / no / none (gate: `webgl0/1`) | 0 / 0 / no / none |
| Scroll-triggered reveals | none (pages are one screen) | none |
| Console errors / failed requests | 0 | 0 |

Result: PASS. "Tier 3 named; four real URLs joined by cross-document View Transitions with a shared slip that travels and gains one line per step, Back mirrored, one Lottie per page, reduced motion cross-fades and shows final frames, no WebGL: pass." The skill built at Tier 3: not Tier 4+ (no canvas, WebGL, Three.js or shaders) and not a Tier 2 fallback (no scroll choreography; the motion is the page change). The baseline was told the tier too and also built at Tier 3. Not tested by either arm or by me: a browser without View Transitions support.

## Judges

Blind, against `evals/rubric.md` with the v5 imagery exception applied. Labels A = skill, B = baseline (random.seed(93015)). Every HTML comment and CSS/JS block comment was stripped from both arms, and the word "motomation" was removed, which removed the skill's stamp and log references. Vendor libraries, fonts, Lottie JSON, build tools and QA folders were omitted.

| Judge | Model | Evidence | Baseline | Skill | Winner |
|---|---|---|---|---|---|
| judge-1 | gpt_6_luna (OpenAI family) | source only | 74 raw (0 after its hard-gate call) | 90 | skill |
| judge-2 | default delegated-agent model (id not exposed) | source + 18 screenshots per site (4 pages at 1440, 4 full pages at 375, 6 mid-transition captures, 4 reduced-motion pages) | 70 | 84 | skill |

The judges disagreed on the baseline hard gate. judge-1 counted the baseline's muted text (`#6f756f` on `#f5f2ea`, about 4.2:1; the gate measured 4.22:1 on "Step 1 of 4", the step links and the 15 px "On the web and Android." line) as body text under 4.5:1, which zeroes that run under the rubric. judge-2 read the same lines as secondary labels and did not apply the gate, but said that if the "On the web and Android." line counts as body text, the baseline scores 0. Both raw totals are kept in [judge.json](judge.json). Either way the skill wins.

Per-axis: both judges scored the skill higher on Originality (4 vs 3) and Access & performance; judge-2 also on Concept and Typography; judge-1 on Motion. Neither judge found a hard gate in the skill build.

## Failures (kept)

- Baseline gate FAIL on every page:
  - contrast c32–c36: `#6f756f` on `#f5f2ea` = 4.22:1 on step labels and step links, and 2.54:1 on the inactive step numerals (`span.n`). Measured at 375, 390, 768 and 1440.
  - SEO S2: no canonical, no og:image (seo-04, seo-18).
  - performance P1: render-blocking `assets/tour-head.js` in `<head>` (perf-12). It is the script that sets the transition direction before first paint, so the baseline made it blocking on purpose.
  - security K3: no CSP, nosniff or Referrer-Policy.
  The baseline was never asked about any of these (it had no gate, by design).
- Gate measurement artefact (fixed, kept for the record): passed as a single file (`gate.mjs work/baseline/features/index.html`), the gate serves that file's own folder as the root, so the baseline's `../assets/tour.css` 404ed and pages 2–4 were scanned unstyled (17 px tap targets, 48 px reflow). Those numbers measured a broken serve, not the site. The baseline was re-gated as URLs from a static server rooted at `work/baseline/`, and that run is `baseline/gate.txt`. The file-mode run is kept on the evals branch as `work/baseline-gate-filemode.txt`. The skill used flat `features.html` files, so file mode was correct for it. This is a gate limitation for multi-folder static sites, not something either arm did.
- Skill: in the forward 1→2 mid-transition capture, the `line-1` group ("Mitu owes Sabbir ৳ 640") travels on its own path and briefly separates from the slip, overlapping the heading for a few frames. judge-2 noted it. The rest of the slip stays together.
- Skill: Start shows two near-equal buttons (Google Play filled, browser outlined). The brief asks for "one obvious action", and judge-2 flagged it. The baseline chose one main button by platform.
- Baseline: the ← → glyphs in its keyboard hint render as near-empty boxes (judge-2), and the yearly Plus price shows only after toggling.
- Both arms authored their own four stand-in Lottie files (the client's files arrive later). The brief allows this.
- Not measured: a browser without View Transitions (Firefox / older Safari), real phones, a screen reader, Lighthouse, motion easing (no video recording; motion was judged from mid-transition stills and CSS).

## Notes

- Do the two builds look visibly different, or the same? Visibly different: the baseline is a familiar SaaS look (rounded white card, Bricolage Grotesque + Inter, green pill buttons, a growing progress bar), while the skill build is a paper "receipt slip" in Young Serif + JetBrains Mono with stamp blue, a perforated edge, and one new numbered line printed onto it per step.
- Skill added content the brief did not define: yes, the same pattern as Tiers 1 and 2. It assumed a domain (`https://tally.example.com/`) and used it for canonical tags, `og:url`, `og.png`, `sitemap.xml`, `robots.txt`, `llms.txt` and JSON-LD (`SoftwareApplication`). It also added a `_headers` file (CSP, nosniff, Referrer-Policy), a footer line ("a small team in Dhaka"), and slip lines ("Expense added in two taps · done", "Free, or Plus · ৳ 149/mo", "Ready on web and Android ✓"). Most of these exist to satisfy its own SEO and security rules (seo-04, seo-18, sec-h1–h3). No invented statistics, logos or testimonials. The Play, browser and mailto links match the brief exactly. The baseline also wrote its own headings and captions (normal copywriting) but added no undefined pages, domains or metadata.
- The skill arm runs the gate; the baseline does not. Part of the gate difference comes from this asymmetry. Here most of the baseline's gate failures are rules it was never shown (canonical, og:image, CSP), plus one real one: muted text under AA, which one judge treated as a hard gate.
- Unlike Tier 2, both judges gave a clear margin (+16 and +14), and the screenshot-based judge did not narrow it. At Tier 3 the skill's lead shows in the visible design (concept and originality), not only in the source.
- How the arms were run: the local `claude` CLI is still not logged in ("Not logged in · Please run /login"), so `run-agent-benchmark.mjs generate` could not drive the arms. Its `--dry-run` listed exactly two runs (baseline, skill, s9301). Each arm was a fresh delegated agent of this session, same default model, run in parallel. Baseline prompt: "You are an expert web designer. Build the site described in <brief>. Check your work." plus benchmark conditions (write only to work/baseline/, four real URLs, don't open the repo or any skill, Tier 3 stated, "you choose" on stack, imagery out of scope). Skill prompt: use the skill end to end from SKILL.md, Step 0, the full Thinking Sequence, collide --seed 9301, --tier=3, DESIGN.md + MOTION.md, Delivery Gate to PASS on all four pages. Both prompts are in `work/prompt-*.txt` on the evals branch. The agents shared one sandbox; the baseline was told not to open the repo, which was not technically enforced.
- Skill choices (from DESIGN.md): archetype Atlas mutated by remove-expected (no nav bar, no hero picture: the route is the nav, the slip is the picture); collision receipt printer, seed 9301 ("paper feeding line by line"); signature "the slip carries forward"; dials ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 3 forced; Young Serif + Instrument Sans + JetBrains Mono, Hind Siliguri for ৳.
- judge-2 may be the same model family as the builders; judge-1 is a different family (OpenAI).
- Transcripts are the prompts and each agent's final report, not turn-by-turn logs (delegated agents don't expose them).
- Heavy artifacts (built sites, screenshots, prompts, transcripts, tier-check script and output, raw judge files, file-mode baseline gate run) are on the `evals` branch under evals/results/benchmark-v5/tier-3-product-tour/.
