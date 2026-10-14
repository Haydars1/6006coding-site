(()=>{
"use strict";
// Progressive enhancement: all source references are present in initial HTML,
// and remain visible if JavaScript is disabled or fails.
const root=document.querySelector(".stage-hub"),nav=root?.querySelector(".stage-makes");
if(!root||!nav||document.getElementById("stage-seo-filter"))return;
const toolbar=document.createElement("section");
toolbar.className="stage-filter";
toolbar.id="stage-seo-filter";
const heading=document.createElement("h2");
heading.textContent="Motor- und Markenreferenzen suchen";
const label=document.createElement("label");
label.htmlFor="stage-seo-search";
label.textContent="Marke, Modell oder Motorbezeichnung";
const input=document.createElement("input");
input.id="stage-seo-search";
input.type="search";
input.placeholder="z. B. Jeep Renegade, Subaru, 2.0 Boxer";
input.setAttribute("aria-describedby","stage-seo-count");
input.maxLength=100;
input.autocomplete="off";
const reset=document.createElement("button");
reset.type="button";
reset.textContent="Suche löschen";
const count=document.createElement("p");
count.id="stage-seo-count";
count.setAttribute("role","status");
count.setAttribute("aria-live","polite");
const controls=document.createElement("div");
controls.className="stage-filter-controls";
controls.append(input,reset);
const extra=document.createElement("div");
extra.className="stage-filter-extra";
function field(name,id,control){
 const wrap=document.createElement("div"),caption=document.createElement("label");
 caption.htmlFor=id;caption.textContent=name;control.id=id;wrap.append(caption,control);return wrap;
}
const year=document.createElement("input");
year.type="number";year.min="1950";year.max="2035";year.inputMode="numeric";year.placeholder="z. B. 2018";
const fuel=document.createElement("select");
for(const [value,title] of [["","Alle Kraftstoffarten"],["Benzin","Benzin"],["Diesel","Diesel"],["Hybrid","Hybrid"]]){
 const option=document.createElement("option");option.value=value;option.textContent=title;fuel.append(option);
}
extra.append(field("Baujahr", "stage-seo-year",year),field("Kraftstoff","stage-seo-fuel",fuel));
toolbar.append(heading,label,controls,extra,count);
nav.insertAdjacentElement("beforebegin",toolbar);
const sections=[...root.querySelectorAll(".stage-brand")];
const cards=sections.flatMap(section=>[...section.querySelectorAll(".stage-item")]);
function normalize(value){return String(value||"").toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").trim();}
function run(){
 const q=normalize(input.value),tokens=q.split(/\s+/).filter(Boolean);
 const selectedYear=year.value.trim(),y=Number(selectedYear);
 const yearValid=!selectedYear||(Number.isInteger(y)&&y>=1950&&y<=2035);
 let total=0,brands=0;
 for(const section of sections){
  let visible=0;
  for(const card of section.querySelectorAll(".stage-item")){
   const text=normalize(card.textContent);
   const from=Number(card.dataset.yearFrom),to=Number(card.dataset.yearTo);
   const ok=yearValid&&tokens.every(token=>text.includes(token))
     &&(!selectedYear||(y>=from&&y<=to))
     &&(!fuel.value||card.dataset.fuel===fuel.value);
   card.hidden=!ok;
   if(ok){total++;visible++;}
  }
  section.hidden=visible===0;
  if(visible)brands++;
 }
 count.textContent=total+" Motorreferenzen aus "+brands+" Marken"
   +(!yearValid?" – ungültiges Baujahr (1950–2035).":total===0?" – keine Treffer. Andere Marke, Baujahr oder Kraftstoffart versuchen.":"");
 reset.disabled=!q&&!selectedYear&&!fuel.value;
}
input.addEventListener("input",run);
input.addEventListener("search",run);
year.addEventListener("input",run);
fuel.addEventListener("change",run);
reset.addEventListener("click",()=>{input.value="";year.value="";fuel.value="";run();input.focus();});
nav.addEventListener("click",event=>{
 const target=event.target.closest("a[href^='#marke-']");
 if(!target)return;
 if(input.value||year.value||fuel.value){input.value="";year.value="";fuel.value="";run();}
});
run();
})();