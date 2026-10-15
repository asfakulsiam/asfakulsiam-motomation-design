# Security checklist

A beautiful page that leaks a key or trusts the client is not delivered. Loaded on every build and redesign
(SKILL.md); the [M] limits are in `gates/rules.md` (Security), read before design. Tags: **[M] mechanical** (a tool
can decide it) and **[H] human** (the owner, or a scanner the owner runs). Items marked **gate K** are measured on
every page by `scripts/gate.mjs` (axis K, gate/4): failures count in K, heuristic checks print as warnings and are
never counted. The other items are ticked in `gates/delivery-gate.md` "Security" with the file or command that proves
them. A static page with no backend writes "n/a (no backend)" for server items, never a tick.

| ID | Tag | Item | How it is decided |
|---|---|---|---|
| sec-01 | [M] | Protect admin routes: auth required, `noindex` set | route list + middleware; a request without a session gets 401 or a redirect |
| sec-02 | [H] | Server-side permissions: every access check runs on the server | read each protected handler; hiding a button is not a check |
| sec-03 | [M] | Row-level security where applicable | the policy list (`pg_policies`, the Supabase dashboard); every user-data table has RLS on |
| sec-04 | [H] | Verify email addresses on signup | the auth provider's setting or the signup handler |
| sec-05 | [H] | Hash passwords with bcrypt or argon2 | the auth code or the provider's documentation |
| sec-06 | [M] | No auth tokens in local storage: cookies only, `HttpOnly`, `Secure`, `SameSite` | **gate K** checks every `Set-Cookie` on the page response (fails); `localStorage`/`sessionStorage` writes of token-named keys warn |
| sec-07 | [M] | No secrets in client bundles | **gate K** scans the HTML, inline scripts and same-origin scripts for secret-shaped strings (fails) |
| sec-08 | [M] | `.env` files not in git (verify `.gitignore`) | `git check-ignore .env`; **gate K** warns when a local target's project does not ignore `.env` |
| sec-09 | [M] | No sensitive data in logs | grep the log output for the gate K secret patterns, emails and `password`; **gate K** warns on `console.*` calls that print them |
| sec-10 | [H] | All SQL is parameterized | read the data layer; no string-built SQL |
| sec-11 | [M] | Validate all form inputs server-side | every mutation handler parses its input before use |
| sec-12 | [M] | Escape output; no raw `innerHTML` with user input | **gate K** fails an inline script that writes `location`, `search`, `hash` or URL parameters into `innerHTML`/`outerHTML`/`document.write`; the rest by reading |
| sec-13 | [M] | Validate file uploads by MIME and size | the upload handler: allow-list, size limit, storage path |
| sec-14 | [H] | Verify webhook signatures | each webhook handler |
| sec-15 | [M] | Rate-limit requests (auth, contact, mutations) | the middleware or edge config |
| sec-16 | [M] | Tighten CORS; no wildcard in production | **gate K** fails `Access-Control-Allow-Origin: *` on the page |
| sec-17 | [M] | Disable production debugging | **gate K** warns on development builds (React development build, source maps on a production URL) |
| sec-18 | [H] | Update vulnerable dependencies | the audit output |
| sec-19 | [H] | Run the security scan; record results | the scan report |
| sec-20 | [M] | Never trust client-supplied values for authorisation | read the handlers: role, user id and price come from the session or the database |

## The twenty rules

Each rule: what it asks, why, one good example, one bad example.

### sec-01 [M] Protect admin routes: auth required, `noindex` set

- **What:** Every admin, dashboard or internal route requires an authenticated session and sends `noindex`.
- **Why:** An unauthenticated admin URL is the shortest path to the data; an indexed one gets found by search engines and scanners.
- **Good:** `middleware.ts` redirects `/admin/*` without a session to `/login`; the admin layout sets `<meta name="robots" content="noindex, nofollow">` and `X-Robots-Tag: noindex`.
- **Bad:** `/admin` renders for anyone who knows the URL and is listed in `sitemap.xml`.
- **Decided by:** route list + middleware; a request without a session gets 401 or a redirect

### sec-02 [H] Server-side permissions: every access check runs on the server

- **What:** Every read and write of protected data checks the user's permission in the server handler, never only in the client.
- **Why:** Client code is the visitor's code. Hiding a button stops nobody who can open DevTools or send a request with curl.
- **Good:** `DELETE /api/posts/:id` loads the post and returns 403 unless `post.ownerId === session.userId`.
- **Bad:** The delete button renders only for owners; the endpoint deletes whatever id it receives.
- **Decided by:** read each protected handler; hiding a button is not a check

### sec-03 [M] Row-level security where applicable

- **What:** Where the database supports it (Postgres, Supabase), row-level security is on for every table holding user data, with a policy per operation.
- **Why:** A single missing `WHERE user_id = …` leaks every row; RLS makes the database refuse it even when the code forgets.
- **Good:** `alter table notes enable row level security; create policy own_notes on notes using (user_id = auth.uid());`
- **Bad:** A Supabase table read from the browser with the anon key and RLS disabled.
- **Decided by:** the policy list (`pg_policies`, the Supabase dashboard); every user-data table has RLS on

### sec-04 [H] Verify email addresses on signup

- **What:** A new account cannot act as its email address (sign in to paid features, receive resets, send invites) until the address is confirmed.
- **Why:** Unverified addresses enable account squatting, spam relays and password-reset hijacks of someone else's address.
- **Good:** The auth provider sends a signed, expiring link; `email_verified` is checked before the account is active.
- **Bad:** Signup logs the user straight in and trusts the typed address for resets.
- **Decided by:** the auth provider's setting or the signup handler

### sec-05 [H] Hash passwords with bcrypt or argon2

- **What:** Passwords are stored only as a slow, salted hash: argon2id or bcrypt (cost ≥ 12). Never plain, never a fast hash.
- **Why:** Databases leak. A slow salted hash turns a leak into years of cracking; MD5 or SHA-256 turns it into minutes.
- **Good:** `await argon2.hash(password)` on signup; `argon2.verify(hash, input)` on login.
- **Bad:** `sha256(password)` or the password itself stored in a `password` column.
- **Decided by:** the auth code or the provider's documentation

### sec-06 [M] No auth tokens in local storage: cookies only, `HttpOnly`, `Secure`, `SameSite`

- **What:** Session and auth tokens live in cookies flagged `HttpOnly`, `Secure` and `SameSite`; never in `localStorage` or `sessionStorage`.
- **Why:** Any script on the page can read web storage, so one XSS hands over the session. An `HttpOnly` cookie can't be read by script.
- **Good:** `Set-Cookie: sid=…; Path=/; HttpOnly; Secure; SameSite=Lax`
- **Bad:** `localStorage.setItem('authToken', res.token)`
- **Decided by:** **gate K** checks every `Set-Cookie` on the page response (fails); `localStorage`/`sessionStorage` writes of token-named keys warn

### sec-07 [M] No secrets in client bundles

- **What:** No private key, secret API key, token or password appears in served HTML or JavaScript. Only publishable keys reach the client.
- **Why:** Anything shipped to the browser is public: bundles are cached, mirrored and searched for keys within minutes.
- **Good:** The server calls Stripe with `process.env.STRIPE_SECRET_KEY`; the client gets only `pk_live_…`.
- **Bad:** `const stripe = Stripe('sk_live_…')` in a client component, or `NEXT_PUBLIC_OPENAI_KEY`.
- **Decided by:** **gate K** scans the HTML, inline scripts and same-origin scripts for secret-shaped strings (fails)

### sec-08 [M] `.env` files not in git (verify `.gitignore`)

- **What:** `.env` and `.env.*` are listed in `.gitignore`; only `.env.example` with placeholders is committed.
- **Why:** A committed secret stays in history after it's deleted; public repos are scanned for keys continuously.
- **Good:** `.gitignore` has `.env`, `.env.*`, `!.env.example`; `git check-ignore .env` prints `.env`.
- **Bad:** `.env.production` committed "just for the deploy".
- **Decided by:** `git check-ignore .env`; **gate K** warns when a local target's project does not ignore `.env`

### sec-09 [M] No sensitive data in logs

- **What:** Logs and console output never contain tokens, keys, passwords, session ids or email addresses.
- **Why:** Logs travel further than the database: log services, CI output, support screenshots, browser consoles.
- **Good:** `logger.info('login ok', { userId })`
- **Bad:** `console.log('login', user.email, token)`
- **Decided by:** grep the log output for the gate K secret patterns, emails and `password`; **gate K** warns on `console.*` calls that print them

### sec-10 [H] All SQL is parameterized

- **What:** Every query passes values as parameters or through a query builder or ORM; no SQL is built by string concatenation.
- **Why:** String-built SQL is SQL injection: one quote in an input reads or deletes the database.
- **Good:** `db.query('select * from users where email = $1', [email])`
- **Bad:** `` db.query(`select * from users where email = '${email}'`) ``
- **Decided by:** read the data layer; no string-built SQL

### sec-11 [M] Validate all form inputs server-side

- **What:** Every mutation handler parses and validates its input with a schema (Zod or equivalent) before using it; client validation is only for feedback.
- **Why:** Client validation is skipped by anyone who sends the request directly. Unvalidated input reaches the database, the mailer and the logs.
- **Good:** `const data = ContactSchema.parse(await req.json())` with length limits and an email format.
- **Bad:** `await db.insert(messages).values(await req.json())`
- **Decided by:** every mutation handler parses its input before use

### sec-12 [M] Escape output; no raw `innerHTML` with user input

- **What:** User- or URL-supplied text is rendered as text (`textContent`, framework escaping). Raw HTML from users is sanitized (DOMPurify) first.
- **Why:** Writing user input as HTML is cross-site scripting: the attacker's script runs as the visitor, with their session.
- **Good:** `el.textContent = params.get('q')`; React `{q}`.
- **Bad:** `el.innerHTML = location.hash.slice(1)`; `dangerouslySetInnerHTML={{ __html: comment }}` unsanitized.
- **Decided by:** **gate K** fails an inline script that writes `location`, `search`, `hash` or URL parameters into `innerHTML`/`outerHTML`/`document.write`; the rest by reading

### sec-13 [M] Validate file uploads by MIME and size

- **What:** The server checks each upload's real type (magic bytes, not the extension) against an allow-list and enforces a size limit; files are stored outside the web root with generated names.
- **Why:** An unchecked upload is a way to host malware, run a script on your domain, or fill the disk.
- **Good:** Accept `image/jpeg`, `image/png`, `image/webp` up to 5 MB, sniffed with `file-type`; saved as `<uuid>.webp`.
- **Bad:** Any file saved to `/public/uploads/` under the name the user gave it.
- **Decided by:** the upload handler: allow-list, size limit, storage path

### sec-14 [H] Verify webhook signatures

- **What:** Each webhook handler verifies the provider's signature (and timestamp) over the raw body before acting.
- **Why:** A webhook URL is public. Without the signature check, anyone can post a fake "payment succeeded".
- **Good:** `stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)`
- **Bad:** `if (body.type === 'checkout.session.completed') fulfil(body)` with no signature check.
- **Decided by:** each webhook handler

### sec-15 [M] Rate-limit requests (auth, contact, mutations)

- **What:** Login, signup, password reset, contact forms and every mutation have a per-IP and per-account rate limit.
- **Why:** Without limits, passwords are brute-forced, inboxes flooded and paid APIs drained.
- **Good:** Login: 5 attempts per 15 minutes per account and IP, then 429 with `Retry-After`.
- **Bad:** A contact form that sends an email for every POST, unlimited.
- **Decided by:** the middleware or edge config

### sec-16 [M] Tighten CORS; no wildcard in production

- **What:** CORS allows only the origins that need it, listed by name; credentials are never combined with a wildcard.
- **Why:** `Access-Control-Allow-Origin: *` lets any site read your API's responses from a visitor's browser.
- **Good:** `Access-Control-Allow-Origin: https://app.example.com`
- **Bad:** `Access-Control-Allow-Origin: *` on an authenticated API in production.
- **Decided by:** **gate K** fails `Access-Control-Allow-Origin: *` on the page

### sec-17 [M] Disable production debugging

- **What:** Production runs a production build: no debug mode, no verbose error pages, no public source maps, no development React.
- **Why:** Debug output and stack traces map the system for an attacker; source maps publish the source.
- **Good:** `NODE_ENV=production`, `debug: false`, errors return an id; source maps uploaded privately to the error tracker.
- **Bad:** A stack trace with file paths and SQL on the 500 page; `react-dom.development.js` on the live site.
- **Decided by:** **gate K** warns on development builds (React development build, source maps on a production URL)

### sec-18 [H] Update vulnerable dependencies

- **What:** Known-vulnerable dependencies are updated, or each remaining finding is written down with the reason it is safe.
- **Why:** Most breaches use published vulnerabilities in old packages, not new ones.
- **Good:** `npm audit --omit=dev` clean; Dependabot or Renovate on; exceptions listed in `SECURITY.md`.
- **Bad:** A lockfile untouched for two years with critical advisories open.
- **Decided by:** the audit output

### sec-19 [H] Run the security scan; record results

- **What:** Before delivery, a security scan runs (`npm audit`, a secret scanner such as gitleaks, an OWASP ZAP baseline on the URL) and its results are recorded.
- **Why:** An unrecorded scan didn't happen. A recorded one lets the next person see what was found and what was accepted.
- **Good:** `SECURITY.md` lists the scan date, tools, findings and the fix or acceptance for each.
- **Bad:** "Looks secure" in the hand-off with no scan output.
- **Decided by:** the scan report

### sec-20 [M] Never trust client-supplied values for authorisation

- **What:** Role, user id, tenant, price and permissions come from the session or the database, never from the request body, query, header or a hidden field.
- **Why:** Anything the client sends can be edited. Trusting it lets a visitor become an admin or pay one cent.
- **Good:** `const role = (await db.user(session.userId)).role`; the price is read from the product table.
- **Bad:** `if (req.body.role === 'admin')`; `charge(req.body.price)`.
- **Decided by:** read the handlers: role, user id and price come from the session or the database

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

GitHub Pages cannot set response headers. The templates there carry the CSP and referrer policy as `<meta>` tags (both
work from a meta tag), but `nosniff` has no meta equivalent: gating a live GitHub Pages URL reports sec-h2 until the
site moves to a host that reads `_headers` (or sets headers another way). Say so in the hand-off; don't hide it.
The gate's own browser contexts bypass the page's CSP so its measuring scripts can run; axis K reads the policy, it
doesn't depend on it being enforced.

## Secret patterns gate K looks for

Private key blocks (`-----BEGIN … PRIVATE KEY-----`), AWS access key IDs, Stripe live secret keys, GitHub tokens,
Slack tokens, Google API keys, OpenAI/Anthropic-style keys, and `secret`/`token`/`password`/`api_key` assignments to a
long literal. A match is reported with the first and last four characters only, never the whole value. Publishable
keys (`pk_live_…`) are allowed: they are meant for the client.

## Heuristic warnings (gate K, never counted)

| ID | Warns when |
|---|---|
| sec-06 | a script writes a token-, jwt-, auth- or session-named key to `localStorage` or `sessionStorage` |
| sec-08 | a local target's project does not ignore `.env` (`git check-ignore`, else the nearest `.gitignore`); URLs are not checked |
| sec-09 | a `console.*` call prints a token, key, password, session id or email |
| sec-h1 | a URL target (a real server) sends its CSP only as a `<meta>` tag (send it as a header); local files are served by the gate, so they are not judged on this |
| sec-17 | a development build or a source map is on the page |

Each failing gate K item adds one to the K count in the stamp (`rules: C0 S0 P0 K0`); the page passes K at 0.
Warnings are printed under the K line and are not in the count, the stamp or its id.
