// Focused negative-state, navigation and palette checks. One browser, sequential pages.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gzipSync} from 'node:zlib';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),base='http://localhost:4301',logs=[];
const out=s=>{logs.push(s);console.log(s);};
const browser=await chromium.launch({headless:true,channel:'chromium',args:['--renderer-process-limit=1','--disable-dev-shm-usage']});
let assertions=0;
const check=(x,s)=>{assert.ok(x,s);assertions++;};
const date=(day)=>{const now=new Date(),d=new Date(now.getFullYear(),now.getMonth()+1,day);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
try{
 const context=await browser.newContext({viewport:{width:375,height:812},hasTouch:true,isMobile:true,acceptDownloads:true});
 const p=await context.newPage();
 await p.goto(base+'/availability',{waitUntil:'networkidle'});
 await p.locator('#checkin').fill(date(16));await p.locator('#checkout').fill(date(20));await p.locator('[type=submit]').click();
 check((await p.locator('.form-error').innerText()).includes('unavailable'),'blocked night in range is rejected');
 await p.screenshot({path:resolve(root,'screens/375-state-blocked-range.png'),fullPage:true});
 await p.locator('#checkin').fill(date(1));await p.locator('#checkout').fill(date(16));await p.locator('[type=submit]').click();
 check((await p.locator('.form-error').innerText()).includes('14 nights'),'overlong stay rejected');
 // Known local records are staged only to test conflict and removal; not used for core-journey signoff.
 await p.evaluate(({start,end})=>localStorage.setItem('srimangal-bookings-v1',JSON.stringify([{demo:true,reference:'SH-EDGE-TEST',status:'local-demo',createdAt:new Date().toISOString(),total:8400,draft:{room:'garden-veranda',checkin:start,checkout:end,guests:2,name:'Samira Rahman',email:'samira@example.net',phone:'01700000000',experience:'',notes:''}}])),{start:date(2),end:date(4)});
 await p.locator('#checkin').fill(date(2));await p.locator('#checkout').fill(date(4));await p.locator('[type=submit]').click();
 check((await p.locator('.form-error').innerText()).includes('unavailable'),'persisted booking overlap rejected');
 await p.goto(base+'/booking/confirmation',{waitUntil:'networkidle'});
 await p.locator('#remove-booking').click();check(await p.locator('.ticket-top').isVisible(),'first removal click does not delete');await p.locator('#remove-booking').click();
 check((await p.locator('#confirmation').innerText()).includes('No local reservation'),'second removal click clears booking');
 await p.goto(base+'/contact',{waitUntil:'networkidle'});await p.locator('#contact-name').fill('Samira Rahman');await p.locator('#contact-email').fill('samira@example.net');await p.locator('#contact-message').fill('Could you confirm the entrance steps?');
 let release;const held=new Promise(r=>release=r);
 await p.route('**/data/response.json',async route=>{await held;await route.fulfill({status:500,contentType:'application/json',body:'{"ok":false}'});});
 await p.locator('[type=submit]').click();
 check(await p.locator('#contact-form').getAttribute('aria-busy')==='true','contact pending aria busy');check(await p.locator('[type=submit]').isDisabled(),'pending button disabled');
 await p.evaluate(()=>scrollTo(0,0));
 await p.screenshot({path:resolve(root,'screens/375-state-contact-pending.png'),fullPage:true});release();
 await p.locator('.form-error').waitFor({state:'visible'});
 check((await p.locator('.form-error').innerText()).includes('could not finish'),'contact 500 shows recoverable error');
 check(await p.locator('#contact-message').inputValue()==='Could you confirm the entrance steps?','error retains message');
 await p.evaluate(()=>scrollTo(0,0));
 await p.screenshot({path:resolve(root,'screens/375-state-contact-error.png'),fullPage:true});
 await p.unroute('**/data/response.json');await p.locator('[type=submit]').click();await p.locator('.form-success').waitFor({state:'visible'});
 await p.evaluate(()=>scrollTo(0,0));
 await p.screenshot({path:resolve(root,'screens/375-state-contact-success.png'),fullPage:true});
 // Collect unique internal anchor targets from actual rendered pages and request them.
 const paths=['/','/rooms','/experiences','/availability','/contact','/privacy','/booking/confirmation'];
 const targets=new Set();
 for(const path of paths){await p.goto(base+path,{waitUntil:'domcontentloaded'});for(const href of await p.locator('a[href]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')).filter(x=>x.startsWith('/')&&!x.startsWith('//'))))targets.add(href.split('#')[0]||'/');}
 for(const target of targets){const response=await context.request.get(base+target);check(response.status()===200,`internal link ${target} HTTP ${response.status()}`);}
 out(`LINKS PASS: ${targets.size} unique rendered internal destinations respond 200.`);
 // Visual viewport evidence in addition to full-page journey captures.
 for(const width of [375,1440]){
  await p.setViewportSize({width,height:width===375?812:900});await p.goto(base+'/',{waitUntil:'networkidle'});
  await p.screenshot({path:resolve(root,`screens/${width}-viewport-home.png`)});
  await p.goto(base+'/rooms/garden-veranda',{waitUntil:'networkidle'});await p.screenshot({path:resolve(root,`screens/${width}-viewport-room.png`)});
 }
 // Storage denial is simulated separately and must not produce a confirmation claim.
 await context.close();
 const denied=await browser.newContext({viewport:{width:375,height:812}});
 await denied.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked for test','SecurityError');};});
 const dp=await denied.newPage();await dp.goto(base+'/contact');await dp.locator('#contact-name').fill('Samira Rahman');await dp.locator('#contact-email').fill('samira@example.net');await dp.locator('#contact-message').fill('Testing a local storage failure.');await dp.locator('[type=submit]').click();await dp.locator('.form-error').waitFor({state:'visible'});
 check((await dp.locator('.form-error').innerText()).includes('could not save'),'storage error is visible');check(await dp.locator('.form-success').isHidden(),'storage denial does not claim success');
 await denied.close();
 // Palette contrast math, not a rendered-pixel full-gate substitute.
 const lum=h=>{const c=h.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];};
 for(const [a,b]of [['203c32','f6f4ed'],['59645b','f6f4ed'],['59645b','e9ecdf'],['fffefa','203c32'],['8b3f2d','f6f4ed'],['a12726','fff4f0']]){
  const l=[lum(a),lum(b)].sort((a,b)=>b-a),ratio=(l[0]+.05)/(l[1]+.05);
  check(ratio>=4.5,'palette contrast');out(`PALETTE ${'#'+a} on ${'#'+b}: ${ratio.toFixed(2)}:1`);
 }
 const bytes=gzipSync(await readFile(resolve(root,'app.js'))).byteLength+gzipSync(await readFile(resolve(root,'app-data.js'))).byteLength;
 check(bytes<30*1024,'Tier 1 JavaScript gzip budget');out(`JS GZIP: ${bytes} bytes for app.js + app-data.js (Tier 1 limit 30720 bytes).`);
 out(`EDGE QA PASS: ${assertions} assertions, including blocked nights, long stays, overlap, removal, contact pending/error/success, storage denial and palette math.`);
}catch(e){out('EDGE QA FAIL: '+e.message);process.exitCode=1;}
finally{await browser.close();await writeFile(resolve(root,'checks/edge-qa.log'),logs.join('\n')+'\n');}
