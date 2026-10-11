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
const stageFinderJS=fs.readFileSync(path.join(ROOT,'assets/6006-vehicle-catalog.js'),'utf8');
assert(stageFinderJS.includes('vehicleQuickConfirmation'),'Stage 1 search does not show visible confirmation');
assert(stageFinderJS.includes('vehicleQuickNext'),'Stage 1 search is missing a next step');
assert(stageFinderJS.includes('font-size:16px!important'),'iPhone field font size causes unwanted zoom');
assert(stageFinderJS.includes('quick.blur()'),'Find button does not dismiss keyboard');
assert(stageFinderJS.includes('yearSelect')&&stageFinderJS.includes('engineVariantSelect'),'Missing engine navigation');
assert(fs.readFileSync(path.join(ROOT,'index.html'),'utf8').includes('20261011-searchaction'),'Homepage missing asset version');
console.log('PASS: Mobile Find Vehicle visibly confirms choice and navigates to engine');
const javascript=['assets/6006-dtc-intelligence.js','assets/6006-dtc-catalog.js','assets/6006-ui.js','assets/6006-language-bridge.js','assets/6006-vehicle-catalog.js','assets/6006-dtc-vehicle.js'];

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
assert(finder.referencePowerNeedsReview({engine:'2.0L (300 HP)',hp:200}), 'Conflicting reference power must require review');
assert(finder.referencePowerNeedsReview({engine:'1.4L (204 HP)',hp:150,fuel:'Hybrid'}), 'Hybrid system power must not auto-fill stock PS');
assert(!finder.referencePowerNeedsReview({engine:'1.4L (150 HP)',hp:150,fuel:'Petrol'}), 'Consistent reference power rejected');
assert(!finder.referencePowerNeedsReview({engine:'1.2L (85 HP)',hp:86}), 'Small unit/rounding differences rejected');
for(const [input,brand,model] of [
  ['vw golf','Volkswagen','Golf'],
  ['BMW X5','BMW','X5'],
  ['mercedes E-Klasse','Mercedes-Benz','E-Klasse'],
  ['Tesla Model Y','Tesla','Model Y']
]){
  const found=finder.match(input);
  assert(found && found.brand===brand && found.model===model,'Vehicle matching failed: '+input);
}
// Regression: users commonly enter a model without its brand on a phone.
for(const [input,expectedBrand,expectedModel] of [
 ['Golf','Volkswagen','Golf'],['Passat','Volkswagen','Passat'],
 ['pAsSaT','Volkswagen','Passat'],['X5','BMW','X5'],
 ['Passat B8','Volkswagen','Passat B8']
]){
 const selected=finder.match(input);
 assert(selected && selected.brand===expectedBrand && selected.model===expectedModel,'Model-only matching regression: '+input);
}
assert(typeof finder.searchModels==='function','Quick-search suggestion API missing');
const golfSuggestions=finder.searchModels('Golf');
assert(golfSuggestions.some(x=>x.brand==='Volkswagen'&&x.model==='Golf'),'Golf suggestions missing');
assert(golfSuggestions.some(x=>x.brand==='Volkswagen'&&/Golf (VII|VIII|7|8)/.test(x.model)),'Golf variant suggestions missing');
const passatSuggestions=finder.searchModels('Passat');
assert(passatSuggestions.some(x=>x.model==='Passat'),'Passat suggestions missing');
assert(passatSuggestions.some(x=>x.model.includes('Passat B8')),'Passat B8 suggestion missing');
const quickScript=fs.readFileSync(path.join(ROOT,'assets/6006-vehicle-catalog.js'),'utf8');
assert(quickScript.includes('vehicleQuickResults')&&quickScript.includes('aria-expanded')&&quickScript.includes('chooseSuggestion(item)'),'Mobile dropdown UI missing');
const homeSearch=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
assert(homeSearch.includes('6006-vehicle-catalog.js?v=20261011-searchaction'),'Homepage must cache-bust vehicle search');
console.log('PASS: Golf / Passat model-only search, variants, mobile suggestions and cache bust');
assert(finder.models('Volkswagen').includes('Passat B8 2.0 TDI'),'Engine-specific profiles missing');
assert(finder.brands().includes('MG'),'Expanded manufacturers missing');
console.log('PASS: vehicle finder recognizes VW Golf, BMW X5, Mercedes E-Klasse, Tesla Model Y and engine-specific profiles');
const sitemap=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert(urls.length>100,'SEO sitemap is unexpectedly empty');
assert(urls.length===new Set(urls).size,'Duplicate sitemap URLs');
assert(urls.some(u=>u.endsWith('/fahrzeug/')),'Indexed vehicle catalog missing from sitemap');
for(const code of ['p0299','p0401','p2002','p20ee','u0100','p0301','p0128','p2015','p0562','p0741','u0415']){
  const pathname=path.join(ROOT,'fehlercodes',code,'index.html');
  assert(fs.existsSync(pathname),'Missing curated troubleshooting article: '+code);
  const html=fs.readFileSync(pathname,'utf8');
  assert(html.includes('<h1>')&&html.includes('rel="canonical"')&&!html.includes('noindex'),'Fault article not indexable: '+code);
  assert(urls.includes('https://6006coding.de/fehlercodes/'+code+'/'),'Missing sitemap entry: '+code);
}

const allPages=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/6006-all-dtc-pages.json'),'utf8'));
assert(allPages.uniqueCodes===codes.size,'Unique DTC coverage changed unexpectedly');
assert(allPages.manufacturerDefinitions===db.defs.length,'Manufacturer definition count mismatch');
assert(allPages.generatedCodePages>=11000,'Missing individual DTC pages');
assert(allPages.generatedCodePages+allPages.curated===allPages.uniqueCodes,'Code page/curated coverage mismatch');
const codePages=path.join(ROOT,'fehlercodes');
const dirs=fs.readdirSync(codePages,{withFileTypes:true}).filter(item=>item.isDirectory()&&/^[pbcu][0-9a-f]{4}$/i.test(item.name));
assert(dirs.length===allPages.uniqueCodes,'Some code paths were not written');
const allCodes=new Set(db.defs.map(row=>row[0]));
for(const code of allCodes){
 const url='/fehlercodes/'+code.toLowerCase()+'/';
 const file=path.join(codePages,code.toLowerCase(),'index.html');
 assert(fs.existsSync(file),'No dedicated page for '+code);
 const html=fs.readFileSync(file,'utf8');
 assert.equal(urls.includes('https://6006coding.de'+url),!html.includes('noindex'),'Sitemap/indexability mismatch '+code);
}
for(const code of ['P0102','P0113','P0670','B0001','C0035','U0073']){
 if(JSON.parse(fs.readFileSync(path.join(ROOT,'assets/6006-curated-guides.json'),'utf8')).codes.includes(code))continue;
 const direct=path.join(ROOT,'fehlercodes',code.toLowerCase(),'index.html');
 if(!fs.existsSync(direct))continue;
 const page=fs.readFileSync(direct,'utf8');
 assert(page.includes('<h1>'+code+' Fehlercode')&&page.includes('name="description"')&&page.includes('rel="canonical"')&&page.includes('Mögliche Ursache')&&page.includes('Diagnose und Prüfablauf'),'Incomplete code detail '+code);
 assert(!page.includes('noindex'),'Unexpected noindex for '+code);
}
assert(fs.readFileSync(path.join(ROOT,'fehlercodes','verzeichnis','index.html'),'utf8').includes('Jeder Code hat eine eigene Informationsseite'),'Code directory not describing its detailed links');
console.log('PASS: '+allPages.uniqueCodes+' accessible DTC pages; sitemap agrees with indexability');

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


// All source DTCs now receive a fault-type-aware explanation in three languages.
const intelligencePath=path.join(ROOT,'assets','6006-dtc-intelligence.js');
const logic=fs.readFileSync(intelligencePath,'utf8');
const exported={};
vm.runInNewContext(logic,{window:exported},{timeout:2000});
const detailEngine=exported.DTCIntelligence6006;
assert(detailEngine&&typeof detailEngine.explain==='function','DTC triage engine not loaded');
for(const row of db.defs.filter(r=>r.length===3)){
 const result=detailEngine.explain(row[0],row[2],row[1],'de');
 assert(result&&result.classification&&result.causes.length>=1&&result.checks.length>=2&&result.note,'Missing preliminary guidance for '+row[0]);
}
for(const language of ['tr','de','en']){
 const unknown=detailEngine.explain('B2000','Manufacturer Controlled DTC','GENERIC',language);
 assert(unknown.mode==='undefined'&&unknown.limited,'Placeholder mistaken for component diagnosis in '+language);
 const pending=detailEngine.explain('P1000','OBD System Readiness Test Not Complete','FORD',language);
 assert(pending.mode==='readiness'&&pending.limited,'Readiness misclassified in '+language);
 const safety=detailEngine.explain('B0020','Airbag squib circuit open','GENERIC',language);
 assert(safety.mode==='specialist'&&safety.limited,'Unsafe SRS checks in '+language);
}
for(const [code,desc,type] of [
 ['P0102','Mass airflow sensor circuit low','low'],
 ['P0103','Mass airflow sensor high input','high'],
 ['P0301','Cylinder 1 misfire detected','misfire'],
 ['U0100','Lost communication with ECM','comm'],
 ['P0420','Catalyst efficiency below threshold','efficiency'],
 ['P0118','Coolant temperature circuit high','high']
]) assert(detailEngine.explain(code,desc,'GENERIC','en').mode===type,'Incorrect diagnostic subtype '+code);
assert(fs.existsSync(path.join(ROOT,'assets','6006-curated-guides.json')),'Detailed guide manifest missing');
const detailCodes=JSON.parse(fs.readFileSync(path.join(ROOT,'assets','6006-curated-guides.json'),'utf8')).codes;
assert(detailCodes.length>=76,'Curated guides manifest incomplete');
assert(fs.readFileSync(path.join(ROOT,'fehlercodes','index.html'),'utf8').includes('6006-dtc-intelligence.js'),'Client does not load diagnostic intelligence');
console.log('PASS: '+db.defs.length+' definitions covered; '+detailCodes.length+' detailed article links resolve (not OEM verification)');

const guideFolder=path.join(ROOT,'fehlercodes');
const guideCount=fs.readdirSync(guideFolder,{withFileTypes:true}).filter(e=>e.isDirectory() && /^[pbcu][0-9a-f]{4}$/i.test(e.name) && fs.existsSync(path.join(guideFolder,e.name,'index.html'))).length;
assert(guideCount>=76,'Detailed code-specific troubleshooting guide count below 76: '+guideCount);
console.log('PASS: '+detailCodes.length+' detailed guides and '+(guideCount-detailCodes.length)+' automatic reference pages');
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
assert(homepage.includes('id="hero-title">ECU Yazılımı,'),'Commercial homepage must lead with ECU software');
assert(homepage.includes('id="repairGuideTitle">Araç Kodlama'),'Quick services must include vehicle coding');
assert(homepage.includes('href="#hizmetler">Hizmetlerimizi gör'),'Homepage needs a direct services CTA');
for(const name of ['Araç Kodlama &amp; Adaptasyon','ECU Okuma, Yazma &amp; Yedekleme','Arıza Kodu &amp; Canlı Veri Teşhisi'])assert(homepage.includes(name),'Missing advertised service: '+name);
assert(homepage.includes('"Wie können wir Ihrem Fahrzeug helfen?"'),'Missing German service finder copy');
assert(homepage.includes('ECU-Softwareoptimierung, Fahrzeugcodierung'),'Missing German SEO focus');
console.log('PASS: commercial ECU, vehicle coding and OBD diagnostics homepage with TR/DE/EN copy');
console.log('PASS: ECU scene, photo controls, 3D links and animation assets are absent from homepage');
for(const folder of ['ecu-final','ecu3d','ecu3d-real']){
 assert(!fs.existsSync(path.join(ROOT,folder)),'Retired ECU preview still publicly published: '+folder);
}
for(const asset of fs.readdirSync(path.join(ROOT,'assets'))){
 assert(!/^6006-ecu-.*\\.(js|css)$/.test(asset),'Retired ECU script still public: '+asset);
}
console.log('PASS: all retired ECU previews and animation scripts removed from publication');

console.log(`PASS: ${pages.length} pages, ${db.defs.length} DTC definitions, ${categories.length} part visuals, ${checked} local links, ${javascript.length} JS files`);
