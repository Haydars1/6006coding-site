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
toolbar.append(heading,label,controls,count);
nav.insertAdjacentElement("beforebegin",toolbar);
const sections=[...root.querySelectorAll(".stage-brand")];
const cards=sections.flatMap(section=>[...section.querySelectorAll(".stage-item")]);
function normalize(value){return String(value||"").toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").trim();}
function run(){
 const q=normalize(input.value);
 let total=0,brands=0;
 for(const section of sections){
  let visible=0;
  for(const card of section.querySelectorAll(".stage-item")){
   const ok=!q||normalize(card.textContent).includes(q);
   card.hidden=!ok;
   if(ok){total++;visible++;}
  }
  section.hidden=visible===0;
  if(visible)brands++;
 }
 count.textContent=total+" Motorreferenzen aus "+brands+" Marken"
   +(total===0?" – keine Treffer. Andere Marke oder Motorkennung versuchen.":"");
 reset.disabled=!q;
}
input.addEventListener("input",run);
reset.addEventListener("click",()=>{input.value="";run();input.focus();});
nav.addEventListener("click",event=>{
 const target=event.target.closest("a[href^='#marke-']");
 if(!target)return;
 if(input.value){input.value="";run();}
});
run();
})();