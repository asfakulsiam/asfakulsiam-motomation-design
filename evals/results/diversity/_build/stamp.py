"""Write each page's measured stamp into its HTML (Fix 15).

Reads stamps.json ({"<build>/<page>.html": "critique: … · gate: …"}), produced by running
node skills/asfakulsiam-motomation-design/scripts/gate.mjs <page>.html on every page and taking the
"stamp → critique: … · gate: …" line it printed. Replaces the "critique: <paste> · gate: <paste>" (or a previous
measured value) inside the page's <!-- motomation · … --> comment. Nothing here is computed: a page without a
measured line in stamps.json is left as it is and reported.

Run after the site*.py generators (they write the unfilled stamp):  python3 stamp.py
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
stamps = json.load(open(os.path.join(HERE, "stamps.json")))
missing = []
for build in sorted(d for d in os.listdir(ROOT) if re.match(r"^0\d-", d)):
    for page in sorted(f for f in os.listdir(os.path.join(ROOT, build)) if f.endswith(".html")):
        key = f"{build}/{page}"
        path = os.path.join(ROOT, build, page)
        html = open(path, encoding="utf-8").read()
        if key not in stamps:
            missing.append(key)
            continue
        new, n = re.subn(r"(<!-- motomation · [^>]*?· tier: [^·]+· )critique: .*? -->", lambda m: m.group(1) + stamps[key] + " -->", html, count=1)
        if n != 1:
            missing.append(key + " (no stamp comment)")
            continue
        open(path, "w", encoding="utf-8").write(new)
print(f"stamped {sum(1 for _ in stamps)} page(s)" + (f"; not stamped: {', '.join(missing)}" if missing else ""))
sys.exit(1 if missing else 0)
