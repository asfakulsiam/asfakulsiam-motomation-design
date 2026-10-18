// Lightweight browser QA: one Chromium process, sequential contexts, no full gate scan.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),base='http://localhost:4301';
const widths=process.argv.includes('--smoke')?[1440,375]:[375,768,1440];
const browser=await chromium.launch({headless:true,channel:'chromium',args:['--disable-dev-shm-usage','--renderer-process-limit=1']});
const log=[],errors=[],checks={routes:0,journeys:0,screens:0,assertions:0};
const note=s=>{log.push(s);console.log(s);};
const check=(condition,message)=>{assert.ok(condition,message);checks.assertions++;};
const now=new Date(),month=new Date(now.getFullYear(),now.getMonth()+1,1),iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const arrive=iso(new Date(month.getFullYear(),month.getMonth(),2)),depart=iso(new Date(month.getFullYear(),month.getMonth(),4));
const fmt=s=>new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const pageErrors=[];
try{
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:width===375?812:900},isMobile:width===375,hasTouch:width===375,acceptDownloads:true});
  const page=await context.newPage();
  page.on('pageerror',e=>pageErrors.push(`${width}: ${e.message}`));
  const goto=async path=>{const response=await page.goto(base+path,{waitUntil:'networkidle'});return response;};
  const capture=async name=>{
   await page.evaluate(()=>document.fonts.ready);
   for(const image of await page.locator('img:visible').all())await image.scrollIntoViewIfNeeded();
   await page.evaluate(()=>scrollTo(0,0));
   await page.waitForFunction(()=>[...document.images].filter(x=>x.getClientRects().length).every(x=>x.complete),{timeout:5000});
   await page.screenshot({path:resolve(root,`screens/${width}-${name}.png`),fullPage:true});
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} overflow on ${name}`);
   check(await page.locator('h1').count()===1,`${name} has one h1`);
   check(await page.locator('img:visible').evaluateAll(imgs=>imgs.every(x=>x.complete&&x.naturalWidth>0)),`${name} images load`);
   checks.screens++;
  };
  await goto('/');await capture('01-home');
  if(process.argv.includes('--smoke')){await context.close();continue;}
  // Responsive menu and a normal real-link start.
  if(width<=800){await page.locator('.mobile-menu summary').click();check(await page.locator('.mobile-menu').getAttribute('open')!==null,'mobile menu opens');await page.locator('.mobile-menu a[href="/rooms"]').click();}
  else await page.locator('.desktop-nav a[href="/rooms"]').click();
  await page.waitForURL('**/rooms');
  await capture('02-rooms');
  await page.locator('#room-filter').selectOption('4');
  check(await page.locator('.room-card:visible').count()===1,'capacity filter one family room');
  await page.locator('#room-filter').selectOption('0');
  check(await page.locator('.room-card:visible').count()===6,'filter reset six rooms');
  await page.locator('.room-card h2 a').first().click();await page.waitForURL('**/rooms/garden-veranda');
  await capture('03-room-detail');
  await page.locator('[data-book-room]').click();await page.waitForURL('**/booking/dates');
  // Invalid date range before the happy path.
  await page.locator('#checkin').fill(depart);await page.locator('#checkout').fill(arrive);await page.locator('#dates-form [type=submit]').click();
  check(await page.locator('#date-error').isVisible(),'invalid date range error visible');
  await page.locator('#prev-month').click();await page.locator('#next-month').click();
  await page.locator(`[data-day="${arrive}"]`).click();
  await page.locator(`[data-day="${depart}"]`).click();
  check(await page.locator('#checkin').inputValue()===arrive,'calendar sets arrival');
  check(await page.locator('#checkout').inputValue()===depart,'calendar sets departure');
  await capture('04-dates-selected');
  await page.locator('#dates-form [type=submit]').click();await page.waitForURL('**/booking/guests');
  await page.locator('#guest-count').selectOption('4');
  check(await page.locator('.form-error').isVisible(),'capacity error');
  await page.locator('#guest-count').selectOption('2');
  await page.locator('[name=experience][value=tea-garden-walk]').check();
  await capture('05-guests');
  await page.locator('#guests-form [type=submit]').click();await page.waitForURL('**/booking/details');
  await page.locator('#details-form [type=submit]').click();check(await page.locator('.form-error').isVisible(),'required guest name error');
  await page.locator('#guest-name').fill('Samira Rahman');
  await page.locator('#guest-email').fill('samira@example.net');
  await page.locator('#guest-phone').fill('01700000000');
  await page.locator('#guest-notes').fill('Vegetarian breakfast, please.');
  await page.reload({waitUntil:'networkidle'});check(await page.locator('#guest-name').inputValue()==='Samira Rahman','draft survives reload');
  await capture('06-guest-details');
  // Slow response proves pending; 500 proves error without losing data.
  await page.route('**/data/response.json',async route=>{await new Promise(r=>setTimeout(r,350));await route.fulfill({status:500,contentType:'application/json',body:'{"ok":false}'});});
  await page.locator('#details-form [type=submit]').click();
  check(await page.locator('#details-form').getAttribute('aria-busy')==='true','details pending');
  await page.locator('.form-error').waitFor({state:'visible'});
  check((await page.locator('.form-error').innerText()).includes('could not finish'),'recoverable network error');
  await page.unroute('**/data/response.json');
  await page.locator('#details-form [type=submit]').click();await page.waitForURL('**/booking/review');
  await page.locator('#review-form [type=submit]').click();check(await page.locator('.form-error').isVisible(),'policy consent error');
  check(await page.locator('[name=payment][value=card]').isDisabled(),'payment interface disabled honestly');
  await page.locator('#policy-consent').check();
  await capture('07-review');
  check((await page.locator('.review-total').innerText()).includes('9,600'),'two nights 8400 plus two experiences 1200 total');
  await page.locator('#review-form [type=submit]').click();await page.waitForURL('**/booking/confirmation');
  check(await page.getByText('This is not a real reservation.',{exact:true}).isVisible(),'clear local-only confirmation');
  await capture('08-confirmation');
  await page.reload({waitUntil:'networkidle'});check(await page.locator('.ticket-top strong').isVisible(),'reservation survives reload');
  const downloaded=page.waitForEvent('download');await page.locator('#download-stay').click();check((await downloaded).suggestedFilename()==='srimangal-hills-stay.txt','stay download');
  const second=await context.newPage();await second.goto(base+'/booking/confirmation',{waitUntil:'networkidle'});check(await second.locator('.ticket-top strong').isVisible(),'two tabs see local booking');await second.close();
  await page.locator('.confirmation-actions a').click();await page.waitForURL('**/getting-there');
  await capture('09-getting-there');
  check(await page.locator('iframe').count()===0,'map opt-in saves requests');
  const arrivalDownload=page.waitForEvent('download');await page.locator('#download-arrival').click();check((await arrivalDownload).suggestedFilename()==='srimangal-arrival-notes.txt','arrival download');
  // Verify click-to-load interface without making map tile availability a pass claim.
  await page.locator('#load-map').click();check(await page.locator('iframe[title*="town"]').count()===1,'map iframe inserted');
  await page.goBack({waitUntil:'networkidle'});check(await page.locator('.ticket-top strong').isVisible(),'back navigation');
  await page.goForward({waitUntil:'networkidle'});check(await page.locator('h1').innerText()==='Find your way to the green.','forward navigation');
  checks.journeys+=2;
  // Core experience journey from home in a fresh session to avoid an already booked draft.
  await context.close();
  const exContext=await browser.newContext({viewport:{width,height:width===375?812:900},isMobile:width===375,hasTouch:width===375});
  const ex=await exContext.newPage();ex.on('pageerror',e=>pageErrors.push(`${width} experience: ${e.message}`));
  await ex.goto(base+'/',{waitUntil:'networkidle'});
  await ex.locator('#around a').click();await ex.waitForURL('**/experiences');
  await ex.screenshot({path:resolve(root,`screens/${width}-10-experiences.png`),fullPage:true});checks.screens++;
  await ex.locator('.experience-card h2 a').first().click();await ex.waitForURL('**/experiences/tea-garden-walk');
  await ex.screenshot({path:resolve(root,`screens/${width}-11-experience-detail.png`),fullPage:true});checks.screens++;
  await ex.locator('[data-add-experience]').click();check(await ex.locator('[data-add-experience]').getAttribute('aria-pressed')==='true','experience added');
  await ex.screenshot({path:resolve(root,`screens/${width}-12-experience-added.png`),fullPage:true});checks.screens++;
  await ex.locator('[data-add-experience]').click();check(await ex.locator('[data-add-experience]').getAttribute('aria-pressed')==='false','experience removal reversible');
  await ex.locator('[data-add-experience]').click();
  await ex.locator('#continue-stay').click();await ex.waitForURL('**/booking/dates');
  check((await ex.locator('#stay-summary').innerText()).includes('A morning in the tea gardens'),'experience persists into dates');
  await ex.screenshot({path:resolve(root,`screens/${width}-13-dates-with-experience.png`),fullPage:true});checks.screens++;
  checks.journeys++;
  await exContext.close();
  note(`JOURNEYS ${width}px: PASS room booking, experience addition, confirmation to arrival.`);
 }
 if(!process.argv.includes('--smoke')){
  // One compact traversal of all public static routes at mobile width.
  const ctx=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true});
  const page=await ctx.newPage();page.on('pageerror',e=>pageErrors.push(`routes: ${e.message}`));
  const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');
  const paths=[...sitemap.matchAll(/<loc>http:\/\/localhost:4301([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
  for(const path of paths){
   const res=await page.goto(base+path,{waitUntil:'networkidle'});check(res.status()===200,path+' returns 200');
   check(await page.locator('h1').count()===1,path+' one h1');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path+' mobile overflow');
   checks.routes++;
  }
  const missing=await page.goto(base+'/this-page-does-not-exist',{waitUntil:'networkidle'});check(missing.status()===404,'unknown route HTTP 404');check((await page.locator('h1').innerText()).includes('wandered off'),'designed 404');checks.routes++;
  await page.screenshot({path:resolve(root,'screens/375-14-not-found.png'),fullPage:true});checks.screens++;
  // Contact validation, response failure and local success.
  await page.goto(base+'/contact',{waitUntil:'networkidle'});await page.locator('#contact-form [type=submit]').click();check(await page.locator('.form-error').isVisible(),'contact validation');
  await page.locator('#contact-name').fill('Samira Rahman');await page.locator('#contact-email').fill('samira@example.net');await page.locator('#contact-message').fill('Does the garden room have steps?');
  await page.locator('#contact-form [type=submit]').click();await page.locator('.form-success').waitFor({state:'visible'});check((await page.locator('.form-success').innerText()).includes('has not been sent'),'contact not-sent notice');
  await page.goto(base+'/booking/confirmation',{waitUntil:'networkidle'});check((await page.locator('#confirmation').innerText()).includes('No local reservation'),'empty confirmation');
  // Keyboard and reduced-motion/reflow checks, without an exhaustive accessibility claim.
  await page.goto(base+'/',{waitUntil:'networkidle'});await page.keyboard.press('Tab');check(await page.evaluate(()=>document.activeElement.classList.contains('skip')),'skip link first keyboard focus');await page.keyboard.press('Enter');check(await page.evaluate(()=>location.hash==='#main'),'skip activates main');
  for(const width of [320,720]){await page.setViewportSize({width,height:450});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+'px home reflow');}
  await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:375,height:812});check((await page.locator('.hero h1').innerText()).includes('quiet'),'reduced motion content visible');
  await page.goto(base+'/privacy',{waitUntil:'networkidle'});await page.locator('#clear-data').click();await page.locator('#clear-data').click();check((await page.locator('#clear-status').innerText()).includes('has been cleared'),'privacy clear local data');
  await ctx.close();
 }
 check(pageErrors.length===0,'no uncaught browser errors: '+pageErrors.join('; '));
 note(`QA PASS: ${checks.journeys} core-journey completions; ${checks.routes} route responses; ${checks.screens} screenshots; ${checks.assertions} assertions; ${pageErrors.length} uncaught browser errors.`);
}catch(e){errors.push(e.stack);note('QA FAIL: '+e.message);process.exitCode=1;}
finally{
 await browser.close();
 await mkdir(resolve(root,'checks'),{recursive:true});
 await writeFile(resolve(root,process.argv.includes('--smoke')?'checks/smoke.log':'checks/qa.log'),log.join('\n')+'\n'+(errors.length?errors.join('\n')+'\n':''));
 await writeFile(resolve(root,'checks/qa-results.json'),JSON.stringify({checks,errors,pageErrors},null,2));
}
