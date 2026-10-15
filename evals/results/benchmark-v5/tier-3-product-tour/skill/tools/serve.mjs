// tiny static server for local QA: node tools/serve.mjs [port]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const T = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".txt": "text/plain", ".xml": "application/xml" };
export function serve(root, port = 8765) {
  return new Promise((res) => {
    const s = createServer(async (q, r) => {
      let p = decodeURIComponent(new URL(q.url, "http://x").pathname);
      if (p.endsWith("/")) p += "index.html";
      try { const b = await readFile(join(root, normalize(p))); r.writeHead(200, { "content-type": T[extname(p)] || "application/octet-stream" }); r.end(b); }
      catch { r.writeHead(404); r.end("not found"); }
    }).listen(port, "127.0.0.1", () => res(s));
  });
}
