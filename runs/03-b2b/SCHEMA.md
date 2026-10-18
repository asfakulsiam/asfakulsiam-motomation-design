# SCHEMA.md: Cargoline Freight Visibility Software

The data contract for Cargoline. Defines every entity, route, section contract, state, and integration surface.

## Data model (Entities)

### Entities Overview
The primary domain entities tracked in Cargoline.

### Shipment
Represents an in-transit freight container or air cargo shipment with milestone tracking and AIS telemetry.
- Source: Carrier EDI 214/315 feeds, IATA ONE Record, and DCSA AIS telemetry (mocked in `data/shipments.json`).

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `id` | string | required | `SHP-8041` | `/` · `#telemetry-deck` · shipment code |
| `containerNumber` | string | required | `MSCU7821904` | `/` · `#telemetry-deck` · identifier |
| `carrier` | string | required | `Mediterranean Shipping Co` | `/` · `#telemetry-deck` · carrier name |
| `origin` | string | required | `Port of Ningbo-Zhoushan` | `/` · `#telemetry-deck` · origin port |
| `destination` | string | required | `Port of Long Beach` | `/` · `#telemetry-deck` · destination |
| `mode` | enum(Ocean\|Air\|Intermodal) | required | `Ocean` | `/product/tracking` · mode tag |
| `status` | string | required | `In Transit: North Pacific` | `/product/tracking` · status pill |
| `eta` | datetime | required | `2026-10-24 14:00 UTC` | `/` · `#telemetry-deck` · ETA window |
| `vessel` | string | optional | `MSC Isabella` | `/product/tracking` · vessel name |
| `voyage` | string | optional | `V-204W` | `/product/tracking` · voyage code |
| `demo` | bool | required | `true` | Data file internal |

### Integration
Represents pre-configured connectors to carrier feeds, ERP systems, TMS platforms, and customs portals.
- Source: Integration ecosystem registry (mocked in `data/integrations.json`).

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `id` | string | required | `INT-01` | `/integrations` · item key |
| `name` | string | required | `SAP S/4HANA Supply Chain` | `/integrations` · card title |
| `category` | enum(Ocean\|Air\|ERP\|TMS\|Customs) | required | `ERP` | `/integrations` · filter pill |
| `description` | string | required | `Bidirectional purchase order sync` | `/integrations` · card body |
| `protocol` | string | required | `REST / Webhooks` | `/integrations` · tech badge |
| `demo` | bool | required | `true` | Data file internal |

### Plan
Commercial subscription tier for mid-market and enterprise importers.
- Source: Pricing catalog (mocked in `data/plans.json`).

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `id` | string | required | `plan-growth` | `/pricing` · plan card |
| `name` | string | required | `Commercial Importer` | `/pricing` · tier header |
| `annualPrice` | money | required | `1650` | `/pricing` · annual rate |
| `monthlyPrice` | money | required | `1950` | `/pricing` · monthly rate |
| `teuLimit` | string | required | `Up to 6,000 TEUs/year` | `/pricing` · volume limit |
| `description` | string | required | `Designed for mid-size manufacturers` | `/pricing` · tier description |
| `features` | list<string> | required | `["Multi-modal tracking", ...]` | `/pricing` · feature checklist |
| `demo` | bool | required | `true` | Data file internal |

### Story
Verified operational case studies of importer efficiency gains.
- Source: Customer outcomes ledger (mocked in `data/stories.json`).

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `id` | string | required | `story-01` | `/stories` · story card |
| `slug` | slug | required | `midwest-foods` | `/stories/[slug]` · URL path |
| `company` | string | required | `Midwest Specialty Foods` | `/stories` · company name |
| `industry` | string | required | `Perishable Foods & Ingredients` | `/stories` · sector tag |
| `scale` | string | required | `2,400 TEUs imported annually` | `/stories` · operational scale |
| `challenge` | text | required | `Manual tracking caused demurrage` | `/stories/midwest-foods` · challenge |
| `solution` | text | required | `Automated milestone feeds with NetSuite` | `/stories/midwest-foods` · solution |
| `operationalGain` | text | required | `Zero lost loads over 18 months` | `/stories/midwest-foods` · impact |
| `demo` | bool | required | `true` | Data file internal |

## Data files
| Entity | Mock file | Entries | Loader |
|---|---|---|---|
| Shipment | `data/shipments.json` | 6 | `lib/data.js: getShipments()` |
| Integration | `data/integrations.json` | 8 | `lib/data.js: getIntegrations()` |
| Plan | `data/plans.json` | 3 | `lib/data.js: getPlans()` |
| Story | `data/stories.json` | 3 | `lib/data.js: getStories()` |

## Routes
| Route | Page | Reads | Rendering | Notes |
|---|---|---|---|---|
| `/` | Home | Shipment, Plan, Story | Static HTML with client JS telemetry | Core entry point |
| `/product` | Product Overview | Shipment | Static HTML | Architecture and multi-modal overview |
| `/product/tracking` | Multimodal Tracking | Shipment | Static HTML | Ocean, air, rail tracking detail |
| `/product/exceptions` | Predictive Exceptions | Shipment | Static HTML | AI delay alerts and root causes |
| `/product/customs` | Customs & Landed Cost | Shipment | Static HTML | Demurrage countdown and tariff audit |
| `/integrations` | Integrations Directory | Integration | Static HTML + dynamic filter | Filterable directory across 5 categories |
| `/pricing` | Pricing Matrix | Plan | Static HTML + billing cycle toggle | 3-tier card view + 24-row comparison |
| `/security` | Security Center | Security controls | Static HTML | SOC 2 Type II, ISO 27001, RBAC |
| `/security/overview` | Security Overview Whitepaper | Security architecture | Static HTML | Downloadable executive architecture summary |
| `/stories` | Customer Stories Index | Story | Static HTML | Index of operational importer case studies |
| `/stories/midwest-foods` | Customer Story Detail | Story (Midwest Foods) | Static HTML | In-depth case study with operational gains |
| `/docs` | Developer & EDI Documentation | Integration API specs | Static HTML | DCSA OpenAPI, EDI 214/315, Webhook guides |
| `/demo` | Book a Demo | none | Static HTML + form validation | Interactive multi-step scheduling form |
| `/demo/confirmed` | Demo Confirmation | none | Static HTML | Booking confirmation and preparation guide |
| `/contact` | Contact Sales | none | Static HTML + form validation | Operations inquiry form |
| `/careers` | Careers | Job postings | Static HTML | Current engineering and logistics roles |
| `/privacy` | Privacy Policy | Legal terms | Static HTML | GDPR / CCPA compliance statements |
| `/terms` | Terms of Service | Legal terms | Static HTML | Enterprise Master Services Agreement terms |
| `/cookies` | Cookie Policy | Cookie inventory | Static HTML | Preference settings and tracker disclosures |
| `/404.html` | Not Found | none | Static HTML | Custom 404 response with navigation paths |

## Section contract

### `/` (Home)
| Section id | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| `#hero-manifest` | Static copy | never empty | static: n/a | fallback heading | Hero banner with dispatch manifest overview |
| `#telemetry-deck` | Shipment.items | "No active shipments" | Skeleton pulse | "Telemetry feed offline" | Live multi-modal shipment status cards |
| `#feature-pillars` | Static copy | never empty | static: n/a | fallback cards | 3 primary capability deep-dive cards |
| `#pricing-preview` | Plan.items | "Plans unavailable" | Skeleton card | "Pricing table offline" | 3 tier comparison cards |

### `/integrations`
| Section id | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| `#filter-bar` | Categories | never empty | static: n/a | fallback buttons | 6 category filter pills |
| `#integrations-grid` | Integration.items | "No matching connectors" | Skeleton grid | "Failed to load connectors" | Filterable connector cards |

### `/pricing`
| Section id | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| `#billing-toggle` | Billing modes | never empty | static: n/a | fallback switch | Monthly / Annual billing toggle switch |
| `#pricing-grid` | Plan.items | "Plans unavailable" | Skeleton grid | "Pricing table offline" | 3 plan tier pricing cards |
| `#comparison-table` | Plan feature matrix | never empty | static: n/a | fallback table | 24-row capability comparison grid |

### `/demo`
| Section id | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| `#demo-form` | Form fields | default empty | button spinner | field validation error | Interactive booking form with date & time slots |

## States
| Route or surface | States | Where defined |
|---|---|---|
| `/demo` · `#demo-form` | default, validation error, submit loading, success | `demo/index.html` |
| `/contact` · `#contact-form` | default, validation error, submit loading, success | `contact/index.html` |
| `/integrations` · `#integrations-grid` | empty, filled, filtered | `integrations/index.html` |
| `/pricing` · `#pricing-grid` | monthly active, annual active | `pricing/index.html` |
| `/` · `#telemetry-deck` | loading skeleton, populated telemetry | `index.html` |

## API surface
none: static (Delivery mode: functional frontend; CRM submission and live AIS webhooks deferred).

## Handoff notes
All mock data is committed in `data/*.json`. In production, client API calls in `assets/app.js` will route to backend endpoints `/api/v1/shipments`, `/api/v1/integrations`, and `/api/v1/demo-requests`.
