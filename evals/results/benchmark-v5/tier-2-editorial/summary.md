# Benchmark v5 · Tier 2 · summary

Brief:      tier-2-editorial (Jol · Issue 07, "The Last Boatbuilders of Sadarghat", editorial magazine issue)
Tier:       2 — Intermediate (GSAP + ScrollTrigger + Lenis; section entrances and scroll choreography)
Model:      same default delegated-agent model for both arms (model id not exposed); one seed: 9201
Stack used: baseline: plain HTML + CSS + JS, no build, GSAP 3.13.0 + ScrollTrigger + Lenis 1.3.11 vendored; "it's one long article page, it needs no build to open, and the client's developer already uses GSAP, ScrollTrigger and Lenis." · skill: plain HTML/CSS/JS (adapters/vanilla.md), GSAP 3.13.0 + ScrollTrigger + SplitText + Lenis 1.3.11 self-hosted; "one article page with no routes or data, and the client's developer already adds GSAP, ScrollTrigger and Lenis by hand, so a static page with self-hosted files can go on any host."
Gate:       baseline FAIL (c1 o7 k5; rules C2 S5 K3) · skill PASS (all 0, stamp verified)
Tier check: skill PASS · baseline PASS (informational)
Judge:      skill (2 of 2 judges) · baseline 84 / 79 (mean 81.5) · skill 94 / 80 (mean 87.0)
Failures:   see below
Notes:      see below

## Gate stamps

- baseline: `FAIL  stamp → critique: C?[no-record] H4[375:1] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A4[focus:19/19,tgt:5f1w,zoom:0,reflow:0,fc:0,trap:0] · gate: c1 o7 w0 rm0 a0 n0 q0 k5 · rules: C2 S5 P0 K3 · gate/4 · 99efaf7775 · skipped 9/177@375`
- skill: `PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:3,anim:4] M5[t2:pins0/2,webgl0/1,js58/80KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:24/24,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · a6424d4669 · skipped 3/156@375`

Full output: [baseline/gate.txt](baseline/gate.txt), [skill/gate.txt](skill/gate.txt). Both from
`node skills/asfakulsiam-motomation-design/scripts/gate.mjs work/<arm>/` (gate/4, skill v2.6.0), run by the
orchestrating agent after each arm finished. The skill gate re-run reproduced the arm's own stamp (same hash a6424d4669).

## Tier check

Tier 2 means GSAP + ScrollTrigger + Lenis, section entrances, scroll choreography; no View Transitions, Lottie/Rive,
WebGL or pinned film sequences. Measured in headless Chromium (Playwright) at 375×812, script `work/tier-check.mjs`
(on the evals branch), after scrolling the whole page:

| Check | skill | baseline |
|---|---|---|
| GSAP loaded | yes, `gsap.version` 3.13.0, ScrollTrigger + SplitText + Lenis present | yes, 3.13.0, ScrollTrigger + Lenis |
| ScrollTriggers (motion on) | 30, across all 7 sections (keel, by-eye, teak-and-tar, the-steel-yards, monsoon, apprentices, launch) + opener + sign-off | 29, across cover, 6 of 7 section ids, notes, author note, next issue; 10 scrubbed (the Monsoon river rise, image drift) |
| Sections with scroll-triggered entrances (≥ 3) | 7 | ≥ 6 |
| Pinned triggers | 0 | 0 |
| `<canvas>` / WebGL | 0 / 0 | 0 / 0 |
| View Transitions, Lottie, Rive (source, word-bounded, vendor excluded) | none | none |
| Reduced motion: content elements fully visible (h1, h2, p, blockquote, figure, figcaption) | 100 / 100 | 101 / 101 |
| Reduced motion: Lenis | not instantiated (only inside the no-preference `gsap.matchMedia` branch); 7 non-animating triggers remain to highlight the current draft mark | not instantiated; 1 trigger left (reading bar) |
| Gate motion check | `rm0`, 0 hidden only under reduced motion; `M5[t2:pins0/2,webgl0/1,js58/80KB,rm0]` | `rm0`, 0 hidden only under reduced motion |

Result: PASS. "Tier 2 named; GSAP + ScrollTrigger + Lenis, entrances on all seven sections, line-fed pull quotes, 0 pins,
0 WebGL, complete reduced-motion page: pass." The skill built at Tier 2, as named. The baseline was told the tier too and
also stayed at Tier 2.

## Judges

Blind, against `evals/rubric.md` with the v5 imagery exception applied. Labels A = skill, B = baseline
(random.seed(92015)). Every HTML comment and CSS/JS block comment was stripped from both arms, which removed the skill's
stamp and its archetype/signature/tier comments. Vendor libraries were omitted.

| Judge | Model | Evidence | Baseline | Skill | Winner |
|---|---|---|---|---|---|
| judge-1 | gpt_6_luna (OpenAI family) | source only | 84 | 94 | skill |
| judge-2 | default delegated-agent model (id not exposed) | source + 10 screenshots (wheel-scroll frame strips at 1440 and 375, reduced-motion full page) | 79 | 80 | skill |

Neither judge found a hard-gate failure in either build. judge-2's margin is one point: it scored the baseline higher
on Typography (5 vs 4) and the skill higher on Originality (4 vs 3). Scores per axis and reasons: [judge.json](judge.json).

## Failures (kept)

- Baseline gate FAIL:
  - contrast c1: at 375 px only, `1.42:1 #eae4d6 on #f0b48f` on the Monsoon section's first paragraph. `#f0b48f` is the
    colour of that paragraph's peach drop cap (`styles.css:341`), so this is probably the gate sampling the drop cap as
    background rather than a real failure on the dark green. Not investigated further; kept as measured.
  - overflow o7: the seven section numerals (`p.mv-num`) overflow their parent by 8 px at 1440.
  - targets k5: five footnote markers at 18×16 px (< 24 px) on touch.
  - copy C2: em dashes in visible copy (copy-04) and one "it's not X, it's Y" aphorism (copy-09).
  - SEO S5: no canonical, title 70 chars, description 187 chars, 0 internal links, no og:image.
  - security K3: no CSP, nosniff or Referrer-Policy.
  The baseline was never asked about any of these (it had no gate, by design).
- Skill: added four same-site links the brief doesn't define (`/`, `/issues/`, `/about/`, `/issues/08-char-life/`)
  so the gate's seo-11 internal-link rule passes. They break unless those pages exist on jol.example.com. Same pattern
  as Tier 1: the gate's SEO rule pulls against the brief. The skill flagged it in its handoff.
- Both arms wrote body text that judge-1 said goes beyond the brief's supplied facts (observational and reported
  detail). The brief allows the agent to write the body text from the facts; neither arm invented statistics or quotes
  (only the two given pull quotes appear; the skill's DESIGN.md lists every figure it used).
- Baseline: one console 404 during the tier check (most likely `/favicon.ico`, no icon declared; not confirmed).
- My first 1440 capture used `window.scrollTo`, and with Lenis running that showed overlapping text in the skill
  build. A wheel-driven re-capture of the same spot was clean, and 0 overlapping paragraphs were measured in both
  motion modes. Those frames were discarded; the judges saw only wheel-driven frames for both arms.
- Not measured: Lighthouse, real-phone reading, screen reader, the 18-minute reading time.

## Notes

- Do the two builds look visibly different, or the same? Visibly different: the baseline is a deep river-green cover
  with large rust section numerals and drop caps (a polished long-read), while the skill build is a light silt
  broadsheet with mono metadata, a fixed "draft marks" scale in the margin that fills as you read and a large জল sign-off.
  Both independently made 05 Monsoon the one dark section.
- The skill arm runs the gate; the baseline does not. Part of the gate difference comes from this asymmetry.
- Unlike Tier 1, the skill's lead here is not only on gate rules: judge-1 put it ahead on Originality, Typography and
  Access, and judge-2 on Originality. judge-2's one-point margin is close to a tie, and judge-2 preferred the
  baseline's typography.
- How the arms were run: the local `claude` CLI is still not logged in ("Not logged in · Please run /login"), so
  `run-agent-benchmark.mjs generate` could not drive the arms. Its `--dry-run` listed exactly two runs (baseline,
  skill, s9201). Each arm was a fresh delegated agent of this session, same default model, run in parallel. Baseline
  prompt: "You are an expert web designer. Build the site described in <brief>. Check your work." plus benchmark
  conditions (write only to work/baseline/, don't open the repo or any skill, Tier 2 stated, "you choose" on stack,
  imagery out of scope). Skill prompt: use the skill end to end from SKILL.md, Step 0, the full Thinking Sequence,
  collide --seed 9201, --tier=2, DESIGN.md + MOTION.md, Delivery Gate to PASS. Both prompts are in
  `work/prompt-*.txt` on the evals branch. The agents shared one sandbox; the baseline was told not to open the repo,
  which was not technically enforced.
- Skill choices (from DESIGN.md): archetype Broadsheet mutated by "swap the material" (rules become waterlines);
  collision receipt printer ("paper feeding line by line": standfirst and pull quotes feed out a line at a time, body
  text never moves); signature Draft Marks; Newsreader + IBM Plex Mono + Tiro Bangla (জল only).
- judge-2 may be the same model family as the builders; judge-1 is a different family (OpenAI).
- Transcripts are the prompts and each agent's final report, not turn-by-turn logs (delegated agents don't expose
  them).
- Heavy artifacts (built sites, screenshots, prompts, transcript, tier-check script, raw judge files) are on the
  `evals` branch under evals/results/benchmark-v5/tier-2-editorial/.
