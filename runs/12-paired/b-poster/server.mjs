// Tiny static preview server. Unknown routes always return 404.html with HTTP 404.
import {createServer} from 'node:http';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
const root=import.meta.dirname,port=4312;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.json':'application/json','.xml':'application/xml','.txt':'text/plain'};
createServer((req,res)=>{
 const headers={'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
 let p;try{p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{p='/missing';}
 let f=resolve(root,'.'+p);if(!f.startsWith(root+sep)&&f!==root)f='';
 if(f&&existsSync(f)&&statSync(f).isDirectory())f=resolve(f,'index.html');
 if(f&&!existsSync(f)&&!extname(f))f+='.html';
 let status=200;
 if(!f||!existsSync(f)||!statSync(f).isFile()){f=resolve(root,'404.html');status=404;}
 if(p==='/404'||p==='/404.html')status=404;
 res.writeHead(status,{...headers,'Content-Type':mime[extname(f)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(readFileSync(f));
}).listen(port,'0.0.0.0',()=>console.log(`Leaf & Ledger preview http://localhost:${port}`));
