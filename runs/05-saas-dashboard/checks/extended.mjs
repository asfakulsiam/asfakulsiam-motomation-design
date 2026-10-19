import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),base='http://localhost:4305';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
try{
  for(const width of [320,390,720,1024]){
    const context=await browser.newContext({viewport:{width,height:900}});
    const page=await context.newPage();
    for(const route of ['/sign-in','/dashboard','/transactions','/expenses/new','/invoices','/invoices/new','/invoices/preview','/customers','/settings','/offline','/error','/empty','/missing']){
      await page.goto(base+route);
      const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth-innerWidth,violations:[...document.querySelectorAll('a,button,input,select,textarea')].filter(e=>{const b=e.getBoundingClientRect(),cs=getComputedStyle(e);return b.width&&b.height&&cs.display!=='none'&&(b.right>innerWidth+1||b.left< -1)&&!e.classList.contains('skip')}).map(e=>e.outerHTML.slice(0,180))}));
      assert.equal(overflow.page,0,`${width} ${route} page overflow`);assert.equal(overflow.violations.length,0,`${width} ${route} lost control ${overflow.violations}`);
    }
    results.push(`PASS ${width}: 13 route layouts and control bounds`);
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(base+'/dashboard');
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Skip to content');
  await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'main');
  for(let j=0;j<12;j++)await page.keyboard.press('Tab');
  const active=await page.locator(':focus').evaluate(e=>({tag:e.tagName,name:(e.getAttribute('aria-label')||e.textContent).trim(),outline:getComputedStyle(e).outlineStyle}));
  assert.notEqual(active.outline,'none');results.push('PASS keyboard skip link, main focus and 12 further Tab steps with visible focus; not a complete assistive-technology audit');
  await page.goto(base+'/customers');await page.getByRole('button',{name:'Add customer',exact:true}).click();
  assert.ok(await page.locator('dialog').evaluate(e=>e.open));
  await page.keyboard.press('Escape');assert.ok(!await page.locator('dialog').evaluate(e=>e.open));
  results.push('PASS native dialog Escape dismissal');
  await page.goto(base+'/transactions');
  const [csv]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export CSV',exact:true}).click()]);
  await csv.saveAs(resolve(root,'checks','download-transactions.csv'));results.push('PASS transaction CSV download');
  await page.getByLabel('Sort by',{exact:true}).selectOption('amount:1');
  const amounts=await page.locator('td[data-label="Amount"]').allTextContents();
  const nums=amounts.map(t=>Number(t.replace('−','-').replace(/[^\d.-]/g,'')));
  assert.deepEqual(nums,[...nums].sort((a,b)=>a-b));
  await page.getByLabel('Sort by',{exact:true}).selectOption('date:1');
  const dates=await page.locator('td[data-label="Date"]').allTextContents();
  assert.deepEqual(dates.map(Date.parse),dates.map(Date.parse).sort((a,b)=>a-b));results.push('PASS numeric amount and chronological date ordering');
  await page.getByLabel('From',{exact:true}).fill('2026-10-20');await page.getByLabel('To',{exact:true}).fill('2026-10-01');await page.getByLabel('To',{exact:true}).blur();
  await page.getByText('Start date must be on or before end date.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Clear filters',exact:true}).first().click();
  await page.getByLabel('Search transactions',{exact:true}).fill('no such merchant 88888');await page.getByRole('heading',{name:'No matching transactions',exact:true}).waitFor();results.push('PASS invalid date range and empty search state');
  await page.goto(base+'/invoices');await page.getByRole('link',{name:'INV-1044',exact:true}).click();await page.getByRole('button',{name:'Edit invoice',exact:true}).click();
  await page.getByLabel('Description',{exact:false}).fill('Edited cotton market totes');await page.getByRole('button',{name:'Save draft',exact:true}).click();
  await page.reload();await page.getByRole('link',{name:'INV-1044',exact:true}).click();await page.getByText('Edited cotton market totes',{exact:true}).waitFor();results.push('PASS existing invoice draft edit survives reload');
  await page.goto(base+'/customers');await page.getByRole('button',{name:'Edit',exact:true}).first().click();await page.getByLabel('Business or customer name').fill('Maple Retail');await page.getByRole('button',{name:'Save customer',exact:true}).click();
  await page.reload();await page.getByText('Maple Retail',{exact:true}).waitFor();results.push('PASS existing customer edit survives reload');
  await page.goto(base+'/settings');
  const [json]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export workspace',exact:true}).click()]);
  await json.saveAs(resolve(root,'checks','download-workspace.json'));results.push('PASS workspace JSON download');
  const other=await context.newPage();await other.goto(base+'/dashboard');
  await page.getByLabel('Business name').fill('Juniper General');await page.getByRole('button',{name:'Save business',exact:true}).click();
  await other.getByText('Juniper General',{exact:true}).first().waitFor();assert.equal(await other.locator('.business-monogram').textContent(),'JG');results.push('PASS second-tab business name and monogram update after storage event');
  await page.goto(base+'/expenses/new');await page.getByRole('button',{name:'Save expense',exact:true}).click();
  await page.getByLabel('Merchant').fill('Offline saved supplies');await page.getByLabel('Amount (USD)').fill('12.25');
  assert.equal(await page.getByLabel('Merchant').getAttribute('aria-invalid'),'false');assert.ok(await page.locator('#expense-form .form-message').isHidden());results.push('PASS corrected required inputs clear validation styling and summary');
  await context.setOffline(true);await page.getByRole('button',{name:'Save expense',exact:true}).click();
  await page.waitForURL('**/expenses/saved');await page.getByText('Offline saved supplies recorded').waitFor();results.push('PASS already-open workspace expense saves and navigates offline');
  await context.setOffline(false);
  const motion=await page.evaluate(()=>[...document.getAnimations()].filter(a=>a.playState==='running').length);assert.equal(motion,0);results.push('PASS reduced-motion document has no running animation');
  await page.goto(base+'/expenses/new');
  await other.evaluate(()=>{const key='ledgerly.workspace.v1',x=JSON.parse(localStorage.getItem(key));x.business.name='Concurrent shop';localStorage.setItem(key,JSON.stringify(x));});
  await page.getByText('This workspace changed in another tab. Reload before saving to avoid replacing newer changes.',{exact:true}).waitFor();assert.ok(await page.getByRole('button',{name:'Save expense',exact:true}).isDisabled());await page.reload();assert.ok(await page.getByRole('button',{name:'Save expense',exact:true}).isEnabled());results.push('PASS cross-tab active-form conflict blocks submit until reload');
  await page.evaluate(()=>{const key='ledgerly.workspace.v1',x=JSON.parse(localStorage.getItem(key));x.transactions[0].date='2026-99-99';localStorage.setItem(key,JSON.stringify(x));});
  await page.goto(base+'/dashboard');await page.getByRole('heading',{name:'Your data needs a moment',exact:true}).waitFor();results.push('PASS structurally readable but invalid-date JSON opens recovery instead of crashing');
  const corruptCopy=await page.evaluate(()=>localStorage.getItem('ledgerly.workspace.v1'));
  await page.goto(base+'/sign-in');await page.getByRole('button',{name:'Continue to demo',exact:false}).click();await page.getByText('Stored data needs recovery.',{exact:false}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('ledgerly.workspace.v1')),corruptCopy);results.push('PASS sign-in does not overwrite an unreadable workspace without recovery');
  await context.close();
  process.stdout.write(results.join('\n')+'\n');
  writeFileSync(resolve(root,'checks','extended-results.json'),JSON.stringify({pass:true,results},null,2));
}catch(e){process.stdout.write(results.join('\n')+'\n'+e.stack+'\n');writeFileSync(resolve(root,'checks','extended-results.json'),JSON.stringify({pass:false,results,error:e.stack},null,2));process.exitCode=1;}
finally{await browser.close();}
