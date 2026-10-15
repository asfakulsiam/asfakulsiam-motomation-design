# Tier 3 · transcripts (final reports of each delegated agent)

Prompts: `prompt-baseline.txt`, `prompt-skill.txt`, `prompt-judge-2.txt`. Delegated agents don't expose turn-by-turn logs; these are their final reports, verbatim in substance.

## Baseline arm (tier_3_baseline_build)

Stack: plain static HTML, CSS and vanilla JS, with cross-document View Transitions and a local copy of lottie-web (svg "light" build, 5.12.2). Chosen because native page transitions need four real HTML pages rather than a framework router, and it opens from the folder with no build.

- Shared across pages: the white product card, the "Mitu owes Sabbir ৳ 640" chip, the step bar, the logo and the Back/Next buttons. The card changes position and size per page; the green progress bar grows.
- Direction: text and card contents slide forward and reverse on Back (Back button, browser back, step links or ← key).
- No View Transitions: instant page change. Reduced motion: short cross-fade, final animation frames.
- Focus moves to the page heading, linked to the "Step N of 4" label.
- Four stand-in Lottie files (balance bar, expense added, plan toggle, check mark), static final-frame SVG until loaded; animations play after the transition ends.
- Pricing: Monthly/Yearly switch drives the toggle animation and Plus price; Start repeats the chosen price.
- Start: one main button, "Use it in your browser" (Android visitors get "Get it on Google Play"); other link and iOS waitlist email as text links.
- Content written: page headings ("Three things, so nobody keeps score.", "Two plans. Start on Free.", "Start splitting."), labels and card captions. Fonts: Bricolage Grotesque, Inter, Noto Sans Bengali from Google Fonts.
- Checked in headless Chromium 130: all URLs load with no errors, no sideways scroll at 1366/390, mid-transition screenshots, direction and focus, Yearly toggle, reduced motion. Fixed: heavy heading focus outline (now underline), card below content on mobile.
- Not tested: a browser without View Transitions; no re-screenshot after a last CSS change centring the animation on narrow screens.
- Files: index.html, features/index.html, pricing/index.html, start/index.html, assets/tour.css, assets/tour-head.js, assets/tour.js, anim/*.json, anim/*-final.svg, vendor/lottie_light.min.js (+ licence), tools/make-standins.mjs, tools/make-pages.mjs.

## Skill arm (tier_3_skill_build)

```
MOTOMATION PLAN
Stack       : plain HTML/CSS/JS ("you choose") → adapters/vanilla.md
Tension     : four separate URLs to share and reload ↔ one balance card that should feel like it moves forward
Concept     : The tour is one Tally slip that prints a new line at every step and carries itself to the next page; Back rolls the last line back in.
Archetype   : Atlas (a four-station route across the top) mutated by remove-expected (no nav bar, no hero picture: the route is the nav, the slip is the picture)
Collision   : receipt printer (seed 9301) → paper feeding line by line: one numbered line per step, perforated tear edge
Signature   : slip-carry: the slip is a shared View Transition element on all four pages; it travels right → left → right → centre, earlier lines ride along, the new line feeds out; Back reverses it
Dials       : ENERGY 1 · RHYTHM 2 · MOTION 2 → Tier 3 (forced --tier=3)
Type mode   : SERVICE STYLE, one large h1 per step
Type        : Young Serif / Instrument Sans / JetBrains Mono, with Hind Siliguri for ৳
Palette     : #ECE8DF ground, #FBFAF5 paper, #171613 ink, #59554C muted, #2B3CB0 stamp blue
Not doing   : a SaaS landing page split into four tabs; Hold to Commit on Start
```

Stack: plain HTML/CSS/JS: page-to-page View Transitions work natively across plain HTML pages, so four real, reloadable URLs need no router or build step and open from a static folder.

Tier 3 — Pro. View Transitions carry the slip, each slip line, the route marker, header and footer; Back/Forward detected from `navigation.activation` and mirrored. Four authored stand-in Lottie files (320×120, play once) with inline SVG final-frame posters. Reduced motion: 150 ms cross-fade, final frames. No VT: instant change. Focus to the new page's h1; "Step n of 4" with aria-current="step".

All four pages PASS the Delivery Gate, verified with `--verify`. First run of index.html failed (forced colours, k2) and was fixed.

Content/links not defined by the brief: domain `https://tally.example.com/` (canonical, og:url, og.png, sitemap.xml, robots.txt, llms.txt); slip lines ("Expense added in two taps · done", "Free, or Plus · ৳ 149/mo", "Ready on web and Android ✓", "M"/"S" dot labels); headlines and kickers ("Three things it does for the whole group", "Free for up to 2 groups, or ৳ 149 a month for unlimited", "Start your first group"; "What it is / What it does / What it costs"); pager labels; "On the web and Android."; footer "a small team in Dhaka"; start-page price recap; JSON-LD with BDT offers; og.png; a receipt logo. Play, browser and mailto links match the brief exactly.

Handoff:
```
Chose     : Atlas + remove-expected, slip-carry, Young Serif/Instrument Sans/JetBrains Mono, receipt paper + stamp blue, Tier 3
Rejected  : a four-tab SaaS landing page; Tier 2 scroll choreography; Hold to Commit on Start
Needs     : [NEEDS ASSET] the client's four Lottie/Rive files (same file names, 320×120); [NEEDS COPY] the real domain; owner to do: Search Console, Lighthouse, a host that serves _headers (nosniff)
Measured  : four PASS stamps, all verified
Try next  : /critique Pricing at 375px, where the slip sits below the two plans
```

## Judge 2 (tier_3_blind_judge_2)

Result in `judge-2.json`. A (skill) 84, B (baseline) 70, winner A, no hard gates. Judgement call: did not count B's ~4.2:1 secondary text as a body-text hard gate; if "On the web and Android." counts as body text, B scores 0. Motion judged from mid-transition stills and CSS (no recordings).
