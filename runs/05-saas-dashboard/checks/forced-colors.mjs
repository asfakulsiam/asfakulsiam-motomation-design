import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
  const context=await browser.newContext({viewport:{width:1440,height:900},forcedColors:'active'});
  const page=await context.newPage();await page.goto('http://localhost:4305/dashboard');
  const closed=await page.locator('.chart-data table').evaluate(t=>({display:getComputedStyle(t).display,cells:[...t.querySelectorAll('td')].map(e=>e.getClientRects().length)}));
  assert.equal(closed.display,'none');assert.ok(closed.cells.every(n=>n===0));
  await page.screenshot({path:resolve(root,'screens','forced-colors-closed.png'),fullPage:true});
  await page.getByText('View daily amounts',{exact:true}).click();assert.ok(await page.locator('.chart-data table').isVisible());
  const open=await page.locator('.chart-data td').evaluateAll(cells=>cells.map(e=>({text:e.textContent,color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor,visible:e.checkVisibility()})));
  assert.ok(open.every(e=>e.visible&&e.color==='rgb(0, 0, 0)'&&e.background==='rgb(255, 255, 255)'));
  assert.ok(open.some(e=>e.text==='$643.00'));
  await page.screenshot({path:resolve(root,'screens','forced-colors-open.png'),fullPage:true});
  process.stdout.write(JSON.stringify({pass:true,closed,open},null,2)+'\n');
  await context.close();
}finally{await browser.close();}
