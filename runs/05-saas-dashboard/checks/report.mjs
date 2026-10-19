import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),read=p=>readFileSync(resolve(root,p),'utf8');
const commands=['checks/commands.jsonl','checks/commands-journal.log'].filter(p=>existsSync(resolve(root,p))).flatMap(p=>read(p).trim().split('\n').filter(Boolean).map(x=>JSON.parse(x))).sort((a,b)=>a.start.localeCompare(b.start));
const raw=name=>existsSync(resolve(root,'checks',name+'.log'))?read('checks/'+name+'.log'):'NOT RUN';
const gate=commands.filter(c=>c.name.startsWith('full-gate-')).at(-1),gateRaw=gate?raw(gate.name):'NOT RUN';
const completeness=commands.filter(c=>c.name.startsWith('completeness-')).at(-1)?.name||'completeness-03';
const handoffRaw=raw('handoff-final'),handoff=handoffRaw.match(/^handoff:.*$/m)?.[0]||'handoff: NOT VALIDATED · handoff command has not been recorded';
const stamp=gateRaw.match(/(?:PASS|FAIL)  stamp → (.*)/)?.[1]||'No measured stamp available.';
const end=new Date().toISOString();
const table=commands.map(c=>`| ${c.name} | \`${[c.command,...c.args].map(x=>JSON.stringify(x)).join(' ').replace(/\|/g,'\\|')}\` | ${c.exit===null?'interrupted / no code':c.exit} | ${c.start} → ${c.end} | \`checks/${c.name}.log\` |`).join('\n');
const core=JSON.parse(read('checks/journey-results.json'));
const extended=JSON.parse(read('checks/extended-results.json'));
const text=`${handoff}

# Ledgerly independent benchmark run

## Identity, timing and location
- Model identity: **not exposed**; no model name inferred.
- Start: **2026-10-19T05:11:09+00:00**, the first explicitly recorded clock observation; initial brief/skill reads preceded this observation and their exact start was not captured.
- End/report generated: **${end}**.
- Output root: \`/home/user/workspace/bench/runs/05-saas-dashboard/\`.
- Read-only inputs: \`/home/user/workspace/bench/runs/05-saas-dashboard-TASK.md\`, \`/home/user/workspace/bench/05-saas-dashboard.md\`, and \`/home/user/workspace/bench/skill-52255c0/\`.
- Final application output: \`dist/\`; source: \`src/\`; retained early intermediate: \`site/\` (not final).
- Local preview: \`npm run build && npm run dev\`, then \`http://localhost:4305/sign-in\` or \`/dashboard\`. No installation is required. No deployment, publishing, push, purchase or external form submission was performed.

## Computed handoff
The first line is copied from the actual \`handoff.mjs\` output, not self-assigned. Full raw output is in \`checks/handoff-final.log\`; the gate's persisted record is \`.motomation/gate-record.json\`. The report agreement check is separately recorded in \`checks/handoff-report.log\` when run. Neither checkpoint pre-approval nor the custom journey test substitutes for this status.

\`\`\`text
${handoffRaw.trim()}
\`\`\`

## Build and product
A warm, compact signed-in finance workspace, using native HTML/CSS/JavaScript, a Node static server, local DM Sans fonts and localStorage. Static route entry files coexist with History API navigation; already-open offline saving/navigation is supported, but cold offline starts/reloads are not. All required interfaces remain present. Authentication, bank sync and email delivery are explicitly unavailable/deferred; “Mark sent” only changes local status.

The fictional reference date is October 19, 2026. Dashboard totals, cash-flow bars, invoice totals and outstanding amounts are calculated from records, not presented as real client statistics. Profile, business, notification preferences, expense/invoice/customer changes and selection survive reload. View filters are transient. Context and research URLs are recorded in \`DESIGN.md\` and \`craft/research.md\`; data contracts in \`SCHEMA.md\` and \`DATA.md\`.

## Exact recorded commands and real exits
The command recorder executes in this output root, with \`MOTOMATION_HOME\` set to \`/home/user/workspace/bench/runs/05-saas-dashboard/.motomation\`, a 1,800,000ms subprocess timeout and a 100MB output buffer. The exact runner invocation is \`node checks/run.mjs <name> <command> <args...>\`. The table gives each executed subprocess verbatim. Raw stdout/stderr, command, start/end and exit are in the named log.

| Check name | Exact command | Exit | UTC interval | Raw output |
|---|---|---:|---|---|
${table}

Report generation itself: \`node checks/run.mjs report-final node checks/report.mjs\`; its real exit/output is stored in \`checks/report-final.log\` after generation.

### Logging limitations
Some early exploratory shell reads/discovery commands and web-tool result bodies were not retained as separate raw terminal logs. Research URLs and observed/unverified distinctions are retained in the design records, and the required skill instructions were re-read into \`checks/input-guidance.log\`. This does not pretend those re-reads are the original output. A first preview-server wrapper was interrupted with Ctrl-C before it could flush its child output; that attempt is not a validation result. The replacement live server's startup output is in \`checks/preview-server-live.log\`. Apply-patch edits and tool image reads are not shell commands.

## Actual validation excerpts
### Completeness
\`\`\`text
${raw(completeness).trim()}
\`\`\`

### Latest full gate, including J
Command name: \`${gate?.name||'NOT RUN'}\`; real exit: **${gate?.exit??'unknown'}**. Every line is preserved in \`checks/${gate?.name||'missing'}.log\`; the following is its actual measured stamp, not a claim that it passes:
\`\`\`text
${stamp}
${gateRaw.split('\n').filter(l=>/journey:|coverage \\d|layout 4|EXIT:|START:|END:/.test(l)).join('\n')}
\`\`\`

### Browser task assertions
- Latest core journey test result: \`${core.pass}\`, \`${core.started}\` to \`${core.ended}\`; detailed assertions in \`checks/journeys.mjs\` and results in \`checks/journey-results.json\`.
${core.widths.map(w=>`- ${w.width}px: ${w.coreJourneys}; ${w.screenshots} full-page steps plus viewport captures, ${w.pageErrors.length} browser page errors; expense total ${w.expenseBefore} → ${w.expenseAfter}.`).join('\n')}
- Includes sign-in → expense → updated dashboard; invoice line/tax math → preview → local mark sent; date+category filtering → transaction detail. Reload assertions cover expense totals, invoice status, customer creation and settings. Additional assertions cover sorting/pagination, empty workspace, storage read recovery and failed writes retaining input.
- Extended test result: \`${extended.pass}\`. Actual recorded lines:
\`\`\`text
${extended.results.join('\n')}
\`\`\`

## Screenshots and visual review
\`screens/\` contains each core step at 1440px and 375px, plus 768px. Names 01–16 cover the requested journeys; 17–28 cover extra states. \`*-viewport-*.png\` are viewport captures, the corresponding numbered PNGs are full-page captures. Contact sheets \`review-<width>-<n>.jpg\` are review aids; original PNGs are the evidence. Early \`initial-*.png\` are explicitly intermediate, not final. Representative full-size screens and the contact sheets were read visually. Specific review changes: 12px caption floor, corrected input error styling, skip-link hiding, more space for the Transactions navigation label, larger profile/data targets, forced-color table styling, honest offline navigation and a compact 404.

## Earlier failures and fixes
- \`component-search\` returned exit 2 because “components” is not a supported search dataset. The build instead adopts native platform form/dialog primitives; no unsupported result was claimed.
- The first completeness run failed during initial setup and before the build completed; output initially used \`site/\`, whereas route discovery expects \`dist/\`, \`out/\` or \`public/\`. Build output, scope formatting and missing contracts/data/template files were corrected. The failed output remains intact.
- Full gate 01 returned exit 1: two narrow navigation text overflows, one undersized Manage data link, one forced-color text failure, six invoice links unavailable after persisted status filtering, three local-save full-document navigation loading complaints, and the not-found probe could not see the error in its first 200 characters or a root-home link. The actual complete output is in \`checks/full-gate-01.log\`.
- Fixes: responsive column allocation, touch-target sizing, forced-color table ink/background, transient invoice filter state, same-document History API navigation with immediate local feedback, and dedicated styled 404 with root-home link. No arbitrary “saving” delay, fake server or weakened gate was introduced.
- The latest gate result above supersedes the first; a command returning nonzero is never called a pass.
- A final integrity review changed amount ordering from absolute magnitude to the actual signed displayed amount, made the business monogram follow saved business names, and blocked sign-in from overwriting unreadable records. The expanded assertion now parses expense minus signs, checks the updated monogram, and confirms corrupt data is unchanged after attempted sign-in. Any earlier full scan is superseded by the last full scan after these fixes.
- Full gate 02 returned exit 1 despite a passing J line: nav0 mobile0 forms0 loading- errors0 session0, 149/149 interactions and 30/30 local-form states. One forced-color cell in a closed native details table still failed. The table now has explicit display:none while closed; opening retains the semantic data table. The targeted forced-color check records closed cells with zero rectangles and open cells with visible black ink on white system background. Its evidence is in \`checks/forced-colors-01.log\` and \`screens/forced-colors-*.png\`.

## Known limitations and NOT VERIFIED
- Not a production accounting service. Secure authentication, authorization, server persistence, encryption, bank connection, real email/notifications, payments, remote backup and multi-user transactional locking are **not implemented or verified**; backend interfaces are visibly deferred. No real financial/personal data should be entered.
- Cold offline launch/reload is **unsupported**, not claimed as working. Offline test starts from an already-open workspace. There is no service worker.
- Income/sales records are seeded examples; a separate sale-entry/reconciliation workflow, invoice-payment collection, refunds, attachments and CSV/JSON import are outside this build. CSV/JSON export is implemented. USD only; no jurisdictional tax-compliance claim.
- Formal screen-reader audit, all keyboard paths/modal focus-return permutations, real mobile devices, Safari/Firefox and assistive technology are **not verified**. Chromium skip-link/Tab/focus and Escape checks are a limited automated keyboard exercise, not a full accessibility certification.
- Production hosting/HTTPS, DNS, search indexing, social-card consumers, real backend failure handling and field Core Web Vitals are **not verified**, since deployment/external actions are forbidden. Local gate performance/security results do not prove these.
- Cross-tab read-only refresh is tested. Active forms block submit after an update and ask for reload, but simultaneous-write race conditions are **not exhaustively verified**; localStorage is not an ACID database.
- Originality against unrelated builds is **not measured**: this is an independent one-build benchmark with no comparison corpus. No originality score is invented.
- Gate sampling is exactly what its log says, not proof that every later step or every control on every record was exercised. Custom tests add explicit three-journey and edge-state evidence, but do not erase any machine-computed exceptions. If handoff reports exceptions, they remain listed in \`GATE.md\` and the status is not upgraded in prose.

## Design artifacts and checkpoint honesty
\`DESIGN.md\`, \`MOTION.md\`, \`MEDIA.md\`, \`SCHEMA.md\`, \`DATA.md\`, \`CHECKPOINTS.md\`, \`GATE.md\` and \`CRITIQUE.md\` retain the decisions and evidence. Checkpoints are pre-approved only by the benchmark instruction, not a human visual approval. Work remained local; there is no shipping push or deployment URL.
`;
writeFileSync(resolve(root,'RUN.md'),text);
process.stdout.write(`Wrote ${resolve(root,'RUN.md')}\n${handoff}\nEnd/report time: ${end}\n`);
