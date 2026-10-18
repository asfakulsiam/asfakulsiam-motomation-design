const {chromium}=require('/home/user/workspace/repo/node_modules/playwright');
const fs=require('fs');
const out='/home/user/workspace/v302-eval';
let page,log,network=[];
async function note(label){log.push({label,url:page.url(),main:await page.locator('main').innerText(),storage:await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage))),network:[...network]});}
async function shot(name){await page.screenshot({path:`${out}/shots/${name}.jpg`,type:'jpeg',quality:70});}
async function tabTo(selector,max=220){
 for(let i=0;i<max;i++){
  if(await page.evaluate(s=>document.activeElement.matches(s),selector))return;
  await page.keyboard.press('Tab');
 }
 throw Error('Tab target unreachable: '+selector);
}
async function activate(selector,key='Enter'){await tabTo(selector);await page.keyboard.press(key);}
async function type(selector,value){await tabTo(selector);await page.keyboard.type(value);}
async function route(selector,pathname){await activate(selector);await page.waitForURL(u=>u.pathname===pathname);await page.waitForLoadState('networkidle');}
async function fresh(browser,port,width){
 const context=await browser.newContext({viewport:{width,height:812}});
 page=await context.newPage();network=[];
 page.on('request',r=>network.push({method:r.method(),type:r.resourceType(),url:r.url()}));
 await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle'});return context;
}
async function checkout(id,width){
 await activate('button[type="submit"]');await note('empty checkout validation');
 await type('#name','Independent Evaluator');await type('#email','evaluator@example.com');
 await type('#address','123 Test Street');await type('#city','Testville');await type('#postal','10001');
 await activate('input[name="consent"]','Space');
 network=[];await route('button[type="submit"]','/confirmation');
 await note('demo order confirmation');await shot(`${id}-${width}-confirmation`);
}
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
for(const width of [375,1440]){
 for(const [id,port] of [['03-b2b',4610],['08-travel-booking',4611],['12a-archival',4612],['12b-poster',4613]]){
  if(process.env.FOLLOWUP&&id==='03-b2b')continue;
  log=[];let context=await fresh(browser,port,width);
  try{
   if(id==='03-b2b'){
    await route('a[href="/product"]','/product');await route('a[href="/integrations"]','/integrations');
    await route('a[href="/pricing"]','/pricing');await route('a[href="/demo"]','/demo');
    await activate('button[type="submit"]');await note('empty demo validation');
    await type('#demo-name','Independent Evaluator');await type('#demo-email','not-an-email');await type('#demo-company','Test Importer');
    // Native-select text entry is tested separately from the Tab/Enter/Space navigation.
    await tabTo('#demo-volume');await page.keyboard.press('Space');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
    await tabTo('#demo-erp');await page.keyboard.press('Space');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
    await note('demo ready (malformed email)');
    network=[];await route('button[type="submit"]','/demo/confirmed');await note('false confirmation with invalid email');await shot(`${id}-${width}-false-confirmation`);
    await page.goto(`http://127.0.0.1:${port}/contact`,{waitUntil:'networkidle'});
    for(const [sel,val] of [['#contact-name','Independent Evaluator'],['#contact-email','invalid'],['#contact-company','Test Importer'],['#contact-message','Test only. No real inquiry.']])await type(sel,val);
    await tabTo('#contact-role');await page.keyboard.press('Space');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
    network=[];await activate('button[type="submit"]');await page.waitForFunction(()=>document.querySelector('#contact-feedback').style.display==='block');
    await note('false inquiry received');await shot(`${id}-${width}-false-inquiry`);
   }else if(id==='08-travel-booking'){
    await route('a[href="/rooms"]','/rooms');await route('a[href="/rooms/garden-veranda"]','/rooms/garden-veranda');
    await route('[data-book-room="garden-veranda"]','/booking/dates');
    await activate('button[type="submit"]');await note('empty date validation');
    let dates=await page.locator('[data-day]:not([disabled])').evaluateAll(es=>es.map(e=>e.dataset.day));
    let pair=dates.find((d,i)=>dates[i+1]&&new Date(dates[i+1])-new Date(d)===86400000);
    if(!pair){await activate('#next-month');dates=await page.locator('[data-day]:not([disabled])').evaluateAll(es=>es.map(e=>e.dataset.day));pair=dates.find((d,i)=>dates[i+1]&&new Date(dates[i+1])-new Date(d)===86400000);}
    const second=dates[dates.indexOf(pair)+1];
    await activate(`[data-day="${pair}"]`);await activate(`[data-day="${second}"]`);
    await shot(`${id}-${width}-dates-selected`);await route('button[type="submit"]','/booking/guests');
    await route('button[type="submit"]','/booking/details');
    await activate('button[type="submit"]');await note('empty details validation');
    await type('#guest-name','Independent Evaluator');await type('#guest-email','evaluator@example.com');await type('#guest-phone','01234567890');
    await route('button[type="submit"]','/booking/review');
    await activate('#policy-consent','Space');network=[];
    await route('button[type="submit"]','/booking/confirmation');await note('local reservation saved (keyboard only)');await shot(`${id}-${width}-confirmation`);
    await route('a[href="/getting-there"]','/getting-there');await note('arrival route reached');
    await page.goto(`http://127.0.0.1:${port}/contact`,{waitUntil:'networkidle'});
    const fields=await page.locator('main form input,main form textarea').evaluateAll(es=>es.map(e=>({id:e.id,type:e.type})));
    for(const f of fields)await type('#'+f.id,f.type==='email'?'evaluator@example.com':f.type==='textarea'?'Test message for local demonstration.':'Independent Evaluator');
    network=[];await activate('main form button[type="submit"]');await page.waitForFunction(()=>document.querySelector('.form-success')&&!document.querySelector('.form-success').hidden);
    await note('honest local contact success');await shot(`${id}-${width}-contact`);
    await page.goto(`http://127.0.0.1:${port}/experiences`,{waitUntil:'networkidle'});
    await route('a[href="/experiences/tea-garden-walk"]','/experiences/tea-garden-walk');
    await activate('[data-add-experience]');await note('experience added');
   }else{
    await route('a[href="/shop"]','/shop');
    await route('a[href="/tea/sylhet-black"]','/tea/sylhet-black');
    await activate('[data-add]');await page.waitForFunction(()=>!document.querySelector('[data-view-cart]').hidden);
    await route('[data-view-cart]','/cart');await route('a[href="/checkout"]','/checkout');
    await checkout(id,width);
    await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle'});
    await route('a[href="/subscriptions"]','/subscriptions');await route('[data-choose-plan="duo"]','/subscriptions/build');
    await activate('[name="tea"][value="sylhet-black"]','Space');await activate('[name="tea"][value="ilam-green"]','Space');
    await route('button[type="submit"]','/checkout');await checkout(id+'-subscription',width);
    await page.goto(`http://127.0.0.1:${port}/account`,{waitUntil:'networkidle'});
    await route('a[href="/account/subscription"]','/account/subscription');
    await activate('input[value="pause"]','Space');await activate('button[type="submit"]');await page.waitForFunction(()=>document.querySelector('[data-sub-state]').textContent==='Paused');
    await note('subscription paused');await page.reload({waitUntil:'networkidle'});await note('pause persisted after reload');
    await activate('input[value="resume"]','Space');await activate('button[type="submit"]');await page.waitForFunction(()=>document.querySelector('[data-sub-state]').textContent==='Active');
    // Selecting a different native radio in the same group normally requires arrows;
    // this secondary control is pointer-tested, not counted as Tab/Enter/Space-only.
    await page.locator('input[value="skip"]').click();await activate('button[type="submit"]');await page.waitForFunction(()=>document.querySelector('[data-sub-state]').textContent==='Next delivery skipped');
    await page.reload({waitUntil:'networkidle'});await note('skip persisted after reload');await shot(`${id}-${width}-subscription-saved`);
    await page.goto(`http://127.0.0.1:${port}/contact`,{waitUntil:'networkidle'});
    await type('#name','Independent Evaluator');await type('#email','evaluator@example.com');await type('#message','This is a local demonstration test message.');
    network=[];await activate('button[type="submit"]');await page.waitForFunction(()=>!document.querySelector('[data-form-message]').hidden);
    await note('contact local success');await shot(`${id}-${width}-contact`);
   }
   results.push({id,width,completed:true,log});console.log(id,width,'COMPLETE');
  }catch(e){await note('ERROR: '+e.message);await shot(`${id}-${width}-error`);results.push({id,width,completed:false,error:e.message,log});console.log(id,width,'ERROR',e.message);}
  await context.close();fs.writeFileSync(out+(process.env.FOLLOWUP?'/journey-followup-evidence.json':'/journey-evidence.json'),JSON.stringify(results,null,2));
 }
}
await browser.close();
})();
