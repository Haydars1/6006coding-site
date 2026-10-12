(()=>{
"use strict";
// Search ALL open reference engines, separately from the 62 individually sourced Stage-1 ads.
// Engine index is fetched lazily only when the visitor opens this catalogue.
const vehicle=document.getElementById("vehicle-selector-6006");
if(!vehicle||document.getElementById("vin6-full-engine-directory"))return;
const copy={
de:{summary:"Alle Motoren durchsuchen – über 30.000 Referenzvarianten",subtitle:"Markenübergreifender Suchindex aus offenen Fahrzeugdaten. Derzeit keine verifizierten Stage-1-Ergebnisse für die meisten Motoren.",search:"Marke, Modell, Motorkennung oder Getriebe suchen",make:"Marke",all:"Alle Marken",year:"Baujahr (optional)",yearHint:"Alle Baujahre",empty:"Mindestens 2 Zeichen eingeben oder eine Marke auswählen.",loading:"Vollständiger Motorindex wird geladen …",failed:"Der Motorindex konnte nicht geladen werden. Bitte Fahrzeug über den Finder oben auswählen.",count:"Motorvarianten gefunden",more:"Weitere 20 Motoren anzeigen",source:"Offene Fahrzeugreferenz",stock:"Referenz-Seriendaten (nicht OEM-bestätigt)",quote:"Motor im Fahrzeugfinder prüfen →",unknown:"Unbekannt",none:"Keine Motorreferenz gefunden. Prüfen Sie Schreibweise oder melden Sie den Motor über das Fahrzeugformular.",caution:"Wichtig: 30.000+ Motorvarianten sind offene technische Referenzen, keine bestätigten Stage-1-Kalibrierungen. Nur separat belegte Drittanbieterangebote zeigen konkrete Stage-1-Werte. Motorcode, ECU, Getriebe, Serienleistung und Straßenverkehrsrecht vor einem Angebot prüfen.",license:"Datenquelle / ODbL 1.0"},
tr:{summary:"Tüm motorlarda ara – 30.000'den fazla referans",subtitle:"Tüm markaları kapsayan açık motor veritabanı. Çoğu motorun doğrulanmış Stage 1 sonucu henüz yoktur.",search:"Marka, model, motor kodu veya şanzıman ara",make:"Marka",all:"Tüm markalar",year:"Model yılı (isteğe bağlı)",yearHint:"Tüm yıllar",empty:"En az 2 karakter yaz veya marka seç.",loading:"Tüm motor indeksi yükleniyor…",failed:"Motor indeksi yüklenemedi. Yukarıdaki araç bulucuyu kullan.",count:"motor varyantı bulundu",more:"20 motor daha göster",source:"Açık araç verisi",stock:"Orijinal referans verisi (OEM onaylı değil)",quote:"Araç bulucuda motoru kontrol et →",unknown:"Bilinmiyor",none:"Motor bulunamadı. Başka yazımla ara veya eksik motor bildirimi gönder.",caution:"Önemli: 30.000'den fazla motor, açık teknik referans kaydıdır; Stage 1 sonucu değildir. Yalnız ayrı kaynakla doğrulanan üçüncü taraf ilanlarında Stage 1 değerleri gösterilir. Teklif öncesi motor kodu, ECU, şanzıman ve yasal uygunluk kontrol edilmelidir.",license:"Veri kaynağı / ODbL 1.0"},
en:{summary:"Search every engine – over 30,000 reference variants",subtitle:"Cross-brand open engine directory. Most engines do not have verified Stage 1 tuning figures.",search:"Search make, model, engine or transmission",make:"Make",all:"All makes",year:"Model year (optional)",yearHint:"All years",empty:"Enter at least 2 characters or select a make.",loading:"Loading complete engine index…",failed:"Could not load the engine index. Please use the vehicle selector above.",count:"engine variants found",more:"Show 20 more engines",source:"Open vehicle reference",stock:"Reference stock data (not OEM verified)",quote:"Review engine in vehicle finder →",unknown:"Unknown",none:"No engines found. Try another name or report a missing engine.",caution:"Important: 30,000+ engine variants are open technical references, NOT confirmed Stage 1 calibrations. Only separately sourced third-party ads show Stage 1 figures. Check engine code, ECU, transmission, factory values and local road regulations before a quote.",license:"Data source / ODbL 1.0"}
};
const locale=()=>{const l=(document.documentElement.lang||"").toLowerCase();return l.startsWith("tr")?"tr":l.startsWith("de")?"de":"en";};
const text=()=>copy[locale()];
const panel=document.createElement("details");panel.id="vin6-full-engine-directory";panel.className="vin6006-full-engine";
panel.innerHTML='<summary id="vin6-global-summary"></summary>'
+'<div class="vin6006-full-body"><p id="vin6-global-subtitle"></p>'
+'<div class="vin6006-full-controls"><div><label id="vin6-global-make-label" for="vin6-global-make"></label><select id="vin6-global-make"></select></div>'
+'<div><label id="vin6-global-search-label" for="vin6-global-search"></label><input id="vin6-global-search" type="search" maxlength="100" autocomplete="off" enterkeyhint="search"></div>'
+'<div><label id="vin6-global-year-label" for="vin6-global-year"></label><select id="vin6-global-year"></select></div></div>'
+'<p role="status" aria-live="polite" id="vin6-global-status"></p><div id="vin6-global-results"></div>'
+'<button type="button" id="vin6-global-more" hidden></button>'
+'<p class="vin6006-full-warning" id="vin6-global-warning"></p>'
+'<a class="vin6006-full-license" id="vin6-global-license" target="_blank" rel="noopener noreferrer" href="https://github.com/gor3a/vehicle-makes-models"></a>'
+'</div>';
const sourcePanel=document.getElementById("vin6-stage-directory");
if(sourcePanel)sourcePanel.insertAdjacentElement("beforebegin",panel);
else vehicle.querySelector(".vin6006-head")?.insertAdjacentElement("afterend",panel);
const e=id=>document.getElementById("vin6-global-"+id);
const make=e("make"),search=e("search"),year=e("year"),results=e("results"),status=e("status"),more=e("more");
let index=null,loading=null,limit=20,filtered=[],timer=null,initialised=false,error=false,makeCount=0;
const normal=value=>String(value||"").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/ß/g,"ss");
const opt=(value,title)=>{const o=document.createElement("option");o.value=value;o.textContent=title;return o;};
const fuelValue=raw=>{const fuel=normal(raw);if(fuel.includes("diesel"))return fuel.includes("hybrid")?"Hybrid":"Diesel";if(fuel.includes("gasoline")||fuel.includes("petrol"))return fuel.includes("hybrid")?"Hybrid":"Benzin";if(fuel.includes("electric"))return "Electric";if(fuel.includes("hybrid"))return "Hybrid";return "";};
function labels(){
 const t=text();
 e("summary").textContent=t.summary+(index?" · "+index.count.toLocaleString(locale()==="de"?"de-DE":locale()==="tr"?"tr-TR":"en-US"):"");
 e("subtitle").textContent=t.subtitle;e("make-label").textContent=t.make;
 e("search-label").textContent=t.search;search.placeholder=t.search;
 e("year-label").textContent=t.year;year.options[0].textContent=t.yearHint;
 if(make.options.length)make.options[0].textContent=t.all;
 e("warning").textContent=t.caution;e("license").textContent=t.license;
 more.textContent=t.more;
}
function installMakes(){
 const chosen=make.value;
 make.replaceChildren(opt("",text().all));
 for(const name of [...index.makes].sort((a,b)=>a.localeCompare(b,"de")))make.append(opt(name,name));
 make.value=chosen;
}
function buildSearchIndex(){
 // Store only strings used to search; no extra network requests per brand.
 index.searchTerms=index.entries.map(row=>{
  const model=index.models[row[0]],brand=index.makes[model[0]];
  return normal([brand,model[1],row[1],row[2],row[7],row[8],row[9]].join(" "));
 });
 index.modelMakes=index.models.map(m=>index.makes[m[0]]);
}
async function load(){
 if(index)return index;
 if(loading)return loading;
 status.textContent=text().loading;
 loading=(async()=>{
  const response=await fetch("/assets/vehicle-data/engine-search.json?v=20261012-all-engines",{cache:"force-cache"});
  if(!response.ok)throw Error("Cannot load engine search index: "+response.status);
  const data=await response.json();
  if(data.schemaVersion!==1||!data.referenceOnly||!Array.isArray(data.entries)||!Array.isArray(data.models)||!Array.isArray(data.makes)||data.entries.length!==data.count)throw Error("Invalid open engine search index");
  index=data;makeCount=data.makes.length;buildSearchIndex();installMakes();labels();return data;
 })().catch(()=>{error=true;status.textContent=text().failed;return null;});
 return loading;
}
function yearInRange(row,val){
 if(!val)return true;
 const y=Number(val),start=Number(row[3])||0,end=Number(row[4])||9999;
 return y>=start&&y<=end;
}
function find(){
 if(!index)return[];
 const q=normal(search.value).trim(),tokens=q.split(/\s+/).filter(Boolean),selected=make.value,y=year.value;
 if(!selected&&q.length<2)return[];
 const matches=[];
 for(let i=0;i<index.entries.length;i++){
  const row=index.entries[i],model=index.models[row[0]];
  if(selected&&index.makes[model[0]]!==selected)continue;
  if(!yearInRange(row,y))continue;
  const label=index.searchTerms[i];
  if(tokens.some(token=>!label.includes(token)))continue;
  matches.push(i);
 }
 return matches;
}
function render(){
 const t=text();labels();
 if(error){status.textContent=t.failed;results.replaceChildren();more.hidden=true;return;}
 if(!index){status.textContent=t.loading;return;}
 filtered=find();
 if(!make.value&&normal(search.value).trim().length<2){status.textContent=t.empty;results.replaceChildren();more.hidden=true;return;}
 status.textContent=filtered.length.toLocaleString(locale()==="de"?"de-DE":locale()==="tr"?"tr-TR":"en-US")+" "+t.count;
 results.replaceChildren();
 if(!filtered.length){const p=document.createElement("p");p.className="vin6006-full-empty";p.textContent=t.none;results.append(p);more.hidden=true;return;}
 const fragment=document.createDocumentFragment();
 for(const i of filtered.slice(0,limit)){
  const row=index.entries[i],model=index.models[row[0]],brand=index.makes[model[0]];
  const item=document.createElement("article");item.className="vin6006-full-card";
  const head=document.createElement("h4");head.textContent=brand+" "+model[1];
  const engine=document.createElement("strong");engine.textContent=row[2]||t.unknown;
  const meta=document.createElement("p");meta.className="vin6006-full-meta";
  meta.textContent=[row[1],(row[3]||row[4])?[row[3]||"?",row[4]||"…"].join("–"):"",row[7],row[8],row[9]].filter(Boolean).join(" · ");
  const stock=document.createElement("p");stock.className="vin6006-full-stock";
  stock.textContent=t.stock+": "+(row[5]||"—")+" HP / "+(row[6]||"—")+" Nm";
  const ask=document.createElement("a");ask.textContent=t.quote;
  const from=Number(row[3]),to=Number(row[4]);
  const requestedYear=year.value&&yearInRange(row,year.value)?year.value:Number.isInteger(from)&&from>=1950?String(from):Number.isInteger(to)&&to>=1950?String(to):"";
  const params=new URLSearchParams({brand,model:model[1]});
  if(requestedYear)params.set("year",requestedYear);
  const fuel=fuelValue(row[7]);if(fuel)params.set("powertrain",fuel);
  params.set("catalogEngineSearch",row[2]);
  ask.href="/fahrzeug/?"+params.toString()+"#vehicle-selector-6006";
  item.append(head,engine,meta,stock,ask);fragment.append(item);
 }
 results.append(fragment);
 more.hidden=filtered.length<=limit;
}
function schedule(){if(timer!==null)clearTimeout(timer);timer=setTimeout(()=>{limit=20;render();},160);}
make.append(opt("",text().all));
year.append(opt("",text().yearHint));
for(let y=new Date().getFullYear()+1;y>=1970;y--)year.append(opt(String(y),String(y)));
labels();status.textContent=text().empty;
panel.addEventListener("toggle",async()=>{
 if(!panel.open||initialised)return;
 initialised=true;const loaded=await load();if(loaded)render();
});
for(const control of [make,year])control.addEventListener("change",()=>{limit=20;render();});
search.addEventListener("input",schedule);
more.addEventListener("click",()=>{limit+=20;render();});
new MutationObserver(()=>{labels();if(index)render();}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();