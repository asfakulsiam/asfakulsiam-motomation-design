import { chromium } from "playwright";
import http from "http"; import fs from "fs"; import path from "path";
const W=process.argv[2]; const types={".html":"text/html",".js":"text/javascript",".css":"text/css",".woff2":"font/woff2",".png":"image/png",".svg":"image/svg+xml"};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split("?")[0]); for(const a of ["baseline","skill"]) if(p.startsWith("/"+a)){ let f=path.join(W,p); if(fs.existsSync(f)&&fs.statSync(f).isDirectory()) f=path.join(f,"index.html"); if(fs.existsSync(f)){r.writeHead(200,{"content-type":types[path.extname(f)]||"application/octet-stream"});return r.end(fs.readFileSync(f));}} r.writeHead(404);r.end();}).listen(8731);
const b=await chromium.launch(); const out={};
for (const arm of ["baseline","skill"]) for (const rm of ["no-preference","reduce"]) {
  const ctx=await b.newContext({viewport:{width:375,height:812},reducedMotion:rm,deviceScaleFactor:1}); const pg=await ctx.newPage(); const errs=[]; pg.on("pageerror",e=>errs.push(e.message)); pg.on("console",m=>{if(m.type()==="error")errs.push(m.text())});
  await pg.goto(`http://localhost:8731/${arm}/`,{waitUntil:"networkidle"}); await pg.waitForTimeout(800);
  const pre=await pg.evaluate(()=>{const ST=window.ScrollTrigger; const all=ST?ST.getAll():[]; return {gsap:!!window.gsap, gsapV:window.gsap&&gsap.version, ST:!!ST, lenis:!!(window.Lenis), triggers:all.length, pins:all.filter(t=>t.pin).length, scrub:all.filter(t=>t.vars&&t.vars.scrub).length, triggerSections:[...new Set(all.map(t=>{const el=t.trigger; const s=el&&el.closest&&el.closest("section,header,footer,aside"); return s?(s.id||s.tagName+"."+(s.className||"")).slice(0,40):"?"}))], vt: typeof document.startViewTransition==="function" && /startViewTransition/.test([...document.scripts].map(s=>s.textContent).join("")), canvas:document.querySelectorAll("canvas").length, sections:document.querySelectorAll("article section, main section").length, words:(document.querySelector("article,main")||document.body).innerText.split(/\s+/).length}});
  // scroll through
  const H=await pg.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<=H;y+=600){await pg.evaluate(y=>window.scrollTo(0,y),y); await pg.waitForTimeout(rm==="reduce"?30:120);} await pg.waitForTimeout(1500);
  const post=await pg.evaluate(()=>{const els=[...document.querySelectorAll("article p, article h2, article blockquote, article figure, article figcaption, h1")]; const hidden=els.filter(e=>{const cs=getComputedStyle(e); return +cs.opacity<0.99||cs.visibility==="hidden"}); return {checked:els.length, notFullyVisible:hidden.length, sample:hidden.slice(0,3).map(e=>e.tagName+":"+e.textContent.slice(0,40))}});
  // pre-scroll in reduce mode: are below-fold elements already visible?
  out[arm+"/"+rm]={...pre,...post,errors:errs.slice(0,5)};
  await pg.evaluate(()=>window.scrollTo(0,0)); await pg.waitForTimeout(300);
  if(rm==="no-preference"){ await pg.screenshot({path:`${W}/shots/${arm}-375-top.png`}); await pg.screenshot({path:`${W}/shots/${arm}-375-full.png`,fullPage:true}); }
  else await pg.screenshot({path:`${W}/shots/${arm}-375-reduced-full.png`,fullPage:true});
  await ctx.close();
}
for (const arm of ["baseline","skill"]) { const ctx=await b.newContext({viewport:{width:1440,height:900}}); const pg=await ctx.newPage(); await pg.goto(`http://localhost:8731/${arm}/`,{waitUntil:"networkidle"}); await pg.waitForTimeout(800); await pg.screenshot({path:`${W}/shots/${arm}-1440-top.png`});
  const H=await pg.evaluate(()=>document.documentElement.scrollHeight); for(let i=1;i<=7;i++){await pg.evaluate(y=>window.scrollTo(0,y),Math.round(H*i/8)); await pg.waitForTimeout(1300); await pg.screenshot({path:`${W}/shots/${arm}-1440-frame${i}.png`});} await ctx.close(); }
console.log(JSON.stringify(out,null,1)); await b.close(); srv.close();
