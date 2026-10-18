// Build WebP derivatives from the generated originals. Preinstalled sharp, no install.
import sharp from 'sharp';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const assets=join(dirname(fileURLToPath(import.meta.url)),'assets');
const jobs=[
 ['placeholder-tea-gardens-original.png','placeholder-tea-gardens.webp',1200,850,64,'centre'],
 ['placeholder-garden-room-original.png','placeholder-garden-room.webp',1200,900,73,'centre'],
 ['placeholder-twin-room-original.png','placeholder-twin-room.webp',1200,900,73,'centre'],
 ['placeholder-tea-gardens-original.png','placeholder-tea-view.webp',1000,850,72,'east'],
 ['placeholder-tea-gardens-original.png','placeholder-hill-view.webp',1000,850,72,'west'],
 ['placeholder-twin-room-original.png','placeholder-family-room.webp',1100,850,73,'centre'],
 ['placeholder-garden-room-original.png','placeholder-quiet-room.webp',850,850,72,'east'],
 ['placeholder-tea-gardens-original.png','placeholder-social.webp',1200,630,72,'centre']
];
for(const [src,out,w,h,quality,position]of jobs){const info=await sharp(join(assets,src)).resize(w,h,{fit:'cover',position}).webp({quality}).toFile(join(assets,out));console.log(`${out}: ${info.width}x${info.height}, ${info.size} bytes`);}
