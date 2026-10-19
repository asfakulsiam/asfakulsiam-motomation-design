// Static route entrypoints, shared browser application; no dependency installation.
import {mkdirSync,writeFileSync,copyFileSync,readdirSync,statSync,readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import vm from 'node:vm';
const root=import.meta.dirname;
const out=resolve(root,'dist');mkdirSync(out,{recursive:true});
const context={window:{}};vm.runInNewContext(readFileSync(join(root,'src/data.js'),'utf8'),context);
const seed=context.window.LedgerlySeed;
mkdirSync(join(root,'data'),{recursive:true});
for(const [name,items]of Object.entries(seed)){
  if(!['transactions','invoices','customers','profile','business','notifications'].includes(name))continue;
  writeFileSync(join(root,'data',name+'.json'),JSON.stringify({demo:true,entity:name,items:(Array.isArray(items)?items:[items]).map(item=>({...item,demo:true}))},null,2)+'\n');
}
writeFileSync(join(root,'data/schema.json'),JSON.stringify({
  $schema:'https://json-schema.org/draft/2020-12/schema',title:'Ledgerly demo data envelope',type:'object',required:['demo','entity','items'],
  properties:{demo:{const:true},entity:{enum:['transactions','invoices','customers','profile','business','notifications']},items:{type:'array',items:{type:'object',required:['demo'],properties:{demo:{const:true}}}}},
  $defs:{
    Transaction:{type:'object',required:['id','name','date','category','amount','type','method','demo'],properties:{id:{type:'string'},name:{type:'string'},date:{type:'string',format:'date'},category:{type:'string'},amount:{type:'integer',minimum:1},type:{enum:['income','expense']},method:{type:'string'},note:{type:'string'},demo:{const:true}}},
    Customer:{type:'object',required:['id','name','email','demo'],properties:{id:{type:'string'},name:{type:'string'},email:{type:'string',format:'email'},address:{type:'string'},demo:{const:true}}},
    Invoice:{type:'object',required:['id','number','customerId','lines','issued','due','status','demo'],properties:{id:{type:'string'},number:{type:'string'},customerId:{type:'string'},lines:{type:'array',minItems:1,items:{$ref:'#/$defs/Line'}},issued:{type:'string',format:'date'},due:{type:'string',format:'date'},tax:{type:'number',minimum:0,maximum:100},note:{type:'string'},status:{enum:['draft','sent','paid']},demo:{const:true}}},
    Line:{type:'object',required:['description','qty','price'],properties:{description:{type:'string'},qty:{type:'integer',minimum:1},price:{type:'integer',minimum:1}}},
    Profile:{type:'object',properties:{name:{type:'string'},email:{type:'string'},demo:{const:true}}},
    Business:{type:'object',properties:{name:{type:'string'},email:{type:'string'},address:{type:'string'},currency:{const:'USD'},demo:{const:true}}},
    Notifications:{type:'object',properties:{invoice:{type:'boolean'},weekly:{type:'boolean'},demo:{const:true}}}
  }
},null,2)+'\n');
const pages=[
  ['/','Overview'],['/sign-in','Sign in'],['/dashboard','Overview'],
  ['/transactions','Transactions'],['/transactions/detail','Transaction detail'],
  ['/expenses/new','Add expense'],['/expenses/saved','Expense saved'],
  ['/invoices','Invoices'],['/invoices/new','New invoice'],['/invoices/preview','Invoice preview'],
  ['/invoices/sent','Invoice marked sent'],['/customers','Customers'],['/settings','Settings'],
  ['/empty','New account'],['/error','Storage recovery'],['/offline','Offline guide']
];
function html(route,title,error=false){
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · Ledgerly</title>
<meta name="description" content="${title} in Ledgerly, a local small-business finance workspace. Demo data is saved only in this browser.">
${error?'':`<link rel="canonical" href="${route}">`}
<meta property="og:title" content="${title} · Ledgerly"><meta property="og:image" content="/assets/share.svg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
${['/expenses/saved','/invoices/preview','/invoices/sent','/transactions/detail'].includes(route)?'<meta name="motomation:entry" content="flow">':''}
${['/expenses/saved','/invoices/sent'].includes(route)?'<meta name="robots" content="noindex">':''}
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="preload" href="/assets/dm-sans-regular.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="/styles.css"><script src="/data.js" defer></script><script src="/app.js" defer></script>
</head><body><a class="skip" href="#main">Skip to content</a><div id="app"></div><noscript><main><h1>Ledgerly needs JavaScript</h1><p>Enable JavaScript to use this local finance workspace. No data is sent to a server.</p></main></noscript></body></html>`;
}
for(const [route,title] of pages){const dir=route==='/'?out:join(out,route);mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.html'),html(route,title));}
writeFileSync(join(out,'404.html'),html('/404','Page not found',true));
for(const name of ['app.js','data.js','styles.css'])copyFileSync(join(root,'src',name),join(out,name));
function copyDir(from,to){mkdirSync(to,{recursive:true});for(const item of readdirSync(from)){const a=join(from,item),b=join(to,item);if(statSync(a).isDirectory())copyDir(a,b);else copyFileSync(a,b);}}
copyDir(join(root,'assets'),join(out,'assets'));
writeFileSync(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(([r])=>r!=='/').map(([r])=>`<url><loc>http://localhost:4305${r}</loc></url>`).join('')}</urlset>`);
writeFileSync(join(out,'robots.txt'),'User-agent: *\nDisallow:\nSitemap: http://localhost:4305/sitemap.xml\n');
process.stdout.write(`Built ${pages.length} entry routes plus designed 404 in ${out}\n`);
