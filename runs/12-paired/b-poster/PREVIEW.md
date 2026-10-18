# Leaf & Ledger · Loud poster · private preview

## Measured

The platform deploy_website tool returned status `uploaded`, asset id `160b3ee7-d000-4e19-941b-79e5d07235d3`, with 187 files, for [Leaf & Ledger — Loud poster](https://www.perplexity.ai/computer/a/leaf-ledger-loud-poster-Fgs.59AAThmUG3nl0HI10w).

Exact tool arguments: `{"project_path":"/home/user/workspace/bench/runs/12-paired/b-poster","site_name":"Leaf & Ledger — Loud poster","entry_point":"index.html","should_validate":false,"new_artifact":true}`.

## Judged

- (opinion, self) The private preview is supplementary; the benchmark folder and its tiny local server are the authoritative handoff.

## Not verified

- Preview-host route resolution, security headers and 404 status were not rechecked; local tests ran against localhost:4312.
- Automatic deployment validation was disabled to avoid adding browser scans to the shared machine. Local QA is recorded separately, not attributed to this upload.
- The deployment tool automatically made its own copy outside the two authored output folders. It was not edited. No permanent public publishing or external Git push was requested.
- A parent agent wishing to surface the preview in its own chat must invoke deploy_website with these same arguments.
