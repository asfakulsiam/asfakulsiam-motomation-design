// Runs only the benchmark-permitted four rule sets, sequentially in one gate browser.
import {readFile,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const skill=resolve(root,'../../skill-226085d/scripts/gate.mjs');
const xml=await readFile(resolve(root,'sitemap.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(x=>x[1]);
urls.push('http://localhost:4301/404');
console.log('Exact command: node '+skill+' '+urls.join(' ')+' --rules --tier 1 --light');
const processChild=spawn('node',[skill,...urls,'--rules','--tier','1','--light'],{cwd:root});
let output='';
processChild.stdout.on('data',s=>{output+=s;process.stdout.write(s);});
processChild.stderr.on('data',s=>{output+=s;process.stderr.write(s);});
processChild.on('close',async code=>{const verdict=`RULES CHECK EXIT: ${code}`;output+='\n'+verdict+'\n';console.log(verdict);await writeFile(resolve(root,'checks/rules.log'),output);process.exitCode=code;});
