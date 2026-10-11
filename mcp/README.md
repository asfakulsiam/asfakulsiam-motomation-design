# Motomation MCP server

`mcp/server.mjs` exposes the component library and the skill's data sets over the [Model Context Protocol](https://modelcontextprotocol.io) (stdio transport, spec 2025-06-18). It has no dependencies: plain Node 18+, reading this repository at request time. It keeps no copy of the skill. The guidance (SKILL.md and the docs) stays in the skill, and the server serves the library.

## Tools

| Tool | What it does |
|---|---|
| `search_components` | Words → matching components (id, name, family, tier, what). Filters: `family`, `max_tier`, `limit`. |
| `get_component` | One component: what, use-when, avoid-when, reduced-motion, touch, a11y, props (type and default), install command, docs URL, and the source as an embedded resource. |
| `preview_component` | Docs, mobile-frame and gallery URLs, plus a PNG screenshot of the demo when Playwright is installed where the server runs. `reduced_motion` and `width` (375 or 1440) are options. |
| `install_component` | Writes the component into a project: the `react` variant writes `<components_dir>/<family>/<id>.tsx` plus the `_lib` helpers it imports (the same files as the shadcn registry item); the `plain` variant writes the CSS + HTML and Tailwind version (top 20 only). It leaves existing files alone unless `overwrite` is set. |
| `query_data` | Rows from `data/*.csv` (archetypes, signatures, mutations, palettes, fonts, motion, …) filtered by words. |

Resources: `motomation://catalogue` (JSON), `motomation://components/<id>` (TypeScript source), `motomation://data/<name>.csv`. The templates are listed by `resources/templates/list`.

## Add it to a client

Claude Code:

```sh
claude mcp add motomation -- node /absolute/path/to/asfakulsiam-motomation-design/mcp/server.mjs
```

Cursor (`.cursor/mcp.json`), Claude Desktop (`claude_desktop_config.json`) and other clients that read the `mcpServers` shape:

```json
{ "mcpServers": { "motomation": { "command": "node", "args": ["/absolute/path/to/asfakulsiam-motomation-design/mcp/server.mjs"] } } }
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.motomation]
command = "node"
args = ["/absolute/path/to/asfakulsiam-motomation-design/mcp/server.mjs"]
```

## Checked by

`node tests/mcp/session.mjs` has two parts:

- A raw JSON-RPC session: initialize, tools/list, search, install, a resource read, and the error cases. CI runs this part.
- With `@modelcontextprotocol/sdk` resolvable (for example through `NODE_PATH`), the official SDK client lists the tools, searches, installs a React and a plain component, reads resources and takes a preview.
