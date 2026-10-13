# Security checklist

A beautiful page that leaks a key or trusts the client is not delivered. Loaded on every build and redesign
(SKILL.md). Tags: **[M] mechanical** (a tool can decide it) and **[H] human** (the owner, or a scanner the owner runs).
Items marked **gate K** are measured on every page by `scripts/gate.mjs` (axis K, gate/4); the other [M] items are
ticked in `gates/delivery-gate.md` "Security" with the file or command that proves them. A static page with no
backend writes "n/a (no backend)" for server items, never a tick.

| ID | Tag | Item | How it is decided |
|---|---|---|---|
| sec-01 | [M] | Admin routes require auth and carry `noindex` | route list + middleware; a request without a session gets 401/redirect |
| sec-02 | [M] | Access checks run on the server, not only in the client | read each protected handler; hiding a button is not a check |
| sec-03 | [H] | Row-level security where the database supports it | the policy list (e.g. Postgres RLS) |
| sec-04 | [H] | Email verification on signup | the auth provider's setting |
| sec-05 | [H] | Passwords hashed with bcrypt or argon2 | the auth code or provider |
| sec-06 | [M] | Auth cookies are `HttpOnly`, `Secure` and `SameSite` | **gate K** checks every `Set-Cookie` on the page response |
| sec-07 | [M] | No secrets in client bundles | **gate K** scans the HTML, inline scripts and same-origin scripts for secret-shaped strings |
| sec-08 | [M] | `.env` is gitignored; `.env.example` holds placeholders only | `git check-ignore .env`; read `.env.example` |
| sec-09 | [M] | No secrets in logs | grep the log output for the same secret patterns gate K uses |
| sec-10 | [H] | Every SQL query is parameterised | read the data layer; no string-built SQL |
| sec-11 | [M] | Form inputs validated on the server (Zod or equivalent) | every mutation handler parses its input before use |
| sec-12 | [M] | Output escaped; no raw `innerHTML` with user input | **gate K** fails an inline script that writes `location`, `search`, `hash` or URL parameters into `innerHTML`/`outerHTML`/`document.write`; the rest by reading |
| sec-13 | [M] | File uploads validated by MIME type and size | the upload handler |
| sec-14 | [H] | Webhooks verify their signature | each webhook handler |
| sec-15 | [M] | Rate limits on auth, contact forms and every mutation | the middleware or edge config |
| sec-16 | [M] | CORS is narrow; no wildcard in production | **gate K** fails `Access-Control-Allow-Origin: *` on a page served over https |
| sec-17 | [M] | Debug mode off in production | **gate K** warns on development builds (React development build, source maps on a production URL) |
| sec-18 | [H] | Dependencies patched (`npm audit` clean, or each finding written down) | the audit output |
| sec-19 | [H] | A security scan run and its results recorded | the scan report |
| sec-20 | [M] | No client-supplied value is trusted for authorisation | read the handlers: role, user id and price come from the session or the database, never the request body |

## Header baseline (gate K)

Three response headers every delivered page sends. They cost nothing and close whole classes of attack.

| ID | Header | Accepted as | Why |
|---|---|---|---|
| sec-h1 | `Content-Security-Policy` | the response header, or `<meta http-equiv="Content-Security-Policy">` | limits where scripts, styles and frames can load from |
| sec-h2 | `X-Content-Type-Options: nosniff` | the response header only (there is no meta equivalent) | stops a browser running a file as a type it wasn't served as |
| sec-h3 | `Referrer-Policy` | the response header, or `<meta name="referrer">` | keeps full URLs (tokens, search terms) out of other sites' logs |

A static page sets headers through its host. For local files the gate reads a `_headers` file next to the page (the
format Netlify and Cloudflare Pages use: a path line, then indented `Name: value` lines), so a template proves its
headers the same way it would ship them.

## Secret patterns gate K looks for

Private key blocks (`-----BEGIN … PRIVATE KEY-----`), AWS access key IDs, Stripe live secret keys, GitHub tokens,
Slack tokens, Google API keys, OpenAI/Anthropic-style keys, and `secret`/`token`/`password`/`api_key` assignments to a
long literal. A match is reported with the first and last four characters only, never the whole value. Publishable
keys (`pk_live_…`) are allowed: they are meant for the client.

Each failing gate K item adds one to the K count in the stamp (`rules: C0 S0 P0 K0`); the page passes K at 0.
