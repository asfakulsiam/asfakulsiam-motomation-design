# Micro-state fixtures (v2.9.0)

| Fixture | Expect from `node skills/asfakulsiam-motomation-design/scripts/gate.mjs fixtures/micro/bare/index.html --tier 1` |
|---|---|
| `bare` | the micro-states block warns on every line: buttons (no hover, focus, active, disabled, loading), forms (no validation error, loading, success, error), the `data-entity` list (no empty, loading, error), the image (no loading, error), async (no pending, success, error). Warnings only: they never fail the gate and are not in the stamp |
