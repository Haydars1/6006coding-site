// DTC pages reuse the single vehicle finder instead of duplicating its form.
(()=>{
"use strict";
const root=document.getElementById("vehicle-picker-dtc");if(!root)return;
const translations={
 tr:{heading:"Araç bilgisi",description:"Aracını bir kez seç. Aynı bilgiler arıza kodlarında, teknik sayfalarda ve yazılım hizmetlerinde kullanılır.",choose:"Araç seç veya değiştir",chosen:"Seçili araç",filter:"Kod tanımı filtresi"},
 de:{heading:"Fahrzeugprofil",description:"Fahrzeug einmal auswählen und für Fehlercodes, Technik und Fahrzeugsoftware verwenden.",choose:"Fahrzeug wählen oder ändern",chosen:"Ausgewähltes Fahrzeug",filter:"Filter der Code-Definitionen"},
 en:{heading:"Vehicle profile",description:"Choose your vehicle once for fault codes, technical information and vehicle software services.",choose:"Choose or change vehicle",chosen:"Selected vehicle",filter:"Code-definition filter"}
};
function locale(){const l=(document.documentElement.lang||"").slice(0,2).toLowerCase();return translations[l]?l:"de";}
function profile(){try{return JSON.parse(sessionStorage.getItem("6006-vehicle-choice")||"null")}catch(_){return null}}
const title=document.createElement("h2"),desc=document.createElement("p"),selected=document.createElement("p"),filter=document.createElement("p"),note=document.createElement("p"),link=document.createElement("a");
filter.className="dtc-vehicle-filter";note.className="dtc-vehicle-note hint";note.setAttribute("role","status");
link.href="/fahrzeug/#vehicle-selector-6006";
link.className="dtc-vehicle-primary-link";
link.style.cssText="display:inline-flex;align-items:center;min-height:44px;padding:10px 16px;border:1px solid #b68d59;border-radius:6px;color:#f3d4ab;font-size:.9rem;font-weight:750;text-decoration:none";
root.replaceChildren(title,desc,selected,filter,note,link);
function render(){const t=translations[locale()],c=window.DTCSearch6006?.context?.(),v=c?.profile||profile();title.textContent=t.heading;desc.textContent=t.description;link.textContent=t.choose+" →";selected.textContent=c?.profileName?t.chosen+": "+c.profileName:v&&v.brand?t.chosen+": "+[v.brand,v.model,v.year,v.engine].filter(Boolean).join(" · "):"";selected.hidden=!selected.textContent;filter.textContent=c?t.filter+": "+c.filter:"";filter.hidden=!filter.textContent;note.textContent=c?.note||"";note.hidden=!note.textContent;}
render();
new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
addEventListener("pageshow",render);
document.addEventListener("6006:dtc-context",render);
window.DTCSearch6006?.ready?.then(render);
})();
