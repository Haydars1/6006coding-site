/* 6006 Performance: broad vehicle finder. NHTSA provides make/model names only,
   never engine codes, European trim verification or calibration results. */
(function(){
"use strict";
const extras={
"Acura":"Integra,ILX,TLX,RDX,MDX","Aixam":"City,Coupé,Crossline","Alpine":"A110,A290",
"Aston Martin":"DB9,DB11,DB12,Vantage,DBX","Bentley":"Continental GT,Flying Spur,Bentayga,Mulsanne",
"Buick":"Encore,Enclave,Regal","BYD":"Atto 3,Dolphin,Seal,Seal U,Tang",
"Cadillac":"Escalade,CT4,CT5,XT4,XT5,Lyriq","Chery":"Tiggo 4,Tiggo 7,Tiggo 8,Omoda 5",
"Chrysler":"300,Pacifica,Voyager","DAF":"LF,CF,XF,XG","Daewoo":"Matiz,Lanos,Nubira,Lacetti",
"Daihatsu":"Cuore,Sirion,Terios,Copen","Ferrari":"Roma,296,488,F8,SF90,Purosangue",
"Genesis":"G70,G80,G90,GV60,GV70,GV80","GMC":"Sierra,Yukon,Canyon,Terrain,Acadia",
"Great Wall":"Poer,Steed,Wingle","Haval":"H2,H6,Jolion,Dargo","Holden":"Commodore,Astra,Colorado",
"Hongqi":"E-HS9,H5,H9","Hummer":"H2,H3,EV",
"Infiniti":"Q30,Q50,Q60,QX30,QX50,QX70,QX80","Isuzu":"D-Max,MU-X,N-Series,F-Series",
"JAC":"T8,JS4,JS6","Lada":"Niva,Granta,Vesta,Largus",
"Lamborghini":"Huracán,Aventador,Urus,Revuelto,Temerario","Lancia":"Ypsilon,Delta,Thema",
"Leapmotor":"T03,C10","Lincoln":"Navigator,Corsair,Aviator,Nautilus",
"Lotus":"Elise,Evora,Emira,Eletre,Emeya","Lucid":"Air,Gravity",
"Mahindra":"Scorpio,XUV700,Thar","Maserati":"Ghibli,Quattroporte,Levante,Grecale,MC20",
"Maxus":"Deliver 9,eDeliver 3,T90","McLaren":"570S,720S,750S,Artura,GT",
"MG":"MG3,MG4,MG5,ZS,HS,Marvel R,Cyberster","NIO":"ET5,ET7,EL6,EL7,EL8",
"Omoda":"5,E5,7,9","Ora":"03,Funky Cat,Lightning Cat",
"Polestar":"1,2,3,4,5","Pontiac":"G6,G8,Firebird,Solstice",
"RAM":"1500,2500,3500,ProMaster","Rivian":"R1T,R1S,R2",
"Rolls-Royce":"Ghost,Phantom,Cullinan,Spectre","Rover":"25,45,75",
"Saab":"9-3,9-5,900,9000","Scania":"P-Series,G-Series,R-Series,S-Series",
"SsangYong":"Korando,Rexton,Tivoli,Musso,Torres","Tata":"Nexon,Harrier,Safari",
"TOGG":"T10X,T10F","UAZ":"Patriot,Hunter,Pickup","VinFast":"VF 6,VF 7,VF 8,VF 9",
"Voyah":"Free,Dream,Courage","Wuling":"Air EV,Bingo","XPeng":"P7,G6,G9",
"Zeekr":"001,X,7X,009",
"Abarth":"124 Spider","Alfa Romeo":"147,156,159,166,4C,Brera,Junior",
"Audi":"80,100,A2,A7,A8,Q4 e-tron,Q6 e-tron,Q8,e-tron,RS3,RS4,RS5,RS6,S3,S4,R8",
"BMW":"1 Series,2 Series,3 Series,4 Series,5 Series,6 Series,7 Series,8 Series,i3,i4,i5,i7,iX,iX1,X2,X4,X7,XM,Z4,M2,M3,M4,M5,320i,320d,330d,530d",
"Citroën":"C2,C3 Aircross,C4 Picasso,C5,C6,DS3,DS4,DS5,SpaceTourer",
"Dacia":"Spring,Bigster,Lodgy","Fiat":"500X,500L,600,Grande Punto,Punto,Bravo,Stilo,Scudo",
"Ford":"Ka,Fusion,EcoSport,S-MAX,Galaxy,Edge,Explorer,Bronco,F-150,Tourneo,Transit Custom",
"Honda":"Accord,City,Prelude,FR-V,Insight,HR-V,ZR-V,Pilot",
"Hyundai":"i40,ix20,ix35,Bayon,IONIQ,IONIQ 5,IONIQ 6,Nexo,Staria,Veloster",
"Jeep":"Avenger,Cherokee,Gladiator,Patriot","Kia":"Rio,Stonic,Venga,Optima,Stinger,Soul,EV3,EV9",
"Land Rover":"Freelander,Discovery Sport,Range Rover,Range Rover Velar",
"Lexus":"IS,GS,LS,RC,LC,CT,LBX,GX,LX,RZ",
"Mazda":"MX-5,CX-3,CX-50,CX-80,RX-7,RX-8,BT-50",
"Mercedes-Benz":"190,C-Class,E-Class,S-Class,CLA,CLS,CLE,GLB,GLK,GLS,G-Class,SL,AMG GT,EQA,EQB,EQC,EQE,EQS,EQV,Citan,V-Class,Actros,Atego,E 200,E 220 d,E 300 de,E 53 AMG,C 220 d,W204,W205,W206,W212,W213,W214",
"MINI":"Cooper,Cooper S,John Cooper Works,Cabrio,Paceman",
"Mitsubishi":"Colt,Lancer,Eclipse Cross,Pajero,Grandis",
"Nissan":"Almera,Note,Pulsar,Primera,Altima,Patrol,Ariya,350Z,370Z,GT-R",
"Opel":"Adam,Karl,Meriva,Vectra,Omega,Crossland,Combo,Ampera,Antara,Frontera",
"Peugeot":"106,206,207,2008,301,306,307,407,408,508,807,Partner,Traveller",
"Porsche":"718 Boxster,718 Cayman,Boxster,Cayman",
"Renault":"Twingo,Laguna,Talisman,Kadjar,Koleos,Zoe,Espace,Kangoo,Symbioz,Rafale",
"Škoda":"Citigo,Rapid,Roomster,Yeti,Enyaq,Elroq",
"Subaru":"BRZ,Legacy,XV,Levorg,WRX,Solterra",
"Suzuki":"Alto,Ignis,Baleno,Splash,SX4,Across,Swace",
"Tesla":"Cybertruck,Roadster",
"Toyota":"Aygo,Aygo X,Auris,Avensis,Camry,Prius,Verso,Hilux,Supra,GR86,bZ4X,Highlander",
"Volkswagen":"Up!,Lupo,Fox,Bora,Jetta,Beetle,Scirocco,Sharan,ID.3,ID.4,ID.5,ID.7,ID.Buzz,Amarok,Crafter,T4,T5,T6,Multivan,California,Golf IV,Golf V,Golf VI,Golf VII,Golf VIII,Golf 7,Golf 8,Passat B5,Passat B6,Passat B7,Passat B8,Passat B9",
"Volvo":"S40,S60,S80,S90,V50,V70,XC70,C30,EX30,EX40,EX90,FH,FM"
};
const seed={};Object.keys(extras).forEach(k=>seed[k]=extras[k].split(","));
const makes=new Set(Object.keys(seed)), remote=new Map(), pending=new Map();
const openSlugs=new Map(),openModels=new Map(),openPending=new Map();
let openIndexPromise;
const alias={"vw":"Volkswagen","mercedes":"Mercedes-Benz","benz":"Mercedes-Benz","skoda":"Škoda","citroen":"Citroën","range rover":"Land Rover","landrover":"Land Rover","chevy":"Chevrolet","vauxhall":"Opel","ds":"DS Automobiles","seat":"SEAT"};
const norm=s=>String(s||"").toLowerCase().replace(/ı/g,"i").replace(/ß/g,"ss").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
const homeDirectory=()=>typeof vehicleDirectory==="undefined"?{}:vehicleDirectory;
const homeExamples=()=>typeof vehicles==="undefined"?[]:vehicles;
const brands=()=>[...new Set([...makes,...Object.keys(homeDirectory())])];
const models=brand=>[...new Set([...(seed[brand]||[]),...(homeDirectory()[brand]||[]),...homeExamples().filter(x=>x.brand===brand).map(x=>x.name),...(remote.get(brand)||[])])].sort((a,b)=>a.localeCompare(b,"de",{numeric:true}));
async function get(url){
 const ctrl=new AbortController(), timer=setTimeout(()=>ctrl.abort(),7000);
 try{const r=await fetch(url,{signal:ctrl.signal,mode:"cors"});if(!r.ok)throw Error("vPIC");const v=await r.json();return Array.isArray(v.Results)?v.Results:[];}
 finally{clearTimeout(timer);}
}
function fromCache(k){try{let v=JSON.parse(sessionStorage.getItem("6006-vpic:"+k)||"null");return v&&Date.now()-v.at<604800000?v.data:null;}catch(_){return null;}}
function cache(k,data){try{sessionStorage.setItem("6006-vpic:"+k,JSON.stringify({at:Date.now(),data}));}catch(_){}}
const canonical=name=>[...makes].find(m=>norm(m)===norm(name))||name.toLowerCase().replace(/(^|\s|-)\S/g,s=>s.toUpperCase());
let makesPromise;
function loadMakes(){
 if(makesPromise)return makesPromise;
 makesPromise=(async()=>{
  let names=fromCache("makes");if(!names){names=(await get("https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json")).map(x=>x.MakeName).filter(Boolean);cache("makes",names);}
  names.forEach(n=>makes.add(canonical(n)));dispatchEvent(new Event("6006-makes-ready"));
 })().catch(()=>{});
 return makesPromise;
}
function loadOpenIndex(){
 if(openIndexPromise)return openIndexPromise;
 openIndexPromise=(async()=>{
   const response=await fetch("/assets/vehicle-data/index.json",{cache:"force-cache"});
   if(!response.ok)throw Error("No on-site ODbL catalogue");
   const data=await response.json();
   for(const group of data.makes||[])for(const name of group.makes||[]){
     const brand=canonical(name);makes.add(brand);openSlugs.set(norm(brand),group.slug);
   }
   dispatchEvent(new Event("6006-makes-ready"));
   return data;
 })().catch(()=>null);
 return openIndexPromise;
}
function loadOpenBrand(brand){
 if(!brand)return Promise.resolve();
 const k=norm(brand);
 if(openModels.has(k))return Promise.resolve(openModels.get(k));
 if(openPending.has(k))return openPending.get(k);
 const task=(async()=>{
   await loadOpenIndex();
   const slug=openSlugs.get(k);
   if(!slug)return null;
   const response=await fetch("/assets/vehicle-data/"+encodeURIComponent(slug)+".json",{cache:"force-cache"});
   if(!response.ok)throw Error("Reference data not found");
   const data=await response.json();
   const found=(data.models||[]).filter(x=>norm(x.make)===k);
   openModels.set(k,found);
   remote.set(brand,[...new Set([...(remote.get(brand)||[]),...found.map(x=>x.name)])]);
   dispatchEvent(new CustomEvent("6006-models-ready",{detail:{brand}}));
   dispatchEvent(new CustomEvent("6006-engines-ready",{detail:{brand}}));
   return found;
 })().catch(()=>null);
 openPending.set(k,task);return task;
}
function referencePowerNeedsReview(variant){
 const hp=Number(variant.hp),label=String(variant.engine||'');
 if(/hybrid|phev|mhev|e-tsi|etsi/i.test(label+' '+(variant.fuel||'')))return true;
 const named=label.match(/\b(\d{2,4})\s*(?:hp|bhp|ps)\b/i);
 return !!(named&&hp>0&&Math.abs(Number(named[1])-hp)>Math.max(3,Number(named[1])*.03));
}
function engineVariants(brand,model,year){
 const entries=openModels.get(norm(brand))||[];
 const q=norm(model);
 if(!q)return [];
 const matched=entries.filter(x=>{const name=norm(x.name);return name===q||(q.length>=3&&(name.includes(q)||q.startsWith(name+" ")));});
 const y=Number(year)||0,result=[];
 for(const item of matched)for(const engine of item.engines||[]){
   const first=Number(engine.from)||Number(item.from)||0,last=Number(engine.to)||Number(item.to)||9999;
   if(y&&(y<first||y>last))continue;
   result.push({...engine,model:item.name});
 }
 return result;
}
function loadModels(brand){
 if(!brand)return Promise.resolve();
 loadOpenBrand(brand);
 if(pending.has(brand))return pending.get(brand);
 const task=(async()=>{
  let names=fromCache("model:"+brand);
  if(!names){names=(await get("https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/"+encodeURIComponent(brand)+"?format=json")).map(x=>x.Model_Name).filter(Boolean);cache("model:"+brand,names);}
  remote.set(brand,[...new Set([...(remote.get(brand)||[]),...names.filter(x=>typeof x==="string"&&x.length<=70)])]);dispatchEvent(new CustomEvent("6006-models-ready",{detail:{brand}}));
 })().catch(()=>{});
 pending.set(brand,task);return task;
}
// Search all makes by model, so 'Golf', 'Passat', 'X5', etc. work without a make.
function searchModels(input,limit=12){
 const q=norm(input);if(q.length<2)return [];
 const makeNames=[...Object.entries(alias),...brands().map(b=>[b,b])].sort((a,b)=>norm(b[0]).length-norm(a[0]).length);
 const named=makeNames.find(([name])=>q===norm(name)||q.startsWith(norm(name)+" "));
 const selectedBrand=named?.[1]||"",term=named?q.slice(norm(named[0]).length).trim():q;
 if(!term)return selectedBrand?[{brand:selectedBrand,model:"",score:125}]:[];
 const found=[];
 for(const brand of selectedBrand?[selectedBrand]:brands()){
  for(const model of models(brand)){
   const n=norm(model);if(!n)continue;
   let score=0;
   if(n===term)score=120;
   else if(n.startsWith(term+" "))score=110;
   else if(n.startsWith(term))score=90;
   else if(term.startsWith(n+" "))score=75;
   else if(n.includes(" "+term))score=60;
   else if(term.length>=3&&term.split(" ").every(t=>t.length>=2&&n.includes(t)))score=42;
   if(score)found.push({brand,model,score});
  }
 }
 found.sort((a,b)=>b.score-a.score||a.model.length-b.model.length||a.brand.localeCompare(b.brand,"de")||a.model.localeCompare(b.model,"de",{numeric:true}));
 const items=[],seen=new Set();
 for(const item of found){
  const key=norm(item.brand)+"|"+norm(item.model);
  if(seen.has(key))continue;seen.add(key);items.push(item);
  if(items.length>=limit)break;
 }
 return items;
}
function match(input){
 const list=searchModels(input,1);
 if(list.length)return {brand:list[0].brand,model:list[0].model};
 const q=norm(input),m=[...Object.entries(alias),...brands().map(x=>[x,x])].find(([s])=>norm(s)===q);
 return m?{brand:m[1],model:""}:null;
}
const word={
 tr:{year:"Model yılı",fuel:"Yakıt",engine:"Motor / motor kodu",power:"Stok güç (PS)",gear:"Şanzıman",find:"Araç bul",manual:"Modeli ekle",missing:"Model listede yoksa buraya yazın",missingBrand:"Marka listede yoksa buraya yazın",addBrand:"Markayı ekle",hint:"Örn. VW Golf, BMW X5, Mercedes E 220 d",choose:"Seçin",result:"Araç seçildi",error:"Araç bulunamadı. Listeden seçin veya modeli elle ekleyin.",notice:"Aracına uygun yazılım ve kodlama seçenekleri için yıl, yakıt, motor kodu ve şanzıman bilgilerini tamamla. Stok güç yalnızca motor varyantını ayırt etmeye yardımcı olur."},
 de:{year:"Baujahr",fuel:"Kraftstoff",engine:"Motor / Motorkennbuchstabe",power:"Serienleistung (PS)",gear:"Getriebe",find:"Fahrzeug finden",manual:"Modell hinzufügen",missing:"Modell nicht da? Hier eingeben",missingBrand:"Marke fehlt? Hier eingeben",addBrand:"Marke hinzufügen",hint:"Z. B. VW Golf, BMW X5, Mercedes E 220 d",choose:"Wählen",result:"Fahrzeug gewählt",error:"Kein Treffer. Fahrzeug auswählen oder manuell ergänzen.",notice:"Baujahr, Kraftstoff, Motorkennung und Getriebe helfen, passende Software- und Codiermöglichkeiten einzuordnen. Die Serienleistung dient nur zur Zuordnung der Motorvariante."},
 en:{year:"Model year",fuel:"Fuel",engine:"Engine / engine code",power:"Stock power (PS)",gear:"Transmission",find:"Find vehicle",manual:"Add model",missing:"Model missing? Enter it here",missingBrand:"Make missing? Enter it here",addBrand:"Add make",hint:"e.g. VW Golf, BMW X5, Mercedes E 220 d",choose:"Select",result:"Vehicle selected",error:"No match. Choose from lists or add model manually.",notice:"Add year, fuel, engine code and gearbox to identify suitable software and coding options. Stock power only helps distinguish the engine variant."}
};
function lang(){const v=String(window.Locale6006?.getLanguage?.()||document.documentElement.lang||"").slice(0,2);return word[v]?v:"de";}
const tr=k=>word[lang()][k];
const field=id=>{const e=document.getElementById(id);return e?e.value.trim():"";};
const variantIdentity=v=>v?JSON.stringify([v.model||"",v.generation||"",v.engine||"",v.fuel||"",v.transmission||"",v.from||"",v.to||"",v.hp??"",v.nm??""]):"";
let homeVariant=null,homeExtraProfile=null;
function sameHomeProfile(profile){return profile&&norm(profile.brand)===norm(field("brandSelect"))&&norm(profile.model)===norm(field("modelSelect"))&&String(profile.year||"")===field("yearSelect")&&norm(profile.engine)===norm(field("engineInput"));}
function details(){return [["yearSelect","year"],["fuelSelect","fuel"],["engineInput","engine"],["powerInput","power"],["gearboxSelect","gear"]].map(x=>field(x[0])?tr(x[1])+": "+field(x[0]):"").filter(Boolean).join(" · ");}
function params(){const q=new URLSearchParams();[["yearSelect","year"],["fuelSelect","powertrain"],["engineInput","engine"],["powerInput","ps"],["gearboxSelect","gearbox"]].forEach(x=>{if(field(x[0]))q.set(x[1],field(x[0]));});
 const selected=sameHomeProfile(homeVariant)?homeVariant.variant:null;
 const extra=selected?{nm:selected.nm,generation:selected.generation,gearbox:selected.transmission,variantKey:variantIdentity(selected)}:sameHomeProfile(homeExtraProfile)?homeExtraProfile:{};
 for(const key of ["nm","generation","gearbox","variantKey"])if(extra[key])q.set(key,String(extra[key]));
 if(selected&&Number(field("powerInput"))!==Math.round(Number(selected.hp)*1.01387))q.set("manuallyEditedStock","1");
 return q;}
function install(){
 const brand=document.getElementById("brandSelect"), model=document.getElementById("modelSelect"), grid=document.querySelector(".estimate-card .select-grid");
 if(!brand||!model||!grid||document.getElementById("yearSelect"))return;
 const box=document.createElement("div");box.className="vehicle-discovery";
 box.innerHTML='<div class="vehicle-find"><label for="vehicleQuickSearch"></label><div class="vehicle-find-row"><input id="vehicleQuickSearch" type="search" autocomplete="off" spellcheck="false"><button type="button" id="vehicleFindButton"></button></div><small role="status" id="vehicleFindMessage" aria-live="polite"></small></div>'
 +'<div class="vehicle-extra">'
 +'<div class="field"><label for="yearSelect"></label><select id="yearSelect"><option value=""></option></select></div>'
 +'<div class="field"><label for="fuelSelect"></label><select id="fuelSelect"><option value=""></option><option value="Benzin">Benzin / Petrol</option><option value="Diesel">Diesel / Dizel</option><option value="Hybrid">Hybrid / Hibrit</option><option value="Plug-in-Hybrid">Plug-in-Hybrid</option><option value="Electric">Elektro / Elektrik</option><option value="LPG">LPG</option><option value="CNG">CNG</option></select></div>'
 +'<div class="field"><label for="engineInput"></label><input id="engineInput" type="text" maxlength="90" placeholder="2.0 TDI CRLB"></div>'
 +'<div class="field"><label for="powerInput"></label><input id="powerInput" type="number" min="1" max="3000" inputmode="numeric" placeholder="150"></div>'
 +'<div class="field"><label for="gearboxSelect"></label><select id="gearboxSelect"><option value=""></option><option value="Manuel">Manuel / Schaltgetriebe</option><option value="Otomatik">Otomatik / Automatik</option><option value="DSG/DCT">DSG / DCT</option><option value="CVT">CVT</option></select></div></div>'
 +'<div class="vehicle-manual"><label for="customBrandInput"></label><div class="vehicle-find-row"><input id="customBrandInput" type="text" maxlength="80"><button id="customBrandButton" type="button"></button></div></div>'
 +'<div class="vehicle-manual"><label for="customModelInput"></label><div class="vehicle-find-row"><input id="customModelInput" type="text" maxlength="90"><button id="customModelButton" type="button"></button></div></div>'
 +'<p class="vehicle-note" id="vehicleDiscoveryNote"></p>';
 grid.parentNode.insertBefore(box,grid);
 const extraBox=document.createElement("div");extraBox.className="vehicle-discovery";
 [".vehicle-extra",".vehicle-manual",".vehicle-note"].forEach(selector=>{while(box.querySelector(selector))extraBox.appendChild(box.querySelector(selector));});
 grid.insertAdjacentElement("afterend",extraBox);
 const styles=document.createElement("style");styles.id="vehicle-discovery-css";styles.textContent=".vehicle-discovery{padding:.5rem 0 0}.vehicle-find{margin:0 0 1rem}.vehicle-find-row{display:flex;gap:.5rem}.vehicle-discovery input{width:100%;min-width:0;min-height:3.05rem;padding:.6rem .7rem;border:1px solid rgba(242,238,229,.3);border-radius:3px;background:#171816;color:#f3eee4;font-size:.8rem}.vehicle-discovery label{display:block;margin:0 0 .42rem;color:#dfbd8a;font-size:.68rem}.vehicle-discovery button{flex-shrink:0;min-height:3rem;padding:0 .85rem;background:#c69a63;color:#161310;border:0;border-radius:3px;font-size:.7rem;font-weight:700;cursor:pointer}.vehicle-discovery button:hover{background:#e0bd89}.vehicle-extra{display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:.25rem 0 1rem}.vehicle-extra .field{min-width:0}.vehicle-manual{margin:.35rem 0}.vehicle-note,.vehicle-find small{display:block;min-height:1.2rem;margin:.4rem 0;color:#c6bbab;font-size:.68rem;line-height:1.55}.vehicle-note{margin:.55rem 0 1rem}.vehicle-find-row input{flex:1}@media(max-width:600px){.vehicle-extra{grid-template-columns:1fr}.vehicle-find-row button{padding:0 .75rem;font-size:.76rem}.vehicle-discovery input,.vehicle-discovery select{font-size:16px!important}.vehicle-discovery .vehicle-find-row{display:grid;grid-template-columns:minmax(0,1fr) auto}.vehicle-discovery .vehicle-find-row input{min-width:0}}#vehicleQuickConfirmation[hidden]{display:none!important}";document.head.append(styles);

 // A visible, actionable step immediately after model search.
 const confirmation=document.createElement("div");confirmation.id="vehicleQuickConfirmation";
 confirmation.hidden=true;confirmation.setAttribute("role","status");confirmation.setAttribute("aria-live","polite");
 confirmation.style.cssText="margin:.7rem 0 .95rem;padding:13px 14px;border:1px solid #d2a76f;border-radius:7px;background:#35291b;color:#f9e8d2;display:grid;gap:8px";
 const confirmedTitle=document.createElement("strong");confirmedTitle.id="vehicleQuickConfirmationTitle";
 confirmedTitle.style.cssText="color:#ffd9a2;font-size:.88rem;line-height:1.5";
 const confirmedDescription=document.createElement("p");confirmedDescription.id="vehicleQuickConfirmationHelp";
 confirmedDescription.style.cssText="margin:0;font-size:.79rem;line-height:1.5;color:#e0d2c2";
 const confirmedButton=document.createElement("button");confirmedButton.id="vehicleQuickNext";confirmedButton.type="button";
 confirmedButton.style.cssText="min-height:46px;width:100%;padding:9px 12px;font-weight:800;font-size:.85rem";
 confirmation.append(confirmedTitle,confirmedDescription,confirmedButton);box.append(confirmation);
 function showQuickResult(){
  if(confirmation.hidden)return;
  if(!brand.value||!model.value){confirmation.hidden=true;return;}
  const pickedYear=field("yearSelect"),variant=document.getElementById("engineVariantSelect");
  const hasEngines=variant&&!variant.hidden&&variant.options.length>1;
  const l=lang();
  confirmedTitle.textContent=(l==="tr"?"✓ Araç bulundu: ":l==="de"?"✓ Fahrzeug gefunden: ":"✓ Vehicle found: ")+brand.value+" "+model.value;
  let next,description,label;
  if(!pickedYear){
   next=document.getElementById("yearSelect");
   description=l==="tr"?"Şimdi model yılını seçin. Sonrasında uygun motor varyantlarını göstereceğiz.":l==="de"?"Jetzt das Baujahr auswählen. Danach werden passende Motoren angezeigt.":"Choose model year to see available engine variants.";
   label=l==="tr"?"1. Model yılını seç →":l==="de"?"1. Baujahr auswählen →":"1. Select year →";
  } else if(hasEngines){
   next=variant;
   description=l==="tr"?"Motor varyantları listelendi. Motorunu seç; stok PS bilgisi varsa otomatik doldurulacak.":l==="de"?"Motorvarianten geladen. Den passenden Motor wählen.":"Engine variants loaded; choose your matching engine.";
   label=l==="tr"?"2. Motorunu seç →":l==="de"?"2. Motor auswählen →":"2. Select engine →";
  } else {
   next=document.getElementById("engineInput");
   description=l==="tr"?"Bu yıl/model için motor listede yok. Motor kodunu elle girerek devam et.":l==="de"?"Motorvariante nicht gelistet. Motorkennbuchstabe eingeben.":"Engine not listed; enter the code manually.";
   label=l==="tr"?"Motor kodunu gir →":l==="de"?"Motorkennbuchstabe eingeben →":"Enter engine code →";
  }
  confirmedDescription.textContent=description;confirmedButton.textContent=label;
  confirmedButton.onclick=()=>{document.getElementById("vehicleQuickSearch")?.blur();next.scrollIntoView({behavior:"smooth",block:"center"});try{next.focus({preventScroll:true})}catch(e){next.focus()}};
 }
 const year=document.getElementById("yearSelect");for(let y=new Date().getFullYear()+1;y>=1950;y--){const option=new Option(String(y),String(y));year.add(option);}
 const motorSamples={
   "Volkswagen":["1.0 TSI","1.2 TSI","1.4 TSI","1.5 TSI","1.6 TDI","2.0 TDI","2.0 TSI","3.0 TDI"],
   "Audi":["1.4 TFSI","1.5 TFSI","2.0 TFSI","1.6 TDI","2.0 TDI","3.0 TDI"],
   "BMW":["B47 2.0d","B48 2.0i","B57 3.0d","B58 3.0i","N47 2.0d","N57 3.0d"],
   "Mercedes-Benz":["OM651 2.1 CDI","OM654 2.0 d","OM656 3.0 d","M254 2.0 Benzin","M256 3.0 Benzin","M177 4.0 V8"],
   "Ford":["1.0 EcoBoost","1.5 EcoBlue","2.0 EcoBlue","2.0 EcoBoost"],
   "Opel":["1.4 Turbo","1.5 Diesel","1.6 CDTI","2.0 CDTI"],
   "Peugeot":["1.2 PureTech","1.5 BlueHDi","2.0 BlueHDi"],
   "Toyota":["1.8 Hybrid","2.0 Hybrid","2.8 D-4D"]
 };
 const engines=document.createElement("datalist");engines.id="vehicle-engine-examples";document.body.append(engines);
 document.getElementById("engineInput").setAttribute("list",engines.id);
 function engineSuggestions(){engines.replaceChildren();(motorSamples[brand.value]||[]).forEach(value=>engines.append(new Option(value,value)));}
 const variantField=document.createElement("div");variantField.className="field";variantField.innerHTML='<label for="engineVariantSelect" id="engineVariantLabel">Motorvariante · Open Data</label><select id="engineVariantSelect"><option value="">—</option></select>';
 const yearField=document.getElementById("yearSelect").closest(".field");yearField?.insertAdjacentElement("afterend",variantField);
 const variantSelect=document.getElementById("engineVariantSelect");
 const powerNote=document.createElement('p');powerNote.id='enginePowerNote';powerNote.setAttribute('role','status');powerNote.hidden=true;variantField.append(powerNote);
 let powerReview=false;
 function updatePowerNote(){powerNote.hidden=!powerReview;powerNote.textContent=lang()==='tr'?'Güç verisi belirsiz: kaynak alanları uyuşmuyor veya hibrit motor/toplam sistem gücü ayrımı gerekli. Ruhsattaki doğrulanmış stok PS değerini elle girin.':lang()==='de'?'Leistungsangabe unklar: Quellfelder weichen ab oder Hybrid-Motor- und Systemleistung müssen unterschieden werden. Bestätigte Serienleistung in PS anhand der Fahrzeugunterlagen selbst eintragen.':'Power reference needs review: source fields differ or hybrid engine and total system power need distinction. Enter confirmed stock PS from the vehicle documents.';}
 let selectedVariants=[],pendingVariantKey="";
 function variantOptions(){
   selectedVariants=engineVariants(brand.value,model.value,field("yearSelect"));
   variantSelect.replaceChildren(new Option("—",""));
   selectedVariants.forEach((v,index)=>{
     const label=(v.generation?v.generation+" · ":"")+v.engine+(v.hp&&!referencePowerNeedsReview(v)?" · "+v.hp+" HP":"")+(v.nm?" · "+v.nm+" Nm":"");
     variantSelect.add(new Option(label.slice(0,155),String(index)));
   });
   const savedKey=sameHomeProfile(homeVariant)?variantIdentity(homeVariant.variant):pendingVariantKey;
   const restored=savedKey?selectedVariants.map((v,index)=>({v,index})).filter(x=>variantIdentity(x.v)===savedKey):[];
   if(restored.length===1){
     const {v,index}=restored[0];variantSelect.value=String(index);
     homeVariant={brand:brand.value,model:model.value,year:field("yearSelect"),engine:v.engine,variant:v};pendingVariantKey="";
     save();
   }
   variantField.hidden=selectedVariants.length===0;
   showQuickResult();
 }
 function updateVariants(){
   engineSuggestions();loadOpenBrand(brand.value).then(variantOptions);variantOptions();
 }
 variantSelect.addEventListener("change",()=>{
   if(!variantSelect.value){homeVariant=null;homeExtraProfile=null;pendingVariantKey="";return;}
   const variant=selectedVariants[Number(variantSelect.value)];if(!variant)return;
   document.getElementById("engineInput").value=variant.engine;
   homeVariant={brand:brand.value,model:model.value,year:field("yearSelect"),engine:variant.engine,variant};homeExtraProfile=null;pendingVariantKey="";
   powerReview=referencePowerNeedsReview(variant);updatePowerNote();
   document.getElementById("powerInput").value=variant.hp&&!powerReview?String(Math.round(variant.hp*1.01387)):'';
   if(variant.fuel){
     const str=variant.fuel.toLowerCase();const fuel=str.includes("diesel")?"Diesel":str.includes("electric")?"Electric":str.includes("hybrid")?"Hybrid":"Benzin";
     document.getElementById("fuelSelect").value=fuel;
   }
   if(variant.transmission){
     const k=variant.transmission.toLowerCase();
     document.getElementById("gearboxSelect").value=/dct|dsg|dual/.test(k)?"DSG/DCT":/manual|mt/.test(k)?"Manuel":/cvt/.test(k)?"CVT":"Otomatik";
   }
   model.dispatchEvent(new Event("change",{bubbles:true}));
 });
 [brand,model,document.getElementById("yearSelect")].forEach(el=>el.addEventListener("change",()=>{updateVariants();showQuickResult();}));
 addEventListener("6006-engines-ready",event=>{if(event.detail?.brand===brand.value)variantOptions();});
 updateVariants();
 brand.addEventListener("change",engineSuggestions);
 const tech=document.createElement("section");tech.id="vehicle-service-overview";tech.style.cssText="margin:1rem 0;padding:1rem;border:1px solid rgba(198,154,99,.43);background:#1b1a18;font-size:.76rem;line-height:1.68;color:#f0e9df";
 tech.setAttribute("aria-live","polite");
 extraBox.insertAdjacentElement("afterend",tech);
 function serviceAdvice(){
  const modelName=model.value,make=brand.value,engine=field("engineInput"),fuel=field("fuelSelect"),power=field("powerInput");
  if(!make||!modelName){tech.hidden=true;return;}
  tech.hidden=false;
  const langCode=lang();
  const electrical=/^(Electric)$/i.test(fuel)||/\b(EV|Elektro)\b/i.test(engine);
  const copy=langCode==="tr"
   ?{head:"Bu araç için yazılım ve kodlama",selected:"Seçilen araç",unknown:"Motor bilgisi henüz tamamlanmadı",task:"Neler yapılabilir?",steps:["Motor yazılımı: ECU sürümünün ve mevcut kalibrasyonun incelenmesi.","Araç kodlama: desteklenen konfor ve kişiselleştirme işlevlerinin belirlenmesi.","Arıza teşhisi: kayıtlı hataların ve canlı ölçümlerin birlikte değerlendirilmesi.","Teknik inceleme: uygun işlevlerin ve kapsamın araç özelinde açıklanması."],ev:"Elektrikli araçlarda da yazılım sürümü, arıza kayıtları ve desteklenen kişiselleştirme seçenekleri incelenir.",estimate:"Desteklenen işlevler donanıma, kontrol ünitesine ve yazılım sürümüne bağlıdır; kesin kapsam araç kontrolünden sonra belirlenir."}
   :langCode==="de"
   ?{head:"Software & Codierung für Ihr Fahrzeug",selected:"Gewähltes Fahrzeug",unknown:"Motorangaben noch unvollständig",task:"Was ist möglich?",steps:["Motorsoftware: Softwarestand und vorhandene Steuergeräte-Abstimmung prüfen.","Fahrzeugcodierung: unterstützte Komfortfunktionen und persönliche Einstellungen zuordnen.","Fehlerdiagnose: Fehlerspeicher und Live-Messwerte zusammen auswerten.","Technischer Überblick: passende Funktionen und Umfang fahrzeugspezifisch erläutern."],ev:"Auch bei Elektrofahrzeugen lassen sich Softwarestand, Fehler und unterstützte Fahrzeugeinstellungen einordnen.",estimate:"Welche Funktionen verfügbar sind, hängt von Ausstattung, Steuergerät und Softwareversion ab. Der genaue Umfang wird am Fahrzeug geklärt."}
   :{head:"Software and coding for your vehicle",selected:"Selected vehicle",unknown:"Engine details are incomplete",task:"What can be checked?",steps:["Engine software: review the software revision and existing control-module calibration.","Vehicle coding: identify supported comfort features and personal settings.","Fault diagnosis: evaluate stored faults alongside live measurements.","Technical overview: explain supported features and scope for the selected vehicle."],ev:"Electric vehicles can also be assessed for software revision, fault records and supported settings.",estimate:"Available features depend on equipment, control modules and software version. The actual scope is confirmed on the vehicle."};
  const safe=x=>String(x||"").replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  tech.innerHTML="<strong style='color:#e0bd89;display:block;font-size:.82rem'>"+copy.head+"</strong><p>"+copy.selected+": <b>"+safe(make+" "+modelName)+"</b> · "+safe(engine||fuel||copy.unknown)+(power?" · "+safe(power)+" PS":"")+"</p><strong>"+copy.task+"</strong><ol style='padding-left:1.2rem'>"+copy.steps.map(x=>"<li>"+x+"</li>").join("")+"</ol><p>"+(electrical?copy.ev:copy.estimate)+"</p>";
 }
 [brand,model,...["yearSelect","fuelSelect","engineInput","powerInput","gearboxSelect"].map(id=>document.getElementById(id))].forEach(e=>e.addEventListener("change",serviceAdvice));
 serviceAdvice();engineSuggestions();
 function applyWords(){
   [["yearSelect","year"],["fuelSelect","fuel"],["engineInput","engine"],["powerInput","power"],["gearboxSelect","gear"],["customModelInput","missing"],["customBrandInput","missingBrand"],["vehicleQuickSearch","find"]].forEach(x=>document.querySelector('label[for="'+x[0]+'"]').textContent=tr(x[1]));
   document.getElementById("vehicleFindButton").textContent=tr("find");document.getElementById("customModelButton").textContent=tr("manual");document.getElementById("customBrandButton").textContent=tr("addBrand");
   document.getElementById("vehicleQuickSearch").placeholder=tr("hint");document.getElementById("vehicleDiscoveryNote").textContent=tr("notice");
   ["yearSelect","fuelSelect","gearboxSelect"].forEach(id=>document.getElementById(id).options[0].textContent=tr("choose"));
   const variantLabel=document.getElementById("engineVariantLabel");if(variantLabel)variantLabel.textContent=lang()==="tr"?"Motor varyantı · açık veri":lang()==="de"?"Motorvariante · offene Fahrzeugdaten":"Engine variant · open reference data";
   updatePowerNote();
   serviceAdvice();
 }
 applyWords();new MutationObserver(applyWords).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
 const feedback=document.getElementById("vehicleFindMessage");
 function selectCar(result){
   if(!result||!result.brand){feedback.textContent=tr("error");confirmation.hidden=true;return;}
   if(brand.value!==result.brand||model.value!==(result.model||"")){
     for(const id of ["yearSelect","fuelSelect","engineInput","powerInput","gearboxSelect"]){const e=document.getElementById(id);if(e)e.value="";}
   }
   if(![...brand.options].some(x=>x.value===result.brand))brand.add(new Option(result.brand,result.brand));
   brand.value=result.brand;brand.dispatchEvent(new Event("change",{bubbles:true}));
   if(result.model){if(![...model.options].some(x=>x.value===result.model))model.add(new Option(result.model,result.model));model.value=result.model;model.dispatchEvent(new Event("change",{bubbles:true}));}
   feedback.textContent=tr("result")+": "+result.brand+" "+(result.model||"");confirmation.hidden=!result.model;if(result.model)showQuickResult();loadModels(result.brand);
 }
 const quick=document.getElementById("vehicleQuickSearch");
 // Search suggestions are on-site; selecting one updates both existing selectors.
 const quickRow=quick.closest(".vehicle-find-row"),menu=document.createElement("div");
 menu.id="vehicleQuickResults";menu.className="vehicle-quick-results";
 menu.setAttribute("role","listbox");menu.setAttribute("aria-label","Vehicle suggestions");
 menu.hidden=true;quickRow.append(menu);
 quick.setAttribute("aria-controls",menu.id);quick.setAttribute("aria-autocomplete","list");
 quick.setAttribute("aria-expanded","false");box.style.position="relative";box.style.zIndex="45";
 const suggestionStyle=document.createElement("style");suggestionStyle.id="vehicle-quick-results-css";
 suggestionStyle.textContent=".vehicle-find-row:has(.vehicle-quick-results){position:relative}.vehicle-quick-results{position:absolute;z-index:110;top:calc(100% + 5px);left:0;right:0;display:grid;max-height:235px;overflow-y:auto;overscroll-behavior:contain;padding:5px;border:1px solid #cda675;border-radius:8px;background:#171511;box-shadow:0 16px 34px #0009}.vehicle-quick-results[hidden]{display:none!important}.vehicle-quick-choice{display:flex!important;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;width:100%;min-height:44px!important;padding:8px 11px!important;border:0!important;border-radius:5px!important;background:transparent!important;text-align:left;white-space:normal!important;color:#f4eee4!important;font-size:.83rem!important}.vehicle-quick-choice:hover,.vehicle-quick-choice[aria-selected=true]{background:#493421!important}.vehicle-quick-choice span{font-weight:800}.vehicle-quick-choice small{font-size:.68rem;opacity:.8}.vehicle-quick-results .no-match{color:#e3caa5;padding:14px;font-size:.78rem}@media(max-width:600px){.vehicle-quick-results{max-height:200px}.vehicle-quick-choice{min-height:46px!important}}";
 document.head.append(suggestionStyle);
 let quickMatches=[],activeSuggestion=-1;
 function hideSuggestions(){menu.hidden=true;quick.setAttribute("aria-expanded","false");quick.removeAttribute("aria-activedescendant");activeSuggestion=-1;}
 function chooseSuggestion(item){
  if(!item)return;
  hideSuggestions();quick.value=item.brand+(item.model?" "+item.model:"");
  selectCar(item);parseHints(quick.value);quick.blur();if(item.model)confirmation.scrollIntoView({behavior:"smooth",block:"center"});
 }
 function updateSuggestions(){
  const q=quick.value.trim();menu.replaceChildren();
  quickMatches=q.length>=2?searchModels(q,12):[];activeSuggestion=-1;
  if(q.length<2){hideSuggestions();return;}
  if(!quickMatches.length){
   const msg=document.createElement("div");msg.className="no-match";
   msg.textContent=lang()==="tr"?"Model bulunamadı. Önce marka seçin veya modeli elle ekleyin.":lang()==="de"?"Kein Modell gefunden. Marke wählen oder Modell manuell eingeben.":"No model found. Choose a make or add manually.";
   menu.append(msg);
  }else quickMatches.forEach((item,i)=>{
   const button=document.createElement("button");button.type="button";button.className="vehicle-quick-choice";
   button.id="vehicle-quick-option-"+i;button.setAttribute("role","option");button.setAttribute("aria-selected","false");
   const name=document.createElement("span");name.textContent=item.brand+" "+item.model;
   const hint=document.createElement("small");hint.textContent=item.brand;
   button.append(name,hint);button.addEventListener("click",()=>chooseSuggestion(item));menu.append(button);
  });
  menu.hidden=false;quick.setAttribute("aria-expanded","true");
 }
 quick.addEventListener("input",()=>{confirmation.hidden=true;updateSuggestions();});
 quick.addEventListener("focus",()=>{if(quick.value.trim().length>=2)updateSuggestions();});
 quick.addEventListener("keydown",event=>{
  if(event.key==="Escape"){hideSuggestions();return;}
  if(event.key!=="ArrowDown"&&event.key!=="ArrowUp")return;
  if(menu.hidden||!quickMatches.length)return;
  event.preventDefault();
  activeSuggestion=(activeSuggestion+(event.key==="ArrowDown"?1:-1)+quickMatches.length)%quickMatches.length;
  [...menu.querySelectorAll(".vehicle-quick-choice")].forEach((button,index)=>{
   const selected=index===activeSuggestion;button.setAttribute("aria-selected",String(selected));
   if(selected){quick.setAttribute("aria-activedescendant",button.id);button.scrollIntoView({block:"nearest"});}
  });
 });
 document.addEventListener("pointerdown",event=>{if(!quickRow.contains(event.target))hideSuggestions();});
 function parseHints(query) {
   const year=String(query).match(/\b(19\d{2}|20\d{2})\b/);
   const ps=String(query).match(/\b(\d{2,4})\s*(?:PS|HP|BG|bhp)\b/i);
   const engine=String(query).match(/\b(\d[.,]\d\s*(?:TDI|TSI|TFSI|FSI|CDI|dCi|DCI|HDi|BlueHDi|EcoBlue|EcoBoost|PureTech|CRDi|JTD|Multijet|D-4D))\b/i);
   const set=(id,value)=>{const e=document.getElementById(id);if(e&&value&&!e.value)e.value=value;};
   set("yearSelect",year?.[1]);set("powerInput",ps?.[1]);set("engineInput",engine?.[1]);
   if(/\b(DSG|DCT|S-TRONIC|PDK)\b/i.test(query))set("gearboxSelect","DSG/DCT");
   else if(/\b(automatic|automatik|otomatik|tiptronic|9G-TRONIC)\b/i.test(query))set("gearboxSelect","Otomatik");
   else if(/\b(manual|manuel|schaltgetriebe)\b/i.test(query))set("gearboxSelect","Manuel");
   if(/\b(TDI|CDI|dCi|BlueHDi|HDi|EcoBlue|CRDi|D-4D|JTD|Multijet)\b/i.test(query))set("fuelSelect","Diesel");
   else if(/\b(TSI|TFSI|FSI|EcoBoost|PureTech|Benzin|petrol|gasoline)\b/i.test(query))set("fuelSelect","Benzin");
 }
 function search(){
   const selected=activeSuggestion>=0?quickMatches[activeSuggestion]:match(quick.value);
   hideSuggestions();quick.blur();selectCar(selected);parseHints(quick.value);
   model.dispatchEvent(new Event("change",{bubbles:true}));
   if(selected?.model){confirmation.hidden=false;showQuickResult();confirmation.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});}
 }
 document.getElementById("vehicleFindButton").addEventListener("click",search);
 quick.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();search();}});
 function manual(){
   const value=field("customModelInput");if(!brand.value||!value){feedback.textContent=tr("error");return;}
   const matched=[...model.options].find(x=>norm(x.value)===norm(value));const chosen=matched?matched.value:value;
   if(!matched)model.add(new Option(value,value));model.value=chosen;model.dispatchEvent(new Event("change",{bubbles:true}));feedback.textContent=tr("result")+": "+brand.value+" "+chosen;
 }
 function addBrand(){const name=field("customBrandInput");if(!name){feedback.textContent=tr("error");return;}const existing=[...brand.options].find(x=>norm(x.value)===norm(name));const chosen=existing?existing.value:name;if(!existing)brand.add(new Option(chosen,chosen));makes.add(chosen);brand.value=chosen;brand.dispatchEvent(new Event("change",{bubbles:true}));feedback.textContent=tr("result")+": "+chosen;}
 document.getElementById("customBrandButton").addEventListener("click",addBrand);
 document.getElementById("customBrandInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addBrand();}});
 document.getElementById("customModelButton").addEventListener("click",manual);
 document.getElementById("customModelInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();manual();}});
 const ids=["yearSelect","fuelSelect","engineInput","powerInput","gearboxSelect"];
 ids.forEach(id=>{const e=document.getElementById(id);e.addEventListener("change",()=>{if(id!=="powerInput"){homeVariant=null;homeExtraProfile=null;pendingVariantKey="";}model.dispatchEvent(new Event("change",{bubbles:true}));});if(e.tagName==="INPUT")e.addEventListener("blur",()=>model.dispatchEvent(new Event("change",{bubbles:true})));});
 function save(){try{sessionStorage.setItem("6006-vehicle-choice",JSON.stringify({schemaVersion:2,brand:brand.value,model:model.value,...Object.fromEntries(params()),selectionKind:sameHomeProfile(homeVariant)?"catalog":field("engineInput")?"manual":""}));}catch(_){}}
 [brand,model,...ids.map(x=>document.getElementById(x))].forEach(e=>e.addEventListener("change",save));
 const q=new URLSearchParams(location.search);
 let stored={};try{stored=JSON.parse(sessionStorage.getItem("6006-vehicle-choice")||"{}")||{};}catch(_){}
 const sameSavedVehicle=(!q.has("brand")||norm(q.get("brand"))===norm(stored.brand))&&(!q.has("model")||norm(q.get("model"))===norm(stored.model))&&(!q.has("year")||q.get("year")===String(stored.year||""))&&(!q.has("engine")||norm(q.get("engine"))===norm(stored.engine))&&(!q.has("powertrain")||q.get("powertrain")===String(stored.powertrain||""));
 if(!sameSavedVehicle)stored={};
 if(q.has("brand")||stored.brand){
   pendingVariantKey=(q.get("variantKey")||stored.variantKey||"").slice(0,1000);
   selectCar({brand:q.get("brand")||stored.brand,model:q.get("model")||stored.model||""});
   [["yearSelect","year"],["engineInput","engine"],["fuelSelect","powertrain"],["powerInput","ps"],["gearboxSelect","gearbox"]].forEach(x=>{let value=q.get(x[1])||stored[x[1]]||"";if(x[1]==="gearbox"&&value){const k=String(value).toLowerCase();value=/dct|dsg|dual/.test(k)?"DSG/DCT":/manual|manuel|schalt|\bmt\b/.test(k)?"Manuel":/cvt/.test(k)?"CVT":/auto|otomatik/.test(k)?"Otomatik":value;}if(value)document.getElementById(x[0]).value=value;});
   homeExtraProfile={brand:brand.value,model:model.value,year:field("yearSelect"),engine:field("engineInput"),nm:q.get("nm")||stored.nm||"",generation:q.get("generation")||stored.generation||"",gearbox:q.get("gearbox")||stored.gearbox||""};
   model.dispatchEvent(new Event("change",{bubbles:true}));
 }
}
window.VehicleCatalog6006={brands,models,searchModels,loadModels,loadMakes,loadOpenIndex,loadOpenBrand,engineVariants,referencePowerNeedsReview,match,details,params,select(result){const q=document.getElementById("vehicleQuickSearch");if(q){q.value=result.brand+" "+(result.model||"");document.getElementById("vehicleFindButton").click();}}};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{loadOpenIndex();loadMakes();},{once:true});else {loadOpenIndex();loadMakes();}
})();
