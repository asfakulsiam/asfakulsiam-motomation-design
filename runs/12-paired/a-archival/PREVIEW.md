# Leaf & Ledger · Quiet archival · private preview

## Measured

The platform deploy_website tool returned status `uploaded`, asset id `8f1e8d5c-bc8e-4b7c-b469-4fb24b16689b`, with 201 files, for [Leaf & Ledger — Quiet archival](https://www.perplexity.ai/computer/a/leaf-ledger-quiet-archival-jx6NXLyOS3y0aU.ySxZomw).

Exact tool arguments: `{"project_path":"/home/user/workspace/bench/runs/12-paired/a-archival","site_name":"Leaf & Ledger — Quiet archival","entry_point":"index.html","should_validate":false,"new_artifact":true}`.

## Judged

- (opinion, self) The private preview is supplementary; the benchmark folder and its tiny local server are the authoritative handoff.

## Not verified

- Preview-host route resolution, security headers and 404 status were not rechecked; local tests ran against localhost:4311.
- Automatic deployment validation was disabled to avoid adding browser scans to the shared machine. Local QA is recorded separately, not attributed to this upload.
- The deployment tool automatically made its own copy outside the two authored output folders. It was not edited. No permanent public publishing or external Git push was requested.
- A parent agent wishing to surface the preview in its own chat must invoke deploy_website with these same arguments.
