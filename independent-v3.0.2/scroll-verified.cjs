const {chromium}=require('/home/user/workspace/repo/node_modules/playwright');
const fs=require('fs'),sharp=require('sharp'),out='/home/user/workspace/v302-eval';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),log=[];
 for(const [i,id] of ['03-b2b','08-travel-booking','12a-archival','12b-poster'].entries()){
  await page.goto(`http://127.0.0.1:${4610+i}/`,{waitUntil:'networkidle'});
  const h=await page.evaluate(()=>document.scrollingElement.scrollHeight-innerHeight),positions=[],frames=[];
  for(let n=0;n<8;n++){
   const y=Math.round(h*n/7);
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);
   await page.waitForFunction(y=>Math.abs(scrollY-y)<2,y);
   positions.push({requested:y,actual:await page.evaluate(()=>scrollY)});
   const file=`${out}/shots/${id}-verified-scroll-${n}.jpg`;
   await page.screenshot({path:file,type:'jpeg',quality:70});
   frames.push(await sharp(file).resize(360,225).toBuffer());
  }
  await sharp({create:{width:720,height:900,channels:3,background:'#fff'}}).composite(frames.map((input,n)=>({input,left:n%2*360,top:Math.floor(n/2)*225}))).jpeg({quality:70}).toFile(`${out}/shots/${id}-verified-scroll-strip.jpg`);
  log.push({id,positions});
 }
 await browser.close();fs.writeFileSync(out+'/verified-scroll-evidence.json',JSON.stringify(log,null,2));
})();
