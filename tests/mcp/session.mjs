// MCP check for mcp/server.mjs. Part 1 prints a raw stdio JSON-RPC session (what any client sends and receives).
// Part 2 uses the official SDK client (@modelcontextprotocol/sdk, local toolchain only, never a repo dependency):
// list tools, search, install a component into a scratch project, read a resource, and check the files it wrote.
//   NODE_PATH=~/tc/node_modules node tests/mcp/session.mjs
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../.."), SERVER = join(ROOT, "mcp/server.mjs");
const fails = []; const ok = (c, m) => (c || fails.push(m), c);
const short = (o) => { const s = JSON.stringify(o); return s.length > 420 ? s.slice(0, 420) + ` … (${s.length} chars)` : s; };

// ── part 1: raw session
console.log("── raw stdio session (client → server, server → client)");
const proj = mkdtempSync(join(tmpdir(), "mm-mcp-"));
const reqs = [
  { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "raw-test", version: "1" } } },
  { jsonrpc: "2.0", method: "notifications/initialized" },
  { jsonrpc: "2.0", id: 2, method: "tools/list" },
  { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "search_components", arguments: { query: "scroll text", limit: 4 } } },
  { jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "install_component", arguments: { id: "ink-fill", project_dir: proj } } },
  { jsonrpc: "2.0", id: 5, method: "resources/read", params: { uri: "motomation://data/signatures.csv" } },
  { jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "get_component", arguments: { id: "nope" } } },
  { jsonrpc: "2.0", id: 7, method: "bogus/method" },
];
const out = await new Promise((done) => { const p = spawn(process.execPath, [SERVER], { stdio: ["pipe", "pipe", "inherit"] }); let buf = "", got = [];
  p.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { got.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); if (got.length === reqs.filter((r) => r.id).length) { p.kill(); done(got); } } });
  for (const r of reqs) p.stdin.write(JSON.stringify(r) + "\n"); });
for (const r of reqs) { console.log("→ " + short(r)); const res = out.find((x) => x.id === r.id); if (res) console.log("← " + short(res)); }
const byId = Object.fromEntries(out.map((x) => [x.id, x]));
ok(byId[1].result.protocolVersion === "2025-06-18", "initialize"); ok(byId[2].result.tools.length === 5, "tools/list");
ok(byId[4].result.structuredContent.written.length === 2 && existsSync(join(proj, "src/components/motomation/type/ink-fill.tsx")), "raw install");
ok(byId[6].result.isError === true, "unknown id → isError"); ok(byId[7].error?.code === -32601, "unknown method → -32601");

// ── part 2: official SDK client
console.log("\n── official SDK client");
const req = createRequire(import.meta.url); let Client, StdioClientTransport;
try { ({ Client } = req("@modelcontextprotocol/sdk/client/index.js")); ({ StdioClientTransport } = req("@modelcontextprotocol/sdk/client/stdio.js")); }
catch { console.log("SDK not installed here: part 2 not run (part 1 is the protocol check; CI runs part 1)."); console.log(fails.length ? `FAIL: ${fails.join("; ")}` : "part 1 passed"); process.exit(fails.length ? 1 : 0); }
let sdkd = dirname(req.resolve("@modelcontextprotocol/sdk/client/index.js")); while (!existsSync(join(sdkd, "package.json")) || !JSON.parse(readFileSync(join(sdkd, "package.json"), "utf8")).version) sdkd = dirname(sdkd);
const sdkv = JSON.parse(readFileSync(join(sdkd, "package.json"), "utf8")).version;
const client = new Client({ name: "sdk-test", version: "1" }); await client.connect(new StdioClientTransport({ command: process.execPath, args: [SERVER] }));
console.log(`@modelcontextprotocol/sdk ${sdkv} · server ${JSON.stringify(client.getServerVersion())}`);
const tools = (await client.listTools()).tools; console.log(`tools/list → ${tools.map((t) => t.name).join(", ")}`);
ok(tools.map((t) => t.name).join() === "search_components,get_component,preview_component,install_component,query_data", "sdk tool list");
const s = await client.callTool({ name: "search_components", arguments: { query: "paper", max_tier: 2 } }); console.log(`search "paper" (tier ≤ 2) → ${s.structuredContent.results.map((r) => r.id).join(", ")}`);
const g = await client.callTool({ name: "get_component", arguments: { id: "count-up", include_source: false } }); console.log(`get_component count-up → props ${g.structuredContent.props.map((p) => p.name + (p.default ? "=" + p.default : "")).join(" ")}; install "${g.structuredContent.install}"`);
const proj2 = mkdtempSync(join(tmpdir(), "mm-mcp-sdk-"));
const inst = await client.callTool({ name: "install_component", arguments: { id: "aurora", project_dir: proj2 } }); console.log(`install_component aurora → ${inst.content[0].text.replace(/\n/g, " | ")}`);
const again = await client.callTool({ name: "install_component", arguments: { id: "aurora", project_dir: proj2 } }); console.log(`install again → written ${again.structuredContent.written.length}, kept ${again.structuredContent.kept.length}`);
const plain = await client.callTool({ name: "install_component", arguments: { id: "count-up", project_dir: proj2, variant: "plain", components_dir: "public/motomation" } }); console.log(`install count-up (plain) → ${plain.structuredContent.written.join(", ")}`);
const d = await client.callTool({ name: "query_data", arguments: { dataset: "archetypes", query: "poster", limit: 2 } }); console.log(`query_data archetypes "poster" → ${d.structuredContent.total} rows; first id ${d.structuredContent.rows[0]?.id}`);
const res = await client.listResources(); const cat = await client.readResource({ uri: "motomation://catalogue" });
console.log(`resources/list → ${res.resources.length} (catalogue + components + data sets); catalogue has ${JSON.parse(cat.contents[0].text).length} entries`);
const pv = await client.callTool({ name: "preview_component", arguments: { id: "beams", reduced_motion: true } }); const img = pv.content.find((c) => c.type === "image");
console.log(`preview_component beams (reduced) → ${pv.structuredContent.frame}; screenshot ${img ? `${Math.round(img.data.length * 0.75 / 1024)} KB PNG` : "none"}`);
await client.close();
const files = ["src/components/motomation/backgrounds/aurora.tsx", "src/components/motomation/_lib/motion.ts", "src/components/motomation/_lib/ambient.ts"];
ok(files.every((f) => existsSync(join(proj2, f))) && again.structuredContent.written.length === 0 && plain.structuredContent.written.length === 5 && img, "sdk install / plain / preview");
console.log(`\nscratch projects: ${proj} ${proj2}`);
console.log(fails.length ? `FAIL: ${fails.join("; ")}` : "all checks passed"); process.exit(fails.length ? 1 : 0);
