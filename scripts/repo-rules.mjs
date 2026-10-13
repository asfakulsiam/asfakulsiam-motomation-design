// Repository-wide rules shared by scripts/check-repo.mjs and its tests (tests/repo/). Each takes plain data, so a
// test can feed it broken inputs.
//   sizeProblems(entries)   tracked files: none heavy (evals-branch artifacts), none over 1 MB unless allowlisted,
//                           total under 15 MB
export const SIZE = { maxFileBytes: 1024 * 1024, maxTotalBytes: 15 * 1024 * 1024 };
export const SIZE_ALLOW = [/\.(woff2?|ttf|otf)$/, /(^|\/)LICEN[CS]E(\.[a-z]+)?$/i, /(^|\/)LICENSES\.md$/, /(^|\/)poster\.(webp|avif)$/];
export const HEAVY = [/^evals\/results\/.*\.(webp|png|jpe?g|mp4|gz)$/, /^evals\/results\/.*(transcript\.jsonl|index\.html|motion-report\.html)$/, /^docs\/.*\.(png|webp|jpe?g)$/, /\/examples\/templates\/[^/]+\/(frames|frames-mobile)\//, /\/examples\/templates\/[^/]+\/film\.mp4$/];
export function sizeProblems(entries) { // entries: [{ path, bytes }] for every tracked file
  const p = []; let total = 0;
  for (const { path, bytes } of entries) {
    total += bytes;
    if (HEAVY.some((r) => r.test(path))) p.push(`${path} is tracked on main; heavy artifacts live on the evals branch (evals/README.md)`);
    else if (bytes > SIZE.maxFileBytes && !SIZE_ALLOW.some((r) => r.test(path))) p.push(`${path} is ${(bytes / 1048576).toFixed(2)} MB; files over 1 MB belong on the evals branch (or the allowlist: fonts, LICENSE, a poster)`);
  }
  if (total > SIZE.maxTotalBytes) p.push(`main is ${(total / 1048576).toFixed(2)} MB of tracked files; the budget is ${SIZE.maxTotalBytes / 1048576} MB`);
  return { problems: p, total };
}

/** Workflow hygiene (v2.5.0, C10), on the text of one workflow file: every job sets timeout-minutes; a job that runs
 *  npm or npx sets up Node with `cache: npm`; a job that installs Playwright browsers caches ~/.cache/ms-playwright.
 *  Line-based (jobs are the two-space keys under `jobs:`), so it needs no YAML parser. Returns problem strings. */
export function workflowProblems(name, text) {
  const out = []; const lines = text.split("\n"); const j = lines.indexOf("jobs:"); if (j < 0) return [`${name}: no jobs: block`];
  const jobs = []; for (const l of lines.slice(j + 1)) { const m = l.match(/^  ([A-Za-z0-9_-]+):\s*$/); if (m) jobs.push({ id: m[1], body: [] }); else if (/^\S/.test(l)) break; else if (jobs.length) jobs.at(-1).body.push(l); }
  for (const { id, body } of jobs) {
    const t = body.join("\n");
    if (!/^    timeout-minutes:\s*\d+/m.test(t)) out.push(`${name} job ${id}: no timeout-minutes`);
    const code = t.replace(/^\s*-?\s*name:.*$/gm, "").replace(/#.*$/gm, ""); // step names and comments are prose, not commands
    if (/(^|[\s;&|(])(npm|npx) /m.test(code) && !/setup-node@[\s\S]*?cache:\s*npm/.test(t)) out.push(`${name} job ${id}: runs npm but actions/setup-node has no cache: npm`);
    if (/playwright install/.test(code) && !/actions\/cache@[\s\S]*?~\/\.cache\/ms-playwright/.test(t)) out.push(`${name} job ${id}: installs Playwright but does not cache ~/.cache/ms-playwright`);
  }
  return out;
}
