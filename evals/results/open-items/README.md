# Open items (2026-10-16)

Four small items left open by the diversity run. Each one is fixed here, with its evidence.

## A. Error pages are exempt from the canonical check (seo-04)

**Rule change** (`scripts/rulesets.mjs`). `isErrorPage(url, status)` is true when either:
- the response status is ≥ 400, or
- the path is named for an error page: `404`, `5xx`, `error`, `not-found`, `_error`, with or without `.html`.

On an error page:
- seo-04 is not required;
- a canonical that is present anyway is a **warning**.

Every other page still fails without exactly one canonical. `gate.mjs` passes the HTTP status in.

**Why:**
- A canonical tag names the one address search engines should index for a piece of content.
- An error view is not content at an address; it is served at whatever URL failed.
- A canonical on a 404 points every broken URL at one indexable page. Search engines treat that as a "soft 404".
- So an error page has no correct canonical to require.

The reasoning is written into `craft/seo.md`, `gates/rules.md` and `gates/delivery-gate.md`.

**Gate re-run** on `evals/results/diversity/01-funeral-home/404.html` (the page that failed in the diversity run), `gate.mjs --rules`:

Before (HEAD's scripts), exit 1, `404-gate-before.txt`:
```
evals/results/diversity/01-funeral-home/404.html
  rules: C0 S1 P0 K0  (rule sets only; no stamp)
     ✗ seo-04  no canonical tag
```
After, exit 0, `404-gate-after.txt`:
```
evals/results/diversity/01-funeral-home/404.html
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
```
`tests/gate/rulesets.test.mjs` has four new cases:
- a 404 file passes without a canonical;
- a status-404 response passes without one;
- a canonical on an error page warns;
- a normal page still fails without one.

## B. Main's size, and the evals branch copies

**Over 1 MB:** no tracked file on main is over 1 MB (the check-repo size guard already fails on any). Main was at
14.82 MB in the diversity run, and 15.02 MB after the template redesign commit, over the 15 MB budget. So the
largest results folder moved instead:
- `evals/results/2026-10-12-benchmark-v3/` (1036 files, 3.06 MB) went to the evals branch.
- It was the v3 runner output: summary.json, checks.json per build, judge prompts and verdicts.
- No script on main reads it. The workflows use `2026-10-12-benchmark-v3-codex`, which stays.
- A pointer `MOVED.md` is left in its place, and the links in `docs/benchmark-summary.md`, `evals/results/2026-10-12-benchmark-v3.md` and `craft/scroll-sequences.md` point to the evals branch.

**Sync.** Main's local copies replaced the older evals-branch ones (evals commit 48021bd):
- `evals/results/diversity/0*/index.html` ×5: main's carry the critique stamps; the evals copies had empty stamps.
- `og.jpg` ×5: byte-identical already; not changed.
- `docs/rm-stills/event.webp`: the redesigned reduced-motion still (`beams.webp` was already current).
- New: the Task 2 full-vs-reduced pairs, the Task 3 screenshots of the running Next.js page, and the 726 benchmark-v3 files the evals branch was missing.
- `evals/MOVED-FROM-MAIN.txt` on the evals branch lists every moved path.

**Size check** (`node scripts/check-repo.mjs`, last line):
```
✓ repository OK (skill v2.10.1, 146 docs, 13 data sets, main 12.11 MB tracked of 15 MB)
(before this item: ✗ main is 15.03 MB of tracked files; the budget is 15 MB)
```

## C. Originality at 375×812 as well as 1440×900

`scripts/originality.mjs` now opens every page at **1440×900 and 375×812** by default. Each viewport gets its own
matrix, and the verdict uses the worse of the two on each axis (`--viewport 1440x900` for one size;
`tests/gate/originality.test.mjs` covers the parsing and merging). The scoring itself is unchanged.

**Diversity matrix re-run** (`evals/results/diversity/matrix-two-viewports.md`, `.json`):
- At 1440×900 every cell equals the old `matrix.md`.
- At 375×812, composition, typography and signature move on most pairs; the largest change is composition 0.06 → 0.27 for funeral × metal.
- No pair crosses 0.4 at one size and not the other. **The verdict does not change: FAIL, 5 of 10 pairs.**

**Ten templates at both sizes** (`evals/results/originality-templates/after-two-viewports.txt`):
- First run: 36/45 (1440 still 45/45). The phone type scales had converged.
- After giving the two films a phone scale of their own: **42/45** at both (1440: 45/45, 375: 42/45).
- The three remaining pairs and why are in `evals/results/originality-templates/README.md`.

## D. Form states are mocked

`gates/delivery-gate.md` now says: "Form states are checked by intercepting requests. When the template ships,
replace mock endpoints with a real server." It sits beside the form-states check it qualifies (the gate script itself does not print it).
