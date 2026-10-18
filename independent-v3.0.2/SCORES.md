# Independent visual scoring — v3.0.2 evaluation

## Summary

| Build | Product integrity | Usability | Accessibility | Content truth | Weighted result |
|---|---|---|---|---|---|
| 03-b2b | FAIL | FAIL | FAIL | FAIL | **not scored (gate failed: Product integrity, Usability, Accessibility, Content truth)** |
| 08-travel-booking | PASS | PASS | PASS | PASS | **70/100** |
| 12a-archival | PASS | PASS | PASS | PASS | **81/100** |
| 12b-poster | PASS | PASS | PASS | PASS | **84/100** |

The B2B failures include reproduced false submission confirmations, broken mobile header reflow, insufficient body-link contrast and fabricated customer/security claims; the other three builds completed their primary local-demo journeys in a real Chromium browser. ([B2B journey evidence](journey-evidence.json), [other journey evidence](journey-followup-evidence.json), [route/reflow audit](initial-browser-audit.json), [contrast evidence](extra-evidence.json))

**Pair verdict: FAIL the rubric's strict every-axis-below-0.4 test**, despite visibly different directions and preservation of the shared product contract. ([independent originality result](pair-originality.txt), [independent originality data](pair-originality.json), [shared journeys](journey-followup-evidence.json))

## Method and interpretation

I applied the four gates before computing weighted totals, using Concept 20%, Originality 20%, Typography 15%, Motion 15%, Craft 15%, and Access & performance 15%; the v5-only imagery exception was not applied to these v6 briefs. ([rubric](/home/user/workspace/repo/evals/rubric.md), [B2B brief](/tmp/bench/briefs-used/03-b2b.md), [travel brief](/tmp/bench/briefs-used/08-travel-booking.md), [12a brief](/tmp/bench/briefs-used/12a-paired-archival.md), [12b brief](/tmp/bench/briefs-used/12b-paired-poster.md))

I looked at the supplied 375/1440 homepage, inner-page, focus and reduced-motion images with the image-reading tool, then used a single Chromium browser at a time for interactions, request observation, route checks and new screenshots. ([supplied screenshots](/tmp/shots/scoring/), [browser test implementation](journeys.cjs), [additional checks](extra-checks.cjs))

The route audit opened 20 B2B, 24 travel, 23 archival and 23 poster addresses, including their explicit 404 pages, and measured document width at both 320 and 375 px. ([route/reflow audit](initial-browser-audit.json))

“Tab/Enter/Space-only” below means those keys for navigation/activation, with printable characters used solely to enter required text: no mouse, programmatic focus or arrow keys in the travel and tea primary checkout journeys. ([journey implementation](journeys.cjs), [completed primary journeys](journey-followup-evidence.json))

Motion judgments use the verified eight-frame, evenly spaced desktop scroll strips first, plus live animation/reduced-motion observations; the earlier unqualified `*-scroll-strip.jpg` captures were superseded because smooth scrolling made their positions unreliable. ([verified scroll positions](verified-scroll-evidence.json), [motion observations](extra-evidence.json), [verified capture implementation](scroll-verified.cjs))

## 03-b2b — Cargoline

### Gates

- **Product integrity — FAIL.** Submitting `/contact` produced “Inquiry Received” and “Your inquiry has been registered” with **zero requests**; `/demo` navigated to “Your Demonstration Request is Confirmed” and promised engineer contact within two business hours, with only page/assets GETs and no lead submission or UI disclosure that the submission was simulated. ([request and UI evidence](journey-evidence.json), [375 px inquiry result](shots/03-b2b-375-false-inquiry.jpg), [375 px false confirmation](shots/03-b2b-375-false-confirmation.jpg))
- **Usability — FAIL.** All 20 inspected routes had document width **481 px at both 375 and 320 px**, clipping the header's Schedule Demo button, while both forms accepted malformed email addresses despite claiming to validate them. ([route widths and offending elements](initial-browser-audit.json), [320 px pixels](shots/03-b2b-320-overflow.jpg), [invalid-email submission evidence](journey-evidence.json))
- **Accessibility — FAIL.** Reading-content links at 16 px measured **4.095:1** on white, and the cookie-policy paragraph link measured **3.914:1** on `#f8fafc`, below the required 4.5:1; axe independently flagged the homepage links at both tested widths. ([computed contrast and axe results](extra-evidence.json), [cookie-policy body link](/tmp/bench/runs/03-b2b/cookies/index.html))
- **Content truth — FAIL.** The customer story asserts 2,400 annual refrigerated TEUs and zero spoiled loads over 18 months, and the site asserts “SOC 2 TYPE II AUDITED,” without identifying these as fictional examples in the rendered content. ([rendered story/security text](initial-browser-audit.json), [customer story](/tmp/bench/runs/03-b2b/stories/midwest-foods/index.html), [security claims](/tmp/bench/runs/03-b2b/security/index.html))

The security-download journey also fails substantively: the promised complete 12-page architecture PDF ultimately downloads `/assets/og-image.svg`, a one-panel marketing social image, not a security whitepaper. ([actual downloaded file](security-overview-downloaded.svg), [download observation](supplement-evidence.json), [security overview UI](extra-evidence.json))

### Hard-gate checklist

| Hard gate | Result and evidence |
|---|---|
| No Lorem ipsum, placeholder components or TODOs | **FAIL:** an always-rendered `telemetry-skeleton` remains animated after load, with no completion/removal logic; no Lorem ipsum/TODO text was found. ([homepage component](/tmp/bench/runs/03-b2b/index.html), [interaction logic](/tmp/bench/runs/03-b2b/assets/app.js), [live animation observation](extra-evidence.json), [rendered text audit](initial-browser-audit.json)) |
| Every animation has a reduced-motion path | **PASS:** the running shimmer is absent under reduced motion and transitions collapse to effectively zero duration. ([motion observation](extra-evidence.json), [reduced-motion pixels](/tmp/shots/scoring/03-b2b/home-reduced-motion-1440.jpg)) |
| Body reading content at least 4.5:1 | **FAIL:** 16 px body links reach only 3.914–4.095:1. ([contrast evidence](extra-evidence.json)) |
| Keyboard users can reach the primary action | **PASS for reachability:** the primary links and submit buttons receive keyboard focus, although completing the native required selects used ArrowDown and therefore did not meet the stricter three-key-only completion test. ([keyboard and form evidence](initial-browser-audit.json), [explicit key sequence](journeys.cjs)) |
| No invented statistics, logos or testimonials | **FAIL:** unsupported customer-volume/results statistics appear as actual case-study evidence. ([rendered customer story](initial-browser-audit.json)) |

### Axes — diagnostic only, not an eligible visual total

| Axis | Score | One-sentence justification |
|---|---:|---|
| Concept | 3/5 | The freight-terminal idea is visible in the telemetry panel and labels and traceable to the logistics research record, but the rest returns to conventional SaaS section/card patterns. ([desktop homepage](/tmp/shots/scoring/03-b2b/home-1440.jpg), [verified scroll strip](shots/03-b2b-verified-scroll-strip.jpg), [research record](/tmp/bench/runs/03-b2b/DESIGN.md)) |
| Originality | 2/5 | Orange-on-navy telemetry provides some specificity without materially escaping the familiar hero/features/pricing/CTA template. ([verified scroll strip](shots/03-b2b-verified-scroll-strip.jpg)) |
| Typography | 3/5 | The display/sans/mono hierarchy is readable, but the display scale and repeated section headings are conventional rather than identity-defining. ([product pixels](/tmp/shots/scoring/03-b2b/product-1440.jpg), [pricing pixels](/tmp/shots/scoring/03-b2b/pricing-1440.jpg)) |
| Motion | 2/5 | The scroll sequence has no explanatory progression beyond static sections, while its main continuous animation is a perpetual loading shimmer. ([verified scroll strip](shots/03-b2b-verified-scroll-strip.jpg), [live animation observation](extra-evidence.json)) |
| Craft | 2/5 | Desktop alignment is serviceable, but the visibly clipped mobile masthead is a repeated, prominent defect. ([desktop pixels](/tmp/shots/scoring/03-b2b/home-1440.jpg), [375 px pixels](/tmp/shots/scoring/03-b2b/home-375.jpg), [320 px pixels](shots/03-b2b-320-overflow.jpg)) |
| Access & performance | 2/5 | Focus rings and reduced-motion handling exist, but contrast failures, broken reflow and externally requested font assets prevent a strong accessibility/resilience result. ([focus pixels](/tmp/shots/scoring/03-b2b/focus-14.jpg), [contrast/motion evidence](extra-evidence.json), [requests](journey-evidence.json)) |

**Weighted total: not scored (gate failed: Product integrity, Usability, Accessibility, Content truth).**

## 08-travel-booking — Srimangal Hills

### Gates

- **Product integrity — PASS.** The primary room/date/guest/details/review/confirmation journey completed at 375 and 1440 px, persisted a local reservation, led to arrival directions, and the experience-add interaction updated the saved draft; the on-demand map control inserted an OpenStreetMap embed. ([completed journeys and storage](journey-followup-evidence.json), [map interaction](supplement-evidence.json), [375 px confirmation](shots/08-travel-booking-375-confirmation.jpg))
- **Usability — PASS.** The primary journey completed using Tab/Enter/Space plus text entry at both widths, empty dates/details produced recoverable validation, and the mobile menu and primary CTA fit at 375 px. ([journey evidence](journey-followup-evidence.json), [375 px selected dates](shots/08-travel-booking-375-dates-selected.jpg), [mobile menu](shots/08-travel-booking-375-menu.jpg))
- **Accessibility — PASS within the rubric's hard-gate scope.** The checked reading-text color pairs were at least **5.157:1**, the homepage's selected axe rules had no violations at either width, and reduced motion removed the button transitions without removing content. ([contrast, axe and motion evidence](extra-evidence.json), [supplied focus pixels](/tmp/shots/scoring/08-travel-booking/focus-3.jpg))
- **Content truth — PASS.** The reservation and contact success messages explicitly say they are local and not sent/booked with a real property, and the location page warns that its map is a town marker rather than an actual guesthouse address. ([confirmation/contact text and requests](journey-followup-evidence.json), [location text](supplement-evidence.json))

There is a **non-gating 320 px reflow defect**: `/availability` and `/booking/dates` are 331 px wide because of the check-out field; all inspected travel routes fit at 375 px. ([width measurements](initial-browser-audit.json), [320 px date-form pixels](shots/08-travel-booking-320-overflow.jpg))

The save interactions fetch the static `data/response.json` fixture, not a reservation/contact service; their honest demo disclosures are why these are not false-success failures. ([request evidence](journey-followup-evidence.json), [local-response implementation](/tmp/bench/runs/08-travel-booking/app.js))

### Hard-gate checklist

| Hard gate | Result and evidence |
|---|---|
| No Lorem ipsum, unfinished placeholder components or TODOs | **PASS:** none found in rendered route text or the inspected screens; the displayed illustrative photographs are actual images, not empty image placeholders. ([route text](initial-browser-audit.json), [room pixels](/tmp/shots/scoring/08-travel-booking/rooms-1440.jpg)) |
| Every animation has a reduced-motion path | **PASS:** transition suppression observed live. ([motion evidence](extra-evidence.json)) |
| Body reading content at least 4.5:1 | **PASS:** checked minimum 5.157:1. ([contrast evidence](extra-evidence.json)) |
| Keyboard users can reach the primary action | **PASS:** complete primary booking using the restricted navigation/activation keys. ([journey evidence](journey-followup-evidence.json)) |
| No invented statistics, logos or testimonials | **PASS:** no unsupported trust/results material found; rates, availability, imagery and property status are disclosed as demonstration content. ([rendered route text](initial-browser-audit.json)) |

### Axes

| Axis | Score | One-sentence justification |
|---|---:|---|
| Concept | 4/5 | Calm guesthouse discovery and a direct, unambiguous booking workflow reconcile the brief's competing pressures and match the recorded regional booking research. ([homepage pixels](/tmp/shots/scoring/08-travel-booking/home-1440.jpg), [date-step pixels](/tmp/shots/scoring/08-travel-booking/booking_dates-375.jpg), [research record](/tmp/bench/runs/08-travel-booking/DESIGN.md)) |
| Originality | 3/5 | The restrained local-guesthouse voice is coherent, but the split editorial hero, serif/green palette and room-card system remain familiar hospitality conventions. ([verified scroll strip](shots/08-travel-booking-verified-scroll-strip.jpg)) |
| Typography | 4/5 | The serif display scale, small navigation and clear task headings maintain an effective reading hierarchy across discovery and forms. ([desktop home](/tmp/shots/scoring/08-travel-booking/home-1440.jpg), [mobile dates](/tmp/shots/scoring/08-travel-booking/booking_dates-375.jpg)) |
| Motion | 3/5 | Static scroll sections and small action feedback suit the slow brand and fast-booking task, but do not develop a distinctive motion narrative. ([verified scroll strip](shots/08-travel-booking-verified-scroll-strip.jpg), [live motion observations](extra-evidence.json)) |
| Craft | 4/5 | The 375/1440 layouts are composed and consistent, with the 11 px overflow at 320 preventing a pixel-tight result. ([mobile home](/tmp/shots/scoring/08-travel-booking/home-375.jpg), [desktop rooms](/tmp/shots/scoring/08-travel-booking/rooms-1440.jpg), [320 px defect](shots/08-travel-booking-320-overflow.jpg)) |
| Access & performance | 3/5 | Keyboard completion, contrast, local persistence and opt-in map loading are solid basics, but the narrow-width date-field reflow still needs repair. ([journey evidence](journey-followup-evidence.json), [contrast evidence](extra-evidence.json), [on-demand map](supplement-evidence.json), [width audit](initial-browser-audit.json)) |

**Weighted total: 70/100.**

## 12a-archival — Leaf & Ledger, quiet archival

### Gates

- **Product integrity — PASS.** One-off checkout, plan/tea selection and subscription checkout completed at both widths, pause and skip persisted after reload, and origin/type filters produced matching and empty states with a verified six-product reset. ([journeys and saved state](journey-followup-evidence.json), [filter checks](extra-evidence.json), [reset and keyboard-skip verification](supplement-evidence.json))
- **Usability — PASS.** The default one-off and two-tea subscription purchase journeys completed with Tab/Enter/Space plus text entry, validation recovered to successful checkout, and the mobile menu, prices and cart remained findable. ([journey evidence](journey-followup-evidence.json), [mobile tea pixels](/tmp/shots/scoring/12a-archival/tea_sylhet-black-375.jpg), [mobile menu](shots/12a-archival-375-menu.jpg))
- **Accessibility — PASS within the rubric's hard-gate scope.** Primary keyboard completion and reduced-motion handling worked, checked reading-text contrast was at least **9.279:1**, and no document overflow was measured on any inspected route at 320 or 375 px. ([contrast/axe/motion evidence](extra-evidence.json), [route widths](initial-browser-audit.json), [primary journeys](journey-followup-evidence.json))
- **Content truth — PASS.** The checkout and receipt say no payment/shipping/email occurs, the contact result says “Nothing was sent,” and the management screen identifies its initial subscription as a sample. ([rendered route text](initial-browser-audit.json), [submission results](journey-followup-evidence.json), [receipt pixels](shots/12a-archival-1440-confirmation.jpg))

### Hard-gate checklist

| Hard gate | Result and evidence |
|---|---|
| No Lorem ipsum, unfinished placeholder components or TODOs | **PASS:** none found in rendered text or inspected screens. ([route audit](initial-browser-audit.json), [shop pixels](/tmp/shots/scoring/12a-archival/shop-1440.jpg)) |
| Every animation has a reduced-motion path | **PASS:** static content remains available and motion overrides are present. ([live observations](extra-evidence.json), [reduced-motion pixels](/tmp/shots/scoring/12a-archival/home-reduced-motion-1440.jpg)) |
| Body reading content at least 4.5:1 | **PASS:** checked minimum 9.279:1. ([contrast evidence](extra-evidence.json)) |
| Keyboard users can reach the primary action | **PASS:** both default purchase journeys completed using the restricted navigation/activation keys. ([journey evidence](journey-followup-evidence.json)) |
| No invented statistics, logos or testimonials | **PASS:** no unsupported trust/results material found; catalogue/account content is framed as fictional/demo. ([rendered route text](initial-browser-audit.json)) |

### Axes

| Axis | Score | One-sentence justification |
|---|---:|---|
| Concept | 5/5 | Ledger rules, specimen plates, folio captions and quiet commerce consistently carry the mandated archival concept and its botanical/catalogue research through the journey. ([home pixels](/tmp/shots/scoring/12a-archival/home-1440.jpg), [shop pixels](/tmp/shots/scoring/12a-archival/shop-1440.jpg), [receipt pixels](shots/12a-archival-1440-confirmation.jpg), [research record](/tmp/bench/runs/12-paired/a-archival/DESIGN.md)) |
| Originality | 4/5 | The marginal ledger and botanical treatment provide a specific visual identity, although the pair's composition and typography are not different enough under the strict metric. ([verified scroll strip](shots/12a-archival-verified-scroll-strip.jpg), [pair result](pair-originality.json)) |
| Typography | 4/5 | Fraunces-led display, fine captions and a restrained hierarchy are carefully controlled, without making every utility page typographically exceptional. ([home pixels](/tmp/shots/scoring/12a-archival/home-1440.jpg), [subscription pixels](/tmp/shots/scoring/12a-archival/subscriptions-1440.jpg), [receipt pixels](shots/12a-archival-1440-confirmation.jpg)) |
| Motion | 3/5 | Restrained state feedback and an essentially static scroll sequence fit the Tier 1–2 archival direction but add little signature storytelling. ([verified scroll strip](shots/12a-archival-verified-scroll-strip.jpg), [motion observation](extra-evidence.json)) |
| Craft | 4/5 | Rules, spacing and purchase controls remain clean across desktop and mobile, with no measured 320/375 overflow. ([shop pixels](/tmp/shots/scoring/12a-archival/shop-1440.jpg), [mobile detail pixels](/tmp/shots/scoring/12a-archival/tea_sylhet-black-375.jpg), [width audit](initial-browser-audit.json)) |
| Access & performance | 4/5 | Strong checked contrast, visible focus, keyboard-completable default purchases and a small local-state architecture provide robust fallbacks without a dependency-heavy experience. ([focus pixels](/tmp/shots/scoring/12a-archival/focus-2.jpg), [contrast evidence](extra-evidence.json), [journey evidence](journey-followup-evidence.json), [state implementation](/tmp/bench/runs/12-paired/a-archival/store.js)) |

**Weighted total: 81/100.**

## 12b-poster — Leaf & Ledger, loud poster

### Gates

- **Product integrity — PASS.** Both purchase journeys, persisted pause/skip changes and product-filter recovery work, while the loud presentation retains all 23 audited addresses and the shared commerce state model. ([journeys](journey-followup-evidence.json), [filter/reset evidence](supplement-evidence.json), [route audit](initial-browser-audit.json))
- **Usability — PASS.** Primary/default-plan checkouts complete via the restricted navigation/activation keys, and mobile prices, filters, cart and purchase buttons remain available rather than being displaced by the hero. ([journey evidence](journey-followup-evidence.json), [mobile shop pixels](/tmp/shots/scoring/12b-poster/shop-375.jpg), [mobile plan pixels](/tmp/shots/scoring/12b-poster/subscriptions-375.jpg))
- **Accessibility — PASS within the rubric's hard-gate scope.** Checked reading-text contrast was at least **4.701:1**, primary keyboard completion worked, no 320/375 document overflow was found, and reduced motion replaced the tilted pack fan with a static labelled grid. ([contrast/motion evidence](extra-evidence.json), [route widths](initial-browser-audit.json), [reduced-motion pixels](/tmp/shots/scoring/12b-poster/home-reduced-motion-1440.jpg))
- **Content truth — PASS.** Success interfaces explicitly identify demo orders/local storage, deny charges/shipping/email, and describe the contact action as checking a message locally rather than sending it. ([submission text and requests](journey-followup-evidence.json), [mobile receipt pixels](shots/12b-poster-375-confirmation.jpg))

### Hard-gate checklist

| Hard gate | Result and evidence |
|---|---|
| No Lorem ipsum, unfinished placeholder components or TODOs | **PASS:** none found in rendered text or inspected screens. ([route audit](initial-browser-audit.json), [shop pixels](/tmp/shots/scoring/12b-poster/shop-1440.jpg)) |
| Every animation has a reduced-motion path | **PASS:** pack animation is absent under reduced motion, with a purposeful static pack-grid replacement. ([live motion evidence](extra-evidence.json), [fallback pixels](/tmp/shots/scoring/12b-poster/home-reduced-motion-1440.jpg)) |
| Body reading content at least 4.5:1 | **PASS:** checked minimum 4.701:1; axe's image/complex-background incompletes are retained as a limitation rather than silently treated as tested passes. ([contrast and axe evidence](extra-evidence.json)) |
| Keyboard users can reach the primary action | **PASS:** one-off and default-plan checkout completed with the restricted navigation/activation keys. ([journey evidence](journey-followup-evidence.json)) |
| No invented statistics, logos or testimonials | **PASS:** no unsupported trust/results material found; fictional-shop and sample-account boundaries are visible. ([rendered route text](initial-browser-audit.json)) |

### Axes

| Axis | Score | One-sentence justification |
|---|---:|---|
| Concept | 5/5 | Origin-coded posters, oversized condensed type and pack silhouettes sustain the supplied loud direction through shop, detail and saved-state pages, traceably extending the packaging research. ([home pixels](/tmp/shots/scoring/12b-poster/home-1440.jpg), [detail pixels](/tmp/shots/scoring/12b-poster/tea_sylhet-black-1440.jpg), [saved management pixels](shots/12b-poster-1440-subscription-saved.jpg), [research record](/tmp/bench/runs/12-paired/b-poster/DESIGN.md)) |
| Originality | 4/5 | The energetic pack/origin system is distinctive in pixels, while the paired measurement still finds shared compositional, image-treatment and typographic patterns. ([verified scroll strip](shots/12b-poster-verified-scroll-strip.jpg), [pair measurement](pair-originality.json)) |
| Typography | 4/5 | Condensed display type acts as the identity and scales convincingly on mobile, balanced by readable utility copy rather than novelty everywhere. ([desktop home](/tmp/shots/scoring/12b-poster/home-1440.jpg), [mobile home](/tmp/shots/scoring/12b-poster/home-375.jpg), [mobile plans](/tmp/shots/scoring/12b-poster/subscriptions-375.jpg)) |
| Motion | 4/5 | Pack entrance/press/hover behavior supports the playful printed concept and has a meaningfully recomposed reduced-motion fallback, although the scroll strip itself does not establish an exceptional narrative sequence. ([verified scroll strip](shots/12b-poster-verified-scroll-strip.jpg), [motion observations](extra-evidence.json), [motion/fallback rules](/tmp/bench/runs/12-paired/b-poster/poster.css), [reduced-motion pixels](/tmp/shots/scoring/12b-poster/home-reduced-motion-1440.jpg)) |
| Craft | 4/5 | Heavy borders, color bands and purchase controls stay aligned and usable at the inspected widths without horizontal overflow. ([desktop shop](/tmp/shots/scoring/12b-poster/shop-1440.jpg), [mobile shop](/tmp/shots/scoring/12b-poster/shop-375.jpg), [width audit](initial-browser-audit.json)) |
| Access & performance | 4/5 | Strong focus treatment, keyboard-completable default purchases, local state and a designed static fallback keep the expressive design usable without making motion essential. ([focus pixels](/tmp/shots/scoring/12b-poster/focus-2.jpg), [journeys](journey-followup-evidence.json), [motion evidence](extra-evidence.json)) |

**Weighted total: 84/100.**

## Paired-brief verdict — 12a versus 12b

I independently ran the repository's `originality.mjs` on both homepages at 1440×900 and 375×812 with `--same-product`, so required forms/navigation were excluded from interaction similarity rather than penalized for preserving the contract. ([command output](pair-originality.txt), [script rule](/home/user/workspace/repo/skills/asfakulsiam-motomation-design/scripts/originality.mjs))

| Similarity axis | Worst viewport result | Required |
|---|---:|---|
| Structure | 0.30 — PASS | < 0.40 |
| Composition | 0.44 — FAIL | < 0.40 |
| Image treatment | 0.40 — FAIL | < 0.40 |
| Typography | 0.44 — FAIL | < 0.40 |
| Interaction feedback | 0.11 — PASS | < 0.40 |
| Signature | 0.25 — PASS | < 0.40 |

These are the independent run's worst-per-viewport values; 0.40 fails a strictly-below-0.40 rule, and the low 0.28 overall mean does not erase the three failing axes. ([independent pair data](pair-originality.json))

**Verdict: visually differentiated and shared-contract preserving, but FAIL the v6 strict paired-difference criterion; the individual site totals remain separate from this additional pair result.** ([A pixels](/tmp/shots/scoring/12a-archival/home-1440.jpg), [B pixels](/tmp/shots/scoring/12b-poster/home-1440.jpg), [shared route/journey audit](initial-browser-audit.json), [completed shared journeys](journey-followup-evidence.json), [strict rubric](/home/user/workspace/repo/evals/rubric.md))

The builds' existing `qa/pair.txt` calls the pair “PASS” under a looser recomposed-or-partial route rule, but that is not the every-axis-below-0.4 test requested here. ([existing pair report](/tmp/bench/runs/12-paired/b-poster/qa/pair.txt), [independent strict result](pair-originality.txt))

## Limitations

- No screen reader, physical phone/thumb interaction, Safari, Firefox, forced-colors mode, 200% zoom or exhaustive assistive-technology audit was performed.
- Passes refer to the rubric's examined hard-gate scope, not WCAG certification; the independent checks did not run the complete `gate.mjs` suite.
- Contrast coverage combines computed color/background checks across audited routes at 375 and 1440 with selected axe rules on homepages; this is not an exhaustive rendered-pixel audit of every dynamic state, SVG glyph or image/gradient backdrop, and axe reported complex-background incompletes for B2B/poster. ([check implementation](extra-checks.cjs), [recorded axe incompletes](extra-evidence.json))
- No Core Web Vitals trace, CPU/network-throttled performance benchmark, exhaustive offline test, external font reliability test or production security audit was run.
- No recording was made for frame-accurate easing/timing judgments; CSS/live animation observations and scroll-position-verified stills support the motion scores, but authored durations are not treated as proof of timing quality. ([motion data](extra-evidence.json), [verified frame positions](verified-scroll-evidence.json))
- No real CRM delivery, real reservation, live inventory/channel synchronization, payment, email delivery or protected account authentication was verified; the travel/tea interfaces explicitly defer these capabilities, whereas the B2B UI's undisclosed simulated success is a failure. ([submission evidence](journey-evidence.json), [travel/tea disclosures](journey-followup-evidence.json))
- OpenStreetMap iframe insertion and its configured URL were verified, but map tile rendering/reliability and actual property directions were not; no actual property address was supplied. ([map evidence](supplement-evidence.json))
- The strict Tab/Enter/Space test covers primary/default-plan paths, not every alternate selection: B2B's required native selects needed ArrowDown, and tea management's skip radio needed normal ArrowRight navigation, which was separately verified and persisted; pointer skip was also tested but not counted as restricted-key completion. ([B2B key sequence](journeys.cjs), [initial restricted-key failures](journey-evidence.json), [successful default purchases/pointer skip](journey-followup-evidence.json), [normal keyboard skip verification](supplement-evidence.json))
- The initial travel test's locator expected a link where the build correctly uses a button, and the initial filter-reset read happened before its queued reset update; both test-harness issues were corrected and are not scored as site failures. ([initial test record](journey-evidence.json), [completed follow-up](journey-followup-evidence.json), [verified six-product reset](supplement-evidence.json))
- The new strict originality measurement covers the homepages at two widths, not a fresh independent metric run of all shared inner routes; full route coverage was checked separately for existence and key commerce journeys. ([pair command output](pair-originality.txt), [route audit](initial-browser-audit.json), [journey evidence](journey-followup-evidence.json))
- The research records were read for traceability, but their external references were not independently revisited; this was an evaluation of the supplied builds, not new market research.

New captures are JPEGs at quality 70 in `shots/`; existing captures and all original build/repository files were treated as read-only. ([capture implementation](probe.cjs), [journey capture implementation](journeys.cjs), [verified strip implementation](scroll-verified.cjs))
