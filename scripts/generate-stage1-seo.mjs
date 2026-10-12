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
const vehicleLink=r=>"/fahrzeug/?"+new URLSearchParams({brand:r.make,model:r.model,year:String(r.yearFrom),powertrain:r.fuel}).toString();
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
 return '<article id="ref-'+safe(r.id)+'" class="stage-item">'
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
fs.writeFileSync(path.join(ROOT,"assets","6006-stage1-seo.css"),css,"utf8");
const sitemap=path.join(ROOT,"sitemap.xml"),xml=fs.readFileSync(sitemap,"utf8");
const tag="<loc>"+canonical+"</loc>";
assert(xml.includes("</urlset>"),"Missing DTC sitemap base");
assert(!xml.includes(tag),"Stage-1 SEO URL already added before its generation step");
fs.writeFileSync(sitemap,xml.replace("</urlset>","  <url>"+tag+"</url>\n</urlset>"),"utf8");
const meta={route:URL_PATH,entryCount:rows.length,brandCount:makeNames.length,sourceCount:urlSet.size,indexablePages:1,disclaimer:"Third-party published examples only; not tuning map or guarantee"};
fs.writeFileSync(path.join(ROOT,"assets","6006-stage1-seo-summary.json"),JSON.stringify(meta,null,2)+"\n");
console.log("STAGE 1 SEO: "+rows.length+" crawlable source-linked examples across "+makeNames.length+" makes on 1 indexable hub");
