// Tiny static server. No mutations, secrets or application API. Fixed benchmark port.
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {dirname,resolve,extname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.openstreetmap.org; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'");
 res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end('Method not allowed');return;}
 let status=200,file;
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost:4301').pathname);
  file=resolve(root,'.'+pathname);
  if(!file.startsWith(root+'/')&&file!==root)throw Error('outside root');
  if((await stat(file)).isDirectory())file=join(file,'index.html');
  // Artifacts, source tooling and dotfiles are never served.
  if(!mime[extname(file)]||/\.(mjs|md)$/.test(file)||pathname.split('/').some(x=>x.startsWith('.')))throw Error('not public');
  await stat(file);
 }catch{file=join(root,'404.html');status=404;}
 if(file===join(root,'404.html'))status=404;
 try{const bytes=await readFile(file);res.writeHead(status,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:bytes);}
 catch{res.writeHead(500,{'Content-Type':'text/plain'});res.end('Unable to read page');}
});
server.listen(4301,'0.0.0.0',()=>console.log('STATIC SERVER READY: http://localhost:4301'));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
