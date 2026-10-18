# Demo data

All data in data/ is demo. Replace with real data before launch.

catalog.json holds six individually named rooms with distinct rates, capacity, bed type, access notes, area and description; two optional experiences with per-person rates and duration. Every room and experience entry has demo: true.

schema.json defines the catalog and requires the demo flag. response.json is a labelled static acknowledgement fixture for async form feedback, not a server booking.

The frontend reads the catalog embedded by build.mjs into app-data.js so browsing rooms remains possible after the initial page has loaded even if the response fixture is unavailable. localStorage holds the draft and reservations. Data is not shared between browsers. No third-party channel inventory is read.
