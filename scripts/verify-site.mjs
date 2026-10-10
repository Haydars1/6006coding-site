import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const ROOT='dist';
const pages=['index.html','fahrzeug/index.html','reparatur-wartung/index.html','fehlercodes/index.html','technik/index.html'];
for(const f of pages){
 assert(fs.existsSync(path.join(ROOT,f)),`Missing required page: ${f}`);
 const html=fs.readFileSync(path.join(ROOT,f),'utf8');
 assert(html.includes('6006'),`Missing branding: ${f}`);
}
const codeFile=path.join(ROOT,'assets/6006-dtc-catalog.json');
const db=JSON.parse(fs.readFileSync(codeFile,'utf8'));
assert(Array.isArray(db.defs) && db.defs.length>=18805,'DTC database has missing definitions');
const codes=new Set(db.defs.map(r=>r[0]));
for(const c of ['P0299','P2002','P0401','P204F','C0035','U0100'])assert(codes.has(c),`Missing DTC ${c}`);
const categories=['turbo','dpf','adblue','egr','fuel','transmission','brake','network','airbag','cooling','oil','steering','ignition','sensor','catalyst','body','generic'];
for(const cat of categories)assert(fs.existsSync(path.join(ROOT,'assets/realparts',cat+'.webp')),`Missing part illustration ${cat}`);
const javascript=['assets/6006-dtc-catalog.js','assets/6006-ui.js','assets/6006-language-bridge.js'];
for(const f of javascript){
 assert(fs.existsSync(path.join(ROOT,f)),`Missing JS ${f}`);
 execFileSync(process.execPath,['--check',path.join(ROOT,f)],{stdio:'pipe'});
}
let checked=0;
for(const page of pages){
 const text=fs.readFileSync(path.join(ROOT,page),'utf8');
 for(const m of text.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
   const url=m[1];
   if(url.startsWith('//') || /^(https?:|mailto:|tel:|data:|blob:|#|javascript:)/i.test(url))continue;
   let target=url.split('#')[0].split('?')[0];
   if(!target)continue;
   const resolved=target.startsWith('/') ? path.join(ROOT,target) : path.resolve(ROOT,path.dirname(page),target);
   if(target.endsWith('/')){assert(fs.existsSync(path.join(resolved,'index.html')),`Broken page link ${page}: ${url}`);}
   else {assert(fs.existsSync(resolved)||fs.existsSync(path.join(resolved,'index.html')),`Broken link ${page}: ${url}`);}
   checked++;
 }
}
console.log(`PASS: ${pages.length} pages, ${db.defs.length} DTC definitions, ${categories.length} part visuals, ${checked} local links, ${javascript.length} JS files`);
