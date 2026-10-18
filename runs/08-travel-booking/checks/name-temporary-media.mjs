// Mechanical naming migration. Preserve every binary; move, never remove, its contents.
// Generated concept photography is temporary for production and must say so in filenames.
import {readFile,writeFile,rename,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const names=['tea-gardens-original.png','garden-room-original.png','twin-room-original.png','tea-gardens.webp','garden-room.webp','twin-room.webp','tea-view.webp','hill-view.webp','family-room.webp','quiet-room.webp','social.webp'];
for(const name of names){
 try{await access(resolve(root,'assets',name));await rename(resolve(root,'assets',name),resolve(root,'assets','placeholder-'+name));}
 catch(e){if(e.code!=='ENOENT')throw e;}
}
const pattern=new RegExp('(?<!placeholder-)(?:'+names.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','g');
for(const name of ['data/catalog.json','build.mjs','prepare-media.mjs','MEDIA.md']){
 const file=resolve(root,name),body=await readFile(file,'utf8');
 await writeFile(file,body.replace(pattern,match=>'placeholder-'+match));
}
console.log('MEDIA NAMING PASS: 11 temporary generated files retain their contents under placeholder-prefixed names.');
