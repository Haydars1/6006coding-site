(()=>{
"use strict";
// This browser lists OPEN reference engines, not calibrated or purchasable Stage 1 maps.
// All advertised Stage 1 values remain in the independently sourced reference section.
const root=document.getElementById("stage1-open-engine-finder");
if(!root)return;
const $=id=>document.getElementById("stage1-open-"+id);
const brand=$("brand"),model=$("model"),modelFilter=$("model-filter"),year=$("year"),fuel=$("fuel"),term=$("term"),result=$("results"),count=$("count"),more=$("more"),hint=$("hint"),meta=$("meta");
const labels={
 loading:"Offener Motorbestand wird geladen …",
 chooseMake:"Bitte zuerst eine Automarke wählen.",
 chooseModel:"Bitte ein Modell wählen oder Suchbegriff eingeben.",
 noModels:"Kein Modell im offenen Bestand gefunden. Andere Schreibweise prüfen oder Fahrzeug manuell melden.",
 noEntries:"Keine passenden Motorvarianten. Suche oder Filter ändern.",
 failed:"Der offene Motorbestand konnte nicht geladen werden. Im Fahrzeugfinder können Sie Marke und Motorcode dennoch manuell angeben.",
 total:"Community-Motoreinträge",
 brand:"Marken",
 models:"Modelle",
 matches:"passende offene Motorvarianten",
 license:"Referenzdaten (ODbL). Keine OEM-Freigabe, keine ECU-Datei, keine individuelle Stage-1-Leistungszusage.",
 verify:"Im Fahrzeugfinder prüfen →",
 showMore:"Weitere Motoren anzeigen",
 unknown:"nicht angegeben",
 hp:"Quellleistung",
 nm:"Quell-Drehmoment"
};
let index=null,entries=[],loadedBrand="",models=[],seen=20,request=0,failed=false;
const canon=s=>String(s||"").toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/ı/g,"i").trim();
const option=(label,value)=>{const o=document.createElement("option");o.value=value;o.textContent=label;return o;};
const showMessage=s=>{count.textContent=s;result.replaceChildren();more.hidden=true;};
function renderModels(){
 const selected=model.value,query=canon(modelFilter.value);
 model.replaceChildren(option("Alle Modelle",""));
 for(const x of models.filter(x=>!query||canon(x.name).includes(query)).sort((a,b)=>a.name.localeCompare(b.name,"de"))){
  model.append(option(x.name,x.name));
 }
 if([...model.options].some(x=>x.value===selected))model.value=selected;
 else model.value="";
 renderResults();
}
function filteredEngines(){
 const current=model.value,requestedYear=year.value?Number(year.value):0,q=canon(term.value);
 const selectedFuel=fuel.value;
 const found=[];
 for(const item of models){
  if(current&&item.name!==current)continue;
  for(const v of item.engines||[]){
   const first=Number(v.from)||Number(item.from)||0,last=Number(v.to)||Number(item.to)||9999;
   if(requestedYear&&(requestedYear<first||requestedYear>last))continue;
   if(selectedFuel&&classifyFuel(v.fuel,v.engine)!==selectedFuel)continue;
   const content=canon([item.name,v.engine,v.generation,v.fuel,v.transmission,v.hp,v.nm,v.from,v.to].join(" "));
   if(q&&!content.includes(q))continue;
   found.push({item,v});
  }
 }
 return found;
}
function classifyFuel(fuelValue,engine){
 const s=canon(fuelValue+" "+engine);
 if(/plug.?in|phev/.test(s))return "PHEV";
 if(/mild hybrid|hybrid|mhev|e-tsi|etsi/.test(s))return "Hybrid";
 if(/diesel|tdi|crdi|cdi|dci|bluehdi|hdi|jtd|skyactiv-d/.test(s))return "Diesel";
 if(/electric|bev|battery/.test(s))return "Electric";
 if(/petrol|gasoline|benzin|tsi|tfsi|turbo|otto/.test(s))return "Benzin";
 return "";
}
function addRow(record){
 const {item,v}=record;
 const card=document.createElement("article");card.className="stage-open-engine";
 const title=document.createElement("h3");title.textContent=item.name+" · "+(v.engine||"Motor");
 const subtitle=document.createElement("p");subtitle.className="stage-open-desc";
 subtitle.textContent=[v.generation,v.from&&v.to?v.from+"–"+v.to:v.from||v.to,v.fuel,v.transmission,v.drive].filter(Boolean).join(" · ");
 const spec=document.createElement("p");spec.className="stage-open-spec";
 const parts=[];
 if(Number.isFinite(Number(v.hp))&&Number(v.hp)>0)parts.push(labels.hp+": "+v.hp+" HP");
 if(Number.isFinite(Number(v.nm))&&Number(v.nm)>0)parts.push(labels.nm+": "+v.nm+" Nm");
 spec.textContent=parts.join(" · ")||"Leistungsangabe: "+labels.unknown;
 const quote=document.createElement("a");quote.className="stage-open-link";quote.textContent=labels.verify;
 // Do not transfer engine power as verified values, or choose a gearbox silently.
 // Instead search the exact motor label on the vehicle page and ask the user to choose.
 const params=new URLSearchParams({brand:item.make,model:item.name,engineSearch:String(v.engine||"").slice(0,90)});
 const actualYear=Number(year.value);
 if(Number.isInteger(actualYear)&&actualYear>=1950&&actualYear<=2035)params.set("year",String(actualYear));
 const kind=classifyFuel(v.fuel,v.engine);
 if(kind)params.set("powertrain",kind);
 quote.href="/fahrzeug/?"+params.toString()+"#vehicle-selector-6006";
 const disclaimer=document.createElement("p");disclaimer.className="stage-open-caution";
 disclaimer.textContent="Offene Motorreferenz – keine belegte Stage-1-Leistung. ECU und Getriebe prüfen.";
 card.append(title,subtitle,spec,disclaimer,quote);
 return card;
}
function renderResults(){
 if(!index){showMessage(failed?labels.failed:labels.loading);return;}
 if(!brand.value){showMessage(labels.chooseMake);return;}
 if(!models.length){showMessage(labels.noModels);return;}
 const matches=filteredEngines();
 count.textContent=matches.length+" "+labels.matches+" · "+(loadedBrand||brand.value);
 result.replaceChildren();
 if(!matches.length){const p=document.createElement("p");p.textContent=labels.noEntries;result.append(p);}
 else{
  const fragment=document.createDocumentFragment();
  for(const item of matches.slice(0,seen))fragment.append(addRow(item));
  result.append(fragment);
 }
 more.hidden=matches.length<=seen;
}
function resetLimit(){seen=20;renderResults();}
async function loadBrand(){
 const make=brand.value,token=++request;
 models=[];loadedBrand="";model.value="";modelFilter.value="";term.value="";seen=20;
 if(!make){renderModels();return;}
 showMessage(labels.loading);
 const bucket=index?.makes?.find(x=>x.makes.includes(make));
 if(!bucket){failed=true;showMessage(labels.failed);return;}
 try{
  const response=await fetch("/assets/vehicle-data/"+encodeURIComponent(bucket.slug)+".json",{cache:"force-cache"});
  if(!response.ok)throw Error("Motorbestand "+response.status);
  const data=await response.json();
  if(token!==request)return;
  if(!Array.isArray(data.models))throw Error("Motorbestand invalid");
  models=data.models.filter(x=>x&&x.make===make&&typeof x.name==="string"&&Array.isArray(x.engines));
  loadedBrand=make;failed=false;renderModels();
 }catch(e){if(token!==request)return;failed=true;showMessage(labels.failed);}
}
brand.addEventListener("change",loadBrand);
model.addEventListener("change",resetLimit);
modelFilter.addEventListener("input",()=>{seen=20;renderModels();});
term.addEventListener("input",resetLimit);
year.addEventListener("input",resetLimit);
fuel.addEventListener("change",resetLimit);
more.addEventListener("click",()=>{seen+=20;renderResults();});
showMessage(labels.loading);
fetch("/assets/vehicle-data/index.json",{cache:"force-cache"}).then(async r=>{
 if(!r.ok)throw Error("Open catalogue index missing");
 const data=await r.json();
 if(!Array.isArray(data.makes)||!Number.isInteger(data.totalEngines))throw Error("Bad open catalogue index");
 index=data;
 brand.replaceChildren(option("Automarke wählen",""));
 const list=data.makes.flatMap(g=>g.makes||[]).sort((a,b)=>a.localeCompare(b,"de"));
 for(const name of list)brand.append(option(name,name));
 meta.textContent=list.length+" "+labels.brand+" · "+data.totalModels+" "+labels.models+" · "+data.totalEngines.toLocaleString("de-DE")+" "+labels.total;
 hint.textContent=labels.license;
 renderResults();
}).catch(()=>{failed=true;showMessage(labels.failed);});
})();