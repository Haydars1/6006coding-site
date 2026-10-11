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
 getBoundingClientRect(){return {top:-670*progress,bottom:1670-670*progress,height:1670}}
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
const closed=step(0),open=step(.36),exploded=step(.75),leaving=step(.88),graph=step(.99);
assert.deepEqual([closed.closed,closed.open,closed.exploded],[1,0,0],'Initially only closed ECU');
assert.deepEqual([open.closed,open.open,open.exploded],[0,1,0],'Open photograph fully visible with actual PCB inside');
assert.deepEqual([exploded.closed,exploded.open,exploded.exploded],[0,0,1],'Exploded photograph shows separate lid and raised PCB');
assert.equal(exploded['unit-alpha'],1);
assert.equal(exploded['graph-alpha'],0);
assert.ok(leaving['graph-alpha']===0,'No ghosted graph on ECU during transition');
assert.ok(graph['unit-alpha']<.01&&graph['graph-alpha']>.98,'Graph follows clean ECU fade');
const photos=['closed','open','exploded'];
for(const name of photos){
 const f='assets/ecu/ecu2026-'+name+'.webp';
 assert.ok(existsSync('dist/'+f),'Missing coherent realistic photo: '+f);
 assert.ok(html.includes('/'+f),'Photo absent from ECU markup: '+f);
}
const scene=html.match(/<div class="ecu-real__unit"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'';
assert.equal((scene.match(/<img/g)||[]).length,3,'Only three source photographs must be used');
assert.ok(!/ecu-v6-|ecu-v7-|ecu-split-|photo--board|photo--base|photo--lid/.test(scene),'Remove all fake composite and synthetic floor layers');
assert.ok(!/--ecu-board-rise|--ecu-lid-lift|--ecu-split/.test(css),'No leftover independently translated fake cropped layers');
console.log('PASS: photo-coherent closed/open/exploded ECU states without synthetic dark PCB filler');
