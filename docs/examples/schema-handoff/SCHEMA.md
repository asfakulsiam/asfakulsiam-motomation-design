# SCHEMA.md: Daftari

> The data contract, written with `DESIGN.md` from `templates/SCHEMA.md`. A backend developer builds the backend from this file alone.

## Data model

### Service
The three kinds of work. Content file `content/services.json`, edited by the owners; shown in the order of `order`.

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `id` | slug | required | `rebacking` | not shown; the `service` value of the request form |
| `order` | int | required | `1` | not shown; sort key |
| `name` | string (≤ 30) | required | `Rebacking` | `/` · `#services` · ticket `h3`; `#request` · `service` option label |
| `description` | text (≤ 140) | required | `A new spine on the old boards, the original spine label laid back on top.` | `/` · `#services` · ticket body |
| `price_from` | money (taka, int) | required | `900` | `/` · `#services` · `.price` `data[value]`, shown as "from 900 taka" |
| `price_unit` | enum(job\|copy) | required | `job` | `/` · `#services` · "a copy" suffix when `copy` |
| `turnaround_days` | int | required | `7` | `/` · `#services` · `.turn`, shown as "about 7 days" |

### ProcessStep
The five bench steps. Content file `content/process.json`; fixed order.

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `order` | int (1–9) | required | `1` | `/` · `#process` · `.n` |
| `name` | string (≤ 20) | required | `Docket` | `/` · `#process` · step `h3` |
| `note` | string (≤ 80) | required | `You send photos. We reply with a price and a date.` | `/` · `#process` · step body |

### Settings
One record. Content file `content/settings.json`.

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `hours` | string | required | `Saturday to Thursday, 10:00 to 19:00. Closed Friday.` | `/` · `#hours`; JSON-LD `openingHours` (`Sa-Th 10:00-19:00`) |
| `address` | string | required | `[NEEDS COPY: street address]` | `/` · `#hours`; JSON-LD `address` |
| `phone` | phone (E.164) | required | `[NEEDS COPY: phone]` | `/` · `#hours`; error message "call the shop" |
| `founded_year` | int | optional | `[NEEDS COPY: year]` | `/` · footer; hidden when empty |
| `reply_promise` | string | required | `within one working day` | `/` · `#request` · sent message |

### Request
A repair or commission request. Created by `POST /api/requests`; stored in the database table `requests`; never shown on the site.

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `docket` | string, `D-` + 4 digits, server-assigned, sequential | required | `D-0142` | `/` · `#request` · sent message |
| `name` | string (1–80) | required | `Farhana Akter` | form field `name` |
| `contact` | email or phone (E.164), ≤ 120 | required | `farhana@example.com` | form field `contact` |
| `service` | enum(rebacking\|resew\|thesis\|other) | required | `resew` | form field `service` |
| `details` | text (1–2000) | required | `Spine split, last 40 pages loose.` | form field `details` |
| `photos` | list<image>, 0–3, JPEG/PNG/WebP, ≤ 5 MB each | optional | `[photos/D-0142-1.webp]` | form field `photos` |
| `created_at` | datetime (UTC) | required | `2026-10-15T08:30:00Z` | not shown |
| `status` | enum(new\|quoted\|on_bench\|ready\|collected) | required, default `new` | `new` | not shown (owners' inbox) |

## Routes

| Route | Page | Reads | Rendering | Notes |
|---|---|---|---|---|
| `/` | Home (one page) | Service (all, by `order`), ProcessStep (all, by `order`), Settings | static, rebuilt when a content file changes | sections `#top`, `#services`, `#process`, `#request`, `#hours` |
| `/api/requests` | (function) | writes Request | serverless | see API surface |
| `/404` | Not found | none | static | host default |

Redirects: none. Sitemap: `/`. `noindex`: none.

## Section contract

### `/`

| Section id | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| `#top` | none (static copy) | never empty: fixed copy | static: n/a | static: n/a | hero line, lede, link to `#request` |
| `#services` | Service: all, by `order` | build fails: the site needs ≥ 1 service | static: n/a | build fails with the invalid file named | one ticket per service: name, description, "from {price_from} taka" (+ "a copy" when `price_unit = copy`), "about {turnaround_days} days" |
| `#process` | ProcessStep: all, by `order` | section omitted from the page and the nav | static: n/a | build fails with the invalid file named | numbered steps: `.n` = order, `h3` = name, body = note |
| `#request` | Service (for options) · writes Request | form always shown; "Not sure yet" (`other`) always present | `data-state="sending"`: button disabled, status "Sending your docket…" | `data-state="error"`: the server's `message` + "Please try again, or call the shop."; field values kept | `data-state="sent"`: "Docket {docket} is open. We reply {reply_promise}."; form reset |
| `#hours` | Settings: hours, address, phone | `[NEEDS COPY]` markers until filled (never blank) | static: n/a | build fails when `hours` is missing | hours line, address and phone |

## API surface

### `POST /api/requests`
- **Purpose:** open a docket for a repair or commission request and notify the workshop.
- **Auth:** none (public form). Spam controls below.
- **Request:** `multipart/form-data`
  ```json
  { "name": "string 1–80", "contact": "email or E.164 phone, ≤ 120", "service": "rebacking | resew | thesis | other",
    "details": "string 1–2000", "photos": "0–3 files, image/jpeg | image/png | image/webp by magic bytes, ≤ 5 MB each" }
  ```
- **Response 201:**
  ```json
  { "docket": "D-0142", "message": "Docket D-0142 is open." }
  ```
- **Errors:** `400` `{ "message": "<field>: <reason>", "field": "<field>" }` (validation) · `413` `{ "message": "Photos must be 5 MB or less each." }` · `415` `{ "message": "Photos must be JPEG, PNG or WebP." }` · `429` `{ "message": "Too many requests. Please wait a few minutes." }` with `Retry-After` · `500` `{ "message": "The request did not go through." }` (details only in server logs, without the contact field)
- **Validation:** server-side schema for every field (`craft/security.md` sec-11); photos sniffed by magic bytes, re-encoded to WebP, stored as `photos/<docket>-<n>.webp` outside the public site (sec-13).
- **Rate limit:** 5 requests per 10 minutes per IP, 20 per day per contact (sec-15).
- **Side effects:** inserts a Request with `status = new`; emails the workshop inbox with the docket, fields and photo links; no email to the visitor.

## Handoff notes

- **Environment variables:** `DATABASE_URL` (server only; Postgres for `requests`) · `MAIL_API_KEY` (server only; transactional mail provider) · `WORKSHOP_INBOX` (server only; where requests are sent) · `PHOTO_BUCKET` (server only; private object storage bucket). None are exposed to the client (sec-07); `.env` is gitignored (sec-08).
- **Third-party services:** a transactional mail provider (one sender address, verified domain); private object storage for photos; Postgres for requests (row-level security on `requests`, server role only, sec-03).
- **Rate limits:** as above, enforced at the function or edge.
- **Auth flow:** none for visitors. The owners read requests in the mail inbox; any later admin view is behind auth with `noindex` (sec-01).
- **Content source:** `content/services.json`, `content/process.json`, `content/settings.json` in the repo; a change rebuilds `/`.
- **Images and media:** visitor photos only; no site imagery. Stored as WebP, longest edge 2000px.
- **Caching and revalidation:** `/` cached at the edge until the next deploy; `/api/requests` never cached.
- **Headers:** `_headers` sends CSP (`connect-src 'self'`, `form-action 'self'`), `nosniff` and `Referrer-Policy`; the function returns JSON with `Cache-Control: no-store`.
- **Security items for the owner:** sec-14 n/a (no webhooks) · sec-18 and sec-19 open: run `npm audit` and a scan on the function before launch.
- **Assumptions:** docket numbers are sequential per year and reset each 1 January (`D-0001`); requests in Bangla or English are both accepted as-is; replies are by the owners, by hand.
