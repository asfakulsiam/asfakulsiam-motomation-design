// Mechanical transcription of the real measured stamp; no invented scores.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),name=process.argv[2]||'full-gate-03';
const log=readFileSync(resolve(root,'checks',name+'.log'),'utf8');
const measured=log.match(/(?:PASS|FAIL)  stamp → (critique:.*)/)?.[1];
if(!measured)throw Error('No measured full stamp in '+name+'.log');
const comment=`/* motomation · archetype: none · mutation: none · signature: none · tier: 1 · ${measured} */`;
for(const file of ['src/styles.css','dist/styles.css']){
  const path=resolve(root,file),body=readFileSync(path,'utf8');
  writeFileSync(path,body.replace(/\/\* motomation ·[^]*?\*\//,comment));
  process.stdout.write('Measured dashboard stamp copied to '+file+'\n');
}
process.stdout.write(measured+'\n');
