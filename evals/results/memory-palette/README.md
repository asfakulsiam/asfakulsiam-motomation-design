# Memory records the palette family (Fix 3)

Builds: evals/results/diversity/01-funeral-home (paper #f8f5ef, brass #7a4f0e accent) then fixtures/variety/a (paper #f8f5ef, brass #7a4f0e accent): same family, light-orange.

## Before (HEAD df463ee): no palette recorded, no warning
```
$ memory.mjs log --dir evals/results/diversity/01-funeral-home --archetype ledger --signature sanded-in --tier 2
Logged run #1 to /tmp/m3b/log.json
$ memory.mjs check --dir fixtures/variety/a --archetype timeline --signature paper-feed
IDs
✓ dir "fixtures/variety/a" is fresh
✓ archetype "timeline" is fresh
✓ signature "paper-feed" is fresh
Structure  (fingerprint: layout=sequence)
$ memory.mjs recent
Log: /tmp/m3b/log.json
1. 2026-10-16 · project: repo · dir: evals/results/diversity/01-funeral-home · archetype: ledger · signature: sanded-in · tier: 2
2. 2026-10-16 · project: repo · dir: fixtures/variety/a · archetype: timeline · signature: paper-feed · tier: 1
```

## After
```
$ memory.mjs log --dir evals/results/diversity/01-funeral-home --archetype ledger --signature sanded-in --tier 2
Logged run #1 to /tmp/m3a/log.json
$ memory.mjs check --dir fixtures/variety/a --archetype timeline --signature paper-feed
IDs
✓ archetype "timeline" is fresh
✓ signature "paper-feed" is fresh
⚠ palette family "light-orange" was used in 1 of the last 1 runs (hex:2164dcdf) → warning: change the palette or state the reason in DESIGN.md
Structure  (fingerprint: layout=sequence)
$ memory.mjs recent
Log: /tmp/m3a/log.json
1. 2026-10-16 · project: repo · dir: evals/results/diversity/01-funeral-home · archetype: ledger · signature: sanded-in · palette: hex:2164dcdf · tier: 2 · palette family: light-orange
2. 2026-10-16 · project: repo · dir: fixtures/variety/a · archetype: timeline · signature: paper-feed · palette: hex:321d65d1 · tier: 1 · palette family: light-orange
```
