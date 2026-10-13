// DTC pages reuse the single vehicle finder instead of duplicating its form.
(()=>{
"use strict";
const root=document.getElementById("vehicle-picker-dtc");if(!root)return;
const translations={
 tr:{heading:"Araç bilgisi",description:"Aracını bir kez seç. Aynı bilgiler arıza kodlarında, teknik sayfalarda ve Stage 1 incelemesinde kullanılır.",choose:"Araç seç veya değiştir",chosen:"Seçili araç"},
 de:{heading:"Fahrzeugprofil",description:"Fahrzeug einmal auswählen und für Fehlercodes, Technik und Stage 1 verwenden.",choose:"Fahrzeug wählen oder ändern",chosen:"Ausgewähltes Fahrzeug"},
 en:{heading:"Vehicle profile",description:"Choose your vehicle once for fault codes, technical information and Stage 1.",choose:"Choose or change vehicle",chosen:"Selected vehicle"}
};
function locale(){const l=(document.documentElement.lang||"").slice(0,2).toLowerCase();return translations[l]?l:"de";}
function profile(){try{return JSON.parse(sessionStorage.getItem("6006-vehicle-choice")||"null")}catch(_){return null}}
const title=document.createElement("h2"),desc=document.createElement("p"),selected=document.createElement("p"),link=document.createElement("a");
link.href="/fahrzeug/#vehicle-selector-6006";
link.className="dtc-vehicle-primary-link";
link.style.cssText="display:inline-flex;align-items:center;min-height:44px;padding:10px 16px;border:1px solid #b68d59;border-radius:6px;color:#f3d4ab;font-size:.9rem;font-weight:750;text-decoration:none";
root.replaceChildren(title,desc,selected,link);
function render(){const t=translations[locale()],v=profile();title.textContent=t.heading;desc.textContent=t.description;link.textContent=t.choose+" →";selected.textContent=v&&v.brand&&v.model?t.chosen+": "+[v.brand,v.model,v.year,v.engine].filter(Boolean).join(" · "):"";selected.hidden=!selected.textContent;}
render();
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
addEventListener("pageshow",render);
})();
