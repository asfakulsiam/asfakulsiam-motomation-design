import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
const root=import.meta.dirname+'/..';
mkdirSync(root+'/screens',{recursive:true});
const b=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
for(const width of [1440,375]){const p=await b.newPage({viewport:{width,height:900}});await p.goto('http://localhost:4305/dashboard');await p.screenshot({path:root+`/screens/initial-${width}-dashboard.png`,fullPage:true});process.stdout.write(`${width}: ${await p.title()}\n`);await p.close();}
await b.close();
