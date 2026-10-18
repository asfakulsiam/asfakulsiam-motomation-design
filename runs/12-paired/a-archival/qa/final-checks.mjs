// Runs only the permitted checks, serializing all browser work on this shared two-CPU machine.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve(import.meta.dirname,'../..'),skill=resolve(base,'../../skill-v301'),manifest=[];
function run(args,output,allowed=[0]){
 const command=['node',...args].join(' '),start=new Date().toISOString();
 console.log(command);
 const result=spawnSync('node',args,{encoding:'utf8',maxBuffer:16*1024*1024,timeout:900000});
 const text=(result.stdout||'')+(result.stderr||'');writeFileSync(output,text);
 const lines=text.trimEnd().split('\n');console.log(lines.slice(-5).join('\n'));
 manifest.push({command,start,end:new Date().toISOString(),exitCode:result.status,output,finalLines:lines.slice(-5)});
 if(!allowed.includes(result.status)){writeFileSync(resolve(base,'a-archival/qa/check-manifest.json'),JSON.stringify(manifest,null,2));throw Error(`Check failed: ${command}`);}
 return text;
}
for(const name of ['a-archival','b-poster']){
 const root=resolve(base,name);
 run([resolve(skill,'scripts/completeness.mjs'),root],resolve(root,'qa/completeness.txt'));
 run([resolve(skill,'scripts/realism.mjs'),root],resolve(root,'qa/realism.txt'));
 const urls=[...readFileSync(resolve(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);urls.push(`http://localhost:${name==='a-archival'?4311:4312}/404`);
 const text=run([resolve(skill,'scripts/gate.mjs'),...urls,'--rules'],resolve(root,'qa/rules.txt'));
 if(!/^  rules: C0 S0 P0 K0  \(rule sets only; no stamp\)$/m.test(text)||/rules: [CSPK][1-9]|rules:.*[CSPK][1-9]/.test(text))throw Error('Nonzero rule count');
}
run([resolve(skill,'scripts/pair.mjs'),resolve(base,'a-archival'),resolve(base,'b-poster'),'--max','30','--out',resolve(base,'a-archival/qa/pair.json')],resolve(base,'a-archival/qa/pair.txt'));
copyFileSync(resolve(base,'a-archival/qa/pair.txt'),resolve(base,'b-poster/qa/pair.txt'));
copyFileSync(resolve(base,'a-archival/qa/pair.json'),resolve(base,'b-poster/qa/pair.json'));
for(const name of ['a-archival','b-poster'])run([resolve(base,'a-archival/qa/journeys.mjs'),name],resolve(base,`${name}/qa/journeys-run.txt`));
for(const name of ['a-archival','b-poster']){
 const root=resolve(base,name);
 const ratios=name==='a-archival'?[['#263d32','#f4f0e6'],['#526052','#e9e5d8'],['#f4f0e6','#294d3d'],['#8a422c','#f4f0e6']]:[['#18241e','#f5dd4a'],['#18241e','#a8d84f'],['#18241e','#ff8259'],['#18241e','#c3b5ed'],['#526052','#ddd9c7']];
 let out='';
 for(const [ink,ground] of ratios)out+=run([resolve(skill,'scripts/contrast.mjs'),ink,ground],resolve(root,`qa/contrast-${ink.slice(1)}-${ground.slice(1)}.txt`))+'\n';
 writeFileSync(resolve(root,'qa/contrast.txt'),out);
}
const text=JSON.stringify(manifest,null,2);
for(const name of ['a-archival','b-poster'])writeFileSync(resolve(base,`${name}/qa/check-manifest.json`),text);
console.log('PASS final permitted check batch.');
