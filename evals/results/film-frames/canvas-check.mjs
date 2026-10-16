// open each film template in a real browser (full motion), scroll into the film, report how much of the canvas is painted
import { chromium } from "playwright"; import { createServer } from "node:http"; import { readFileSync, existsSync, statSync } from "node:fs"; import { join, extname } from "node:path";
const root = process.argv[2]; const M={".html":"text/html",".js":"text/javascript",".mjs":"text/javascript",".css":"text/css",".woff2":"font/woff2",".webp":"image/webp",".json":"application/json",".jpg":"image/jpeg",".mp4":"video/mp4"};
const srv = createServer((q,r)=>{let p=join(root,decodeURIComponent(q.url.split("?")[0])); if(existsSync(p)&&statSync(p).isDirectory()) p=join(p,"index.html"); if(!existsSync(p)){r.writeHead(404);return r.end();} r.writeHead(200,{"content-type":M[extname(p)]||"application/octet-stream"}); r.end(readFileSync(p));}).listen(0);
const b = await chromium.launch();
for (const id of ["product-launch","motion-portfolio"]) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:"no-preference" }); const pg = await ctx.newPage();
  let fr404 = 0, fr200 = 0; pg.on("response", (r) => { if (/\/frames\//.test(r.url())) r.status() === 200 ? fr200++ : fr404++; });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/${id}/?ambient=force`, { waitUntil: "networkidle" });
  const y = await pg.evaluate(() => { const c = document.querySelector("canvas"); return c ? c.getBoundingClientRect().top + scrollY + 400 : 0; });
  for (let s = 0; s < y; s += 400) { await pg.mouse.wheel(0, 400); await pg.waitForTimeout(60); }
  await pg.waitForLoadState("networkidle").catch(()=>{}); await pg.waitForTimeout(1500);
  const res = await pg.evaluate(() => { const c = document.querySelector("canvas"); if (!c) return { canvas: false };
    const t = document.createElement("canvas"); t.width = 160; t.height = Math.max(1, Math.round(160 * c.height / c.width)); const x = t.getContext("2d"); x.drawImage(c, 0, 0, t.width, t.height);
    const d = x.getImageData(0, 0, t.width, t.height).data; let painted = 0, distinct = new Set();
    for (let i = 0; i < d.length; i += 4) { if (d[i+3] > 0) painted++; distinct.add((d[i]>>4)<<8|(d[i+1]>>4)<<4|(d[i+2]>>4)); }
    return { canvas: true, size: `${c.width}x${c.height}`, paintedPct: +(100 * painted / (d.length / 4)).toFixed(1), colours: distinct.size }; });
  await pg.screenshot({ path: `/tmp/fresh-${id}.jpg`, type: "jpeg", quality: 70 });
  console.log(id, JSON.stringify({ ...res, frameRequests200: fr200, frameRequestsFailed: fr404 }));
  await ctx.close();
}
await b.close(); srv.close();
