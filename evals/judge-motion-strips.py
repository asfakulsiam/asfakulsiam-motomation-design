#!/usr/bin/env python3
"""Motion-only blind judging from gate.mjs --report frame strips (v2.4.0, benchmark v3 task B4).

For each brief and seed, both sites' motion reports (`<arm>-s<seed>/motion-report.html`, written by
`scripts/gate.mjs <site> --report <file>`) are cut into their three strips: 1440 full motion, 375 full motion and
1440 reduced motion, 8 frames each, taken after wheel-scrolling to even steps. Each strip is tiled into one image.
Two judges from other model families see Site A and Site B (order fixed per brief+seed by a hash, not by arm), the
brief, and the six strip images, and score motion only. No still screenshots, no checks, no arm names.

  python3 evals/judge-motion-strips.py <results-dir> --pair baseline:skill --models gpt_5_4,gemini_3_1_pro
writes <results-dir>/<slug>/judge-motion/s<seed>-<model>.json and <results-dir>/motion-strips.json (summary).
Needs Pillow and the model adapter (evals/adapters/pplx-llm.py, or --judge-cmd with {model} {prompt} {images})."""
import base64, hashlib, io, json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
OUT = os.path.abspath(args[0])
flag = lambda k, d: args[args.index(k) + 1] if k in args else d
A_ARM, B_ARM = flag('--pair', 'baseline:skill').split(':')
MODELS = flag('--models', 'gpt_5_4,gemini_3_1_pro').split(',')
CMD = flag('--judge-cmd', f'python3 {ROOT}/evals/adapters/pplx-llm.py {{model}} {{prompt}} {{images}}')
BRIEFS = {'portfolio': '01-motion-designer-portfolio.md', 'saas': '02-dev-tool-landing.md', 'ecommerce': '03-ceramics-shop.md', 'hotel': '04-boutique-hotel.md',
          'public': '05-climate-nonprofit.md', 'launch': '06-product-launch.md', 'studio': '07-architecture-studio.md', 'festival': '08-music-festival.md'}
AXES = ['Motion concept', 'Choreography', 'Mobile motion', 'Reduced-motion fallback', 'Motion craft']

def strips(report):
    """[(caption, [PIL frames])] for each <section> of a gate motion report."""
    html = open(report, encoding='utf8').read(); out = []
    for sec in re.findall(r'<section>(.*?)</section>', html, re.S):
        cap = re.sub(r'<[^>]+>', '', re.search(r'<h2>(.*?)</h2>', sec, re.S).group(1)).strip()
        frames = [Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB') for b in re.findall(r'src="data:image/jpeg;base64,([^"]+)"', sec)]
        out.append((cap, frames))
    return out

def tile(frames, cols, w):
    if not frames: return Image.new('RGB', (w, 40), 'white')
    fw = w // cols; fh = round(frames[0].height * fw / frames[0].width); rows = -(-len(frames) // cols)
    im = Image.new('RGB', (fw * cols, fh * rows), (40, 40, 40))
    for i, f in enumerate(frames): im.paste(f.resize((fw, fh)), ((i % cols) * fw, (i // cols) * fh))
    return im

def images_for(d, tag, tmp):
    paths, caps = [], []
    for i, (cap, frames) in enumerate(strips(os.path.join(d, 'motion-report.html'))):
        narrow = cap.startswith('375')
        im = tile(frames, 8 if narrow else 4, 1600)
        p = os.path.join(tmp, f'{tag}-{i}.jpg'); im.save(p, quality=80); paths.append(p); caps.append(cap)
    return paths, caps

def judge(slug, seed, model):
    da, db = os.path.join(OUT, slug, f'{A_ARM}-s{seed}'), os.path.join(OUT, slug, f'{B_ARM}-s{seed}')
    if not all(os.path.exists(os.path.join(x, 'motion-report.html')) for x in (da, db)): return None
    order = [A_ARM, B_ARM]
    if int(hashlib.sha256(f'{slug}-{seed}-motion'.encode()).hexdigest()[:8], 16) % 2: order.reverse()
    jd = os.path.join(OUT, slug, 'judge-motion'); os.makedirs(jd, exist_ok=True); tmp = os.path.join(jd, 'strips'); os.makedirs(tmp, exist_ok=True)
    imgs, desc = [], []
    for L, arm in (('A', order[0]), ('B', order[1])):
        p, c = images_for(os.path.join(OUT, slug, f'{arm}-s{seed}'), f's{seed}-{L}', tmp)
        for path, cap in zip(p, c): imgs.append(path); desc.append(f'Image {len(imgs)}: Site {L}, {cap} (frames left to right, top to bottom, in scroll order)')
    brief = open(os.path.join(ROOT, 'evals/briefs', BRIEFS[slug]), encoding='utf8').read()
    # the brief as the main judges see it, **Expect:** (the evaluator's note) included; generators never see that line
    prompt = f"""You are a strict, blind motion-design reviewer. Two websites (Site A and Site B) were built for the same brief by different processes. You don't know how either was made. You only see scroll-frame strips: each strip is 8 viewport captures taken after wheel-scrolling to even steps from the top to the bottom of the page. Judge MOTION ONLY from how the frames change: what moves, pins, scrubs, reveals or transforms between consecutive frames, and whether that motion serves the brief. Ignore static visual polish except where it shows motion craft (broken, blank, overlapping or half-revealed frames). The reduced-motion strip should keep every piece of content readable without depending on motion.

BRIEF:
{brief}

AXES (1–5 each): {', '.join(AXES)}.
- Motion concept: is there a motion idea tied to this brief, or generic fades?
- Choreography: do consecutive frames show a coherent progression (pinning, scrubbing, sequenced reveals), or nothing changing / random changes?
- Mobile motion: does the 375px strip keep a sensible, working version of the motion?
- Reduced-motion fallback: in the reduced strip is all content present and readable, with motion removed or softened?
- Motion craft: no blank frames, no content stuck half-revealed, no overlaps caused by motion.

IMAGES:
{chr(10).join(desc)}

Stills can't show easing or timing; say so in notes when unsure. Reply with JSON only:
{{"A": {{"scores": {{{', '.join(f'"{a}": n' for a in AXES)}}}, "notes": "…"}}, "B": {{"scores": {{…}}, "notes": "…"}}, "winner": "A" | "B" | "tie"}}"""
    pf, imf = os.path.join(jd, f's{seed}-{model}.prompt.txt'), os.path.join(jd, f's{seed}-{model}.images.txt')
    open(pf, 'w').write(prompt); open(imf, 'w').write('\n'.join(imgs))
    cmd = CMD.replace('{model}', model).replace('{prompt}', pf).replace('{images}', imf)
    for _ in range(3):
        r = subprocess.run(['bash', '-c', cmd], capture_output=True, text=True)
        try:
            j = json.loads(re.search(r'\{[\s\S]*\}', r.stdout).group(0))
            tot = lambda s: round(sum(s['scores'].get(a, 0) for a in AXES) / (5 * len(AXES)) * 100, 1)
            res = {'model': model, 'seed': seed, 'order': {'A': order[0], 'B': order[1]}, 'raw': j, 'served': (r.stderr.strip().splitlines() or [''])[-1],
                   A_ARM: {**j['A' if order[0] == A_ARM else 'B'], 'total': None}, B_ARM: {**j['A' if order[0] == B_ARM else 'B'], 'total': None},
                   'winner': {'A': order[0], 'B': order[1], 'tie': 'tie'}.get(j.get('winner'), 'tie')}
            res[A_ARM]['total'] = tot(res[A_ARM]); res[B_ARM]['total'] = tot(res[B_ARM])
            json.dump(res, open(os.path.join(jd, f's{seed}-{model}.json'), 'w'), indent=1)
            print(f'judged motion {slug} s{seed} {model}: {A_ARM} {res[A_ARM]["total"]} vs {B_ARM} {res[B_ARM]["total"]} (winner {res["winner"]})', flush=True)
            return res
        except Exception as e:
            print(f'retry {slug} s{seed} {model}: {e} {r.stderr[-200:]}', flush=True)
    return None

jobs = []
for slug in sorted(os.listdir(OUT)):
    if slug not in BRIEFS or not os.path.isdir(os.path.join(OUT, slug)): continue
    seeds = sorted({int(m.group(1)) for d in os.listdir(os.path.join(OUT, slug)) if (m := re.match(rf'{re.escape(A_ARM)}-s(\d+)$', d))})
    jobs += [(slug, s, m) for s in seeds for m in MODELS]
with ThreadPoolExecutor(6) as ex: results = list(ex.map(lambda j: (j, judge(*j)), jobs))
summary = {}
for (slug, seed, model), r in results:
    e = summary.setdefault(slug, {}).setdefault(str(seed), {})
    e[model] = None if r is None else {A_ARM: r[A_ARM]['total'], B_ARM: r[B_ARM]['total'], 'winner': r['winner'], 'scores': {A_ARM: r[A_ARM]['scores'], B_ARM: r[B_ARM]['scores']}}
json.dump({'pair': [A_ARM, B_ARM], 'axes': AXES, 'briefs': summary}, open(os.path.join(OUT, 'motion-strips.json'), 'w'), indent=1)
print('wrote', os.path.join(OUT, 'motion-strips.json'))
