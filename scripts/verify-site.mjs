import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
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
const javascript=['assets/6006-dtc-catalog.js','assets/6006-ui.js','assets/6006-language-bridge.js','assets/6006-vehicle-catalog.js','assets/6006-dtc-vehicle.js'];

// Exercise the actual catalogue script without requiring a network or browser.
const fakeWindow={};
const sandbox={
  window:fakeWindow,
  document:{readyState:'loading',addEventListener(){}},
  addEventListener(){},
  vehicleDirectory:{Volkswagen:['Golf','Passat'],BMW:['X5'], 'Mercedes-Benz':['E-Klasse'],Tesla:['Model Y']},
  vehicles:[{brand:'Volkswagen',name:'Passat B8 2.0 TDI'}]
};
vm.runInNewContext(fs.readFileSync(path.join(ROOT,'assets/6006-vehicle-catalog.js'),'utf8'),sandbox,{timeout:2000});
const finder=fakeWindow.VehicleCatalog6006;
assert(finder && typeof finder.match==='function','Vehicle catalogue was not initialized');
for(const [input,brand,model] of [
  ['vw golf','Volkswagen','Golf'],
  ['BMW X5','BMW','X5'],
  ['mercedes E-Klasse','Mercedes-Benz','E-Klasse'],
  ['Tesla Model Y','Tesla','Model Y']
]){
  const found=finder.match(input);
  assert(found && found.brand===brand && found.model===model,'Vehicle matching failed: '+input);
}
assert(finder.models('Volkswagen').includes('Passat B8 2.0 TDI'),'Engine-specific profiles missing');
assert(finder.brands().includes('MG'),'Expanded manufacturers missing');
console.log('PASS: vehicle finder recognizes VW Golf, BMW X5, Mercedes E-Klasse, Tesla Model Y and engine-specific profiles');
const sitemap=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert(urls.length>=80,'SEO sitemap should contain at least 80 accessible pages');
assert(urls.length===new Set(urls).size,'Duplicate sitemap URLs');
assert(urls.some(u=>u.endsWith('/fahrzeug/')),'Indexed vehicle catalog missing from sitemap');
for(const code of ['p0299','p0401','p2002','p20ee','u0100','p0301','p0128','p2015','p0562','p0741','u0415']){
  const pathname=path.join(ROOT,'fehlercodes',code,'index.html');
  assert(fs.existsSync(pathname),'Missing curated troubleshooting article: '+code);
  const html=fs.readFileSync(pathname,'utf8');
  assert(html.includes('<h1>')&&html.includes('rel="canonical"')&&!html.includes('noindex'),'Fault article not indexable: '+code);
  assert(urls.includes('https://6006coding.de/fehlercodes/'+code+'/'),'Missing sitemap entry: '+code);
}

// Every licensed fault-code definition must be discoverable in server-rendered HTML.
const directoryRoot=path.join(ROOT,'fehlercodes','verzeichnis');
assert(fs.existsSync(path.join(directoryRoot,'index.html')),'Full code directory missing');
const groups=fs.readdirSync(directoryRoot,{withFileTypes:true}).filter(x=>x.isDirectory());
let entries=0, directoryPages=0;
for(const group of groups) {
 const groupDir=path.join(directoryRoot,group.name);
 const pages=[path.join(groupDir,'index.html'),...fs.readdirSync(groupDir,{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>path.join(groupDir,x.name,'index.html'))];
 for(const file of pages){
   assert(fs.existsSync(file),'Broken directory page: '+file);
   const html=fs.readFileSync(file,'utf8');
   entries += [...html.matchAll(/data-dtc-row="1"/g)].length;
   assert(html.includes('name="robots" content="index,follow')&&html.includes('rel="canonical"'),'Unindexable directory page: '+file);
   const url='https://6006coding.de/'+path.relative(ROOT,path.dirname(file)).replace(/\\/g,'/')+'/';
   assert(urls.includes(url),'Missing sitemap link for '+url);
   directoryPages++;
 }
}
assert.equal(entries,db.defs.filter(r=>Array.isArray(r)&&r.length===3&&r.every(v=>typeof v==='string'&&v.trim())).length,'Not all DTC definitions are in static HTML');
assert(urls.includes('https://6006coding.de/fehlercodes/verzeichnis/'),'Directory hub missing from sitemap');
assert(fs.readFileSync(path.join(ROOT,'fehlercodes/index.html'),'utf8').includes('/fehlercodes/verzeichnis/'),'Directory unlinked from diagnosis page');
console.log('PASS: '+entries+' DTC definitions discoverable in '+directoryPages+' static pages');

const guideFolder=path.join(ROOT,'fehlercodes');
const guideCount=fs.readdirSync(guideFolder,{withFileTypes:true}).filter(e=>e.isDirectory() && /^[pbcu][0-9a-f]{4}$/i.test(e.name) && fs.existsSync(path.join(guideFolder,e.name,'index.html'))).length;
assert(guideCount>=76,'Detailed code-specific troubleshooting guide count below 76: '+guideCount);
console.log('PASS: '+guideCount+' independently authored diagnosis pages');
const vehicleIndexPath=path.join(ROOT,'assets/vehicle-data/index.json');
assert(fs.existsSync(vehicleIndexPath),'Missing broad model/engine database');
const vehicleIndex=JSON.parse(fs.readFileSync(vehicleIndexPath,'utf8'));
assert(vehicleIndex.makes.length>=150 && vehicleIndex.totalModels>=2300 && vehicleIndex.totalEngines>=27000,'Vehicle reference database incomplete');
assert(vehicleIndex.license==='ODbL-1.0'&&vehicleIndex.databaseLicense,'Vehicle data lacks ODbL attribution');
assert(fs.existsSync(path.join(ROOT,'assets/vehicle-data/volkswagen.json')),'Volkswagen engine variants missing');
console.log('PASS: '+vehicleIndex.makes.length+' vehicle make groups, '+vehicleIndex.totalModels+' models, '+vehicleIndex.totalEngines+' engines; '+urls.length+' sitemap URLs');

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
// The rejected ECU presentation is fully removed from the live homepage.
const homepage=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
for(const token of [
 'id="ecu-journey"',
 'data-ecx-step=',
 '6006-ecu-cinema.css',
 '6006-ecu-cinema.js',
 '6006-ecu-premium3d.js',
 '6006-ecu-premium3d.css',
 '/ecu-atelier/'
]) assert(!homepage.includes(token),'Rejected ECU showcase is still linked: '+token);
assert(homepage.includes('class="vehicle-section" id="aracin"'),'Vehicle selector removed unexpectedly');
assert(homepage.includes('/assets/6006-vehicle-catalog.js'),'Expanded vehicle finder not loaded');
assert(homepage.includes('VehicleCatalog6006?.brands()'),'Extended make options missing');
assert(homepage.includes('VehicleCatalog6006?.models(brandSelect.value)'),'Extended model options missing');
assert(homepage.includes('VehicleCatalog6006?.match(raw)'),'Assistant make/model matching missing');
assert(homepage.includes('class="real-home-feature"'),'Existing home systems list removed unexpectedly');
console.log('PASS: ECU scene, photo controls, 3D links and animation assets are absent from homepage');
for(const folder of ['ecu-final','ecu3d','ecu3d-real']){
 assert(!fs.existsSync(path.join(ROOT,folder)),'Retired ECU preview still publicly published: '+folder);
}
for(const asset of fs.readdirSync(path.join(ROOT,'assets'))){
 assert(!/^6006-ecu-.*\\.(js|css)$/.test(asset),'Retired ECU script still public: '+asset);
}
console.log('PASS: all retired ECU previews and animation scripts removed from publication');

console.log(`PASS: ${pages.length} pages, ${db.defs.length} DTC definitions, ${categories.length} part visuals, ${checked} local links, ${javascript.length} JS files`);
