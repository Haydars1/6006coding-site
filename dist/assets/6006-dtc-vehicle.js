// Car selection for DTC search: the manufacturer filter and actual car profile are
// deliberately separate because a generic DTC does not identify a specific engine.
(()=>{
"use strict";
const $=id=>document.getElementById(id);
const wrap=$("vehicle-picker-dtc");if(!wrap)return;
const finder=window.VehicleCatalog6006;
if(!finder)return;
const lang=()=>{const l=document.documentElement.lang?.slice(0,2);return ["tr","de","en"].includes(l)?l:"de";};
const i18n={
 tr:{headline:"Aracını seç",help:"Marka, model, motor ve yılı seç. Sonuçlar ve arıza kodları bu araçla birlikte görüntülenebilir; kesin OEM eşleştirmesi için motor kodu gerekir.",make:"Marka",model:"Model",year:"Yıl",fuel:"Yakıt",engine:"Motor / motor kodu",ps:"Stok güç (PS)",gear:"Şanzıman",find:"Aracımı kaydet",saved:"Seçilen araç",none:"Marka ve modelini yaz. Listede yoksa elle ekleyebilirsin.",guide:"Araç profilini aç",stage:"Stage 1 incele",all:"Tüm araçlar desteklenir: eksik modeller elle girilebilir.",makePlaceholder:"VW, BMW, Mercedes-Benz…",modelPlaceholder:"Golf, Passat B8, E220d…"},
 de:{headline:"Mein Fahrzeug auswählen",help:"Marke, Modell, Motor und Baujahr wählen. Der Fehlercode wird im Fahrzeugkontext bewertet. Für exakte OEM-Prüfwerte ist der Motorcode notwendig.",make:"Marke",model:"Modell",year:"Baujahr",fuel:"Kraftstoff",engine:"Motor / Motorkennbuchstabe",ps:"Serienleistung (PS)",gear:"Getriebe",find:"Fahrzeug speichern",saved:"Gewähltes Fahrzeug",none:"Marke und Modell eingeben. Fehlende Varianten können manuell ergänzt werden.",guide:"Fahrzeugprofil öffnen",stage:"Stage 1 ansehen",all:"Fehlende Fahrzeugmodelle können Sie selbst eintragen.",makePlaceholder:"VW, BMW, Mercedes-Benz…",modelPlaceholder:"Golf, Passat B8, E220d…"},
 en:{headline:"Choose your vehicle",help:"Enter make, model, engine and model year. Fault-code information can be viewed in your vehicle context; exact OEM checks require the engine code.",make:"Make",model:"Model",year:"Year",fuel:"Fuel",engine:"Engine / code",ps:"Stock power (PS)",gear:"Gearbox",find:"Save vehicle",saved:"Selected vehicle",none:"Enter the make and model. Missing models can be entered manually.",guide:"Open vehicle profile",stage:"View Stage 1",all:"Missing models can always be entered manually.",makePlaceholder:"VW, BMW, Mercedes-Benz…",modelPlaceholder:"Golf, Passat B8, E220d…"}
};
const t=k=>i18n[lang()][k];
wrap.innerHTML='<h2 id="dtc-car-head"></h2><p id="dtc-car-help"></p><form id="dtc-car-form">'
+'<div class="dtc-car-grid"><label><span data-dtc-label="make"></span><input id="dtc-car-make" list="dtc-car-makes" maxlength="80" autocomplete="off" required><datalist id="dtc-car-makes"></datalist></label>'
+'<label><span data-dtc-label="model"></span><input id="dtc-car-model" list="dtc-car-models" maxlength="90" autocomplete="off" required><datalist id="dtc-car-models"></datalist></label>'
+'<label><span data-dtc-label="year"></span><select id="dtc-car-year"><option value="">—</option></select></label>'
+'<label><span data-dtc-label="fuel"></span><select id="dtc-car-fuel"><option value="">—</option><option value="Diesel">Diesel</option><option value="Benzin">Benzin</option><option value="Hybrid">Hybrid</option><option value="Plug-in-Hybrid">Plug-in-Hybrid</option><option value="Electric">Elektro</option><option value="LPG">LPG</option></select></label>'
+'<label><span data-dtc-label="engine"></span><input id="dtc-car-engine" placeholder="z. B. 2.0 TDI CRLB" maxlength="90"></label>'
+'<label><span data-dtc-label="ps"></span><input id="dtc-car-ps" type="number" inputmode="numeric" min="1" max="3000" placeholder="150"></label>'
+'<label><span data-dtc-label="gear"></span><select id="dtc-car-gear"><option value="">—</option><option value="Manuel">Schaltgetriebe</option><option value="Otomatik">Automatik</option><option value="DSG/DCT">DSG / DCT</option><option value="CVT">CVT</option></select></label></div>'
+'<button type="submit" class="dtc-car-save" id="dtc-car-save"></button></form><div class="dtc-car-result" id="dtc-car-result" role="status" aria-live="polite"></div><p class="dtc-car-note" id="dtc-car-note"></p>';
const style=document.createElement("style");style.textContent='.dtc-car-panel{border:1px solid #806142;background:linear-gradient(135deg,#2c241b,#161410);margin:1.4rem 0;padding:1.35rem;border-radius:7px}.dtc-car-panel h2{font-size:1.5rem;margin:0 0 .3rem}.dtc-car-panel p{color:#cbbba8;font-size:.86rem;margin:.25rem 0 1rem}.dtc-car-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem}.dtc-car-grid label{min-width:0;font-size:.72rem;color:#e1bf90;display:block}.dtc-car-grid label span{display:block;margin-bottom:.3rem}.dtc-car-grid input,.dtc-car-grid select{width:100%;min-width:0;min-height:2.9rem;padding:.5rem .6rem;border:1px solid #745a40;border-radius:3px;background:#151310;color:#f5eee5;font-size:.87rem}.dtc-car-save{margin:1rem 0 0;background:#c49a67;color:#1c1208;border:0;padding:.72rem 1rem;cursor:pointer;font-weight:800;border-radius:3px}.dtc-car-result:not(:empty){margin-top:.7rem;padding:.8rem;border:1px solid #746049;border-radius:4px}.dtc-car-result a{display:inline-block;margin:.45rem .8rem .2rem 0;color:#efd4a9}.dtc-car-note{font-size:.72rem!important;color:#c3a982!important}@media(max-width:800px){.dtc-car-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:500px){.dtc-car-grid{grid-template-columns:1fr}}';document.head.append(style);
const keys=["make","model","year","fuel","engine","ps","gear"];
const make=$("dtc-car-make"),model=$("dtc-car-model");
const source={make:"dtc-car-make",model:"dtc-car-model",year:"dtc-car-year",fuel:"dtc-car-fuel",engine:"dtc-car-engine",ps:"dtc-car-ps",gear:"dtc-car-gear"};
for(let y=new Date().getFullYear()+1;y>=1950;y--)$("dtc-car-year").add(new Option(String(y),String(y)));
const fill=(node,values)=>{node.replaceChildren();values.forEach(v=>node.append(new Option(v,v)));};
function fillMakes(){fill($("dtc-car-makes"),finder.brands().sort((a,b)=>a.localeCompare(b,'de')));}
function fillModels(){const raw=make.value.trim();const maybe=finder.match(raw);const brand=finder.brands().find(x=>x.toLowerCase()===raw.toLowerCase())||maybe?.brand||raw;fill($("dtc-car-models"),finder.models(brand));}
function updateText(){
 $("dtc-car-head").textContent=t("headline");$("dtc-car-help").textContent=t("help");$("dtc-car-note").textContent=t("all");$("dtc-car-save").textContent=t("find");
 keys.forEach(k=>wrap.querySelector('[data-dtc-label="'+k+'"]').textContent=t(k));
 make.placeholder=t("makePlaceholder");model.placeholder=t("modelPlaceholder");
}
function p(){const v=new URLSearchParams();keys.forEach(k=>{const s=$(source[k]).value.trim();if(s)v.set(({make:"brand",model:"model",year:"year",fuel:"powertrain",engine:"engine",ps:"ps",gear:"gearbox"})[k],s);});return v;}
function show(){
 const brand=make.value.trim(),car=model.value.trim();
 if(!brand||!car){$("dtc-car-result").textContent=t("none");return;}
 const sel=p(),txt=t("saved")+": "+brand+" "+car, r=$("dtc-car-result");r.replaceChildren();
 const heading=document.createElement("strong");heading.textContent=txt;r.append(heading,document.createElement("br"));
 for(const [key,label] of [["/fahrzeug/?"+sel,t("guide")],["/?"+sel+"#aracin",t("stage")]]){const a=document.createElement("a");a.href=key;a.textContent=label+" →";r.append(a);}
 try{sessionStorage.setItem("6006-vehicle-choice",JSON.stringify({brand,model:car,...Object.fromEntries(sel.entries())}));}catch(_){}
 const dtcFilter=$("brand"),matching=[...dtcFilter.options].find(o=>o.value===brand.toUpperCase());
 if(matching&&dtcFilter.value!==matching.value){dtcFilter.value=matching.value;dtcFilter.dispatchEvent(new Event("change",{bubbles:true}));}
}
make.addEventListener("input",fillModels);
make.addEventListener("change",()=>{
 const m=finder.match(make.value)?.brand||make.value.trim();
 finder.loadModels(m).then(fillModels);fillModels();
});
window.addEventListener("6006-makes-ready",fillMakes);
window.addEventListener("6006-models-ready",fillModels);
$("dtc-car-form").addEventListener("submit",e=>{e.preventDefault();show();});
let initial={};try{initial=JSON.parse(sessionStorage.getItem("6006-vehicle-choice")||"{}");}catch(_){}
const q=new URLSearchParams(location.search);
for(const k of keys){const property={make:"brand",model:"model",year:"year",fuel:"powertrain",engine:"engine",ps:"ps",gear:"gearbox"}[k];const value=q.get(property)||initial[property]||"";if(value)$(source[k]).value=value;}
fillMakes();fillModels();updateText();
if(make.value&&model.value)show();
new MutationObserver(updateText).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();