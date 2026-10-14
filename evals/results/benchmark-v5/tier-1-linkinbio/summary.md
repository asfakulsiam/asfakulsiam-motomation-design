# Benchmark v5 · Tier 1 · summary

Brief:      tier-1-linkinbio (link-in-bio photographer)
Tier:       1 — Basic
Stack used: baseline: plain HTML + CSS, one file, system fonts, no JavaScript · skill: plain HTML + CSS, one file (adapters/vanilla.md), one 3.3 KB Martian Mono subset, no executable JavaScript. Both chose it for the same reason: four links, under 1 s on 3G, no JS needed to show or use the links.
Gate:       baseline FAIL (rules S3 K3; every visual check 0) · skill PASS (rules all 0, stamp verified)
Tier check: baseline n/a · skill PASS
Judge:      skill (2 of 2 judges) · baseline 79 / 72 (mean 75.5) · skill 91 / 84 (mean 87.5)
Failures:   see below
Notes:      see below

## Gate stamps

- baseline: `FAIL  stamp → critique: C?[no-record] H5[375:0] S?[no-archetype-in-stamp] R?[no-record] M?[no-tier] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:5/5,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S3 P0 K3 · gate/4 · 8a89a110a7 · skipped 1/14@375`
- skill: `PASS  stamp → critique: C5[restraint:kept] H5[375:0] S5[last5:none] R5[cuts:3,anim:3] M5[t1:pins0/2,webgl0/1,js2/30KB,rm0] V5[entrance-repeats:0] Q5[prog:n/a,smooth:n/a,rm:n/a] A5[focus:5/5,tgt:0f0w,zoom:0,reflow:0,fc:0,trap:0] · gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · c430ba2f26 · skipped 1/17@375`

Full output: [baseline/gate.txt](baseline/gate.txt), [skill/gate.txt](skill/gate.txt). Both from
`node skills/asfakulsiam-motomation-design/scripts/gate.mjs work/<arm>/index.html` (gate/4, skill v2.6.0).

## Tier check (skill build)

Tier 1 means CSS-only motion, no scroll-driven choreography, no pinned sections, no WebGL. In `work/skill/index.html`:

| Check | Found |
|---|---|
| JavaScript animation library / executable script | none: the only `<script>` is `type="application/ld+json"` (data) |
| `@keyframes`, `animation`, `animation-timeline`, `scroll-timeline`, `view-timeline` | 0 |
| IntersectionObserver, requestAnimationFrame, scroll listeners | 0 |
| `position: sticky` / pinned sections | 0 |
| `<canvas>` / WebGL | 0 (the one "webgl" string is the stamp text `webgl0/1`) |
| Motion present | 4 CSS `transition` declarations driving hover, focus-visible, press (clip-path "print-head" wipe, 200 ms), with a `prefers-reduced-motion` path |

Result: PASS. The skill built at Tier 1, as named.

## Judges

Blind, against `evals/rubric.md`; labels A = baseline, B = skill (random.seed(91014)); the skill's stamp comment was
removed from the copy the judges saw. Image placeholders were declared allowed (brief: imagery out of scope).

| Judge | Model | Evidence | Baseline | Skill | Winner |
|---|---|---|---|---|---|
| judge-1 | gpt_6_luna (OpenAI family) | source only | 79 | 91 | skill |
| judge-2 | default delegated-agent model (id not exposed) | source + 8 screenshots | 72 | 84 | skill |

Neither judge found a hard-gate failure in either build. Scores per axis and reasons: [judge.json](judge.json).

## Failures (kept)

- Baseline gate FAIL on six rules the baseline was never asked about (it had no gate, by design): seo-04 no canonical,
  seo-11 0 internal links (≥ 3), seo-18 no og:image, sec-h1 no CSP, sec-h2 no nosniff, sec-h3 no Referrer-Policy.
  Every visual check (contrast, overflow, motion, reduced motion, accessibility) passed.
- Skill: changed three of the brief's absolute URLs to same-site paths (`/work`, `/prints`, `/workshops`) so the
  gate's seo-11 internal-link rule passes. They resolve to the brief's URLs only if the page is served at the root of
  rumana-akter.example.com; on a link-in-bio host they break. The skill flagged it as an assumption in DESIGN.md;
  judge-2 deducted for it. This is the gate's SEO rule pulling against the brief.
- Baseline preloads `portrait.jpg`, which doesn't exist yet: one 404 in the console until the client supplies it.
- Neither arm measured the "under 1 second on 3G" constraint (no Lighthouse Slow 3G run). Size only: baseline 8.3 KB
  HTML (2.9 KB gzip), no other requests; skill 12.2 KB HTML (3.8 KB gzip) + 3.3 KB font + placeholder images.

## Notes

- The skill's advantage at Tier 1 is entirely on gate rules (SEO, security), not on visual design. Both builds look
  alike. This is expected at Tier 1 — a link-in-bio has little design space.
- How the arms were run: the local `claude` CLI returned an API error (not authenticated here), so
  `run-agent-benchmark.mjs` could not drive the arms. Each arm was a fresh delegated agent of this session, same
  default model for both (model id not exposed). Baseline prompt: "You are an expert web designer. Build the site
  described in <brief>. Check your work." plus benchmark conditions (write only to work/baseline/, don't open the repo or
  any skill, the client answered "you choose" on stack, Tier 1 stated). Skill prompt: use the skill end to end, Step 0,
  the full Thinking Sequence, collide --seed 9101, Tier 1 forced, DESIGN.md, run the gate. The agents shared one
  sandbox; the baseline was told not to open the repo, which was not technically enforced.
- Asymmetry by design: only the skill arm ran the gate before finishing, so the gate comparison partly measures
  "was told to run the gate".
- The two builds are visibly related: both are numbered rows 01–04 with a note under each, and both wrote the same
  Portfolio note ("Ship-breaking yards, Fishery Ghat, the hill tracts"). Same model, same brief.
- The skill's seeded draw gave the Timeline archetype; it rejected it (no dates in the brief) and used Ledger mutated by
  "single object" (one torn print slip). Concept: "the page is one printed tally slip"; collision: receipt printer.
- judge-2 saw only index.html, so it read the skill build's font and image preloads as missing files; in the real build
  they are present.
- judge-2 may be the same model family as the builders; judge-1 is a different family (OpenAI).
- Transcripts are the prompts and each agent's final report, not turn-by-turn logs (the delegated agents don't expose
  them).
- Heavy artifacts (built sites, screenshots, transcript) are on the `evals` branch under
  evals/results/benchmark-v5/tier-1-linkinbio/.
