const http=require('http'),fs=require('fs'),path=require('path');
const roots=['/tmp/bench/runs/03-b2b','/tmp/bench/runs/08-travel-booking','/tmp/bench/runs/12-paired/a-archival','/tmp/bench/runs/12-paired/b-poster'];
roots.forEach((root,i)=>http.createServer((q,s)=>{
 let u=decodeURIComponent(q.url.split('?')[0]),c=path.join(root,u);
 if(fs.existsSync(c)&&fs.statSync(c).isDirectory())c=path.join(c,'index.html');
 if(!fs.existsSync(c)&&fs.existsSync(c+'.html'))c+='.html';
 if(!fs.existsSync(c)){s.statusCode=404;c=path.join(root,'404.html');}
 const ext=path.extname(c);s.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'})[ext]||'application/octet-stream');
 s.end(fs.existsSync(c)?fs.readFileSync(c):'');
}).listen(4610+i,'127.0.0.1',()=>console.log(root,4610+i)));
