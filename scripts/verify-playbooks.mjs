import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const ui=require('../dist/assets/6006-diagnostic-playbooks.js');
const data=JSON.parse(fs.readFileSync('dist/assets/6006-diagnostic-playbooks.json','utf8'));
const definitions=JSON.parse(fs.readFileSync('dist/assets/6006-dtc-catalog.json','utf8')).defs;
const knownCodes=new Set(definitions.map(row=>row[0]));
const languages=['de','tr','en'];
const required=['P2453','P2454','P2455','P20E8','P203F','P229F','P2200','P2202','P2203','P246C','P2452','P2002','P2463','P0401','P0299','P20EE','P2201'];
assert.equal(data.version,1,'Unknown playbook format');
const sources=new Set(data.sources.map(source=>source.id));
assert.equal(sources.size,data.sources.length,'Duplicate source identifiers');
for(const source of data.sources){
 const url=new URL(source.url);
 assert.equal(url.protocol,'https:','Technical sources require HTTPS');
 assert.equal(url.hostname,'www.hella.com','Focused technical guides use verified first-party HELLA sources');
 assert.ok(source.title?.trim(),'Missing source title');
}
for(const code of required){
 const entry=data.codes[code];
 assert.ok(entry,'Missing practical guide '+code);
 assert.ok(knownCodes.has(code),'Guide code is absent from reference definitions: '+code);
 const family=data.families[entry.family];
 assert.ok(family,'Unknown diagnostic workflow '+entry.family);
 assert.ok(family.sourceIds?.length,'Missing supporting sources '+entry.family);
 for(const sourceId of family.sourceIds)assert.ok(sources.has(sourceId),'Missing source '+sourceId);
 for(const related of entry.related)assert.ok(knownCodes.has(related),'Invalid related-code link '+related);
 for(const language of languages){
  for(const key of ['title','meaning','focus'])assert.ok(entry[key]?.[language]?.trim(),'Missing '+language+' '+key+' for '+code);
  assert.ok(family.steps?.[language]?.length>=5,'Insufficient practical test sequence '+code+' '+language);
  assert.ok(family.branches?.[language]?.length>=3,'Insufficient findings/actions '+code+' '+language);
  assert.ok(family.verify?.[language]?.length>=2,'Missing after-repair verification '+code+' '+language);
  assert.ok(family.stop?.[language]?.trim(),'Missing system-specific stop condition '+code+' '+language);
  for(const branch of family.branches[language])assert.ok(branch.finding?.trim()&&branch.action?.trim(),'Incomplete finding/action');
  const html=ui.render(data,code,language,true),report=ui.reportData(data,code,language);
  assert.ok(html.includes(entry.title[language]),'Wrong localized title '+code+' '+language);
  assert.ok(html.includes('data-playbook-panel="checks"')&&html.includes('data-playbook-panel="repair"'),'Missing accessible workflow panels');
  assert.ok(report.includes(family.verify[language][0]),'Report omits repair verification');
  assert.ok(report.includes(family.stop[language]),'Report omits stop conditions');
  assert.ok(report.includes(family.repair[language][0]),'Report omits confirmed repair steps');
 }
 const article=fs.readFileSync('dist/fehlercodes/'+code.toLowerCase()+'/index.html','utf8');
 assert.ok(article.includes('data-diagnostic-article="'+code+'"'),'Focused direct article not generated '+code);
 assert.ok(article.includes('id="6006-playbook-data"')&&article.includes('6006-locale.js'),'Localized article lacks offline embedded workflow '+code);
 assert.ok(article.includes('rel="canonical"')&&!article.includes('noindex'),'Focused article is not indexable '+code);
}
for(const language of languages){
 assert.match(data.codes.P229F.title[language],/2/,'P229F must identify sensor 2');
 for(const code of ['P2200','P2201','P2202','P2203'])assert.match(data.codes[code].title[language],/1/,'NOx sensor 1 must remain distinct: '+code);
}
assert.equal(ui.render(data,'PFFFF','en'),'','Unknown codes must not receive a fabricated playbook');
const hostile=structuredClone(data);
hostile.codes.P2453.title.en='<img src=x onerror=alert(1)>';
const escaped=ui.render(hostile,'P2453','en',true);
assert.ok(escaped.includes('&lt;img')&&!escaped.includes('<img src=x'),'Content must be HTML escaped');
console.log('PASS: 17 focused guides, three languages, source provenance, code distinctions, reports and direct articles');
