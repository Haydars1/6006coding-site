(()=>{
"use strict";
const finder=window.VehicleCatalog6006,main=document.querySelector("main"),tab=document.querySelector("#catalog");
if(!finder||!main||!tab||document.getElementById("vehicle-selector-6006"))return;
const w={
tr:{kicker:"6006 / ARAÇ & MOTOR BULUCU",head:"Aracını seç, motorunu ve arıza kodlarını gör.",intro:"Şasi numarasından markayı belirle veya marka, model, yıl, yakıt ve motor seç. Mevcut katalogdaki motor verileri, Stage 1 ön değerlendirmesi ve ilgili OBD kodları tek ekranda.",all:"Tüm arıza kodları",vin:"Şasi numarası (VIN)",vinHelp:"17 karakterli Önce yerel üretici kodlarına bakılır; tanınmazsa yalnızca ilk 3 karakter NHTSA'ya sorgulanır. Tam VIN gönderilmez veya kaydedilmez. Üretici/model/motor doğrulanmalıdır.",decode:"Markayı bul",invalid:"VIN 17 karakter olmalı ve I, O, Q içermemeli.",unsupported:"Bu VIN'den marka güvenilir biçimde belirlenemedi. Markayı listeden seçebilirsin.",found:"VIN'den belirlenen marka",make:"Marka",model:"Model",year:"Model yılı",fuel:"Yakıt",engine:"Motor / varyant",other:"Listede yoksa motor kodu",power:"Orijinal güç (PS)",torque:"Orijinal tork (Nm)",choose:"Seçin",allFuel:"Tümü",noneMotor:"Listede bulunmuyor / elle gir",loading:"Motor varyantları yükleniyor…",selected:"Seçilen araç",stage:"Stage 1 ön değerlendirmesi",old:"Orijinal",new:"Stage 1 (tahmini)",value:"Değer",hp:"Güç",nm:"Tork",noData:"Güç / tork verisi yok. Ruhsattaki veya üretici belgesindeki değerleri gir.",noTune:"Bu motor için güvenilir Stage 1 tahmini yok. Motor, ECU yazılımı ve şanzıman doğrulanarak teklif hazırlanmalı.",tuneCaution:"Stage 1 aralıkları turbo motorlarda yalnızca genel matematiksel örnektir; ölçüm, onaylı kalibrasyon, TÜV veya garanti değildir. Gerçek hedef ECU, şanzıman, kondisyon ve mevzuata bağlıdır.",common:"İlgili arıza kodları",codeCaution:"Bunlar bu araca özel arıza istatistiği değildir. Sisteme ilişkin kontrol edilebilecek örnek kodlardır; tanımlar üreticiye göre değişebilir.",open:"Teşhis kataloğunda aç",openStage:"Stage 1 sayfasına geç",empty:"Önce marka ve model seç. Motor varyantı varsa listeden seç; bulunamazsa elle ekle.",variant:"Açık araç veritabanı / örnek kayıt. OEM doğrulaması değildir.",manual:"Elle girilen değerler kullanıcı beyanıdır; üretici verisi olarak gösterilmez.",fuels:{Diesel:"Dizel",Benzin:"Benzin",Hybrid:"Hibrit",PHEV:"Şarj edilebilir hibrit",Electric:"Elektrik",LPG:"LPG",CNG:"CNG"}},
de:{kicker:"6006 / FAHRZEUG & MOTORFINDER",head:"Fahrzeug wählen, Motor und Fehlercodes sehen.",intro:"Marke über VIN-Anfang bestimmen oder Marke, Modell, Baujahr, Kraftstoff und Motor manuell wählen. Motor-Referenzdaten, Stage-1-Vorprüfung und passende OBD-Themen auf einer Seite.",all:"Alle Fehlercodes",vin:"Fahrgestellnummer (FIN/VIN)",vinHelp:"Hersteller wird zuerst lokal gesucht; andernfalls werden nur die ersten 3 Stellen bei NHTSA abgefragt. Die vollständige FIN wird nicht versendet oder gespeichert. Fahrzeug und Motor separat bestätigen.",decode:"Marke erkennen",invalid:"Die VIN muss 17 Zeichen haben und darf I, O, Q nicht enthalten.",unsupported:"Hersteller nicht sicher erkennbar. Bitte Marke manuell wählen.",found:"Aus VIN erkannte Marke",make:"Marke",model:"Modell",year:"Baujahr",fuel:"Kraftstoff",engine:"Motorvariante",other:"Motorkennbuchstabe, falls nicht gelistet",power:"Serienleistung (PS)",torque:"Seriendrehmoment (Nm)",choose:"Wählen",allFuel:"Alle",noneMotor:"Nicht gelistet / manuell eingeben",loading:"Motorvarianten werden geladen…",selected:"Ausgewähltes Fahrzeug",stage:"Stage 1 Vorprüfung",old:"Serie",new:"Stage 1 (Schätzung)",value:"Wert",hp:"Leistung",nm:"Drehmoment",noData:"Keine Leistungs-/Drehmomentwerte vorhanden. Werte bitte aus verlässlichen Fahrzeugpapieren prüfen.",noTune:"Für diesen Motor liegt keine verifizierte Stage-1-Prognose vor. Ein Angebot erfordert Motor-, Steuergerät- und Getriebeprüfung.",tuneCaution:"Die Stage-1-Spannen sind nur rechnerische Beispiele für Turbomotoren, keine Messung, geprüfte Kalibrierung, TÜV-Zusage oder Garantie. Zielwerte hängen von Softwarestand, Getriebe, Zustand und Rechtslage ab.",common:"Relevante Fehlercodes",codeCaution:"Keine statistisch nachgewiesenen typischen Defekte dieses Fahrzeugs. Es handelt sich um mögliche Prüfcodes; herstellerspezifische Bedeutungen können abweichen.",open:"Im Diagnosekatalog öffnen",openStage:"Stage-1-Seite öffnen",empty:"Bitte Marke und Modell wählen. Motorvariante auswählen oder fehlende Variante manuell ergänzen.",variant:"Offene Fahrzeugreferenz / Beispieldaten, keine OEM-Bestätigung.",manual:"Manuelle Daten werden nicht als Herstellerangabe dargestellt.",fuels:{Diesel:"Diesel",Benzin:"Benzin",Hybrid:"Hybrid",PHEV:"Plug-in-Hybrid",Electric:"Elektro",LPG:"Autogas (LPG)",CNG:"Erdgas (CNG)"}},
en:{kicker:"6006 / VEHICLE & ENGINE FINDER",head:"Choose your vehicle, inspect engine and fault codes.",intro:"Identify manufacturer from VIN prefix, or choose make, model, year, fuel and engine. View engine reference data, preliminary Stage 1 guidance and related DTCs.",all:"All fault codes",vin:"Vehicle identification number (VIN)",vinHelp:"Manufacturer is checked locally first; if unknown, only the 3-character prefix is sent to NHTSA. The full VIN is never transmitted or stored. Verify make, model and engine.",decode:"Find make",invalid:"VIN must have 17 characters and cannot contain I, O or Q.",unsupported:"Manufacturer could not be identified reliably. Please choose the make.",found:"Make identified from VIN",make:"Make",model:"Model",year:"Model year",fuel:"Fuel",engine:"Engine variant",other:"Engine code if missing",power:"Stock power (PS)",torque:"Stock torque (Nm)",choose:"Choose",allFuel:"All",noneMotor:"Not listed / enter manually",loading:"Loading engine variants…",selected:"Selected vehicle",stage:"Stage 1 preliminary assessment",old:"Stock",new:"Stage 1 (estimate)",value:"Value",hp:"Power",nm:"Torque",noData:"No stock power or torque data. Confirm them from reliable vehicle records.",noTune:"No verified Stage 1 forecast for this engine. The engine, ECU and gearbox must be checked before quotation.",tuneCaution:"Stage 1 ranges are generic mathematical examples for turbocharged engines only; not measured results, approved calibrations, road-legal promises or guarantees. Actual targets depend on ECU, gearbox, condition and regulations.",common:"Related fault codes",codeCaution:"These codes are examples to investigate, not established failure statistics for this vehicle. Manufacturer-specific meanings can differ.",open:"Open diagnosis catalog",openStage:"Open Stage 1 page",empty:"Choose make and model. Select an engine variant or enter one manually.",variant:"Open vehicle reference data / examples; not OEM verified.",manual:"Manually entered values are not presented as manufacturer specifications.",fuels:{Diesel:"Diesel",Benzin:"Petrol",Hybrid:"Hybrid",PHEV:"Plug-in hybrid",Electric:"Electric",LPG:"LPG",CNG:"CNG"}}};
function lang(){const l=String(document.documentElement.lang||"").slice(0,2);return w[l]?l:"de";}
function t(key){return w[lang()][key];}
const section=document.createElement("section");section.id="vehicle-selector-6006";section.className="vin6006-wrap";
section.innerHTML='<div class="vin6006-frame"><div class="vin6006-head"><div><p class="vin6006-kicker" id="vin6-kicker"></p><h2 id="vin6-heading"></h2><p id="vin6-intro"></p></div><a href="/fehlercodes/" id="vin6-all"></a></div>'
+'<div class="vin6006-grid"><div class="vin6006-field vin6006-vin"><label for="vin6-vin" id="vin6-vin-label"></label><div class="vin6006-vin-row"><input id="vin6-vin" type="text" maxlength="17" spellcheck="false" autocomplete="off" autocapitalize="characters" placeholder="WVWZZZ3CZGE123456"><button type="button" id="vin6-decode"></button></div><p class="vin6006-vin-help" id="vin6-vin-help"></p><p class="vin6006-vin-feedback" id="vin6-feedback" role="status" aria-live="polite"></p></div>'
+'<div class="vin6006-field"><label for="vin6-make" id="vin6-lmake"></label><select id="vin6-make"></select></div>'
+'<div class="vin6006-field"><label for="vin6-model" id="vin6-lmodel"></label><select id="vin6-model"></select></div>'
+'<div class="vin6006-field"><label for="vin6-year" id="vin6-lyear"></label><select id="vin6-year"></select></div>'
+'<div class="vin6006-field"><label for="vin6-fuel" id="vin6-lfuel"></label><select id="vin6-fuel"></select></div>'
+'<div class="vin6006-field" style="grid-column:1/-1"><label for="vin6-engine" id="vin6-lengine"></label><select id="vin6-engine"></select></div></div>'
+'<div class="vin6006-details"><div class="vin6006-field"><label for="vin6-manual" id="vin6-lmanual"></label><input id="vin6-manual" type="text" maxlength="80" placeholder="2.0 TDI CRLB / OM654 / B47" /></div><div class="vin6006-field"><label for="vin6-ps" id="vin6-lps"></label><input id="vin6-ps" type="number" inputmode="numeric" min="1" max="3000" placeholder="150" /></div><div class="vin6006-field"><label for="vin6-nm" id="vin6-lnm"></label><input id="vin6-nm" type="number" inputmode="numeric" min="1" max="3000" placeholder="340" /></div></div>'
+'<div class="vin6006-result" id="vin6-result" hidden aria-live="polite"><h3 id="vin6-result-head"></h3><p class="vin6006-identity" id="vin6-identity"></p><div class="vin6006-result-layout"><div class="vin6006-panel"><h4 id="vin6-stagehead"></h4><table class="vin6006-table"><thead><tr><th id="vin6-th1"></th><th id="vin6-th2"></th><th id="vin6-th3"></th></tr></thead><tbody id="vin6-metrics"></tbody></table><p class="vin6006-note" id="vin6-stage-note"></p></div><div class="vin6006-panel"><h4 id="vin6-codehead"></h4><div class="vin6006-codes" id="vin6-code-list"></div><p class="vin6006-note" id="vin6-code-note"></p></div></div><div class="vin6006-links"><a id="vin6-stage-link" href="/#aracin"></a><a id="vin6-dtc-link" href="/fehlercodes/"></a></div><p class="vin6006-note" id="vin6-provenance"></p></div>'
+'</div>';
tab.insertAdjacentElement("beforebegin",section);
const $=id=>document.getElementById("vin6-"+id);
const make=$("make"),model=$("model"),year=$("year"),fuel=$("fuel"),engine=$("engine"),manual=$("manual"),ps=$("ps"),nm=$("nm"),report=$("result"),feedback=$("feedback");
// Quick links show that the finder is not limited to Volkswagen.
// The native make dropdown remains the complete catalogue, not the buttons below.
const popularMakes=["Volkswagen","BMW","Mercedes-Benz","Audi","Ford","Toyota","Renault","Peugeot","Hyundai","Kia","Opel","Škoda","Porsche","Fiat","Honda","Tesla","Volvo","Nissan"];
const brandBar=document.createElement("div");brandBar.className="vin6006-brands";
const brandCaption=document.createElement("p");brandCaption.className="vin6006-brand-caption";
const brandChips=document.createElement("div");brandChips.className="vin6006-brand-chips";
const otherBrands=document.createElement("button");otherBrands.type="button";otherBrands.className="vin6006-brand-all";
brandBar.append(brandCaption,brandChips,otherBrands);
section.querySelector(".vin6006-head").insertAdjacentElement("afterend",brandBar);
const brandText={
tr:{title:"Popüler markalar · Tüm diğer markalar listede",all:"Tüm markaları seç",checking:"VIN üretici kodu kontrol ediliyor…",noMatch:"Üretici bu VIN kodundan doğrulanamadı. Marka listesinden seçebilirsiniz."},
de:{title:"Beliebte Marken · Alle weiteren im Auswahlmenü",all:"Alle Marken wählen",checking:"VIN-Herstellercode wird geprüft…",noMatch:"Hersteller nicht eindeutig zuordenbar. Bitte Marke im Menü auswählen."},
en:{title:"Popular makes · All other makes in the selector",all:"Select from all makes",checking:"Checking VIN manufacturer prefix…",noMatch:"Make not confirmed by VIN prefix. Please select a make manually."}
};
function normalizeMake(value){return String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");}
function renderMakeButtons(){
 const txt=brandText[lang()];
 brandCaption.textContent=txt.title;otherBrands.textContent=txt.all;
 brandChips.replaceChildren();
 const all=[...make.options].map(o=>o.value).filter(Boolean);
 for(const name of popularMakes){
   const matched=all.find(v=>normalizeMake(v)===normalizeMake(name));
   if(!matched)continue;
   const button=document.createElement("button");button.type="button";button.textContent=name;
   button.setAttribute("aria-pressed",String(make.value===matched));
   button.addEventListener("click",()=>{
    make.value=matched;make.dispatchEvent(new Event("change",{bubbles:true}));
    renderMakeButtons();make.scrollIntoView({behavior:"smooth",block:"center"});
   });
   brandChips.append(button);
 }
}
otherBrands.addEventListener("click",()=>{make.scrollIntoView({behavior:"smooth",block:"center"});make.focus({preventScroll:true});});
const fuelKeys=["","Diesel","Benzin","Hybrid","PHEV","Electric","LPG","CNG"];
let variants=[],busy=0,memory={};
const preferred=new URLSearchParams(location.search);
try{memory=JSON.parse(sessionStorage.getItem("6006-vehicle-choice")||"{}")||{};}catch(e){}
function option(select,value,name){select.append(new Option(name,value));}
function fill(select,entries,label){select.replaceChildren();option(select,"",label||t("choose"));entries.forEach(item=>option(select,item[0],item[1]));}
function numeric(value){const num=Number(value);return Number.isFinite(num)&&num>0&&num<=3000?Math.round(num):null;}
function readFuel(value){const v=String(value||"").toLowerCase();if(/plug|phev/.test(v))return"PHEV";if(/hybrid/.test(v))return"Hybrid";if(/diesel|tdi|cdi|bluehdi|dci/.test(v))return"Diesel";if(/electric|electro|elektro|bev/.test(v))return"Electric";if(/lpg/.test(v))return"LPG";if(/cng/.test(v))return"CNG";if(/gasoline|petrol|benzin|tsi|tfsi|otto/.test(v))return"Benzin";return"";}
function clean(value){return String(value||"").trim().toLowerCase().replace(/[()[\]-]/g," ").replace(/\s+/g," ");}
function translate(){
const labels={kicker:"kicker",heading:"head",intro:"intro",all:"all", "vin-label":"vin",decode:"decode","vin-help":"vinHelp",lmake:"make",lmodel:"model",lyear:"year",lfuel:"fuel",lengine:"engine",lmanual:"other",lps:"power",lnm:"torque","result-head":"selected",stagehead:"stage",codehead:"common",th1:"value",th2:"old",th3:"new","code-note":"codeCaution","stage-link":"openStage","dtc-link":"open"};
for(const [id,key]of Object.entries(labels)){$(id).textContent=t(key);}
renderMakeButtons();
if(fuel.options.length){const value=fuel.value;fill(fuel,fuelKeys.slice(1).map(k=>[k,w[lang()].fuels[k]]),t("allFuel"));fuel.value=value;}
if(engine.options.length)engine.options[0].textContent=t("noneMotor");
if(year.options.length)year.options[0].textContent=t("choose");
if(report&&!report.hidden)renderReport();
}
function fillMakes(){const current=make.value;const list=finder.brands().filter(Boolean).sort((a,b)=>a.localeCompare(b,"de"));fill(make,list.map(b=>[b,b]));if(current&&list.includes(current))make.value=current;renderMakeButtons();}
function populateModels(keep){const list=finder.models(make.value).filter(Boolean);fill(model,list.map(n=>[n,n]));if(keep&&list.includes(keep))model.value=keep;else if(keep){option(model,keep,keep);model.value=keep;}}
function sampleVariants(){
const makeName=clean(make.value),modelName=clean(model.value),y=Number(year.value);
if(makeName!=="volkswagen"||!modelName.includes("passat b8")||(y&&(y<2014||y>2023)))return[];
return[
{engine:"2.0 TDI CRLB",fuel:"Diesel",ps:150,nm:340,from:2014,to:2019,reference:"example"},
{engine:"2.0 TDI DFGA",fuel:"Diesel",ps:150,nm:340,from:2015,to:2020,reference:"example"}
].filter(v=>!y||(y>=v.from&&y<=v.to));
}
function findVariants(){
if(!make.value||!model.value)return[];
const y=year.value;
const attempts=[model.value,model.value.replace(/\b(B[0-9]|W[0-9]{3}|F[0-9]{2})\b/gi,"").trim(),model.value.split("(")[0].trim()];
let list=[];for(const q of [...new Set(attempts.filter(Boolean))]){list=finder.engineVariants(make.value,q,y);if(list.length)break;}
list=[...sampleVariants(),...list];
const f=fuel.value;const keys=new Set();return list.filter(v=>{
if(f&&readFuel(v.fuel||v.engine)!==f)return false;
const key=clean(v.engine)+"|"+(v.ps||v.hp||"")+"|"+(v.nm||"");if(keys.has(key))return false;keys.add(key);return true;
}).sort((a,b)=>String(a.engine).localeCompare(String(b.engine),"de",{numeric:true})).slice(0,450);
}
function stockPower(v){
 if(!v)return null;
 const stated=(String(v.engine||"").match(/\((\d{2,4})\s*HP\)/i)||[])[1];
 const fromLabel=stated?numeric(Number(stated)*1.01387):null;
 const fromCatalog=numeric(v.ps)||(v.hp?numeric(Number(v.hp)*1.01387):null);
 // Refuse self-contradictory third-party rated power without a notice.
 if(fromCatalog&&fromLabel&&Math.abs(fromCatalog-fromLabel)/fromLabel>0.08)return fromLabel;
 return fromCatalog||fromLabel;
}
function renderEngines(preserve){
variants=findVariants();const choices=variants.map((v,i)=>{const stock=stockPower(v);return[String(i),String(v.engine)+(stock?" · "+stock+" PS":"")+(numeric(v.nm)?" · "+Math.round(v.nm)+" Nm":"")];});
fill(engine,choices,t("noneMotor"));if(preserve&&choices.some(x=>x[0]===preserve))engine.value=preserve;
if(engine.value==="")showReport(false);
}
function showReport(flag){report.hidden=!flag;}
function saveChoice(){
if(!make.value||!model.value)return;
try{sessionStorage.setItem("6006-vehicle-choice",JSON.stringify({brand:make.value,model:model.value,year:year.value,powertrain:fuel.value,engine:manual.value||variants[Number(engine.value)]?.engine||"",ps:ps.value,gearbox:""}));}catch(e){}
}
function vehicleParams(){const p=new URLSearchParams();const props={brand:make.value,model:model.value,year:year.value,powertrain:fuel.value,engine:manual.value.trim()||((engine.value!=="")?variants[Number(engine.value)]?.engine:""),ps:ps.value};for(const [k,v]of Object.entries(props))if(v)p.set(k,v);return p;}
function relatedCodes(){
const name=clean(manual.value||variants[Number(engine.value)]?.engine),f=fuel.value||readFuel(name);
if(f==="Diesel")return [["P0299","Ladedruck / Turbo"],["P0401","AGR / EGR"],["P2002","DPF"],["P0101","Luftmassenmesser"]];
if(f==="Benzin"||f==="LPG"||f==="CNG")return [["P0300","Zündaussetzer / Misfire"],["P0171","Gemisch zu mager"],["P0420","Katalysator"],["P0101","Luftmassenmesser"]];
if(f==="Electric")return [["U0100","Steuergerätekommunikation"],["U0121","ABS-Kommunikation"],["C0035","Raddrehzahlsignal"]];
return [["P0101","Luftmassensignal"],["P0700","Getriebesteuerung"],["U0100","Netzwerk / CAN"]];
}
function showRange(value,factorMin,factorMax){
if(!value)return"—";
return Math.round(value*factorMin)+"–"+Math.round(value*factorMax);
}
function renderReport(){
if(!make.value||!model.value){showReport(false);return;}
showReport(true);
const v=engine.value===""?null:variants[Number(engine.value)],name=manual.value.trim()||(v?.engine||"");
const basePS=numeric(ps.value)||(v?stockPower(v):null),baseNM=numeric(nm.value)||(v?numeric(v.nm):null);
$("identity").textContent=[make.value,model.value,year.value,(!fuel.value?"":w[lang()].fuels[fuel.value]),name].filter(Boolean).join(" · ");
const f=fuel.value||readFuel(name);
const turbo=/(\bTDI\b|\bTSI\b|TFSI|CDI|CRDI|ECOBOOST|DIESEL|TURBO|BITURBO|TWINPOWER|BLUEHDI|DCI|T-JET|MULTIJET)/i.test(name);
const canEstimate=Boolean(turbo&&basePS&&baseNM&&(f==="Diesel"||f==="Benzin"));
const plusPS=canEstimate?showRange(basePS,f==="Diesel"?1.12:1.10,f==="Diesel"?1.22:1.18):"—";
const plusNM=canEstimate?showRange(baseNM,1.10,1.20):"—";
const table=$("metrics");table.replaceChildren();
for(const [label,original,forecast,unit]of [[t("hp"),basePS,plusPS,"PS"],[t("nm"),baseNM,plusNM,"Nm"]]){
const tr=document.createElement("tr");for(const value of [label,original?original+" "+unit:"—",forecast==="—"?"—":forecast+" "+unit]){const td=document.createElement("td");td.textContent=value;tr.append(td);}table.append(tr);
}
$("stage-note").textContent=canEstimate?t("tuneCaution"):t("noTune")+" "+(basePS&&baseNM?"":t("noData"));
const codes=$("code-list");codes.replaceChildren();
relatedCodes().forEach(([code,description])=>{const a=document.createElement("a");const params=vehicleParams();params.set("code",code);a.href="/fehlercodes/?"+params.toString();const strong=document.createElement("strong"),span=document.createElement("span"),arrow=document.createElement("b");strong.textContent=code;span.textContent=description;arrow.textContent="›";a.append(strong,span,arrow);codes.append(a);});
$("stage-link").href="/?"+vehicleParams().toString()+"#aracin";
$("dtc-link").href="/fehlercodes/?"+vehicleParams().toString();
$("provenance").textContent=t("variant")+(v?.reference==="example"?" · "+t("manual"):"");
saveChoice();
}
const wmi={
"WVW":"Volkswagen","WVG":"Volkswagen","WV1":"Volkswagen","WV2":"Volkswagen","3VW":"Volkswagen","9BW":"Volkswagen",
"WAU":"Audi","WA1":"Audi","TRU":"Audi",
"WBA":"BMW","WBS":"BMW","WBY":"BMW","5UX":"BMW","5YM":"BMW",
"WDB":"Mercedes-Benz","WDD":"Mercedes-Benz","WDC":"Mercedes-Benz","W1K":"Mercedes-Benz","W1N":"Mercedes-Benz","W1V":"Mercedes-Benz",
"WF0":"Ford","1FA":"Ford","1FM":"Ford","3FA":"Ford",
"VF1":"Renault","VF3":"Peugeot","VF7":"Citroën","VR1":"DS Automobiles",
"W0L":"Opel","W0V":"Opel","ZFA":"Fiat","ZAR":"Alfa Romeo","ZFF":"Ferrari",
"TMB":"Škoda","VSS":"SEAT","VSK":"Nissan","JN1":"Nissan","JTD":"Toyota","JTM":"Toyota","SB1":"Toyota",
"KMH":"Hyundai","KNA":"Kia","KND":"Kia","SAL":"Land Rover","SAJ":"Jaguar",
"YV1":"Volvo","YV4":"Volvo","YS3":"Saab","WP0":"Porsche","WP1":"Porsche","SJN":"Nissan",
"JHM":"Honda","SHH":"Honda","JH4":"Acura","JM1":"Mazda","JMZ":"Mazda","JMB":"Mitsubishi",
"4T1":"Toyota","5TD":"Toyota","JT2":"Toyota","1G1":"Chevrolet","2G1":"Chevrolet","3GN":"Chevrolet",
"1C4":"Jeep","1J4":"Jeep","1HG":"Honda","1N4":"Nissan","5N1":"Nissan","3N1":"Nissan",
"5YJ":"Tesla","7SA":"Tesla","JTH":"Lexus","NMT":"Toyota","JS1":"Suzuki","KM8":"Hyundai","KMT":"Genesis","LDC":"Peugeot"
};
function selectManufacturer(raw){
 const aliases={MERCEDESBENZ:"Mercedes-Benz",MERCEDESAMG:"Mercedes-Amg",VOLKSWAGEN:"Volkswagen",SKODA:"Škoda",SEAT:"SEAT",CHEVROLET:"Chevrolet",LANDROVER:"Land Rover",TOYOTAMOTOR:"Toyota",BMW:"BMW",ROLLSROYCE:"Rolls-Royce",ALFAROMEO:"Alfa Romeo"};
 const name=aliases[normalizeMake(raw).toUpperCase()]||raw;
 const normalized=normalizeMake(name);
 const matched=[...make.options].find(o=>normalizeMake(o.value)===normalized);
 if(!matched&&!name)return false;
 if(!matched)option(make,name,name);
 make.value=matched?.value||name;
 feedback.textContent=t("found")+": "+make.value;
 make.dispatchEvent(new Event("change",{bubbles:true}));
 renderMakeButtons();
 return true;
}
let lookupId=0;
async function identify(){
 const full=$("vin").value.trim().replace(/\s|-/g,"").toUpperCase();
 $("vin").value=full;const token=++lookupId;
 if(!/^[A-HJ-NPR-Z0-9]{17}$/.test(full)){feedback.textContent=t("invalid");return;}
 const prefix=full.slice(0,3);
 if(wmi[prefix]){selectManufacturer(wmi[prefix]);return;}
 feedback.textContent=brandText[lang()].checking;
 // NHTSA's WMI endpoint sees the *three-character manufacturer prefix only*.
 // It does not receive the full VIN; European domestic-only makes may not be found.
 try{
  const controller=new AbortController(),abortId=setTimeout(()=>controller.abort(),7000);
  let response;
  try{response=await fetch("https://vpic.nhtsa.dot.gov/api/vehicles/DecodeWMI/"+encodeURIComponent(prefix)+"?format=json",{signal:controller.signal});}
  finally{clearTimeout(abortId);}
  if(!response.ok)throw Error("WMI response "+response.status);
  const data=await response.json();
  if(token!==lookupId)return;
  const records=Array.isArray(data.Results)?data.Results:[];
  const identified=records.find(x=>x&&x.Make&&String(x.Make).trim());
  if(identified&&selectManufacturer(String(identified.Make).trim()))return;
 }catch(e){if(token!==lookupId)return;}
 if(token===lookupId)feedback.textContent=brandText[lang()].noMatch;
}
function syncVariant(){
const v=engine.value===""?null:variants[Number(engine.value)];
if(v){manual.value="";ps.value=stockPower(v)||"";nm.value=v.nm||"";if(!fuel.value&&readFuel(v.fuel||v.engine))fuel.value=readFuel(v.fuel||v.engine);}
renderReport();
}
async function makeChanged(keep){
const token=++busy;populateModels(keep||"");renderEngines("");showReport(false);
if(!make.value)return;
await finder.loadOpenBrand(make.value);
if(token!==busy)return;
await finder.loadModels(make.value);
if(token!==busy)return;
populateModels(keep||model.value);renderEngines("");if(model.value)renderReport();
}
async function modelChanged(){
const token=++busy;renderEngines("");if(make.value)await finder.loadOpenBrand(make.value);if(token!==busy)return;renderEngines("");renderReport();
}
option(year,"",t("choose"));
for(let y=new Date().getFullYear()+1;y>=1950;y--)option(year,String(y),String(y));
fill(fuel,fuelKeys.slice(1).map(k=>[k,w[lang()].fuels[k]]),t("allFuel"));
fillMakes();populateModels("");renderEngines("");
$("decode").addEventListener("click",identify);
$("vin").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();identify();}});
make.addEventListener("change",()=>{manual.value="";ps.value="";nm.value="";fuel.value="";year.value="";makeChanged("");renderMakeButtons();});
model.addEventListener("change",()=>{manual.value="";ps.value="";nm.value="";fuel.value="";modelChanged();});
year.addEventListener("change",()=>{manual.value="";ps.value="";nm.value="";renderEngines("");renderReport();});
fuel.addEventListener("change",()=>{manual.value="";ps.value="";nm.value="";renderEngines("");renderReport();});
engine.addEventListener("change",syncVariant);
for(const e of [manual,ps,nm]){e.addEventListener("change",renderReport);e.addEventListener("input",renderReport);}
window.addEventListener("6006-makes-ready",()=>{const current=make.value;fillMakes();if(current&&!make.value){option(make,current,current);make.value=current;}});
window.addEventListener("6006-models-ready",e=>{if(e.detail?.brand===make.value){const current=model.value;populateModels(current);}});
new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
const initial={make:preferred.get("brand")||memory.brand||"",model:preferred.get("model")||memory.model||"",year:preferred.get("year")||memory.year||"",fuel:preferred.get("powertrain")||memory.powertrain||"",engine:preferred.get("engine")||memory.engine||"",ps:preferred.get("ps")||memory.ps||""};
async function restore(){
if(initial.make){if(![...make.options].some(o=>o.value===initial.make))option(make,initial.make,initial.make);make.value=initial.make;populateModels(initial.model);
if(initial.model)model.value=initial.model;}
if(initial.year&&[...year.options].some(o=>o.value===initial.year))year.value=initial.year;
if(initial.fuel&&fuelKeys.includes(initial.fuel))fuel.value=initial.fuel;
if(initial.ps)ps.value=initial.ps;
if(initial.engine)manual.value=initial.engine;
translate();
if(make.value){await makeChanged(initial.model);if(model.value){renderEngines("");const found=variants.findIndex(v=>clean(v.engine)===clean(initial.engine));if(found>=0){engine.value=String(found);manual.value="";syncVariant();}else renderReport();}}
}
restore();
})();