# Adding a rule set

How copy, SEO, performance and security became gate axes in v2.5.0, written as the steps to add a fifth (say,
**I** for internationalisation). Each step names the file and the check that fails if you skip it.

## 1. Write the craft doc

`skills/asfakulsiam-motomation-design/craft/<set>.md`. Number the rules `<prefix>-01` … `<prefix>-20`, one table row
or heading per rule, and say for each one what it is and why it matters. Copy rules also carry a good and a bad
example; checklist sets (SEO, performance, security) carry a tag saying who decides each item:

| Set | Tags |
|---|---|
| copy | none (what, why, good, bad) |
| seo, security | `[M]` mechanical, `[H]` human (owner does it in an outside tool) |
| performance | `[FE]` front end, `[BE]` back end, `[IN]` infrastructure, `[H]` human |

Mark the rules the gate measures (for example "gate S") so a reader knows which ones a stamp proves.

Enforced by `scripts/check-repo.mjs` through `CRAFT_RULES` in `scripts/template-rules.mjs`: the doc must exist, hold
every numbered rule, give each its tag, leave no empty cell, and clear a minimum word count. Add your set to
`CRAFT_RULES` with its prefix, count, tags and `minWords`.

## 2. List every rule in the delivery gate

`skills/asfakulsiam-motomation-design/gates/delivery-gate.md` Part 4 lists each rule ID with how it is proved (a
gate count, a command, or "owner to do"). `gateListsRules` in `scripts/template-rules.mjs` fails the repo check for
any ID missing from that file. Keep Parts 2 and 3 as they are: `scripts/build-lite.mjs` holds the lite edition to
8000 tokens and it is already near the limit.

## 3. Write the checks as pure functions

`skills/asfakulsiam-motomation-design/scripts/rulesets.mjs`. A rule set is one function that takes plain facts
(text blocks, head tags, image boxes, script sources, response headers) and returns
`{ fails: [{ id, why, at }], warns: [...], checked }`. No browser in this file, so it can be tested with objects.

Two rules for what counts:

- The axis count is the number of distinct rule IDs that fail, not the number of places. One page, one count, every run.
- A check that needs judgement is a warning, not a failure. `copy-16` (an unsourced number) warns; it can't know
  whether a source exists.

## 4. Collect the facts and add the axis

`skills/asfakulsiam-motomation-design/scripts/gate.mjs`:

1. `ruleFacts()` gathers what the functions need from the page (one browser context at 1440 × 900, plus the
   response headers and the fetched same-origin scripts). Add your facts there.
2. `judgeRules()` calls each set and `rulesAxes()` turns the results into counts. Add yours to both.
3. The stamp segment is `rules: C<n> S<n> P<n> K<n>`. Add a letter that isn't already used by the critique
   (C, H, S, R, M, V, Q, A) or the core counts (c o w rm a n q k); that clash is why the rule letters have their own
   segment.
4. Bump `GATE_VERSION` (`gate/4` → `gate/5`), so `--verify` rejects stamps measured without the new axis, and
   update the stamp regexes in `scripts/check-repo.mjs` and `scripts/build-templates.mjs` to accept the new form.
5. Print the axis in `print()` and describe it in the header comment and in `gates/delivery-gate.md` Part 0.

`--rules` runs only the rule sets (seconds per page, no stamp). Use it while you build the checks.

## 5. Prove each check bites

- `tests/gate/rulesets.test.mjs`: one assertion per rule on a planted violation, and one on clean input. It runs in
  CI with no browser.
- `fixtures/rules/<set>-good/` and `fixtures/rules/<set>-bad/`: a good page at zero on every rule set, and a bad
  page that is the same page with one violation per measured rule. Add the expected IDs to `RULE_FIXTURES` in
  `scripts/check-fixtures.mjs`: the bad page must fail exactly those IDs and nothing in another set.
- `fixtures/good/` must still pass the whole gate.

## 6. Re-gate what ships

Every template carries a stamp with the gate version in it, so a new axis means a new stamp on each one:

```
cd skills/asfakulsiam-motomation-design
node scripts/gate.mjs examples/templates/<id>.html          # prints the critique and gate line
node ../../scripts/build-templates.mjs --stamp <id> "critique: … · gate: …"
node scripts/gate.mjs --verify examples/templates/<id>.html # STAMP VERIFIED
```

A stamp records what was measured, failures included. Don't edit numbers into a stamp and don't weaken a check to
make a page pass; fix the page. If a check is wrong (it fires on something the rule doesn't cover), fix the check,
add a test for the case, and say so in the changelog. Two such fixes in v2.5.0: `perf-02` no longer asks for lazy
loading on inline `data:` images (no request to save), and `perf-07` no longer counts `//` inside URL strings as
comments.

## 7. Ship the docs

Run `node scripts/build-dist.mjs` and `node scripts/build-lite.mjs`, add a `CHANGELOG.md` entry, and check that
`node scripts/check-repo.mjs` ends with `repository OK`.
