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
// VIN-assisted motor selector regression checks
const vinJs=path.join(ROOT,'assets/6006-vin-stage1.js');
const vinCss=path.join(ROOT,'assets/6006-vin-stage1.css');
assert(fs.existsSync(vinJs)&&fs.existsSync(vinCss),'Missing VIN engine finder assets');
execFileSync(process.execPath,['--check',vinJs],{stdio:'pipe'});
const vinScript=fs.readFileSync(vinJs,'utf8');
assert(vinScript.includes('WVW')&&vinScript.includes('wmi[full.slice(0,3)]'),'VIN WMI maker lookup missing');
assert(vinScript.includes('option(year,"",t("choose"))'),'Year should start unselected');
assert(vinScript.includes('finder.engineVariants'),'Engine list does not use actual vehicle variants');
assert(vinScript.includes('relatedCodes()')&&vinScript.includes('showRange('),'DTC and Stage-1 sections missing');
assert(!vinScript.includes('sessionStorage.setItem("vin"') && !vinScript.includes('localStorage.setItem("vin"'),'Do not store full VIN');
const vehicleHtml=fs.readFileSync(path.join(ROOT,'fahrzeug/index.html'),'utf8');
assert(vehicleHtml.includes('6006-vin-stage1.js')&&vehicleHtml.includes('6006-vin-stage1.css'),'VIN finder is not mounted on vehicle page');
const dtcVehicleJs=fs.readFileSync(path.join(ROOT,'assets/6006-dtc-vehicle.js'),'utf8');
assert(dtcVehicleJs.includes('dtc-car-advanced'),'DTC-to-VIN navigation missing');
console.log('PASS: VIN WMI, dependent vehicle selector, Stage-1 and DTC page linkage');
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
assert(urls.length>=30,'SEO sitemap should contain at least 30 accessible pages');
assert(urls.length===new Set(urls).size,'Duplicate sitemap URLs');
assert(urls.some(u=>u.endsWith('/fahrzeug/')),'Indexed vehicle catalog missing from sitemap');
for(const code of ['p0299','p0401','p2002','p20ee','u0100']){
  const pathname=path.join(ROOT,'fehlercodes',code,'index.html');
  assert(fs.existsSync(pathname),'Missing curated troubleshooting article: '+code);
  const html=fs.readFileSync(pathname,'utf8');
  assert(html.includes('<h1>')&&html.includes('rel="canonical"')&&!html.includes('noindex'),'Fault article not indexable: '+code);
  assert(urls.includes('https://6006coding.de/fehlercodes/'+code+'/'),'Missing sitemap entry: '+code);
}
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
