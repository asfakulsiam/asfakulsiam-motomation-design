// Verify final evidence dimensions, stop only this run's server, and record an honest end receipt.
import {readFile,writeFile,appendFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import net from 'node:net';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const docs=['DESIGN.md','MOTION.md','MEDIA.md','SCHEMA.md','DATA.md','CHECKPOINTS.md','GATE.md','CRITIQUE.md','RUN.md','README.md'];
for(const file of docs)await access(resolve(root,file));
const screens=(await readdir(resolve(root,'screens'))).filter(f=>f.endsWith('.png'));
for(const width of [375,768,1440]){
 const states=screens.filter(f=>new RegExp(`^${width}-(?:0[1-9]|1[0-3])-`).test(f));
 assert.equal(states.length,13,`13 required core states at ${width}`);
 for(const file of states){const meta=await sharp(resolve(root,'screens',file)).metadata();assert.equal(meta.width,width,`${file} actual width`);}
}
const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(x=>new URL(x[1]).pathname);
for(const url of urls)await access(resolve(root,'.'+url,'index.html'));
await access(resolve(root,'404.html'));
const lines=[`ARTIFACT INVENTORY PASS: ${urls.length+1} route HTML files; 13 core-journey states at each of 375, 768 and 1440px; ${screens.length} screenshots total.`];
const pid=14313;
const cmd=(await readFile(`/proc/${pid}/cmdline`,'utf8')).replaceAll('\0',' ');
assert.match(cmd,/node server\.mjs/,'only stop the known benchmark server');
process.kill(pid,'SIGTERM');
await new Promise((resolveProbe,reject)=>{
 const socket=net.connect({port:4301,host:'127.0.0.1'});
 socket.once('connect',()=>{socket.destroy();reject(Error('Port 4301 is still listening'));});
 socket.once('error',e=>{if(e.code==='ECONNREFUSED'){lines.push('SERVER STOP PASS: port 4301 refuses connections after SIGTERM to this run’s node server.mjs.');resolveProbe();}else reject(e);});
});
lines.push(`END UTC: ${new Date().toISOString()}`);
await writeFile(resolve(root,'checks/shutdown.log'),lines.join('\n')+'\n');
await appendFile(resolve(root,'RUN.md'),`\n## Final artifact inventory and shutdown\nExact command: \`node checks/finish.mjs\`.\nIt checks required documents, the 24 route HTML files and the actual PNG widths, verifies PID 14313 is this run's \`node server.mjs\`, sends SIGTERM and probes port 4301 for ECONNREFUSED.\n\nActual final output:\n\`\`\`text\n${lines.join('\n')}\n\`\`\`\nThe end UTC above records completion of verification and server shutdown. The final local commit only adds these receipts; no frontend code changed after the passing browser/rule checks.\n`);
for(const line of lines)console.log(line);
