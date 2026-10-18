const {chromium}=require('/home/user/workspace/repo/node_modules/playwright');
const fs=require('fs');
const out='/home/user/workspace/v302-eval';
const previous=require('./initial-browser-audit.json');
const axe=require('/home/user/workspace/repo/node_modules/axe-core');
function contrastRead(){
 const rgba=s=>{let m=s.match(/[\d.]+/g);return m?m.map(Number):[0,0,0,0];};
 const blend=(a,b)=>{let alpha=a[3]??1;return [0,1,2].map(i=>a[i]*alpha+b[i]*(1-alpha)).concat(1);};
 const lum=a=>a.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const vals=[],failures=[];
 for(const e of document.querySelectorAll('body *')){
  if(e.closest('svg,script,style,template'))continue;
  const text=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').trim();
  if(!text)continue;let st=getComputedStyle(e),r=e.getBoundingClientRect();
  if(!r.width||!r.height||st.visibility==='hidden'||st.display==='none')continue;
  let chain=[],p=e,opacity=1,image=false;
  while(p){let c=getComputedStyle(p);chain.push(rgba(c.backgroundColor));opacity*=Number(c.opacity);if(c.backgroundImage!=='none')image=true;p=p.parentElement;}
  if(opacity===0)continue;
  let bg=[255,255,255,1];for(const c of chain.reverse())bg=blend(c,bg);
  let fg=rgba(st.color);fg[3]=(fg[3]??1)*opacity;fg=blend(fg,bg);
  let a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  const size=parseFloat(st.fontSize),v={tag:e.tagName,cls:String(e.className),text:text.slice(0,150),size,weight:st.fontWeight,color:st.color,bg,ratio:+ratio.toFixed(3),backgroundImage:image};
  vals.push(v);if(ratio<(size>=16?4.5:3))failures.push(v);
 }
 return {count:vals.length,minBody:Math.min(...vals.filter(v=>v.size>=16&&!v.backgroundImage).map(v=>v.ratio)),failures};
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const results=[];
 for(let i=0;i<previous.length;i++){
  const site=previous[i],port=4610+i,context=await browser.newContext({viewport:{width:375,height:812}}),page=await context.newPage();
  const res={id:site.id,contrast:[],axe:[],motion:[],controls:[]};
  for(const width of [375,1440]){
   await page.setViewportSize({width,height:width===1440?900:812});
   for(const r of site.routeChecks){
    await page.goto(`http://127.0.0.1:${port}${r.route}`,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
    res.contrast.push({route:r.route,width,...await page.evaluate(contrastRead)});
   }
   await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle'});await page.addScriptTag({content:axe.source});
   const scan=await page.evaluate(()=>axe.run(document,{runOnly:{type:'rule',values:['color-contrast','label','button-name','link-name','image-alt','html-has-lang','document-title']}}));
   res.axe.push({width,violations:scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:scan.incomplete.map(v=>({id:v.id,count:v.nodes.length}))});
  }
  await page.setViewportSize({width:1440,height:900});
  for(const reducedMotion of ['no-preference','reduce']){
   await page.emulateMedia({reducedMotion});await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle'});
   res.motion.push({reducedMotion,data:await page.evaluate(()=>({animations:document.getAnimations().map(a=>({target:a.effect?.target?.className,state:a.playState,duration:a.effect?.getComputedTiming().duration,iterations:a.effect?.getComputedTiming().iterations})),transform:[...document.querySelectorAll('.pack-fan,.main-pack,.hero-poster a,.btn')].slice(0,6).map(e=>({cls:e.className,transform:getComputedStyle(e).transform,transition:getComputedStyle(e).transition,animation:getComputedStyle(e).animation}))}))});
   await page.screenshot({path:`${out}/shots/${site.id}-${reducedMotion}-1440.jpg`,type:'jpeg',quality:70});
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle'});
  const h=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
  for(let n=0;n<8;n++){await page.evaluate(y=>scrollTo(0,y),Math.round(h*n/7));await page.screenshot({path:`${out}/shots/${site.id}-scroll-${n}.jpg`,type:'jpeg',quality:70});}
  // Independent real pointer checks of the non-submit frontend controls.
  if(i===0){
   await page.goto(`http://127.0.0.1:${port}/pricing`,{waitUntil:'networkidle'});
   const prices=()=>page.locator('[data-annual-price]').allTextContents();
   let before=await prices();await page.locator('[data-billing="monthly"]').click();let monthly=await prices();await page.locator('[data-billing="annual"]').click();let annual=await prices();res.controls.push({kind:'pricing',before,monthly,annual});
   await page.goto(`http://127.0.0.1:${port}/integrations`,{waitUntil:'networkidle'});
   const filt=page.locator('[data-filter]:not([data-filter="all"])').first();await filt.click();res.controls.push({kind:'integration filter',button:await filt.innerText(),visible:await page.locator('[data-integration-category]:visible').allTextContents()});
   await page.goto(`http://127.0.0.1:${port}/security`,{waitUntil:'networkidle'});
   const dl=page.locator('a[href="/security/overview"]').first();res.controls.push({kind:'security download interface',text:await dl.innerText(),download:await dl.getAttribute('download')});await dl.click();res.controls.push({kind:'security overview',url:page.url(),text:await page.locator('main').innerText(),downloadLinks:await page.locator('main a[download]').count()});
  }else if(i>=2){
   await page.goto(`http://127.0.0.1:${port}/shop`,{waitUntil:'networkidle'});
   await page.locator('select[name="origin"]').selectOption('Bangladesh');
   res.controls.push({kind:'origin filter',count:await page.locator('[data-product]:visible').count(),text:await page.locator('[data-result-count]').innerText()});
   await page.locator('select[name="type"]').selectOption('White');
   res.controls.push({kind:'empty filter state',count:await page.locator('[data-product]:visible').count(),text:await page.locator('[data-no-results]').innerText()});
   await page.locator('button[type="reset"]').click();
   res.controls.push({kind:'filter recovery',count:await page.locator('[data-product]:visible').count()});
  }
  await page.setViewportSize({width:320,height:812});await page.goto(`http://127.0.0.1:${port}${i===1?'/booking/dates':'/'}`,{waitUntil:'networkidle'});
  await page.screenshot({path:`${out}/shots/${site.id}-320-overflow.jpg`,type:'jpeg',quality:70});
  results.push(res);fs.writeFileSync(out+'/extra-evidence.json',JSON.stringify(results,null,2));await context.close();console.log(site.id,'extra checks complete');
 }
 await browser.close();
})();
