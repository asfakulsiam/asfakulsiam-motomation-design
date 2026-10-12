# Release notes

## 2.4.0 (2026-10-12)

What changed is in [CHANGELOG.md](CHANGELOG.md). This file tracks where the release is listed and what each listing needed.

### Marketplace listings (C2)

Status as of 2026-10-12. "Live" means someone can find and install it there today; "submitted" means the directory's own intake has what it needs and the listing is waiting on that directory; "not submitted" says why.

| Directory | How it lists | Status | Evidence |
|---|---|---|---|
| Claude Code plugin marketplace (this repository) | `.claude-plugin/marketplace.json` | **Live** | `claude plugin validate .` passes; `claude plugin marketplace add asfakulsiam/asfakulsiam-motomation-design` then `claude plugin install asfakulsiam-motomation-design@asfakulsiam-motomation-design` installs and enables it from GitHub (checked in a clean `HOME`). |
| Codex plugin marketplace (this repository) | `.codex-plugin/plugin.json` | **Live** | `codex plugin marketplace add asfakulsiam/asfakulsiam-motomation-design` adds it from GitHub (Codex CLI 0.130.0, clean `CODEX_HOME`). |
| skills.sh (`npx skills`) | any public repo with a `SKILL.md`; the leaderboard ranks by install telemetry | **Live (installable)**; leaderboard placement follows real installs | `npx skills add asfakulsiam/asfakulsiam-motomation-design --list` finds the skill (run with telemetry off, so it did not count itself as an install). |
| Gemini CLI extension gallery ([geminicli.com/extensions](https://geminicli.com/extensions/)) | daily crawl of public repos with the `gemini-cli-extension` topic and `gemini-extension.json` at the root | **Submitted** (topic added 2026-10-12; waiting on the crawl) | Repository topics: `gemini-cli-extension`; manifest at the root. Release docs: [geminicli.com/docs/extensions/releasing](https://geminicli.com/docs/extensions/releasing/). |
| SkillsMP ([skillsmp.com](https://skillsmp.com/)) | daily sync of repos with a `SKILL.md`, front-matter and the `claude-skills` or `claude-code-skill` topic | **Submitted** (topics added 2026-10-12; waiting on the sync) | Repository topics: `claude-skills`, `claude-code-skill`. Intake: [skillsmp.com/docs/faq](https://skillsmp.com/docs/faq). |
| Claude Code Marketplaces ([claudemarketplaces.com](https://claudemarketplaces.com/)) | crawls GitHub for repos with a valid marketplace schema; ranks by installs and stars | **Submitted by discovery** (valid `marketplace.json`); not yet visible | [claudemarketplaces.com/about](https://claudemarketplaces.com/about). |
| Anthropic official plugin directory | web form for the account holder (claude.ai / platform.claude.com) | **Not submitted**: needs the owner's signed-in account; the form can't be filled by an agent | Submit at the in-app form; everything it asks for (repo URL, manifest, description, licence) is ready. |
| Cursor Marketplace | web form at cursor.com for the account holder; manual review | **Not submitted**: needs the owner's signed-in account | `.cursor-plugin/plugin.json` is ready. |
| OpenAI / Codex plugin directory | developer-platform portal, verified identity | **Not submitted**: needs the owner's verified account | `.codex-plugin/plugin.json` is ready. |
| awesome-claude-skills (travisvn) | pull request | **Not submitted**: its CONTRIBUTING closes skills under 10 stars and AI-submitted PRs (this repo has 1 star) | [CONTRIBUTING.md](https://github.com/travisvn/awesome-claude-skills/blob/main/CONTRIBUTING.md) |
| awesome-agent-skills (VoltAgent) | pull request | **Not submitted**: accepts only skills with established community use, not new ones | [CONTRIBUTING.md](https://github.com/VoltAgent/awesome-agent-skills/blob/main/CONTRIBUTING.md) |

Repository homepage set to the published docs site: <https://asfakulsiam.github.io/asfakulsiam-motomation-design/>.
