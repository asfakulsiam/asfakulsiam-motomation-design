// Lightweight initial visual review, one Chromium instance and one page at a time.
import {chromium} from 'playwright';
import {resolve} from 'node:path';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
for(const [folder,port] of [['a-archival',4311],['b-poster',4312]]){
 for(const width of [1440,375]){
  const page=await browser.newPage({viewport:{width,height:width===375?812:900},deviceScaleFactor:1});
  await page.goto(`http://localhost:${port}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:resolve(import.meta.dirname,`../../${folder}/screens/home-${width}.png`),fullPage:true});
  console.log(`${folder} ${width}: title=${await page.title()}, overflow=${await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)}`);
  await page.close();
 }
}
await browser.close();
