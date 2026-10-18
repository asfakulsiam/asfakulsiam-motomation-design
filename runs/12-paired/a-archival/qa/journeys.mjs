// Lightweight manual-style Playwright QA. One browser, one context/page at a time; never the skill gate scan.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync,readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve(import.meta.dirname,'../..');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const all=[];
for(const [folder,port] of [['a-archival',4311],['b-poster',4312]]){
 if(process.argv[2]&&process.argv[2]!==folder)continue;
 const report={direction:folder,journeys:[],routes:[],issues:[],consoleErrors:[]};
 const origin=`http://localhost:${port}`,root=resolve(base,folder);
 for(const width of [375,768,1440]){
  const height=width===375?812:900,ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await ctx.newPage();page.on('pageerror',e=>report.consoleErrors.push({message:e.message,url:page.url(),stack:e.stack}));
  async function go(path){const r=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(r.status(),path==='/404'?404:200,`status ${path}`);await page.evaluate(()=>document.fonts.ready);return r;}
  async function shot(step){await page.waitForTimeout(180);await page.screenshot({path:resolve(root,`screens/${step}-${width}.png`),fullPage:true});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(overflow>1)report.issues.push(`${width} ${step}: overflow ${overflow}px`);}
  async function clickLink(href){const a=page.locator(`a[href="${href}"]:visible`).first();await a.click();await page.waitForLoadState('networkidle');}
  async function fillCheckout(){
   await page.locator('[data-checkout] #name').fill('Mira Sen');
   await page.locator('[data-checkout] #email').fill('mira@example.test');
   await page.locator('[data-checkout] #address').fill('12 Sample Lane');
   await page.locator('[data-checkout] #city').fill('Boston');
   await page.locator('[data-checkout] #postal').fill('02110');
   await page.locator('[name=consent]').check();
  }
  // One-off purchase: real navigation, filtering, add feedback, cart persistence, validation and receipt.
  await go('/');await shot('01-home');
  if(width===375){await page.locator('details[data-menu] summary').click();assert(await page.locator('details[data-menu]').evaluate(e=>e.open));await shot('02-mobile-menu');}
  await clickLink('/shop');await shot('03-shop');
  await page.locator('[name=origin]').selectOption('Bangladesh');
  await page.locator('[name=type]').selectOption('Black');
  assert.equal(await page.locator('[data-product]:visible').count(),1);
  await shot('04-shop-filtered');
  await page.locator('[name=caffeine]').selectOption('Low');
  assert(await page.locator('[data-no-results]').isVisible());await shot('05-shop-empty');
  await page.locator('[name=caffeine]').selectOption('Moderate');
  await clickLink('/tea/sylhet-black');await shot('06-tea-detail');
  await page.locator('[data-add]').click();await page.waitForTimeout(220);
  assert.match(await page.locator('[data-feedback]').textContent(),/added/);await shot('07-added-to-cart');
  await clickLink('/cart');await shot('08-cart');
  await page.locator('[data-quantity]').fill('2');await page.locator('[data-quantity]').dispatchEvent('change');
  assert.match(await page.locator('[data-total]').textContent(),/33.00/);
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-quantity]').inputValue(),'2');await shot('09-cart-quantity-saved');
  await clickLink('/checkout');await shot('10-checkout');
  await page.locator('[data-checkout] button[type=submit]').click();
  assert(await page.locator('[data-form-message]').isVisible());await shot('11-checkout-validation');
  await fillCheckout();await shot('12-checkout-ready');
  await page.locator('[data-checkout] button[type=submit]').click();await page.waitForURL('**/confirmation');await page.waitForLoadState('networkidle');
  assert(await page.locator('[data-receipt]').isVisible());assert.match(await page.locator('[data-receipt-total]').textContent(),/33.00/);await shot('13-one-off-confirmation');
  report.journeys.push(`${width}: one-off / → /shop → /tea/sylhet-black → /cart → /checkout → /confirmation PASS`);
  // Subscription journey with plan persistence and exact-count validation.
  await go('/');await shot('14-subscription-home');await clickLink('/subscriptions');await shot('15-plans');
  await page.locator('[data-choose-plan="duo"]').click();await page.waitForURL('**/subscriptions/build');await page.waitForLoadState('networkidle');await shot('16-plan-builder');
  assert(await page.locator('[data-builder-submit]').isDisabled());
  await page.locator('[name=tea][value=sylhet-black]').check();
  await page.locator('[name=tea][value=ilam-green]').check();
  assert(await page.locator('[data-builder-submit]').isEnabled());await shot('17-teas-selected');
  await page.reload({waitUntil:'networkidle'});assert(await page.locator('[name=tea][value=sylhet-black]').isChecked());
  await page.locator('[data-builder-submit]').click();await page.waitForURL('**/checkout');await page.waitForLoadState('networkidle');
  assert.match(await page.locator('[data-total]').textContent(),/24.00/);await fillCheckout();await shot('18-subscription-checkout');
  await page.locator('[data-checkout] button[type=submit]').click();await page.waitForURL('**/confirmation');await page.waitForLoadState('networkidle');
  assert.match(await page.locator('[data-receipt-total]').textContent(),/24.00/);await shot('19-subscription-confirmation');
  report.journeys.push(`${width}: monthly / → /subscriptions → /subscriptions/build → /checkout → /confirmation PASS`);
  // Pause, saved across reload; resume then skip, saved across reload.
  await go('/account');await shot('20-account');await clickLink('/account/subscription');await shot('21-management');
  await page.locator('[name=action][value=pause]').check();await shot('22-pause-selected');
  await page.locator('[data-management] button[type=submit]').click();await page.waitForTimeout(220);
  assert.match(await page.locator('[data-feedback]').textContent(),/Saved/);await shot('23-pause-saved');
  await page.reload({waitUntil:'networkidle'});assert.match(await page.locator('[data-sub-state]').textContent(),/Paused/);
  await page.locator('[name=action][value=resume]').check();await page.locator('[data-management] button[type=submit]').click();await page.waitForTimeout(220);
  await page.locator('[name=action][value=skip]').check();await shot('24-skip-selected');
  await page.locator('[data-management] button[type=submit]').click();await page.waitForTimeout(220);assert.match(await page.locator('[data-feedback]').textContent(),/skipped/);await shot('25-skip-saved');
  await page.reload({waitUntil:'networkidle'});assert.match(await page.locator('[data-sub-state]').textContent(),/skipped/);await shot('26-management-reloaded');
  report.journeys.push(`${width}: /account → /account/subscription → pause saved → reload → resume → skip saved → reload PASS`);
  // Additional states: cart empty and contact validation/local acknowledgement.
  await go('/cart');assert(await page.locator('[data-empty]').isVisible());await shot('27-empty-cart');
  await go('/contact');await page.locator('[data-contact] button[type=submit]').click();assert(await page.locator('[data-form-message]').isVisible());
  await page.locator('#name').fill('Mira Sen');await page.locator('#email').fill('mira@example.test');await page.locator('#message').fill('How would you brew this tea in a large teapot?');
  await page.locator('[data-contact] button[type=submit]').click();await page.waitForTimeout(220);assert.match(await page.locator('[data-form-message]').textContent(),/Nothing was sent/);await shot('28-contact-local-success');
  // Capture remaining routes and check heading order / broken internal targets / overflow at two requested sizes.
  if(width!==768){
   const paths=[...readFileSync(resolve(root,'sitemap.xml'),'utf8').matchAll(/<loc>[^<]*?(\/(?:[^/]*)?)<\/loc>/g)].map(m=>m[1]);
   const allPaths=['/','/shop',...['sylhet-black','assam-gold','ilam-green','darjeeling-first','nepal-white','bangladesh-green'].map(t=>'/tea/'+t),'/subscriptions','/subscriptions/build','/cart','/checkout','/confirmation','/account','/account/subscription','/estates','/brewing-guide','/shipping','/returns','/privacy','/terms','/contact'];
   for(const path of allPaths){
    await go(path);
    await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
    const checks=await page.evaluate(()=>{
     const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(e=>e.getClientRects().length).map(e=>Number(e.tagName.slice(1)));
     const skipped=headings.some((n,i)=>i&&n>headings[i-1]+1);
     const badImages=[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length;
     return {h1:document.querySelectorAll('h1').length,skipped,badImages,overflow:document.documentElement.scrollWidth-innerWidth};
    });
    report.routes.push({path,width,...checks});
    if(checks.h1!==1||checks.skipped||checks.badImages||checks.overflow>1)report.issues.push(`${width} ${path}: ${JSON.stringify(checks)}`);
    if(['/estates','/brewing-guide','/shipping','/returns','/privacy','/terms'].includes(path))await shot(`route-${path.slice(1)}`);
   }
   const r=await page.goto(origin+'/not-a-tea',{waitUntil:'networkidle'});assert.equal(r.status(),404);await shot('29-not-found');
   await page.setViewportSize({width:320,height:812});await go('/subscriptions/build');const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert(overflow<=1,`320 overflow ${overflow}`);
   await page.setViewportSize({width:720,height:450});await go('/checkout');assert((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=1);
   await page.setViewportSize({width,height});
  }
  // Reduced-motion still plus a keyboard skip-link and storage failure.
  await page.emulateMedia({reducedMotion:'reduce'});await go('/');await shot('30-reduced-motion');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('h1')).animationName),'none');
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('href')),'#main');
  await page.keyboard.press('Enter');
  await page.emulateMedia({reducedMotion:'no-preference'});
  if(width===375){
   await page.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','QuotaExceededError');};});
   await go('/tea/sylhet-black');await page.locator('[data-add]').click();await page.waitForTimeout(220);
   assert(await page.locator('[data-storage-error]').isVisible());await shot('31-storage-error');
  }
  await ctx.close();
 }
 assert.equal(report.consoleErrors.length,0,JSON.stringify(report.consoleErrors));
 writeFileSync(resolve(root,'qa/journeys.json'),JSON.stringify(report,null,2));
 const lines=[...report.journeys,`Route inspection: ${report.routes.length} route/viewport combinations.`,`Console errors: ${report.consoleErrors.length}.`,`Issues: ${report.issues.length}.`,...report.issues,report.issues.length?'FAIL lightweight frontend QA':'PASS lightweight frontend QA: all three journeys complete at 375, 768 and 1440; pause/skip persist; HTTP 404 verified.'];
 writeFileSync(resolve(root,'qa/journeys.txt'),lines.join('\n')+'\n');
 console.log(folder);console.log(lines.join('\n'));
 all.push(report);
}
await browser.close();
assert(all.every(r=>r.issues.length===0),'Review QA issues');
