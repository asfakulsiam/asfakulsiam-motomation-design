// Assemble verification reports from the actual saved stdout, without manufacturing verdicts.
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFile(resolve(root,name),'utf8');
const fence=s=>'```text\n'+s.trimEnd()+'\n```\n';
const [complete,realism,rules,qa,edge]=await Promise.all([
 read('checks/completeness.log'),read('checks/realism.log'),read('checks/rules.log'),read('checks/qa.log'),read('checks/edge-qa.log')
]);
const sitemap=await read('sitemap.xml');
const urls=[...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m=>m[1]).concat('http://localhost:4301/404');
const skill='/home/user/workspace/bench/skill-226085d/scripts';
const expanded=`node ${skill}/gate.mjs ${urls.join(' ')} --rules --tier 1 --light`;
const gate=`# Verification

## Measured

The following is saved stdout/stderr from checks actually run on the final frontend. These are rule-only results, not a full gate pass. All paths are from the benchmark folder; no package was installed.

### Completeness
\`node ${skill}/completeness.mjs ${root} 2>&1 | tee checks/completeness.log\`

${fence(complete)}
### Content realism
\`node ${skill}/realism.mjs ${root} 2>&1 | tee checks/realism.log\`

${fence(realism)}
### Rule sets, all 24 routes
\`node checks/run-rules.mjs\` executes exactly:

\`${expanded}\`

${fence(rules)}
### Lightweight custom journey QA
\`node checks/qa.mjs\`

${fence(qa)}
The custom QA performs real user input through every booking step, not storage-seeded core-journey signoff. Three journeys at three viewport widths produce nine completions. The 24 route responses include the designed HTTP 404. Its 40 captures comprise 13 core states at each width and one mobile 404.

### Supplementary negative-state and palette QA
\`node checks/edge-qa.mjs\`

${fence(edge)}
The overlap/removal negative test alone stages a labelled local record. The primary booking journey does not. Palette math does not measure text antialiasing or all rendered pixels. Map iframe insertion is checked without claiming that third-party tiles rendered.

## Judged

self (opinion): the complete frontend matches the contract, with distinct discovery and booking density. Representative screenshots inspected: both home viewports; desktop room list; mobile room list; mobile and desktop room/calendar views; mobile guests; tablet details; mobile and desktop review and confirmation; desktop experience addition; mobile arrival and contact pending/error states.

self (opinion): retain the JSON-LD advisory rather than publish fictitious Hotel/Organization claims. Canonical/social/sitemap origins are the real local origin, not an invented public domain. Replace them only after obtaining a verified deployment origin.

self (opinion): eleven temporary generated media files must be replaced or cleared for a real launch. No claim of production readiness, WCAG certification, exceptional-design score or independent review is made.

## Not verified

The benchmark prohibits the full gate scan and its --journey mode; neither ran. No full gate stamp, layout/craft score, originality axis or all-axis pass is claimed.

Rule-only checks cold-open guarded booking routes, so some measurements see the honest missing-draft interface rather than a populated form. Populated forms and confirmation were separately exercised and captured by the custom QA.

No physical device, screen reader, Safari/Firefox, exhaustive keyboard order, text zoom, rendered-pixel contrast audit, CWV/LCP/CLS trace, production security audit, map tile/network reliability or load test. No reservation backend, live inventory, payment processing, messaging or channel sync exists.

The local server is stopped at handoff; rerun \`node server.mjs\` to inspect at port 4301. Any attached static preview is supplementary; the benchmark's HTTP-status behavior is implemented and checked by server.mjs.
`;
await writeFile(resolve(root,'GATE.md'),gate);
const run=`# Benchmark run · travel booking

## Identity and bounds
- Model ID: not exposed by this subagent runtime; unavailable, not guessed.
- First recorded execution UTC: 2026-10-18T10:41:18.286Z, from the first tool-output file timestamp. Exact invocation start was not exposed.
- Final report generation UTC: ${new Date().toISOString()}. Final stop/end receipt appears below after shutdown.
- Route: full Thinking Sequence. Delivery: functional frontend.
- Input skill: /home/user/workspace/bench/skill-226085d/ (read-only).
- Input brief: /home/user/workspace/bench/08-travel-booking.md (read-only).
- All authored files, generated/downloaded media, captures, git history and report outputs remain under ${root}/. No edits to /home/user/workspace/repo.
- Local server: Node 20 static server, port 4301 only; no framework and no package installation.

## Tools available and used
Available: bash, read, apply_patch, load_skill, search_web, fetch_url, exec/exec_wait, share_file; deferred image-generation, deployment and cloud-browser tools; preinstalled Node, git, sharp, Playwright and Chromium. Local user browser unavailable.

Used: bash for build/server/check commands and downloads; read for the input skill, brief, reports and rendered screenshots; apply_patch for manual edits; search_web and fetch_url for public design/product/official sources recorded in DESIGN.md and MEDIA.md; load_skill for platform website/search/media/browser guidance; exec to discover tools and generate imagery. Three GPT Image 2.5 Flare generations supplied the illustrative landscape, double and twin interior sources. Playwright/Chromium were used through local Node scripts, sequentially, never two browsers at once. sharp produced WebP derivatives. git records local milestones. Deployment use, if completed, is recorded in the preview receipt below.

Not used: npm/package installs, a real browser login, external forms, payment services, contact messaging, permanent publication or a remote repository push. No browser purchase or external booking was made.

## Exact verification commands and actual output
Commands below ran from \`${root}\`. No full scripts/gate.mjs scan or --journey call ran. Output blocks are read from saved final logs, not reconstructed verdicts.

### Media naming and build
\`node checks/name-temporary-media.mjs | tee checks/media-naming.log\`

${fence(await read('checks/media-naming.log'))}
This mechanical migration moved all eleven temporary generated binaries to placeholder-prefixed names without removing their contents, and updated references. Original generation output basenames are recoverable by removing the prefix.

\`node build.mjs | tee checks/build.log\`

${fence(await read('checks/build.log'))}
\`node --check app.js && node --check build.mjs && node --check server.mjs\`

Observed: exit 0, no output. This is syntax checking only.

### Core journey QA
\`node checks/qa.mjs\`

${fence(qa)}
### Additional negative-state QA
\`node checks/edge-qa.mjs\`

${fence(edge)}
### Required completeness
\`node ${skill}/completeness.mjs ${root} 2>&1 | tee checks/completeness.log\`

${fence(complete)}
### Required realism
\`node ${skill}/realism.mjs ${root} 2>&1 | tee checks/realism.log\`

${fence(realism)}
### Required rule-only gate
Wrapper: \`node checks/run-rules.mjs\`

Expanded exact command:
\`${expanded}\`

The per-route output is pasted verbatim in GATE.md and retained in checks/rules.log. Final verdict lines:

${fence(rules.split('\\n').filter(s=>s.includes('rules:')||s.includes('RULES CHECK EXIT:')).join('\\n'))}
### Earlier diagnostic checks and fixes
\`node checks/qa.mjs --smoke\` — initial two-viewport smoke test; no full journey claim from that run.
\`node checks/diagnose.mjs\` — saved diagnostics of selected calendar date and visible inputs.

Early custom QA attempts stopped on test-selector assumptions: a selected calendar day no longer matched its available-day accessible name; a hidden room image at tablet width was not scrollable; and tablet navigation required the menu. Selectors were corrected to reflect the actual UI. A stale consent error after ticking the checkbox was a real UI defect and was repaired; long room option text was shortened.

First rule run (checks/rules-initial.log) flagged literal HTML map insertion under sec-12 and the first experience image being lazy under perf-03. The map now uses DOM methods; the first image is eager. Revised preview was self-approved, then rules and core/edge QA were re-run on the final frontend.

## Evidence and scope
24 routes including a designed 404; 23 sitemap destinations. The custom QA records 3 core journeys at 375, 768 and 1440 pixels. The screens folder contains the 40 main journey/error captures, 8 supplemental state/viewport captures and one retained diagnostic image. All six checkpoints and the rule-correction follow-up are in CHECKPOINTS.md.

Source record: DESIGN.md identifies actual opened sources, observations and limitations; MEDIA.md records generated sources, temporary status, self-hosted fonts and actual license URLs. No competitor photo or application code was copied. No fabricated testimonial, award, property contact number or address was added.

## Known defects and launch blockers
- No known unresolved functional failure in the exercised Chromium journeys; this does not imply exhaustive correctness.
- Eleven generated media files are temporary and require replacement/approval before production. Family/single-room illustrations do not verify actual bed layouts.
- JSON-LD advisory remains on each route; no fictitious Hotel/Organization data was published.
- The property is fictional, so no real address or property map pin is invented. Arrival notes explicitly say not to travel to this demo.
- Booking and messages save locally only. No live inventory, payment, email, channel sync or multi-user concurrency backend exists. These are declared delivery boundaries, not hidden integrations.
- Localhost metadata is intentional for the benchmark and must change before public launch.

## Not verified
Full gate scan and --journey: not run, explicitly prohibited. No full stamp or H/M/V/Q/A/S scores; no originality comparison score or independent judge. Cold-open rule checks on guarded booking pages see their missing-draft interface, while custom QA covers their populated state.

No real map-tile rendering claim, physical mobile device, Safari/Firefox, screen reader, full keyboard audit, 200% zoom, exhaustive pixel contrast, Core Web Vitals, real email/payment/inventory/security/load test or production hosting configuration. The optional map's iframe insertion and local download event were verified, not third-party network reliability.

Token use, API cost and exact model identifier are not exposed. Any cost-script zeroes resulting from absent runner transcript/run.json must not be interpreted as actual usage or a failed frontend.
`;
await writeFile(resolve(root,'RUN.md'),run);
console.log('REPORTS WRITTEN: GATE.md and RUN.md contain verbatim final check logs and explicit limits.');
