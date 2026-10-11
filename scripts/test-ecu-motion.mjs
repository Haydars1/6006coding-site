import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync('dist/assets/6006-ecu-real.js','utf8');
const css=readFileSync('dist/assets/6006-ecu-real.css','utf8');
const html=readFileSync('dist/index.html','utf8');
const vars={}, queue=[], listeners=new Map();
let p=0;
const root={
 classList:{contains:k=>k==='ecu-real'},
 querySelector:()=>({textContent:''}),
 querySelectorAll:()=>[],
 style:{setProperty:(k,v)=>vars[k]=v},
 getBoundingClientRect(){return {top:-670*p,bottom:1670-670*p,height:1670}}
};
const document={documentElement:{lang:'tr',clientHeight:1000},getElementById:k=>k==='ecu-journey'?root:null};
const window={innerHeight:1000,matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener:(k,fn)=>listeners.set(k,fn)};
class MutationObserver {observe(){}}
runInNewContext(src,{window,document,MutationObserver,requestAnimationFrame:fn=>(queue.push(fn),queue.length)});
function step(progress){
 p=progress;
 if(progress)listeners.get('scroll')();
 while(queue.length)queue.shift()();
 return {lid:parseFloat(vars['--ecu-lid-lift']),board:parseFloat(vars['--ecu-board-rise']), alpha:parseFloat(vars['--ecu-unit-alpha']),graph:parseFloat(vars['--ecu-graph-alpha'])};
}
const closed=step(0),open=step(.41),board=step(.74),leaving=step(.86),chart=step(.97);
assert.equal(closed.board,0,'PCB must stay installed initially');
assert.ok(open.lid<-95,'Lid must open significantly before PCB is extracted');
assert.equal(open.board,0,'PCB should remain in the housing as the lid opens');
assert.ok(board.board<=-65,'PCB must visibly rise independently from housing');
assert.ok(board.alpha>.99&&board.graph===0,'Full separated ECU must be visible before graph');
assert.ok(leaving.graph===0,'Avoid ghostly graph overlay during ECU transition');
assert.ok(chart.alpha<.05&&chart.graph>.90,'Graph must replace ECU after extraction');
assert.ok(css.includes('.ecu-real__photo--base{z-index:1;transform:none!important'),'Metal case must never move independently');
assert.ok(html.includes('ecu-v6-board.webp')&&html.includes('ecu-v6-housing.webp'),'ECU must use independent parts');
console.log('PASS: ECU 5-point timeline, distinct PCB/housing motion, graph transition');
