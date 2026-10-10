# Platform Notes: Using This Skill Everywhere

| Platform | How to use the skill | Notes |
|---|---|---|
| **Claude Code, Codex, Cursor, Windsurf, Gemini CLI, GitHub Copilot, Antigravity, Cline, Roo, Kiro, OpenCode, Goose, Junie, Zed, Amp** and other skills-compatible agents | `npx skills add asfakulsiam/asfakulsiam-motomation-design` | The agent loads `SKILL.md` and reads the other files on demand. Scripts run in the terminal |
| **Claude Code (plugin)** | `/plugin marketplace add asfakulsiam/asfakulsiam-motomation-design`, then `/plugin install asfakulsiam-motomation-design@asfakulsiam-motomation-design` | Same skill, managed as a plugin |
| **Claude.ai / Claude Desktop** | Upload the skill folder as a zip under Settings → Capabilities → Skills (where available), or attach `dist/motomation-design.md` to a Project | Without a shell, it uses the CSV data directly |
| **ChatGPT** | Add `dist/motomation-design.md` to a Project's files or a custom GPT's knowledge, and add "Follow motomation-design.md for every web design task" to the instructions | Use the single-file prompts in `signatures/` |
| **Grok, Google AI Studio, Gemini app** | Paste `dist/motomation-design.md` into the system instructions, or attach it to the conversation or project | Ask for one `index.html` using `adapters/vanilla.md` |
| **v0, Lovable, Bolt, Replit Agent** | Add the content of `dist/motomation-design.md` to the project's knowledge, rules or custom instructions | Name the stack these tools use (Next.js / React + Tailwind) |

## Without a shell

When scripts can't run:
1. **Collisions:** use the seed method in `invention/mad-artist.md` with the CSVs in `data/`.
2. **Search:** read the relevant CSV and choose deliberately. Never take the first row.
3. **Memory:** ask the user to keep the stamp comment. Check stamps in the code they paste back.
4. **Contrast:** calculate WCAG contrast manually, or ask the user to verify with any contrast checker.
