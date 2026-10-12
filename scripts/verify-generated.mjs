import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {hasDefinition, placeholder, readiness, specialist} from './dtc-quality.mjs';

assert(placeholder('Manufacturer Controlled DTC'));
assert(placeholder('ISO/SAE Reserved'));
assert(!placeholder('Fuel Pressure Regulator Performance'));
assert(readiness('OBD System Readiness Test Not Complete'));
assert(specialist('Driver airbag squib circuit open'));
assert(specialist('Hybrid high voltage battery'));
const root=path.resolve('dist'), base='https://6006coding.de';
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert(!sitemap.includes('<lastmod>'),'Do not claim a content update date from build time');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const urlSet=new Set(urls);
assert.equal(urlSet.size,urls.length);
const cache=new Map();
function read(file){if(!cache.has(file))cache.set(file,fs.readFileSync(file,'utf8'));return cache.get(file);}
function fileFor(url){const p=decodeURIComponent(url.pathname);return path.join(root,p,p.endsWith('/')?'index.html':'');}
const files=new Set(urls.map(u=>fileFor(new URL(u))));
const defs=JSON.parse(read(path.join(root,'assets/6006-dtc-catalog.json'))).defs;
const curated=new Set(JSON.parse(read(path.join(root,'assets/6006-curated-guides.json'))).codes);
const grouped=new Map();
for(const [code,make,description] of defs){if(!grouped.has(code))grouped.set(code,[]);grouped.get(code).push({make,description});}
let noindex=0, links=0;
const checkedTargets=new Set();
for(const [code,rows] of grouped){
 const url=base+'/fehlercodes/'+code.toLowerCase()+'/';
 const file=fileFor(new URL(url)), html=read(file);files.add(file);
 assert.equal(urlSet.has(url),curated.has(code)||hasDefinition(rows),'Unexpected indexability '+code);
 if(curated.has(code))continue;
 if(!hasDefinition(rows)){noindex++;assert(html.includes('noindex,follow'),code);}
 assert.equal((html.match(/<details>/g)||[]).length,new Set(rows.map(r=>r.make+'\u0001'+r.description)).size,'Missing manufacturer-specific disclosure '+code);
 const descriptions=new Set(rows.filter(r=>!placeholder(r.description)).map(r=>r.description.replace(/\s+/g,' ').trim().toLowerCase()));
 if(descriptions.size>1)assert(html.includes('Die Bedeutung hängt von Hersteller und Steuergerät ab.'),'Misleading single-manufacturer lead '+code);
 for(const block of html.matchAll(/<li id="definition-\d+">([\s\S]*?)<\/details><\/li>/g)){
  const definition=block[1].match(/<span lang="en">(.*?)<\/span>/)?.[1]||'';
  if(specialist(definition))assert(block[1].includes('Keine allgemeinen Spannungs-'),'Unsafe specialist hints '+code);
  if(readiness(definition))assert(block[1].includes('allein keinen bestätigten Bauteildefekt'),'Readiness mistaken for component failure '+code);
 }
}
for(const file of files){
 const html=read(file), relative=path.relative(root,file).replaceAll('\\','/');
 const url=new URL('/'+relative.replace(/index\.html$/,''),base);
 const canonicals=[...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/g)];
 assert.equal(canonicals.length,1,'Canonical missing/duplicated '+relative);
 assert.equal(canonicals[0][1],url.href,'Wrong canonical '+relative);
 assert.equal((html.match(/<h1(?:\s|>)/gi)||[]).length,1,'H1 count '+relative);
 for(const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
  const value=match[1].replaceAll('&amp;','&');
  if(/^(data:|mailto:|tel:|javascript:|blob:)/i.test(value))continue;
  const target=new URL(value,url);if(target.origin!==base)continue;
  links++;
  const key=target.pathname+target.hash;
  if(checkedTargets.has(key))continue;
  let targetFile=fileFor(target);
  if(fs.existsSync(targetFile)&&fs.statSync(targetFile).isDirectory())targetFile=path.join(targetFile,'index.html');
  assert(fs.existsSync(targetFile),'Broken link '+relative+' -> '+value);
  if(target.hash&&targetFile.endsWith('.html')){
   const id=decodeURIComponent(target.hash.slice(1));
   assert(read(targetFile).includes('id="'+id+'"')||read(targetFile).includes("id='"+id+"'"),'Broken fragment '+relative+' -> '+value);
  }
  checkedTargets.add(key);
 }
 for(const json of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g))JSON.parse(json[1]);
}
const stage1HubPath=path.join(root,'stage1-referenzen','index.html');
const stage1Html=read(stage1HubPath);
const stage1Db=JSON.parse(read(path.join(root,'assets','6006-stage1-references.json')));
const stage1Summary=JSON.parse(read(path.join(root,'assets','6006-stage1-seo-summary.json')));
assert(urlSet.has(base+'/stage1-referenzen/'),'Missing crawlable Stage 1 catalogue URL from sitemap');
assert.equal((urls.filter(u=>u.includes('/stage1-referenzen/'))).length,1,'One canonical Stage 1 hub, not many thin SEO pages');
assert.equal(stage1Summary.entryCount,stage1Db.examples.length,'Stage 1 SEO data must match vehicle source data');
assert.equal(stage1Summary.brandCount,new Set(stage1Db.examples.map(x=>x.make)).size,'Wrong Stage 1 SEO make count');
assert.equal((stage1Html.match(/class="stage-item"/g)||[]).length,stage1Db.examples.length,'All Stage 1 motor rows must render as HTML');
assert(stage1Html.includes('rel="canonical" href="'+base+'/stage1-referenzen/"'),'Stage 1 SEO canonical wrong');
assert(stage1Html.includes('name="robots" content="index,follow'),'Stage 1 hub must remain indexable');
assert(stage1Html.includes('38 veröffentlichte Beispiele')||stage1Html.includes(stage1Db.examples.length+' veröffentlichte Beispiele'),'Stage 1 hub count not readable without JavaScript');
assert(stage1Html.includes('kein')||stage1Html.includes('keine'),'Source limitations must be explicit');
for(const entry of stage1Db.examples){
 assert(stage1Html.includes('id="ref-'+entry.id+'"'),'Stage 1 missing crawlable motor id '+entry.id);
 assert(stage1Html.includes(entry.sourceUrl.replaceAll('&','&amp;')),'Stage 1 original source URL not linked '+entry.id);
 assert(stage1Html.includes(entry.publishedStage1Ps+' PS / '+entry.publishedStage1Nm+' Nm'),'Stage 1 display fields incorrect '+entry.id);
}
assert(read(path.join(root,'index.html')).includes('href="stage1-referenzen/"'),'Homepage is missing crawlable Stage 1 hub link');
assert(read(path.join(root,'fahrzeug','index.html')).includes('href="/stage1-referenzen/"'),'Vehicle finder must expose SEO catalogue link');
console.log('PASS: 1 indexable Stage 1 hub, '+stage1Db.examples.length+' externally sourced HTML engine listings, canonical, schema and sitemap');

assert.equal(urls.length,grouped.size-noindex+171,'Unexpected sitemap coverage');
console.log(`PASS: ${files.size} HTML pages, ${links} internal links/assets/fragments, canonical URLs and JSON-LD; ${noindex} placeholder-only pages excluded from sitemap`);
