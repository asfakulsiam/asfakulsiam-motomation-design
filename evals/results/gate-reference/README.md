# Gate in reference mode: the ten templates (2026-10-16)

`node scripts/gate.mjs --reference examples/templates/<name>.html` (the films: `<name>/index.html`), run from the
skill folder, one page at a time. Each page is served from its own folder, so that folder's `_headers` apply. Axis J
(the site journey) is skipped. Every page-level axis runs as it does for a live site. The full output per template is in this folder.

| Template | Exit | Verdict | Page-level axes | Rules (C S P K) | Journey |
|---|---|---|---|---|---|
| editorial-article | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| event | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| hotel | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| motion-portfolio | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| org | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| personal | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| product-launch | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| saas-landing | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| shop-product | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |
| studio-portfolio | 0 | **PASS** | `gate: c0 o0 w0 rm0 a0 n0 q0 k0` | `rules: C0 S0 P0 K0` | skipped |

**10/10 PASS.**

The same flag fixes the sec-h2 failure the two films had. Live-site behaviour is unchanged:
```
$ node scripts/gate.mjs --rules examples/templates/product-launch/index.html              # served from the site root
  rules: C0 S0 P0 K1  (rule sets only; no stamp)
     ✗ sec-h2  no X-Content-Type-Options: nosniff header
$ node scripts/gate.mjs --rules --reference examples/templates/product-launch/index.html  # its own folder's _headers
  rules: C0 S0 P0 K0  (rule sets only; no stamp)
```
Fonts still load: a film's `../fonts/` is answered from the folder it resolves to. Product-launch loaded Fraunces,
Schibsted Grotesk, JetBrains Mono and Hind Siliguri, and motion-portfolio loaded Bricolage Grotesque, Hanken Grotesk
and JetBrains Mono. The only request either page could not answer was `/favicon.ico`.
