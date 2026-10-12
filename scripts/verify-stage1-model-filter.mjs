import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('dist/assets/6006-stage1-open-engine-finder.js','utf8');
const begin=source.indexOf('function filteredEngines(){');
const end=source.indexOf('\nfunction classifyFuel(',begin);
assert(begin>=0&&end>begin,'Cannot locate Stage 1 open-engine filtering function');
const models=[
 {name:'Golf',engines:[{engine:'2.0 TDI',from:2015,to:2020,fuel:'Diesel'}]},
 {name:'Polo',engines:[{engine:'1.0 TSI',from:2015,to:2020,fuel:'Benzin'}]}
];
const controls={
 model:{value:''},modelFilter:{value:'Golf'},year:{value:''},fuel:{value:''},term:{value:''},
 models,
 canon:value=>String(value||'').toLocaleLowerCase('de').trim(),
 classifyFuel:()=> 'Diesel'
};
vm.runInNewContext(source.slice(begin,end)+'\nglobalThis.searchResults=filteredEngines;',controls);
assert.equal(controls.searchResults().map(x=>x.item.name).join(','),'Golf',
 'Model search must filter the visible engine results, not only the dropdown');
controls.modelFilter.value='';
assert.equal(controls.searchResults().length,2,'Clearing model query must restore results');
controls.modelFilter.value='golf';
assert.equal(controls.searchResults().length,1,'Model query must be case insensitive');
controls.modelFilter.value='Golf';
controls.model.value='Polo';
assert.equal(controls.searchResults().length,0,'Conflicting model selection and query must not show an unrelated model');
console.log('Stage 1 model-name search regression: passed');
