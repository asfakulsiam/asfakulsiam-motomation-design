import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve(import.meta.dirname,'../..'),skill=resolve(base,'../../skill-v301');
const manifest=JSON.parse(readFileSync(resolve(base,'a-archival/qa/check-manifest.json'),'utf8'));
function run(args,output){
 const start=new Date().toISOString(),command=['node',...args].join(' ');
 const r=spawnSync('node',args,{encoding:'utf8',maxBuffer:16*1024*1024,timeout:300000});
 const text=(r.stdout||'')+(r.stderr||'');writeFileSync(output,text);
 const finalLines=text.trimEnd().split('\n').slice(-5);
 manifest.push({command,start,end:new Date().toISOString(),exitCode:r.status,output,finalLines});
 for(const name of ['a-archival','b-poster'])writeFileSync(resolve(base,name,'qa/check-manifest.json'),JSON.stringify(manifest,null,2));
 console.log(command+'\n'+finalLines.join('\n'));
 if(r.status!==0)throw Error('Check failed; inspect preserved output.');
 return text;
}
if(!process.argv.includes('--remaining'))run([resolve(base,'a-archival/qa/journeys.mjs'),'b-poster'],resolve(base,'b-poster/qa/journeys-run-final.txt'));
run([resolve(base,'a-archival/qa/extra-states.mjs')],resolve(base,'a-archival/qa/extra-states-run.txt'));
for(const name of ['a-archival','b-poster']){
 const root=resolve(base,name);
 const ratios=name==='a-archival'?[['#263d32','#f4f0e6'],['#526052','#e9e5d8'],['#f4f0e6','#294d3d'],['#8a422c','#f4f0e6']]:[['#18241e','#f5dd4a'],['#18241e','#a8d84f'],['#18241e','#ff8259'],['#18241e','#c3b5ed'],['#526052','#ddd9c7']];
 let out='';
 for(const pair of ratios)out+=run([resolve(skill,'scripts/contrast.mjs'),...pair],resolve(root,`qa/contrast-${pair[0].slice(1)}-${pair[1].slice(1)}.txt`))+'\n';
 writeFileSync(resolve(root,'qa/contrast.txt'),out);
 run([resolve(skill,'scripts/completeness.mjs'),root],resolve(root,'qa/completeness.txt'));
 run([resolve(skill,'scripts/realism.mjs'),root],resolve(root,'qa/realism.txt'));
 const urls=[...readFileSync(resolve(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 urls.push(`http://localhost:${name==='a-archival'?4311:4312}/404`);
 run([resolve(skill,'scripts/gate.mjs'),...urls,'--rules'],resolve(root,'qa/rules.txt'));
}
console.log('PASS resumed permitted checks.');
