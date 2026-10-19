#!/usr/bin/env node
// Canonical fast local check (v3.0.2): `npm test`, also the CI "check" job. No browser, no network, no model calls
// (the eval tests use tests/evals/fixtures/fake-claude.mjs). Runs every FAST check even after a failure, prints
// PASS/FAIL per check, and exits 1 if any failed. It does not run the browser tiers below and says so: a green
// `npm test` is not a browser, journey or component verification.
//
//   npm test              run the fast checks
//   npm test -- --list    print every tier and what runs it
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// [args to node, what it proves]
export const FAST = [
  [["scripts/check-repo.mjs"], "repository, data, versions, dist, registry counts, stale absolutes"],
  [["tests/gate/rulesets.test.mjs"], "rule-set axes bite (C, S, P, K)"],
  [["tests/repo/size-guard.test.mjs"], "size guard bites"],
  [["tests/repo/workflow-rules.test.mjs"], "workflow hygiene rules bite"],
  [["tests/repo/memory.test.mjs"], "memory spans projects and forces divergence"],
  [["tests/gate/handoff.test.mjs"], "handoff status is computed from the gate record"],
  [["--test", "tests/gate/variety.test.mjs"], "variety reads archetype none"],
  [["tests/gate/completeness.test.mjs"], "completeness axis X bites"],
  [["tests/gate/async-states.test.mjs"], "async advisory sees modern error handling"],
  [["tests/evals/briefs-v6.test.mjs"], "v6 briefs carry a product contract"],
  [["tests/templates/template-rules.test.mjs"], "template rules bite, no template drift"],
  [["tests/evals/turn-cap.test.mjs"], "matched-arm turn cap is exact (fake claude)"],
  [["tests/evals/run-meta.test.mjs"], "run provenance meta.json (fake claude)"],
  [["tests/evals/bench-cache.test.mjs"], "benchmark cache keys (fake claude)"],
  [["tests/evals/cost.test.mjs"], "cost.json records every build's cost (fake claude)"],
  [["tests/mcp/session.mjs"], "MCP server answers the protocol"],
];

// Tiers `npm test` does not run. Each test file in tests/ must be in FAST, named in a workflow, or listed here
// (scripts/check-repo.mjs enforces it), so a test cannot exist without anyone running it.
export const NOT_RUN = {
  browser: { by: ".github/workflows/ci.yml gate-fixtures job (Playwright + Chromium)", files: [] }, // journey, pair, originality, … are named in ci.yml
  components: { by: ".github/workflows/components.yml (pinned esbuild, React, Playwright)", files: [] },
  manual: {
    by: "run by hand with a local toolchain; not release-critical",
    files: {
      "tests/components/why-skipped.mjs": "diagnostic: why the gate skipped text elements on a page you pass in",
      "tests/docs/site.mjs": "docs site check; needs a built docs site (scripts/build-docs-site.mjs)",
      "tests/sections/harness.mjs": "needs a sections preview build (scripts/build-sections.mjs --preview)",
      "tests/templates/perf.mjs": "template performance profiles; timing-sensitive, not a CI gate",
      "tests/variants/compare.mjs": "variant comparison; local toolchain incl. Tailwind CLI",
    },
  },
  helpers: { by: "imported by other tests, not run on their own", files: ["tests/components/harness.mjs", "tests/evals/fixtures/fake-claude.mjs"] },
  benchmarks: { by: "evals/ harness and bench-*.yml workflows; external model calls, never in routine CI", files: [] },
};

function list() {
  console.log("npm test (fast, no browser):"); for (const [a, w] of FAST) console.log(`  node ${a.join(" ")}  # ${w}`);
  for (const [k, t] of Object.entries(NOT_RUN)) {
    console.log(`\nnot run by npm test, ${k}: ${t.by}`);
    const files = Array.isArray(t.files) ? t.files.map((f) => [f, ""]) : Object.entries(t.files);
    for (const [f, why] of files) console.log(`  ${f}${why ? `  # ${why}` : ""}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes("--list")) { list(); process.exit(0); }
  const results = [];
  for (const [args, what] of FAST) {
    console.log(`\n── node ${args.join(" ")}`);
    const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: "inherit" });
    results.push([args.join(" "), r.status === 0 ? "PASS" : "FAIL", what]);
  }
  console.log("\nSummary");
  for (const [n, s] of results) console.log(`  ${s}  ${n}`);
  console.log("  NOT VERIFIED  browser gate fixtures, journeys, components, rendering (run in CI or with Playwright; see npm test -- --list)");
  const failed = results.filter((r) => r[1] === "FAIL").length;
  console.log(failed ? `\n${failed} of ${results.length} fast checks failed` : `\nall ${results.length} fast checks passed`);
  process.exit(failed ? 1 : 0);
}
