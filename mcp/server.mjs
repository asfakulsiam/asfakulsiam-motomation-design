#!/usr/bin/env node
// Motomation MCP server: the component library and the skill's data sets over the Model Context Protocol (stdio).
// No dependencies: newline-delimited JSON-RPC 2.0 on stdin/stdout, as the MCP stdio transport specifies
// (spec 2025-06-18; older clients that ask for 2025-03-26 or 2024-11-05 get that version back).
//
//   tools      search_components · get_component · preview_component · install_component · query_data
//   resources  motomation://catalogue · motomation://components/<id> · motomation://data/<name>.csv
//
// It reads the repository it lives in (the component files, registry, vendor/plain, data/*.csv) at request time and
// keeps no copy of them; the skill's guidance (SKILL.md and the docs) stays in the skill.
//   claude mcp add motomation -- node /path/to/asfakulsiam-motomation-design/mcp/server.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { createInterface } from "node:readline";
import { collect } from "../scripts/build-components.mjs";
import { parseProps } from "../scripts/build-docs-site.mjs";
import { parseCSV } from "../skills/asfakulsiam-motomation-design/scripts/lib.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SKILL = join(ROOT, "skills/asfakulsiam-motomation-design");
const LIB = join(SKILL, "examples/components");
const VERSION = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version;
const SITE = "https://asfakulsiam.github.io/asfakulsiam-motomation-design";
const RAW = "https://raw.githubusercontent.com/asfakulsiam/asfakulsiam-motomation-design/main";
const PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const lib = () => collect().components;
const find = (id) => { const c = lib().find((x) => x.id === id); if (!c) throw new UserError(`No component "${id}". Use search_components to find ids.`); return c; };
const plainIds = () => { const f = join(ROOT, "vendor/plain/top5.json"); return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")).components.map((c) => c.id) : []; };
class UserError extends Error {}
const libsOf = (src, seen = new Set(["motion"])) => { for (const m of src.matchAll(/from "(?:\.\.\/_lib|\.)\/(\w+)"/g)) if (!seen.has(m[1])) { seen.add(m[1]); libsOf(readFileSync(join(LIB, `_lib/${m[1]}.ts`), "utf8"), seen); } return [...seen]; };
const datasets = () => readdirSync(join(SKILL, "data")).filter((f) => f.endsWith(".csv")).map((f) => f.replace(/\.csv$/, ""));
const rows = (name) => { if (!datasets().includes(name)) throw new UserError(`No data set "${name}". Available: ${datasets().join(", ")}`); return parseCSV(readFileSync(join(SKILL, "data", `${name}.csv`), "utf8")); };
const words = (q) => String(q || "").toLowerCase().split(/\s+/).filter(Boolean);
const summary = (c) => ({ id: c.id, name: c.name, family: c.family, tier: +c.tier, what: c.what });

// ── tools ───────────────────────────────────────────────────────────────────────────────────────────────────
const TOOLS = [
  { name: "search_components", title: "Search components",
    description: "Search the Motomation motion components by words (all must match name, id, family, what, use-when). Returns ids for the other tools. Each result says what it does; call get_component before using one, and read its avoid-when.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "Words, e.g. 'scroll text' or 'paper'. Empty lists everything." }, family: { type: "string", enum: ["type", "text", "scroll", "cursor", "backgrounds", "layout", "ui", "micro"] }, max_tier: { type: "integer", minimum: 1, maximum: 5, description: "Cost ceiling: 1 cheap … 5 heavy (WebGL)" }, limit: { type: "integer", minimum: 1, maximum: 68, default: 12 } }, additionalProperties: false },
    annotations: { readOnlyHint: true } },
  { name: "get_component", title: "Get a component",
    description: "Everything about one component: what it does, when to use and avoid it, reduced-motion, touch and accessibility behaviour, props (type and default), install command, docs URL, and the full TypeScript source.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, include_source: { type: "boolean", default: true } }, required: ["id"], additionalProperties: false },
    annotations: { readOnlyHint: true } },
  { name: "preview_component", title: "Preview a component",
    description: "A live preview of one component: the docs page, the 375 px mobile frame, and (when Playwright is installed where the server runs) a PNG screenshot of the demo, optionally with reduced motion on.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, reduced_motion: { type: "boolean", default: false }, width: { type: "integer", enum: [375, 1440], default: 1440 } }, required: ["id"], additionalProperties: false },
    annotations: { readOnlyHint: true } },
  { name: "install_component", title: "Install a component",
    description: "Write a component into a project: variant 'react' writes <components_dir>/<family>/<id>.tsx plus the _lib helpers it imports (the same files the shadcn registry item installs); variant 'plain' writes the CSS + HTML / Tailwind version (top 20 only). Existing files are left alone unless overwrite is true.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, project_dir: { type: "string", description: "Absolute path of the project" }, components_dir: { type: "string", default: "src/components/motomation", description: "Relative to project_dir" }, variant: { type: "string", enum: ["react", "plain"], default: "react" }, overwrite: { type: "boolean", default: false } }, required: ["id", "project_dir"], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true } },
  { name: "query_data", title: "Query the skill's data",
    description: "Rows from the skill's data sets (archetypes, signatures, mutations, palettes, fonts, motion, kinetics, collisions, rules, styles, categories, components), filtered by words.",
    inputSchema: { type: "object", properties: { dataset: { type: "string" }, query: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 200, default: 20 } }, required: ["dataset"], additionalProperties: false },
    annotations: { readOnlyHint: true } },
];
const text = (s) => ({ type: "text", text: typeof s === "string" ? s : JSON.stringify(s, null, 2) });

async function callTool(name, a = {}) {
  if (name === "search_components") {
    const w = words(a.query); let list = lib().filter((c) => (!a.family || c.family === a.family) && (!a.max_tier || +c.tier <= a.max_tier));
    list = list.filter((c) => { const h = `${c.name} ${c.id} ${c.family} ${c.what} ${c["use-when"]}`.toLowerCase(); return w.every((x) => h.includes(x)); });
    list.sort((p, q) => Number(!w.every((x) => p.name.toLowerCase().includes(x))) - Number(!w.every((x) => q.name.toLowerCase().includes(x))) || p.name.localeCompare(q.name));
    const out = list.slice(0, a.limit || 12).map(summary);
    return { content: [text(out.length ? out.map((c) => `${c.id} · ${c.name} (${c.family}, tier ${c.tier}): ${c.what}`).join("\n") : `No component matches "${a.query}".`)], structuredContent: { total: list.length, results: out } };
  }
  if (name === "get_component") {
    const c = find(a.id), props = parseProps(c.src, c.export);
    const info = { ...summary(c), use_when: c["use-when"], avoid_when: c["avoid-when"], reduced_motion: c["reduced-motion"], touch: c.touch, a11y: c.a11y, file: c.file, export: c.export,
      props: props.map(({ name, type, optional, def }) => ({ name, type, optional, default: def })), install: `npx shadcn@latest add ${RAW}/registry/${c.id}.json`,
      docs: `${SITE}/c/${c.id}.html`, plain_variant: plainIds().includes(c.id) };
    const content = [text(info)]; if (a.include_source !== false) content.push({ type: "resource", resource: { uri: `motomation://components/${c.id}`, mimeType: "text/x-typescript", text: c.src } });
    return { content, structuredContent: info };
  }
  if (name === "preview_component") {
    const c = find(a.id), rm = a.reduced_motion ? 1 : 0, width = a.width || 1440;
    const urls = { docs: `${SITE}/c/${c.id}.html?rm=${rm}`, frame: `${SITE}/c/${c.id}.html?frame=1&rm=${rm}`, gallery: `${SITE}/gallery/#${c.id}` };
    const content = [text({ id: c.id, ...urls })];
    let chromium = null; try { chromium = createRequire(join(process.cwd(), "noop.js"))("playwright").chromium; } catch { try { chromium = createRequire(import.meta.url)("playwright").chromium; } catch {} }
    const local = join(ROOT, "docs/site/c", `${c.id}.html`);
    if (chromium && existsSync(local)) {
      const b = await chromium.launch(); try { const p = await b.newPage({ viewport: { width, height: 760 }, reducedMotion: rm ? "reduce" : "no-preference" });
        await p.goto(`${pathToFileURL(local).href}?frame=1&rm=${rm}`); await p.waitForTimeout(1600);
        content.push({ type: "image", mimeType: "image/png", data: (await p.screenshot()).toString("base64") }); } finally { await b.close(); }
    } else content.push(text("No screenshot: Playwright isn't installed where the server runs. Open the frame URL instead."));
    return { content, structuredContent: { id: c.id, ...urls, screenshot: content.some((x) => x.type === "image") } };
  }
  if (name === "install_component") {
    const c = find(a.id); if (!a.project_dir || !isAbsolute(a.project_dir)) throw new UserError("project_dir must be an absolute path");
    if (!existsSync(a.project_dir) || !statSync(a.project_dir).isDirectory()) throw new UserError(`project_dir ${a.project_dir} is not a directory`);
    const base = resolve(a.project_dir, a.components_dir || "src/components/motomation"); if (relative(a.project_dir, base).startsWith("..")) throw new UserError("components_dir must stay inside project_dir");
    let files;
    if ((a.variant || "react") === "plain") {
      if (!plainIds().includes(c.id)) throw new UserError(`${c.id} has no plain variant; only the 5 most-used components have one (the library is React-first; use the React variant): ${plainIds().join(", ")}`);
      const dir = join(ROOT, "vendor/plain"); files = [...readdirSync(join(dir, c.id)).map((f) => [`${c.id}/${f}`, join(dir, c.id, f)]), ["_lib/motion.js", join(dir, "_lib/motion.js")]].map(([to, from]) => [join(base, to), readFileSync(from, "utf8")]);
    } else files = [[join(base, c.family, `${c.id}.tsx`), c.src], ...libsOf(c.src).map((n) => [join(base, "_lib", `${n}.ts`), readFileSync(join(LIB, `_lib/${n}.ts`), "utf8")])];
    const written = [], kept = [];
    for (const [to, body] of files) { if (existsSync(to) && !a.overwrite) { kept.push(relative(a.project_dir, to)); continue; } mkdirSync(dirname(to), { recursive: true }); writeFileSync(to, body); written.push(relative(a.project_dir, to)); }
    const importPath = (a.variant || "react") === "plain" ? null : `${relative(join(a.project_dir, "src"), join(base, c.family, c.id)).split("\\").join("/")}`;
    const note = (a.variant || "react") === "plain" ? `Add <link rel="stylesheet" href=".../${c.id}/${c.id}.css"> and <script type="module" src=".../${c.id}/${c.id}.js">; markup is in ${c.id}/plain.html (or tailwind.html).` : `import { ${c.export} } from "@/${importPath}"; React is the only dependency.`;
    return { content: [text(`Installed ${c.name}: ${written.length} written${kept.length ? `, ${kept.length} already there (left alone; overwrite: true replaces them)` : ""}.\n${[...written, ...kept.map((k) => `${k} (kept)`)].join("\n")}\n${note}`)], structuredContent: { id: c.id, written, kept, usage: note } };
  }
  if (name === "query_data") {
    const all = rows(a.dataset), w = words(a.query); const hit = all.filter((r) => w.every((x) => Object.values(r).join(" ").toLowerCase().includes(x)));
    return { content: [text(hit.slice(0, a.limit || 20))], structuredContent: { dataset: a.dataset, total: hit.length, rows: hit.slice(0, a.limit || 20) } };
  }
  throw new RpcError(-32602, `Unknown tool: ${name}`);
}

// ── resources ───────────────────────────────────────────────────────────────────────────────────────────────
function listResources() {
  return [{ uri: "motomation://catalogue", name: "catalogue", title: "Component catalogue", description: "Every component: id, name, family, tier, what", mimeType: "application/json" },
    ...lib().map((c) => ({ uri: `motomation://components/${c.id}`, name: c.id, title: c.name, description: c.what, mimeType: "text/x-typescript" })),
    ...datasets().map((d) => ({ uri: `motomation://data/${d}.csv`, name: `${d}.csv`, title: `Data: ${d}`, mimeType: "text/csv" }))];
}
function readResource(uri) {
  if (uri === "motomation://catalogue") return { uri, mimeType: "application/json", text: JSON.stringify(lib().map(summary), null, 2) };
  let m = uri.match(/^motomation:\/\/components\/([a-z0-9-]+)$/); if (m) return { uri, mimeType: "text/x-typescript", text: find(m[1]).src };
  m = uri.match(/^motomation:\/\/data\/([a-z-]+)\.csv$/); if (m && datasets().includes(m[1])) return { uri, mimeType: "text/csv", text: readFileSync(join(SKILL, "data", `${m[1]}.csv`), "utf8") };
  throw new RpcError(-32002, `Resource not found: ${uri}`);
}

// ── JSON-RPC over stdio ─────────────────────────────────────────────────────────────────────────────────────
class RpcError extends Error { constructor(code, message) { super(message); this.code = code; } }
const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...msg }) + "\n");
async function handle(req) {
  const { method, params = {} } = req;
  switch (method) {
    case "initialize": return { protocolVersion: PROTOCOLS.includes(params.protocolVersion) ? params.protocolVersion : PROTOCOLS[0], capabilities: { tools: { listChanged: false }, resources: { listChanged: false, subscribe: false } },
      serverInfo: { name: "motomation", title: "Motomation components", version: VERSION }, instructions: "Search, read, preview and install Motomation motion components. Read a component's avoid-when before using it; every component has a reduced-motion path." };
    case "ping": return {};
    case "tools/list": return { tools: TOOLS };
    case "tools/call": { if (!TOOLS.some((t) => t.name === params.name)) throw new RpcError(-32602, `Unknown tool: ${params.name}`);
      try { return await callTool(params.name, params.arguments || {}); } catch (e) { if (e instanceof UserError) return { content: [text(e.message)], isError: true }; throw e; } }
    case "resources/list": return { resources: listResources() };
    case "resources/templates/list": return { resourceTemplates: [{ uriTemplate: "motomation://components/{id}", name: "component", title: "Component source", mimeType: "text/x-typescript" }, { uriTemplate: "motomation://data/{name}.csv", name: "data", title: "Skill data set", mimeType: "text/csv" }] };
    case "resources/read": return { contents: [readResource(params.uri)] };
    default: throw new RpcError(-32601, `Method not found: ${method}`);
  }
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const rl = createInterface({ input: process.stdin });
  rl.on("line", async (line) => {
    if (!line.trim()) return; let req; try { req = JSON.parse(line); } catch { send({ id: null, error: { code: -32700, message: "Parse error" } }); return; }
    if (req.id === undefined) return; // notifications (notifications/initialized, cancelled): nothing to answer
    try { send({ id: req.id, result: await handle(req) }); } catch (e) { send({ id: req.id, error: { code: e.code || -32603, message: e.message } }); }
  });
}
export { handle, TOOLS };
