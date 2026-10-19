# Ledgerly judge scores

Model identity: **not exposed**.

Independent evaluation of `/home/user/workspace/bench/runs/05-saas-dashboard` (`dist/`). Served with `PORT=4410 node server.mjs` because port 4305 was already taken by another Node process. This judge did not edit the build.

## Commands and exits

| Command | Exit | Raw output |
|---|---:|---|
| `node /home/user/workspace/bench/skill-52255c0/scripts/completeness.mjs /home/user/workspace/bench/runs/05-saas-dashboard` | 0 | `logs/completeness.log` |
| `node /home/user/workspace/bench/skill-52255c0/scripts/realism.mjs /home/user/workspace/bench/runs/05-saas-dashboard` | 0 | `logs/realism.log` |
| `node /home/user/workspace/bench/skill-52255c0/scripts/gate.mjs http://localhost:4410/dashboard --design .../DESIGN.md --journey --timeout 900 --no-record` | 0 | `logs/gate-journey.log` |
| `node /home/user/workspace/asfakulsiam-motomation-design/evals/keyboard-walk.mjs .../dist --routes /sign-in,/dashboard,/transactions,/transactions/detail,/expenses/new,/expenses/saved,/invoices,/invoices/new,/invoices/preview,/invoices/sent,/customers,/settings,/empty,/error,/offline,/404 --start /sign-in --journey "Continue to demo>Add expense>Save expense" --json` | 0 | `logs/keyboard-walk.json` |
| same tool, `--start /dashboard --journey "Invoices>New invoice>Save & preview\|Transactions>Category"` | 0 | `logs/keyboard-walk-j2j3.json` |
| `node bench/judge/05-saas-dashboard/walk.mjs` (Playwright, 1440 and 375) | 0 | `logs/walk.json`, `screens/` |
| earlier `walk.mjs` attempts | 1, then 1 | import error, then offline `page.goto` destroyed the context; not product results |
| `node bench/judge/05-saas-dashboard/followup.mjs` | 0 | `logs/followup.json` |
| `scripts/contrast.mjs` on documented ink/muted/action/forest pairs | 0 | `logs/contrast-tokens.log` |

Gate journey stamp reproduced: `journey: nav0 mobile0 forms0 loading- errors0 session0 → PASS`. Completeness: routes 16/16, journeys 3/3, functions 4/4, states 4/4, template 19/19. Realism: clean.

Full `gate.mjs` axes c/o/w/rm/a/n/q/k were **not** re-run. Only `--journey` was required and run. Pixel contrast, overflow, forced colors, and the critique stamp were not independently reproduced.

## Gate verdicts

### Product integrity: PASS

Evidence: `logs/completeness.log`, `logs/gate-journey.log`, `logs/walk.json`, `screens/d-03` through `d-16`, `screens/m-03` through `m-16`, `screens/d-32-404-clean.png`, `screens/m-32-404-clean.png`.

- Required routes exist and were opened: sign-in, dashboard, transactions (sort, filter, pagination), transaction detail, add expense, invoices, invoice editor, preview, customers, settings (profile, business, notifications, bank, workspace), empty guide, error/recovery, offline guide, designed 404.
- Core journeys completed at 1440 and 375 with no page errors:
  - Sign-in invalid name, then “Jordan Hale” → dashboard. Empty expense submit blocked. Save “Harbor Paper” $42.75 Supplies. Confirmation, then expenses moved from $2,732.30 (8) to $2,775.05 (9) and survived reload. Recent list showed Harbor Paper.
  - Invoice due-before-issue with a filled line stayed on `/invoices/new` with “Due date must be on or after the issue date.” Valid line 3 × $18.50 + 8% tax calculated $59.94, previewed, Mark sent, landed on `/invoices/sent` for INV-1045, and the awaiting-payment filter listed it. Copy states no email was sent.
  - Transactions filtered to Inventory and 2026-10-14–2026-10-19 returned Cedar Wholesale and Terrace Ceramics. Opening the first row showed Cedar Wholesale, category Inventory. Back preserved the filter. Sort “Amount, lowest first” led with Garden Lane Properties (largest signed expense). Pagination moved 1–8 of 19 to 9–16 of 19.
- Deferred interfaces stay visible and labelled. Sign-in says authentication is deferred and is not a password form. Settings bank control is disabled: “Connect bank · unavailable”, badge “Deferred”. Mark sent is a local status only.
- Empty workspace confirm clears records to $0.00. Corrupt `localStorage` opens recovery instead of a blank crash. Already-open offline save of “Offline kiosk” $9.50 reached `/expenses/saved` and in-app navigation to the dashboard still showed the row, with the offline banner.
- Unknown URL and `/404` return HTTP 404 and render “Page not found” when storage is readable (`logs/followup.json`).

### Usability: PASS

Evidence: `screens/m-03-dashboard.png`, `screens/m-14-transactions.png`, `screens/m-04-expense-form.png`, `logs/walk.json`, `logs/followup.json` keyboard-only steps.

- At 375px the Add expense control is on screen, 125×44px, and the five-item nav is visible without truncation.
- Keyboard-only (Tab, type, Enter, no mouse) at 375px: display name → Continue to demo → Add expense → merchant and amount → Save expense → `/expenses/saved` (“Key Merchant” $15.25). Screenshot `screens/m-35-keyboard-saved.png`.
- Invalid sign-in, expense, profile, invoice date, and date-range states show recoverable messages. Primary path does not depend on hover.
- Text on reviewed screens is readable. Defects below do not block the three jobs.

### Accessibility: PASS

Evidence: `logs/keyboard-walk.json`, `logs/followup.json` reduced-motion and keyboard-only, `logs/contrast-tokens.log`, `src/styles.css` reduced-motion rule (read, not edited).

- Every sampled route’s first Tab stop is “Skip to content”. No focus trap. No focus-not-visible and no hidden-but-focusable stops in the keyboard-walk sample (16 routes).
- Primary action is reachable and completable by keyboard, including typed fields (the stock keyboard-walk tool does not type; see disagreements).
- Reduced motion: button `transitionDuration` is `0s`, `animationName` is `none`.
- Body/token pairs measured with `contrast.mjs` are above 4.5:1 (ink 13.10 on ground, muted 5.78, white on action 6.55). Visual review did not find unreadable body text. A naive ratio against transparent computed backgrounds was discarded as invalid.
- No lorem, TODO, or placeholder-component leaks (`realism.mjs` exit 0; reading).
- Not a certification. Screen readers, forced colors, and the full pixel gate were not re-run.

### Content truth: PASS

Evidence: `logs/realism.log`, `src/data.js` (read-only), `screens/d-01-signin.png`, `screens/d-03-dashboard.png`.

- Seed is marked fictional. Sign-in sales figure is labelled “Illustrative sample records · October 19, 2026” and matches the seed ($684.00 = 68400 cents). Dashboard totals are computed from records, not presented as a real client’s results.
- No testimonials, award badges, real-company logos, or unsourced proof claims. Customers are fictional shops with example.com mail. Auth, bank sync, and email are labelled unavailable.
- Demo strip on the signed-in shell says fictional records stay in the browser.

## Rubric axes (all gates passed)

| Axis | Score | Evidence |
|---|---:|---|
| Concept | 4 | Warm working ledger is consistent in the shell (forest/ochre, compact panels, honest local copy). Sign-in is a separate editorial split, so the idea is not felt on every screen. |
| Originality | 3 | Conventional app rail, metrics, and tables. Fresh choices are the warm paper palette, local-only honesty, and labelled deferred bank/auth. Not a template clone, not unexpected structure. |
| Typography | 4 | DM Sans carries dense figures; tabular numbers; headings 25–28px in the shell. Georgia is a small wordmark/sign-in accent. 12px captions remain. Mobile sign-in drops a space (defect). |
| Motion | 4 | Press feedback only (120ms). No scroll choreography, count-up, or route delay. Reduced motion zeroes it. Motion does not tell a story; it correctly stays out of data entry. |
| Craft | 4 | Reviewed 1440 and 375 screens are aligned, with no horizontal overflow on the six routes measured (`scrollWidth` equals `clientWidth`). Not pixel-perfect: sentence join, empty-ledger copy, tight top nav. |
| Access & performance | 4 | Skip link, visible focus, keyboard completion, AA token pairs, instant local saves. Not a 5: some targets are under 44px on desktop (Add expense measured 42px tall at 1440), cold offline is unsupported, assistive tech not verified. |

Weighted total = (4×20 + 3×20 + 4×15 + 4×15 + 4×15 + 4×15) / 5 = **76**.

## Extra scores

| Item | Score | Evidence |
|---|---:|---|
| Journey completeness | 5 | All three brief journeys finish at 1440 and 375, including reload, tax math, filter-to-detail, and back. |
| Information architecture | 4 | Five destinations, settings sections, and task depth are obvious. Empty-transactions copy is the wrong state. Leave demo is hidden under 760px (`sidebar-bottom { display:none }`); sign-in remains under Settings. |
| Responsive usability | 4 | Tables become labelled records; filters stack; primary buttons are 44px at 375. Nav sits at the top, not a bottom thumb bar, but labels fit. |
| Motion quality and restraint | 5 | No motion delays entry. Reduced-motion path exists. Matches the brief’s “never delay data entry” pressure. |
| Content realism | 4 | Labelled fictional shop, computed figures, no fake logos or testimonials. Empty-state wording on transactions is the slip. |
| Technical reliability | 4 | localStorage save, offline already-open save/navigation, corrupt-storage recovery, and HTTP 404 all worked in this Chromium. Cold offline start and real devices were not verified. |

## Bias probe

Signed-in shell: no hero, no scroll-driven animation (`scroll-behavior: auto`, running animations 0 on the dashboard), navigation and table headers kept. Pass for the workspace itself.

Sign-in does not pass the probe cleanly. `screens/d-01-signin.png` is a two-column editorial opening: Georgia 48px “Back to your books.”, tagline, and a sample sales card. At 375px the sales card is hidden and the headline remains 37px serif (`logs/walk.json` `signinHeroProbe`). The expense aside also uses a Georgia line, “A tidy ledger starts here.” That is warmth, not a second archetype. No scroll choreography anywhere reviewed.

## Disagreements with the builder

- `DESIGN.md` says the decorative greeting hero was cut and that there is no hero. The signed-in overview has no hero. The sign-in route still is one. That claim is only true inside the workspace shell.
- Handoff text “the journey check ran, passed and left nothing unverified” is the tool’s sentence and matches this re-run’s PASS line. The same tool output, which the builder also quotes in `GATE.md`, says `/expenses/saved`, `/invoices/sent`, and `/404` are outside the link graph and `/error` was not tap-sampled. “Nothing unverified” overstates coverage. The gaps are real; this judge closed them with `walk.mjs` and `followup.mjs`, not with the gate’s sampler.
- Builder expense total change $2,732.30 → $2,775.05 was reproduced. Completeness 16/16 and journey PASS were reproduced. Those claims hold.
- `keyboard-walk` reported the expense journey `ok: true` after Enter on Save expense, but it ended on `/expenses/new` because the tool does not type required fields. That `ok` is not a completed save. A separate keyboard-only Playwright walk that types did complete the save. Do not treat the stock tool’s `ok` as journey completion.
- `keyboard-walk` failed to reach “Category” on `/transactions`. Its name extractor ignores `<label for>`. The select is labelled in the UI and was used successfully in the Playwright walk. Not an app defect.
- Builder did not list two defects found here: mobile sign-in sentence join, and new-account transactions empty copy.
- Critique stamp `C5 … gate: c0 o0 w0 rm0 a0 n0 q0 k0` was not re-measured. No agreement or disagreement with those numbers.

## Defects

1. Mobile sign-in hides the `<br>` (`@media (max-width:760px) .signin-intro>p br{display:none}`) and concatenates sentences: “Sales, expenses and invoices.A clear place to keep them together.” `screens/m-01-signin.png`.
2. A new empty ledger on `/transactions` uses the filter-miss empty state: “No matching transactions / Try a different search, category or date range” plus Clear filters, even when filters are already clear. `screens/m-26-empty-transactions.png`. Dashboard empty copy is the correct one (`screens/m-25-empty-dashboard.png`). Invoices uses “No invoices in this view”, which is milder but still filter-framed.
3. Sign-in is an editorial hero inside a required app route, against the bias probe and the builder’s own cut list. `screens/d-01-signin.png`.
4. Leave demo is removed from the mobile shell (`sidebar-bottom` hidden). Recoverable via Settings → Sign-in interface, so not a journey break.
5. Desktop Add expense measured 42px tall (1440). Builder already reported ten targets in the 24–43px warning band. Not re-counted here. Under the rubric, that is not a hard fail (hard fail is keyboard miss or body contrast).
6. If storage is unreadable, unknown URLs render the recovery state instead of 404 (`render()` prefers `readError`). Healthy storage shows the designed 404. Contaminated shots `screens/d-32-404.png` and `m-32-404.png` are from the first walk order and are not 404 evidence. Use `*-404-clean.png`.

## Not verified

- Full `gate.mjs` contrast, overflow, words, reduced-motion pixel diff, names, numbers, quality, and access counts (c o w rm a n q k). Only `--journey` was re-run. Token contrast and visual reading are not a substitute for that pixel scan.
- Screen readers, forced colors, Safari, Firefox, and physical phones.
- Cold offline launch/reload. The tested offline path starts from an already-open page, matching the builder’s limit. No service worker was claimed or found.
- Cross-tab write conflict, CSV/JSON download, and customer dialog save were not re-exercised. Builder logs exist; they were not treated as proof.
- Easing of the 120ms press was not recorded. Motion score does not depend on that timing.
- Whether the process already bound to port 4305 is this build.
