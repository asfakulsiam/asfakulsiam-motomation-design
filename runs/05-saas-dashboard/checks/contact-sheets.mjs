import sharp from 'sharp';
import {readdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../screens');
for(const width of [375,768,1440]){
  const files=readdirSync(root).filter(f=>f.startsWith(width+'-')&&!f.includes('viewport')&&Number(f.slice(String(width).length+1,String(width).length+3))<=27).sort();
  for(let start=0;start<files.length;start+=9){
    const chunk=files.slice(start,start+9),composite=[];
    for(let j=0;j<chunk.length;j++){
      const file=chunk[j],x=(j%3)*330,y=Math.floor(j/3)*590;
      const image=await sharp(resolve(root,file)).resize({width:310}).toBuffer();
      const meta=await sharp(image).metadata(),height=Math.min(550,meta.height);
      composite.push({input:await sharp(image).extract({left:0,top:0,width:310,height}).toBuffer(),left:x+10,top:y+30});
      const label=Buffer.from(`<svg width="320" height="26"><rect width="320" height="26" fill="#ffffff"/><text x="10" y="18" font-family="sans-serif" font-size="12">${file}</text></svg>`);
      composite.push({input:label,left:x,top:y});
    }
    const out=resolve(root,`review-${width}-${1+start/9}.jpg`);
    await sharp({create:{width:990,height:Math.ceil(chunk.length/3)*590,channels:3,background:'#ddd'}}).composite(composite).jpeg({quality:86}).toFile(out);
    process.stdout.write(out+'\n');
  }
}
