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
const javascript=['assets/6006-dtc-catalog.js','assets/6006-ui.js','assets/6006-language-bridge.js','assets/6006-ecu-real.js','assets/6006-ecu-cinema.js'];
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
execFileSync(process.execPath,['scripts/test-ecu-motion.mjs'],{stdio:'inherit'});
// Cinematic original photo scene must not reintroduce rejected fake 3D material.
const homepage=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const cinematicCss=fs.readFileSync(path.join(ROOT,'assets/6006-ecu-cinema.css'),'utf8');
const cinematicJs=fs.readFileSync(path.join(ROOT,'assets/6006-ecu-cinema.js'),'utf8');
assert(homepage.includes('class="ecx" id="ecu-journey"'),'Stage 1 must use the cinematic original ECU section');
assert(homepage.includes('6006-ecu-cinema.css')&&homepage.includes('6006-ecu-cinema.js'),'ECU animation assets not linked');
for(const name of ['ecu-closed.webp','ecu-open.webp','ecu-exploded.webp']){
 assert(homepage.includes('/assets/ecu/'+name),'Authentic ECU stage missing '+name);
}
assert(!homepage.includes('class="ecu-real" id="ecu-journey"'),'Outdated home scene still installed');
assert(homepage.includes('class="vehicle-section" id="aracin"'),'Vehicle selector must remain unchanged');
assert(cinematicCss.includes('ecx__active')&&cinematicJs.includes('classList.toggle'),'Missing deterministic opaque photo state switching');
assert(cinematicJs.includes('Math.abs(p-.305)')&&cinematicJs.includes('Math.abs(p-.625)'),'Missing shutters between perspective changes');
assert(cinematicJs.includes('graphAlpha')&&cinematicJs.includes("new MutationObserver"),'Scroll and language-reactive graph missing');
console.log('PASS: original three-port ECU photo-based cinematic sequence and mobile stage controls');
// Photo-derived 3D ECU is a separate preview; guard assets and interactive code
// without changing the existing homepage or its other business content.
const photo3dRoot=path.join(ROOT,'ecu3d-real');
for(const f of ['index.html','viewer.js','ecu-photo-3d.glb',
 'ecu-lid-texture.webp','ecu-pcb-texture.webp',
 'ecu-socket-left.webp','ecu-socket-middle.webp','ecu-socket-right.webp']){
 assert(fs.existsSync(path.join(photo3dRoot,f)),'Missing ECU 3D preview asset '+f);
}
const model=fs.readFileSync(path.join(photo3dRoot,'ecu-photo-3d.glb'));
assert(model.toString('ascii',0,4)==='glTF','Invalid binary glTF magic');
assert(model.length<6_000_000,'3D ECU too heavy for mobile');
const viewer=fs.readFileSync(path.join(photo3dRoot,'viewer.js'),'utf8');
assert(viewer.includes('GLTFLoader'),'Missing model renderer');
assert(viewer.includes('lid.position.y')&&viewer.includes('pcb.position.y'),'Missing independently moving lid/PCB');
assert(viewer.includes('pointermove'),'Missing touch-based model inspection');
execFileSync(process.execPath,['--check',path.join(photo3dRoot,'viewer.js')],{stdio:'pipe'});
const previewHtml=fs.readFileSync(path.join(photo3dRoot,'index.html'),'utf8');
// If the model is under visual review, the public preview must show the
// original three-connector photographs, not an inaccurately branded 3D model.
assert(previewHtml.includes('ecu-photo-story')&&previewHtml.includes('ecu-photo-stage'),'Missing genuine ECU reference preview');
for(const f of ['ecu-closed.webp','ecu-open.webp','ecu-exploded.webp']){
 assert(previewHtml.includes(f),'Missing genuine ECU photographic state '+f);
 assert(fs.existsSync(path.join(ROOT,'assets/ecu',f)),'Missing original ECU image '+f);
}
assert(!previewHtml.includes('viewer.js'),'Rejected 3D mockup must not render in the public preview');

console.log(`PASS: ${pages.length} pages, ${db.defs.length} DTC definitions, ${categories.length} part visuals, ${checked} local links, ${javascript.length} JS files`);
