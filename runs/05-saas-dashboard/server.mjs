// Local static host. No finance data, credentials or mutations leave the browser.
import http from 'node:http';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname} from 'node:path';
const root=resolve(import.meta.dirname,'dist');
const port=Number(process.env.PORT||4305);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
http.createServer((req,res)=>{
  let name;
  try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end('Invalid path');}
  let file=resolve(root,'.'+name);
  if(!file.startsWith(root+'/')&&file!==root){res.writeHead(403);return res.end('Forbidden');}
  if(existsSync(file)&&statSync(file).isDirectory()) file=resolve(file,'index.html');
  const status=existsSync(file)?200:404;
  if(status===404)file=resolve(root,'404.html');
  res.writeHead(status,{
    'Content-Type':types[extname(file)]||'application/octet-stream',
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    'Cache-Control':'no-cache'
  });
  res.end(readFileSync(file));
}).listen(port,'0.0.0.0',()=>process.stdout.write(`Ledgerly local preview http://localhost:${port}\n`));
