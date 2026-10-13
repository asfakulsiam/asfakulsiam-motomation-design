# Repository size audit (A1, 2026-10-13)

Raw output, taken on main at b0ebd8d before the trim.

## du -sh . --exclude=.git
```
163M	.
```

## Size by top-level folder
```
12K	rules/
28K	mcp/
48K	.github
124K	scripts/
144K	fixtures/
148K	vendor/
348K	dist/
548K	tests/
1.2M	registry/
4.0M	docs/
16M	skills/
141M	evals/
```

## Size by second-level folder (evals, skill, docs)
```
8.0K	docs/maintenance/
8.0K	skills/asfakulsiam-motomation-design/invention/
12K	skills/asfakulsiam-motomation-design/structures/
12K	skills/asfakulsiam-motomation-design/templates/
20K	docs/adapters/
20K	skills/asfakulsiam-motomation-design/thinking/
24K	skills/asfakulsiam-motomation-design/adapters/
24K	skills/asfakulsiam-motomation-design/commands/
24K	skills/asfakulsiam-motomation-design/gates/
24K	skills/asfakulsiam-motomation-design/references/
32K	skills/asfakulsiam-motomation-design/signatures/
48K	skills/asfakulsiam-motomation-design/styles/
52K	skills/asfakulsiam-motomation-design/craft/
52K	skills/asfakulsiam-motomation-design/principles/
56K	skills/asfakulsiam-motomation-design/categories/
56K	skills/asfakulsiam-motomation-design/motion/
72K	docs/tier5/
104K	skills/asfakulsiam-motomation-design/data/
156K	skills/asfakulsiam-motomation-design/scripts/
192K	docs/rm-stills/
284K	docs/imagery/
440K	evals/results/2026-10-11-benchmark/
528K	docs/benchmark-images/
908K	docs/site/
1.3M	evals/results/2026-10-12-benchmark-v4-motion/
1.6M	docs/examples/
5.4M	evals/results/2026-10-11-benchmark-v2/
6.9M	evals/results/2026-10-12-benchmark-v3-codex/
9.0M	evals/results/evidence-2026-10-11-v3/
16M	skills/asfakulsiam-motomation-design/examples/
21M	evals/results/2026-10-12-benchmark-v4/
33M	evals/results/2026-10-12-benchmark-v3-motion/
65M	evals/results/2026-10-12-benchmark-v3/
```

## Top 30 largest tracked files (bytes)
```
985703	evals/results/2026-10-11-benchmark-v2/saas/skill-s2102/transcript.jsonl.gz
998996	evals/results/2026-10-11-benchmark-v2/ecommerce/skill-s3103/transcript.jsonl.gz
1001259	evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1101/motion-report.html
1009697	evals/results/2026-10-12-benchmark-v4/hotel/matched-s4101/transcript.jsonl.gz
1014469	evals/results/2026-10-12-benchmark-v3-motion/launch/baseline-s6103/motion-report.html
1017513	evals/results/2026-10-12-benchmark-v3/public/matched-s5103/transcript.jsonl.gz
1061033	evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6103/motion-report.html
1063145	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8102/motion-report.html
1064093	evals/results/2026-10-12-benchmark-v4/studio/matched-s7103/transcript.jsonl.gz
1097513	evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6102/motion-report.html
1125611	evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1102/motion-report.html
1128799	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8101/motion-report.html
1135701	evals/results/2026-10-12-benchmark-v3-motion/portfolio/skill-s1103/motion-report.html
1139825	evals/results/2026-10-12-benchmark-v4/ecommerce/matched-s3106/transcript.jsonl.gz
1142055	evals/results/2026-10-12-benchmark-v3-motion/festival/baseline-s8103/motion-report.html
1176807	evals/results/2026-10-12-benchmark-v4/ecommerce/matched-s3102/transcript.jsonl.gz
1183523	evals/results/2026-10-12-benchmark-v4/saas/matched-s2102/transcript.jsonl.gz
1260295	evals/results/2026-10-12-benchmark-v4/saas/matched-s2103/transcript.jsonl.gz
1268530	evals/results/2026-10-12-benchmark-v4/public/matched-s5102/transcript.jsonl.gz
1325799	evals/results/2026-10-12-benchmark-v3/saas/matched-s2101/transcript.jsonl.gz
1354009	evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8103/motion-report.html
1468947	evals/results/2026-10-12-benchmark-v3/studio/matched-s7102/transcript.jsonl.gz
1500337	evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8102/motion-report.html
1568705	evals/results/2026-10-12-benchmark-v3-motion/festival/skill-s8101/motion-report.html
1687311	evals/results/2026-10-12-benchmark-v3/hotel/matched-s4102/transcript.jsonl.gz
1729038	evals/results/2026-10-12-benchmark-v4/hotel/matched-s4103/transcript.jsonl.gz
1884376	evals/results/2026-10-12-benchmark-v4/ecommerce/matched-s3104/transcript.jsonl.gz
2125698	evals/results/2026-10-12-benchmark-v3-motion/launch/skill-s6102/transcript.jsonl.gz
2257418	evals/results/2026-10-12-benchmark-v4/saas/matched-s2101/transcript.jsonl.gz
2323597	skills/asfakulsiam-motomation-design/examples/templates/product-launch/film.mp4
```

## Tracked files by extension under evals/results
```
     72 md
    178 jpg
    241 gz
    269 html
    760 json
    873 txt
   1197 webp
```

## git count-objects -vH
```
count: 0
size: 0 bytes
in-pack: 8379
packs: 1
size-pack: 138.46 MiB
prune-packable: 0
garbage: 0
size-garbage: 0 bytes
```

Tracked files: 4832. Tracked files over 100 KB: 223.
