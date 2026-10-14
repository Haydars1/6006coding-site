// Generate one crawlable German Stage-1 reference hub from the same 6006 engine dataset
// used by the vehicle selector. Not 38 near-identical landing pages.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const BASE="https://6006coding.de";
const ROOT="dist";
const URL_PATH="/stage1-referenzen/";
const DATA=JSON.parse(fs.readFileSync(path.join(ROOT,"assets/6006-stage1-references.json"),"utf8"));
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rows=DATA.examples;
const OPEN_INDEX=JSON.parse(fs.readFileSync(path.join(ROOT,"assets/vehicle-data/index.json"),"utf8"));
assert(Number.isInteger(OPEN_INDEX.totalEngines)&&OPEN_INDEX.totalEngines>0,"Open motor index missing");
assert(Array.isArray(OPEN_INDEX.makes)&&OPEN_INDEX.makes.length>0,"Open makes index missing");
assert.equal(DATA.schemaVersion,1);
assert(rows.length>=38,"Stage-1 hub must be generated from current source catalogue");
const uniqueIds=new Set(),urlSet=new Set();
for(const r of rows){
 assert(r.classification==="third-party-advertised","Third-party designation missing");
 assert(/^[a-z0-9-]+$/.test(r.id)&&!uniqueIds.has(r.id),"Duplicate or unsafe source ID: "+r.id);
 assert(/^(https:\/\/)[a-z0-9.-]+\/\S+$/i.test(r.sourceUrl),"Invalid external source");
 assert(!urlSet.has(r.sourceUrl),"Duplicate source URL "+r.id);
 assert(Number.isInteger(r.yearFrom)&&Number.isInteger(r.yearTo)&&r.yearFrom<=r.yearTo,"Invalid model year");
 assert(["Benzin","Diesel","Hybrid"].includes(r.fuel),"Unknown fuel type");
 for(const field of ["publishedStockPs","publishedStockNm","publishedStage1Ps","publishedStage1Nm"]){
  assert(Number.isInteger(r[field])&&r[field]>0&&r[field]<2000,"Invalid published engine spec: "+field);
 }
 uniqueIds.add(r.id);urlSet.add(r.sourceUrl);
}
const makeNames=[...new Set(rows.map(r=>r.make))].sort((a,b)=>a.localeCompare(b,"de"));
const dataByMake=new Map(makeNames.map(make=>[make,rows.filter(r=>r.make===make).sort((a,b)=>a.model.localeCompare(b.model,"de")||a.yearFrom-b.yearFrom)]));
const engineLabel=r=>(r.manualEngineContains||r.enginePrefix||"Motorvariante");
const fuelLabel=r=>r.fuel==="Benzin"?"Benzin":r.fuel==="Diesel"?"Diesel":"Hybrid – Antriebsart prüfen";
const vehicleLink=r=>"/fahrzeug/?"+new URLSearchParams({brand:r.make,model:r.model,year:String(r.yearFrom),powertrain:r.fuel,stageRef:r.id}).toString();
const sourceLabel=r=>safe(r.publisher);
const menu=makeNames.map(make=>'<a href="#marke-'+makeNames.indexOf(make)+'">'+safe(make)+' <span>'+dataByMake.get(make).length+'</span></a>').join("\n");
const cards=makeNames.map((make,idx)=>{
 const list=dataByMake.get(make);
 const articles=list.map(r=>{
 const name=safe(r.make+" "+r.model);
 const modelRange=r.yearFrom===r.yearTo?String(r.yearFrom):(r.yearFrom+"–"+r.yearTo);
 const engine=safe(engineLabel(r));
 const original=r.publishedStockPs+" PS / "+r.publishedStockNm+" Nm";
 const advertised=r.publishedStage1Ps+" PS / "+r.publishedStage1Nm+" Nm";
 const manual=r.manualOnly?
  '<p class="data-warning"><strong>Zusätzliche Prüfung:</strong> Motorkennung und Serienleistung wurden nicht sicher mit dem offenen Fahrzeugkatalog abgeglichen. Vor einer Anfrage bitte in den Fahrzeugunterlagen bestätigen.</p>':
  '<p class="data-warning">Motor, Modellgeneration und Serienwerte müssen mit Ihrem konkreten Fahrzeug und Steuergerät übereinstimmen.</p>';
 const waMessage="Guten Tag 6006 Performance, bitte prüfen Sie die Stage-1-Eignung meines Fahrzeugs.\n"
 + "Fahrzeug: "+r.make+" "+r.model+"\nReferenz-Baujahre: "+modelRange+"\nMotor-/Quellbezeichnung: "+engineLabel(r)
 + "\nReferenz-Serienleistung: "+original+"\nReferenz: "+r.publisher+"\n"
 + "Motorcode / Steuergerät / Getriebe / tatsächliches Baujahr: (bitte ergänzen)\n"
 + "Ich möchte ein individuelles Angebot nach technischer und rechtlicher Prüfung.";
 return '<article id="ref-'+safe(r.id)+'" class="stage-item" data-year-from="'+r.yearFrom+'" data-year-to="'+r.yearTo+'" data-fuel="'+safe(r.fuel)+'">'
  +'<h3>'+name+' – '+engine+'</h3>'
  +'<p class="stage-year">'+safe(modelRange)+' · '+safe(fuelLabel(r))+' · '+sourceLabel(r)+'</p>'
  +'<div class="stage-power"><div><span>Veröffentlichte Serie</span><strong>'+safe(original)+'</strong></div><div><span>Veröffentlichte Stage 1</span><strong>'+safe(advertised)+'</strong></div></div>'
  +manual
  +'<p class="stage-source">Quelle: <a href="'+safe(r.sourceUrl)+'" target="_blank" rel="noopener noreferrer">'+sourceLabel(r)+' · Originalveröffentlichung ansehen ↗</a></p>'
  +'<div class="stage-actions"><a href="'+safe(vehicleLink(r))+'">Fahrzeug und Motor prüfen →</a>'
  +'<a href="https://wa.me/491788354756?text='+encodeURIComponent(waMessage)+'" target="_blank" rel="noopener noreferrer">Individuelles Angebot anfragen →</a></div>'
  +'</article>';
 }).join("\n");
 return '<section id="marke-'+idx+'" class="stage-brand"><h2>'+safe(make)+' – veröffentlichte Stage-1-Beispiele <small>('+list.length+')</small></h2>'
 +'<p>Die aufgeführten Werte sind Angaben externer Anbieter. Die Eignung für ein bestimmtes Fahrzeug muss gesondert überprüft werden.</p><div class="stage-grid">'+articles+'</div></section>';
}).join("\n");

const title="Stage 1 Chiptuning: "+rows.length+" veröffentlichte Motorbeispiele | 6006 Performance";
const description="Stage-1-Referenzkatalog für "+makeNames.length+" Automarken: "+rows.length+" veröffentlichte Motorbeispiele mit originalen Leistungsangaben, Quellennachweis und individueller ECU-Anfrage.";
const canonical=BASE+URL_PATH;
const breadcrumbs={
 "@context":"https://schema.org",
 "@type":"BreadcrumbList",
 "itemListElement":[
 {"@type":"ListItem","position":1,"name":"6006 Performance","item":BASE+"/"},
 {"@type":"ListItem","position":2,"name":"Fahrzeugkatalog","item":BASE+"/fahrzeug/"},
 {"@type":"ListItem","position":3,"name":"Stage-1-Referenzen","item":canonical}
 ]
};
const pageSchema={
 "@context":"https://schema.org",
 "@type":"CollectionPage",
 "@id":canonical+"#webpage",
 "url":canonical,"name":title,"description":description,"inLanguage":"de-DE",
 "isPartOf":{"@id":BASE+"/#website"}
};
const html='<!doctype html><html lang="de"><head><meta charset="utf-8">'
 +'<meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<title>'+safe(title)+'</title><meta name="description" content="'+safe(description)+'">'
 +'<meta name="robots" content="index,follow,max-image-preview:large">'
 +'<link rel="canonical" href="'+canonical+'">'
 +'<meta name="theme-color" content="#171513">'
 +'<meta property="og:type" content="website">'
 +'<meta property="og:title" content="'+safe(title)+'">'
 +'<meta property="og:description" content="'+safe(description)+'">'
 +'<meta property="og:url" content="'+canonical+'">'
 +'<link rel="icon" href="/assets/6006-favicon.svg" type="image/svg+xml">'
 +'<link rel="stylesheet" href="/assets/6006-seo.css">'
 +'<link rel="stylesheet" href="/assets/6006-stage1-seo.css">'
 +'<script defer src="/assets/6006-stage1-open-engine-finder.js?v=20261012-full-engines"></script>'
 +'<script defer src="/assets/6006-stage1-seo-filter.js?v=20261012-62refs"></script>'
 +'<script type="application/ld+json">'+JSON.stringify(breadcrumbs)+'</script>'
 +'<script type="application/ld+json">'+JSON.stringify(pageSchema)+'</script></head>'
 +'<body><header class="bar"><a class="brand" href="/"><img src="/assets/6006-primary-white.png" alt="6006 Performance"></a><nav>'
 +'<a href="/">Startseite</a><a href="/fahrzeug/">Fahrzeuge &amp; Motoren</a><a href="/fehlercodes/">Fehlercodes</a><a href="/#iletisim">Kontakt</a></nav></header>'
 +'<main class="main stage-hub"><nav class="crumb"><a href="/">Start</a> / <a href="/fahrzeug/">Fahrzeugkatalog</a> / Stage 1 Referenzen</nav>'
 +'<span class="kicker">6006 PERFORMANCE · MOTOR- UND ECU-REFERENZEN</span>'
 +'<h1>Stage 1 Chiptuning: veröffentlichte Motorbeispiele nach Automarke</h1>'
 +'<p class="lead">'+rows.length+' veröffentlichte Beispiele aus '+makeNames.length+' Marken, mit Serienleistung, Anbieterangaben und direkten Quellen. Finden Sie Ihr Modell und lassen Sie die tatsächliche Eignung Ihres Fahrzeugs prüfen.</p>'
 +'<p class="stage-lead">Diese Übersicht dient dem technischen Vergleich. Sie ist weder eine Liste verfügbarer 6006-Performance-Kennfelder noch eine Leistungs- oder Zulassungsgarantie. Es handelt sich um öffentlich beworbene Ergebnisse Dritter.</p>'
 +'<div class="stage-cta"><a class="btn" href="/fahrzeug/">Mein Fahrzeug auswählen →</a><a class="btn outline" href="/fahrzeug/">Motor nicht gelistet? Melden →</a></div>'
 +'<section id="stage1-open-engine-finder" class="stage-open-finder" aria-label="Alle Motoren im offenen Katalog">'
 +'<h2>Offener Motorfinder: '+OPEN_INDEX.totalEngines.toLocaleString("de-DE")+' Motorvarianten für '+OPEN_INDEX.makes.length+' Automarken</h2>'
 +'<p>Im offenen Referenzbestand stehen '+OPEN_INDEX.totalModels.toLocaleString("de-DE")+' Modelle und '+OPEN_INDEX.totalEngines.toLocaleString("de-DE")+' Motorvarianten. <strong>Das sind keine '+rows.length+' geprüften Tuning-Kennfelder:</strong> Für die meisten Modelle gibt es hier bewusst keine Leistungssteigerung. Sie können trotzdem Ihre Motorvariante finden und die ECU-Prüfung anfragen.</p>'
 +'<p class="stage-open-note">Die Daten stammen aus einem offenen Community-Fahrzeugbestand (ODbL-1.0; Quelle: <a href="https://github.com/gor3a/vehicle-makes-models" rel="noopener noreferrer" target="_blank">Fahrzeugdatensatz</a>). Sie sind nicht durch den Fahrzeughersteller bestätigt; Baujahr, Motorcode, Getriebe, ECU und Leistung müssen am Fahrzeug geprüft werden.</p>'
 +'<div class="stage-open-controls" role="search">'
 +'<div><label for="stage1-open-brand">Automarke</label><select id="stage1-open-brand" aria-label="Automarke im offenen Motorbestand"><option value="">Motorbestand wird geladen …</option></select></div>'
 +'<div><label for="stage1-open-model-filter">Modellname eingrenzen</label><input id="stage1-open-model-filter" type="search" placeholder="Golf, E-Klasse, 320d …" maxlength="80"></div>'
 +'<div><label for="stage1-open-model">Modell</label><select id="stage1-open-model"><option value="">Alle Modelle</option></select></div>'
 +'<div><label for="stage1-open-year">Baujahr (optional)</label><input type="number" id="stage1-open-year" min="1950" max="2035" inputmode="numeric" placeholder="z. B. 2019"></div>'
 +'<div><label for="stage1-open-fuel">Kraftstoff</label><select id="stage1-open-fuel"><option value="">Alle Kraftstoffarten</option><option value="Diesel">Diesel</option><option value="Benzin">Benzin</option><option value="Hybrid">Hybrid</option><option value="PHEV">Plug-in-Hybrid</option><option value="Electric">Elektro</option></select></div>'
 +'<div><label for="stage1-open-term">Motor, Leistung oder Getriebe suchen</label><input id="stage1-open-term" type="search" placeholder="TDI, 150 HP, 6MT, N47 …" maxlength="100"></div>'
 +'</div>'
 +'<p id="stage1-open-meta" class="stage-open-count">'+OPEN_INDEX.makes.length+' Marken · '+OPEN_INDEX.totalModels.toLocaleString("de-DE")+' Modelle · '+OPEN_INDEX.totalEngines.toLocaleString("de-DE")+' Motorreferenzen</p>'
 +'<p id="stage1-open-count" class="stage-open-count" role="status" aria-live="polite">Bitte eine Marke wählen, um Motorvarianten zu suchen.</p>'
 +'<div id="stage1-open-results" class="stage-open-results"></div>'
 +'<button id="stage1-open-more" type="button" hidden>Weitere Motoren anzeigen</button>'
 +'<p id="stage1-open-hint" class="stage-open-footer">Alle Angaben sind offene Referenzdaten, keine OEM-Bestätigung, kein Stage-1-Versprechen und keine Prüfung des konkreten Steuergeräts. <a href="/fahrzeug/">Zur individuellen Fahrzeugauswahl →</a></p>'
 +'</section>'
 +'<section class="stage-explainer"><h2>'+rows.length+' direkt verlinkte Drittanbieterbeispiele – nicht der vollständige Motorbestand</h2><p>Die folgenden veröffentlichten Chiptuning-Beispiele sind eine gesonderte, quellengebundene Auswahl. Motorvarianten ohne solche Quellen bleiben dennoch über den offenen Motorfinder auswählbar.</p></section>'
 +'<section class="stage-explainer"><h2>So prüfen Sie eine Stage-1-Angabe richtig</h2>'
 +'<p>Ein gleicher Modellname genügt nicht. Entscheidend sind <strong>Baujahr, Baureihe, Motorkennung, Getriebe, ECU-Hardware und Softwarestand</strong>. Aus einem öffentlichen Leistungsdiagramm oder einer Tuninganzeige lässt sich die tatsächliche Eignung Ihres Fahrzeugs nicht sicher ableiten. Deshalb sind die folgenden Zahlen ausschließlich als veröffentlichte Vergleichswerte gekennzeichnet.</p>'
 +'<ol><li><strong>Motorvariante bestimmen:</strong> Modellgeneration und Motorcode aus den Fahrzeugunterlagen bzw. aus einer sicheren ECU-Auslesung abgleichen.</li>'
 +'<li><strong>Serienwerte einordnen:</strong> PS, HP und Nm nicht vermischen; Hybrid-Systemleistung nicht mit Verbrennerleistung gleichsetzen.</li>'
 +'<li><strong>Zustand vor Optimierung prüfen:</strong> Fehlerspeicher, relevante Messwerte, Wartung, Getriebe und Motormechanik beurteilen.</li>'
 +'<li><strong>Zulässigkeit klären:</strong> Vor dem Einsatz auf öffentlichen Straßen in Deutschland erforderliche Gutachten, Eintragung, Versicherung und Abgasvorschriften prüfen.</li></ol>'
 +'<p>Auch wenn ein Drittanbieter hohe Leistungssteigerungen bewirbt, stellen diese Zahlen weder eine individuelle Motorbelastungsgrenze noch eine zugesicherte Motorleistung dar. 6006 Performance erstellt ein Angebot erst nach Einordnung der tatsächlichen Fahrzeugvariante.</p></section>'
 +'<nav class="stage-makes" aria-label="Automarken im Referenzkatalog"><h2>Automarke auswählen</h2><div>'+menu+'</div></nav>'
 +cards
 +'<section class="stage-explainer"><h2>Häufige Fragen zu Stage 1 und Motorreferenzen</h2>'
 +'<h3>Gilt die veröffentlichte Leistung für jedes Fahrzeug mit gleichem Modellnamen?</h3><p>Nein. Motorkennung, ECU-Version, Getriebe, Abgasnorm und der technische Zustand können sich unterscheiden. Die passende Kalibrierung muss einzeln geprüft werden.</p>'
 +'<h3>Warum erscheinen für manche Motoren keine Stage-1-Werte?</h3><p>Für viele Motoren liegen keine belastbar zugeordneten Referenzen vor. Der allgemeine Fahrzeugkatalog enthält deshalb ausdrücklich keine pauschal berechneten Stage-1-Leistungen. Sie können Ihren Motor trotzdem <a href="/fahrzeug/">zur individuellen Beurteilung melden</a>.</p>'
 +'<h3>Sind die hier aufgeführten Beispiele TÜV-geprüft oder garantiert?</h3><p>Nein. Die Quellen nennen öffentlich beworbene Werte fremder Anbieter. Eine deutsche Straßenverkehrszulassung oder eine Garantie von 6006 Performance folgt daraus nicht.</p>'
 +'<h3>Wie kann ich eine Anfrage für mein Fahrzeug stellen?</h3><p>Öffnen Sie den <a href="/fahrzeug/">Fahrzeugfinder</a>, wählen Sie die passende Motorvariante oder geben Sie Ihren Motorcode ein. Die Anfrage enthält die ausgewählten Fahrzeugdaten und kann erst nach Ihrer Bestätigung über WhatsApp oder E-Mail versendet werden.</p>'
 +'</section><nav class="bottomnav"><a href="/fahrzeug/">← Fahrzeugkatalog</a><a href="/fehlercodes/">Fehlercodes prüfen →</a></nav></main>'
 +'<footer>© 2026 6006 Performance · Öffentliche Drittanbieterangaben, keine zugesicherte Kalibrierung und keine fahrzeugspezifische Freigabe.</footer></body></html>\n';
const css='.stage-hub{max-width:1100px}.stage-lead{color:#e8c9a1;max-width:860px}.stage-cta{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0 25px}.stage-explainer{margin-top:24px}.stage-explainer h3{font-size:1.05rem;color:#f2d6b1;margin:18px 0 6px}.stage-makes{border-top:1px solid #5c4834;padding:24px 0}.stage-makes>div{display:flex;flex-wrap:wrap;gap:8px}.stage-makes a{display:inline-flex;align-items:center;gap:8px;background:#30251a;border:1px solid #886642;color:#f3d2a0;padding:9px 12px;text-decoration:none;border-radius:6px;font-size:.85rem;min-height:42px}.stage-makes span{font-size:.72rem;color:#cab59a}.stage-brand h2{font-size:1.7rem;line-height:1.3}.stage-brand h2 small{font-size:.75rem;color:#ddc29f}.stage-brand>p{color:#cdbca9;font-size:.85rem}.stage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.stage-item{min-width:0;background:#272019;border:1px solid #695136;border-radius:9px;padding:16px;display:flex;flex-direction:column;scroll-margin-top:20px}.stage-item h3{font-size:1.09rem;color:#fae1bd;line-height:1.38;margin:0 0 9px;overflow-wrap:anywhere}.stage-year{color:#d8b788;font-size:.8rem;margin:0 0 12px}.stage-power{display:grid;grid-template-columns:1fr 1fr;gap:10px}.stage-power>div{min-width:0;padding:10px;background:#171512;border-radius:6px;border:1px solid #554431}.stage-power span{display:block;font-size:.71rem;color:#c5b49e;line-height:1.4}.stage-power strong{display:block;color:#f6e6cd;font-size:.95rem;margin-top:4px;overflow-wrap:anywhere}.data-warning{color:#d1c1ac;font-size:.77rem;line-height:1.6}.stage-source{font-size:.78rem;margin-top:6px}.stage-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:auto;padding-top:9px}.stage-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;flex:1;min-width:170px;background:#aa8355;color:#18130f;padding:9px 11px;border-radius:6px;font-size:.78rem;font-weight:700;text-decoration:none;text-align:center}.stage-actions a+ a{background:#2f251c;border:1px solid #9b754b;color:#efc895}.stage-actions a:hover,.stage-makes a:hover{filter:brightness(1.15)}.stage-brand{border-top:1px solid #56422f;padding:28px 0}.stage-brand>p{margin-top:0}.stage-item:target{outline:2px solid #e6b97d;outline-offset:2px}@media(max-width:700px){.stage-grid{grid-template-columns:1fr}.stage-cta{flex-direction:column}.stage-cta a{width:100%;text-align:center}.stage-item{padding:13px}.stage-power strong{font-size:.9rem}.stage-hub{padding:1.5rem 1rem 4rem}}\n';
const dest=path.join(ROOT,"stage1-referenzen","index.html");
fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.writeFileSync(dest,html,"utf8");
const filterCss='.stage-filter{margin:16px 0 24px;padding:18px;border:1px solid #806041;border-radius:9px;background:#262018}.stage-filter h2{font-size:1.16rem;margin:0 0 9px;color:#f6d5ab}.stage-filter label{display:block;font-size:.82rem;font-weight:700;color:#dcc6aa;margin-bottom:7px}.stage-filter-controls{display:flex;gap:9px}.stage-filter input{box-sizing:border-box;min-height:46px;min-width:0;flex:1;border:1px solid #886646;border-radius:6px;background:#15130f;color:#fff1db;font:500 16px/1.4 system-ui,sans-serif;padding:9px 12px}.stage-filter button{padding:8px 14px;min-height:44px;background:#d2a46e;color:#17130e;border:0;border-radius:6px;font-weight:750;cursor:pointer}.stage-filter button:disabled{opacity:.45;cursor:not-allowed}.stage-filter-extra{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}.stage-filter-extra>div{flex:1;min-width:160px}.stage-filter-extra input,.stage-filter-extra select{width:100%;min-height:46px;border:1px solid #886646;border-radius:6px;background:#15130f;color:#fff1db;font:500 16px/1.4 system-ui,sans-serif;padding:9px 12px;box-sizing:border-box}.stage-filter input:focus-visible,.stage-filter button:focus-visible{outline:2px solid #f0c591;outline-offset:2px}#stage-seo-count{font-size:.79rem;margin:12px 0 0;color:#e8c697}.stage-brand[hidden],.stage-item[hidden]{display:none!important}@media(max-width:650px){.stage-filter{padding:12px}.stage-filter-controls{flex-direction:column}.stage-filter button{width:100%}}';
const fullEngineCss='.stage-open-finder{margin:25px 0;border:1px solid #8d6b45;border-radius:12px;background:#211b16;padding:20px;color:#eddbc2}.stage-open-finder h2{font-size:1.45rem;line-height:1.35;margin:0 0 12px;color:#f6dbb9}.stage-open-finder p{font-size:.85rem;line-height:1.62;color:#d9c9b4}.stage-open-finder a{color:#f5c88c}.stage-open-note{border-left:3px solid #bb945c;padding-left:12px}.stage-open-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:20px 0 12px}.stage-open-controls>div{display:flex;flex-direction:column;gap:5px;min-width:0}.stage-open-controls label{font-size:.77rem;font-weight:730;color:#edcc9c}.stage-open-controls input,.stage-open-controls select{box-sizing:border-box;min-width:0;width:100%;height:44px;padding:9px 10px;border-radius:6px;border:1px solid #7c6244;background:#12110f;color:#fff0dd;font-size:16px}.stage-open-controls input:focus-visible,.stage-open-controls select:focus-visible,#stage1-open-more:focus-visible{outline:2px solid #f3bd7e;outline-offset:2px}.stage-open-count{font-size:.79rem;color:#efc68c;margin:10px 0}.stage-open-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.stage-open-engine{display:flex;flex-direction:column;min-width:0;padding:14px;border:1px solid #5f4c37;border-radius:9px;background:#161614}.stage-open-engine h3{font-size:.96rem;color:#f9ddbb;line-height:1.4;overflow-wrap:anywhere;margin:0 0 8px}.stage-open-engine p{margin:0 0 10px;font-size:.76rem}.stage-open-spec{font-weight:760;color:#f4dfc2!important}.stage-open-caution{color:#beab97!important}.stage-open-link{display:inline-flex;align-items:center;justify-content:center;text-align:center;min-height:44px;padding:10px 12px;border-radius:6px;background:#d6ab72;color:#17120e!important;text-decoration:none;font-size:.8rem;font-weight:800;margin-top:auto}.stage-open-link:hover{filter:brightness(1.09)}#stage1-open-more{display:block;margin:15px auto;min-height:44px;border-radius:6px;background:#d0a06b;color:#1a130c;border:0;padding:9px 19px;font-size:.85rem;font-weight:750;cursor:pointer}#stage1-open-more[hidden]{display:none!important}.stage-open-footer{border-top:1px solid #60503a;margin:16px 0 0;padding-top:12px}@media(max-width:780px){.stage-open-controls{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.stage-open-finder{padding:13px}.stage-open-controls,.stage-open-results{grid-template-columns:1fr}.stage-open-finder h2{font-size:1.22rem}}';
fs.writeFileSync(path.join(ROOT,"assets","6006-stage1-seo.css"),css+filterCss+fullEngineCss,"utf8");
const sitemap=path.join(ROOT,"sitemap.xml"),xml=fs.readFileSync(sitemap,"utf8");
const tag="<loc>"+canonical+"</loc>";
assert(xml.includes("</urlset>"),"Missing DTC sitemap base");
assert(!xml.includes(tag),"Stage-1 SEO URL already added before its generation step");
fs.writeFileSync(sitemap,xml.replace("</urlset>","  <url>"+tag+"</url>\n</urlset>"),"utf8");
const meta={route:URL_PATH,entryCount:rows.length,brandCount:makeNames.length,sourceCount:urlSet.size,indexablePages:1,disclaimer:"Third-party published examples only; not tuning map or guarantee"};
fs.writeFileSync(path.join(ROOT,"assets","6006-stage1-seo-summary.json"),JSON.stringify(meta,null,2)+"\n");
console.log("STAGE 1 SEO: "+rows.length+" crawlable source-linked examples across "+makeNames.length+" makes on 1 indexable hub");
