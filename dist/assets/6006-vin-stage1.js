(()=>{
"use strict";
const finder=window.VehicleCatalog6006,main=document.querySelector("main"),tab=document.querySelector("#catalog");
if(!finder||!main||!tab||document.getElementById("vehicle-selector-6006"))return;
const w={
  "tr": {
    "kicker": "6006 / ARAÇ & MOTOR BULUCU",
    "head": "Motor yazılımı & araç kodlama",
    "intro": "Aracını seç; teknik motor bilgilerini, yazılım, kodlama ve teşhis hizmetlerini aynı yerde gör. VIN başlangıcından markayı belirle veya marka, model, yıl ve motor seç.",
    "all": "Tüm arıza kodları",
    "vin": "Şasi numarası (VIN)",
    "vinHelp": "17 karakterli VIN için önce yerel üretici kodlarına bakılır; tanınmazsa yalnızca ilk 3 karakter NHTSA'ya sorgulanır. Tam VIN gönderilmez veya kaydedilmez. Üretici/model/motor doğrulanmalıdır.",
    "decode": "Markayı bul",
    "invalid": "VIN 17 karakter olmalı ve I, O, Q içermemeli.",
    "unsupported": "Bu VIN'den marka güvenilir biçimde belirlenemedi. Markayı listeden seçebilirsin.",
    "found": "VIN'den belirlenen marka",
    "make": "Marka",
    "model": "Model",
    "year": "Model yılı",
    "fuel": "Yakıt",
    "engine": "Motor / varyant",
    "other": "Listede yoksa motor kodu",
    "power": "Orijinal güç (PS)",
    "torque": "Orijinal tork (Nm)",
    "choose": "Seçin",
    "allFuel": "Tümü",
    "noneMotor": "Listede bulunmuyor / elle gir",
    "loading": "Motor varyantları yükleniyor…",
    "selected": "Seçilen araç",
    "old": "Stok referans",
    "value": "Özellik",
    "hp": "Güç",
    "nm": "Tork",
    "noData": "Güç / tork verisi yok. Ruhsattaki veya üretici belgesindeki değerleri gir.",
    "common": "İlgili arıza kodları",
    "codeCaution": "Bunlar bu araca özel arıza istatistiği değildir. Sisteme ilişkin kontrol edilebilecek örnek kodlardır; tanımlar üreticiye göre değişebilir.",
    "open": "Teşhis kataloğunda aç",
    "empty": "Önce marka ve model seç. Motor varyantı varsa listeden seç; bulunamazsa elle ekle.",
    "variant": "Açık araç veritabanı / örnek kayıt. OEM doğrulaması değildir.",
    "manual": "Elle girilen değerler kullanıcı beyanıdır; üretici verisi olarak gösterilmez.",
    "variantCount": "motor varyantı",
    "noVariants": "Bu seçimde motor verisi yok; alttaki alana motor kodu gir.",
    "reviewWarning": "Referans güç verisi tutarsız veya hibrit sistem gücü belirsiz; ruhsat/üretici kaynağıyla doğrulayın.",
    "searchLabel": "Motor, nesil veya şanzıman içinde ara",
    "familyWarning": "Motor kaydı seçilen serinin tam karşılığı değil; aynı model ailesinden. Şasi ve motor koduyla doğrulayın.",
    "fuels": {
      "Diesel": "Dizel",
      "Benzin": "Benzin",
      "Hybrid": "Hibrit",
      "PHEV": "Şarj edilebilir hibrit",
      "Electric": "Elektrik",
      "LPG": "LPG",
      "CNG": "CNG"
    },
    "vinNext": "Marka belirlendi. Avrupa araçlarında VIN başlangıcı model, motor ve donanımı doğrulamaz; bunları aşağıdan seçerek devam et.",
    "vinContinue": "Model ve motor seç →",
    "vinLocal": "Yerel üretici kodu",
    "vinRemote": "NHTSA üretici kaydı",
    "vinUnavailable": "Üretici kaydı bulunamadı. NHTSA Avrupa araçlarının tamamını kapsamaz; marka, model ve motoru listeden seçerek devam edebilirsin.",
    "ambiguous": "Önceki motor adı birden fazla varyantla eşleşiyor. Doğru nesil ve şanzımanı listeden seç; motor otomatik seçilmedi.",
    "stockHead": "Aracın teknik referans bilgileri",
    "openService": "Yazılım ve kodlama hizmetlerini gör",
    "serviceHeading": "Bu araç için hizmet talebi",
    "serviceIntro": "İstediğin işlemi araç bilgilerinle birlikte inceleyelim. Desteklenen işlevler kontrol ünitesi, yazılım sürümü ve mevcut donanıma göre değişir.",
    "softwareTitle": "Motor ve kontrol ünitesi yazılımı",
    "softwareText": "Mevcut yazılım sürümünün okunması, hata kaydının incelenmesi ve güncelleme veya yazılım sorunlarına yönelik araç özelinde değerlendirme.",
    "codingTitle": "Konfor ve donanım kodlama",
    "codingText": "Desteklenen araçlarda ayna katlama, merkezi kilit ve aydınlatma tercihleri gibi mevcut donanımın işlevlerini değerlendirme.",
    "diagnosticTitle": "Arıza teşhisi ve canlı veriler",
    "diagnosticText": "Motor, sensör ve emisyon sistemi uyarılarını hata kodları, canlı değerler ve belirtilerle birlikte inceleme.",
    "eligibility": "İşleme uygunluk, donanım desteği ve gerekli izinler araç üzerinde kontrol edilir. Araç seçimi tek başına bir işlevin kullanılabildiğini doğrulamaz."
  },
  "de": {
    "kicker": "6006 / FAHRZEUG & MOTORFINDER",
    "head": "Motorsoftware & Fahrzeugcodierung",
    "intro": "Fahrzeug auswählen und Motorreferenzen, Software, Codierung und Diagnose an einem Ort finden. Marke über den VIN-Anfang bestimmen oder Marke, Modell, Baujahr und Motor manuell wählen.",
    "all": "Alle Fehlercodes",
    "vin": "Fahrgestellnummer (FIN/VIN)",
    "vinHelp": "Hersteller wird zuerst lokal gesucht; andernfalls werden nur die ersten 3 Stellen bei NHTSA abgefragt. Die vollständige FIN wird nicht versendet oder gespeichert. Fahrzeug und Motor separat bestätigen.",
    "decode": "Marke erkennen",
    "invalid": "Die VIN muss 17 Zeichen haben und darf I, O, Q nicht enthalten.",
    "unsupported": "Hersteller nicht sicher erkennbar. Bitte Marke manuell wählen.",
    "found": "Aus VIN erkannte Marke",
    "make": "Marke",
    "model": "Modell",
    "year": "Baujahr",
    "fuel": "Kraftstoff",
    "engine": "Motorvariante",
    "other": "Motorkennbuchstabe, falls nicht gelistet",
    "power": "Serienleistung (PS)",
    "torque": "Seriendrehmoment (Nm)",
    "choose": "Wählen",
    "allFuel": "Alle",
    "noneMotor": "Nicht gelistet / manuell eingeben",
    "loading": "Motorvarianten werden geladen…",
    "selected": "Ausgewähltes Fahrzeug",
    "old": "Serienreferenz",
    "value": "Merkmal",
    "hp": "Leistung",
    "nm": "Drehmoment",
    "noData": "Keine Leistungs-/Drehmomentwerte vorhanden. Werte bitte aus verlässlichen Fahrzeugpapieren prüfen.",
    "common": "Relevante Fehlercodes",
    "codeCaution": "Keine statistisch nachgewiesenen typischen Defekte dieses Fahrzeugs. Es handelt sich um mögliche Prüfcodes; herstellerspezifische Bedeutungen können abweichen.",
    "open": "Im Diagnosekatalog öffnen",
    "empty": "Bitte Marke und Modell wählen. Motorvariante auswählen oder fehlende Variante manuell ergänzen.",
    "variant": "Offene Fahrzeugreferenz / Beispieldaten, keine OEM-Bestätigung.",
    "manual": "Manuelle Daten werden nicht als Herstellerangabe dargestellt.",
    "variantCount": "Motorvarianten",
    "noVariants": "Für diese Auswahl fehlen Motordaten. Motorkennung unten manuell eingeben.",
    "reviewWarning": "Referenzleistung widersprüchlich oder Hybrid-Systemleistung unklar; bitte mit Fahrzeugpapieren bestätigen.",
    "searchLabel": "Motor, Generation oder Getriebe suchen",
    "familyWarning": "Motorreferenz stammt aus der Modellfamilie, nicht aus einer bestätigten exakten Baureihe. FIN und Motorkennung prüfen.",
    "fuels": {
      "Diesel": "Diesel",
      "Benzin": "Benzin",
      "Hybrid": "Hybrid",
      "PHEV": "Plug-in-Hybrid",
      "Electric": "Elektro",
      "LPG": "Autogas (LPG)",
      "CNG": "Erdgas (CNG)"
    },
    "vinNext": "Marke erkannt. Der VIN-Anfang bestätigt bei europäischen Fahrzeugen weder Modell noch Motor oder Ausstattung. Diese Angaben unten auswählen.",
    "vinContinue": "Modell und Motor auswählen →",
    "vinLocal": "Lokaler Herstellercode",
    "vinRemote": "NHTSA-Herstellerverzeichnis",
    "vinUnavailable": "Kein Hersteller gefunden. NHTSA deckt nicht alle europäischen Fahrzeuge ab. Marke, Modell und Motor können manuell gewählt werden.",
    "ambiguous": "Die gespeicherte Motorbezeichnung passt zu mehreren Varianten. Baureihe und Getriebe auswählen; kein Motor wurde automatisch gewählt.",
    "stockHead": "Technische Fahrzeugreferenz",
    "openService": "Software- und Codierleistungen ansehen",
    "serviceHeading": "Service für dieses Fahrzeug anfragen",
    "serviceIntro": "Wir prüfen Ihren Wunsch zusammen mit den Fahrzeugdaten. Verfügbare Funktionen hängen von Steuergerät, Softwarestand und vorhandener Ausstattung ab.",
    "softwareTitle": "Motor- und Steuergerätesoftware",
    "softwareText": "Vorhandenen Softwarestand auslesen, Fehlerspeicher einordnen und fahrzeugspezifische Möglichkeiten bei Softwareproblemen oder Aktualisierungen prüfen.",
    "codingTitle": "Komfort- und Ausstattungscodierung",
    "codingText": "Bei unterstützten Fahrzeugen Funktionen vorhandener Ausstattung prüfen, etwa Spiegelanklappen, Zentralverriegelung und Lichtpräferenzen.",
    "diagnosticTitle": "Fehlerdiagnose und Live-Daten",
    "diagnosticText": "Motor-, Sensor- und Abgassystemmeldungen anhand von Fehlercodes, Messwerten und den geschilderten Symptomen untersuchen.",
    "eligibility": "Technische Eignung, Ausstattung und erforderliche Freigaben werden am Fahrzeug geprüft. Die Fahrzeugauswahl bestätigt noch keine bestimmte Funktion."
  },
  "en": {
    "kicker": "6006 / VEHICLE & ENGINE FINDER",
    "head": "Engine software & vehicle coding",
    "intro": "Choose your vehicle to view technical engine references, software, coding and diagnostic services together. Identify the make from the VIN prefix or select make, model, year and engine manually.",
    "all": "All fault codes",
    "vin": "Vehicle identification number (VIN)",
    "vinHelp": "Manufacturer is checked locally first; if unknown, only the 3-character prefix is sent to NHTSA. The full VIN is never transmitted or stored. Verify make, model and engine.",
    "decode": "Find make",
    "invalid": "VIN must have 17 characters and cannot contain I, O or Q.",
    "unsupported": "Manufacturer could not be identified reliably. Please choose the make.",
    "found": "Make identified from VIN",
    "make": "Make",
    "model": "Model",
    "year": "Model year",
    "fuel": "Fuel",
    "engine": "Engine variant",
    "other": "Engine code if missing",
    "power": "Stock power (PS)",
    "torque": "Stock torque (Nm)",
    "choose": "Choose",
    "allFuel": "All",
    "noneMotor": "Not listed / enter manually",
    "loading": "Loading engine variants…",
    "selected": "Selected vehicle",
    "old": "Stock reference",
    "value": "Specification",
    "hp": "Power",
    "nm": "Torque",
    "noData": "No stock power or torque data. Confirm them from reliable vehicle records.",
    "common": "Related fault codes",
    "codeCaution": "These codes are examples to investigate, not established failure statistics for this vehicle. Manufacturer-specific meanings can differ.",
    "open": "Open diagnosis catalog",
    "empty": "Choose make and model. Select an engine variant or enter one manually.",
    "variant": "Open vehicle reference data / examples; not OEM verified.",
    "manual": "Manually entered values are not presented as manufacturer specifications.",
    "variantCount": "engine variants",
    "noVariants": "No engine data for this selection. Enter engine code manually below.",
    "reviewWarning": "Conflicting reference power or unclear hybrid system output; verify from vehicle records.",
    "searchLabel": "Search engine, generation or gearbox",
    "familyWarning": "Engine reference belongs to the model family, not a verified exact generation. Confirm with VIN and engine code.",
    "fuels": {
      "Diesel": "Diesel",
      "Benzin": "Petrol",
      "Hybrid": "Hybrid",
      "PHEV": "Plug-in hybrid",
      "Electric": "Electric",
      "LPG": "LPG",
      "CNG": "CNG"
    },
    "vinNext": "Make identified. A European VIN prefix does not confirm model, engine or equipment; choose those details below to continue.",
    "vinContinue": "Choose model and engine →",
    "vinLocal": "Local manufacturer code",
    "vinRemote": "NHTSA manufacturer record",
    "vinUnavailable": "No manufacturer found. NHTSA does not cover every European vehicle; select make, model and engine manually to continue.",
    "ambiguous": "The saved engine name matches several variants. Select the generation and gearbox; no engine was selected automatically.",
    "stockHead": "Technical vehicle reference",
    "openService": "View software and coding services",
    "serviceHeading": "Request service for this vehicle",
    "serviceIntro": "We review your request with the vehicle details. Supported functions depend on the control unit, software version and fitted equipment.",
    "softwareTitle": "Engine and control unit software",
    "softwareText": "Read the current software version, review stored faults and assess vehicle-specific options for software issues or updates.",
    "codingTitle": "Comfort and equipment coding",
    "codingText": "Review supported functions of fitted equipment, such as mirror folding, central locking and lighting preferences.",
    "diagnosticTitle": "Fault diagnosis and live data",
    "diagnosticText": "Investigate engine, sensor and emissions warnings using fault codes, live measurements and reported symptoms.",
    "eligibility": "Technical suitability, equipment support and required approvals are checked on the vehicle. Selecting a model does not confirm any particular function."
  }
};
function lang(){const l=String(window.Locale6006?.getLanguage?.()||document.documentElement.lang||"").slice(0,2);return w[l]?l:"de";}
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
+'<div class="vin6006-result" id="vin6-result" hidden aria-live="polite"><h3 id="vin6-result-head"></h3><p class="vin6006-identity" id="vin6-identity"></p><div class="vin6006-result-layout"><div class="vin6006-panel"><h4 id="vin6-stagehead"></h4><table class="vin6006-table"><thead><tr><th id="vin6-th1"></th><th id="vin6-th2"></th></tr></thead><tbody id="vin6-metrics"></tbody></table><p class="vin6006-note" id="vin6-stage-note"></p></div><div class="vin6006-panel"><h4 id="vin6-codehead"></h4><div class="vin6006-codes" id="vin6-code-list"></div><p class="vin6006-note" id="vin6-code-note"></p></div></div><section class="vin6006-service-overview" id="vin6-services"><h4 id="vin6-service-heading"></h4><p id="vin6-service-intro"></p><div class="vin6006-service-grid"><article><h5 id="vin6-software-title"></h5><p id="vin6-software-text"></p></article><article><h5 id="vin6-coding-title"></h5><p id="vin6-coding-text"></p></article><article><h5 id="vin6-diagnostic-title"></h5><p id="vin6-diagnostic-text"></p></article></div><p class="vin6006-note" id="vin6-eligibility"></p></section><div class="vin6006-links"><a id="vin6-stage-link" href="/#hizmetler"></a><a id="vin6-dtc-link" href="/fehlercodes/"></a></div><p class="vin6006-note" id="vin6-provenance"></p></div>'
+'</div>';
tab.insertAdjacentElement("beforebegin",section);
const $=id=>document.getElementById("vin6-"+id);
const make=$("make"),model=$("model"),year=$("year"),fuel=$("fuel"),engine=$("engine"),manual=$("manual"),ps=$("ps"),nm=$("nm"),report=$("result"),feedback=$("feedback");
const vinNext=document.createElement("div");vinNext.className="vin6006-next";vinNext.hidden=true;
const vinNextText=document.createElement("p"),vinNextButton=document.createElement("button");vinNextButton.type="button";
vinNext.append(vinNextText,vinNextButton);feedback.insertAdjacentElement("afterend",vinNext);
vinNextButton.addEventListener("click",()=>{model.scrollIntoView({behavior:"smooth",block:"center"});model.focus({preventScroll:true});});
let vinStatus={kind:"",make:"",source:""};
function renderVinStatus(){
 const kind=vinStatus.kind;
 feedback.textContent=kind==="found"?t("found")+": "+vinStatus.make+" · "+t(vinStatus.source):kind==="loading"?brandText[lang()].checking:kind==="invalid"?t("invalid"):kind==="unavailable"?t("vinUnavailable"):"";
 vinNext.hidden=kind!=="found";vinNextText.textContent=t("vinNext");vinNextButton.textContent=t("vinContinue");
 $("decode").disabled=kind==="loading";$("decode").setAttribute("aria-busy",String(kind==="loading"));
}
// Quick links show that the finder is not limited to Volkswagen.
// The native make dropdown remains the complete catalogue, not the buttons below.

// Quotation handoff stays entirely browser-side until the visitor opens a contact link.
// The VIN input is intentionally NEVER part of the outgoing message.
const quoteCopy={
  "tr": {
    "head": "Yazılım veya kodlama işlemini sor",
    "intro": "İstediğin konfor özelliğini, yazılım sorununu veya arıza belirtisini yaz. Araç bilgilerinle birlikte hangi işlemin desteklendiğini inceleyelim.",
    "mileage": "Kilometre (isteğe bağlı)",
    "ecu": "ECU / yazılım versiyonu (biliniyorsa)",
    "note": "İstenen işlem / belirti",
    "wa": "WhatsApp ile hizmet sor →",
    "email": "E-posta ile hizmet sor →",
    "choose": "Marka ve modelle birlikte yılı veya motor kodunu gir.",
    "ready": "Araç bilgileri hazır. Gönderilecek bilgiler aşağıda özetlendi.",
    "preview": "Gönderilecek araç özeti",
    "privacy": "Şasi numarası (VIN) gönderilmez. Bağlantıya dokunduğunda WhatsApp veya e-posta uygulamasına geçilir; mesajı göndermek senin kontrolündedir.",
    "subject": "6006 Performance | Araç yazılımı ve kodlama talebi",
    "salutation": "Merhaba 6006 Performance, aracım için yazılım, kodlama veya teşhis hizmeti hakkında bilgi rica ediyorum.",
    "stock": "Referans stok değer",
    "unverified": "Referans veri doğrulanmamış / OEM onayı yok",
    "family": "Model ailesi eşleşmesi; tam jenerasyon doğrulanmadı",
    "verification": "İstenen işlevin donanım, kontrol ünitesi ve yazılım sürümüyle uyumluluğunu işlemden önce birlikte doğrulayalım.",
    "mileageUnit": "km",
    "vehicle": "Araç",
    "year": "Yıl",
    "fuel": "Yakıt",
    "engine": "Motor",
    "generation": "Nesil",
    "gearbox": "Şanzıman",
    "ecuVersion": "ECU",
    "extra": "Açıklama",
    "unavailable": "Bilinmiyor",
    "placeholder": "Örn. ayna katlama, merkezi kilit tercihi, yazılım sorunu veya motor uyarısı"
  },
  "de": {
    "head": "Fahrzeugsoftware & Codierung anfragen",
    "intro": "Beschreiben Sie die gewünschte Komfortfunktion, das Softwareproblem oder die Fehlermeldung. Anhand Ihrer Fahrzeugdaten prüfen wir, welche Leistung unterstützt wird.",
    "mileage": "Kilometerstand (optional)",
    "ecu": "ECU / Softwarestand (falls bekannt)",
    "note": "Gewünschte Funktion / Fehlerbild",
    "wa": "Service per WhatsApp anfragen →",
    "email": "Service per E-Mail anfragen →",
    "choose": "Marke und Modell sowie Baujahr oder Motorkennung ergänzen.",
    "ready": "Fahrzeugangaben bereit. Die folgenden Angaben werden vorbereitet.",
    "preview": "Zusammenfassung der Anfrage",
    "privacy": "Die Fahrgestellnummer (VIN) wird nicht übertragen. WhatsApp bzw. E-Mail öffnet sich erst beim Klick; das Absenden bleibt Ihre Entscheidung.",
    "subject": "6006 Performance | Fahrzeugsoftware und Codierung",
    "salutation": "Hallo 6006 Performance, ich interessiere mich für Fahrzeugsoftware, Codierung oder Diagnose für mein Fahrzeug.",
    "stock": "Serien-Referenzwerte",
    "unverified": "Referenzdaten nicht OEM-verifiziert",
    "family": "Modellfamilie statt exakter Baureihe; bitte prüfen",
    "verification": "Bitte die gewünschte Funktion vorab auf Unterstützung durch Ausstattung, Steuergerät und Softwarestand prüfen.",
    "mileageUnit": "km",
    "vehicle": "Fahrzeug",
    "year": "Baujahr",
    "fuel": "Kraftstoff",
    "engine": "Motor",
    "generation": "Generation",
    "gearbox": "Getriebe",
    "ecuVersion": "ECU",
    "extra": "Hinweise",
    "unavailable": "Unbekannt",
    "placeholder": "Zum Beispiel Spiegelanklappen, Zentralverriegelung, Softwareproblem oder Motorwarnung"
  },
  "en": {
    "head": "Ask about vehicle software & coding",
    "intro": "Describe the comfort function, software issue or warning you want help with. We use your vehicle details to check which service is supported.",
    "mileage": "Mileage (optional)",
    "ecu": "ECU / software version (if known)",
    "note": "Requested function / symptoms",
    "wa": "Ask about service via WhatsApp →",
    "email": "Ask about service via email →",
    "choose": "Enter make and model, plus year or engine code.",
    "ready": "Vehicle details ready. The summary below will be shared.",
    "preview": "Vehicle request summary",
    "privacy": "Your VIN is not included. WhatsApp or your email app opens only after you click; sending the message is your choice.",
    "subject": "6006 Performance | Vehicle software and coding",
    "salutation": "Hello 6006 Performance, I would like information about vehicle software, coding or diagnosis for my vehicle.",
    "stock": "Reference stock figures",
    "unverified": "Reference data not OEM verified",
    "family": "Model-family match, exact generation not verified",
    "verification": "Please check support for the requested function against the fitted equipment, control unit and software version before work.",
    "mileageUnit": "km",
    "vehicle": "Vehicle",
    "year": "Year",
    "fuel": "Fuel",
    "engine": "Engine",
    "generation": "Generation",
    "gearbox": "Gearbox",
    "ecuVersion": "ECU",
    "extra": "Notes",
    "unavailable": "Unknown",
    "placeholder": "For example mirror folding, central locking preference, software issue or engine warning"
  }
};
const contactWaNumber="491788354756",contactEmail="6006performance@gmail.com";
const quoteBox=document.createElement("section");
quoteBox.className="vin6006-quote";quoteBox.id="vin6-quote";
quoteBox.innerHTML='<div class="vin6006-quote-top"><div class="vin6006-quote-eyebrow">6006 PERFORMANCE</div><h4 id="vin6-quote-title"></h4><p id="vin6-quote-intro"></p></div>'
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
 quoteControls.wa.textContent=copy.wa;quoteControls.email.textContent=copy.email;quoteControls.note.placeholder=copy.placeholder;
 const selected=selectedVariant();
 const engineCode=manual.value.trim()||selected?.engine||"";
 const valid=Boolean(make.value&&model.value&&(year.value||engineCode));
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
let variants=[],busy=0,memory={},manualGearbox="",manualGeneration="",restoreAmbiguous=false;
const preferred=new URLSearchParams(location.search);
try{memory=JSON.parse(sessionStorage.getItem("6006-vehicle-choice")||"{}")||{};}catch(e){}
function option(select,value,name){select.append(new Option(name,value));}
function fill(select,entries,label){select.replaceChildren();option(select,"",label||t("choose"));entries.forEach(item=>option(select,item[0],item[1]));}
function numeric(value){const num=Number(value);return Number.isFinite(num)&&num>0&&num<=3000?Math.round(num):null;}
function selectedVariant(){return /^\d+$/.test(engine.value)?variants[Number(engine.value)]||null:null;}
function variantKey(v){return v?JSON.stringify([v.model||"",v.generation||"",v.engine||"",v.fuel||"",v.transmission||"",v.from||"",v.to||"",v.hp??"",v.nm??""]):"";}
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
const labels={kicker:"kicker",heading:"head",intro:"intro",all:"all", "vin-label":"vin",decode:"decode","vin-help":"vinHelp",lmake:"make",lmodel:"model",lyear:"year",lfuel:"fuel",lengine:"engine",lmanual:"other",lps:"power",lnm:"torque","result-head":"selected",stagehead:"stockHead",codehead:"common",th1:"value",th2:"old","code-note":"codeCaution","stage-link":"openService","dtc-link":"open","service-heading":"serviceHeading","service-intro":"serviceIntro","software-title":"softwareTitle","software-text":"softwareText","coding-title":"codingTitle","coding-text":"codingText","diagnostic-title":"diagnosticTitle","diagnostic-text":"diagnosticText",eligibility:"eligibility"};
for(const [id,key]of Object.entries(labels)){$(id).textContent=t(key);}
renderMakeButtons();
renderVinStatus();
if(fuel.options.length){const value=fuel.value;fill(fuel,fuelKeys.slice(1).map(k=>[k,w[lang()].fuels[k]]),t("allFuel"));fuel.value=value;}
if(engine.options.length)engine.options[0].textContent=t("noneMotor");
engineSearchLabel.textContent=w[lang()].searchLabel;
engineSearch.placeholder=w[lang()].searchLabel;
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
 const previous=preserve!==""&&/^\d+$/.test(String(preserve))?variants[Number(preserve)]:null;
 const preservedKey=variantKey(previous);
 variants=findVariants();
 const query=clean(engineSearch.value||"");
 visibleVariants=[];
 for(let i=0;i<variants.length;i++){
  const v=variants[i];
  const searchable=clean([v.engine,v.generation,v.fuel,v.transmission,v.hp,v.nm].join(" "));
  if(!query||searchable.includes(query))visibleVariants.push(i);
 }
 const current=preservedKey?variants.findIndex(v=>variantKey(v)===preservedKey):-1;
 const choices=visibleVariants.map(i=>{
  const v=variants[i],stock=stockPower(v),torque=stockTorque(v),review=stockNeedsReview(v);
  const meta=[v.generation,v.transmission,v.fuel,v.from&&v.to?v.from+"–"+v.to:v.from||v.to].filter(Boolean).join(" · ");
  const label=String(v.engine)+(stock?" · "+stock+" PS":"")+(torque?" · "+torque+" Nm":"")+(review?" · ⚠":"");
  return [String(i),label+" · "+meta];
 });
 fill(engine,choices,t("noneMotor"));
 if(current>=0&&choices.some(x=>x[0]===String(current)))engine.value=String(current);
 variantSummary.textContent=variants.length?
  visibleVariants.length+" / "+variants.length+" "+w[lang()].variantCount:
  w[lang()].noVariants;
 if(restoreAmbiguous)variantSummary.textContent+=" · "+t("ambiguous");
 if(engine.value==="")showReport(false);
}
function showReport(flag){report.hidden=!flag;}
function saveChoice(){
if(!make.value||!model.value)return;
const v=selectedVariant();
try{sessionStorage.setItem("6006-vehicle-choice",JSON.stringify({schemaVersion:2,brand:make.value,model:model.value,year:year.value,powertrain:fuel.value,engine:manual.value.trim()||v?.engine||"",ps:ps.value,nm:nm.value,gearbox:v?.transmission||manualGearbox,generation:v?.generation||manualGeneration,variantKey:variantKey(v),selectionKind:v?"catalog":manual.value.trim()?"manual":"",manuallyEditedStock}));}catch(e){}
}
function vehicleParams(){const p=new URLSearchParams(),v=selectedVariant();const props={brand:make.value,model:model.value,year:year.value,powertrain:fuel.value,engine:manual.value.trim()||v?.engine||"",ps:ps.value,nm:nm.value,gearbox:v?.transmission||manualGearbox,generation:v?.generation||manualGeneration,variantKey:variantKey(v)};for(const [k,value]of Object.entries(props))if(value)p.set(k,value);return p;}
function relatedCodes(){
const v=selectedVariant(),name=clean(manual.value.trim()||v?.engine),f=fuel.value||readFuel(v?.fuel||name);
const descriptions={tr:{P0299:"Turbo / düşük basınç",P0401:"AGR / EGR akışı",P2002:"DPF verimi",P0101:"Hava kütlesi ölçümü",P0300:"Yanma / ateşleme kesintisi",P0171:"Fakir yakıt karışımı",P0420:"Katalizör verimi",U0100:"Motor kontrol ünitesi iletişimi",U0121:"ABS iletişimi",C0035:"Tekerlek hız sinyali",P0700:"Şanzıman kontrolü"},de:{P0299:"Ladedruck / Turbo",P0401:"AGR / EGR",P2002:"DPF",P0101:"Luftmassenmesser",P0300:"Zündaussetzer",P0171:"Gemisch zu mager",P0420:"Katalysator",U0100:"Motorsteuergerätekommunikation",U0121:"ABS-Kommunikation",C0035:"Raddrehzahlsignal",P0700:"Getriebesteuerung"},en:{P0299:"Boost / turbo pressure",P0401:"EGR flow",P2002:"DPF efficiency",P0101:"Air mass measurement",P0300:"Combustion misfire",P0171:"Fuel mixture too lean",P0420:"Catalyst efficiency",U0100:"Engine control communication",U0121:"ABS communication",C0035:"Wheel speed signal",P0700:"Transmission control"}};
const codes=f==="Diesel"?["P0299","P0401","P2002","P0101"]:["Benzin","LPG","CNG"].includes(f)?["P0300","P0171","P0420","P0101"]:f==="Electric"?["U0100","U0121","C0035"]:["P0101","P0700","U0100"];
return codes.map(code=>[code,descriptions[lang()][code]]);
}
function renderRelatedCodes(){
 const container=$("code-list");
 const entries=relatedCodes().map(([code,description])=>{
  const params=vehicleParams();params.set("code",code);
  return {code,description,href:"/fehlercodes/?"+params.toString()};
 });
 const signature=JSON.stringify(entries);
 if(container.dataset.signature===signature)return;
 // Keep existing anchors connected during blur/change. Replacing them between
 // pointerdown and click would discard the visitor's first navigation attempt.
 const existing=new Map([...container.children].map(a=>[a.dataset.code,a]));
 entries.forEach(({code,description,href},index)=>{
  let a=existing.get(code);existing.delete(code);
  if(!a){
   a=document.createElement("a");a.dataset.code=code;
   const strong=document.createElement("strong"),span=document.createElement("span"),arrow=document.createElement("b");
   strong.textContent=code;arrow.textContent="›";a.append(strong,span,arrow);
  }
  if(a.getAttribute("href")!==href)a.setAttribute("href",href);
  if(a.children[1].textContent!==description)a.children[1].textContent=description;
  if(container.children[index]!==a)container.insertBefore(a,container.children[index]||null);
 });
 for(const a of existing.values())a.remove();
 container.dataset.signature=signature;
}
function renderReport(){
if(!make.value||!model.value){showReport(false);return;}
showReport(true);
const v=selectedVariant(),name=manual.value.trim()||(v?.engine||"");
const basePS=numeric(ps.value)||(v?stockPower(v):null),baseNM=numeric(nm.value)||(v?stockTorque(v):null);
$("identity").textContent=[make.value,model.value,year.value,(!fuel.value?"":w[lang()].fuels[fuel.value]),name,v?.generation||manualGeneration,v?.transmission||manualGearbox].filter(Boolean).join(" · ");
const table=$("metrics");table.replaceChildren();
for(const [label,value,unit] of [[t("hp"),basePS,"PS"],[t("nm"),baseNM,"Nm"]]){
 const row=document.createElement("tr");
 for(const text of [label,value?value+" "+unit:"—"]){const cell=document.createElement("td");cell.textContent=text;row.append(cell);}
 table.append(row);
}
$("stage-note").textContent=(!basePS||!baseNM?t("noData"):t("variant"))+(v&&stockNeedsReview(v)?" "+w[lang()].reviewWarning:"");
renderRelatedCodes();
$("stage-link").href="/#hizmetler";
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
function selectManufacturer(raw,source="vinLocal"){
 const aliases={MERCEDESBENZ:"Mercedes-Benz",MERCEDESAMG:"Mercedes-Amg",VOLKSWAGEN:"Volkswagen",SKODA:"Škoda",SEAT:"SEAT",CHEVROLET:"Chevrolet",LANDROVER:"Land Rover",TOYOTAMOTOR:"Toyota",BMW:"BMW",ROLLSROYCE:"Rolls-Royce",ALFAROMEO:"Alfa Romeo"};
 const name=aliases[normalizeMake(raw).toUpperCase()]||raw;
 const normalized=normalizeMake(name);
 const matched=[...make.options].find(o=>normalizeMake(o.value)===normalized);
 if(!matched&&!name)return false;
 if(!matched)option(make,name,name);
 make.value=matched?.value||name;
 vinStatus={kind:"found",make:make.value,source};renderVinStatus();
 make.dispatchEvent(new Event("change",{bubbles:true}));
 renderMakeButtons();
 return true;
}
let lookupId=0;
async function identify(){
 const full=$("vin").value.trim().replace(/\s|-/g,"").toUpperCase();
 $("vin").value=full;const token=++lookupId;
 if(!/^[A-HJ-NPR-Z0-9]{17}$/.test(full)){vinStatus={kind:"invalid"};renderVinStatus();return;}
 const prefix=full.slice(0,3);
 if(wmi[prefix]){selectManufacturer(wmi[prefix]);return;}
 vinStatus={kind:"loading"};renderVinStatus();
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
  if(identified&&selectManufacturer(String(identified.Make).trim(),"vinRemote"))return;
 }catch(e){if(token!==lookupId)return;}
 if(token===lookupId){vinStatus={kind:"unavailable"};renderVinStatus();}
}
function syncVariant(){
const v=selectedVariant();restoreAmbiguous=false;manualGearbox="";manualGeneration="";
if(v){manuallyEditedStock=false;manual.value="";ps.value=stockPower(v)||"";nm.value=stockTorque(v)||"";if(!fuel.value&&readFuel(v.fuel||v.engine))fuel.value=readFuel(v.fuel||v.engine);}
else{ps.value="";nm.value="";}
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
$("vin").addEventListener("input",()=>{lookupId++;vinStatus={kind:""};renderVinStatus();});
function clearVariant(){manual.value="";ps.value="";nm.value="";manualGearbox="";manualGeneration="";restoreAmbiguous=false;manuallyEditedStock=false;engineSearch.value="";}
make.addEventListener("change",()=>{clearVariant();fuel.value="";year.value="";if(vinStatus.kind==="found"&&vinStatus.make!==make.value){vinStatus={kind:""};renderVinStatus();}makeChanged("");renderMakeButtons();});
model.addEventListener("change",()=>{clearVariant();fuel.value="";modelChanged();});
year.addEventListener("change",()=>{clearVariant();renderEngines("");renderReport();});
fuel.addEventListener("change",()=>{clearVariant();renderEngines("");renderReport();});
engine.addEventListener("change",syncVariant);
engineSearch.addEventListener("input",()=>{const old=engine.value;renderEngines(old);if(engine.value!==old){manuallyEditedStock=false;ps.value="";nm.value="";renderReport();}});

manual.addEventListener("change",renderReport);
manual.addEventListener("input",()=>{
 restoreAmbiguous=false;manualGearbox="";manualGeneration="";
 if(manual.value.trim()&&engine.value!==""){
  engine.value="";ps.value="";nm.value="";
 }
 manuallyEditedStock=true;renderReport();
});
for(const e of [ps,nm]){e.addEventListener("change",renderReport);e.addEventListener("input",()=>{manuallyEditedStock=true;renderReport();});}
window.addEventListener("6006-makes-ready",()=>{const current=make.value;fillMakes();if(current&&!make.value){option(make,current,current);make.value=current;}});
window.addEventListener("6006-models-ready",e=>{if(e.detail?.brand===make.value){const current=model.value;populateModels(current);}});
new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
const externalMake=preferred.get("brand"),externalModel=preferred.get("model");
const sameSavedVehicle=(!externalMake||normalizeMake(externalMake)===normalizeMake(memory.brand))&&(!externalModel||clean(externalModel)===clean(memory.model))&&(!preferred.has("year")||preferred.get("year")===String(memory.year||""))&&(!preferred.has("engine")||clean(preferred.get("engine"))===clean(memory.engine))&&(!preferred.has("powertrain")||preferred.get("powertrain")===String(memory.powertrain||""));
const stored=sameSavedVehicle&&!preferred.has("engineSearch")?memory:{};
const initial={make:externalMake||stored.brand||"",model:externalModel||stored.model||"",year:preferred.get("year")||stored.year||"",fuel:preferred.get("powertrain")||stored.powertrain||"",engine:preferred.get("engine")||stored.engine||"",ps:preferred.get("ps")||stored.ps||"",nm:preferred.get("nm")||stored.nm||"",gearbox:preferred.get("gearbox")||stored.gearbox||"",generation:preferred.get("generation")||stored.generation||"",variantKey:(preferred.get("variantKey")||stored.variantKey||"").slice(0,1000),manuallyEditedStock:preferred.has("manuallyEditedStock")?preferred.get("manuallyEditedStock")==="1":Boolean(stored.manuallyEditedStock),engineSearch:(preferred.get("engineSearch")||"").trim().slice(0,90)};
async function restore(){
if(initial.make){if(![...make.options].some(o=>o.value===initial.make))option(make,initial.make,initial.make);make.value=initial.make;populateModels(initial.model);
if(initial.model)model.value=initial.model;}
if(initial.year&&[...year.options].some(o=>o.value===initial.year))year.value=initial.year;
if(initial.fuel&&fuelKeys.includes(initial.fuel))fuel.value=initial.fuel;
if(initial.ps)ps.value=initial.ps;
if(initial.nm)nm.value=initial.nm;
manualGearbox=String(initial.gearbox).slice(0,90);manualGeneration=String(initial.generation).slice(0,100);
if(initial.engineSearch)engineSearch.value=initial.engineSearch;
if(initial.engine)manual.value=initial.engine;
translate();
if(make.value){await makeChanged(initial.model);if(model.value){
 renderEngines("");
 // Only the complete stable identity may restore an automatic selection.
 // A reused engine label can belong to another generation or gearbox.
 const matches=initial.variantKey?variants.map((v,i)=>({v,i})).filter(x=>variantKey(x.v)===initial.variantKey):[];
 if(matches.length===1){
  engine.value=String(matches[0].i);manual.value="";syncVariant();
  if(initial.manuallyEditedStock||(initial.ps&&numeric(initial.ps)!==stockPower(matches[0].v))||(initial.nm&&numeric(initial.nm)!==stockTorque(matches[0].v))){
   ps.value=initial.ps;nm.value=initial.nm;manuallyEditedStock=true;renderReport();
  }
 }else{
  manual.value=initial.engine;ps.value=initial.ps;nm.value=initial.nm;
  manuallyEditedStock=Boolean(initial.engine||initial.ps||initial.nm);
  restoreAmbiguous=Boolean(initial.engine&&variants.filter(v=>clean(v.engine)===clean(initial.engine)).length>1);
  if(restoreAmbiguous)variantSummary.textContent+=" · "+t("ambiguous");
  renderReport();
 }
}}
// Search links from the OPEN motor directory only supply a search hint.
// Apply it after all async brand/model work so it cannot be overwritten.
// Never treat community HP/Nm as verified stock values or select ECU automatically.
if(initial.engineSearch){
 engineSearch.value=initial.engineSearch;
 renderEngines("");
 engine.value="";
 manual.value="";
 ps.value="";
 nm.value="";
 manuallyEditedStock=false;
 renderReport();
}
}
restore();
})();
