// Publish every licensed DTC definition as crawlable HTML in a paginated code directory.
// A definition is not a verified diagnostic procedure. Only curated articles claim
// code-specific symptoms or test steps. Do not create 18k thin 'repair' pages.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = 'dist';
const base = 'https://6006coding.de';
const data = JSON.parse(fs.readFileSync(path.join(root, 'assets/6006-dtc-catalog.json'), 'utf8'));
const all = data.defs.filter(r => Array.isArray(r) && r.length === 3 && r.every(v => typeof v === 'string' && v.trim()));
const total = all.length;
assert(total > 18000, 'DTC source did not load');
const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const category = code => ({P:'Antrieb, Motor und Getriebe',B:'Karosserie und Sicherheit',C:'Fahrwerk, Bremse und Lenkung',U:'Fahrzeugnetzwerk und Steuergeräte'})[code[0]] || 'Sonstige';
const groupId = code => /^[PBCU][0-9A-F]{4}$/.test(code) ? code.slice(0,3).toLowerCase() : 'sonstige';
const groups = new Map();
for (const row of all) {
  const id = groupId(row[0].toUpperCase());
  if (!groups.has(id)) groups.set(id, []);
  groups.get(id).push(row);
}
for (const rows of groups.values()) rows.sort((a,b)=>a[0].localeCompare(b[0])||a[1].localeCompare(b[1]));
const groupNames = [...groups.keys()].sort((a,b)=>a.localeCompare(b,'de'));
const editorial=new Set(JSON.parse(fs.readFileSync(path.join(root,'assets/6006-curated-guides.json'),'utf8')).codes);
const hasGuide = code => editorial.has(code) && fs.existsSync(path.join(root,'fehlercodes',code.toLowerCase(),'index.html'));
const codeHref = code => hasGuide(code)?'/fehlercodes/'+code.toLowerCase()+'/':'/fehlercodes/code/'+code.toLowerCase()+'/';
const save = (relative,html) => {const filename = path.join(root,relative);fs.mkdirSync(path.dirname(filename),{recursive:true});fs.writeFileSync(filename,html,'utf8');};
const rootDir = '/fehlercodes/verzeichnis/';
const folder = (g,page) => rootDir+g+'/'+(page===1?'':page+'/');
const header = '<header class="bar"><a class="brand" href="/"><img src="/assets/6006-primary-white.png" alt="6006 Performance"></a><nav><a href="/fehlercodes/">Fehlercode-Suche</a><a href="/fehlercodes/loesungen/">Diagnoseanleitungen</a><a href="/fahrzeug/">Fahrzeug wählen</a></nav></header>';
function layout(title,desc,url,body){
  const ld = {'@context':'https://schema.org','@type':'CollectionPage',name:title,description:desc,url,isPartOf:{'@type':'WebSite',name:'6006 Performance',url:base+'/'}};
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
   +'<title>'+safe(title)+' | 6006 Performance</title><meta name="description" content="'+safe(desc)+'">'
   +'<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'+base+url+'">'
   +'<meta name="theme-color" content="#1a1714"><link rel="icon" type="image/svg+xml" href="/assets/6006-favicon.svg">'
   +'<link rel="stylesheet" href="/assets/6006-seo.css"><script type="application/ld+json">'+JSON.stringify(ld)+'</script></head><body>'
   +header+'<main class="main"><nav class="crumb"><a href="/">6006 Performance</a> / <a href="/fehlercodes/">Fehlercodes</a> / <a href="'+rootDir+'">Gesamtverzeichnis</a></nav>'
   +body+'</main><footer>© 2026 6006 Performance · OBD-Fehlercodes sind Hinweise, keine Bauteildiagnose. Referenzdefinitionen: Wal33D/dtc-database (MIT).</footer></body></html>';
}
const urls=[rootDir], perPage=180;
let pages=0, written=0;
for (const prefix of groupNames) {
  const records=groups.get(prefix);
  for (let i=0;i<records.length;i+=perPage) {
    const slice=records.slice(i,i+perPage), page=Math.floor(i/perPage)+1, totalPages=Math.ceil(records.length/perPage);
    const url=folder(prefix,page), family=category(records[0][0]), subtitle='OBD-Fehlercodes '+prefix.toUpperCase()+' · '+family;
    const title=prefix.toUpperCase()+' Fehlercodes – Bedeutungen und Herstellerdefinitionen'+(page>1?' · Seite '+page:'');
    const desc='Alle Referenzdefinitionen für '+prefix.toUpperCase()+'-Fehlercodes: '+family+'. Herstellerangaben vergleichen und für sichere Diagnoseschritte zur Fahrzeugauswahl wechseln.';
    const links=slice.map(r=>{
      const [code,make,definition]=r;
      const deep='/fehlercodes/?code='+encodeURIComponent(code)+(make==='GENERIC'?'':'&brand='+encodeURIComponent(make));
      const expanded=hasGuide(code)?' <a class="dtc-guide" href="/fehlercodes/'+code.toLowerCase()+'/">Ausführlicher Fachartikel →</a>':'';
      return '<li class="dtc-entry" data-dtc-row="1"><strong><a href="'+codeHref(code)+'">'+safe(code)+'</a></strong>'
        +'<span class="dtc-make">'+safe(make==='GENERIC'?'OBD allgemein':make)+'</span>'
        +'<span class="dtc-def">'+safe(definition)+'</span> <a class="dtc-guide" href="'+deep+'">Herstellereintrag →</a>'+expanded+'</li>';
    }).join('');
    const previous=page>1?'<a href="'+folder(prefix,page-1)+'">← Zurück</a>':'';
    const next=page<totalPages?'<a href="'+folder(prefix,page+1)+'">Weiter →</a>':'';
    const nav='<nav class="bottomnav" aria-label="Seiten"><span>'+previous+'</span><span>Seite '+page+' von '+totalPages+'</span><span>'+next+'</span></nav>';
    const body='<span class="kicker">FAHRZEUGDIAGNOSE · DTC VERZEICHNIS</span><h1>'+safe(subtitle)+'</h1>'
      +'<p class="lead">'+safe(desc)+'</p>'
      +'<p>Diese Einträge enthalten originale Referenzbezeichnungen und gegebenenfalls herstellerspezifische Beschreibungen. <strong>Der Code allein liefert keine sichere Reparatur</strong>. Für Symptome, mögliche Ursachen und Prüfabläufe wählen Sie den Eintrag und ergänzen Marke, Modell, Baujahr, Motor und Zusatzcode. Ausführliche Diagnoseanleitungen sind ausdrücklich gekennzeichnet.</p>'
      +'<p class="directory-stats">'+slice.length+' Definitionen auf dieser Seite · '+records.length+' in dieser Gruppe · '+total+' insgesamt</p>'
      +'<ul class="dtc-directory-list">'+links+'</ul>'+nav+'<p><a href="'+rootDir+'">Alle Codegruppen anzeigen</a> · <a href="/fehlercodes/">Fehlercode direkt suchen</a></p>';
    const rel='fehlercodes/verzeichnis/'+prefix+'/'+(page===1?'':page+'/')+'index.html';
    save(rel,layout(title,desc,url,body));urls.push(url);pages++;written+=slice.length;
  }
}
assert.equal(written,total,'Not all 18,805 manufacturer definitions were rendered');
const cards=groupNames.map(g=>{
  const rows=groups.get(g), url=folder(g,1), name=g.toUpperCase();
  return '<a href="'+url+'"><strong>'+safe(name)+'-Codes</strong><span>'+safe(category(rows[0][0]))+'</span><small>'+rows.length+' Referenzdefinitionen</small></a>';
}).join('');
const hubTitle='OBD Fehlercode-Verzeichnis P, B, C und U – alle Definitionen';
const hubDesc='Vollständiges Verzeichnis von '+total+' OBD-Fehlercode- und Herstellerdefinitionen. Jeder Code hat eine eigene Informationsseite mit Herstellerangaben und passenden ersten Diagnoseschritten.';
const intro='<span class="kicker">OBD-II · ALLE FEHLERCODES</span><h1>Alle '+total+' Fehlercode-Definitionen finden</h1>'
 +'<p class="lead">'+safe(hubDesc)+'</p><p>Hier sind alle Einträge aus unserem DTC-Datensatz als echte HTML-Texte aufrufbar, auch ohne JavaScript. Wählen Sie eine Nummerngruppe oder nutzen Sie die direkte Suche.</p>'
 +'<p><a class="btn" href="/fehlercodes/">Fehlercode direkt suchen →</a> <a class="btn outline" href="/fehlercodes/loesungen/">Ausführliche Fehlerlösungen →</a></p>'
 +'<section><h2>Alle Codegruppen</h2><div class="codegrid">'+cards+'</div></section>'
 +'<section><h2>Wichtige Hinweise zur Fehlerdiagnose</h2><p>Eine Herstellerdefinition ist nicht gleichbedeutend mit einer bestätigten Fehlerursache. Lesen Sie alle Steuergeräte und Freeze-Frame-Daten aus und vergleichen Sie Live-Werte mit den Vorgaben für die konkrete Motorvariante. Bei Brems-, Airbag- oder Hochvoltfehlern Fachkräfte hinzuziehen.</p></section>';
save('fehlercodes/verzeichnis/index.html',layout(hubTitle,hubDesc,rootDir,intro));
const cssPath=path.join(root,'assets/6006-seo-directory.css');
fs.writeFileSync(cssPath, '.dtc-directory-list{margin:1.7rem 0;padding:0;list-style:none;display:grid;gap:.45rem}.dtc-entry{display:grid;grid-template-columns:7rem 9rem 1fr;gap:1rem;align-items:baseline;border:1px solid #4b3a29;background:#231e19;padding:.8rem 1rem}.dtc-entry strong{font:800 1rem monospace}.dtc-entry .dtc-make{font-size:.79rem;color:#f3c28a}.dtc-entry .dtc-def{font-size:.86rem;color:#e0d3c3;overflow-wrap:anywhere}.dtc-entry .dtc-guide{grid-column:3;font-size:.8rem}.directory-stats{color:#ecc28c}.dtc-directory-list a{color:#ecc28c}@media(max-width:700px){.dtc-entry{grid-template-columns:1fr auto;gap:.3rem}.dtc-entry .dtc-def,.dtc-entry .dtc-guide{grid-column:1/-1}}','utf8');
// Add common CSS only once; safe for the first build and repeat builds.
for (const g of groupNames) {
  for (let page=1;page<=Math.ceil(groups.get(g).length/perPage);page++) {
    const file=path.join(root,'fehlercodes','verzeichnis',g,...(page===1?[]:[String(page)]),'index.html');
    let html=fs.readFileSync(file,'utf8');
    html=html.replace('</head>','<link rel="stylesheet" href="/assets/6006-seo-directory.css"></head>');
    fs.writeFileSync(file,html);
  }
}
const indexFile=path.join(root,'fehlercodes','verzeichnis','index.html');
fs.writeFileSync(indexFile,fs.readFileSync(indexFile,'utf8').replace('</head>','<link rel="stylesheet" href="/assets/6006-seo-directory.css"></head>'));
const sitemap=path.join(root,'sitemap.xml');
const xml=fs.readFileSync(sitemap,'utf8');
assert(xml.includes('</urlset>'),'Sitemap is missing end tag');
const stamp=new Date().toISOString().slice(0,10);
const appended=urls.filter(u=>!xml.includes('<loc>'+base+u+'</loc>'))
 .map(u=>'  <url><loc>'+base+u+'</loc><lastmod>'+stamp+'</lastmod></url>').join('\n');
fs.writeFileSync(sitemap,xml.replace('</urlset>',appended+'\n</urlset>'),'utf8');
console.log('DTC DIRECTORY: '+written+' source definitions, '+groups.size+' prefixes, '+pages+' detail listing pages, '+urls.length+' directory sitemap URLs');
