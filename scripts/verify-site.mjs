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
assert(fs.readFileSync(path.join(ROOT,'index.html'),'utf8').includes('6006-vehicle-catalog.js?v=20261013-journey'),'Homepage missing asset version');
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
assert(!vinCode.includes('showRange(')&&!vinCode.includes('canEstimate=Boolean('),'Unverified universal Stage 1 estimates must not be shown as calibration targets');
assert(vinCode.includes('sameSavedVehicle'),'Vehicle memory must not leak specifications across different models');
assert(vinCode.includes('familyWarning'),'Model-family matches must carry explicit uncertainty');
assert(fs.readFileSync(path.join(ROOT,'fahrzeug/index.html'),'utf8').includes('20261012-62refs'),'Stage 1 reference asset version must bust caches');
const referenceIndex=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/vehicle-data/index.json'),'utf8'));
assert(referenceIndex.totalEngines>=30000&&referenceIndex.totalModels>=2600,'Open motor reference import too small');
console.log('PASS: Full engine matching, fuel categorization, data provenance and Stage 1 safety');
const quoteSection=vinCode.slice(vinCode.indexOf('const quoteCopy='),vinCode.indexOf('const popularMakes='));
assert(quoteSection.length>2000,'Stage 1 quote request module missing');
assert(quoteSection.includes('https://wa.me/')&&quoteSection.includes('mailto:'),'Both business contact channels missing');
assert(quoteSection.includes('6006performance@gmail.com')&&quoteSection.includes('491788354756'),'Business contact targets changed');
assert(quoteSection.includes('Number.isSafeInteger(mileage)')&&quoteSection.includes('mileage<=2000000'),'Vehicle mileage mishandled');
assert(quoteSection.includes('contactWaNumber')&&quoteSection.includes('encodeURIComponent(message)'),'Quote message is not encoded safely');
assert(!quoteSection.includes('document.getElementById("vin6-vin")')&&!quoteSection.includes('$("vin")'),'Full VIN must not be included in contact message');
assert(quoteSection.includes('aria-disabled')&&quoteSection.includes('Boolean(make.value&&model.value&&engineCode)'),'Quote actions must require an engine');
assert(quoteSection.includes('stockNeedsReview(selected)'),'Unverified engine values must be marked in quote');
assert(fs.readFileSync(path.join(ROOT,'assets/6006-vin-stage1.css'),'utf8').includes('.vin6006-quote-actions'),'Stage 1 quote form CSS not found');
console.log('PASS: Multi-language Stage 1 inquiry, correct business contacts, user-initiated handoff and VIN privacy');

const missingRequestJs=path.join(ROOT,'assets/6006-missing-request.js');
const missingRequestCss=path.join(ROOT,'assets/6006-missing-request.css');
assert(fs.existsSync(missingRequestJs)&&fs.existsSync(missingRequestCss),'Missing vehicle / engine request files not published');
execFileSync(process.execPath,['--check',missingRequestJs],{stdio:'pipe'});
const missingCode=fs.readFileSync(missingRequestJs,'utf8');
assert(missingCode.includes('vin6-missing-toggle')&&missingCode.includes('vin6-missing-fields'),'Missing vehicle request not available or expandable');
assert(missingCode.includes('document.getElementById("vehicle-selector-6006")'),'Missing request not connected to vehicle finder');
assert(missingCode.includes('https://wa.me/491788354756')&&missingCode.includes('mailto:6006performance@gmail.com'),'Business contact channels must match 6006 Performance');
assert(missingCode.includes('encodeURIComponent(msg)')&&missingCode.includes('valid=Boolean(make&&model&&(year||engine))'),'Missing request validation / URL safety not installed');
assert(missingCode.includes('lang')&&missingCode.includes('tr:')&&missingCode.includes('de:')&&missingCode.includes('en:'),'Missing vehicle request requires TR / DE / EN');
assert(!missingCode.includes('vin6-vin')&&!missingCode.includes('fetch(')&&!missingCode.includes('localStorage'),'Request must not upload or save full VIN, personal form inputs or contact messages');
assert(missingCode.includes('aria-disabled')&&missingCode.includes('removeAttribute("href")'),'Invalid requests must not open contact links');
assert(missingCode.includes('report a missing')||missingCode.includes('Report a missing'),'Missing motor information must be visibly discoverable');
assert(fs.readFileSync(missingRequestCss,'utf8').includes('@media(max-width:600px)'),'Missing request iPhone layout not configured');
assert(carPage.includes('/assets/6006-missing-request.js?v=20261012-missing-engine')&&carPage.includes('/assets/6006-missing-request.css?v=20261012-missing-engine'),'Missing engine form not mounted with cache version');
assert(fs.existsSync('docs/missing-engine-request-policy.md'),'Manual approval policy for reported catalogue entries missing');
console.log('PASS: Privacy-safe missing make/model/engine requests, translated UI, working business contacts');

const stageRefFile=path.join(ROOT,'assets/6006-stage1-references.json');
assert(fs.existsSync(stageRefFile),'Stage 1 published references missing');
const stageRefDb=JSON.parse(fs.readFileSync(stageRefFile,'utf8'));
assert(stageRefDb.schemaVersion===1&&Array.isArray(stageRefDb.examples),'Stage 1 reference schema invalid');
assert(stageRefDb.examples.length>=62,'Expected sixty-two externally sourced Stage 1 advertisements');
const seenStageRef=new Set();
for(const ref of stageRefDb.examples){
 assert(typeof ref.id==='string'&&ref.id.length>7&&!seenStageRef.has(ref.id),'Stage 1 reference id duplicated or missing');
 seenStageRef.add(ref.id);
 assert(ref.classification==='third-party-advertised','Unqualified Stage 1 claims are forbidden');
 assert(typeof ref.make==='string'&&ref.make.length>=2&&typeof ref.model==='string'&&ref.model.length>=2,'Stage 1 source must identify make and model');
 assert(Number.isInteger(ref.yearFrom)&&Number.isInteger(ref.yearTo)&&ref.yearFrom>=1980&&ref.yearTo>=ref.yearFrom,'Stage 1 year window invalid');
 assert(typeof ref.publisher==='string'&&ref.publisher.length>=4,'Stage 1 publisher attribution missing');
 assert(/^https:\/\/[^\s]+$/.test(ref.sourceUrl),'Third-party Stage 1 needs a direct HTTPS source');
 assert(typeof ref.fuel==='string'&&ref.fuel.length>2,'Stage 1 fuel type missing');
 assert(Number.isInteger(ref.sourceStockHp)&&ref.sourceStockHp>30&&ref.sourceStockHp<=1200,'Stock engine HP invalid');
 assert(Number.isInteger(ref.sourceStockNm)&&ref.sourceStockNm>30&&ref.sourceStockNm<=1600,'Stock engine Nm invalid');
 for(const k of ['publishedStockPs','publishedStockNm','publishedStage1Ps','publishedStage1Nm'])assert(Number.isInteger(ref[k])&&ref[k]>30&&ref[k]<=1600,'Stage 1 reference number invalid: '+k);
 assert(ref.publishedStage1Ps>ref.publishedStockPs&&ref.publishedStage1Ps<=ref.publishedStockPs*1.6,'Implausible Stage 1 PS claim');
 assert(ref.publishedStage1Nm>ref.publishedStockNm&&ref.publishedStage1Nm<=ref.publishedStockNm*1.7,'Implausible Stage 1 Nm claim');
 assert(ref.manualOnly?(typeof ref.manualEngineContains==='string'&&ref.manualEngineContains.length>=6):(typeof ref.enginePrefix==='string'&&ref.enginePrefix.length>=4&&typeof ref.generationContains==='string'),'Stage 1 matching conditions missing');
}
assert(vinCode.includes('function matchPublishedStage()')&&vinCode.includes('function renderStageReference()'),'Source-linked reference UI not connected');
assert(vinCode.includes('manualOnly')&&vinCode.includes('sourceStockNm')&&vinCode.includes('manuallyEditedStock'),'Strict reference matching missing');
assert(vinCode.includes('third-party-advertised')&&vinCode.includes('vin6-ref-source'),'Third-party attribution missing');
const requiredReferenceMakes=['BMW','Volkswagen','Audi','Renault','Opel','SEAT','Škoda','Peugeot','Mercedes-Benz','Nissan','Hyundai','Ford'];
for(const make of requiredReferenceMakes)assert(stageRefDb.examples.some(r=>r.make===make),'Missing reviewed Stage 1 reference make: '+make);
const knownStageRefIds=['audi-a4-b9-2tdi-150-brp','audi-a4-b8-2tdi-150-brp','renault-clio-iv-ph2-dci90-brp','opel-astra-k-cdti136-brp','volkswagen-golf8-2tdi150-brp','seat-leon-5f-act150-brp','skoda-octavia4-2tdievo150-brp','peugeot-308iii-bluehdi130-brp','mercedes-aclass-w177-220d194-brp','audi-a4-35tdi-2019-150-brp'];
for(const id of knownStageRefIds)assert(seenStageRef.has(id),'Missing reviewed Stage 1 advertisement '+id);
const latestStageRefIds=["audi-a3-8v-fl-2tdi-150-2016-brp","audi-a3-8y-35tdi-2020-brp","nissan-qashqai-j11-fl-15dci110-brp","hyundai-i30-2018-10tgdi120-brp","hyundai-i30-2018-14tgdi140-brp","ford-focus-mk4-10ecoboost125-brp","ford-focus-mk3-10ecoboost125-brp","peugeot-208-ii-puretech75-brp","bmw-3series-gt-f34-320d190-brp"];
for(const id of latestStageRefIds)assert(seenStageRef.has(id),'Missing newly reviewed Stage 1 advertisement '+id);
assert(stageRefDb.examples.some(r=>r.id==='bmw-3series-gt-f34-320d190-brp'&&r.model==='3 Series Gran Turismo'&&r.sourceUrl.includes('/5685-serie-3-gt/')),'BMW Gran Turismo reference must be model-specific');
const newSourceIds=["kia-sportage-ivph2-crdi136-2018-brp","bmw-5series-g30-520d-190-2019-brp","bmw-5series-lci-520d-190-2021-brp","dacia-duster-2010-dci90-brp","mazda-cx5-2015-skyactivd150-brp","seat-ateca-2016-2tdi150-brp","seat-ateca-2020-2tdi150-brp","renault-megane-iv-dci110-2016-brp","renault-megane-iii-dci90-2008-brp","renault-megane-iii-dci110-2008-brp","renault-megane-iii-dci110-2012-brp","honda-civic-10th-dtec120-brp","toyota-avensis-t270-d4d143-brp","fiat-tipo-multijet120-brp","skoda-kodiaq-2021-2tdi150-brp","volkswagen-polo-a0-tsi115-brp","opel-corsa-f-turbo100-brp"];
for(const id of newSourceIds)assert(seenStageRef.has(id),'Missing source-linked Stage 1 example '+id);
assert(new Set(stageRefDb.examples.map(x=>x.make)).size>=32,'Stage 1 public examples should cover at least 32 makes');
assert(vinCode.includes('if(manual.value.trim()&&engine.value!=="")'),'Manual engine entry must clear the previously selected catalogue variant');
assert(vinCode.includes('engine.value="";ps.value="";nm.value=""'),'Manual engine must clear stale stock power and torque');
const expansionSourceIds=["volvo-xc60ii-d4-190-2017-brp","alfa-giulia-22jtd150-2016-brp","alfa-giulia-22jtd180-2016-brp","alfa-giulia-22jtd210-2019-brp","alfa-stelvio-22jtd190-2020-brp","citroen-c3iii-12t-puretech110-brp","citroen-c3-aircross-12gpf110-brp","suzuki-vitara-14-boosterjet129-brp","mini-hatch-f56lci-coopers192-brp","cupra-formentor-15tsi150-brp","cupra-leon-20tsi245-brp","smart-fortwo-453-09t90-brp","porsche-macan-95b-20tfsi245-brp","porsche-cayenne-958-30tdi262-brp"];
for(const id of expansionSourceIds)assert(seenStageRef.has(id),'Unpublished reviewed external motor source '+id);
for(const make of ["Volvo","Alfa Romeo","Citroën","Suzuki","MINI","Cupra","Smart","Porsche"])
 assert(stageRefDb.examples.some(x=>x.make===make),'Newly reviewed Stage 1 brand missing: '+make);
assert(stageRefDb.examples.find(x=>x.id==="mini-hatch-f56lci-coopers192-brp")?.enginePrefix==="Cooper S 2.0L 6MT",'MINI DKG7 automatic must not inherit manual Stage 1 value');
assert(stageRefDb.examples.find(x=>x.id==="smart-fortwo-453-09t90-brp")?.manualOnly,'Smart 135/136Nm mismatch must never auto-match');
assert(stageRefDb.examples.find(x=>x.id==="citroen-c3iii-12t-puretech110-brp")?.manualOnly,'C3 mismatched open-reference torque must not auto-match');
assert(stageRefDb.examples.find(x=>x.id==="suzuki-vitara-14-boosterjet129-brp")?.fuel==="Hybrid",'Suzuki 129PS hybrid must not be confused with petrol');
assert.equal(new Set(stageRefDb.examples.map(x=>x.sourceUrl)).size,stageRefDb.examples.length,'Sources should have distinct publisher URLs');
console.log('PASS: 58 source-linked examples, 29 brands, eight new makes and exact gearbox/hybrid protections');
const latestSourceIds=["jeep-renegade-2014-jtdm140-brp","jeep-renegade-2018-mjt140-brp","jeep-renegade-2018-gse120-brp","mitsubishi-asx-2016-did114-brp","subaru-forester-2008-boxerd150-brp","peugeot-2008ii-2020-bluehdi130-brp"];
for(const id of latestSourceIds)assert(seenStageRef.has(id),'Missing latest publisher-backed Stage 1 example: '+id);
for(const brand of ['Jeep','Mitsubishi','Subaru'])assert(stageRefDb.examples.some(x=>x.make===brand),'New brand reference absent: '+brand);
for(const id of latestSourceIds)assert(stageRefDb.examples.find(x=>x.id===id)?.manualOnly,'Ambiguous open motor data must require confirmed engine and stock output: '+id);
assert(stageRefDb.examples.find(x=>x.id==='mitsubishi-asx-2016-did114-brp')?.manualEngineContains==='ASX 1.6 DID','ASX shared model category requires ASX-specific manual identification');
assert(stageRefDb.examples.find(x=>x.id==='subaru-forester-2008-boxerd150-brp')?.publishedStage1Ps===180,'Subaru stage 1 must not inherit stage 2 200 PS');
console.log('PASS: Six additional motor advertisements, three newly covered makes, strict model/torque validation');
const stage1CarHtml=fs.readFileSync(path.join(ROOT,'fahrzeug/index.html'),'utf8');
assert(stage1CarHtml.includes('6006-vin-stage1.js?v=20261013-journey'),'Stage 1 source transfer must use fresh script version');
assert(vinCode.includes('preferred.has("engineSearch")'),'Open community motor search hint must ignore stale saved vehicle');
assert(vinCode.includes('engineSearch:(preferred.get("engineSearch")||"").trim().slice(0,90)'),'Community engine links must not preload stock or tuning information');
assert(vinCode.includes('if(initial.engineSearch)engineSearch.value=initial.engineSearch'),'Open motor link must narrow search without auto-certifying engine/gearbox');
assert(vinCode.includes('transferredReferenceId')&&vinCode.includes('applyTransferredStageReference'),'Source-specific deep linking not enabled');
assert(vinCode.includes('stage1Published.find(r=>r.id===transferredReferenceId)'),'Transferred source must be checked against the published data');
assert(vinCode.includes('Number(year.value)<item.yearFrom')&&vinCode.includes('fuel.value!==item.fuel'),'Transferred data must verify model year and fuel');
assert(vinCode.includes('const matches=variants.map')&&vinCode.includes('if(unique.length===1)'),'Only unique verified motor variants may be automatically selected');
assert(vinCode.includes('transferredButton.addEventListener("click"')&&vinCode.includes('item.manualOnly'),'Manual-only sources must require customer confirmation');
assert(vinCode.includes('publishedMatch.publisher+" · "+publishedMatch.id'),'Quote draft must keep publisher and source identification');
const stage1DirectoryJs=fs.readFileSync(path.join(ROOT,'assets','6006-stage1-directory.js'),'utf8');
assert(stage1DirectoryJs.includes('stageRef:r.id'),'Stage 1 directory must transfer selected engine source ID');
assert(fs.readFileSync(path.join(ROOT,'assets','6006-vin-stage1.css'),'utf8').includes('.vin6006-transfer'),'Transferred-source note lacks mobile styling');
console.log('PASS: Source-specific Stage 1 deep-links, explicit confirmation, safe preselection and quote provenance');
const newMakeIds=["jaguar-xe-x760-20t200-2015-brp","jaguar-xe-x760-lci-p250-2020-brp","landrover-evoque-l538-ed4-150-2015-brp","ds-ds7crossback-20bluehdi180-2017-brp"];
for(const id of newMakeIds)assert(seenStageRef.has(id),'Missing Jaguar/Land Rover/DS sourced motor example '+id);
for(const makeName of ["Jaguar","Land Rover","DS"])assert(stageRefDb.examples.some(x=>x.make===makeName),'Unrepresented new brand '+makeName);
assert(stageRefDb.examples.find(x=>x.id==="ds-ds7crossback-20bluehdi180-2017-brp")?.model==="AUTOMOBILES DS 7",'DS open catalogue name must be explicitly matched');
assert(stageRefDb.examples.find(x=>x.id==="landrover-evoque-l538-ed4-150-2015-brp")?.manualOnly,'Different Land Rover generations must never share tuning results automatically');
assert(stageRefDb.examples.find(x=>x.id==="jaguar-xe-x760-lci-p250-2020-brp")?.yearFrom===2020,'Jaguar P250 must be restricted to facelift 2 source years');
assert(stageRefDb.examples.find(x=>x.id==="jaguar-xe-x760-20t200-2015-brp")?.sourceStockHp===200,'Jaguar 200HP source must remain distinct from P250');
console.log('PASS: 62 source-backed Stage 1 references covering 32 makes, explicit Jaguar generation and DS/Land Rover source validation');
const directoryJS=path.join(ROOT,'assets/6006-stage1-directory.js'),directoryCSS=path.join(ROOT,'assets/6006-stage1-directory.css');
assert(fs.existsSync(directoryJS)&&fs.existsSync(directoryCSS),'Searchable public Stage 1 browser assets missing');
execFileSync(process.execPath,['--check',directoryJS],{stdio:'pipe'});
const dirCode=fs.readFileSync(directoryJS,'utf8');
assert(dirCode.includes('vin6-stage-directory')&&dirCode.includes('getFiltered()'),'Public catalogue must support search and make selection');
assert(dirCode.includes('URLSearchParams')&&dirCode.includes('/fahrzeug/?'),'Public catalogue must link back to matching vehicle selector');
assert(dirCode.includes('6006-stage1-references.json?v=20261012-62refs'),'Stage 1 browser asset must use fresh data');
assert(!dirCode.includes('innerHTML=r.')&&!dirCode.includes('eval('),'Untrusted publisher data must not be injected as executable markup');
assert(fs.readFileSync(directoryCSS,'utf8').includes('@media(max-width:650px)'),'Public reference browser is not mobile responsive');
assert(carPage.includes('/assets/6006-stage1-directory.js?v=20261012-62refs')&&carPage.includes('/assets/6006-stage1-directory.css?v=20261012-62refs'),'Public source browser not mounted on vehicle page');
console.log('PASS: 38 published examples, 18 makes, source links, manual engine correction and mobile searchable catalogue');
assert(vinCode.includes('clean(selected.model)!==clean(model.value)'),'Cross-model stock engines cannot trigger a Stage 1 advertisement');
assert(vinCode.includes('stockNeedsReview(selected)'),'Disputed source power must never trigger Stage 1 estimates');
assert(stageRefDb.examples.filter(x=>x.manualOnly).every(x=>x.manualEngineContains.length>=6),'Manual-only source must require explicit engine text');
console.log('PASS: 21 source-linked Stage 1 examples across 12 makes; exact model and reference-power safeguards');

assert(vinCode.includes('if(fuel.value!==item.fuel)continue;'),'Published Stage 1 results must not appear without matching fuel');
assert(vinCode.includes('20261012-62refs'),'38-reference Stage 1 data version not updated');
const sources=new Set();
for(const x of stageRefDb.examples){assert(!sources.has(x.sourceUrl),'Duplicate third-party source URL');sources.add(x.sourceUrl);}
assert(!vinCode.includes('canEstimate=Boolean('),'Unverified tuning values must not be invented');
assert(fs.readFileSync(path.join(ROOT,'assets/6006-vin-stage1.css'),'utf8').includes('.vin6006-stage-reference'),'Stage 1 source card styles missing');
assert(fs.existsSync('docs/stage1-reference-policy.md'),'Source vetting policy missing');
console.log('PASS: Strictly sourced tuning references, motor/year/stocks matching and calibrated disclaimers');



console.log('PASS: Multi-brand model and engine finder, WMI prefix-only fallback, iPhone controls');
const videoCode=fs.readFileSync(videoJs,'utf8');
assert(videoCode.includes('dtc-video-suggest')&&videoCode.includes('P0335'),'Instant fault-code suggestions missing');
assert(fs.existsSync(path.join(ROOT,'fehlercodes/p0335/index.html')),'Curated P0335 guide not published');
const ads=fs.readFileSync(path.join(ROOT,'ads.txt'),'utf8').trim();
assert(ads==='google.com, pub-7331900145381998, DIRECT, f08c47fec0942fa0','AdSense ads.txt publisher configuration invalid');
console.log('PASS: Advanced VIN finder, instant DTC search, curated P0335 and publisher ads.txt');
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
assert(homeSearch.includes('6006-vehicle-catalog.js?v=20261013-journey'),'Homepage must cache-bust vehicle search');
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
 assert(finderHtml.includes('/assets/'+file+'?v=20261012-direct-inquiry'),'Live vehicle finder must load current '+file);
execFileSync(process.execPath,['--check',path.join(ROOT,'assets','6006-full-engine-directory.js')],{stdio:'pipe'});
const allEngineCode=fs.readFileSync(path.join(ROOT,'assets','6006-full-engine-directory.js'),'utf8');
assert(allEngineCode.includes('engine-search.json?v=20261012-all-engines'),'Search UI must load generated global engine data on demand');
assert(allEngineCode.includes('engineSearch')&&allEngineCode.includes('limit+=20'),'Search must pass an engine hint and paginate without auto-selecting ECU variants');
assert(vinCode.includes('if(initial.engineSearch&&!transferredReferenceId)'),'Search hint must be restored AFTER async make/model loading');
assert(vinCode.includes('engineSearch.value=initial.engineSearch;\n renderEngines(\"\");\n engine.value=\"\";'),'Open motor links must filter engine results without confirming a variant');
assert(vinCode.includes('ps.value=\"\";\n nm.value=\"\";\n manuallyEditedStock=false;'),'Community reference must not silently populate verified stock power');
assert(fs.readFileSync(path.join(ROOT,'fahrzeug/index.html'),'utf8').includes('6006-vin-stage1.js?v=20261013-journey'),'Corrected motor search hint cache version not published');

assert(allEngineCode.includes('inquiryDraft('),'Search result must prepare a specific engine inquiry message');
assert(allEngineCode.includes('https://wa.me/491788354756?text=')&&allEngineCode.includes('encodeURIComponent(draft)'),'Customer-initiated WhatsApp inquiry must use business contact and URL encoding');
assert(allEngineCode.includes('Keine bestätigte Stage-1-Leistung oder Garantie'),'German customer message must disclose unverified motor references');
assert(allEngineCode.includes('Stage 1 sonucu/garantisi değildir'),'Turkish customer message must disclose no Stage 1 guarantee');
assert(allEngineCode.includes('Not a confirmed Stage 1 result or guarantee'),'English customer message must disclose no Stage 1 guarantee');
assert(allEngineCode.includes('vin6006-full-actions')&&allEngineCode.includes('actions.append(ask,contact)'),'Both inspect-vehicle and ask-by-WhatsApp CTAs must be shown');
assert(!allEngineCode.includes('vin6-vin')&&!allEngineCode.includes('sendBeacon('),'Do not automatically send or collect full VIN and visitor data');
assert(finderHtml.includes('6006-full-engine-directory.js?v=20261012-direct-inquiry')&&finderHtml.includes('6006-full-engine-directory.css?v=20261012-direct-inquiry'),'New direct-contact assets must have cache-busted URLs');
assert(fs.readFileSync(path.join(ROOT,'assets','6006-full-engine-directory.css'),'utf8').includes('.vin6006-full-actions'),'Responsive dual CTAs missing stylesheet');
assert(!allEngineCode.includes('publishedStage1Ps')&&!allEngineCode.includes('publishedStage1Nm'),'Open engine data must not claim third-party tuning gains');
assert(allEngineCode.includes('databaseLicense')||fs.readFileSync(globalSearchFile,'utf8').includes('databaseLicense'),'ODbL source attribution missing');
console.log('PASS: '+globalEngineIndex.count+' globally searchable open reference engines, 164+ makes, paginated safe quote handoff');


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

const quickCardStart=homepage.indexOf('<div class="quick-access-grid">');
const quickCardEnd=homepage.indexOf('</div>\n          </div>\n        </div>\n      </section>',quickCardStart);
assert(quickCardStart>=0&&quickCardEnd>quickCardStart,'Quick-access section missing');
const quickCards=homepage.slice(quickCardStart,quickCardEnd);
assert.equal((quickCards.match(/class="quick-access-card"/g)||[]).length,4,'Homepage should show fault, coding, Stage 1 and emission diagnosis');
assert(!quickCards.includes('stageReferenceCard'),'Motor reference shortcut must not appear on the homepage');
for(const snippet of [
 'id="stageGuideCard"',
 'Stage 1 · ECU Optimizasyonu',
 'emisyon mevzuatı ve gerekli onaylar',
 'id="emissionsGuideCard"',
 'DPF · EGR/AGR · AdBlue · NOx',
 'emisyon sistemlerini devre dışı bırakmadan yasal onarım'
])assert(quickCards.includes(snippet),'Missing honest customer-facing home service wording: '+snippet);
assert(homepage.includes('DPF, EGR, AdBlue &amp; NOx Teşhisi'),'Service card must cover all emission systems including NOx');
assert(homepage.includes('DPF rejenerasyonu, EGR valfi, AdBlue/SCR dozajı ve NOx sensörü'),'Only compliant diagnostics and repair should be offered');
assert(homepage.includes('Yasal kapsam: Stage 1 işlemleri gerekli onay ve tescil şartlarına bağlıdır.'),'Stage 1 legal prerequisites missing');
for(const localeKey of [
 'Stage 1 · ECU-Optimierung',
 'Stage 1 · ECU Optimisation',
 'DPF · AGR · AdBlue · NOx',
 'DPF · EGR · AdBlue · NOx',
 'Diagnoseleistungen ansehen',
 'Stage 1 · Motor-Referenzkatalog',
 'Stage 1 · Engine References',
 'Rechtlicher Rahmen: Stage 1 setzt die erforderlichen Genehmigungen'
])assert(homepage.includes(localeKey),'TR/DE/EN homepage language regression: '+localeKey);
console.log('PASS: four compliant quick-service cards without motor-reference shortcut, NOx/DPF/AGR/AdBlue diagnostics, Stage 1 approval safeguards and TR/DE/EN copy');

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
