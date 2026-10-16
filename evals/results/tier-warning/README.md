# Repeated motion tier is a warning (Fix 6)

```
### Before (HEAD e0379be)
$ memory.mjs log … --tier 2   (×3, archetypes ledger1-3, signatures sig1-3)
$ memory.mjs check --archetype almanac --signature tide-rule --tier 2
IDs
✓ archetype "almanac" is fresh
✓ signature "tide-rule" is fresh
✗ tier "2" was used in 3 of the last 3 runs → choose another
(exit 2)

### After
$ memory.mjs log … --tier 2   (×3, archetypes ledger1-3, signatures sig1-3)
$ memory.mjs check --archetype almanac --signature tide-rule --tier 2
IDs
✓ archetype "almanac" is fresh
✓ signature "tide-rule" is fresh
⚠ Tier 2 used in the last 3 builds. This is allowed if the brief requires it. State the reason in DESIGN.md.
(exit 0)
```
