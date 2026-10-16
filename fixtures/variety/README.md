# Variety fixtures (gate critique S)

Two builds with the **same archetype** (timeline), different signatures and palettes. Log both, then gate both: the second must score a lower S than the first, because S compares a build only with the builds logged before it (`scripts/gate.mjs` memoryAxis).

```
HOME=$(mktemp -d)
node skills/asfakulsiam-motomation-design/scripts/memory.mjs log --dir fixtures/variety/a --archetype timeline --signature paper-feed --tier 1
node skills/asfakulsiam-motomation-design/scripts/memory.mjs log --dir fixtures/variety/b --archetype timeline --signature year-ruler --tier 1
node skills/asfakulsiam-motomation-design/scripts/gate.mjs fixtures/variety/a --log $HOME/.motomation/log.json   # S5
node skills/asfakulsiam-motomation-design/scripts/gate.mjs fixtures/variety/b --log $HOME/.motomation/log.json   # S3: archetype and layout reused
```
