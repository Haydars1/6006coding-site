(()=>{
"use strict";
const finder=window.VehicleCatalog6006,main=document.querySelector("main"),tab=document.querySelector("#catalog");
if(!finder||!main||!tab||document.getElementById("vehicle-selector-6006"))return;
const w={
tr:{kicker:"6006 / ARAÇ & MOTOR BULUCU",head:"Aracını seç, motorunu ve arıza kodlarını gör.",intro:"Şasi numarasından markayı belirle veya marka, model, yıl, yakıt ve motor seç. Mevcut katalogdaki motor verileri, Stage 1 ön değerlendirmesi ve ilgili OBD kodları tek ekranda.",all:"Tüm arıza kodları",vin:"Şasi numarası (VIN)",vinHelp:"17 karakterli VIN için önce yerel üretici kodlarına bakılır; tanınmazsa yalnızca ilk 3 karakter NHTSA'ya sorgulanır. Tam VIN gönderilmez veya kaydedilmez. Üretici/model/motor doğrulanmalıdır.",decode:"Markayı bul",invalid:"VIN 17 karakter olmalı ve I, O, Q içermemeli.",unsupported:"Bu VIN'den marka güvenilir biçimde belirlenemedi. Markayı listeden seçebilirsin.",found:"VIN'den belirlenen marka",make:"Marka",model:"Model",year:"Model yılı",fuel:"Yakıt",engine:"Motor / varyant",other:"Listede yoksa motor kodu",power:"Orijinal güç (PS)",torque:"Orijinal tork (Nm)",choose:"Seçin",allFuel:"Tümü",noneMotor:"Listede bulunmuyor / elle gir",loading:"Motor varyantları yükleniyor…",selected:"Seçilen araç",stage:"Stage 1 ön değerlendirmesi",old:"Orijinal",new:"Stage 1 (tahmini)",value:"Değer",hp:"Güç",nm:"Tork",noData:"Güç / tork verisi yok. Ruhsattaki veya üretici belgesindeki değerleri gir.",noTune:"Bu motor için güvenilir Stage 1 tahmini yok. Motor, ECU yazılımı ve şanzıman doğrulanarak teklif hazırlanmalı.",tuneCaution:"Stage 1 aralıkları turbo motorlarda yalnızca genel matematiksel örnektir; ölçüm, onaylı kalibrasyon, TÜV veya garanti değildir. Gerçek hedef ECU, şanzıman, kondisyon ve mevzuata bağlıdır.",common:"İlgili arıza kodları",codeCaution:"Bunlar bu araca özel arıza istatistiği değildir. Sisteme ilişkin kontrol edilebilecek örnek kodlardır; tanımlar üreticiye göre değişebilir.",open:"Teşhis kataloğunda aç",openStage:"Stage 1 sayfasına geç",empty:"Önce marka ve model seç. Motor varyantı varsa listeden seç; bulunamazsa elle ekle.",variant:"Açık araç veritabanı / örnek kayıt. OEM doğrulaması değildir.",manual:"Elle girilen değerler kullanıcı beyanıdır; üretici verisi olarak gösterilmez.",variantCount:"motor varyantı",noVariants:"Bu seçimde motor verisi yok; alttaki alana motor kodu gir.",reviewWarning:"Referans güç verisi tutarsız veya hibrit sistem gücü belirsiz; ruhsat/üretici kaynağıyla doğrulayın.",searchLabel:"Motor, nesil veya şanzıman içinde ara",familyWarning:"Motor kaydı seçilen serinin tam karşılığı değil; aynı model ailesinden. Şasi ve motor koduyla doğrulayın.",fuels:{Diesel:"Dizel",Benzin:"Benzin",Hybrid:"Hibrit",PHEV:"Şarj edilebilir hibrit",Electric:"Elektrik",LPG:"LPG",CNG:"CNG"}},
de:{kicker:"6006 / FAHRZEUG & MOTORFINDER",head:"Fahrzeug wählen, Motor und Fehlercodes sehen.",intro:"Marke über VIN-Anfang bestimmen oder Marke, Modell, Baujahr, Kraftstoff und Motor manuell wählen. Motor-Referenzdaten, Stage-1-Vorprüfung und passende OBD-Themen auf einer Seite.",all:"Alle Fehlercodes",vin:"Fahrgestellnummer (FIN/VIN)",vinHelp:"Hersteller wird zuerst lokal gesucht; andernfalls werden nur die ersten 3 Stellen bei NHTSA abgefragt. Die vollständige FIN wird nicht versendet oder gespeichert. Fahrzeug und Motor separat bestätigen.",decode:"Marke erkennen",invalid:"Die VIN muss 17 Zeichen haben und darf I, O, Q nicht enthalten.",unsupported:"Hersteller nicht sicher erkennbar. Bitte Marke manuell wählen.",found:"Aus VIN erkannte Marke",make:"Marke",model:"Modell",year:"Baujahr",fuel:"Kraftstoff",engine:"Motorvariante",other:"Motorkennbuchstabe, falls nicht gelistet",power:"Serienleistung (PS)",torque:"Seriendrehmoment (Nm)",choose:"Wählen",allFuel:"Alle",noneMotor:"Nicht gelistet / manuell eingeben",loading:"Motorvarianten werden geladen…",selected:"Ausgewähltes Fahrzeug",stage:"Stage 1 Vorprüfung",old:"Serie",new:"Stage 1 (Schätzung)",value:"Wert",hp:"Leistung",nm:"Drehmoment",noData:"Keine Leistungs-/Drehmomentwerte vorhanden. Werte bitte aus verlässlichen Fahrzeugpapieren prüfen.",noTune:"Für diesen Motor liegt keine verifizierte Stage-1-Prognose vor. Ein Angebot erfordert Motor-, Steuergerät- und Getriebeprüfung.",tuneCaution:"Die Stage-1-Spannen sind nur rechnerische Beispiele für Turbomotoren, keine Messung, geprüfte Kalibrierung, TÜV-Zusage oder Garantie. Zielwerte hängen von Softwarestand, Getriebe, Zustand und Rechtslage ab.",common:"Relevante Fehlercodes",codeCaution:"Keine statistisch nachgewiesenen typischen Defekte dieses Fahrzeugs. Es handelt sich um mögliche Prüfcodes; herstellerspezifische Bedeutungen können abweichen.",open:"Im Diagnosekatalog öffnen",openStage:"Stage-1-Seite öffnen",empty:"Bitte Marke und Modell wählen. Motorvariante auswählen oder fehlende Variante manuell ergänzen.",variant:"Offene Fahrzeugreferenz / Beispieldaten, keine OEM-Bestätigung.",manual:"Manuelle Daten werden nicht als Herstellerangabe dargestellt.",variantCount:"Motorvarianten",noVariants:"Für diese Auswahl fehlen Motordaten. Motorkennung unten manuell eingeben.",reviewWarning:"Referenzleistung widersprüchlich oder Hybrid-Systemleistung unklar; bitte mit Fahrzeugpapieren bestätigen.",searchLabel:"Motor, Generation oder Getriebe suchen",familyWarning:"Motorreferenz stammt aus der Modellfamilie, nicht aus einer bestätigten exakten Baureihe. FIN und Motorkennung prüfen.",fuels:{Diesel:"Diesel",Benzin:"Benzin",Hybrid:"Hybrid",PHEV:"Plug-in-Hybrid",Electric:"Elektro",LPG:"Autogas (LPG)",CNG:"Erdgas (CNG)"}},
en:{kicker:"6006 / VEHICLE & ENGINE FINDER",head:"Choose your vehicle, inspect engine and fault codes.",intro:"Identify manufacturer from VIN prefix, or choose make, model, year, fuel and engine. View engine reference data, preliminary Stage 1 guidance and related DTCs.",all:"All fault codes",vin:"Vehicle identification number (VIN)",vinHelp:"Manufacturer is checked locally first; if unknown, only the 3-character prefix is sent to NHTSA. The full VIN is never transmitted or stored. Verify make, model and engine.",decode:"Find make",invalid:"VIN must have 17 characters and cannot contain I, O or Q.",unsupported:"Manufacturer could not be identified reliably. Please choose the make.",found:"Make identified from VIN",make:"Make",model:"Model",year:"Model year",fuel:"Fuel",engine:"Engine variant",other:"Engine code if missing",power:"Stock power (PS)",torque:"Stock torque (Nm)",choose:"Choose",allFuel:"All",noneMotor:"Not listed / enter manually",loading:"Loading engine variants…",selected:"Selected vehicle",stage:"Stage 1 preliminary assessment",old:"Stock",new:"Stage 1 (estimate)",value:"Value",hp:"Power",nm:"Torque",noData:"No stock power or torque data. Confirm them from reliable vehicle records.",noTune:"No verified Stage 1 forecast for this engine. The engine, ECU and gearbox must be checked before quotation.",tuneCaution:"Stage 1 ranges are generic mathematical examples for turbocharged engines only; not measured results, approved calibrations, road-legal promises or guarantees. Actual targets depend on ECU, gearbox, condition and regulations.",common:"Related fault codes",codeCaution:"These codes are examples to investigate, not established failure statistics for this vehicle. Manufacturer-specific meanings can differ.",open:"Open diagnosis catalog",openStage:"Open Stage 1 page",empty:"Choose make and model. Select an engine variant or enter one manually.",variant:"Open vehicle reference data / examples; not OEM verified.",manual:"Manually entered values are not presented as manufacturer specifications.",variantCount:"engine variants",noVariants:"No engine data for this selection. Enter engine code manually below.",reviewWarning:"Conflicting reference power or unclear hybrid system output; verify from vehicle records.",searchLabel:"Search engine, generation or gearbox",familyWarning:"Engine reference belongs to the model family, not a verified exact generation. Confirm with VIN and engine code.",fuels:{Diesel:"Diesel",Benzin:"Petrol",Hybrid:"Hybrid",PHEV:"Plug-in hybrid",Electric:"Electric",LPG:"LPG",CNG:"CNG"}}};
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

// Quotation handoff stays entirely browser-side until the visitor opens a contact link.
// The VIN input is intentionally NEVER part of the outgoing message.
const quoteCopy={
tr:{head:"Stage 1 / ECU için kişisel teklif iste",intro:"Motoru seçtikten sonra araç bilgilerini WhatsApp veya e-postayla 6006 Performance'a gönderebilirsin. Güç artışı ancak motor, ECU, şanzıman ve araç durumu kontrol edilince değerlendirilir.",mileage:"Kilometre (isteğe bağlı)",ecu:"ECU / yazılım versiyonu (biliniyorsa)",note:"Talep / belirti (isteğe bağlı)",wa:"WhatsApp ile teklif iste →",email:"E-posta ile teklif iste →",choose:"Teklif bağlantısını açmak için motor seç veya motor kodunu elle gir.",ready:"Motor seçimi hazır. Gönderilecek bilgiler aşağıda özetlendi.",preview:"Gönderilecek araç özeti",privacy:"Şasi numarası (VIN) gönderilmez. Bağlantıya dokunduğunda WhatsApp veya e-posta uygulamasına geçilir; mesajı göndermek senin kontrolündedir.",subject:"6006 Performance | Stage 1 ve ECU değerlendirme talebi",salutation:"Merhaba 6006 Performance, aracıma özel Stage 1 / ECU değerlendirmesi ve fiyat bilgisi rica ediyorum.",stock:"Referans stok değer",unverified:"Referans veri doğrulanmamış / OEM onayı yok",family:"Model ailesi eşleşmesi; tam jenerasyon doğrulanmadı",verification:"Motor kodu, ECU yazılımı, şanzıman, kondisyon ve yasal uygunluk kontrol edilmelidir.",mileageUnit:"km",vehicle:"Araç",year:"Yıl",fuel:"Yakıt",engine:"Motor",generation:"Nesil",gearbox:"Şanzıman",ecuVersion:"ECU",extra:"Açıklama",unavailable:"Bilinmiyor"},
de:{head:"Individuelles Angebot für Stage 1 / ECU",intro:"Motor auswählen und Fahrzeugdaten per WhatsApp oder E-Mail an 6006 Performance übermitteln. Leistungswerte erfordern eine Prüfung von Motor, ECU, Getriebe und Zustand.",mileage:"Kilometerstand (optional)",ecu:"ECU / Softwarestand (falls bekannt)",note:"Wunsch / Symptome (optional)",wa:"Angebot per WhatsApp anfragen →",email:"Angebot per E-Mail anfragen →",choose:"Bitte zuerst eine Motorvariante wählen oder die Motorkennung eingeben.",ready:"Motor gewählt. Die folgenden Angaben werden vorbereitet.",preview:"Zusammenfassung der Anfrage",privacy:"Die Fahrgestellnummer (VIN) wird nicht übertragen. WhatsApp bzw. E-Mail öffnet sich erst beim Klick; das Absenden bleibt Ihre Entscheidung.",subject:"6006 Performance | Stage 1 / ECU Anfrage",salutation:"Hallo 6006 Performance, bitte prüfen Sie Stage 1 / ECU Möglichkeiten und ein individuelles Angebot für mein Fahrzeug.",stock:"Serien-Referenzwerte",unverified:"Referenzdaten nicht OEM-verifiziert",family:"Modellfamilie statt exakter Baureihe; bitte prüfen",verification:"Motorkennung, ECU-Software, Getriebe, Zustand und Zulässigkeit bitte prüfen.",mileageUnit:"km",vehicle:"Fahrzeug",year:"Baujahr",fuel:"Kraftstoff",engine:"Motor",generation:"Generation",gearbox:"Getriebe",ecuVersion:"ECU",extra:"Hinweise",unavailable:"Unbekannt"},
en:{head:"Request an individual Stage 1 / ECU quote",intro:"Select an engine, then share the vehicle details with 6006 Performance by WhatsApp or email. Any power upgrade requires engine, ECU, gearbox and condition checks.",mileage:"Mileage (optional)",ecu:"ECU / software version (if known)",note:"Request / symptoms (optional)",wa:"Ask via WhatsApp →",email:"Ask via email →",choose:"Select an engine variant or enter the engine code before requesting a quote.",ready:"Engine selection ready. The summary below will be shared.",preview:"Vehicle request summary",privacy:"Your VIN is not included. WhatsApp or your email app opens only after you click; sending the message is your choice.",subject:"6006 Performance | Stage 1 / ECU inquiry",salutation:"Hello 6006 Performance, please check Stage 1 / ECU suitability and quote for my vehicle.",stock:"Reference stock figures",unverified:"Reference data not OEM verified",family:"Model-family match, exact generation not verified",verification:"Please verify engine code, ECU software, gearbox, condition and local regulations.",mileageUnit:"km",vehicle:"Vehicle",year:"Year",fuel:"Fuel",engine:"Engine",generation:"Generation",gearbox:"Gearbox",ecuVersion:"ECU",extra:"Notes",unavailable:"Unknown"}
};
const contactWaNumber="491788354756",contactEmail="6006performance@gmail.com";
const quoteBox=document.createElement("section");
quoteBox.className="vin6006-quote";quoteBox.id="vin6-quote";
quoteBox.innerHTML='<div class="vin6006-quote-top"><div class="vin6006-quote-eyebrow">6006 PERFORMANCE · ECU / STAGE 1</div><h4 id="vin6-quote-title"></h4><p id="vin6-quote-intro"></p></div>'
+'<div class="vin6006-quote-grid"><div class="vin6006-field"><label for="vin6-mileage" id="vin6-mileage-label"></label><input type="number" id="vin6-mileage" inputmode="numeric" min="0" max="2000000" placeholder="120000"></div>'
+'<div class="vin6006-field"><label for="vin6-ecu" id="vin6-ecu-label"></label><input type="text" id="vin6-ecu" maxlength="90" placeholder="EDC17 / Bosch / SW ..."></div>'
+'<div class="vin6006-field vin6006-quote-note"><label for="vin6-inquiry-note" id="vin6-inquiry-label"></label><textarea id="vin6-inquiry-note" maxlength="400" rows="2"></textarea></div></div>'
+'<p class="vin6006-quote-state" role="status" aria-live="polite" id="vin6-quote-state"></p><p class="vin6006-quote-preview" id="vin6-quote-preview"></p>'
+'<div class="vin6006-quote-actions"><a id="vin6-quote-whatsapp" target="_blank" rel="noopener noreferrer"></a><a id="vin6-quote-email"></a></div>'
+'<p id="vin6-quote-privacy" class="vin6006-quote-privacy"></p>';
report.append(quoteBox);
const quoteControls={mileage:document.getElementById("vin6-mileage"),ecu:document.getElementById("vin6-ecu"),note:document.getElementById("vin6-inquiry-note"),wa:document.getElementById("vin6-quote-whatsapp"),email:document.getElementById("vin6-quote-email")};
function renderQuote(){
 const copy=quoteCopy[lang()];
 for(const [id,value] of Object.entries({"quote-title":copy.head,"quote-intro":copy.intro,"mileage-label":copy.mileage,"ecu-label":copy.ecu,"inquiry-label":copy.note,"quote-privacy":copy.privacy}))$(id).textContent=value;
 quoteControls.wa.textContent=copy.wa;quoteControls.email.textContent=copy.email;
 const selected=engine.value!==""?variants[Number(engine.value)]:null;
 const engineCode=manual.value.trim()||selected?.engine||"";
 const valid=Boolean(make.value&&model.value&&engineCode);
 const details=[];
 const put=(label,value)=>{if(value)details.push(label+": "+String(value).replace(/[\r\n]+/g," ").trim());};
 put(copy.vehicle,make.value+" "+model.value);
 put(copy.year,year.value);
 put(copy.fuel,selected?.fuel||(fuel.value?(w[lang()].fuels[fuel.value]||fuel.value):""));
 put(copy.engine,engineCode);
 if(selected){
  put(copy.generation,selected.generation||"");
  put(copy.gearbox,selected.transmission||"");
  if(stockNeedsReview(selected))details.push(copy.unverified);
  if(clean(selected.model)!==clean(model.value))details.push(copy.family);
 }
 const stockPS=numeric(ps.value)||(!selected?null:stockPower(selected));
 const stockNM=numeric(nm.value)||(!selected?null:stockTorque(selected));
 if(stockPS||stockNM)put(copy.stock,[stockPS?stockPS+" PS":"",stockNM?stockNM+" Nm":""].filter(Boolean).join(" / "));
 const mileage=Number(quoteControls.mileage.value);if(quoteControls.mileage.value&&Number.isSafeInteger(mileage)&&mileage>=0&&mileage<=2000000)put(copy.mileage,mileage.toLocaleString(lang()==="de"?"de-DE":lang()==="tr"?"tr-TR":"en-US")+" "+copy.mileageUnit);
 put(copy.ecuVersion,quoteControls.ecu.value.trim().slice(0,90));
 put(copy.extra,quoteControls.note.value.trim().slice(0,400));
 const publishedMatch=matchPublishedStage();
 if(publishedMatch){
  const title=lang()==="tr"?"Üçüncü taraf Stage 1 kaynağı":lang()==="de"?"Externe Stage-1-Referenz":"External Stage 1 reference";
  put(title,publishedMatch.publisher+" · "+publishedMatch.id+" · "+publishedMatch.sourceUrl);
 }
 const message=[copy.salutation,"",...details,"",copy.verification].join("\n");
 $("quote-state").textContent=valid?copy.ready:copy.choose;
 $("quote-preview").textContent=copy.preview+": "+[make.value,model.value,year.value,engineCode].filter(Boolean).join(" · ");
 for(const a of [quoteControls.wa,quoteControls.email]){
  a.setAttribute("aria-disabled",String(!valid));
  a.tabIndex=valid?0:-1;
 }
 if(valid){
  quoteControls.wa.href="https://wa.me/"+contactWaNumber+"?text="+encodeURIComponent(message);
  quoteControls.email.href="mailto:"+contactEmail+"?subject="+encodeURIComponent(copy.subject)+"&body="+encodeURIComponent(message);
 }else{
  quoteControls.wa.removeAttribute("href");quoteControls.email.removeAttribute("href");
 }
}
for(const control of [quoteControls.mileage,quoteControls.ecu,quoteControls.note]){
 control.addEventListener("input",renderQuote);
 control.addEventListener("change",renderQuote);
}

/* Public third-party tuning advertisements, never an ECU calibration or 6006 dyno promise. */
const stageRefCopy={
 tr:{title:"Yayımlanmış Stage 1 referansı",none:"Bu motor ve üretim yılı için güvenle eşleştirilebilen yayımlanmış bir örnek bulunamadı. Motor kodu ve ECU kontrolünden sonra özel teklif alın.",kind:"Üçüncü tarafın yayımladığı örnek — 6006 Performance tarafından ölçülmedi.",before:"İlan edilen orijinal",after:"İlan edilen Stage 1",warning:"Bunlar bu araca ait onaylanmış hedefler, garanti veya Almanya'da yasal kullanım onayı değildir. ECU sürümü, motor ve kondisyon doğrulanmalıdır.",source:"Kaynak ilanı incele ↗"},
 de:{title:"Veröffentlichte Stage-1-Referenz",none:"Für diese genaue Motor-/Baujahr-Kombination liegt keine sicher zugeordnete Veröffentlichung vor. ECU und Motorkennung für ein individuelles Angebot prüfen.",kind:"Veröffentlichtes Beispiel eines Drittanbieters — keine Messung von 6006 Performance.",before:"Veröffentlichte Serie",after:"Veröffentlichte Stage 1",warning:"Keine geprüften Zielwerte, keine Garantie und keine Aussage über die Zulässigkeit in Deutschland. ECU-Stand, Motor und Fahrzeugzustand müssen geprüft werden.",source:"Veröffentlichung ansehen ↗"},
 en:{title:"Published Stage 1 example",none:"No safely matched published example is available for this engine and year. Check the engine code and ECU before requesting a quote.",kind:"Third-party advertised example, not measured by 6006 Performance.",before:"Advertised stock",after:"Advertised Stage 1",warning:"Not a tested target for this vehicle, a guarantee or German road-legal approval. Confirm ECU version, engine and vehicle condition.",source:"View original publication ↗"}
};
const referenceBox=document.createElement("aside");referenceBox.className="vin6006-stage-reference";referenceBox.id="vin6-stage-reference";
referenceBox.innerHTML='<h5 id="vin6-ref-title"></h5><p id="vin6-ref-description"></p><div id="vin6-ref-values" hidden></div><p id="vin6-ref-warning" hidden></p><a id="vin6-ref-source" rel="noopener noreferrer" target="_blank" hidden></a>';
$("stage-note").insertAdjacentElement("afterend",referenceBox);
let stage1Published=[];
const transferredReferenceId=(new URLSearchParams(location.search).get("stageRef")||"").trim();
function matchPublishedStage(){
 const selected=engine.value!==""?variants[Number(engine.value)]:null;
 const selectedYear=Number(year.value);
 if(!Number.isInteger(selectedYear)||selectedYear<1950||selectedYear>2100)return null;
 for(const item of stage1Published){
  if(clean(make.value)!==clean(item.make)||clean(model.value)!==clean(item.model))continue;
  if(selectedYear<item.yearFrom||selectedYear>item.yearTo)continue;
  // A known fuel type is required for any published tuning example.
  if(fuel.value!==item.fuel)continue;
  if(item.manualOnly){
   // A Passat B8 example must NOT be shown for loose generic Passat model-family matches.
   if(selected||!clean(manual.value).includes(clean(item.manualEngineContains)))continue;
   if(Number(ps.value)!==item.sourceStockHp||Number(nm.value)!==item.sourceStockNm)continue;
  }else{
   if(!selected||manuallyEditedStock||stockNeedsReview(selected)||clean(selected.model)!==clean(model.value)||!String(selected.engine||"").toLowerCase().startsWith(String(item.enginePrefix||"").toLowerCase()))continue;
   if(item.generationContains&&!String(selected.generation||"").includes(item.generationContains))continue;
   if(Number(selected.hp)!==item.sourceStockHp||Number(selected.nm)!==item.sourceStockNm)continue;
   if(readFuel(selected.fuel||selected.engine)!==item.fuel)continue;
  }
  return item;
 }
 return null;
}
function renderStageReference(){
 const txt=stageRefCopy[lang()],match=matchPublishedStage();
 const heading=$("ref-title"),desc=$("ref-description"),values=$("ref-values"),warning=$("ref-warning"),source=$("ref-source");
 heading.textContent=txt.title;
 values.hidden=!match;warning.hidden=!match;source.hidden=!match;
 if(!match){desc.textContent=txt.none;values.replaceChildren();source.removeAttribute("href");return;}
 desc.textContent=txt.kind;
 values.replaceChildren();
 for(const [title,psVal,nmVal] of [[txt.before,match.publishedStockPs,match.publishedStockNm],[txt.after,match.publishedStage1Ps,match.publishedStage1Nm]]){
  const item=document.createElement("div");item.className="vin6006-ref-value";
  const label=document.createElement("span");label.textContent=title;
  const data=document.createElement("strong");data.textContent=psVal+" PS · "+nmVal+" Nm";
  item.append(label,data);values.append(item);
 }
 warning.textContent=txt.warning+" · "+match.publisher;
 source.textContent=txt.source;
 source.href=match.sourceUrl;
}
async function loadPublishedStageReferences(){
 try{
  const response=await fetch("/assets/6006-stage1-references.json?v=20261012-58refs",{cache:"force-cache"});
  if(!response.ok)return;
  const data=await response.json();
  if(data.schemaVersion!==1||!Array.isArray(data.examples))return;
  stage1Published=data.examples.filter(x=>x?.classification==="third-party-advertised"&&
   typeof x.make==="string"&&typeof x.model==="string"&&typeof x.publisher==="string"&&
   typeof x.sourceUrl==="string"&&/^https:\/\//.test(x.sourceUrl)&&
   Number.isInteger(x.yearFrom)&&Number.isInteger(x.yearTo)&&
   [x.sourceStockHp,x.sourceStockNm,x.publishedStockPs,x.publishedStockNm,x.publishedStage1Ps,x.publishedStage1Nm]
      .every(n=>Number.isInteger(n)&&n>0&&n<=1500));
  if(make.value&&model.value)renderStageReference();
 }catch(e){/* Missing upstream reference files must not break vehicle or quote search. */}
}

/* A source ID deep-link is a pointer to published external data, not proof of ECU compatibility. */
const sourceTransferWords={
 tr:{title:"Stage 1 kaynak kaydı açıldı",manual:"Bu kaynak açık motor kataloğunda birebir doğrulanmadı. Ruhsattaki motor kodunu ve stok güç/torku kontrol ettikten sonra bilgileri aktarmak için düğmeye bas.",apply:"Kontrol ettim, kaynak bilgilerini forma aktar",automatic:"Motor eşleşmesi ön seçildi. Motor kodu, şanzıman ve ECU sürümünü yine doğrula.",multiple:"Birden fazla motor varyantı uyuyor. Şanzıman ve motor kodunu karşılaştırıp aşağıdaki listeden doğru motoru seç.",missing:"Motorun tam varyantı açık katalogdan doğrulanamadı. Motor kodunu ve stok bilgilerini elle girerek kişisel teklif iste.",source:"Orijinal üçüncü taraf ilanı ↗"},
 de:{title:"Stage-1-Quellenbeispiel geöffnet",manual:"Diese Motorkennung lässt sich mit dem offenen Fahrzeugkatalog nicht zweifelsfrei verifizieren. Erst nach Prüfung der Motorkennung und Serienleistung in den Fahrzeugpapieren die Quelle in das Formular übernehmen.",apply:"Geprüft: Referenzangaben ins Formular übernehmen",automatic:"Der passende Katalogmotor wurde vorausgewählt. Bitte Motorkennung, Getriebe und ECU-Software trotzdem prüfen.",multiple:"Mehrere Motorvarianten sind möglich. Bitte Motorkennung und Getriebe vergleichen und die richtige Variante unten wählen.",missing:"Keine sichere Zuordnung im offenen Motorverzeichnis. Motorkennung und Serienwerte bitte manuell eingeben und individuell prüfen lassen.",source:"Originalanzeige eines Drittanbieters ↗"},
 en:{title:"Published Stage 1 reference opened",manual:"This engine cannot be securely matched with the open vehicle catalogue. Check your engine designation and factory power/torque first, then click to copy source figures into the request form.",apply:"I've checked; use reference figures in the form",automatic:"The matching catalogue variant was preselected. Still verify engine code, transmission and ECU firmware.",multiple:"Several engine variants match. Check the gearbox and engine code, then pick the correct variant below.",missing:"No secure engine match in the open catalogue. Enter the real engine code and factory values manually for an individual quote.",source:"Original third-party listing ↗"}
};
const transferredPanel=document.createElement("aside");
transferredPanel.className="vin6006-transfer";
transferredPanel.id="vin6-source-transfer";
transferredPanel.hidden=true;
const transferredHeading=document.createElement("h3"),transferredText=document.createElement("p");
const transferredButton=document.createElement("button"),transferredLink=document.createElement("a");
transferredButton.type="button";
transferredLink.target="_blank";transferredLink.rel="noopener noreferrer";
transferredPanel.append(transferredHeading,transferredText,transferredButton,transferredLink);
referenceBox.insertAdjacentElement("afterend",transferredPanel);
let activeTransferredReference=null;
function transferLabels(messageKind){
 const copy=sourceTransferWords[lang()];
 transferredHeading.textContent=copy.title;
 transferredText.textContent=copy[messageKind]||copy.missing;
 transferredButton.textContent=copy.apply;
 transferredButton.hidden=messageKind!=="manual";
 transferredLink.textContent=copy.source;
}
function applyTransferredStageReference(){
 if(!/^[a-z0-9-]{8,100}$/.test(transferredReferenceId))return;
 const item=stage1Published.find(r=>r.id===transferredReferenceId);
 if(!item||clean(make.value)!==clean(item.make)||clean(model.value)!==clean(item.model)
 || Number(year.value)<item.yearFrom||Number(year.value)>item.yearTo||fuel.value!==item.fuel)return;
 activeTransferredReference=item;
 transferredPanel.hidden=false;
 transferredLink.href=item.sourceUrl;
 if(item.manualOnly){transferLabels("manual");return;}
 const qualifies=v=>v&&!stockNeedsReview(v)&&clean(v.model)===clean(model.value)&&
 String(v.engine||"").toLowerCase().startsWith(String(item.enginePrefix||"").toLowerCase())&&
 (!item.generationContains||String(v.generation||"").includes(item.generationContains))&&
 Number(v.hp)===item.sourceStockHp&&Number(v.nm)===item.sourceStockNm&&readFuel(v.fuel||v.engine)===item.fuel;
 const matches=variants.map((v,i)=>({v,i})).filter(x=>qualifies(x.v));
 if(matches.length){
  engineSearch.value=item.enginePrefix||"";
  renderEngines("");
  // Recompute the exact engine selection after filtering. Never assume the first gearbox.
  const unique=variants.map((v,i)=>({v,i})).filter(x=>qualifies(x.v));
  if(unique.length===1){
   engine.value=String(unique[0].i);
   syncVariant();
   transferLabels("automatic");
  }else{
   transferLabels("multiple");
   engine.focus({preventScroll:true});
  }
 }else transferLabels("missing");
}
transferredButton.addEventListener("click",()=>{
 const item=activeTransferredReference;
 if(!item||!item.manualOnly)return;
 if(clean(make.value)!==clean(item.make)||clean(model.value)!==clean(item.model)||
 Number(year.value)<item.yearFrom||Number(year.value)>item.yearTo||fuel.value!==item.fuel)return;
 engine.value="";
 engineSearch.value="";
 manual.value=item.manualEngineContains||"";
 ps.value=String(item.sourceStockHp);
 nm.value=String(item.sourceStockNm);
 manuallyEditedStock=true;
 renderReport();
 transferredButton.hidden=true;
 manual.focus({preventScroll:true});
});
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
function readFuel(value){
const v=String(value||"").toLowerCase();
if(/plug[ -]?in|phev/.test(v))return"PHEV";
if(/hybrid|mhev|hev|mild hybrid|e-tsi|etsi/.test(v))return"Hybrid";
if(/diesel|tdi|cdi|bluehdi|dci|crdi|jtd|hdi|d-4d/.test(v))return"Diesel";
if(/electric|electro|elektro|bev|battery electric/.test(v))return"Electric";
if(/lpg|liquefied petroleum/.test(v))return"LPG";
if(/cng|natural gas|erdgas/.test(v))return"CNG";
if(/gasoline|petrol|benzin|tsi|tfsi|otto|ethanol|flexfuel/.test(v))return"Benzin";
return"";
}
function matchesFuel(variant,selected){
 if(!selected)return true;
 const combined=String(variant.fuel||"")+" "+String(variant.engine||"");
 const classified=readFuel(variant.fuel||variant.engine);
 if(selected===classified)return true;
 // Mild-hybrid diesel/petrol engines belong both to their primary fuel and hybrid search.
 if(selected==="Diesel"&&/diesel/i.test(combined)&&!/plug[ -]?in/i.test(combined))return true;
 if(selected==="Benzin"&&/gasoline|petrol|benzin/i.test(combined)&&!/plug[ -]?in/i.test(combined))return true;
 return false;
}
function clean(value){return String(value||"").trim().toLowerCase().replace(/[()[\]-]/g," ").replace(/\s+/g," ");}
function translate(){
const labels={kicker:"kicker",heading:"head",intro:"intro",all:"all", "vin-label":"vin",decode:"decode","vin-help":"vinHelp",lmake:"make",lmodel:"model",lyear:"year",lfuel:"fuel",lengine:"engine",lmanual:"other",lps:"power",lnm:"torque","result-head":"selected",stagehead:"stage",codehead:"common",th1:"value",th2:"old",th3:"new","code-note":"codeCaution","stage-link":"openStage","dtc-link":"open"};
for(const [id,key]of Object.entries(labels)){$(id).textContent=t(key);}
renderMakeButtons();
if(fuel.options.length){const value=fuel.value;fill(fuel,fuelKeys.slice(1).map(k=>[k,w[lang()].fuels[k]]),t("allFuel"));fuel.value=value;}
if(engine.options.length)engine.options[0].textContent=t("noneMotor");
engineSearchLabel.textContent=w[lang()].searchLabel;
engineSearch.placeholder=w[lang()].searchLabel;
renderStageReference();
renderQuote();
if(year.options.length)year.options[0].textContent=t("choose");
if(report&&!report.hidden)renderReport();
}
function fillMakes(){const current=make.value;const list=finder.brands().filter(Boolean).sort((a,b)=>a.localeCompare(b,"de"));fill(make,list.map(b=>[b,b]));if(current&&list.includes(current))make.value=current;renderMakeButtons();}
function populateModels(keep){const list=finder.models(make.value).filter(Boolean);fill(model,list.map(n=>[n,n]));if(keep&&list.includes(keep))model.value=keep;else if(keep){option(model,keep,keep);model.value=keep;}}
function findVariants(){
 if(!make.value||!model.value)return[];
 // The open reference catalogue includes all makes and exact year-bound variants.
 const y=year.value;
 const attempts=[model.value,model.value.replace(/\b(B[0-9]|W[0-9]{3}|F[0-9]{2})\b/gi,"").trim(),model.value.split("(")[0].trim()];
 let list=[];
 for(const q of [...new Set(attempts.filter(Boolean))]){
   list=finder.engineVariants(make.value,q,y);
   if(list.length)break;
 }
 const keys=new Set();
 return list.filter(v=>{
   if(!matchesFuel(v,fuel.value))return false;
   const key=clean([v.generation,v.engine,v.fuel,v.transmission,v.from,v.to,v.hp,v.nm].join("|"));
   if(keys.has(key))return false;
   keys.add(key);return true;
 }).sort((a,b)=>String(a.generation||"").localeCompare(String(b.generation||""),"de",{numeric:true})||String(a.engine||"").localeCompare(String(b.engine||""),"de",{numeric:true}));
}
function stockNeedsReview(v){
 if(!v)return false;
 // Source horsepower must agree with its own visible engine label;
 // hybrid aggregate/ICE figures cannot be assumed equivalent.
 return Boolean(finder.referencePowerNeedsReview?.(v));
}
function stockPower(v){
 if(!v||stockNeedsReview(v))return null;
 const value=numeric(v.hp);
 return value?numeric(value*1.013869):null;
}
function stockTorque(v){
 if(!v||stockNeedsReview(v))return null;
 return numeric(v.nm);
}
const engineSearch=document.createElement("input");
engineSearch.type="search";engineSearch.id="vin6-engine-search";engineSearch.maxLength=90;
engineSearch.autocomplete="off";engineSearch.setAttribute("aria-controls","vin6-engine");
const engineSearchLabel=document.createElement("label");
engineSearchLabel.htmlFor=engineSearch.id;engineSearchLabel.id="vin6-lsearch";
const variantSummary=document.createElement("p");variantSummary.id="vin6-variant-count";variantSummary.className="vin6006-variant-count";variantSummary.setAttribute("aria-live","polite");
const engineField=engine.closest(".vin6006-field");
engineField.insertBefore(engineSearchLabel,engine);
engineField.insertBefore(engineSearch,engine);
engineField.append(variantSummary);
let visibleVariants=[];
let manuallyEditedStock=false;
function renderEngines(preserve){
 variants=findVariants();
 const query=clean(engineSearch.value||"");
 visibleVariants=[];
 for(let i=0;i<variants.length;i++){
  const v=variants[i];
  const searchable=clean([v.engine,v.generation,v.fuel,v.transmission,v.hp,v.nm].join(" "));
  if(!query||searchable.includes(query))visibleVariants.push(i);
 }
 const current=Number(preserve);
 const choices=visibleVariants.map(i=>{
  const v=variants[i],stock=stockPower(v),torque=stockTorque(v),review=stockNeedsReview(v);
  const meta=[v.generation,v.fuel,v.from&&v.to?v.from+"–"+v.to:v.from||v.to].filter(Boolean).join(" · ");
  const label=String(v.engine)+(stock?" · "+stock+" PS":"")+(torque?" · "+torque+" Nm":"")+(review?" · ⚠":"");
  return [String(i),label+" · "+meta];
 });
 fill(engine,choices,t("noneMotor"));
 if(preserve!==""&&Number.isInteger(current)&&choices.some(x=>x[0]===String(current)))engine.value=String(current);
 variantSummary.textContent=variants.length?
  visibleVariants.length+" / "+variants.length+" "+w[lang()].variantCount:
  w[lang()].noVariants;
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
function renderReport(){
if(!make.value||!model.value){showReport(false);return;}
showReport(true);
const v=engine.value===""?null:variants[Number(engine.value)],name=manual.value.trim()||(v?.engine||"");
const basePS=numeric(ps.value)||(v?stockPower(v):null),baseNM=numeric(nm.value)||(v?stockTorque(v):null);
$("identity").textContent=[make.value,model.value,year.value,(!fuel.value?"":w[lang()].fuels[fuel.value]),name].filter(Boolean).join(" · ");
const f=fuel.value||readFuel(name);
// A source engine rating cannot determine a specific calibration result.
const plusPS="—",plusNM="—";
const table=$("metrics");table.replaceChildren();
for(const [label,original,forecast,unit]of [[t("hp"),basePS,plusPS,"PS"],[t("nm"),baseNM,plusNM,"Nm"]]){
const tr=document.createElement("tr");for(const value of [label,original?original+" "+unit:"—",forecast==="—"?"—":forecast+" "+unit]){const td=document.createElement("td");td.textContent=value;tr.append(td);}table.append(tr);
}
$("stage-note").textContent=t("noTune")+" "+(!basePS||!baseNM?t("noData"):"")+(v&&stockNeedsReview(v)?" "+w[lang()].reviewWarning:"");
renderStageReference();
const codes=$("code-list");codes.replaceChildren();
relatedCodes().forEach(([code,description])=>{const a=document.createElement("a");const params=vehicleParams();params.set("code",code);a.href="/fehlercodes/?"+params.toString();const strong=document.createElement("strong"),span=document.createElement("span"),arrow=document.createElement("b");strong.textContent=code;span.textContent=description;arrow.textContent="›";a.append(strong,span,arrow);codes.append(a);});
$("stage-link").href="/?"+vehicleParams().toString()+"#aracin";
$("dtc-link").href="/fehlercodes/?"+vehicleParams().toString();
$("provenance").textContent=t("variant")+(v&&stockNeedsReview(v)?" · "+w[lang()].reviewWarning:"")+(v&&clean(v.model)!==clean(model.value)?" · "+w[lang()].familyWarning:"")+(manuallyEditedStock?" · "+t("manual"):"");
renderQuote();
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
if(v){manuallyEditedStock=false;manual.value="";ps.value=stockPower(v)||"";nm.value=stockTorque(v)||"";if(!fuel.value&&readFuel(v.fuel||v.engine))fuel.value=readFuel(v.fuel||v.engine);}
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
engineSearch.addEventListener("input",()=>{const old=engine.value;renderEngines(old);if(engine.value!==old){manuallyEditedStock=false;ps.value="";nm.value="";renderReport();}});

manual.addEventListener("change",renderReport);
manual.addEventListener("input",()=>{
 if(manual.value.trim()&&engine.value!==""){
  engine.value="";ps.value="";nm.value="";
 }
 manuallyEditedStock=true;renderReport();
});
for(const e of [ps,nm]){e.addEventListener("change",renderReport);e.addEventListener("input",()=>{manuallyEditedStock=true;renderReport();});}
window.addEventListener("6006-makes-ready",()=>{const current=make.value;fillMakes();if(current&&!make.value){option(make,current,current);make.value=current;}});
window.addEventListener("6006-models-ready",e=>{if(e.detail?.brand===make.value){const current=model.value;populateModels(current);}});
new MutationObserver(()=>{translate();if(activeTransferredReference){const kind=activeTransferredReference.manualOnly?"manual":transferredButton.hidden?"automatic":"multiple";transferLabels(kind);}}).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
const externalMake=preferred.get("brand"),externalModel=preferred.get("model");
const sameSavedVehicle=(!externalMake||normalizeMake(externalMake)===normalizeMake(memory.brand))&&(!externalModel||clean(externalModel)===clean(memory.model));
const stored=sameSavedVehicle&&!transferredReferenceId?memory:{};
const initial={make:externalMake||stored.brand||"",model:externalModel||stored.model||"",year:preferred.get("year")||stored.year||"",fuel:preferred.get("powertrain")||stored.powertrain||"",engine:preferred.get("engine")||stored.engine||"",ps:preferred.get("ps")||stored.ps||""};
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
const restoreTask=restore();
loadPublishedStageReferences().then(()=>restoreTask.then(applyTransferredStageReference));
})();