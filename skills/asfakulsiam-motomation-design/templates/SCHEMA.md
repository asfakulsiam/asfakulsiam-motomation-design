# SCHEMA.md: <Project name>

> The data contract. Written at the same time as DESIGN.md (not after the build), and shipped with every build as part of the template (`templates/TEMPLATE.md`). Every entity, every route, every state, the API surface and the handoff notes. A backend developer reading this file alone builds the backend without asking a question. Every field, route, section and endpoint the page uses is here; nothing on the page reads data that isn't.

<!--
Rules for filling it in
- One row per field. Types: string, text (multi-line), int, decimal, money (minor units + currency), bool, date (ISO 8601),
  datetime (ISO 8601, UTC), url, email, phone (E.164), slug, enum(a|b|c), image (url + alt + width + height), ref(Entity),
  list<T>.
- "Appears at" names the route and the section id (from the section contract), e.g. `/` · `#rooms` · card title.
- Example values are real or `[NEEDS COPY]`; never lorem ipsum.
- A static site with no backend still fills Data model, Routes and Section contract (the content is the data);
  API surface says "none: static", Handoff notes says where the content lives.
- Write "none" rather than deleting a section.
-->

## Data model

### <Entity> <!-- e.g. Room, Product, Post, Event, Person, Settings -->
<one line: what it is, where it comes from (CMS, database, file, third-party API)>

| Field | Type | Required | Example | Appears at |
|---|---|---|---|---|
| `id` | string | required | `rm_08` | not shown; used in URLs and keys |
| `<field>` | <type> | required / optional | `<example>` | `<route>` · `#<section-id>` · <element> |

Relations: <Entity>.<field> → <Other entity> (one-to-many | many-to-many). Sort order: <field, direction>. Uniqueness: <fields>.

### Data files
Where each entity's mock data lives (`DATA.md`). Every entity above has a file; every file is labelled demo.

| Entity | Mock file | Entries | Loader |
|---|---|---|---|
| <Entity> | `data/<entity-plural>.json` | <n> | `<lib/data.ts: getEntities()>` |

## Routes

Every URL the site serves.

| Route | Page | Reads | Rendering | Notes |
|---|---|---|---|---|
| `/` | Home | <Entity (which fields, how many, sorted how)> | static / SSR / ISR (revalidate n s) / client | |
| `/<collection>/[slug]` | <Detail> | <Entity by slug> | | 404 when the slug is unknown |
| `/404` | Not found | none | static | |

Redirects: <from → to, status>. Sitemap: <which routes>. `noindex`: <which routes>.

## Section contract

For every section on every page. The section id matches the `id` attribute in the markup.

### `<route>`

| Section id | Reads | Empty | Loading | Error | Filled |
|---|---|---|---|---|---|
| `#<id>` | <Entity.fields, filter, limit> | <what renders when there is no data, or "never empty: <why>"> | <skeleton / reserved space (no layout shift) / "static: n/a"> | <message + retry, or the fallback content> | <what renders, in one line> |

## States
Every state of every route and async surface, in one index (the section contract has the detail). Derived from the Step 1 scope; nothing here is a fixed list.

| Route or surface | States | Where defined |
|---|---|---|
| `<route>` · `<surface>` | <empty · loading (skeleton) · error · filled · …> | section contract row / component file |

## API surface

<"none: static" if the site has no backend. Otherwise every endpoint.>

### `<METHOD> <path>`
- **Purpose:** <one line>
- **Auth:** <none | session cookie | API key (server only)>
- **Request:**
  ```json
  { "<field>": "<type, constraints>" }
  ```
- **Response 200:**
  ```json
  { "<field>": "<type>" }
  ```
- **Errors:** `400` <validation: which field, what message> · `401` <when> · `404` <when> · `409` <when> · `429` <rate limit> · `500` <generic message; details only in server logs>
- **Validation:** <server-side schema, limits> (`craft/security.md` sec-11)
- **Rate limit:** <n per window per IP/account> (sec-15)

## Environment variables
Every variable the code reads. All are in `.env.example` with a placeholder; the template runs with none of them set.

| Variable | Server / public | Required in production | Placeholder | Used by | When unset |
|---|---|---|---|---|---|
| `<NAME>` | server | yes | `<placeholder>` | `<file or endpoint>` | <falls back to data/ · feature shows a notice> |

## Handoff notes

- **Environment variables:** `<NAME>`: <what it is, where to get it, server only | public> (secrets never `NEXT_PUBLIC_`/`PUBLIC_`; sec-07)
- **Third-party services:** <service: what for, which plan, which keys>
- **Rate limits:** <per endpoint, as above>
- **Auth flow:** <none | the flow, step by step: where the session is created, cookie flags (sec-06), where access is checked on the server (sec-02)>
- **Content source:** <CMS / database / files: who edits it, how a change reaches the site>
- **Images and media:** <where they are stored, sizes and formats the design needs (AVIF/WebP, width × height)>
- **Caching and revalidation:** <per route>
- **Security items for the owner:** <the [H] items of `craft/security.md` that apply, open or done>
- **Assumptions:** <none, or each default the design assumed where the brief was silent, so nothing is left to ask>
