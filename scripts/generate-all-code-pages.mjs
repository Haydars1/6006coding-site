// Publish a separate, directly accessible reference and triage page for every
// DTC that lacks a human-authored article. Manufacturer-specific descriptions
// are grouped under a single canonical code; no invented OEM values or fixes.
// This directory is a diagnostic reference, NOT thousands of fake repair guides.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import vm from "node:vm";

const root="dist", base="https://6006coding.de";
const defs=JSON.parse(fs.readFileSync(path.join(root,"assets/6006-dtc-catalog.json"),"utf8")).defs;
const curated=new Set(JSON.parse(fs.readFileSync(path.join(root,"assets/6006-curated-guides.json"),"utf8")).codes);
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,"assets/6006-dtc-intelligence.js"),"utf8"),sandbox,{timeout:3000});
const triage=sandbox.window.DTCIntelligence6006;
assert(triage?.explain,"The diagnostic subtype engine is missing");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const valid=/^[PBCU][0-9A-F]{4}$/;
const groups=new Map();
for(const row of defs){
 if(!Array.isArray(row)||row.length!==3||!valid.test(String(row[0])))continue;
 const [code,make,description]=row.map(s=>String(s||"").trim());
 if(!description)continue;
 if(!groups.has(code))groups.set(code,[]);
 groups.get(code).push({make:make||"GENERIC",description});
}
const codes=[...groups.keys()].sort();
const descClean=s=>s.replace(/\s+/g," ").trim();
const slug=code=>"/fehlercodes/"+code.toLowerCase()+"/";
const codeUrl=code=>curated.has(code)?"/fehlercodes/"+code.toLowerCase()+"/":slug(code);
const known = [
 {id:"turbo",re:/turbo|boost|charge air|wastegate|supercharg|underboost|overboost/i,title:"Ladedruck und Turbolader",why:"Undichtigkeit der Ladeluftstrecke, fehlerhafte Regelung, Stellglied oder Sensorabweichung.",check:"Ladedruck Soll/Ist unter gleichen Bedingungen vergleichen; Schläuche, Drucksensor und Ansteuerung je nach Motortyp prüfen."},
 {id:"dpf",re:/particulate|dpf|soot|diesel particulate/i,title:"Partikelfilter und Abgasanlage",why:"Beladung, gestörte Regeneration oder unplausible Differenzdruck- und Temperaturmessung.",check:"Differenzdruck, Beladungszustand, Temperaturwerte und Regenerationssperren zusammen prüfen; keine Zwangsregeneration ohne Eignung."},
 {id:"scr",re:/reductant|scr |nox |urea|adblue/i,title:"SCR, AdBlue und NOx",why:"Reduktionsmittelversorgung, Dosierung, Heizung, Sensormessung oder katalytische Wirkung.",check:"Begleitcodes, NOx-Signale, Temperatur und Dosierdruck gemäß Systemvariante prüfen; Emissionssystem instand setzen statt stilllegen."},
 {id:"egr",re:/egr|exhaust gas recircul/i,title:"Abgasrückführung",why:"AGR-Ventil, Rückführungskanäle, Stellungsgeber oder Luftmassenmessung.",check:"AGR-Soll/Ist und Luftmassendifferenz prüfen; Ansteuerung, Kanäle und mögliche Undichtigkeiten beurteilen."},
 {id:"inject",re:/inject|fuel rail|fuel pressure|fuel pump|fuel metering/i,title:"Kraftstoffsystem und Einspritzung",why:"Kraftstoffversorgung, Regler, elektrische Ansteuerung oder Drucksensor.",check:"Soll-/Ist-Kraftstoffdruck und elektrische Versorgung prüfen; an Hochdruckleitungen nur nach Herstellerverfahren arbeiten."},
 {id:"misfire",re:/misfire|ignition coil|combustion|cylinder #?[1-9]/i,title:"Verbrennung und Zündung",why:"Zündung, Kraftstoffdosierung, Gemischbildung oder mechanischer Zylinderzustand.",check:"Aussetzerzähler und zugehörige Betriebsbedingungen erfassen; Zündung, Einspritzung und Kompression bei Bedarf prüfen."},
 {id:"oxygen",re:/oxygen sensor|o2 sensor|lambda|catalyst/i,title:"Lambdaregelung und Katalysator",why:"Gemischstörung, Abgasleck, fehlerhafte Sondenmessung oder Katalysatorwirkung.",check:"Gemisch- und Misfire-Codes zuerst auswerten; Lambdasignale und Abgasdichtheit unter gültigen Bedingungen prüfen."},
 {id:"abs",re:/abs|brake|wheel speed|traction control|esp /i,title:"Bremsen, ABS und ESP",why:"Radgeschwindigkeitssensor, Spannungsversorgung, Hydraulik oder Signalverarbeitung.",check:"ABS-Modul separat auslesen und Raddrehzahlen vergleichen; Brems- und Stabilitätssysteme fachgerecht absichern."},
 {id:"steering",re:/steer|yaw rate|angle sensor|suspension|ride height/i,title:"Lenkung und Fahrwerk",why:"Stellmotor, Lenkwinkel- und Lagegeber, Mechanik oder elektrische Versorgung.",check:"Systemeigene Fehler und Live-Signale auslesen; sicherheitsrelevante Funktionen vor weiterer Fahrt prüfen lassen."},
 {id:"airbag",re:/airbag|srs|seat belt|pretensioner|restraint/i,title:"Airbag und Rückhaltesystem",why:"Sensorik, Steckverbindungen, Spannungsversorgung oder Rückhaltesteuergerät.",check:"SRS-Diagnose nur mit geeigneter Technik; pyrotechnische Kreise nicht mit herkömmlichem Multimeter prüfen."},
 {id:"trans",re:/transmission|gear|clutch|shift|torque converter/i,title:"Getriebe und Kupplung",why:"Steuergerätefehler, Sensorik, hydraulische Regelung oder mechanische Abweichung.",check:"Getriebesteuergerät und Untercodes auslesen; Getriebeöl, Drehzahlen und Druckwerte getriebespezifisch prüfen."},
 {id:"can",re:/communication|data bus|can |lost message|network/i,title:"Steuergeräte-Kommunikation",why:"Unterspannung, fehlende Modulversorgung oder gestörte Busverbindung.",check:"Fehlerhistorie aller Module sowie Batterie, Masse, Sicherungen und betroffene Netzwerkleitung prüfen."},
 {id:"temp",re:/temperature|coolant|thermostat|cooling|radiator/i,title:"Motorkühlung und Temperatur",why:"Temperaturgeber, Thermostat, Lüfteransteuerung oder Kühlmittelfluss.",check:"Kaltwert mit Umgebung vergleichen und Verlauf bei Warmlauf prüfen; heißen Kühlmittelkreis nicht öffnen."},
 {id:"oil",re:/oil pressure|lubrication|oil pump|oil level/i,title:"Öldruck und Schmierung",why:"Unzureichender realer Öldruck oder Messkreis-/Geberproblem.",check:"Bei Öldruckwarnung Motor sofort abstellen und den Druck gemäß Herstellervorgabe prüfen lassen."},
 {id:"body",re:/door|window|mirror|wiper|lamp|lighting|central locking|body control/i,title:"Karosserieelektronik",why:"Sicherung, Schalter, Kabelverbindung, Stellmotor oder Steuergerätekommunikation.",check:"Funktion und Betriebsbedingungen prüfen; Versorgung, Masse und Stellgliedstatus zielgerichtet auslesen."}
];
function systemFor(description,code){
 return known.find(x=>x.re.test(description)) || (
 code[0]==="B" ? known.find(x=>x.id==="body") :
 code[0]==="C" ? known.find(x=>x.id==="steering") :
 code[0]==="U" ? known.find(x=>x.id==="can") : null);
}
function list(items,ordered=false){
 const el=ordered?"ol":"ul";return "<"+el+">"+items.map(x=>"<li>"+esc(x)+"</li>").join("")+"</"+el+">";
}
function article(code,rows,prev,next){
 const sorted=[...rows].sort((a,b)=>(a.make==="GENERIC"?-1:b.make==="GENERIC"?1:0)||a.make.localeCompare(b.make,"de"));
 const main=sorted[0], desc=descClean(main.description), system=systemFor(desc,code);
 const classified=triage.explain(code,desc,main.make,"de");
 const family=classified.family, heading=system?.title||family;
 const snippet=(code+" Fehlercode: "+desc+". Bedeutung, Herstellerangaben und sichere erste Prüfschritte auf 6006 Performance.").slice(0,164);
 const url=base+slug(code);
 const uniqueRows=[...new Map(sorted.map(r=>[r.make+"\u0001"+r.description,r])).values()];
 const variants=uniqueRows.map(({make,description})=>{
   const link="/fehlercodes/?code="+encodeURIComponent(code)+(make==="GENERIC"?"":"&brand="+encodeURIComponent(make));
   return '<li><strong>'+esc(make==="GENERIC"?"OBD-II allgemein":make)+'</strong>: '+esc(description)+' <a href="'+link+'">Datensatz öffnen →</a></li>';
 }).join("\n");
 const checks=system?[system.check,...classified.checks]:classified.checks;
 const hypotheses=system?[system.why,...classified.causes]:classified.causes;
 const wa="https://wa.me/491788354756?text="+encodeURIComponent("Hallo 6006 Performance, ich möchte eine Diagnose zum Fehlercode "+code+".\nFahrzeugmarke / Modell:\nBaujahr / Motor:\nSymptome:\n");
 const canonical=slug(code);
 const crumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Start',item:base+'/'},{'@type':'ListItem',position:2,name:'Fehlercodes',item:base+'/fehlercodes/'},{'@type':'ListItem',position:3,name:code,item:url}]};
 const navigation='<div class="bottomnav"><a href="'+codeUrl(prev)+'">← '+esc(prev)+'</a><a href="/fehlercodes/verzeichnis/">Gesamtverzeichnis</a><a href="'+codeUrl(next)+'">'+esc(next)+' →</a></div>';
 return '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<title>'+esc(code)+' Fehlercode – Bedeutung und Diagnose | 6006 Performance</title>'
 +'<meta name="description" content="'+esc(snippet)+'"><meta name="robots" content="index,follow,max-image-preview:large">'
 +'<link rel="canonical" href="'+url+'"><meta name="theme-color" content="#1a1714">'
 +'<link rel="icon" href="/assets/6006-favicon.svg" type="image/svg+xml">'
 +'<link rel="stylesheet" href="/assets/6006-seo.css"><script type="application/ld+json">'+JSON.stringify(crumb)+'</script></head>'
 +'<body><header class="bar"><a class="brand" href="/"><img src="/assets/6006-primary-white.png" alt="6006 Performance"></a>'
 +'<nav><a href="/#hizmetler">Unsere Leistungen</a><a href="/fehlercodes/">Fehlercode-Suche</a><a href="/fehlercodes/loesungen/">Ausführliche Ratgeber</a><a href="/#iletisim">Kontakt</a></nav></header>'
 +'<main class="main"><nav class="crumb"><a href="/">6006 Performance</a> / <a href="/fehlercodes/verzeichnis/">DTC-Verzeichnis</a> / '+esc(code)+'</nav>'
 +'<article><span class="kicker">'+esc(family)+' · CODE-REFERENZ</span><h1>'+esc(code)+' Fehlercode: Was bedeutet er?</h1>'
 +'<p class="lead"><strong>'+esc(code)+'</strong>: '+esc(desc)+'.</p>'
 +'<p>Dieser Eintrag enthält die verfügbare Code-Definition und eine <strong>vorläufige Prüfrichtung</strong>. Ein bestimmtes Ersatzteil oder eine verbindliche Reparatur lässt sich aus der Nummer allein nicht ableiten.</p>'
 +'<div class="overview"><div><span>Fehlercode</span><strong>'+esc(code)+'</strong></div><div><span>System</span><strong>'+esc(heading)+'</strong></div><div><span>Datensätze</span><strong>'+rows.length+' Referenz'+(rows.length===1?'':'en')+'</strong></div></div>'
 +'<section><h2>Was bedeutet '+esc(code)+' bei unterschiedlichen Herstellern?</h2><p>Die genaue Formulierung kann je nach Hersteller, Steuergerät, Modelljahr und Untercode variieren. Vergleichen Sie die passenden Originalbezeichnungen:</p><ul>'+variants+'</ul></section>'
 +'<section><h2>Mögliche Ursache – womit sollte man beginnen?</h2><p>Die folgenden Ansätze ergeben sich aus dem benannten System ('+esc(heading)+') und der gemeldeten Fehlerart ('+esc(classified.classification)+'). Es sind <strong>keine nachgewiesenen Defekte</strong>.</p>'+list(hypotheses)+'</section>'
 +'<section><h2>Diagnose und Prüfablauf für '+esc(code)+'</h2><p>Vor Beginn Fahrzeugmarke, Motorcode, Steuergerät, Zusatzcode und Freeze-Frame auslesen. Danach ist eine erste Prüfreihenfolge möglich:</p>'+list(checks,true)+'</section>'
 +'<section class="notice"><h2>Wann nicht weiterfahren?</h2><p>'+esc(classified.safety)+'</p><p>Besonders bei Bremse, Airbag, Hochvolt und Kraftstoff-Hochdrucksystemen dürfen kritische Arbeiten nur qualifiziert und nach Herstelleranweisungen erfolgen.</p></section>'
 +'<section><h2>Wie wird '+esc(code)+' behoben?</h2><p>Der Code verschwindet dauerhaft erst, wenn die <strong>tatsächlich nachgewiesene Ursache</strong> beseitigt ist. Nach Reparatur Fehler löschen, definierte Betriebsbedingungen herstellen und erneut prüfen. Ohne Live-Daten, Schaltplan und fahrzeugspezifische Prüfwerte wäre eine konkrete Teileempfehlung unbegründet.</p><p><a class="btn" href="/fehlercodes/?code='+encodeURIComponent(code)+'">Code und Fahrzeuginformationen vergleichen →</a> <a class="btn outline" href="'+esc(wa)+'">Individuelle Diagnose anfragen →</a></p></section>'
 +'<section><h2>Wie hoch sind die Reparaturkosten?</h2><p>Die Kosten hängen von der bestätigten Ursache, benötigten Messungen, Fahrzeugausführung und eventuellen Ersatzteilen ab. Ein konkreter Preis allein anhand des Fehlercodes wäre unseriös. Geben Sie Marke, Modell, Baujahr, Motor und Symptome für eine Einschätzung an.</p></section>'
 +'<section class="notice"><h2>Hinweis zur Datenqualität</h2><p>Dies ist eine automatische Code-Referenz mit systembezogenen ersten Diagnosehilfen, keine einzeln geprüfte OEM-Reparaturanweisung. Herstellerdefinitionen stammen aus dem öffentlich lizenzierten DTC-Datensatz; Prüfgrenzen, Teilenummern und Kalibrierungen müssen am Fahrzeug überprüft werden. <a href="/fehlercodes/loesungen/">Unsere ausführlich recherchierten Anleitungen</a> sind gesondert gekennzeichnet.</p></section>'
 +'</article>'+navigation+'</main><footer>© 2026 6006 Performance · Datenquelle: Wal33D/dtc-database (MIT). Herstellerdaten können voneinander abweichen.</footer></body></html>';
}
const allUrls=[], stamp=new Date().toISOString().slice(0,10);
let generated=0;
for(let i=0;i<codes.length;i++){
 const code=codes[i];
 if(curated.has(code))continue;
 const file=path.join(root,"fehlercodes",code.toLowerCase(),"index.html");
 fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,article(code,groups.get(code),codes[(i+codes.length-1)%codes.length],codes[(i+1)%codes.length]),"utf8");
 allUrls.push(slug(code));
 generated++;
}
const sitemapPath=path.join(root,"sitemap.xml"), xml=fs.readFileSync(sitemapPath,"utf8");
assert(xml.includes("</urlset>"),"Missing base sitemap");
const appended=allUrls.filter(u=>!xml.includes("<loc>"+base+u+"</loc>")).map(u=>"  <url><loc>"+base+u+"</loc><lastmod>"+stamp+"</lastmod></url>").join("\n");
fs.writeFileSync(sitemapPath,xml.replace("</urlset>",appended+"\n</urlset>"),"utf8");
const summary={uniqueCodes:codes.length,manufacturerDefinitions:defs.length,curated:curated.size,generatedCodePages:generated,generatedSitemapUrls:allUrls.length,route:"/fehlercodes/{code}/",status:"Automatic per-code reference, not OEM repair manual"};
fs.writeFileSync(path.join(root,"assets","6006-all-dtc-pages.json"),JSON.stringify(summary,null,2)+"\n");
assert(codes.length===curated.size+generated,"Missing or duplicate code URLs");
console.log("DTC ALL-CODES: "+codes.length+" unique codes, "+generated+" code-reference pages, "+curated.size+" detailed guides, "+defs.length+" manufacturer definitions");
