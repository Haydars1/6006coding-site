import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
import {mkdirSync} from 'node:fs';
mkdirSync('artifacts/ecu-mobile',{recursive:true});
const browser=await chromium.launch({
 headless:true,
 args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--no-sandbox']
});
const configs=[
 {name:'iphone-13',device:devices['iPhone 13']},
 {name:'iphone-13-pro-max',device:devices['iPhone 13 Pro Max']},
 {name:'android-390',device:{viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true}}
];
let success=0;
try{
 for(const {name,device} of configs){
  const context=await browser.newContext({...device});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto('http://127.0.0.1:4174/ecu-atelier/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__ECU3D?.getState().ready,undefined,{timeout:45000});
  const read=()=>page.evaluate(()=>window.__ECU3D.getState());
  let s=await read();
  assert.equal(s.ports,3,name+' three ports');
  assert.ok(s.components>=75,name+' detailed PCB');
  assert.ok(s.screws>=8,name+' modeled housing screws');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),name+' no overflow');
  await page.screenshot({path:'artifacts/ecu-mobile/'+name+'-closed.png'});
  await page.locator('[data-step="1"]').click();
  await page.waitForFunction(()=>window.__ECU3D.getState().progress>.51,undefined,{timeout:18000});
  s=await read();
  assert.ok(s.lidY>1.8,name+' lid opens independently');
  assert.ok(s.boardY<.22,name+' board still seated');
  await page.screenshot({path:'artifacts/ecu-mobile/'+name+'-lid.png'});
  await page.locator('[data-step="2"]').click();
  await page.waitForFunction(()=>window.__ECU3D.getState().progress>.97,undefined,{timeout:18000});
  s=await read();
  assert.ok(s.lidY>1.95,name+' lid lifted');
  assert.ok(s.boardY>1.25,name+' PCB extracted');
  assert.equal(await page.locator('[data-step="2"]').getAttribute('aria-pressed'),'true');
  await page.screenshot({path:'artifacts/ecu-mobile/'+name+'-pcb.png'});
  await page.locator('[data-step="0"]').click();
  await page.waitForFunction(()=>window.__ECU3D.getState().progress<.03,undefined,{timeout:18000});
  s=await read();
  assert.ok(s.lidY<.05 && s.boardY<.05,name+' parts reassemble');
  assert.deepEqual(errors,[],name+' javascript errors');
  console.log('PASS '+name+' (3 connectors, lid lift, PCB extraction, reset, mobile viewport, no JS errors)');
  success++;
  await context.close();
 }
}finally{await browser.close()}
assert.equal(success,configs.length);
