# Leaf & Ledger · Loud poster · run record

## Identity and timing
- Model id: `gpt_6_1_sol`, read from the runner's ASI_MODEL environment variable.
- Start UTC: 2026-10-18T11:24:57Z.
- End UTC: 2026-10-18T12:47:22.478Z.
- Route: full. Delivery mode: functional frontend. No package installs.
- Tools: read, bash, apply_patch, multi_tool_use.parallel, load_skill, search_web, fetch_url, and tool-catalog inspection through exec. Node built-ins generate static output; preinstalled Playwright/Chromium run the custom lightweight QA and the skill's allowed browser checks. Image generation was not used; illustrations are original SVG.
- The deploy_website tool uploaded supplementary private previews with validation disabled; exact arguments and receipts appear in PREVIEW.md. ImageMagick montage generated local screenshot contact sheets, which were visually inspected at 375 and 1440.
- Read-only inputs: bench/skill-v301/, bench/12a-paired-archival.md, bench/12b-paired-poster.md.
- Authored benchmark files are confined to a-archival/ and b-poster/ output folders. No edits to the supplied skill or /home/user/workspace/repo. The platform preview tool automatically creates its own deployment copy; this is not an authored benchmark directory.

## Exact final check commands and observed final lines
Commands below are copied from qa/check-manifest.json. The entire stdout/stderr is preserved in the named qa files and GATE.md. These commands were executed as Node spawnSync argument arrays; quote each #hex colour if copying a contrast command into a shell.

### node /home/user/workspace/bench/skill-v301/scripts/completeness.mjs /home/user/workspace/bench/runs/12-paired/b-poster
Start: 2026-10-18T12:22:28.909Z; end: 2026-10-18T12:22:29.026Z; exit: 0.
Final output lines verbatim:
```text
      Legal:       4/4 present
      Edge cases:  2/2 handled
      Admin:       0/0 present · 1 not required (reason given)
      Skeletons:   0/0 present · 1 not required (reason given)
      Template:    17/17 present · 3 not required (reason given)
```

### node /home/user/workspace/bench/skill-v301/scripts/realism.mjs /home/user/workspace/bench/runs/12-paired/b-poster
Start: 2026-10-18T12:22:29.026Z; end: 2026-10-18T12:22:29.122Z; exit: 0.
Final output lines verbatim:
```text
  Content realism  ✓
```

### node /home/user/workspace/bench/skill-v301/scripts/gate.mjs http://localhost:4312/ http://localhost:4312/shop http://localhost:4312/tea/sylhet-black http://localhost:4312/tea/assam-gold http://localhost:4312/tea/ilam-green http://localhost:4312/tea/darjeeling-first http://localhost:4312/tea/nepal-white http://localhost:4312/tea/bangladesh-green http://localhost:4312/subscriptions http://localhost:4312/subscriptions/build http://localhost:4312/cart http://localhost:4312/checkout http://localhost:4312/confirmation http://localhost:4312/account http://localhost:4312/account/subscription http://localhost:4312/estates http://localhost:4312/brewing-guide http://localhost:4312/shipping http://localhost:4312/returns http://localhost:4312/privacy http://localhost:4312/terms http://localhost:4312/contact http://localhost:4312/404 --rules
Start: 2026-10-18T12:22:29.122Z; end: 2026-10-18T12:23:04.485Z; exit: 0.
Final output lines verbatim:
```text
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4312/404
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
gate: constrained machine (2 CPUs); a failed scan is retried once in the light footprint
```

### node /home/user/workspace/bench/skill-v301/scripts/pair.mjs /home/user/workspace/bench/runs/12-paired/a-archival /home/user/workspace/bench/runs/12-paired/b-poster --max 30 --out /home/user/workspace/bench/runs/12-paired/a-archival/qa/pair.json
Start: 2026-10-18T12:23:04.486Z; end: 2026-10-18T12:33:18.690Z; exit: 0.
Final output lines verbatim:
```text
  · /privacy: partial (composition at or above 0.4); check the screenshots
  · /terms: partial (composition at or above 0.4); check the screenshots
  limits: does not judge quality, brief fit, accessibility, journeys or motion: run gate.mjs (and --journey) on each direction

PASS  one product, 22 route(s) recomposed or partial, no shared presentation, routes and functions at parity
```

### node /home/user/workspace/bench/runs/12-paired/a-archival/qa/journeys.mjs b-poster
Start: 2026-10-18T12:34:55.946Z; end: 2026-10-18T12:36:33.985Z; exit: 1.
Final output lines verbatim:
```text
  expected: 0,
  operator: 'strictEqual'
}

Node.js v20.20.2
```

### node /home/user/workspace/bench/runs/12-paired/a-archival/qa/journeys.mjs b-poster
Start: 2026-10-18T12:37:48.631Z; end: 2026-10-18T12:39:27.292Z; exit: 1.
Final output lines verbatim:
```text
  expected: 0,
  operator: 'strictEqual'
}

Node.js v20.20.2
```

### node /home/user/workspace/bench/runs/12-paired/a-archival/qa/journeys.mjs b-poster
Start: 2026-10-18T12:40:14.331Z; end: 2026-10-18T12:41:53.330Z; exit: 0.
Final output lines verbatim:
```text
1440: /account → /account/subscription → pause saved → reload → resume → skip saved → reload PASS
Route inspection: 44 route/viewport combinations.
Console errors: 0.
Issues: 0.
PASS lightweight frontend QA: all three journeys complete at 375, 768 and 1440; pause/skip persist; HTTP 404 verified.
```

### node /home/user/workspace/bench/skill-v301/scripts/contrast.mjs #18241e #f5dd4a
Start: 2026-10-18T12:43:14.026Z; end: 2026-10-18T12:43:14.114Z; exit: 0.
Final output lines verbatim:
```text
#18241e on #f5dd4a: 11.69:1  body PASS · large PASS · AAA PASS
```

### node /home/user/workspace/bench/skill-v301/scripts/contrast.mjs #18241e #a8d84f
Start: 2026-10-18T12:43:14.115Z; end: 2026-10-18T12:43:14.195Z; exit: 0.
Final output lines verbatim:
```text
#18241e on #a8d84f: 9.61:1  body PASS · large PASS · AAA PASS
```

### node /home/user/workspace/bench/skill-v301/scripts/contrast.mjs #18241e #ff8259
Start: 2026-10-18T12:43:14.196Z; end: 2026-10-18T12:43:14.279Z; exit: 0.
Final output lines verbatim:
```text
#18241e on #ff8259: 6.55:1  body PASS · large PASS · AAA —
```

### node /home/user/workspace/bench/skill-v301/scripts/contrast.mjs #18241e #c3b5ed
Start: 2026-10-18T12:43:14.279Z; end: 2026-10-18T12:43:14.352Z; exit: 0.
Final output lines verbatim:
```text
#18241e on #c3b5ed: 8.51:1  body PASS · large PASS · AAA PASS
```

### node /home/user/workspace/bench/skill-v301/scripts/contrast.mjs #526052 #ddd9c7
Start: 2026-10-18T12:43:14.353Z; end: 2026-10-18T12:43:14.430Z; exit: 0.
Final output lines verbatim:
```text
#526052 on #ddd9c7: 4.70:1  body PASS · large PASS · AAA —
```

### node /home/user/workspace/bench/skill-v301/scripts/completeness.mjs /home/user/workspace/bench/runs/12-paired/b-poster
Start: 2026-10-18T12:43:14.432Z; end: 2026-10-18T12:43:14.550Z; exit: 0.
Final output lines verbatim:
```text
      Legal:       4/4 present
      Edge cases:  2/2 handled
      Admin:       0/0 present · 1 not required (reason given)
      Skeletons:   0/0 present · 1 not required (reason given)
      Template:    17/17 present · 3 not required (reason given)
```

### node /home/user/workspace/bench/skill-v301/scripts/realism.mjs /home/user/workspace/bench/runs/12-paired/b-poster
Start: 2026-10-18T12:43:14.550Z; end: 2026-10-18T12:43:14.645Z; exit: 0.
Final output lines verbatim:
```text
  Content realism  ✓
```

### node /home/user/workspace/bench/skill-v301/scripts/gate.mjs http://localhost:4312/ http://localhost:4312/shop http://localhost:4312/tea/sylhet-black http://localhost:4312/tea/assam-gold http://localhost:4312/tea/ilam-green http://localhost:4312/tea/darjeeling-first http://localhost:4312/tea/nepal-white http://localhost:4312/tea/bangladesh-green http://localhost:4312/subscriptions http://localhost:4312/subscriptions/build http://localhost:4312/cart http://localhost:4312/checkout http://localhost:4312/confirmation http://localhost:4312/account http://localhost:4312/account/subscription http://localhost:4312/estates http://localhost:4312/brewing-guide http://localhost:4312/shipping http://localhost:4312/returns http://localhost:4312/privacy http://localhost:4312/terms http://localhost:4312/contact http://localhost:4312/404 --rules
Start: 2026-10-18T12:43:14.646Z; end: 2026-10-18T12:43:50.274Z; exit: 0.
Final output lines verbatim:
```text
  rules: C0 S0 P0 K0  (rule sets only; no stamp)

http://localhost:4312/404
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
gate: constrained machine (2 CPUs); a failed scan is retried once in the light footprint
```


## Execution history and fixes
- Initial static Account and Subscriptions routes collided with same-named child directories; generated directory index copies as well as extensionless HTML files, then verified both routes.
- A cart change handler rerendered the focused input and caused a native blur/change recursion; replaced that update with in-place line and total changes. Subsequent custom journeys reported no console errors.
- Final-line removal previously attempted to focus a checkout link inside the hidden filled-cart section. Corrected the branch to focus the visible empty-state browse link, copied the shared logic to both directions, and asserted the focus target in extra-states.mjs.
- Extra-state testing caught an eager-image error occurring before the module registered its event listener. The shared handler now checks already-completed broken images as well as later error events, with duplicate protection. Extra-state QA was rerun after this correction.
- Initial rule checks flagged lazy first-screen imagery and a poster account warm-up heading; first catalogue/estate illustrations were made eager and the heading changed. Final rules output is the evidence, not those earlier runs.
- Initial pair comparison with --max 10 failed four repeated routes; a second comparison failed the confirmation route. The archive uses ink response while poster controls use physical movement/print-registration focus; the poster receipt now has its own illustrated composition. Earlier pair-initial and pair-second reports are preserved in a-archival/qa/.
- A final all-route pair run compares 22 shared routes at both widths. The script's title has an “undefined” display field; its parity line, per-route output and JSON provide the actual route count.
- The outer shell call for the final check batch returned a sandbox timeout while the child process continued. Results are taken from the actual completed child logs/manifest, not the timeout response.
- A native View Transition “Transition was skipped” rejection appeared again in the final poster attempt. A direction-specific pagereveal/pageswap handler alone did not eliminate Chromium's early internal rejection. Added a narrow unhandledrejection guard for a DOMException whose message is exactly “Transition was skipped”; unrelated application errors are not suppressed. The complete poster custom suite then reported zero page errors. Earlier failure output is retained and the latest command result is the final verdict. The all-route pair measurement predates only this companion-script insertion and shared cart-focus/image-fallback corrections, none of which changes the normal compared visual composition.
- Helpers to reproduce: node /home/user/workspace/bench/runs/12-paired/a-archival/qa/final-checks.mjs. It serializes browser work. No full gate scan or --journey is invoked.

## Other exact check commands
`node /home/user/workspace/bench/runs/12-paired/a-archival/qa/extra-states.mjs`
Observed direction-specific output:
```text
PASS three-pouch plan: exact tea count, $34.00 total, selection persists after reload.
PASS cart removal: final line removed, empty state survives reload, focus moves to browse link.
PASS corrupt cart recovery: safe empty state, explicit warning, valid subsequent save and reload.
PASS image-error fallback: explanation is visible and purchase control remains usable.
Console errors: 0.
PASS extra frontend states.
```

`node /home/user/workspace/bench/skill-v301/scripts/memory.mjs log --project /home/user/workspace/bench/runs/12-paired/b-poster --dir /home/user/workspace/bench/runs/12-paired/b-poster --brief "Leaf and Ledger tea commerce loud poster paired benchmark" --category ecommerce --archetype none --fonts "Barlow Condensed/DM Sans" --motion "Tier 3 cross-document pack continuity" --signature origin-pack-fan --tier 3`
Observed output:
```text
Logged run #1 to /home/user/workspace/bench/runs/12-paired/b-poster/.motomation/log.json
  fingerprint: tier=3
```

`node /home/user/workspace/bench/skill-v301/scripts/cost.mjs record /home/user/workspace/bench/runs/12-paired/b-poster --out /home/user/workspace/bench/runs/12-paired/b-poster/qa/cost.json`
Observed output:
```text
b-poster · NOT completed (no run.json) · route not stated
  tokens   in 0 · out 0
  time     not recorded wall clock
  tools    0 call(s): none
  retries  0
```

Memory is intentionally project-local to obey the write restriction. Earlier memory recent/similar checks found no prior log. Cost cannot reconstruct usage without the runner's input records.

## What was not verified
- Full scripts/gate.mjs scan and --journey were deliberately not run: benchmark prohibits them on this shared two-CPU machine. No gate stamp, complete accessibility pass, axis J pass or numeric critique score is claimed.
- Rendered pixel contrast for every element, forced colours, complete keyboard traversal, screen readers, real devices, browser compatibility outside installed Chromium, and motion frame-time were not measured; lightweight checks are bounded.
- The viewport reflow checks are not an actual browser 200% zoom audit. Only the skip link received a keyboard assertion; other journeys used standard control interaction.
- No live payments, authentication, mail, shipping, order processing or server-error response was exercised: those services do not exist in this functional frontend.
- No independent visual judge or unrelated-build originality comparison ran: no prior comparison build was available. Pair comparison is same-product direction difference, not aesthetic quality.
- No measured field performance, Lighthouse, SEO indexing or social-preview ingestion; localhost canonicals need a production origin.
- Only selected palette tokens were checked by contrast.mjs; this is not the full rendered-pixel contrast gate.
- Cross-tab synchronization, simultaneous edits and unusual localStorage partial-write failures were not separately asserted; the demonstrated persistence contract covers same-browser reloads.
- cost.mjs could not derive token/tool totals without a runner transcript.jsonl and run.json in the build folder; zero or missing cost fields are not measured free usage.

## Known defects and limitations
- No known blocking defect was observed in the exercised three frontend journeys; this is a bounded test result, not a guarantee.
- No backend services; no real charge, delivery, account identity or email. Checkout collects sample details only and does not persist personal data.
- Fictional tea lots, provenance, policy text, relative caffeine classes and example prices are not factual merchant claims; replace and review them before real launch.
- Production origin is not configured; canonicals, Open Graph and sitemap use localhost:4312.
- Pair comparison passes but labels most routes partial rather than fully recomposed. Its header display bug is retained honestly.
- Source generation produces both .html and directory-index copies for two parent routes; they represent the same canonical route.
- Preview servers are intentionally temporary and are stopped at handoff; run node server.mjs to reopen this direction.
- A private platform preview was uploaded as a convenience; its independent host routing, headers, checkout and 404 response have not been retested. The requested local benchmark folders, not the convenience preview, are the verified deliverables. No remote Git handoff push was attempted.

## Final handoff inventory and shutdown
Exact command: `node /home/user/workspace/bench/runs/12-paired/a-archival/qa/handoff-audit.mjs`.
Preview server processes 10049 and 10050 were stopped with `kill 10049 10050` before this command.
Observed direction-specific final output verbatim:
```text
PASS handoff inventory: required site files, documentation and six checkpoints present.
PASS screenshot inventory: all three core journeys at 375 and 1440; intermediate 768 captures also retained.
PASS rule-output inventory: 23 routes each report rules: C0 S0 P0 K0.
PASS preview shutdown: port 4312 does not respond.
```
Local Git repositories were initialized only at the final handoff, not at the earlier build milestones. This is a workflow limitation; no earlier commits are invented. No remote repository was used.
