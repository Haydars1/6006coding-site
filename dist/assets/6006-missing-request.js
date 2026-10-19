(()=>{
"use strict";
const finder=document.getElementById("vehicle-selector-6006");
const detail=finder?.querySelector(".vin6006-details");
if(!finder||!detail||document.getElementById("vin6-missing-request"))return;
// The catalogue does not need a paid database or backend to receive corrections.
// No data is transmitted by this script. Only a visitor click opens a message draft.
const text={
tr:{toggle:"Modelim veya motorum listede yok",title:"Eksik araç / motor bildir",intro:"Aracını veya motorunu bulamadın mı? Bildiğin araç bilgilerini ve yazılım, kodlama veya teşhis ihtiyacını belirt. 6006 Performance motor ve kontrol ünitesi bilgilerini kontrol ederek talebini değerlendirebilir.",make:"Marka (listede yoksa)",model:"Model / kasa (listede yoksa)",year:"Model yılı (listede yoksa)",engine:"Motor / motor kodu (biliyorsan)",gear:"Şanzıman / çekiş",power:"Ruhsattaki güç (PS, isteğe bağlı)",torque:"Orijinal tork (Nm, isteğe bağlı)",ecu:"ECU / yazılım numarası (biliyorsan)",mileage:"Kilometre (isteğe bağlı)",note:"Eksik model, yazılım, kodlama veya arıza hakkında not",whatsapp:"WhatsApp ile bildir →",email:"E-posta ile bildir →",preview:"Gönderilecek özet",ready:"Talep hazır. WhatsApp veya e-posta uygulamasında gönderimi sen onaylayacaksın.",need:"En az marka, model ve model yılı veya motor bilgisi gerekli.",privacy:"Tam VIN otomatik eklenmez ve bu form arka planda hiçbir bilgi göndermez. Mesaj yalnızca sen bağlantıya tıklarsan hazırlanır. Kişisel belge veya tam VIN yazma.",subject:"6006 Performance | Eksik araç veya motor kataloğu bildirimi",hello:"Merhaba 6006 Performance, araç / motor veritabanınızda bulamadığım bir kayıt için kontrol ve ekleme rica ediyorum.",vehicle:"Marka / model",yearKey:"Yıl",fuelKey:"Yakıt",engineKey:"Motor / kod",gearKey:"Şanzıman",powerKey:"Stok güç",torqueKey:"Stok tork",ecuKey:"ECU",mileKey:"Kilometre",noteKey:"Not",verify:"Bunlar kullanıcının bildirdiği bilgilerdir. Motor, ECU uyumluluğu ve değerleri doğrulanmadan kesin kayıt olarak yayımlamayın."},
de:{toggle:"Mein Modell oder Motor fehlt",title:"Fehlendes Fahrzeug / Motor melden",intro:"Modell oder Motor nicht gefunden? Bekannte Fahrzeugdaten eingeben, und den gewünschten Software-, Codierungs- oder Diagnoseauftrag beschreiben. 6006 Performance prüft die Fahrzeugangaben vor einer Katalogergänzung.",make:"Marke (falls nicht gelistet)",model:"Modell / Baureihe (falls nicht gelistet)",year:"Baujahr (falls nicht gelistet)",engine:"Motor / Motorkennung (falls bekannt)",gear:"Getriebe / Antrieb",power:"Serienleistung (PS, optional)",torque:"Seriendrehmoment (Nm, optional)",ecu:"ECU / Softwarestand (falls bekannt)",mileage:"Kilometerstand (optional)",note:"Fehlendes Modell, Softwarewunsch, Codierung oder Fehlersymptom",whatsapp:"Per WhatsApp melden →",email:"Per E-Mail melden →",preview:"Vorgesehene Nachricht",ready:"Anfrage bereit. Der Versand wird erst in WhatsApp oder der E-Mail-App bestätigt.",need:"Bitte Marke, Modell und entweder Baujahr oder Motor angeben.",privacy:"Die vollständige FIN wird nicht automatisch übernommen; dieses Formular sendet nichts im Hintergrund. Die Nachricht wird erst nach Ihrem Klick vorbereitet. Keine Ausweiskopien oder vollständige FIN eingeben.",subject:"6006 Performance | Fehlendes Modell / Motor melden",hello:"Hallo 6006 Performance, bitte prüfen Sie ein in Ihrem Fahrzeug-/Motorkatalog fehlendes Modell bzw. Motor.",vehicle:"Marke / Modell",yearKey:"Baujahr",fuelKey:"Kraftstoff",engineKey:"Motor / Kennung",gearKey:"Getriebe",powerKey:"Serienleistung",torqueKey:"Seriendrehmoment",ecuKey:"ECU",mileKey:"Kilometerstand",noteKey:"Hinweis",verify:"Dies sind vom Besucher angegebene Daten. Motor, ECU-Stand und Leistungswerte vor Veröffentlichung prüfen."},
en:{toggle:"My model or engine is missing",title:"Report a missing vehicle / engine",intro:"Can't find your car or engine? Enter the vehicle details and the software, coding or diagnostic work you need. 6006 Performance can review the engine and control unit before adding a catalogue entry.",make:"Make (if not listed)",model:"Model / generation (if not listed)",year:"Model year (if not listed)",engine:"Engine / engine code (if known)",gear:"Gearbox / drivetrain",power:"Stock power (PS, optional)",torque:"Stock torque (Nm, optional)",ecu:"ECU / software number (if known)",mileage:"Mileage (optional)",note:"Missing model, software request, coding or fault symptoms",whatsapp:"Report by WhatsApp →",email:"Report by email →",preview:"Message summary",ready:"Request ready. You decide whether to send it in WhatsApp or your email app.",need:"Provide a make, model and either model year or engine information.",privacy:"The full VIN is not included automatically and this form sends nothing in the background. The message is prepared only after you click. Do not type private documents or a full VIN.",subject:"6006 Performance | Missing vehicle or engine",hello:"Hello 6006 Performance, please review a missing model or engine in your catalogue.",vehicle:"Make / model",yearKey:"Model year",fuelKey:"Fuel",engineKey:"Engine / code",gearKey:"Gearbox",powerKey:"Stock power",torqueKey:"Stock torque",ecuKey:"ECU",mileKey:"Mileage",noteKey:"Notes",verify:"These are customer-supplied details. Verify model, engine, ECU and power values before adding a public record."}
};
const panel=document.createElement("section");
panel.id="vin6-missing-request";panel.className="vin6006-missing";
panel.innerHTML='<button type="button" id="vin6-missing-toggle" class="vin6006-missing-toggle" aria-controls="vin6-missing-fields" aria-expanded="false"></button>'
+'<div id="vin6-missing-fields" hidden><h3 id="vin6-missing-title"></h3><p id="vin6-missing-intro"></p>'
+'<div class="vin6006-missing-grid">'
+'<div><label id="vin6-missing-lmake" for="vin6-missing-make"></label><input type="text" id="vin6-missing-make" maxlength="70" autocomplete="off" /></div>'
+'<div><label id="vin6-missing-lmodel" for="vin6-missing-model"></label><input type="text" id="vin6-missing-model" maxlength="85" autocomplete="off" /></div>'
+'<div><label id="vin6-missing-lyear" for="vin6-missing-year"></label><input type="number" id="vin6-missing-year" min="1950" max="2035" inputmode="numeric" /></div>'
+'<div><label id="vin6-missing-lengine" for="vin6-missing-engine"></label><input type="text" id="vin6-missing-engine" maxlength="120" autocomplete="off" /></div>'
+'<div><label id="vin6-missing-lgear" for="vin6-missing-gear"></label><input type="text" id="vin6-missing-gear" maxlength="75" /></div>'
+'<div><label id="vin6-missing-lpower" for="vin6-missing-power"></label><input type="number" id="vin6-missing-power" min="1" max="2000" inputmode="numeric" /></div>'
+'<div><label id="vin6-missing-ltorque" for="vin6-missing-torque"></label><input type="number" id="vin6-missing-torque" min="1" max="3000" inputmode="numeric" /></div>'
+'<div><label id="vin6-missing-lecu" for="vin6-missing-ecu"></label><input type="text" id="vin6-missing-ecu" maxlength="100" /></div>'
+'<div><label id="vin6-missing-lmileage" for="vin6-missing-mileage"></label><input type="number" id="vin6-missing-mileage" min="0" max="2000000" inputmode="numeric" /></div>'
+'<div class="vin6006-missing-wide"><label id="vin6-missing-lnote" for="vin6-missing-note"></label><textarea id="vin6-missing-note" maxlength="400" rows="2"></textarea></div>'
+'</div><p class="vin6006-missing-preview" id="vin6-missing-preview" role="status" aria-live="polite"></p>'
+'<div class="vin6006-missing-actions"><a id="vin6-missing-whatsapp" target="_blank" rel="noopener noreferrer"></a><a id="vin6-missing-email"></a></div>'
+'<p class="vin6006-missing-privacy" id="vin6-missing-privacy"></p></div>';
detail.insertAdjacentElement("beforebegin",panel);
const id=key=>document.getElementById("vin6-missing-"+key);
const toggle=id("toggle"),container=id("fields"),whatsapp=id("whatsapp"),email=id("email");
const rootInputs=["make","model","year","engine","gear","power","torque","ecu","mileage","note"].map(id);
const main={make:document.getElementById("vin6-make"),model:document.getElementById("vin6-model"),year:document.getElementById("vin6-year"),fuel:document.getElementById("vin6-fuel"),engine:document.getElementById("vin6-engine"),manual:document.getElementById("vin6-manual")};
const messageValue=v=>String(v||"").replace(/[\r\n\t]+/g," ").replace(/\s+/g," ").trim();
const checkedNumber=(v,lo,hi)=>{if(v==="")return "";const n=Number(v);return Number.isSafeInteger(n)&&n>=lo&&n<=hi?String(n):"";};
const currentLocale=()=>{const l=(document.documentElement.lang||"").toLowerCase();return l.startsWith("tr")?"tr":l.startsWith("de")?"de":"en";};
const chosen=(custom,select)=>messageValue(custom.value)||messageValue(select?.value);
function update(){
 const L=text[currentLocale()];
 toggle.textContent=L.toggle;
 id("title").textContent=L.title;id("intro").textContent=L.intro;
 for(const key of ["make","model","year","engine","gear","power","torque","ecu","mileage","note"])id("l"+key).textContent=L[key];
 whatsapp.textContent=L.whatsapp;email.textContent=L.email;id("privacy").textContent=L.privacy;
 const make=chosen(id("make"),main.make);
 const model=chosen(id("model"),main.model);
 const year=checkedNumber(id("year").value||main.year?.value,1950,2035);
 const engine=messageValue(id("engine").value)||messageValue(main.manual?.value);
 const valid=Boolean(make&&model&&(year||engine));
 const details=[];const add=(label,val)=>{if(val)details.push(label+": "+messageValue(val));};
 add(L.vehicle,make&&model?make+" "+model:"");
 add(L.yearKey,year);
 const fuelValue=main.fuel?.selectedOptions?.[0];add(L.fuelKey,main.fuel?.value?(fuelValue?.textContent||main.fuel.value):"");
 add(L.engineKey,engine);add(L.gearKey,id("gear").value);
 const power=checkedNumber(id("power").value,1,2000);
 const torque=checkedNumber(id("torque").value,1,3000);
 add(L.powerKey,power?power+" PS":"");add(L.torqueKey,torque?torque+" Nm":"");
 add(L.ecuKey,id("ecu").value);
 const mileage=checkedNumber(id("mileage").value,0,2000000);
 add(L.mileKey,mileage?Number(mileage).toLocaleString(currentLocale()==="de"?"de-DE":currentLocale()==="tr"?"tr-TR":"en-US")+" km":"");
 add(L.noteKey,id("note").value);
 const msg=[L.hello,"",...details,"",L.verify].join("\n");
 id("preview").textContent=(valid?L.ready:L.need)+" "+(make&&model?L.preview+": "+make+" · "+model+(year?" · "+year:""):"");
 for(const a of [whatsapp,email]){a.setAttribute("aria-disabled",String(!valid));a.tabIndex=valid?0:-1;}
 if(valid){
  whatsapp.href="https://wa.me/491788354756?text="+encodeURIComponent(msg);
  email.href="mailto:6006performance@gmail.com?subject="+encodeURIComponent(L.subject)+"&body="+encodeURIComponent(msg);
 }else{whatsapp.removeAttribute("href");email.removeAttribute("href");}
}
toggle.addEventListener("click",()=>{
 const opening=container.hidden;container.hidden=!opening;toggle.setAttribute("aria-expanded",String(opening));
 update();
 if(opening)(main.make?.value?main.model?.value?id("engine"):id("model"):id("make")).focus({preventScroll:true});
});
for(const e of [...rootInputs,...Object.values(main)].filter(Boolean)){
 e.addEventListener("change",update);e.addEventListener("input",update);
}
window.addEventListener("6006-makes-ready",update);
window.addEventListener("6006-models-ready",update);
new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
update();
// Correct async preselection may update native controls without dispatching change events.
window.setTimeout(update,900);
})();