# Contributing

Thank you for helping make AI-made websites less alike.

## Ground rules
1. **Original work only.** Write in your own words and code. Don't paste text or code from other skills, component libraries or unlicensed repositories. React Bits components, for example, may not be redistributed. Describe concepts, link to the source and write your own implementation.
2. **Short, single-purpose files.** SKILL.md is a router. Put detail in topic files.
3. **Every motion example** needs a reduced-motion path, a touch path and cleanup.
4. **Data rows** need a unique kebab-case id and must not break the CSV columns. Palettes must pass `node skills/asfakulsiam-motomation-design/scripts/contrast.mjs --palettes`.
5. **New behaviour** needs an eval brief in `evals/briefs/`.

## Before opening a PR
```bash
node scripts/build-dist.mjs     # regenerate the single-file edition
node scripts/check-repo.mjs     # structure, references, data, versions, dist
```

## Good first contributions
- A new signature move in recipe format (idea, why, build, detail, off-switch, prompt)
- A new collision source with a clear, stealable property
- A font with axes and licence details
- An eval run with screenshots, recorded in `evals/results/`
