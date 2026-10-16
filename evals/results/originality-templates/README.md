# Originality calibration: the shipped templates

Measured by `skills/asfakulsiam-motomation-design/scripts/originality.mjs` (axis O of `gates/delivery-gate.md`) in Chromium 147 at 1440×900. Not a benchmark run: no agent, no generation; the inputs are the pages already in `examples/templates/`.

- `two-builds.txt` / `.json`: two unrelated briefs, the climate nonprofit (`org.html`) and the product-launch film (`product-launch/index.html`). Every axis below 0.4: PASS.
- `ten-templates.txt` / `.json`: all ten templates, 45 pairs. 12 pairs are below 0.4 on every axis; 33 repeat on at least one axis (interaction 29, typography 7, image 5, signature 5, composition 2). Most repeats are on **interaction**: the eight section-library templates have no `:hover` rules and share the same IntersectionObserver + scroll listener + pointer listener stack, so their interaction patterns score 0.54–0.90 against each other. The two Tier 5 film templates (`launch`, `motionpf`) do not share that stack and score 0.10–0.33 against the rest.
- A page compared with itself scores 1.00 on every axis (sanity check).

Re-run: `node scripts/originality.mjs examples/templates/hotel.html examples/templates/event.html … --labels …` from the skill folder.

## Revision (Task 5, diversity arm)

The diversity arm (`evals/results/diversity/REPORT.md`) found two measurement bugs in `originality.mjs`, both fixed, and these files were re-measured:

1. Inline `<svg>` roots were dropped from the image and composition axes (`e.closest("svg")` matches the element itself), so a page whose only imagery is inline SVG read as "no imagery". Painted `role="img"` boxes are now counted too.
2. Content blocks had to be half the viewport wide, so a narrow single-column page had zero blocks. They now have to be half the width of `<main>`.

Effect here: two builds, overall 0.19 → 0.14 (image 0.33 → 0.07, composition 0.14 → 0.11), still PASS; ten templates, 11 → 12 pairs below 0.4 on every axis.

## After Fixes 4, 5 and 8 (re-measured 2026-10-16)

Same ten templates, same command, with the redefined axes (interaction = feedback, forms, navigation; image n/a when both pages have none; typography grades families). Result in `ten-templates-after-fixes.json`.

| | Before | After |
|---|---|---|
| Pairs below 0.4 on every axis | 12/45 | 4/45 |
| interaction repeats | 29 | 35 |
| typography repeats | 7 | 10 |
| image repeats | 5 | 2 (3 pairs n/a) |
| composition / signature / structure | 2 / 5 / 0 | 2 / 5 / 0 |

The stricter axes find more sameness among the shipped templates, not less: they share one navigation and feedback pattern, and several share type classes. The templates were not changed in this session.

## Redesign of the ten templates (2026-10-16)

`node scripts/originality.mjs --dir examples/templates/` (from the skill folder; `--dir` is new and only selects the targets: every `*.html` in the folder plus each subfolder's `index.html`). No axis, weight or threshold changed.

| | Before (`before-redesign.md`) | After (`after-redesign.txt`, `after-redesign.json`) |
|---|---|---|
| Pairs below 0.4 on every axis | 4/45 | 45/45 |
| interaction repeats | 35 | 0 (max 0.36) |
| typography repeats | 10 | 0 (max 0.39) |
| signature repeats | 5 | 0 (max 0.38) |
| image repeats | 2 | 0 (max 0.24) |
| composition repeats | 2 | 0 (max 0.38) |
| structure repeats | 0 | 0 (max 0.32) |

### What was shared, and why

Three things made every section-built template alike, whatever its brief:

- **No interaction design of their own.** The only feedback rules were the build's one `:focus-visible` outline and the skip link, and the only navigation was the gallery's kit strip, so feedback and navigation were identical (1.00) between any two of the eight. `BASE` in `scripts/build-templates.mjs` now holds reset and layout only; each `page.tsx` sets its own focus, hover and press styles (the build fails a page with no `:focus-visible` rule) and its own navigation.
- **One type voice.** `h()`, `label` and `body` in `sections/_shared.tsx` fixed heading line-height 1, tracking -0.02em, weight 400, labels as 12px mono capitals, body 1.55. They now read CSS variables (`--display-scale`, `--display-lh`, `--display-track`, `--display-weight`, `--display-case`, `--display-style`, `--label-*`, `--body-size`, `--body-lh`) with the old values as defaults; each template sets its own in its theme.
- **Every display face fell back to `Georgia,serif`**, so a sans display (Bricolage, Anybody) read as a serif. Each family now falls back to its own class.

### Per template (each changed in at least three dimensions; no two share a choice)

| Template | Navigation | Hero / composition | Section order | Grid | Image | Type | Interaction | Signature |
|---|---|---|---|---|---|---|---|---|
| hotel | fixed key-tag side rail (the page's header) | split: name top-left, courtyard developing right (was centred door) | guest book second | rooms: asymmetric arches 1.4fr + 2 (was a pinned sideways reel) | arch-masked rooms; courtyard develops | Cormorant / Cormorant, italic, body 20/1.62 | tracking opens on hover, press dims, dotted ring + underline focus | darkroom-develop (was aperture) |
| event | floating sticky pill | poster in fixed night colours | tickets before lineup | — | typographic only | Anybody / Anybody, caps 800, lh .82, labels .32em | skew + amber on hover, press squashes, focus inverts | width-sprint (was velocity-skew; the name marquee is cut) |
| org | plain top bar + disclosure for the trust's papers | — | watchers before the numbers | — | — | Gloock / Schibsted 18/1.72, bold sentence-case labels | rule under on hover (border), river tint on press, soft ring focus | seismograph-line |
| personal | none: a letter; sign-off links (write back, back to top) | — | P.S. before replies | — | inked postmark (multiply, tilted) | Instrument Serif / Instrument Serif 21/1.78, italic labels | red + underline on hover, darker on press, highlighter focus | thread (the replies' timed entrance is cut) |
| saas-landing | fixed app bar + real menu toggle on phones | — | console before bento | — | — | Bricolage 700 / JetBrains Mono 14/1.52 | lift + shadow on hover, press flat, green border + halo focus | ink-fill |
| shop-product | breadcrumb + lot pager (prev/next) | — | reserve right after the making | — | photos desaturated, full colour on hover | Young Serif (was Fraunces) at 1.42 / Familjen 14/1.4 | celadon wash on hover, press inverts, square outline focus | hold-to-commit |
| studio-portfolio | fixed bottom dock + start-a-project dialog | — | people before services | — | drawing cut like a ledger card (notched corner) | JetBrains Mono display (was Young Serif) / Hanken | invert on hover, press lifts and fades, red halo + underline focus | lens |
| editorial-article | sticky chapter rail that marks the chapter being read | — | — | rail + story, two columns | — | Bodoni 600 at 1.18 / Instrument Sans 16/1.6, italic display labels | underline on hover, red on press, yellow marker focus | decode |
| product-launch | radio-preset buttons | — | — | — | — | body leading 1.55 → 1.7, display tracked −0.035em (a service manual's open setting) | presets turn vermilion on hover; a pressed key drops 3 px onto its shadow | aperture |
| motion-portfolio | — | full-bleed: the reel's first shot behind the title | — | credits: three-column contact sheet (was a 3/9 list) | the still is screened onto the ground | — | — | timecode-rail |

Palettes moved too (not an axis): ochre limewash, night, river green-grey, airmail blue, white, celadon grey, ledger white with red rules, newsprint grey.

### Pairs at or above 0.4 on the way, and what changed

| Run | Below 0.4 on every axis | Pair · axis → change |
|---|---|---|
| 1 (page-level nav, feedback, type) | 34/45 | event × hotel, motion-portfolio, personal · signature (all four in the scroll family) → event's signature became width-sprint (type family). launch × shop · typography (both Fraunces) → shop to Young Serif. editorial × shop · interaction (both had a prev/next pager) → editorial's pager removed. org × studio · interaction (both mailto + three links) → org's mailto removed. personal × launch · interaction (same email form) → personal's edition choice moved into the form as radios. motion-portfolio × personal · image and signature → replies' entrance cut, a postmark added. Composition pairs with motion-portfolio → its hook made full-bleed, credits a contact sheet. |
| 2 | 38/45 | three image pairs (all flat, unfiltered) → postmark multiply, studio notch, still screened. shop × launch, shop × studio · typography → shop's heading scale 1.42, body 14/1.4. org × saas · interaction → org back to three links. |
| 3 | 43/45 | hotel × motion-portfolio · composition (both had a scroll-pinned stretch: identical empty screens) → the hotel's pinned reel replaced by a still arch gallery (also restraint: the courtyard develop is the hotel's one motion). editorial × org · interaction → the chapter rail marks the current chapter. |
| 4 | 44/45 | editorial × hotel · interaction → the hotel rail's `aria-current` was static and always said "Door": removed; the rail is the page's header. |
| 5 | 45/45 | — (then the gate fixes below, and launch's specs became three-column tiles) |
| 6 | 44/45 | motion-portfolio × product-launch · composition 0.41 (placement 0.35, columns 0.5, density 0.5: both films' pinned stage reads as three empty screens) → two-column tiles made it 0.42, so the specs went back to their original table and launch's third dimension became typography (leading and tracking) |
| 7 | 45/45 | — (final: `after-redesign.txt`; composition max 0.38) |

### Gate after the redesign (`scripts/gate.mjs`, each page, 2026-10-16)

Every page passes every page-level axis (contrast, overflow, words, motion, names, focus, targets, zoom, reflow, the
critique scores, rules C/S/P) except where marked. The stamp in each page is the line its own gate printed. Every
verdict is FAIL, for two reasons that came before this redesign:

| Template | Page-level failures | Journey (whole folder served as one site) |
|---|---|---|
| hotel | none | nav2 mobile0 forms4 errors3 session0 → FAIL |
| event | none | nav2 mobile3 forms3 errors3 → FAIL |
| org | none | nav2 mobile1 forms3 errors3 → FAIL |
| personal | none | nav2 mobile1 forms3 errors3 → FAIL |
| saas-landing | none | nav2 mobile1 errors3 → FAIL |
| shop-product | none | nav2 mobile4 errors3 → FAIL |
| studio-portfolio | none | nav2 mobile3 errors3 → FAIL |
| editorial-article | none | nav2 mobile3 errors3 → FAIL |
| product-launch | sec-h2 (no nosniff header) | nav2 mobile0 forms3 errors3 → FAIL |
| motion-portfolio | sec-h2 (no nosniff header) | nav2 mobile0 forms3 errors3 → FAIL |

- **Journey (all ten).** The journey check (v2.11) treats the templates folder as one site, which it is not:
  - nav2: the gallery-kit links `../` and `../../gallery/` point outside the folder and return 404.
  - errors3: the folder has no 404 page.
  - forms: personal's and launch's demo forms confirm locally and make no request. Form states are checked by intercepting requests, and these forms send none.
  - mobile: the running-order rows on the event page all link to `#tickets`, unchanged since before the redesign, so after the first tap the page is already there. The carousel's Previous button is `disabled` at the first slide, and the check counts a tap on a disabled control as no response.

  None of these come from the redesign.
- **sec-h2 (the two films).** A film links one level up, so the gate serves the repository root and the folder's `_headers` is not applied. HEAD's own `product-launch/index.html`, run with `gate.mjs --rules` in the same folder, fails sec-h2 the same way. Its old K0 stamp predates the serve-root logic.
- **Fixed during the redesign** (each one caught by the gate):
  - Event: no focus ring on the dock and the copy button, and the prices overflowed their boxes at 375px.
  - Org: the trust's-papers panel overflowed at 375px.
  - Personal: no focus ring on the form controls, and 18px radio buttons.
  - Studio: the dock covered the footer links at 200% zoom, and the dock's Work link pointed at the top of the page.
  - Motion-portfolio: the amber "hold" sat on the still's glow at 1.5:1.
  - All eight: meta descriptions over 160 characters.

## At two viewports (v2.13, measured during the open-items pass)

Task 4C made `scripts/originality.mjs` measure 1440×900 **and** 375×812 by default, each axis scored as the worse of
the two. Run on the ten redesigned templates, that first gave **36/45** (9 pairs crossed at 375: seven on typography,
five of them involving product-launch). Phone `clamp()` minimums had pulled every template's h1/h2/h3 ratios toward
the same middle.

The two films got a phone type scale of their own, mobile only, so the 1440 numbers did not move:

- **product-launch:** the model name at 4.5rem; the stage and spec headings at 1.25rem; step titles as mono caps at 1rem.
- **motion-portfolio:** shot titles at 2.75rem, like title cards; the credits heading at 1.1rem.

Result (`after-two-viewports.txt`, `.json`):

| Viewport | Pairs below 0.4 on every axis | Max per axis (structure · composition · image · typography · interaction · signature) |
|---|---|---|
| 1440×900 | 45/45 | 0.32 · 0.38 · 0.24 · 0.39 · 0.36 · 0.38 |
| 375×812 | 42/45 | 0.39 · 0.38 · 0.28 · 0.40 · 0.40 · 0.50 |
| both (worst of) | **42/45** | as 375 |

The three pairs at or above 0.4, all at 375 only:

| Pair | Axis | Why not fixed |
|---|---|---|
| editorial-article × saas-landing | signature 0.50 (declared 0.5: decode and ink-fill are both text-reveal moves; measured 0.5) | On a phone the tool's pointer path crosses editorial's decoding dateline and replays it, and the hero (98% of the screen) contains that text, so both pages read as "text changes under pointer, screen-size". Changing it means cutting editorial's hover replay or its signature; left as measured. |
| hotel × org | interaction 0.40 (navigation 0.67) | Measured only: the navigation feature sets are 0.67 alike at 375 (0.57 at 1440, where the axis scores 0.36). Not investigated or changed in this pass. |
| motion-portfolio × studio-portfolio | typography 0.40 (families 0.52) | Both set body text in Hanken Grotesk. Every face in `examples/templates/fonts/` is already in use by some template; a new face means adding a font. |

## The three marginal pairs fixed (2026-10-16, remaining-fixes pass, Task 2)

One axis changed per pair, on one page of each pair:

| Pair | Axis | Change | Page changed |
|---|---|---|---|
| editorial-article × saas-landing | signature | Signature move **decode → remembered-list**. The dateline no longer decodes from random glyphs. Instead the chapter rail ticks the chapters you have read on this device (localStorage, this article only), so a long read you put down is picked up at the right chapter. remembered-list is in the micro family, ink-fill in the type family, so the declared score is 0. | editorial-article (`builds/editorial-article/page.tsx`, `sections/hero-editorial-broadsheet.tsx`, DESIGN.md, structure.md, log.json) |
| hotel × org | interaction | The trust's footer (gauge line, address, registration, the "Read" list of papers) moves out of `<main>` into a real `<footer>` landmark. Its papers list becomes footer navigation, a pattern no other template has. The top bar is unchanged. | org (`builds/org/page.tsx`) |
| motion-portfolio × studio-portfolio | typography | Body face **Hanken Grotesk → Bricolage Grotesque**, the page's display face: one family, the way a title sequence's end card sets its credits in the title face. Hanken Grotesk is now used only by studio-portfolio. No new font was added. | motion-portfolio (`index.html`, DESIGN.md, structure.md) |

Command: `node scripts/originality.mjs --dir examples/templates/`. Both viewports (1440×900 and 375×812) are the default. The script has no `--viewports 1440,375` flag; its flag is `--viewport 1440x900,375x812`, which is the default. Files: `after-marginal-fixes.txt` and `.json`.

| Pair | Viewport | Before (worst axis) | After, every axis (structure · composition · image · typography · interaction · signature) |
|---|---|---|---|
| editorial-article × saas-landing | 1440 | signature 0.30 | 0.13 · 0.14 · n/a · 0.12 · 0.22 · **0.05** |
| editorial-article × saas-landing | 375 | **signature 0.50** | 0.13 · 0.13 · n/a · 0.23 · 0.22 · **0.05** |
| hotel × org | 1440 | interaction 0.36 | 0.21 · 0.28 · 0.24 · 0.22 · **0.32** · 0.10 |
| hotel × org | 375 | **interaction 0.40** | 0.11 · 0.27 · 0.28 · 0.25 · **0.36** · 0.05 |
| motion-portfolio × studio-portfolio | 1440 | typography 0.39 | 0.02 · 0.10 · 0.11 · **0.26** · 0.21 · 0.13 |
| motion-portfolio × studio-portfolio | 375 | **typography 0.40** | 0.12 · 0.08 · 0.11 · **0.27** · 0.21 · 0.11 |

| Viewport | Pairs below 0.4 on every axis | Max per axis (structure · composition · image · typography · interaction · signature) |
|---|---|---|
| 1440×900 | 45/45 | 0.32 · 0.38 · 0.24 · 0.38 · 0.32 · 0.38 |
| 375×812 | 45/45 | 0.37 · 0.33 · 0.28 · 0.39 · 0.36 · 0.38 |
| both (worst of) | **45/45** | 0.37 · 0.38 · 0.28 · 0.39 · 0.36 · 0.38 |

The three changed templates were re-gated with `gate.mjs --reference` and re-stamped. All three PASS with `gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0`. The output is in `evals/results/gate-reference/{editorial-article,org,motion-portfolio}.txt`. The org and motion-portfolio runs used the working copy of `gate.mjs` that was being built for Task 3, so they print one advisory `rm-still` line. That line is not in the counts or the stamp.

Side effect, not a design change: `org.html` and `editorial-article.html` were rebuilt with this machine's toolchain (react 19.3.1, esbuild 0.28.2), so their inlined script and CSP hash differ from the previous build.
