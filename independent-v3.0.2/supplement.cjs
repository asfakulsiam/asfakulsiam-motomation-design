const {chromium}=require('/home/user/workspace/repo/node_modules/playwright');
const fs=require('fs'),sharp=require('sharp');
const out='/home/user/workspace/v302-eval';
async function tabTo(page,s){for(let i=0;i<150;i++){if(await page.evaluate(s=>document.activeElement.matches(s),s))return;await page.keyboard.press('Tab');}throw Error('Not reachable: '+s);}
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
let res=[];
for(const [i,id] of ['03-b2b','08-travel-booking','12a-archival','12b-poster'].entries()){
 const ctx=await browser.newContext({viewport:{width:375,height:812}}),page=await ctx.newPage(),base=`http://127.0.0.1:${4610+i}`,r={id};
 await page.goto(base,{waitUntil:'networkidle'});let menu=i===0?'.mobile-toggle':'summary';
 await tabTo(page,menu);await page.keyboard.press('Space');
 r.menu={text:await page.locator('header').innerText(),scroll:await page.evaluate(()=>document.documentElement.scrollWidth)};
 await page.screenshot({path:`${out}/shots/${id}-375-menu.jpg`,type:'jpeg',quality:70});
 if(i===0){
  await page.goto(base+'/security/overview',{waitUntil:'networkidle'});
  const btn=page.locator('a[download]');r.download={href:await btn.getAttribute('href'),label:await btn.innerText()};
  const download=page.waitForEvent('download');await btn.click();const d=await download;
  await d.saveAs(out+'/security-overview-downloaded.svg');
  r.download.suggestedFilename=d.suggestedFilename();r.download.contents=fs.readFileSync(out+'/security-overview-downloaded.svg','utf8');
 }else if(i===1){
  await page.goto(base+'/getting-there',{waitUntil:'networkidle'});
  r.map={before:await page.locator('main').innerText()};
  const btns=await page.locator('main button').evaluateAll(es=>es.map(e=>({id:e.id,text:e.innerText})));r.map.buttons=btns;
  const load=btns.find(e=>/map/i.test(e.text));if(load){await page.locator('#'+load.id).click();await page.waitForSelector('iframe');r.map.iframe=await page.locator('iframe').getAttribute('src');}
 }else{
  await page.goto(base+'/shop',{waitUntil:'networkidle'});
  await page.locator('[name="origin"]').selectOption('Bangladesh');await page.locator('[name="type"]').selectOption('White');
  await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector('[data-result-count]').textContent==='6 teas');
  r.filterReset={count:await page.locator('[data-product]:visible').count(),label:await page.locator('[data-result-count]').innerText()};
  await page.goto(base+'/account/subscription',{waitUntil:'networkidle'});
  await tabTo(page,'input[value="pause"]');await page.keyboard.press('ArrowRight');
  r.managementKeyboardFocus=await page.evaluate(()=>({value:document.activeElement.value,checked:document.activeElement.checked}));
  await tabTo(page,'button[type="submit"]');await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('[data-sub-state]').textContent==='Next delivery skipped');
  await page.reload({waitUntil:'networkidle'});r.managementKeyboardSaved=await page.locator('[data-sub-state]').innerText();
 }
 await ctx.close();res.push(r);
 const frames=await Promise.all(Array.from({length:8},(_,n)=>sharp(`${out}/shots/${id}-scroll-${n}.jpg`).resize(360,225).toBuffer()));
 await sharp({create:{width:720,height:900,channels:3,background:'#ffffff'}}).composite(frames.map((input,n)=>({input,left:n%2*360,top:Math.floor(n/2)*225}))).jpeg({quality:70}).toFile(`${out}/shots/${id}-scroll-strip.jpg`);
}
await browser.close();fs.writeFileSync(out+'/supplement-evidence.json',JSON.stringify(res,null,2));
})();
