import { chromium } from "playwright"; import http from "http"; import fs from "fs"; import path from "path";
const W=process.argv[2]; const T={".html":"text/html",".js":"text/javascript",".css":"text/css",".woff2":"font/woff2",".png":"image/png"};
const srv=http.createServer((q,r)=>{let f=path.join(W,decodeURIComponent(q.url.split("?")[0])); if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,"index.html"); if(!fs.existsSync(f)){r.writeHead(404);return r.end()} r.writeHead(200,{"content-type":T[path.extname(f)]||""}); r.end(fs.readFileSync(f))}).listen(8733);
const b=await chromium.launch();
for (const arm of ["baseline","skill"]) for (const [w,h] of [[1440,900],[375,812]]) { const pg=await (await b.newContext({viewport:{width:w,height:h}})).newPage(); await pg.goto(`http://localhost:8733/${arm}/`,{waitUntil:"networkidle"}); await pg.waitForTimeout(1500);
 const H=await pg.evaluate(()=>document.documentElement.scrollHeight)-h; let y=0;
 for(let i=0;i<8;i++){ const target=Math.round(H*i/7); while(y<target){await pg.mouse.wheel(0,400); y+=400; await pg.waitForTimeout(90);} await pg.waitForTimeout(2200); await pg.screenshot({path:`${W}/shots/${arm}-${w}-frame${i}.png`}); }
}
await b.close(); srv.close();
