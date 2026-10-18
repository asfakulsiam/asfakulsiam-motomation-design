# AirWatch Bangladesh: public air-quality data portal
Type: data-heavy
Status: evaluation brief (v6). Fictional client; do not invent statistics, logos or testimonials.

## The client
AirWatch (fictional) publishes hourly readings from 60 monitoring stations for journalists, researchers and residents.

## Product contract (expected)
Jobs:
- A resident checks today's air quality where they live; a journalist compares stations over time and downloads the data.

Core journeys (route sequences):
- Home → station map → station detail → 30-day chart
- Data explorer → choose stations and range → chart and table → download CSV
- Home → methodology → data licence

Required routes: Home (current status), station map, station detail, data explorer (multi-select, date range, chart, table view of the same data), downloads, methodology, health guidance, API docs link, about, contact, privacy, terms, 404.

Capability levels: Charts and filters are frontend interaction over shipped sample data; the live feed is an integration and may be deferred with its interface kept; every chart has a table alternative.

## Pressures
- Dense charts and tables vs residents who need one clear answer.
- Colour scales must remain accessible to colour-blind users.

## Bias probe
A biased skill would produce: a narrative scrollytelling page that replaces the explorer; decorative charts without axes, units or table alternatives.

## Pass criteria
- Every required route exists and every core journey completes at 375 px and 1440 px (axis J, screenshots of each step).
- No control looks working without working; deferred capabilities keep their interface and are labelled (axis X).
- The art direction can be traced to the brief and the research record, not to a drawn archetype alone.
- Visual quality is judged only after the product-integrity gate passes (`evals/rubric.md`).
