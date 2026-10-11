import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync('dist/assets/6006-ecu-real.js','utf8');
const css=readFileSync('dist/assets/6006-ecu-real.css','utf8');
const html=readFileSync('dist/index.html','utf8');
const vars={},queue=[],listeners=new Map();
let progress=0;
const root={
 classList:{contains:key=>key==='ecu-real'},
 querySelector:()=>({textContent:''}),
 querySelectorAll:()=>[],
 style:{setProperty:(k,v)=>vars[k]=v},
 getBoundingClientRect(){return {top:-800*progress,bottom:1800-800*progress,height:1800}}
};
const document={documentElement:{lang:'tr',clientHeight:1000},getElementById:k=>k==='ecu-journey'?root:null};
const window={innerHeight:1000,matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener:(k,fn)=>listeners.set(k,fn)};
class MutationObserver{observe(){}}
runInNewContext(src,{window,document,MutationObserver,requestAnimationFrame:fn=>(queue.push(fn),queue.length)});
function step(p){
 progress=p;if(p)listeners.get('scroll')();
 while(queue.length)queue.shift()();
 return Object.fromEntries(['closed','open','exploded','unit-alpha','graph-alpha'].map(k=>[k,Number(vars['--ecu-'+k])]));
}
for(const p of [0,.15,.279,.28,.50,.639,.64,.75,.91,.915,.94,.99]){
 const s=step(p);
 const total=s.closed+s.open+s.exploded;
 assert.equal(total,1,'Exactly one opaque ECU photo should be selected at '+p+'; got '+JSON.stringify(s));
 if(p<.28)assert.equal(s.closed,1);
 else if(p<.64)assert.equal(s.open,1);
 else assert.equal(s.exploded,1);
 if(p<.915){assert.equal(s['unit-alpha'],1,'No ghost ECU');assert.equal(s['graph-alpha'],0,'No graph overlay while ECU is visible')}
 else assert.equal(s['unit-alpha'],0,'ECU must be fully hidden before chart appears');
}
const frames=['closed','open','exploded'];
for(const name of frames){
 const file='assets/ecu/ecu-'+name+'.webp';
 assert.ok(existsSync('dist/'+file),file);
 assert.ok(html.includes('/'+file),'Missing original three-plug frame '+file);
}
const scene=html.match(/<div class="ecu-real__unit"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'';
assert.equal((scene.match(/<img/g)||[]).length,3);
assert.ok(!/ecu2026-|ecu-v6-|ecu-v7-|ecu-split-|photo--board|photo--base|photo--lid/.test(scene),'No fake slices or different ECU model');
assert.ok(!/--ecu-board-rise|--ecu-lid-lift|--ecu-split/.test(css));
assert.ok(css.includes('height:200svh'),'Allow enough mobile scroll distance for stages');
console.log('PASS: full opaque three-connector ECU at all scroll states, no ghost blending, no fake case layers');
