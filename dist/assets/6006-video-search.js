(()=>{"use strict";
const input=document.getElementById("q"),bar=input&&input.closest(".searchrow"),hero=document.querySelector("main .hero");
if(!input||!bar||!hero||document.getElementById("dtc-video-suggest"))return;
const words={
tr:{head:"Arıza kodunu gir, nedenini öğren",common:"Sık aranan kodlar",hint:"↑ ↓ seç · Enter aç · Esc kapat",browse:"KOD ARA",none:"Eşleşen kod yok. Başka kod veya belirti dene.",loading:"Arıza kataloğu yükleniyor…",failed:"Katalog yüklenemedi; normal aramayı kullanabilirsin.",groups:[["Motor ve şanzıman","Powertrain"],["Kaporta ve konfor","Body"],["Fren, şasi ve süspansiyon","Chassis"],["Haberleşme ağı","Network"]]},
de:{head:"Fehlercode eingeben, Ursache verstehen",common:"Häufig gesuchte Codes",hint:"↑ ↓ wählen · Enter öffnen · Esc schließen",browse:"SCHNELLSUCHE",none:"Keine Treffer. Code oder Symptom anders eingeben.",loading:"Fehlercode-Katalog wird geladen…",failed:"Katalog nicht verfügbar. Normale Suche verwenden.",groups:[["Motor und Getriebe","Powertrain"],["Karosserie und Komfort","Body"],["Bremsen, Fahrwerk, Lenkung","Chassis"],["Steuergeräte und Netzwerk","Network"]]},
en:{head:"Enter a fault code, understand the cause",common:"Popular fault codes",hint:"↑ ↓ select · Enter open · Esc close",browse:"INSTANT SEARCH",none:"No results. Try another code or symptom.",loading:"Loading fault code catalog…",failed:"Catalog unavailable. Normal search still works.",groups:[["Engine and transmission","Powertrain"],["Body and comfort","Body"],["Brakes and chassis","Chassis"],["Communication network","Network"]]}
};
const locale=()=>{const l=(document.documentElement.lang||"").slice(0,2).toLowerCase();return words[l]?l:"tr";};
const create=(tag,cls)=>{const node=document.createElement(tag);if(cls)node.className=cls;return node;};
const wrapper=create("section","dtc-video-categories");wrapper.setAttribute("aria-label","OBD-II DTC Categories");
const heading=create("h2");wrapper.append(heading);
const grid=create("div","dtc-video-category-grid");wrapper.append(grid);
const groups=["P","B","C","U"],popCodes=["P0420","P0335","C0035","P0299","P0401","P2002"];
const links=groups.map((code,i)=>{const a=create("a","dtc-video-category");a.href="/fehlercodes/?family="+code;a.setAttribute("aria-label",code);const marker=create("strong");marker.textContent=code;const labels=create("span");labels.append(create("b"),create("small"));a.append(marker,labels);grid.append(a);return a;});
const popular=create("div","dtc-video-popular");const popularTitle=create("span");popular.append(popularTitle);popCodes.forEach(code=>{const a=create("a");a.href="/fehlercodes/?code="+code;a.textContent=code;popular.append(a);});wrapper.append(popular);
hero.insertAdjacentElement("afterend",wrapper);
const popup=create("div");popup.id="dtc-video-suggest";popup.setAttribute("role","listbox");popup.setAttribute("aria-label","DTC suggestions");popup.hidden=true;bar.append(popup);
input.setAttribute("aria-haspopup","listbox");input.setAttribute("aria-controls",popup.id);input.setAttribute("aria-expanded","false");
let defs=null,loader=null,seq=0,chosen=-1,options=[],debounce=0;
function labels(){const w=words[locale()];heading.textContent=w.head;popularTitle.textContent=w.common+":";
links.forEach((a,i)=>{const g=w.groups[i];a.setAttribute("aria-label",groups[i]+" "+g[0]);a.querySelector("b").textContent=g[0];a.querySelector("small").textContent=g[1];});
}
labels();
new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
function norm(value){return String(value||"").toLocaleLowerCase("en").replace(/[ıİ]/g,"i").normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function catalog(){if(window.DTCSearch6006)return window.DTCSearch6006.ready.then(ok=>{if(!ok)throw Error("Catalog unavailable");return window.DTCSearch6006;});if(defs)return Promise.resolve(defs);if(!loader)loader=fetch("/assets/6006-dtc-catalog.json",{cache:"force-cache"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json();}).then(data=>{if(!Array.isArray(data.defs))throw Error("Missing DTC definitions");return defs=data.defs;}).catch(e=>{loader=null;throw e;});return loader;}
function state(open){popup.hidden=!open;input.setAttribute("aria-expanded",String(open));if(!open){options=[];chosen=-1;input.removeAttribute("aria-activedescendant");}}
function linkTo(row){const filters=window.DTCSearch6006?.filters?.()||{},params=new URLSearchParams({code:row[0]});const make=filters.brand&&filters.brand!=="ALL"?filters.brand:row[1]!=="GENERIC"?row[1]:"";if(make)params.set("brand",make);if(filters.family&&filters.family!=="all")params.set("family",filters.family);if(filters.category&&filters.category!=="all")params.set("category",filters.category);return "/fehlercodes/?"+params.toString();}
const synonyms={krank:"crankshaft|crank",kurbel:"crankshaft|crank",nocken:"camshaft",eksantrik:"camshaft",abs:"abs|wheel speed|brake",fren:"brake|abs|wheel speed",turbo:"turbo|boost|supercharg",dpf:"particulate|soot|diesel filter|regenerat",adblue:"reductant|nox|scr|urea",egr:"exhaust gas recirculation|egr",agr:"exhaust gas recirculation|egr",yakit:"fuel|injector|rail",sanziman:"transmission|gear|shift",atesleme:"ignition|misfire|spark",katalizor:"catalyst|catalytic",sogutma:"coolant|cooling|temperature",airbag:"airbag|restraint|srs",steuergerat:"module|ecu|ecm|control unit"};
function findRows(query){
if(window.DTCSearch6006){const seen=new Set();return window.DTCSearch6006.findRows(query).filter(row=>{if(seen.has(row[0]))return false;seen.add(row[0]);return true;}).slice(0,9);}
const q=norm(query).trim(),wanted=q.toUpperCase(),brand=document.getElementById("brand")?.value||"ALL",matches=[],seen=new Set();
const sy=synonyms[q],regex=sy?new RegExp(sy,"i"):null;
for(const row of defs){if(!Array.isArray(row)||row.length<3)continue;const code=String(row[0]),make=String(row[1]),description=String(row[2]);const desc=norm(description),codeText=norm(code);
const family=document.getElementById("group")?.value||"all";if(brand!=="ALL"&&make!==brand&&make!=="GENERIC")continue;if(family!=="all"&&code[0]!==family)continue;
let weight=0;if(code.toUpperCase()===wanted)weight=100;else if(codeText.startsWith(q))weight=90;else if(codeText.includes(q)&&q.length>1)weight=70;else if(q.length>1&&((desc.includes(q)&&(q!=="dpf"||/\bdpf\b/i.test(description)))||norm(make).includes(q)))weight=40;else if(regex?.test(description))weight=30;
if(weight){weight+=(make===brand?7:make==="GENERIC"?5:0);matches.push({row,weight});}
}
matches.sort((a,b)=>b.weight-a.weight||String(a.row[0]).localeCompare(String(b.row[0])));
const out=[];for(const entry of matches){const code=entry.row[0];if(seen.has(code))continue;seen.add(code);out.push(entry.row);if(out.length>=9)break;}return out;
}
function draw(rows,message){popup.replaceChildren();const w=words[locale()],head=create("div","dtc-video-suggest-head");head.append(document.createTextNode(w.browse));const help=create("span","dtc-video-suggest-help");help.textContent=w.hint;head.append(help);popup.append(head);options=[];chosen=-1;
if(message){const p=create("div","dtc-video-nothing");p.textContent=message;popup.append(p);state(true);return;}
if(!rows.length){const p=create("div","dtc-video-nothing");p.textContent=w.none;popup.append(p);state(true);return;}
rows.forEach((row,index)=>{const link=create("a","dtc-video-option");link.href=linkTo(row);link.id="dtc-vopt-"+index;link.setAttribute("role","option");link.setAttribute("aria-selected","false");const code=create("strong");code.textContent=row[0];const description=create("span");description.textContent=row[2];const maker=create("small");maker.textContent=row[1]==="GENERIC"?"OBD-II":row[1];link.append(code,description,maker);popup.append(link);options.push(link);});
state(true);
}
function current(){return String(input.value||"").trim();}
function show(){const key=++seq,q=current();draw([],words[locale()].loading);catalog().then(()=>{if(key!==seq||document.activeElement!==input)return;draw(findRows(q),null);}).catch(()=>{if(key===seq&&document.activeElement===input)draw([],words[locale()].failed);});}
input.addEventListener("focus",show);
input.addEventListener("input",()=>{clearTimeout(debounce);debounce=setTimeout(show,110);});
input.addEventListener("keydown",e=>{if(popup.hidden)return;
if(e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();state(false);return;}
if(e.key==="ArrowDown"||e.key==="ArrowUp"){if(!options.length)return;e.preventDefault();e.stopImmediatePropagation();chosen=(chosen+(e.key==="ArrowDown"?1:-1)+options.length)%options.length;options.forEach((o,i)=>{o.classList.toggle("is-active",i===chosen);o.setAttribute("aria-selected",String(i===chosen));});input.setAttribute("aria-activedescendant",options[chosen].id);options[chosen].scrollIntoView({block:"nearest"});return;}
if(e.key==="Enter"&&chosen>=0&&options[chosen]){e.preventDefault();e.stopImmediatePropagation();location.assign(options[chosen].href);}
},true);
popup.addEventListener("pointerdown",e=>{if(e.target.closest("a"))return;e.preventDefault();});
document.addEventListener("pointerdown",e=>{if(!bar.contains(e.target))state(false);});
document.addEventListener("keydown",e=>{if(e.key==="Escape")state(false);});
document.getElementById("lang")?.addEventListener("change",()=>{labels();if(!popup.hidden&&(defs||window.DTCSearch6006))draw(findRows(current()),null);});
window.addEventListener("pagehide",()=>{clearTimeout(debounce);});
})();
