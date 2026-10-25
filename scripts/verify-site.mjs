import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
const ROOT='dist';
const SERVICES_VERSION='20261025-noncommercial';
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
const vehicleFinderJS=fs.readFileSync(path.join(ROOT,'assets/6006-vehicle-catalog.js'),'utf8');
assert(vehicleFinderJS.includes('vehicleQuickConfirmation'),'Vehicle search does not show visible confirmation');
assert(vehicleFinderJS.includes('vehicleQuickNext'),'Vehicle search is missing a next step');
assert(vehicleFinderJS.includes('font-size:16px!important'),'iPhone field font size causes unwanted zoom');
assert(vehicleFinderJS.includes('quick.blur()'),'Find button does not dismiss keyboard');
assert(vehicleFinderJS.includes('yearSelect')&&vehicleFinderJS.includes('engineVariantSelect'),'Missing engine navigation');
assert(fs.readFileSync(path.join(ROOT,'index.html'),'utf8').includes('6006-vehicle-catalog.js?v='+SERVICES_VERSION),'Homepage missing asset version');
console.log('PASS: Mobile Find Vehicle visibly confirms choice and navigates to engine');

const vinJs=path.join(ROOT,'assets/6006-vin-stage1.js');
const videoJs=path.join(ROOT,'assets/6006-video-search.js');
for(const file of [vinJs,videoJs]){
 assert(fs.existsSync(file),'Missing advanced vehicle/diagnostic search JavaScript: '+file);
 execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
}
for(const file of ['assets/6006-vin-stage1.css','assets/6006-video-search.css']){
 assert(fs.existsSync(path.join(ROOT,file)),'Missing advanced finder CSS: '+file);
}
const carPage=fs.readFileSync(path.join(ROOT,'fahrzeug/index.html'),'utf8');
const dtcPage=fs.readFileSync(path.join(ROOT,'fehlercodes/index.html'),'utf8');
assert(carPage.includes('6006-vin-stage1.js')&&carPage.includes('6006-vin-stage1.css'),'VIN interface not mounted');
assert(dtcPage.includes('6006-video-search.js')&&dtcPage.includes('6006-video-search.css'),'Instant DTC search not mounted');
const dtcVehicleCode=fs.readFileSync(path.join(ROOT,'assets/6006-dtc-vehicle.js'),'utf8');
assert(dtcVehicleCode.includes('/fahrzeug/#vehicle-selector-6006')||dtcVehicleCode.includes('"/fahrzeug/"'), 'Vehicle catalog cross-link missing');
assert(!dtcVehicleCode.includes('id="dtc-car-form"'), 'Duplicate DTC vehicle form must not return');
const brandChipsCSS=fs.readFileSync(path.join(ROOT,'assets/6006-vin-stage1.css'),'utf8');
assert(brandChipsCSS.includes('.vin6006-brand-chips'),'Multi-brand selector layout missing');

const vinCode=fs.readFileSync(vinJs,'utf8');
assert(vinCode.includes('WVW')&&vinCode.includes('vin6-vin')&&vinCode.includes('stockPower(v)'),'VIN manufacturer resolver or horsepower validation missing');
assert(vinCode.includes('finder.engineVariants')&&vinCode.includes('relatedCodes()'),'Motor and DTC lookup missing');
assert(vinCode.includes('popularMakes=[\"Volkswagen\",\"BMW\",\"Mercedes-Benz\"'),'Multi-brand shortcut set missing');
assert(vinCode.includes('DecodeWMI/')&&vinCode.includes('encodeURIComponent(prefix)'),'Prefix-only NHTSA WMI fallback missing');
assert(!vinCode.includes('encodeURIComponent(full)'),'Full VIN must not leave browser');
assert(vinCode.includes('let lookupId=0')&&vinCode.includes('AbortController'),'WMI response timeout/stale-state guard missing');
const catalogCode=fs.readFileSync(path.join(ROOT,'assets/6006-vehicle-catalog.js'),'utf8');
assert(!catalogCode.includes('return result.slice(0,500);'),'Engine results must not be silently limited to 500');
assert(vinCode.includes('id="vin6-engine-search"')||vinCode.includes('engineSearch.id="vin6-engine-search"'),'Engine text filter missing');
assert(vinCode.includes('matchesFuel(v,fuel.value)'),'Make-independent fuel matching not installed');
assert(vinCode.includes('Gasoline')||vinCode.includes('gasoline'),'Gasoline must be classified as petrol');
assert(vinCode.includes('Natural Gas')||vinCode.includes('natural gas'),'CNG model classification missing');
assert(vinCode.includes('stockNeedsReview(v)')&&vinCode.includes('referencePowerNeedsReview'),'Reference power cross-check missing');
assert(!vinCode.includes('showRange(')&&!vinCode.includes('canEstimate=Boolean('),'Unverified power increases must not be shown as calibration targets');
assert(vinCode.includes('sameSavedVehicle'),'Vehicle memory must not leak specifications across different models');
assert(vinCode.includes('familyWarning'),'Model-family matches must carry explicit uncertainty');
assert(carPage.includes('6006-vin-stage1.js?v='+SERVICES_VERSION),'Vehicle service interface must bust stale comparison caches');
const referenceIndex=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/vehicle-data/index.json'),'utf8'));
assert(referenceIndex.totalEngines>=30000&&referenceIndex.totalModels>=2600,'Open motor reference import too small');
console.log('PASS: Full engine matching, fuel categorization, data provenance and stock power safeguards');
assert(!/https:\/\/wa\.me|WhatsApp/i.test(vinCode),'Vehicle finder still contains a commercial WhatsApp handoff');
assert(!/quotation|Angebot|Teklif/i.test(vinCode),'Vehicle finder still exposes commercial quote flow');
console.log('PASS: VIN lookup remains informational and has no sales/quote handoff');

const missingRequestJs=path.join(ROOT,'assets/6006-missing-request.js');
const missingRequestCss=path.join(ROOT,'assets/6006-missing-request.css');
assert(fs.existsSync(missingRequestJs)&&fs.existsSync(missingRequestCss),'Missing vehicle / engine request files not published');
execFileSync(process.execPath,['--check',missingRequestJs],{stdio:'pipe'});
const missingCode=fs.readFileSync(missingRequestJs,'utf8');
assert(missingCode.includes('vin6-missing-toggle')&&missingCode.includes('vin6-missing-fields'),'Missing vehicle request not available or expandable');
assert(missingCode.includes('document.getElementById("vehicle-selector-6006")'),'Missing request not connected to vehicle finder');
assert(!/wa\.me|WhatsApp/i.test(missingCode)&&missingCode.includes('mailto:')&&missingCode.includes('kontakt@6006coding.de'),'Catalogue correction must use editorial email only');
assert(missingCode.includes('encodeURIComponent(msg)')&&missingCode.includes('valid=Boolean(make&&model&&(year||engine))'),'Missing request validation / URL safety not installed');
assert(missingCode.includes('lang')&&missingCode.includes('tr:')&&missingCode.includes('de:')&&missingCode.includes('en:'),'Missing vehicle request requires TR / DE / EN');
assert(!missingCode.includes('vin6-vin')&&!missingCode.includes('fetch(')&&!missingCode.includes('localStorage'),'Request must not upload or save full VIN, personal form inputs or contact messages');
assert(missingCode.includes('aria-disabled')&&missingCode.includes('removeAttribute("href")'),'Invalid requests must not open contact links');
assert(/Suggest a catalogue correction|Kataloga düzeltme öner|Katalogkorrektur vorschlagen/.test(missingCode),'Catalogue correction UI must be discoverable');
assert(fs.readFileSync(missingRequestCss,'utf8').includes('@media(max-width:600px)'),'Missing request iPhone layout not configured');
assert(carPage.includes('/assets/6006-missing-request.js?v='+SERVICES_VERSION)&&carPage.includes('/assets/6006-missing-request.css?v='+SERVICES_VERSION+''),'Missing engine form not mounted with cache version');
assert(fs.existsSync('docs/missing-engine-request-policy.md'),'Manual approval policy for reported catalogue entries missing');
console.log('PASS: Privacy-safe catalogue corrections through optional editorial email');

// Public comparisons are retired; archived data must never re-enter the service UI.
const retiredAssets=['6006-stage1-references.json','6006-stage1-seo-summary.json','6006-stage1-directory.js','6006-stage1-directory.css','6006-stage1-seo-filter.js','6006-stage1-seo.css','6006-stage1-open-engine-finder.js'];
const retiredHub=fs.readFileSync(path.join(ROOT,'stage1-referenzen','index.html'),'utf8');
assert(retiredHub.includes('noindex')&&retiredHub.includes('location.replace')&&retiredHub.includes('/#aracin'),'Retired comparison route must redirect visitors to vehicle services and stay out of search indexes');
assert(!/stage[\s-]+1\b|publishedStage1|stage-item/i.test(retiredHub),'Retired route must not republish old offers or power values');
for(const file of retiredAssets)assert(!fs.existsSync(path.join(ROOT,'assets',file)),'Retired comparison asset still public: '+file);
for(const token of ['matchPublishedStage','applyTransferredStageReference','publishedStage1Ps','publishedStage1Nm','6006-stage1-references.json','vin6-ref-source'])
 assert(!vinCode.includes(token),'Vehicle service interface still loads retired source comparisons: '+token);
for(const page of pages){
 const html=fs.readFileSync(path.join(ROOT,page),'utf8');
 assert(!/stage[\s-]+1\b/i.test(html),'Retired advertising remains in main page copy: '+page);
 assert(!/href=["'][^"']*stage1-referenzen/i.test(html),'Main page still links to retired comparisons: '+page);
 assert(!/src=["'][^"']*6006-stage1-(?:directory|seo|open)/i.test(html),'Main page still loads retired browser: '+page);
}
assert(!/stage[\s-]+1\b/i.test(vinCode),'Vehicle interface still advertises the retired feature');
assert(vinCode.includes('if(manual.value.trim()&&engine.value!=="")'),'Manual entry must clear the selected catalogue engine');
assert(vinCode.includes('engine.value="";ps.value="";nm.value=""'),'Manual engine must clear stale stock power and torque');
assert(vinCode.includes('preferred.has("engineSearch")'),'Open motor search hint must ignore a stale saved vehicle');
assert(vinCode.includes('engineSearch:(preferred.get("engineSearch")||"").trim().slice(0,90)'),'Open motor links must remain bounded search hints');
assert(vinCode.includes('if(initial.engineSearch)engineSearch.value=initial.engineSearch'),'Open motor links must narrow search without certifying a variant');
console.log('PASS: Retired comparison sources and browser assets removed; legacy hub redirects to vehicle services');

console.log('PASS: Multi-brand model and engine finder, WMI prefix-only fallback, iPhone controls');
const videoCode=fs.readFileSync(videoJs,'utf8');
assert(videoCode.includes('dtc-video-suggest')&&videoCode.includes('P0335'),'Instant fault-code suggestions missing');
assert(fs.existsSync(path.join(ROOT,'fehlercodes/p0335/index.html')),'Curated P0335 guide not published');
const adsText=fs.readFileSync(path.join(ROOT,'ads.txt'),'utf8');
assert(!/^\s*google\.com\s*,/im.test(adsText),'Non-commercial project must not authorize ad sellers in ads.txt');
assert(!fs.readFileSync(path.join(ROOT,'index.html'),'utf8').includes('google-adsense-account'),'Non-commercial project must not carry an AdSense publisher tag');
console.log('PASS: Advanced VIN finder and instant DTC search; no advertising configuration');
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
assert(homeSearch.includes('6006-vehicle-catalog.js?v='+SERVICES_VERSION),'Homepage must cache-bust vehicle search');
console.log('PASS: Golf / Passat model-only search, variants, mobile suggestions and cache bust');
assert(finder.models('Volkswagen').includes('Passat B8 2.0 TDI'),'Engine-specific profiles missing');
assert(finder.brands().includes('MG'),'Expanded manufacturers missing');
console.log('PASS: vehicle finder recognizes VW Golf, BMW X5, Mercedes E-Klasse, Tesla Model Y and engine-specific profiles');
const sitemap=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert(urls.length>100,'SEO sitemap is unexpectedly empty');
assert(urls.length===new Set(urls).size,'Duplicate sitemap URLs');
assert(urls.some(u=>u.endsWith('/fahrzeug/')),'Indexed vehicle catalog missing from sitemap');
assert(urls.includes('https://6006coding.de/datenschutz/')&&urls.includes('https://6006coding.de/projektinfo/'),'Legal/project pages missing from sitemap');
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

const globalSearchFile=path.join(ROOT,'assets','vehicle-data','engine-search.json');
assert(fs.existsSync(globalSearchFile),'Global 30k engine index must be generated by build');
const globalEngineIndex=JSON.parse(fs.readFileSync(globalSearchFile,'utf8'));
assert(globalEngineIndex.schemaVersion===1&&globalEngineIndex.referenceOnly===true,'Global motor index must be explicitly non-OEM reference data');
assert(globalEngineIndex.license==='ODbL-1.0'&&globalEngineIndex.databaseLicense,'Global engine index must retain ODbL source/license');
assert.equal(globalEngineIndex.count,vehicleIndex.totalEngines,'Global engine search omitted or invented engines');
assert.equal(globalEngineIndex.entries.length,vehicleIndex.totalEngines,'Global engine row count does not match source');
assert.equal(globalEngineIndex.models.length,vehicleIndex.totalModels,'Model dictionary does not match open reference catalogue');
assert.equal(globalEngineIndex.makes.length,vehicleIndex.makes.reduce((sum,g)=>sum+g.makes.length,0),'Global engine make dictionary incomplete');
for(const row of globalEngineIndex.entries){
 assert(Array.isArray(row)&&row.length===10&&Number.isInteger(row[0])&&row[0]>=0&&row[0]<globalEngineIndex.models.length,'Invalid indexed engine record');
 assert(typeof row[2]==='string'&&row[2].length>0,'Missing search-index engine label');
}
for(const [make,model] of [['Volkswagen','Passat'],['BMW','3 Series'],['Mercedes-Benz','E-Class']])
 assert(globalEngineIndex.models.some(m=>globalEngineIndex.makes[m[0]]===make&&m[1].includes(model)),'Major make/model missing from global search: '+make+' '+model);
const finderHtml=fs.readFileSync(path.join(ROOT,'fahrzeug/index.html'),'utf8');
for(const file of ['6006-full-engine-directory.js','6006-full-engine-directory.css'])
 assert(finderHtml.includes('/assets/'+file+'?v='+SERVICES_VERSION),'Live vehicle finder must load current '+file);
execFileSync(process.execPath,['--check',path.join(ROOT,'assets','6006-full-engine-directory.js')],{stdio:'pipe'});
const allEngineCode=fs.readFileSync(path.join(ROOT,'assets','6006-full-engine-directory.js'),'utf8');
assert(allEngineCode.includes('engine-search.json?v=20261012-all-engines'),'Search UI must load generated global engine data on demand');
assert(allEngineCode.includes('engineSearch')&&allEngineCode.includes('limit+=20'),'Search must pass an engine hint and paginate without auto-selecting ECU variants');
assert(vinCode.includes('if(initial.engineSearch)'),'Search hint must be restored AFTER async make/model loading');
assert(vinCode.includes('engineSearch.value=initial.engineSearch;\n renderEngines(\"\");\n engine.value=\"\";'),'Open motor links must filter engine results without confirming a variant');
assert(vinCode.includes('ps.value=\"\";\n nm.value=\"\";\n manuallyEditedStock=false;'),'Community reference must not silently populate verified stock power');
assert(fs.readFileSync(path.join(ROOT,'fahrzeug/index.html'),'utf8').includes('6006-vin-stage1.js?v='+SERVICES_VERSION),'Corrected motor search hint cache version not published');

assert(!/wa\.me|WhatsApp|inquiryDraft|Angebot|quote/i.test(allEngineCode),'Engine directory still offers paid/contact handoff');
assert(allEngineCode.includes('nicht OEM-bestätigt')&&allEngineCode.includes('OEM onaylı değil')&&allEngineCode.includes('not OEM verified'),'All three languages must distinguish open stock references from verified vehicle specifications');
assert(!/stage[\s-]+1\b/i.test(allEngineCode),'Engine directory must describe software, coding and diagnostics without gain advertising');
assert(allEngineCode.includes('actions.append(ask)'),'Engine directory must provide a catalogue navigation link');
assert(!allEngineCode.includes('vin6-vin')&&!allEngineCode.includes('sendBeacon('),'Do not automatically send or collect full VIN and visitor data');
assert(finderHtml.includes('6006-full-engine-directory.js?v='+SERVICES_VERSION)&&finderHtml.includes('6006-full-engine-directory.css?v='+SERVICES_VERSION),'New direct-contact assets must have cache-busted URLs');
assert(fs.readFileSync(path.join(ROOT,'assets','6006-full-engine-directory.css'),'utf8').includes('.vin6006-full-actions'),'Responsive dual CTAs missing stylesheet');
assert(!allEngineCode.includes('publishedStage1Ps')&&!allEngineCode.includes('publishedStage1Nm'),'Open engine data must not claim third-party tuning gains');
assert(allEngineCode.includes('databaseLicense')||fs.readFileSync(globalSearchFile,'utf8').includes('databaseLicense'),'ODbL source attribution missing');
console.log('PASS: '+globalEngineIndex.count+' globally searchable open reference engines, 164+ makes, paginated catalogue lookup');


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
assert(homepage.includes('id="hero-title">Araç sistemlerini <em>anla, doğru teşhis et.</em>'),'Homepage must lead with informational vehicle guidance');
assert(homepage.includes('id="repairGuideTitle">Katalog ve bakım rehberleri'),'Quick access should foreground informational topics');

const quickCardStart=homepage.indexOf('<div class="quick-access-grid">');
const quickCardEnd=homepage.indexOf('</div>\n          </div>\n        </div>\n      </section>',quickCardStart);
assert(quickCardStart>=0&&quickCardEnd>quickCardStart,'Quick-access section missing');
const quickCards=homepage.slice(quickCardStart,quickCardEnd);
assert((quickCards.match(/class="quick-access-card"/g)||[]).length>=3,'Homepage should retain topic entry points');
assert(!quickCards.includes('stageReferenceCard'),'Motor reference shortcut must not return');
assert(!/stage[\s-]+1\b/i.test(homepage),'Homepage copy and translations must not advertise the retired comparison');
assert(homepage.includes('id="emissionsGuideCard"'),'Emissions diagnosis must remain available');
assert(homepage.includes('id="emissionsGuideCard"'),'Emissions system information must remain available');
assert(catalogCode.includes('vehicle-service-overview'),'Selected vehicle must show an informative software and coding service overview');
for(const unsafe of ['id="psValue"','id="nmValue"','class="dyno-chart"','class="power-grid"'])
 assert(!homepage.includes(unsafe),'Retired tuned-power presentation remains: '+unsafe);
console.log('PASS: Informational topic cards and vehicle catalogue without power-gain advertising');

assert(homepage.includes('kontakt@6006coding.de'),'Contact email missing');
assert(homepage.includes('Bana ulaşın')&&homepage.includes('sorunuz varsa e-posta ile bana ulaşabilirsiniz'),'Personal contact copy missing');
assert(!/içerik önerisi|içerik önerilerinizi|guide ideas|ideas for the technical guides|Ideen.*Ratgeber/i.test(homepage),'Homepage must not solicit content suggestions');
assert(homepage.includes('/datenschutz/')&&homepage.includes('/projektinfo/'),'Legal and project information links missing');
assert(!/wa\.me|Angebot anfragen|Fiyat teklifi|Teklif iste/i.test(homepage),'Homepage retains commercial contact language');
console.log('PASS: non-commercial guide homepage and editorial email in TR/DE/EN');
console.log('PASS: ECU scene, photo controls, 3D links and animation assets are absent from homepage');
for(const folder of ['ecu-final','ecu3d','ecu3d-real']){
 assert(!fs.existsSync(path.join(ROOT,folder)),'Retired ECU preview still publicly published: '+folder);
}
for(const asset of fs.readdirSync(path.join(ROOT,'assets'))){
 assert(!/^6006-ecu-.*\\.(js|css)$/.test(asset),'Retired ECU script still public: '+asset);
}
console.log('PASS: all retired ECU previews and animation scripts removed from publication');

console.log(`PASS: ${pages.length} pages, ${db.defs.length} DTC definitions, ${categories.length} part visuals, ${checked} local links, ${javascript.length} JS files`);
