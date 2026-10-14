(()=>{
"use strict";
const vehicle=document.getElementById("vehicle-selector-6006"),head=vehicle?.querySelector(".vin6006-head");
if(!vehicle||!head||document.getElementById("vin6-stage-directory"))return;
const words={
tr:{summary:"Kaynaklı Stage 1 kataloğu",subtitle:"Üçüncü tarafların yayımladığı motor örneklerini marka, model veya motor ismine göre incele.",filter:"Markaya göre filtrele",all:"Tüm markalar",search:"Marka, model veya motor ara",stock:"İlan edilen orijinal",modified:"Üçüncü taraf Stage 1",source:"Kaynak ilanı ↗",vehicle:"Aracı bulucuda seç →",more:"Daha fazla göster",count:"kayıt ·",no:"Bu aramada kaynaklı referans bulunamadı.",warning:"Bu rakamlar 6006 Performance'ın dyno ölçümü veya garantili teklifi değildir. Araç kodu, ECU ve Almanya'daki yasal uygunluk ayrıca doğrulanmalıdır.",loading:"Referans kayıtları yükleniyor…",unavailable:"Kaynaklı motor listesi şu anda açılamadı. Araç seçiciyi kullanabilirsiniz.",manual:"Motorun stok değerlerini ayrıca doğrula",year:"Model yılı",anyYear:"Tüm yıllar",fuel:"Yakıt türü",anyFuel:"Tüm yakıtlar",sort:"Sırala",defaultSort:"Marka / model",sortPs:"İlan edilen PS artışı",sortNm:"İlan edilen Nm artışı",gain:"İlan edilen artış",brands:"marka",reset:"Filtreleri temizle",share:"Aramayı paylaş",copied:"Arama bağlantısı kopyalandı.",copyManual:"Bağlantıyı aşağıdan seçip kopyalayabilirsiniz."},
de:{summary:"Stage-1-Referenzkatalog",subtitle:"Veröffentlichte Motorbeispiele von Drittanbietern nach Marke oder Modell durchsuchen.",filter:"Marke filtern",all:"Alle Marken",search:"Marke, Modell oder Motor suchen",stock:"Veröffentlichte Serie",modified:"Stage 1 Drittanbieter",source:"Zur Originalquelle ↗",vehicle:"Fahrzeug auswählen →",more:"Mehr anzeigen",count:"Einträge ·",no:"Keine passende veröffentlichte Motorreferenz.",warning:"Keine Messung, Garantie oder Zulassungsbestätigung von 6006 Performance. Motorkennung, ECU und Zulässigkeit in Deutschland gesondert prüfen.",loading:"Referenzen werden geladen…",unavailable:"Der Referenzkatalog ist nicht erreichbar. Bitte Fahrzeugauswahl nutzen.",manual:"Serienwerte zusätzlich bestätigen",year:"Baujahr",anyYear:"Alle Baujahre",fuel:"Kraftstoff",anyFuel:"Alle Kraftstoffe",sort:"Sortieren",defaultSort:"Marke / Modell",sortPs:"Veröffentlichter PS-Zuwachs",sortNm:"Veröffentlichter Nm-Zuwachs",gain:"Veröffentlichter Zuwachs",brands:"Marken",reset:"Filter zurücksetzen",share:"Suche teilen",copied:"Suchlink kopiert.",copyManual:"Link unten markieren und kopieren."},
en:{summary:"Published Stage 1 engine examples",subtitle:"Browse publicly advertised third-party examples by make, model or engine.",filter:"Filter by make",all:"All makes",search:"Search make, model or engine",stock:"Advertised stock",modified:"Advertised Stage 1",source:"Original publication ↗",vehicle:"Select this car →",more:"Show more",count:"entries ·",no:"No published reference matches this filter.",warning:"Not 6006 Performance dyno data, a guaranteed quote or German legal approval. Confirm engine, ECU and road-use requirements separately.",loading:"Loading published references…",unavailable:"Cannot load the reference index right now. Please use the vehicle selector.",manual:"Verify factory stock figures",year:"Model year",anyYear:"All years",fuel:"Fuel",anyFuel:"All fuel types",sort:"Sort by",defaultSort:"Make / model",sortPs:"Advertised PS increase",sortNm:"Advertised Nm increase",gain:"Advertised increase",brands:"makes",reset:"Clear filters",share:"Share search",copied:"Search link copied.",copyManual:"Select and copy the link below."}
};
const lang=()=>{const l=(document.documentElement.lang||"").toLowerCase();return l.startsWith("tr")?"tr":l.startsWith("de")?"de":"en"};
const directory=document.createElement("details");directory.id="vin6-stage-directory";directory.className="vin6006-stage-directory";
directory.innerHTML='<summary id="vin6-directory-toggle"></summary><div class="vin6006-directory-inner"><p id="vin6-directory-subtitle"></p>'
+'<div class="vin6006-directory-controls"><div><label id="vin6-directory-make-label" for="vin6-directory-make"></label><select id="vin6-directory-make"></select></div>'
 +'<div><label id="vin6-directory-search-label" for="vin6-directory-search"></label><input id="vin6-directory-search" type="search" maxlength="90" autocomplete="off"></div>'
 +'<div><label id="vin6-directory-year-label" for="vin6-directory-year"></label><select id="vin6-directory-year"></select></div>'
 +'<div><label id="vin6-directory-fuel-label" for="vin6-directory-fuel"></label><select id="vin6-directory-fuel"></select></div>'
 +'<div><label id="vin6-directory-sort-label" for="vin6-directory-sort"></label><select id="vin6-directory-sort"></select></div></div>'
+'<div class="vin6006-directory-actions"><button type="button" id="vin6-directory-reset"></button><button type="button" id="vin6-directory-share"></button></div>'
+'<input type="text" id="vin6-directory-share-url" class="vin6006-directory-share-url" aria-label="Shareable Stage 1 catalogue URL" readonly hidden><p id="vin6-directory-share-status" class="vin6006-directory-share-status" role="status" aria-live="polite"></p>'
+'<p id="vin6-directory-count" role="status" aria-live="polite"></p><div id="vin6-directory-results" class="vin6006-directory-results"></div>'
+'<button type="button" id="vin6-directory-more" hidden></button><p class="vin6006-directory-warning" id="vin6-directory-warning"></p></div>';
head.insertAdjacentElement("afterend",directory);
const e=id=>document.getElementById("vin6-directory-"+id);
const filter=e("make"),search=e("search"),year=e("year"),fuel=e("fuel"),sort=e("sort"),results=e("results"),more=e("more"),count=e("count"),reset=e("reset"),share=e("share"),shareUrl=e("share-url"),shareStatus=e("share-status");
year.append(option("",""));
fuel.append(option("",""),option("Diesel","Diesel"),option("Benzin","Benzin"),option("Hybrid","Hybrid"));
sort.append(option("","make"),option("","gainPs"),option("","gainNm"));
let entries=[],shown=12,problem="";
const normalize=s=>String(s||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i");
function option(label,value){const o=document.createElement("option");o.value=value;o.textContent=label;return o;}
function labels(){
 const t=words[lang()];
 e("toggle").textContent=t.summary+" · "+entries.length+" / "+new Set(entries.map(x=>x.make)).size;
 e("subtitle").textContent=t.subtitle;
 e("make-label").textContent=t.filter;
 e("search-label").textContent=t.search;
 search.placeholder=t.search;more.textContent=t.more;e("warning").textContent=t.warning;
 e("year-label").textContent=t.year;year.options[0].textContent=t.anyYear;
 e("fuel-label").textContent=t.fuel;fuel.options[0].textContent=t.anyFuel;
 e("sort-label").textContent=t.sort;sort.options[0].textContent=t.defaultSort;
 sort.options[1].textContent=t.sortPs;sort.options[2].textContent=t.sortNm;
 reset.textContent=t.reset;share.textContent=t.share;
 const current=filter.value;
 filter.replaceChildren(option(t.all,""));
 for(const make of [...new Set(entries.map(x=>x.make))].sort((a,b)=>a.localeCompare(b,"de"))){filter.append(option(make,make));}
 if([...filter.options].some(o=>o.value===current))filter.value=current;
}
function getFiltered(){
 const tokens=normalize(search.value.trim()).split(/\s+/).filter(Boolean);
 const chosen=filter.value,selectedYear=year.value?Number(year.value):0,selectedFuel=fuel.value;
 const filtered=entries.filter(x=>(!chosen||x.make===chosen)
  &&(!selectedYear||(x.yearFrom<=selectedYear&&x.yearTo>=selectedYear))
  &&(!selectedFuel||x.fuel===selectedFuel)
  &&(!tokens.length||tokens.every(token=>normalize([x.make,x.model,x.manualEngineContains,x.enginePrefix,x.generationContains,x.publisher,x.sourceStockHp].join(" ")).includes(token))));
 if(sort.value==="gainPs")filtered.sort((a,b)=>(b.publishedStage1Ps-b.publishedStockPs)-(a.publishedStage1Ps-a.publishedStockPs)||a.make.localeCompare(b.make,"de"));
 else if(sort.value==="gainNm")filtered.sort((a,b)=>(b.publishedStage1Nm-b.publishedStockNm)-(a.publishedStage1Nm-a.publishedStockNm)||a.make.localeCompare(b.make,"de"));
 return filtered;
}
function render(){
 const t=words[lang()];labels();
 const filtered=getFiltered();
 count.textContent=filtered.length+" "+t.count+" "+new Set(filtered.map(x=>x.make)).size+" "+t.brands;
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
  const gain=document.createElement("p");gain.className="vin6006-directory-engine";
  gain.textContent=t.gain+": +"+(r.publishedStage1Ps-r.publishedStockPs)+" PS · +"+(r.publishedStage1Nm-r.publishedStockNm)+" Nm";
  const third=document.createElement("p");third.className="vin6006-directory-provider";third.textContent=r.publisher+(r.manualOnly?" · "+t.manual:"");
  const links=document.createElement("div");links.className="vin6006-directory-links";
  const source=document.createElement("a");source.textContent=t.source;source.href=r.sourceUrl;source.rel="noopener noreferrer";source.target="_blank";
  const vehicleLink=document.createElement("a");vehicleLink.textContent=t.vehicle;
  const selectedYear=Number(year.value);
  const vehicleYear=Number.isInteger(selectedYear)&&selectedYear>=r.yearFrom&&selectedYear<=r.yearTo?selectedYear:r.yearFrom;
  const params=new URLSearchParams({brand:r.make,model:r.model,year:String(vehicleYear),powertrain:r.fuel,stageRef:r.id});
  vehicleLink.href="/fahrzeug/?"+params.toString()+"#vehicle-selector-6006";
  links.append(vehicleLink,source);
  card.append(title,subtitle,data,gain,third,links);
  results.append(card);
 }
 more.hidden=filtered.length<=shown;
}
// A shared link restores only catalogue filters, never a VIN or vehicle profile.
const shareKeys={make:"stageMake",q:"stageQ",year:"stageYear",fuel:"stageFuel",sort:"stageSort"};
function readSharedFilters(){
 const p=new URL(window.location.href).searchParams;
 if(!Object.values(shareKeys).some(k=>p.has(k)))return false;
 search.value=(p.get(shareKeys.q)||"").slice(0,90);
 const allowed=(control,value)=>[...control.options].some(o=>o.value===value)?value:"";
 filter.value=allowed(filter,p.get(shareKeys.make)||"");
 year.value=allowed(year,p.get(shareKeys.year)||"");
 fuel.value=allowed(fuel,p.get(shareKeys.fuel)||"");
 sort.value=allowed(sort,p.get(shareKeys.sort)||"make")||"make";
 directory.open=true;
 return true;
}
function buildShareUrl(){
 const url=new URL(window.location.href);
 for(const k of Object.values(shareKeys))url.searchParams.delete(k);
 for(const [key,value] of [[shareKeys.make,filter.value],[shareKeys.q,search.value.trim().slice(0,90)],[shareKeys.year,year.value],[shareKeys.fuel,fuel.value],[shareKeys.sort,sort.value==="make"?"":sort.value]]){
  if(value)url.searchParams.set(key,value);
 }
 url.hash="vin6-stage-directory";
 return url.toString();
}
function invalidateShare(){
 shareStatus.textContent="";
 shareUrl.hidden=true;
}
reset.addEventListener("click",()=>{
 filter.value="";search.value="";year.value="";fuel.value="";sort.value="make";
 shown=12;invalidateShare();render();search.focus();
});
share.addEventListener("click",async()=>{
 const url=buildShareUrl();
 shareUrl.value=url;
 try{
  if(!navigator.clipboard?.writeText)throw Error("clipboard unavailable");
  await navigator.clipboard.writeText(url);
  shareUrl.hidden=true;shareStatus.textContent=words[lang()].copied;
 }catch(_){
  shareUrl.hidden=false;shareStatus.textContent=words[lang()].copyManual;
  shareUrl.focus();shareUrl.select();
 }
});
filter.addEventListener("change",()=>{shown=12;invalidateShare();render();});
search.addEventListener("input",()=>{shown=12;invalidateShare();render();});
for(const control of [year,fuel,sort])control.addEventListener("change",()=>{shown=12;invalidateShare();render();});
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
 const years=entries.flatMap(x=>[x.yearFrom,x.yearTo]);
 if(years.length){const min=Math.max(1950,Math.min(...years)),max=Math.min(2100,Math.max(...years));for(let y=max;y>=min;y--)year.append(option(String(y),String(y)));}
 readSharedFilters();
 render();
}).catch(()=>{problem="loading";render();});
})();