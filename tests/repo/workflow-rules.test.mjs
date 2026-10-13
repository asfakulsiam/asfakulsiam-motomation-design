// Workflow hygiene rule bites (v2.5.0, C10): scripts/repo-rules.mjs workflowProblems on synthetic workflows, then on
// every real workflow in .github/workflows (which must be clean).   node tests/repo/workflow-rules.test.mjs
import { readdirSync, readFileSync } from "node:fs"; import { join } from "node:path"; import { fileURLToPath } from "node:url";
import { workflowProblems } from "../../scripts/repo-rules.mjs";
const ROOT = fileURLToPath(new URL("../..", import.meta.url)); let fails = 0;
const say = (ok, m) => { console.log(`${ok ? "ok  " : "FAIL"} ${m}`); if (!ok) fails++; };
const job = (extra, steps) => `on: push\njobs:\n  a:\n    runs-on: ubuntu-latest\n${extra}    steps:\n${steps}`;
const NODE = "      - uses: actions/setup-node@v4\n        with: { node-version: \"20\", cache: npm, cache-dependency-path: x.yml }\n";
const PWC = "      - uses: actions/cache@v4\n        with: { path: ~/.cache/ms-playwright, key: k }\n";
const PW = "      - run: npm i playwright && npx playwright install chromium\n";
say(workflowProblems("ok", job("    timeout-minutes: 5\n", NODE + PWC + PW)).length === 0, "a clean job passes");
say(workflowProblems("t", job("", NODE + PWC + PW)).some((p) => /timeout-minutes/.test(p)), "missing timeout-minutes fails");
say(workflowProblems("n", job("    timeout-minutes: 5\n", "      - uses: actions/setup-node@v4\n        with: { node-version: \"20\" }\n" + PWC + PW)).some((p) => /cache: npm/.test(p)), "npm without setup-node cache fails");
say(workflowProblems("p", job("    timeout-minutes: 5\n", NODE + PW)).some((p) => /ms-playwright/.test(p)), "playwright install without the browser cache fails");
say(workflowProblems("c", job("    timeout-minutes: 5\n", "      - run: node x.mjs   # not npm \n")).length === 0, "a job without npm needs no npm cache");
say(workflowProblems("s", job("    timeout-minutes: 5\n", "      - name: npm cache and playwright install, in prose\n        run: node x.mjs\n")).length === 0, "step names are prose: npm or playwright in a name is not a command");
say(workflowProblems("e", job("    timeout-minutes: 5\n", "      - uses: actions/setup-node@v4\n        with: { node-version: \"${{ matrix.node, cache: npm }}\", cache: npm }\n")).some((p) => /swallows a YAML key/.test(p)), "an expression that swallows a YAML key fails (the C10 ci.yml break)");
const W = join(ROOT, ".github/workflows"); const real = readdirSync(W).filter((f) => f.endsWith(".yml")).flatMap((f) => workflowProblems(f, readFileSync(join(W, f), "utf8")));
say(real.length === 0, `every real workflow is clean${real.length ? ": " + real.join("; ") : ""}`);
console.log(fails ? `\n${fails} failure(s)` : "\nworkflow rules bite"); process.exit(fails ? 1 : 0);
