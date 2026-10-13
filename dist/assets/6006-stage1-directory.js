(()=>{
"use strict";
const vehicle=document.getElementById("vehicle-selector-6006"),head=vehicle?.querySelector(".vin6006-head");
if(!vehicle||!head||document.getElementById("vin6-stage-directory"))return;
const words={
tr:{summary:"Kaynaklı Stage 1 kataloğu",subtitle:"Üçüncü tarafların yayımladığı motor örneklerini marka, model veya motor ismine göre incele.",filter:"Markaya göre filtrele",all:"Tüm markalar",search:"Marka, model veya motor ara",stock:"İlan edilen orijinal",modified:"Üçüncü taraf Stage 1",source:"Kaynak ilanı ↗",vehicle:"Aracı bulucuda seç →",more:"Daha fazla göster",count:"kayıt ·",no:"Bu aramada kaynaklı referans bulunamadı.",warning:"Bu rakamlar 6006 Performance'ın dyno ölçümü veya garantili teklifi değildir. Araç kodu, ECU ve Almanya'daki yasal uygunluk ayrıca doğrulanmalıdır.",loading:"Referans kayıtları yükleniyor…",unavailable:"Kaynaklı motor listesi şu anda açılamadı. Araç seçiciyi kullanabilirsiniz.",manual:"Motorun stok değerlerini ayrıca doğrula",sort:"Sıralama",sortAlpha:"Marka / model (A–Z)",sortPs:"İlan edilen güç farkı (PS)",sortNm:"İlan edilen tork farkı (Nm)",gain:"İlanda belirtilen fark"},
de:{summary:"Stage-1-Referenzkatalog",subtitle:"Veröffentlichte Motorbeispiele von Drittanbietern nach Marke oder Modell durchsuchen.",filter:"Marke filtern",all:"Alle Marken",search:"Marke, Modell oder Motor suchen",stock:"Veröffentlichte Serie",modified:"Stage 1 Drittanbieter",source:"Zur Originalquelle ↗",vehicle:"Fahrzeug auswählen →",more:"Mehr anzeigen",count:"Einträge ·",no:"Keine passende veröffentlichte Motorreferenz.",warning:"Keine Messung, Garantie oder Zulassungsbestätigung von 6006 Performance. Motorkennung, ECU und Zulässigkeit in Deutschland gesondert prüfen.",loading:"Referenzen werden geladen…",unavailable:"Der Referenzkatalog ist nicht erreichbar. Bitte Fahrzeugauswahl nutzen.",manual:"Serienwerte zusätzlich bestätigen",sort:"Sortierung",sortAlpha:"Marke / Modell (A–Z)",sortPs:"Veröffentlichte Leistungsdifferenz (PS)",sortNm:"Veröffentlichte Drehmomentdifferenz (Nm)",gain:"Veröffentlichte Differenz"},
en:{summary:"Published Stage 1 engine examples",subtitle:"Browse publicly advertised third-party examples by make, model or engine.",filter:"Filter by make",all:"All makes",search:"Search make, model or engine",stock:"Advertised stock",modified:"Advertised Stage 1",source:"Original publication ↗",vehicle:"Select this car →",more:"Show more",count:"entries ·",no:"No published reference matches this filter.",warning:"Not 6006 Performance dyno data, a guaranteed quote or German legal approval. Confirm engine, ECU and road-use requirements separately.",loading:"Loading published references…",unavailable:"Cannot load the reference index right now. Please use the vehicle selector.",manual:"Verify factory stock figures",sort:"Sort by",sortAlpha:"Make / model (A–Z)",sortPs:"Advertised power difference (PS)",sortNm:"Advertised torque difference (Nm)",gain:"Advertised difference"}
};
const lang=()=>{const l=(document.documentElement.lang||"").toLowerCase();return l.startsWith("tr")?"tr":l.startsWith("de")?"de":"en"};
const directory=document.createElement("details");directory.id="vin6-stage-directory";directory.className="vin6006-stage-directory";
directory.innerHTML='<summary id="vin6-directory-toggle"></summary><div class="vin6006-directory-inner"><p id="vin6-directory-subtitle"></p>'
+'<div class="vin6006-directory-controls"><div><label id="vin6-directory-make-label" for="vin6-directory-make"></label><select id="vin6-directory-make"></select></div>'
+'<div><label id="vin6-directory-search-label" for="vin6-directory-search"></label><input id="vin6-directory-search" type="search" maxlength="90" autocomplete="off"></div>'
+'<div><label id="vin6-directory-sort-label" for="vin6-directory-sort"></label><select id="vin6-directory-sort"></select></div></div>'
+'<p id="vin6-directory-count" role="status" aria-live="polite"></p><div id="vin6-directory-results" class="vin6006-directory-results"></div>'
+'<button type="button" id="vin6-directory-more" hidden></button><p class="vin6006-directory-warning" id="vin6-directory-warning"></p></div>';
head.insertAdjacentElement("afterend",directory);
const e=id=>document.getElementById("vin6-directory-"+id);
const filter=e("make"),search=e("search"),sort=e("sort"),results=e("results"),more=e("more"),count=e("count");
let entries=[],shown=12,problem="";
const normalize=s=>String(s||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i");
function option(label,value){const o=document.createElement("option");o.value=value;o.textContent=label;return o;}
function labels(){
 const t=words[lang()];
 e("toggle").textContent=t.summary+" · "+entries.length+" / "+new Set(entries.map(x=>x.make)).size;
 e("subtitle").textContent=t.subtitle;
 e("make-label").textContent=t.filter;
 e("search-label").textContent=t.search;
 e("sort-label").textContent=t.sort;
 const selectedSort=sort.value;
 sort.replaceChildren(option(t.sortAlpha,"alpha"),option(t.sortPs,"gainPs"),option(t.sortNm,"gainNm"));
 sort.value=["gainPs","gainNm"].includes(selectedSort)?selectedSort:"alpha";
 search.placeholder=t.search;more.textContent=t.more;e("warning").textContent=t.warning;
 const current=filter.value;
 filter.replaceChildren(option(t.all,""));
 for(const make of [...new Set(entries.map(x=>x.make))].sort((a,b)=>a.localeCompare(b,"de"))){filter.append(option(make,make));}
 if([...filter.options].some(o=>o.value===current))filter.value=current;
}
function getFiltered(){
 const q=normalize(search.value.trim()),chosen=filter.value;
 const filtered=entries.filter(x=>(!chosen||x.make===chosen)&&(!q||normalize([x.make,x.model,x.manualEngineContains,x.enginePrefix,x.generationContains,x.publisher,x.sourceStockHp,x.yearFrom,x.yearTo].join(" ")).includes(q)));
 const alpha=(a,b)=>a.make.localeCompare(b.make,"de")||a.model.localeCompare(b.model,"de")||a.yearFrom-b.yearFrom;
 if(sort.value==="gainPs")filtered.sort((a,b)=>(b.publishedStage1Ps-b.publishedStockPs)-(a.publishedStage1Ps-a.publishedStockPs)||alpha(a,b));
 else if(sort.value==="gainNm")filtered.sort((a,b)=>(b.publishedStage1Nm-b.publishedStockNm)-(a.publishedStage1Nm-a.publishedStockNm)||alpha(a,b));
 return filtered;
}
function render(){
 const t=words[lang()];labels();
 const filtered=getFiltered();
 count.textContent=filtered.length+" "+t.count+" "+new Set(filtered.map(x=>x.make)).size+" "+t.all.toLocaleLowerCase();
 results.replaceChildren();
 if(problem){count.textContent=t.unavailable;more.hidden=true;return;}
 if(!entries.length){count.textContent=t.loading;more.hidden=true;return;}
 if(!filtered.length){const p=document.createElement("p");p.className="vin6006-directory-empty";p.textContent=t.no;results.append(p);}
 const batch=filtered.slice(0,shown);
 for(const r of batch){
  const card=document.createElement("article");card.className="vin6006-directory-card";
  const title=document.createElement("h4");
  title.textContent=r.make+" "+r.model+" · "+r.yearFrom+"–"+r.yearTo;
  const subtitle=document.createElement("p");subtitle.className="vin6006-directory-engine";
  subtitle.textContent=r.manualEngineContains||r.enginePrefix||r.id;
  const data=document.createElement("div");data.className="vin6006-directory-powers";
  for(const [label,power,nm] of [[t.stock,r.publishedStockPs,r.publishedStockNm],[t.modified,r.publishedStage1Ps,r.publishedStage1Nm]]){
   const col=document.createElement("div");col.className="vin6006-directory-power";
   const cap=document.createElement("span");cap.textContent=label;
   const value=document.createElement("strong");value.textContent=power+" PS · "+nm+" Nm";
   col.append(cap,value);data.append(col);
  }
  const gainPs=r.publishedStage1Ps-r.publishedStockPs,gainNm=r.publishedStage1Nm-r.publishedStockNm;
  const gains=document.createElement("p");gains.className="vin6006-directory-gains";
  gains.textContent=t.gain+": "+(gainPs>0?"+":"")+gainPs+" PS · "+(gainNm>0?"+":"")+gainNm+" Nm";
  const third=document.createElement("p");third.className="vin6006-directory-provider";third.textContent=r.publisher+(r.manualOnly?" · "+t.manual:"");
  const links=document.createElement("div");links.className="vin6006-directory-links";
  const source=document.createElement("a");source.textContent=t.source;source.href=r.sourceUrl;source.rel="noopener noreferrer";source.target="_blank";
  const vehicleLink=document.createElement("a");vehicleLink.textContent=t.vehicle;
  const params=new URLSearchParams({brand:r.make,model:r.model,year:String(r.yearFrom),powertrain:r.fuel,stageRef:r.id});
  vehicleLink.href="/fahrzeug/?"+params.toString()+"#vehicle-selector-6006";
  links.append(vehicleLink,source);
  card.append(title,subtitle,data,gains,third,links);
  results.append(card);
 }
 more.hidden=filtered.length<=shown;
}
filter.addEventListener("change",()=>{shown=12;render();});
search.addEventListener("input",()=>{shown=12;render();});
sort.addEventListener("change",()=>{shown=12;render();});
more.addEventListener("click",()=>{shown+=12;render();});
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
render();
fetch("/assets/6006-stage1-references.json?v=20261012-62refs",{cache:"force-cache"}).then(async response=>{
 if(!response.ok)throw Error("reference list unavailable");
 const db=await response.json();
 if(db.schemaVersion!==1||!Array.isArray(db.examples))throw Error("schema mismatch");
 entries=db.examples.filter(x=>x&&x.classification==="third-party-advertised"&&
 typeof x.make==="string"&&typeof x.model==="string"&&typeof x.publisher==="string"&&
 typeof x.sourceUrl==="string"&&/^https:\/\//.test(x.sourceUrl)&&
 Number.isInteger(x.yearFrom)&&Number.isInteger(x.yearTo)&&
 ["publishedStockPs","publishedStockNm","publishedStage1Ps","publishedStage1Nm"].every(k=>Number.isInteger(x[k])&&x[k]>0));
 entries.sort((a,b)=>a.make.localeCompare(b.make,"de")||a.model.localeCompare(b.model,"de")||a.yearFrom-b.yearFrom);
 render();
}).catch(()=>{problem="loading";render();});
})();