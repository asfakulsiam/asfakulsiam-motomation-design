# Benchmark Run Record: Cargoline (03-b2b)

## Metadata
- **Project Name:** Cargoline B2B Freight Visibility Platform
- **Model ID:** `gemini_3_8_flash`
- **Output Folder:** `/home/user/workspace/bench/runs/03-b2b/`
- **Delivery Mode:** `functional frontend`
- **Start Time:** 2026-10-18 10:45:10 UTC
- **End Time:** 2026-10-18 11:11:00 UTC
- **Total Duration:** ~26 minutes

## Tools Available & Used
- **Available Tools:** `bash`, `read`, `write`, `edit`, `search_web`, `fetch_url`, `exec`, `exec_wait`, `load_sessions`, `memory_search`, `connector_discovery`, `share_file`, `load_skill`
- **Used Tools:**
  - `bash`: Environment inspection, starting detached static HTTP server on port 4302 (`setsid`), running skill benchmark audit scripts (`completeness.mjs`, `realism.mjs`, `gate.mjs --rules`), executing single-instance Playwright screenshot capture across 13 core journey steps at 375px and 1440px viewports, and clean server termination.
  - `read`: Reading skill guidance (`SKILL.md`, `thinking/`, `gates/rules.md`, `craft/`), benchmark brief (`03-b2b.md`), and verifying rendered visual screenshot deliverables (`screens/`).
  - `write`: Generating website pages, stylesheets, scripts, mock JSON datasets, schemas, and design documentation (`DESIGN.md`, `SCHEMA.md`, `DATA.md`, `MOTION.md`, `MEDIA.md`, `CHECKPOINTS.md`, `CRITIQUE.md`, `GATE.md`, `README.md`, `LICENSE`, `RUN.md`).
  - `edit`: Precise defect rectification in HTML templates and metadata files.
  - `search_web` & `fetch_url`: Design and technical research into industry benchmarks (project44, FourKites, Terminal Industries teardowns, DCSA standards, CBP ACE protocols).

## Verification Commands & Verbatim Final Verdict Lines

### 1. Completeness Verification
- **Command:** `node /home/user/workspace/bench/skill-226085d/scripts/completeness.mjs /home/user/workspace/bench/runs/03-b2b/`
- **Exit Code:** `0`
- **Verbatim Output Lines:**
```
bench/runs/03-b2b/DESIGN.md
  X — completeness (B2B freight visibility software, global, admin panel: no) [functional frontend]  ✓
      Routes:      17/17 required present
      Journeys:    3/3 connected
      Functions:   4/4 present · 2 not required (reason given)
      Legal:       3/3 present
      Admin:       0/0 present · 1 not required (reason given)
      Skeletons:   1/1 present
      Template:    18/18 present
```

### 2. Content Realism Verification
- **Command:** `node /home/user/workspace/bench/skill-226085d/scripts/realism.mjs /home/user/workspace/bench/runs/03-b2b/`
- **Exit Code:** `0`
- **Verbatim Output Lines:**
```
  Content realism  ✓
```

### 3. Rulesets Verification (Copy, SEO, Performance, Security)
- **Command:** `node /home/user/workspace/bench/skill-226085d/scripts/gate.mjs http://127.0.0.1:4302 --rules`
- **Exit Code:** `0`
- **Verbatim Output Lines:**
```
http://127.0.0.1:4302
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
     ⚠ perf-07  a script over 2 KB that looks unminified  http://127.0.0.1:4302/assets/app.js  (warning)
```

Additionally verified across all 19 site routes (`/`, `/product`, `/product/tracking`, `/product/exceptions`, `/product/customs`, `/integrations`, `/pricing`, `/security`, `/security/overview`, `/stories`, `/stories/midwest-foods`, `/docs`, `/demo`, `/demo/confirmed`, `/contact`, `/careers`, `/privacy`, `/terms`, `/cookies`) - every route returned `rules: C0 S0 P0 K0`.

### 4. Visual Verification (Playwright Screenshots)
- **Script:** Single-instance Chromium headless browser via Node Playwright API.
- **Viewports:** 375px width (mobile viewport `375x812`), 1440px width (desktop viewport `1440x900`).
- **Files generated in `screens/`:**
  - `j1-01-home-1440px.png` & `j1-01-home-375px.png`
  - `j1-02-product-1440px.png` & `j1-02-product-375px.png`
  - `j1-03-integrations-1440px.png` & `j1-03-integrations-375px.png`
  - `j1-04-pricing-1440px.png` & `j1-04-pricing-375px.png`
  - `j1-05-demo-1440px.png` & `j1-05-demo-375px.png`
  - `j1-06-demo-confirmed-1440px.png` & `j1-06-demo-confirmed-375px.png`
  - `j2-01-home-1440px.png` & `j2-01-home-375px.png`
  - `j2-02-security-1440px.png` & `j2-02-security-375px.png`
  - `j2-03-security-overview-1440px.png` & `j2-03-security-overview-375px.png`
  - `j3-01-home-1440px.png` & `j3-01-home-375px.png`
  - `j3-02-stories-1440px.png` & `j3-02-stories-375px.png`
  - `j3-03-stories-midwest-foods-1440px.png` & `j3-03-stories-midwest-foods-375px.png`
  - `j3-04-contact-1440px.png` & `j3-04-contact-375px.png`

## What Was Not Verified
- Full `scripts/gate.mjs` scan or `--journey` mode (skipped intentionally per CPU constraint instruction: "The machine has 2 CPUs shared with other runs: do NOT run the skill's full scripts/gate.mjs scan or its --journey mode (the evaluator runs those afterwards)").
- External backend database or live webhook ingestion: all data is delivered as structured mock JSON data files in `data/` adhering to `data/schema.json`.
- Live SMTP message delivery for demo and contact forms: handled client-side with full validation and URL state transitions.

## Known Defects
1. `perf-07` (Warning): `assets/app.js` is 7 KB unminified vanilla JS with descriptive comments rather than a minified, tree-shaken bundle.
2. `seo-10` (Warning): Additional structured JSON-LD data types (`FAQPage`, `SoftwareApplication`) could be declared on secondary pages (`/docs`, `/careers`).
