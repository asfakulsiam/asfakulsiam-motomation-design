const {chromium}=require('/home/user/workspace/repo/node_modules/playwright');
const fs=require('fs'),path=require('path');
const out='/home/user/workspace/v302-eval';fs.mkdirSync(out+'/shots',{recursive:true});
const sites=[
 {id:'03-b2b',root:'/tmp/bench/runs/03-b2b',port:4610,forms:['/demo','/contact']},
 {id:'08-travel-booking',root:'/tmp/bench/runs/08-travel-booking',port:4611,forms:['/booking/dates','/contact']},
 {id:'12a-archival',root:'/tmp/bench/runs/12-paired/a-archival',port:4612,forms:['/checkout','/contact','/subscriptions/build','/account/subscription']},
 {id:'12b-poster',root:'/tmp/bench/runs/12-paired/b-poster',port:4613,forms:['/checkout','/contact','/subscriptions/build','/account/subscription']}
];
function routes(root){let res=[];function walk(dir){for(const d of fs.readdirSync(dir,{withFileTypes:true})){if(['assets','screens','checks','qa','evaluator-walk','data'].includes(d.name))continue;let f=path.join(dir,d.name);if(d.isDirectory())walk(f);else if(f.endsWith('.html')){let r='/'+path.relative(root,f).replace(/\\/g,'/').replace(/index\.html$/,'').replace(/\.html$/,'').replace(/\/$/,'');if(!res.includes(r||'/'))res.push(r||'/');}}}walk(root);return res;}
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
for(const site of sites){
 const ctx=await browser.newContext({viewport:{width:375,height:812}}),page=await ctx.newPage();
 let errors=[];page.on('pageerror',e=>errors.push(e.message));
 const result={id:site.id,routeChecks:[],forms:[],errors};
 for(const route of routes(site.root)){
  await page.setViewportSize({width:375,height:812});
  const response=await page.goto(`http://127.0.0.1:${site.port}${route}`,{waitUntil:'networkidle'});
  const info=await page.evaluate(()=>({title:document.title,h1:document.querySelector('h1')?.innerText,text:document.body.innerText,formCount:document.forms.length,iframe:[...document.querySelectorAll('iframe')].map(e=>e.src)}));
  const widths={};
  for(const width of [375,320]){
   await page.setViewportSize({width,height:812});
   widths[width]=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,offenders:[...document.querySelectorAll('body *')].filter(e=>{let r=e.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)&&getComputedStyle(e).position!=='absolute';}).slice(0,15).map(e=>({tag:e.tagName,cls:e.className,text:e.innerText?.slice(0,75),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right)}))}));
  }
  result.routeChecks.push({route,status:response.status(),...info,widths});
 }
 for(const route of site.forms){
  await page.goto(`http://127.0.0.1:${site.port}${route}`,{waitUntil:'networkidle'});
  result.forms.push({route,controls:await page.locator('main input, main select, main textarea, main button').evaluateAll(es=>es.map(e=>({tag:e.tagName,type:e.type,id:e.id,name:e.name,text:e.innerText,value:e.value,required:e.required,disabled:e.disabled,options:e.options?[...e.options].map(o=>({text:o.text,value:o.value})):undefined}))),text:await page.locator('main').innerText()});
 }
 await page.setViewportSize({width:375,height:812});
 await page.goto(`http://127.0.0.1:${site.port}/`,{waitUntil:'networkidle'});
 result.homeTabs=[];
 for(let i=0;i<18;i++){await page.keyboard.press('Tab');result.homeTabs.push(await page.evaluate(()=>{let e=document.activeElement,r=e.getBoundingClientRect();return {tag:e.tagName,text:e.innerText,href:e.getAttribute('href'),outline:getComputedStyle(e).outline,rect:{x:r.x,y:r.y,w:r.width,h:r.height}};}));}
 await page.screenshot({path:`${out}/shots/${site.id}-keyboard-375.jpg`,type:'jpeg',quality:70});
 results.push(result);await ctx.close();console.log(site.id,'routes',result.routeChecks.length,'overflow',result.routeChecks.filter(r=>r.widths[375].scroll>375||r.widths[320].scroll>320).map(r=>r.route));
}
await browser.close();fs.writeFileSync(out+'/initial-browser-audit.json',JSON.stringify(results,null,2));
})();
