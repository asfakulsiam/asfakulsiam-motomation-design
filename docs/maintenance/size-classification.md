# Size classification (A2, 2026-10-13)

Every tracked file over 100 KB on main at 8a432b4, sorted by size, with where it lives after the trim.

| Destination | Files (all sizes) | Bytes |
|---|---|---|
| main (source, docs, small metadata) | 2345 | 12.33 MB |
| `evals` branch (screenshots, built pages, transcripts, motion reports, docs screenshots) | 1946 | 129.16 MB |
| GitHub Release `frames-v2.5.0` (Tier 5 frame sequences and film.mp4) | 542 | 9.06 MB |

## Rules

- MOVES to `evals`: `evals/results/**/*.{webp,png,jpg,mp4,html,gz}`, `evals/results/**/transcript.jsonl`, `docs/**/*.{png,webp,jpg}` (README and docs embed them from the evals branch by URL).
- MOVES to a release: `examples/templates/*/frames/`, `frames-mobile/`, `film.mp4`. `scripts/fetch-frames.mjs` restores them; `scripts/build-frames.mjs` regenerates them.
- STAYS: everything else. Built template pages, the gallery, the docs site bundle, dist and the component baselines are generated but are required by check-repo and Pages, so they stay. Template fonts stay (allowlisted).

## STAYS on main (files over 100 KB)

```
420234	docs/site/assets/site.js
371352	skills/asfakulsiam-motomation-design/examples/gallery/index.html
319873	dist/motomation-design.md
295210	evals/results/2026-10-12-benchmark-v3/summary.json
292781	skills/asfakulsiam-motomation-design/examples/templates/shop-product.html
292201	skills/asfakulsiam-motomation-design/examples/templates/hotel.html
285225	tests/components/baselines.json
260600	skills/asfakulsiam-motomation-design/examples/templates/studio-portfolio.html
253345	skills/asfakulsiam-motomation-design/examples/templates/org.html
252820	skills/asfakulsiam-motomation-design/examples/templates/saas-landing.html
244396	skills/asfakulsiam-motomation-design/examples/templates/event.html
220410	skills/asfakulsiam-motomation-design/examples/templates/editorial-article.html
218536	skills/asfakulsiam-motomation-design/examples/templates/personal.html
105213	skills/asfakulsiam-motomation-design/scripts/gate.mjs
```

## MOVES to the release (files over 100 KB)

```
2323597	skills/asfakulsiam-motomation-design/examples/templates/product-launch/film.mp4
876630	skills/asfakulsiam-motomation-design/examples/templates/motion-portfolio/film.mp4
```

## MOVES to the evals branch (files over 100 KB)

```
2257418	evals/results/2026-10-12-benchmark-v4/saas/matched-s2101/transcript.jsonl.gz
2125698	evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6102/transcript.jsonl.gz
1884376	evals/results/2026-10-12-benchmark-v4/ecommerce/matched-s3104/transcript.jsonl.gz
1729038	evals/results/2026-10-12-benchmark-v4/hotel/matched-s4103/transcript.jsonl.gz
1687311	evals/results/2026-10-12-benchmark-v3/hotel/matched-s4102/transcript.jsonl.gz
1568705	evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8101/motion-report.html
1500337	evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8102/motion-report.html
1468947	evals/results/2026-10-12-benchmark-v3/studio/matched-s7102/transcript.jsonl.gz
1354009	evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8103/motion-report.html
1325799	evals/results/2026-10-12-benchmark-v3/saas/matched-s2101/transcript.jsonl.gz
1268530	evals/results/2026-10-12-benchmark-v4/public/matched-s5102/transcript.jsonl.gz
1260295	evals/results/2026-10-12-benchmark-v4/saas/matched-s2103/transcript.jsonl.gz
1183523	evals/results/2026-10-12-benchmark-v4/saas/matched-s2102/transcript.jsonl.gz
1176807	evals/results/2026-10-12-benchmark-v4/ecommerce/matched-s3102/transcript.jsonl.gz
1142055	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8103/motion-report.html
1139825	evals/results/2026-10-12-benchmark-v4/ecommerce/matched-s3106/transcript.jsonl.gz
1135701	evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1103/motion-report.html
1128799	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8101/motion-report.html
1125611	evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1102/motion-report.html
1097513	evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6102/motion-report.html
1064093	evals/results/2026-10-12-benchmark-v4/studio/matched-s7103/transcript.jsonl.gz
1063145	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8102/motion-report.html
1061033	evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6103/motion-report.html
1017513	evals/results/2026-10-12-benchmark-v3/public/matched-s5103/transcript.jsonl.gz
1014469	evals/results/2026-10-12-benchmark-v3-motion/launch/baseline-s6103/motion-report.html
1009697	evals/results/2026-10-12-benchmark-v4/hotel/matched-s4101/transcript.jsonl.gz
1001259	evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1101/motion-report.html
998996	evals/results/2026-10-11-benchmark-v2/ecommerce/skill-s3103/transcript.jsonl.gz
985703	evals/results/2026-10-11-benchmark-v2/saas/skill-s2102/transcript.jsonl.gz
980532	evals/results/2026-10-12-benchmark-v4/studio/matched-s7104/transcript.jsonl.gz
937004	evals/results/2026-10-12-benchmark-v3-motion/launch/baseline-s6101/motion-report.html
916633	evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6101/motion-report.html
850641	evals/results/2026-10-12-benchmark-v3-motion/portfolio/baseline-s1103/motion-report.html
832869	evals/results/2026-10-12-benchmark-v3-motion/portfolio/baseline-s1101/motion-report.html
821775	evals/results/2026-10-12-benchmark-v3-motion/launch/baseline-s6102/motion-report.html
781783	evals/results/2026-10-12-benchmark-v3-motion/portfolio/baseline-s1102/motion-report.html
584169	evals/results/2026-10-12-benchmark-v4/studio/matched-s7102/transcript.jsonl.gz
537844	evals/results/2026-10-12-benchmark-v4/public/matched-s5104/transcript.jsonl.gz
422910	evals/results/evidence-2026-10-11-v3/d6-templates/org-375.jpg
355472	evals/results/evidence-2026-10-11-v3/d6-templates/org-1440.jpg
355199	evals/results/2026-10-11-benchmark-v2/studio/skill-s7103/transcript.jsonl.gz
343076	evals/results/evidence-2026-10-11-v3/d6-templates/saas-landing-375.jpg
324076	evals/results/evidence-2026-10-11-v3/d6-templates/shop-product-1440.jpg
307624	evals/results/evidence-2026-10-11-v3/d6-templates/saas-landing-1440.jpg
302797	evals/results/2026-10-12-benchmark-v4/public/matched-s5106/transcript.jsonl.gz
297845	evals/results/evidence-2026-10-11-v3/d6-templates/studio-portfolio-375.jpg
294741	evals/results/evidence-2026-10-11-v3/d6-templates/editorial-article-375.jpg
274430	evals/results/2026-10-12-benchmark-v4/studio/matched-s7101/transcript.jsonl.gz
262617	evals/results/evidence-2026-10-11-v3/d6-templates/studio-portfolio-1440.jpg
255621	evals/results/evidence-2026-10-11-v3/d6-templates/hotel-1440.jpg
248001	evals/results/evidence-2026-10-11-v3/d6-templates/event-375.jpg
243108	evals/results/evidence-2026-10-11-v3/d6-templates/hotel-375.jpg
232352	evals/results/2026-10-12-benchmark-v3/studio/skill-s7102/shot-1440-full.webp
231990	evals/results/2026-10-12-benchmark-v3/studio/skill-s7102/shot-1440-reduced-full.webp
230474	evals/results/evidence-2026-10-11-v3/d6-templates/event-1440.jpg
218086	evals/results/evidence-2026-10-11-v3/d6-templates/shop-product-375.jpg
198198	evals/results/2026-10-12-benchmark-v3-codex/hotel/baseline-s4101/shot-1440-reduced-full.webp
196882	docs/examples/hero/hero-desktop.png
196752	evals/results/2026-10-12-benchmark-v3-codex/public/baseline-s5101/shot-1440-full.webp
196738	evals/results/2026-10-12-benchmark-v3-codex/public/baseline-s5101/shot-1440-reduced-full.webp
179032	evals/results/2026-10-12-benchmark-v3-codex/hotel/skill-s4101/shot-1440-reduced-full.webp
177400	evals/results/2026-10-12-benchmark-v3-codex/hotel/skill-s4101/shot-1440-full.webp
174184	evals/results/2026-10-11-benchmark-v2/studio/skill-s7101/transcript.jsonl.gz
170171	evals/results/evidence-2026-10-11-v3/d6-templates/editorial-article-1440.jpg
169939	docs/demo-film.png
167946	evals/results/evidence-2026-10-11-v3/e1-docs/component.jpg
165244	evals/results/2026-10-12-benchmark-v3/studio/skill-s7101/shot-1440-reduced-full.webp
161988	evals/results/2026-10-12-benchmark-v3/studio/baseline-s7102/shot-1440-reduced-full.webp
161780	evals/results/2026-10-12-benchmark-v3/hotel/matched-s4103/shot-1440-reduced-full.webp
161764	evals/results/2026-10-12-benchmark-v3/studio/c-fdesign-s7101/shot-1440-reduced-full.webp
161620	evals/results/2026-10-12-benchmark-v3/studio/matched-s7102/shot-1440-reduced-full.webp
161472	evals/results/2026-10-12-benchmark-v3/studio/skill-s7103/shot-1440-reduced-full.webp
161472	evals/results/2026-10-12-benchmark-v3/studio/skill-s7103/shot-1440-full.webp
157728	evals/results/2026-10-12-benchmark-v3/public/matched-s5101/shot-1440-reduced-full.webp
157704	evals/results/2026-10-12-benchmark-v3/studio/c-fdesign-s7101/shot-1440-full.webp
157446	evals/results/evidence-2026-10-11-v3/d6-templates/personal-375.jpg
155334	evals/results/2026-10-12-benchmark-v3/hotel/matched-s4102/shot-1440-reduced-full.webp
154660	evals/results/2026-10-12-benchmark-v3-codex/studio/baseline-s7101/shot-1440-reduced-full.webp
154312	evals/results/2026-10-12-benchmark-v3-codex/saas/baseline-s2101/shot-1440-full.webp
154248	evals/results/2026-10-12-benchmark-v3-codex/saas/baseline-s2101/shot-1440-reduced-full.webp
153970	evals/results/2026-10-12-benchmark-v3/studio/matched-s7101/shot-1440-reduced-full.webp
153244	evals/results/2026-10-12-benchmark-v3/studio/c-taste-s7103/shot-1440-reduced-full.webp
152094	evals/results/2026-10-12-benchmark-v3/public/skill-s5103/shot-1440-reduced-full.webp
151972	evals/results/2026-10-12-benchmark-v3/studio/matched-s7103/shot-1440-reduced-full.webp
151798	evals/results/2026-10-12-benchmark-v3/hotel/skill-s4103/shot-1440-reduced-full.webp
149744	evals/results/2026-10-12-benchmark-v3/public/matched-s5102/shot-1440-reduced-full.webp
149046	evals/results/2026-10-12-benchmark-v3/public/c-fdesign-s5102/shot-1440-reduced-full.webp
148255	evals/results/2026-10-11-benchmark-v2/ecommerce/skill-s3101/transcript.jsonl.gz
148178	evals/results/2026-10-12-benchmark-v3/public/skill-s5102/shot-1440-reduced-full.webp
147316	evals/results/2026-10-12-benchmark-v3/public/matched-s5103/shot-1440-reduced-full.webp
144886	evals/results/2026-10-12-benchmark-v3/ecommerce/matched-s3101/shot-1440-reduced-full.webp
143868	evals/results/2026-10-12-benchmark-v3/public/baseline-s5102/shot-1440-reduced-full.webp
143796	evals/results/2026-10-12-benchmark-v3/studio/skill-s7101/shot-1440-full.webp
143588	evals/results/evidence-2026-10-11-v3/d5-sections/sheet-375-3.jpg
142606	evals/results/evidence-2026-10-11-v3/d5-sections/sheet-1440-3.jpg
141867	evals/results/evidence-2026-10-11-v3/d5-sections/sheet-1440-2.jpg
141134	evals/results/2026-10-12-benchmark-v3/studio/c-uiux-s7101/shot-1440-reduced-full.webp
140826	evals/results/2026-10-12-benchmark-v3-codex/public/skill-s5101/shot-1440-reduced-full.webp
140826	evals/results/2026-10-12-benchmark-v3-codex/public/skill-s5101/shot-1440-full.webp
139612	evals/results/2026-10-12-benchmark-v3/hotel/matched-s4101/shot-1440-reduced-full.webp
138382	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8103/shot-1440-reduced-full.webp
137042	evals/results/2026-10-12-benchmark-v3/public/c-fdesign-s5103/shot-1440-reduced-full.webp
137038	evals/results/2026-10-12-benchmark-v3/saas/skill-s2101/shot-1440-reduced-full.webp
136826	evals/results/2026-10-12-benchmark-v3/public/baseline-s5103/shot-1440-reduced-full.webp
136260	evals/results/2026-10-12-benchmark-v3/studio/c-taste-s7101/shot-1440-reduced-full.webp
136142	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8101/shot-1440-reduced-full.webp
135272	evals/results/2026-10-12-benchmark-v3/studio/c-uiux-s7103/shot-1440-reduced-full.webp
135197	evals/results/evidence-2026-10-11-v3/d5-sections/sheet-375-2.jpg
134612	evals/results/2026-10-12-benchmark-v3/public/c-fdesign-s5102/shot-1440-full.webp
133624	evals/results/2026-10-12-benchmark-v3/hotel/c-fdesign-s4103/shot-1440-reduced-full.webp
133556	evals/results/2026-10-12-benchmark-v3/hotel/c-fdesign-s4103/shot-1440-full.webp
131836	evals/results/2026-10-12-benchmark-v3/hotel/c-fdesign-s4102/shot-1440-reduced-full.webp
131798	evals/results/2026-10-12-benchmark-v3/public/skill-s5101/shot-1440-reduced-full.webp
131260	evals/results/2026-10-12-benchmark-v3/public/c-fdesign-s5103/shot-1440-full.webp
130934	evals/results/2026-10-12-benchmark-v3/hotel/c-fdesign-s4102/shot-1440-full.webp
130696	evals/results/2026-10-12-benchmark-v3/public/matched-s5101/shot-1440-full.webp
130276	evals/results/2026-10-12-benchmark-v3/hotel/baseline-s4103/shot-1440-reduced-full.webp
129940	evals/results/2026-10-12-benchmark-v3/studio/c-fdesign-s7102/shot-1440-reduced-full.webp
127214	evals/results/2026-10-12-benchmark-v3/studio/c-fdesign-s7103/shot-1440-reduced-full.webp
126864	evals/results/2026-10-12-benchmark-v3/public/c-fdesign-s5101/shot-1440-reduced-full.webp
126864	evals/results/2026-10-12-benchmark-v3/public/c-fdesign-s5101/shot-1440-full.webp
126578	evals/results/2026-10-12-benchmark-v3/saas/matched-s2103/shot-1440-reduced-full.webp
125870	evals/results/2026-10-12-benchmark-v3/hotel/baseline-s4102/shot-1440-reduced-full.webp
125750	evals/results/2026-10-12-benchmark-v3/public/matched-s5102/shot-1440-full.webp
125376	evals/results/2026-10-12-benchmark-v3/public/baseline-s5101/shot-1440-reduced-full.webp
125268	evals/results/2026-10-12-benchmark-v3/studio/c-fdesign-s7103/shot-1440-full.webp
125224	evals/results/2026-10-12-benchmark-v3-motion/portfolio/baseline-s1101/shot-1440-reduced-full.webp
124994	evals/results/2026-10-12-benchmark-v3-codex/ecommerce/baseline-s3101/shot-1440-reduced-full.webp
124460	evals/results/2026-10-12-benchmark-v3/studio/gated-s7102/shot-1440-full.webp
124386	evals/results/2026-10-12-benchmark-v3/studio/c-fdesign-s7102/shot-1440-full.webp
124256	evals/results/2026-10-12-benchmark-v3/public/skill-s5102/shot-1440-full.webp
124226	evals/results/2026-10-12-benchmark-v3/public/skill-s5103/shot-1440-full.webp
123525	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8102-A-1.jpg
123374	evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8102/shot-1440-reduced-full.webp
123210	evals/results/2026-10-12-benchmark-v3/studio/gated-s7102/shot-1440-reduced-full.webp
122488	evals/results/2026-10-12-benchmark-v3/saas/c-fdesign-s2103/shot-1440-reduced-full.webp
122474	evals/results/2026-10-12-benchmark-v3/hotel/skill-s4102/shot-1440-reduced-full.webp
122426	docs/demo-reduced.png
122130	evals/results/2026-10-12-benchmark-v3/public/skill-s5101/shot-1440-full.webp
122004	evals/results/2026-10-12-benchmark-v3-codex/ecommerce/skill-s3101/shot-1440-reduced-full.webp
121836	evals/results/2026-10-12-benchmark-v3/saas/c-fdesign-s2103/shot-1440-full.webp
121742	evals/results/evidence-2026-10-11-v3/d5-sections/sheet-375-1.jpg
121332	evals/results/2026-10-12-benchmark-v3-codex/hotel/baseline-s4101/shot-375-reduced-full.webp
121062	evals/results/2026-10-12-benchmark-v3/studio/skill-s7102/shot-375-reduced-full.webp
120282	evals/results/2026-10-12-benchmark-v3/studio/c-uiux-s7102/shot-1440-reduced-full.webp
119569	evals/results/evidence-2026-10-11-v3/d5-sections/team-org-field-guide-1440.jpg
119426	evals/results/2026-10-12-benchmark-v3/hotel/c-fdesign-s4101/shot-1440-full.webp
119414	evals/results/2026-10-12-benchmark-v3/hotel/c-fdesign-s4101/shot-1440-reduced-full.webp
119244	evals/results/2026-10-12-benchmark-v3/hotel/gated-s4103/shot-1440-reduced-full.webp
117994	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8102-A-2.jpg
117976	evals/results/2026-10-12-benchmark-v3/saas/matched-s2102/shot-1440-reduced-full.webp
117070	evals/results/2026-10-12-benchmark-v3/hotel/c-taste-s4103/shot-1440-reduced-full.webp
116912	evals/results/2026-10-12-benchmark-v3/saas/matched-s2102/shot-1440-full.webp
116793	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8102-A-0.jpg
116792	evals/results/2026-10-12-benchmark-v3/public/c-taste-s5103/shot-1440-reduced-full.webp
116610	evals/results/2026-10-12-benchmark-v3/public/gated-s5103/shot-1440-reduced-full.webp
116518	evals/results/2026-10-12-benchmark-v3/saas/matched-s2101/shot-1440-reduced-full.webp
116026	evals/results/2026-10-12-benchmark-v3/saas/skill-s2101/shot-375-reduced-full.webp
116022	evals/results/2026-10-12-benchmark-v3/hotel/c-uiux-s4101/shot-1440-reduced-full.webp
115989	evals/results/2026-10-11-benchmark-v2/hotel/skill-s4103/transcript.jsonl.gz
115780	evals/results/2026-10-12-benchmark-v3/saas/c-fdesign-s2102/shot-1440-reduced-full.webp
115490	evals/results/2026-10-12-benchmark-v3/saas/c-fdesign-s2101/shot-1440-reduced-full.webp
115390	evals/results/2026-10-12-benchmark-v3/public/gated-s5103/shot-1440-full.webp
114938	evals/results/2026-10-12-benchmark-v3-codex/public/baseline-s5101/shot-375-reduced-full.webp
114338	evals/results/2026-10-12-benchmark-v3/public/c-uiux-s5103/shot-1440-reduced-full.webp
114122	evals/results/2026-10-12-benchmark-v3/studio/skill-s7102/shot-375-full.webp
114018	evals/results/2026-10-12-benchmark-v3/saas/skill-s2101/shot-1440-full.webp
113433	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8101-B-1.jpg
112672	evals/results/2026-10-12-benchmark-v3/saas/skill-s2102/shot-1440-reduced-full.webp
112612	evals/results/2026-10-12-benchmark-v3/hotel/c-uiux-s4102/shot-1440-reduced-full.webp
112428	evals/results/2026-10-12-benchmark-v3-codex/public/baseline-s5101/shot-375-full.webp
112306	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8101-B-2.jpg
112136	evals/results/2026-10-12-benchmark-v3-codex/public/skill-s5101/transcript.jsonl.gz
111780	evals/results/2026-10-12-benchmark-v3/studio/gated-s7101/shot-1440-reduced-full.webp
111750	evals/results/2026-10-12-benchmark-v3/studio/gated-s7101/shot-1440-full.webp
111441	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8101-B-0.jpg
110534	evals/results/2026-10-12-benchmark-v3/public/baseline-s5103/shot-375-reduced-full.webp
109986	evals/results/2026-10-12-benchmark-v3/saas/matched-s2101/shot-1440-full.webp
109842	evals/results/2026-10-12-benchmark-v3/hotel/matched-s4103/shot-1440-full.webp
109256	evals/results/2026-10-12-benchmark-v3/hotel/c-taste-s4102/shot-1440-reduced-full.webp
108876	evals/results/2026-10-12-benchmark-v3/public/c-fdesign-s5102/shot-375-reduced-full.webp
108722	evals/results/2026-10-12-benchmark-v3/public/c-uiux-s5101/shot-1440-reduced-full.webp
108226	evals/results/2026-10-12-benchmark-v3/studio/baseline-s7101/shot-1440-reduced-full.webp
107769	evals/results/evidence-2026-10-11-v3/d5-sections/sheet-1440-1.jpg
107768	evals/results/2026-10-12-benchmark-v3/hotel/gated-s4102/shot-1440-reduced-full.webp
107166	evals/results/2026-10-12-benchmark-v3/saas/c-fdesign-s2101/shot-1440-full.webp
107088	evals/results/2026-10-12-benchmark-v3/hotel/gated-s4102/shot-1440-full.webp
107070	evals/results/2026-10-12-benchmark-v3/saas/c-taste-s2102/shot-1440-reduced-full.webp
107066	evals/results/2026-10-12-benchmark-v3/public/matched-s5101/shot-375-reduced-full.webp
106916	evals/results/2026-10-12-benchmark-v3/public/matched-s5103/shot-375-reduced-full.webp
106652	evals/results/2026-10-12-benchmark-v3-codex/saas/skill-s2101/shot-375-reduced-full.webp
106570	evals/results/2026-10-12-benchmark-v3-codex/saas/skill-s2101/shot-375-full.webp
106302	evals/results/2026-10-12-benchmark-v3/public/baseline-s5102/shot-375-reduced-full.webp
106205	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8102-B-2.jpg
105804	evals/results/2026-10-12-benchmark-v3/ecommerce/gated-s3102/shot-1440-reduced-full.webp
105750	evals/results/2026-10-12-benchmark-v3/ecommerce/gated-s3102/shot-1440-full.webp
105398	evals/results/2026-10-12-benchmark-v3/saas/c-taste-s2103/shot-1440-reduced-full.webp
105028	evals/results/2026-10-12-benchmark-v3/saas/c-fdesign-s2102/shot-1440-full.webp
104598	evals/results/2026-10-12-benchmark-v3/public/skill-s5102/shot-375-reduced-full.webp
104080	evals/results/2026-10-12-benchmark-v3/studio/baseline-s7103/shot-1440-reduced-full.webp
103990	evals/results/2026-10-12-benchmark-v3/ecommerce/c-uiux-s3103/shot-1440-reduced-full.webp
103980	evals/results/2026-10-12-benchmark-v3/studio/baseline-s7102/shot-1440-full.webp
103510	evals/results/2026-10-12-benchmark-v3/hotel/matched-s4103/shot-375-reduced-full.webp
103286	evals/results/2026-10-12-benchmark-v3/public/matched-s5102/shot-375-reduced-full.webp
103074	evals/results/2026-10-12-benchmark-v3/ecommerce/c-taste-s3103/shot-1440-reduced-full.webp
102860	evals/results/2026-10-12-benchmark-v3/hotel/c-uiux-s4103/shot-1440-reduced-full.webp
102852	evals/results/2026-10-12-benchmark-v3-motion/festival/judge-motion/strips/s8103-A-2.jpg
```
