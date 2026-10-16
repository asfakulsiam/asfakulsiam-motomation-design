# Shared writer for each diversity build's DESIGN.md and MOTION.md (templates/DESIGN.md shape, trimmed to what this arm uses).
import os
EXCUSE = "not required for this brief, reason: the diversity arm compares rendered sites, not the sellable template package"
TEMPLATE = ["README.md", "SCHEMA.md", "DATA.md", "CRITIQUE.md", "GATE.md", "LICENSE", "CHANGELOG.md", ".env.example", "middleware.ts", "data/", "data/schema.json"]

def write(out, d):
    rows = [f"| route | {r} | requested | |" for r in d["routes"]]
    rows += [f"| {k} | {i} | required | {e} |" for k, i, e in d.get("scope", [])]
    rows += [f"| template | {t} | {EXCUSE} | |" for t in TEMPLATE if t not in d.get("keep", [])]
    md = f"""# DESIGN.md · {d['name']}

Built for `evals/briefs/diversity/{d['brief']}` by following the skill's full route (thinking/sequence.md), in one session, by the agent that also wrote `scripts/originality.mjs`. See `evals/results/diversity/REPORT.md` for why that matters.

## Scope
**Site type:** {d['type']}
**Admin panel:** no (no checkpoint asked for one; "Approve every checkpoint")

| Kind | Item | Mark | Evidence |
|---|---|---|---|
""" + "\n".join(rows) + f"""

## References
**Access:** no live web search this session (fonts fetched from Google Fonts only). Working from `references/sources/` and training data; limitation: no 2026 award-site references were looked at.

**References looked at:**
""" + "\n".join(f"{i+1}. {r}" for i, r in enumerate(d["refs"])) + f"""

## Collision draw
`node scripts/collide.mjs --n 1 --seed {d['seed']} --category {d['category']}`

{d['draw']}

## Tension
{d['tension']}

## Concept
{d['concept']}

## Choices
| Decision | Choice | Why (from the brief) |
|---|---|---|
""" + "\n".join(f"| {a} | {b} | {c} |" for a, b, c in d["choices"]) + f"""

## Divergence
{d['divergence']}

## Restraint Gate record
- Concept survived: {d['survived']}
- Cut: {d['cut']}
- Kept: {d['kept']}
- Rejected animation: {d['rejected']}
"""
    open(os.path.join(out, "DESIGN.md"), "w").write(md)
    open(os.path.join(out, "MOTION.md"), "w").write(f"""# MOTION.md · {d['name']}

**Tier:** {d['tier']}

{d['motion']}

**Reduced motion:** {d['rm']}
""")
