# Delivery Gate

Verification only. The rules live in `gates/rules.md`, read before Step 1 and designed within; this file checks that the build kept them. Run it before handing back **any** page or component. Four parts: the measured gate, a self-critique score, the AI-default scan and the craft checklist. If anything fails, fix it and run the gate again. Two passes is normal; needing three means the design was not made inside `gates/rules.md`, so go back to the Thinking Sequence instead of patching.

---

## Part 0: Measured gate (`scripts/gate.mjs`)

Run the script against the page in whatever stack Step 0 chose. The gate is framework-neutral: it measures what a browser renders, so it takes three input forms:

| Input | Example | What the gate does |
|---|---|---|
| **A URL** of a running dev or preview server | `http://localhost:3000/` (`next dev`, `next start`), `http://localhost:4321/` (`astro dev`, `astro preview`), `http://localhost:5173/` (`vite`, `vite preview`) | scans the page as served, any framework |
| **A project folder** with a build output | `.` or `my-site/` after `astro build`, `vite build`, `next build` with `output: "export"` | serves the folder's `index.html`; if it has none, the first of `out/`, `dist/`, `build/`, `.output/public/`, `_site/`, `public/` that has one. The project's own `DESIGN.md` and `.motomation/log.json` are still read |
| **A single `.html` file** | `index.html`, `examples/templates/hotel.html` | serves it from its own folder (static still works). If the page loads assets from `../` (a subpage such as `features/index.html` using `../assets/`), it walks up to the site root (the first folder, at least that many levels up, with an `index.html`, a `package.json`, or named `site/`) and serves from there. No root found: it warns "gate: single file mode, assets outside this folder will not load. Prefer a URL or a served project." |

```bash
node scripts/gate.mjs http://localhost:3000/   # Next.js dev server (or any running server)
node scripts/gate.mjs .                        # a project folder: its index.html, else out/ dist/ build/ …
node scripts/gate.mjs index.html               # one static file
node scripts/gate.mjs --verify index.html      # re-scan and check the stamp written in the file
```

A server-rendered build that isn't files (a Next.js `.next/` without `out/`, an SSR adapter) can't be served as a folder: start it (`next start`, `astro preview`) and pass the URL. The gate says so instead of guessing. Stamps are written into `.html` files; for a URL or a framework build, keep the printed stamp line in the handoff note or `DESIGN.md`.

It runs these bounded checks in a real browser and prints numbers. Each one verifies a section of `gates/rules.md`; the limits are there, not here.

| Code | Verify | Limits in `gates/rules.md` |
|---|---|---|
| `c` | **Contrast** of every visible text element against the pixels actually behind it (text hidden, viewport screenshotted, background sampled), per width and per sampled scroll position; scroll-sequence steps in every state they rest in (see `craft/scroll-sequences.md`) | Contrast |
| `o` | **Overflow**: sideways scroll and elements leaving the viewport or their parent | Overflow and long words |
| `w` | **Long display words** at 375px, decorative text included | Overflow and long words |
| `rm` | **Reduced motion**: the page loaded with `prefers-reduced-motion: reduce` | Reduced motion |
| `a` | **Alt and names** of images and focusable elements | Accessibility |
| `n` | **Numbers** (counters, prices, `progress`/`meter`, `aria-valuenow`) read at scroll 0, at the end and under reduced motion, against the settled value. Live values (a ticker, a clock, `<time>`, `role=timer`/`status`/`log`, `aria-live`) are listed, not judged | Reduced motion (values) |
| `q` | **Motion quality** (gate/3): pinned-zone progression over 8 frames, p95 `requestAnimationFrame` while scrolling (in a sandbox: `not verified — sandbox`, numbers printed, nothing counted, `docs/adapters/sandbox.md`), reduced-motion distinctness | Motion quality and budgets; Reduced motion |
| `k` | **Accessibility** (gate/3): focus-visible on the first 40 focusable elements, target size at 375 touch, 200% zoom, 320px reflow, forced colors (text not on screen at rest is skipped), keyboard trap | Accessibility; Overflow (reflow); Contrast (forced colors) |
| `rules` | **The four rule sets** (gate/4, `scripts/rulesets.mjs`), one count per set: distinct failing rule IDs. **C** copy, **S** SEO, **P** performance, **K** security (for local files, headers come from a `_headers` file next to the page). Warnings are printed and not counted | Copy; SEO; Performance; Security |

The output ends with a stamp line built only from those numbers:
`gate: c0 o0 w0 rm0 a0 n0 q0 k0 · rules: C0 S0 P0 K0 · gate/4 · <id>`. The id is a hash of what was measured on this page, so the same page gives the same id and a different page does not. `c` is the total of the per-width contrast failures. A stamp from an older gate (`gate/1`: five checks; `gate/2`: no `q`/`k`, no Q/A axes; `gate/3`: no `rules:` segment) is rejected by `--verify`: re-run the gate and paste the new line. The rule-set letters live in their own `rules:` segment because the critique already uses C (concept) and S (sameness). While fixing copy, head tags or headers, `node scripts/gate.mjs <page> --rules` runs only the four rule sets in a few seconds; it prints no stamp, because a stamp needs every axis.

**Rule: a stamp is only valid if it contains numbers produced by `scripts/gate.mjs` in the same run. A hand-written stamp is rejected.** Paste the line the script printed. Never type the numbers yourself and never copy them from an example or an earlier page. `--verify` re-scans the page and rejects any stamp whose numbers or id differ from the fresh scan, or that has no `gate:` segment at all.

**No browser, no pass.** If Playwright or Chromium is missing, the script prints `not verified — no browser` and exits with code 3. Report exactly that in the handoff (`Measured: not verified — no browser`) and leave the `gate:` segment out of the stamp. Don't write a pass you didn't measure.

The checks are bounded, and each reports what it skipped (text that was covered or never settled, elements parked off-canvas such as skip links and closed drawers). When more than 30% of text elements are skipped for contrast, the gate prints a coverage warning: the `c` count is then not a full measurement, and the skipped text needs a check by hand. A clean run means these eight things were measured (the composition and richness blocks are advisory and never change it). It doesn't mean the page is accessible. Keyboard paths, focus order and copy still need Parts 1–3.

Exit codes: `0` pass · `1` fail · `2` stamp rejected · `3` not verified (no browser, or the scan ran past `--timeout`, default 600 s, which very tall pages such as the 36,000px component gallery can do, or the sandbox is too constrained to run the browser).

**Constrained sandboxes** (Codex CLI, small CI containers, 2-CPU machines): the gate probes the machine, and if Chromium fails to start, crashes or times out it retries once in a light footprint (one renderer process via `--renderer-process-limit=1 --no-zygote`, `--disable-gpu --disable-dev-shm-usage`, operation timeouts ×3; the checks are identical). If that fails too it prints `not verified — sandbox too constrained: <reason> (attempt 1 …; attempt 2 …; machine …)` and exits 3. Report that line verbatim; don't call the page verified. `--light` starts in the light footprint; `--timeout-ms` sets the budget. Details: `docs/adapters/codex.md`.

**Composition heuristics (advisory, v2.5.0).** After the axes the gate prints a `composition (advisory …)` block with three measurements at 1440×900. They never fail the gate, are not in the counts, the stamp or its id, and a page passes or fails exactly as without them. Read them as prompts for a second look, not verdicts:

- **pin fill**: the share of the viewport covered by content (text boxes, images, video, canvas, SVG, and backgrounds that are not the page ground or a full-bleed flat colour) at 25, 50 and 75% through each pinned zone. Warns below 60%: a pinned screen that holds the reader for several scrolls with most of it empty.
- **focal**: for each screen of scroll (every 900px, up to 14), the text mass of each block (characters × font size², visually hidden text excluded). Warns on screens where the heaviest block does not outweigh the next by 1.5×: no single thing to look at first. A screen of body paragraphs with no heading will warn; that can be deliberate.
- **scale**: the largest text size on the page against the body size (the size carrying the most characters in runs of 40 or more). Warns below 1:6, the display:body contrast typography-led pages usually need.

**Richness (advisory, v2.6.0).** The failing checks catch too much; this block catches too little. After composition the gate prints `richness (advisory …)`, measured at 1440×900 at scroll 0. It **never fails the gate**, is not in the counts, the stamp or its id, and only warns (`⚠`):

- **fold** (every page): fewer than 3 meaningful sections above the fold. A meaningful section is what a visitor reads as a separate thing: the navigation (counted once), each heading, each paragraph of 20+ characters, each picture of 48px or more, and the call to action (counted once).
- **opening** (homepage): no hero or opening statement, meaning no visible `h1` and no display text (≥ 32px, two or more words) in the first screen.
- **category** (category page): the item grid (4+ same-tag items, each ≥ 80×80 with a link or a picture) has no title (an `h1`/`h2` before it) or no count ("24 pieces", "(24)", "1–12 of 48"). A category page with no grid to judge also warns.
- **about** (about page): fewer than 2 content blocks (sections outside header, nav and footer with 40+ characters or a picture).

The page kind comes from the path (`/` or `index` → home; `about`, `story`, `team` → about; `shop`, `collection(s)`, `category`, `products`, `catalogue`, `archive`, `work`, `projects` → category; anything else → `page`, where only the fold check applies). Set it with `--page home|category|about|page` when the file name doesn't say (`examples/templates/hotel.html --page home`). A warning is a prompt to re-read the Restraint Gate's "too little" side in `principles/restraint.md`, not a defect: a poster-like hero with one line of type can be the concept, and the gate still passes.

Exit code `2` also covers usage errors (an unknown flag, a missing value or no target), printed as one line plus the usage.

**Optional motion report.** `node scripts/gate.mjs --report dist/index.html` (or `--report out.html` after a target) also writes a self-contained HTML file with scroll-frame strips: 8 frames at 1440px, 8 at 375px and 8 at 1440px under reduced motion. Use it to review motion by eye, show a client, or give judges something better than one screenshot. It's off by default, doesn't change the text output, and adds nothing to the gate's numbers.

---

## Part 1: Self-critique (score 1–5)

| Axis | Question | 5 means |
|---|---|---|
| **C**oncept | Is there a clear idea, and does every section serve it? | A stranger could repeat the concept sentence after one visit |
| **H**ierarchy | Within 2 seconds, is it obvious what's first, second and third on each screen? | One focal point per screen, every time |
| **S**pecificity | Could this only belong to this brief? | Swap the logo, and it would no longer make sense |
| **R**estraint | Has everything without a job been removed? | Nothing left to cut |
| **M**otion | Does every animation pass the four questions and have fallbacks? | Motion explains, never decorates, and reduced motion is designed |
| **V**ariety | Is this structurally different from previous runs (memory log) and from the template? | Different archetype, signature, type and nav from the last 5 runs |

### Where each number comes from

You don't type the scores. Each axis is derived from one named check, and `scripts/gate.mjs` prints the result with its trace. The question in the table above is what the axis means. The check below is how it's scored.

| Axis | Check | Source | Score |
|---|---|---|---|
| **C** | Did the concept survive the Restraint Gate? | `DESIGN.md` → "Restraint Gate record" → `Concept survived:` | `yes` → 5 · `yes, after N change(s)` → 5 − N (min 2) · `no` (replaced) → 1 |
| **H** | 375 hierarchy test: display words fit (`w`), no overflow at 375, exactly one `h1`, no skipped heading levels, one largest text on the first 375px screen | measured by gate.mjs | 5 − issues (min 1) |
| **S** | Is the archetype/signature unique across the last 5 runs, and how similar is the structural fingerprint? | `.motomation/log.json` (via `scripts/lib.mjs` fingerprints) + the stamp's archetype, signature, tier | both new and fingerprint < 50% → 5 · < 70% → 4 · one reused or ≥ 70% → 3 · both reused → 2 · identical → 1 |
| **R** | How many things the Restraint Gate cut and logged | `DESIGN.md` → "Restraint Gate record" → `- Cut:` and `- Rejected animation:` lines | 1 + cuts + rejected animations (max 5). Four logged rejections → R5 |
| **M** | Is the tier under budget? | measured by gate.mjs against the stamp's `tier`: pinned sections ≤ 2, WebGL canvases ≤ 1, JS (gzipped) ≤ the tier budget in `craft/performance.md`, reduced motion clean (`rm0`) | 5 − budget breaches (min 1); any `rm` failure caps M at 2 |
| **V** | How many sections repeat an entrance pattern already used on the page? | measured by gate.mjs: each top-level section's entrance (fade, x, y, scale, clip, filter, or static) | 5 − repeats (min 1). Static sections don't count |
| **Q** | Does the motion move, stay smooth, and have a designed reduced-motion layout? | measured by gate.mjs (`q` above): `prog:Δ<n>%` is the least-moving zone's median change, `smooth:` is `ok` / `slow` / `sandbox` (not judged) / `n/a`, `rm:` is `flow` / `pinned` / `text-missing` / `n/a` | 5 − 2 × failing categories (min 1). No pinned zone → `Q5[prog:n/a,smooth:n/a,rm:n/a]` |
| **A** | Can it be used by keyboard, at 200% and 320px, on touch, and in forced colors? | measured by gate.mjs (`k` above): `focus:<ringed>/<checked>,tgt:<fails>f<warns>w,zoom:<lost>,reflow:<px>,fc:<illegible>,trap:<0/1>` | 5 − failing categories (min 1); target warnings don't count |

A traced stamp reads like this, with the trace in brackets after each number:
`critique: C5[restraint:kept] H4[375:1] S5[last5:archetype-new,signature-new,fp31] R5[cuts:2,anim:2] M5[t2:pins1/2,webgl0/1,js41/80KB,rm0] V3[entrance-repeats:2] Q5[prog:Δ8.4%,smooth:sandbox,rm:flow] A4[focus:12/12,tgt:0f3w,zoom:0,reflow:0,fc:2,trap:0]`

That line is an illustration of the format, not numbers to copy. `--verify` recomputes every axis from the page, `DESIGN.md` and the memory log, and rejects the stamp if any number or trace differs. The progression Δ is compared by its verdict, not to the decimal (pixel deltas vary slightly between scans). It also rejects bare scores like `C5 H4 S5 R4 M5 V5`, and axes marked `?` (no record to derive from, e.g. `C?[no-record]` when `DESIGN.md` has no Restraint Gate record).

**Any score below 4 → revise before continuing.** Then paste the stamp line gate.mjs printed into the stamp comment:
`/* motomation · archetype: <x> · mutation: <y> · signature: <z> · tier: <n> · critique: <paste> · gate: <paste> */`

The placeholders are deliberate. There are no numbers to copy. Write the archetype, mutation, signature and tier first, because gate.mjs reads them from the comment. Then run `node scripts/gate.mjs <build>` and replace the critique and gate segments with what it printed. Check with `node scripts/gate.mjs --verify <build>`.

---

## Part 2: AI-default scan (every answer must be "no")

**Structure**
1. Is the page hero → logo wall → 3 features → testimonials → pricing → CTA?
2. Is the hero a centred headline + subtitle + two buttons + a screenshot, without a reason?
3. Is there a bento grid without a concept reason?
4. Do all sections use the same layout?
5. Is the nav "logo left, 5 links centre, button right", and the footer four columns of links, without thought?

**Visual**
6. Is the display font <!--rule:banned_display_fonts-->Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Arial, Helvetica or the system UI stack<!--/rule-->? Is <!--rule:caution_fonts-->Playfair Display and Space Grotesk<!--/rule--> used without a stated reason?
7. Is there a purple/blue/pink gradient, a glowing orb or blurred blobs without meaning?
8. Is glassmorphism used without the concept needing layers?
9. Is there an icon above every feature title?
10. Are there more than one accent colour or more than one display face, without a reason?
11. Is every corner the same large radius, with a shadow and a border all at once?
12. Is the hero image a generic stock photo or AI art with no relation to the brief?

**Content**
13. Is there lorem ipsum, "Acme", "John Doe", or placeholder copy?
14. Are there invented statistics, logos, testimonials or awards?
15. Does the copy contain any banned phrase from `craft/copy.md`?
16. Are there emoji used as icons or bullets?
17. Does the page link to a domain, page or address that the brief did not supply and the build did not create?

**Motion**
18. Does anything fade-up on scroll just because it can?
19. Is any animation missing a reduced-motion path?
20. Are layout properties animated?
21. Do UI feedback animations exceed <!--rule:ui_feedback_max_ms-->250ms<!--/rule-->, or use ease-in or `scale(0)` entrances?
22. Is the scroll hijacked (custom scroll that breaks keyboard, anchor links or screen readers)?
23. Does any loop or canvas keep running off-screen?

**Code**
24. Are there TODOs, `// ...rest`, or unfinished components?
25. Are there clickable `div`s, missing labels or missing `alt` text?
26. Are there `markers: true`, console logs or unused imports left in?

**Copy** (the copy pass in `craft/copy.md`)
27. Does more than one section headline share the same shape (all questions, all "X. Y." fragments, all mirror sentences)?
28. Does any sentence end in a vague "-ing" benefit tail, or cite unnamed experts or studies?
29. Is the same thing called by more than one name across the page (synonym cycling)?
30. Does an em dash appear in most paragraphs, or does every section close with a generic invitation?

---

## Part 3: Craft checklist

- [ ] Concept sentence and signature move are visible in the first screen
- [ ] Type: display face chosen with a reason; body size and measure within `gates/rules.md` (Hierarchy); `text-wrap: balance` on headings
- [ ] Colour: all text pairs verified (`node scripts/contrast.mjs` while designing, `node scripts/gate.mjs` on the build); accent within `gates/rules.md` (Contrast)
- [ ] Layout: one deliberate grid break per screen, recomposed (not squeezed) on mobile
- [ ] Motion: tokens used; `gsap.matchMedia()` with reduced-motion and pointer conditions; `ScrollTrigger.refresh()` after load
- [ ] Mobile motion matrix applied
- [ ] Scroll sequences (pinned, scrubbed, image-sequence, lit-step lists) reviewed per `craft/scroll-sequences.md`, record in the handoff:
  - [ ] Each step's contrast verified **active and inactive** (`gates/rules.md`, Contrast)
  - [ ] Reduced-motion fallback verified as a **designed still** (`gates/rules.md`, Reduced motion)
  - [ ] **No step shows a value that is later corrected** (verified)
- [ ] Accessibility: keyboard path, visible focus, landmarks, skip link, alt text
- [ ] Performance: LCP image preloaded, heavy libraries loaded dynamically, off-screen work paused
- [ ] SEO: title, description, OG image, structured data, `llms.txt` (for sites)
- [ ] Copy: real, specific, no banned phrases; the copy pass in `craft/copy.md` run with every row "none found" or fixed; `[NEEDS COPY]` markers listed for the user
- [ ] "Restraint Gate record" filled in `DESIGN.md` (concept survived?, every cut, every rejected animation)
- [ ] `node scripts/gate.mjs` run on the build; its full `critique: … · gate: …` line pasted and `--verify` passes (or the exact "not verified — …" line reported: no browser, timed out, or sandbox too constrained)
- [ ] Stamp comment written; run logged with `node scripts/memory.mjs log …`

---

## Part 4: Rule-set checklists (copy, SEO, performance, security)

One line per item from the four rule sets. Lines marked **measured by the gate** are counted by `scripts/gate.mjs`
(gate/4: the `rules: C<n> S<n> P<n> K<n>` segment of the stamp); paste the stamp and tick them only when the count
is 0. Every other line is ticked by reading, or written as "n/a (<why>)" or "owner to do". Never tick what you did
not check. Full rules, with why and examples: `craft/copy.md`, `craft/seo.md`, `craft/performance.md`, `craft/security.md`.

### Copy

- [ ] copy-01 Headlines are specific · check by reading
- [ ] copy-02 Write for someone in a hurry · check by reading
- [ ] copy-03 Sell above the fold · check by reading
- [ ] copy-04 No em dashes in visible copy · **measured by the gate (C)**
- [ ] copy-05 Benefit first, then the feature · check by reading
- [ ] copy-06 Break up blocks of text · gate C warns; check by reading
- [ ] copy-07 Cut padding · check by reading
- [ ] copy-08 Make it scannable · check by reading
- [ ] copy-09 No aphorism formulas · **measured by the gate (C)**
- [ ] copy-10 The body backs the headline · check by reading
- [ ] copy-11 No warm-up openers · **measured by the gate (C)**
- [ ] copy-12 Remove what doesn't move the reader · check by reading
- [ ] copy-13 Answer objections before the CTA · check by reading
- [ ] copy-14 One to three key points per section · check by reading
- [ ] copy-15 No two-beat antithesis · **measured by the gate (C)**
- [ ] copy-16 No claims you can't prove · gate C warns; check by reading
- [ ] copy-17 CTAs: a clear verb and its outcome · **measured by the gate (C)**
- [ ] copy-18 Talk to one buyer · check by reading
- [ ] copy-19 One idea per section · check by reading
- [ ] copy-20 Proof sits next to the claim · check by reading

### SEO

- [ ] seo-01 [M] `sitemap.xml` exists and lists every public route · check: site-level: compare the sitemap with the route list
- [ ] seo-02 [M] `robots.txt` exists, with no accidental `Disallow: /` · check: site-level: read the file
- [ ] seo-03 [M] No `noindex` on public pages · **measured by the gate (S)**
- [ ] seo-04 [M] A canonical tag on every route · **measured by the gate (S)**
- [ ] seo-05 [M] Meta title unique per page, 60 characters or fewer · **measured by the gate (S)**
- [ ] seo-06 [M] Meta description unique per page, 160 characters or fewer · **measured by the gate (S)**
- [ ] seo-07 [M] Exactly one `<h1>` per page · **measured by the gate (S)**
- [ ] seo-08 [M] Heading order skips no levels (no `h2` → `h4`) · **measured by the gate (S)**
- [ ] seo-09 [M] Alt text on every meaningful image; decorative images use `alt=""` · measured by the gate (`a` count)
- [ ] seo-10 [M] Schema markup where the page is eligible (Product, Article, FAQ, Event, Organization) · gate S warns; decide by reading
- [ ] seo-11 [M] At least 3 internal links per page · **measured by the gate (S)**
- [ ] seo-12 [M] Zero broken links · check: site-level: a link checker over the built site
- [ ] seo-13 [M] Images compressed: WebP or AVIF, responsive sizes (`srcset`/`sizes` or `<picture>`) · measured by the gate (axis P)
- [ ] seo-14 [M] Core Web Vitals targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 · check: field data or Lighthouse; never claimed unmeasured (`craft/performance.md`)
- [ ] seo-15 [M] Mobile layout works at 375 px with no overflow · measured by the gate (`o` and `w` counts)
- [ ] seo-16 [M] HTTPS enforced; no mixed content · **measured by the gate (S)**
- [ ] seo-17 [M] URL slugs: lowercase, hyphens, no IDs, no query parameters · **measured by the gate (S)**
- [ ] seo-18 [M] `og:image` present, 1200 × 630 · **measured by the gate (S)**
- [ ] seo-19 [H] Search Console verified and the sitemap submitted · owner to do, or the record that proves it
- [ ] seo-20 [M] `llms.txt` current: names the version and the latest report · check: site-level; for this repository, the root check-repo script

### Performance

- [ ] perf-01 [FE] Images compressed; AVIF or WebP, with a fallback where needed · **measured by the gate (P)**
- [ ] perf-02 [FE] Below-the-fold images use `loading="lazy"` · **measured by the gate (P)**
- [ ] perf-03 [FE] The LCP image is not lazy-loaded · **measured by the gate (P)**
- [ ] perf-04 [FE] Code-split: no single script over the tier's budget · **measured by the gate (P)**
- [ ] perf-05 [FE] API responses cached (SWR, React Query, or `Cache-Control`) · check: read the data layer; "n/a (no API)" on a static page
- [ ] perf-06 [FE] A CDN fronts static assets · check: the deploy target (Pages, Vercel, Netlify, Cloudflare) or the CDN config
- [ ] perf-07 [FE] JS and CSS minified in production · gate P warns; decide by reading
- [ ] perf-08 [FE] No extra re-renders (memo only where the profiler showed a cost) · check: React Profiler, recorded when used; never `memo` everything by default
- [ ] perf-09 [FE] Input handlers debounced (search, resize) · check: read the handlers; `requestAnimationFrame` or a debounce on every resize/scroll/input listener
- [ ] perf-10 [FE] Large lists paginated or virtualised · check: any list over ~100 items
- [ ] perf-11 [FE] Unused packages and dead scripts removed · **measured by the gate (P)**
- [ ] perf-12 [FE] Non-critical scripts deferred (analytics, chat) · **measured by the gate (P)**
- [ ] perf-13 [FE] Loading skeletons for async content · check: read the async views; a skeleton sized like the final content (no layout shift)
- [ ] perf-14 [IN] A load balancer when traffic justifies one, and the reason written down · check: hosting notes
- [ ] perf-15 [BE] API payloads trimmed to what the client uses · check: read the handlers or the GraphQL selection
- [ ] perf-16 [BE] Database connections pooled · check: the DB client config
- [ ] perf-17 [BE] Costly query results cached (Redis or in-memory) · check: the cache layer, with its invalidation rule
- [ ] perf-18 [BE] N+1 queries fixed · check: query log on the slowest route
- [ ] perf-19 [BE] Server-side caching on expensive routes · check: response headers or the framework's route cache
- [ ] perf-20 [H] A Lighthouse run recorded with its real numbers · owner to do, or the record that proves it

### Security

- [ ] sec-01 [M] Admin routes require auth and carry `noindex` · check: route list + middleware; a request without a session gets 401/redirect
- [ ] sec-02 [M] Access checks run on the server, not only in the client · check: read each protected handler; hiding a button is not a check
- [ ] sec-03 [H] Row-level security where the database supports it · owner to do, or the record that proves it
- [ ] sec-04 [H] Email verification on signup · owner to do, or the record that proves it
- [ ] sec-05 [H] Passwords hashed with bcrypt or argon2 · owner to do, or the record that proves it
- [ ] sec-06 [M] Auth cookies are `HttpOnly`, `Secure` and `SameSite` · **measured by the gate (K)**
- [ ] sec-07 [M] No secrets in client bundles · **measured by the gate (K)**
- [ ] sec-08 [M] `.env` is gitignored; `.env.example` holds placeholders only · check: `git check-ignore .env`; read `.env.example`
- [ ] sec-09 [M] No secrets in logs · check: grep the log output for the same secret patterns gate K uses
- [ ] sec-10 [H] Every SQL query is parameterised · owner to do, or the record that proves it
- [ ] sec-11 [M] Form inputs validated on the server (Zod or equivalent) · check: every mutation handler parses its input before use
- [ ] sec-12 [M] Output escaped; no raw `innerHTML` with user input · **measured by the gate (K)**
- [ ] sec-13 [M] File uploads validated by MIME type and size · check: the upload handler
- [ ] sec-14 [H] Webhooks verify their signature · owner to do, or the record that proves it
- [ ] sec-15 [M] Rate limits on auth, contact forms and every mutation · check: the middleware or edge config
- [ ] sec-16 [M] CORS is narrow; no wildcard in production · **measured by the gate (K)**
- [ ] sec-17 [M] Debug mode off in production · gate K warns; decide by reading
- [ ] sec-18 [H] Dependencies patched (`npm audit` clean, or each finding written down) · owner to do, or the record that proves it
- [ ] sec-19 [H] A security scan run and its results recorded · owner to do, or the record that proves it
- [ ] sec-20 [M] No client-supplied value is trusted for authorisation · check: read the handlers: role, user id and price come from the session or the database, never the request body
- [ ] sec-h1 `Content-Security-Policy` sent · **measured by the gate (K)**
- [ ] sec-h2 `X-Content-Type-Options: nosniff` sent · **measured by the gate (K)**
- [ ] sec-h3 `Referrer-Policy` sent · **measured by the gate (K)**

---

## Handoff note (end every delivery with this)

```
Chose     : <archetype + mutation, signature, type, palette, tier>
Rejected  : <the obvious option and why>
Needs     : <[NEEDS COPY]/[NEEDS ASSET] items for the user>
Measured  : <the gate.mjs stamp line and real numbers, or "not verified — no browser">
Try next  : <one command, e.g. /bolder on the hero, or /motomate the product chapter>
```
