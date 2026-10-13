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
