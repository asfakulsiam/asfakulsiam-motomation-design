import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const assets=resolve(import.meta.dirname,'../assets');mkdirSync(assets,{recursive:true});
const files=[
['dm-sans-regular.ttf','https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTg.ttf'],
['dm-sans-bold.ttf','https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARZthTg.ttf'],
['OFL.txt','https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt']
];
for(const [name,url]of files){const response=await fetch(url);if(!response.ok)throw Error(`${response.status}: ${url}`);const bytes=Buffer.from(await response.arrayBuffer());writeFileSync(resolve(assets,name),bytes);process.stdout.write(`${name}: ${bytes.length} bytes from ${url}\n`);}
