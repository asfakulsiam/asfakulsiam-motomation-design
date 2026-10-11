# C6 evidence: full route vs short route

Two prompts sent to `claude_sonnet_5_5` through the raw API, with `SKILL.md` (v2.4.0-dev, with the new "When to use the short route" section) as the system prompt. No tools: the model could not run scripts, and says so.

| Prompt | Route stated (first line of the reply) | What it did |
|---|---|---|
| [full.md](full.md): a new landing page for a bakery | **"Route: full.** This is a new landing page, so it gets the whole Thinking Sequence and the Delivery Gate." | Full plan block: tension, concept, archetype + mutation, collision, signature, anti-sameness, restraint, tier |
| [short.md](short.md): the brass labels on the hotel page are too light | **"Route: short.** This is a contrast fix on an existing page, with no new structure, signature or concept." | Named the cause (`--brass` at 13px, ~3.1:1), added one `--brass-text` token, changed 2 rules, listed what it did not add, asked for the gate before and after |

Checked afterwards with the skill's own script: the short reply's `#7f5a1f` gives 5.01:1 on `#efe6d6` (pass) but 4.49:1 on the second ground `#e6dac5` (fail by 0.01). The model could not run `contrast.mjs`; this is why the short route still requires the gate after the fix, and why the worked example (`examples/prompts/fix-existing.md`) checks every ground and lands on `#7a5a22`.
