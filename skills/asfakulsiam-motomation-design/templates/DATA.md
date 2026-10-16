# DATA.md: <Project name>

> The shape of the `data/` folder: the committed mock data that lets the template run with zero configuration. Written with `SCHEMA.md`; every entity here is an entity in `SCHEMA.md` → Data model, with the same field names and types.

All data in data/ is demo. Replace with real data before launch.

<!--
Rules for the data/ folder
- One JSON file per entity: data/<entity-plural>.json (products.json, posts.json, settings.json). Derive the list from
  SCHEMA.md; there is no fixed set.
- Each file: { "demo": true, "entity": "<Entity>", "items": [ { ...fields, "demo": true } ] }. A single record
  (settings) is { "demo": true, "entity": "Settings", "item": { ... } }.
- Every entry carries "demo": true. scripts/completeness.mjs fails a data file whose entries are not labelled.
- The schema.json in data/ is a JSON Schema (draft 2020-12) with one $defs entry per entity; each data file validates against it.
- Ids are stable strings; references use ids (ref(Entity) in SCHEMA.md).
- Images are local, under public/demo/, with width, height and alt in the entry. No hotlinked images.
- No real personal data: demo people use example.com addresses and +8800000000000-style placeholder numbers.
- Enough entries to show every state: at least one list long enough to paginate, one empty case reachable
  (a filter with no results), one item in each enum state (in stock / out of stock, draft / published).
- The code reads data/ through one typed module (lib/data.ts or equivalent). Swapping to a real source changes that
  module only.
-->

## Files

| File | Entity (`SCHEMA.md`) | Entries | Covers states |
|---|---|---|---|
| `data/<entity-plural>.json` | <Entity> | <n> | <e.g. one out of stock, one on sale, enough for 2 pages> |
| the `schema.json` in `data/` | all, as `$defs` | — | — |

## Example entry

```json
{
  "demo": true,
  "entity": "<Entity>",
  "items": [
    { "id": "<id>", "<field>": "<value>", "demo": true }
  ]
}
```

## Loader

- **Module:** `<lib/data.ts>`: typed getters (`get<Entities>()`, `get<Entity>(id)`), the only place that reads `data/`.
- **Types:** generated from or written to match the `schema.json` in `data/`.
- **Switching to real data:** <what replaces the loader: CMS client, database query, API call>, and the environment variables it needs (all in `.env.example`).

## Replacing demo data

1. Replace each file's `items` with real entries; remove `"demo": true` from the file and every entry.
2. Validate against the `schema.json` in `data/`.
3. Remove the demo line from `README.md` only when no demo entry is left.
