# DATA.md: Cargoline Freight Visibility Software

All data in data/ is demo. Replace with real data before launch.

The shape of the `data/` folder: committed mock data enabling the functional frontend template to run with zero external configuration or API credentials.

## Files

| File | Entity (`SCHEMA.md`) | Entries | Covers states |
|---|---|---|---|
| `data/shipments.json` | Shipment | 6 | Ocean, Air, and Intermodal modes; normal transit, customs hold, berth congestion, and discharge |
| `data/integrations.json` | Integration | 8 | ERP (SAP, NetSuite, Dynamics), TMS (CargoWise, Descartes), Ocean feeds, Air cargo, and Customs ACE |
| `data/plans.json` | Plan | 3 | Mid-Market Importer, Commercial Importer, and Global Enterprise tiers with monthly and annual rates |
| `data/stories.json` | Story | 3 | Food & beverage cold-chain, industrial hardware importing, and consumer goods demurrage mitigation |
| `data/schema.json` | JSON Schema | - | Formal JSON Schema (draft 2020-12) validating all entity shapes |

## Example entry

```json
{
  "demo": true,
  "entity": "Shipment",
  "items": [
    {
      "id": "SHP-8041",
      "containerNumber": "MSCU7821904",
      "carrier": "Mediterranean Shipping Co",
      "origin": "Port of Ningbo-Zhoushan",
      "destination": "Port of Long Beach",
      "mode": "Ocean",
      "status": "In Transit: North Pacific",
      "eta": "2026-10-24 14:00 UTC",
      "lat": 34.2,
      "lng": -152.4,
      "vessel": "MSC Isabella",
      "voyage": "V-204W",
      "demo": true
    }
  ]
}
```

## Loader
- **Module:** `assets/app.js`: In static frontend mode, data files are read directly or inlined as typed JSON structures.
- **Switching to real data:** In production, replace `assets/app.js` mock fetches with calls to your secure backend API (`/api/v1/...`) connected to carrier EDI gateways (EDI 214/315), DCSA standard APIs, and ERP webhooks.

## Replacing demo data
1. Replace each file's `items` array with verified production records.
2. Ensure every record adheres to `data/schema.json`.
3. Remove `\"demo\": true` from records when live feeds are connected.
4. Update `README.md` to reflect production deployment readiness.
