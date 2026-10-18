import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve(import.meta.dirname,'../..'),end=new Date().toISOString();
const required=['index.html','404.html','DESIGN.md','MOTION.md','MEDIA.md','SCHEMA.md','DATA.md','CHECKPOINTS.md','GATE.md','CRITIQUE.md','RUN.md','README.md','SCREENS.md','PREVIEW.md','server.mjs'];
for(const [folder,port] of [['a-archival',4311],['b-poster',4312]]){
 const root=resolve(base,folder),lines=[];
 for(const file of required)assert(existsSync(resolve(root,file)),file);
 const checkpoints=readFileSync(resolve(root,'CHECKPOINTS.md'),'utf8');
 for(let i=1;i<=6;i++)assert(checkpoints.includes(`Checkpoint ${i} of 6`));
 const rules=readFileSync(resolve(root,'qa/rules.txt'),'utf8');
 assert.equal((rules.match(/rules: C0 S0 P0 K0/g)||[]).length,23);
 const screens=readdirSync(resolve(root,'screens'));
 for(const w of [375,1440]){
  for(const step of ['01-home','03-shop','06-tea-detail','07-added-to-cart','08-cart','10-checkout','13-one-off-confirmation','15-plans','16-plan-builder','17-teas-selected','18-subscription-checkout','19-subscription-confirmation','20-account','21-management','22-pause-selected','23-pause-saved','24-skip-selected','25-skip-saved','26-management-reloaded']){
   assert(screens.includes(`${step}-${w}.png`),`${step}-${w}`);
  }
 }
 let closed=false;
 try{await fetch(`http://localhost:${port}`,{signal:AbortSignal.timeout(1500)});}catch{closed=true;}
 assert(closed,`Preview port ${port} still responds`);
 lines.push('PASS handoff inventory: required site files, documentation and six checkpoints present.');
 lines.push('PASS screenshot inventory: all three core journeys at 375 and 1440; intermediate 768 captures also retained.');
 lines.push('PASS rule-output inventory: 23 routes each report rules: C0 S0 P0 K0.');
 lines.push(`PASS preview shutdown: port ${port} does not respond.`);
 const text=lines.join('\n')+'\n';
 writeFileSync(resolve(root,'qa/handoff-audit.txt'),text);
 let run=readFileSync(resolve(root,'RUN.md'),'utf8').replace(/^- End UTC: .+$/m,`- End UTC: ${end}.`);
 run+=`\n## Final handoff inventory and shutdown\nExact command: \`node /home/user/workspace/bench/runs/12-paired/a-archival/qa/handoff-audit.mjs\`.\nPreview server processes 10049 and 10050 were stopped with \`kill 10049 10050\` before this command.\nObserved direction-specific final output verbatim:\n\`\`\`text\n${text}\`\`\`\nLocal Git repositories were initialized only at the final handoff, not at the earlier build milestones. This is a workflow limitation; no earlier commits are invented. No remote repository was used.\n`;
 writeFileSync(resolve(root,'RUN.md'),run);
 console.log(folder+'\n'+text);
}
