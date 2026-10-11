import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {chromium, devices} from 'playwright';

mkdirSync('artifacts',{recursive:true});
const browser = await chromium.launch({
  headless:true,
  channel:'chrome',
  args:['--enable-webgl','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-gpu-sandbox']
});
let failures=0;
try {
 for(const [name,opts] of [
  ['iphone13',{...devices['iPhone 13'],viewport:{width:390,height:844}}],
  ['iphone-se',{...devices['iPhone SE'],viewport:{width:375,height:667}}],
  ['desktop',{viewport:{width:1440,height:900},deviceScaleFactor:1}]
 ]){
  const context=await browser.newContext(opts);
  const page=await context.newPage();
  const runtime=[];
  page.on('pageerror',e=>runtime.push(e.message));
  await page.goto('http://127.0.0.1:4174/ecu-atelier/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.body.dataset.ready==='true'||document.body.dataset.ready==='error',{timeout:30000});
  let state=await page.evaluate(()=>window.__ECU3D?.getState());
  assert.equal(state?.ready,true,name+': WebGL renderer failed; errors '+runtime.join(' | '));
  assert.equal(state.ports,3,name+': missing three connectors');
  assert.ok(state.components>50,name+': PCB missing components');
  assert.equal((await page.locator('button[data-step]').count()),3);
  const badWidth=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(badWidth<3,name+': horizontal overflow '+badWidth);
  await page.locator('button[data-step="1"]').click();
  await page.waitForFunction(()=>{const s=window.__ECU3D.getState();return s.lidY>1.9&&Math.abs(s.progress-.53)<.02},{timeout:12000});
  state=await page.evaluate(()=>window.__ECU3D.getState());
  assert.ok(state.boardY<.1,name+': board should not be lifted in lid step');
  await page.screenshot({path:'artifacts/'+name+'-lid.png'});
  await page.locator('button[data-step="2"]').click();
  await page.waitForFunction(()=>{const s=window.__ECU3D.getState();return s.boardY>1.3&&Math.abs(s.progress-1)<.02},{timeout:12000});
  await page.screenshot({path:'artifacts/'+name+'-pcb.png'});
  await page.locator('button[data-step="0"]').click();
  await page.waitForFunction(()=>{const s=window.__ECU3D.getState();return s.lidY<.03&&s.boardY<.03&&s.progress<.02},{timeout:12000});
  assert.equal(await page.locator('button[data-step="0"]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(runtime,[],name+': JS errors');
  console.log('PASS '+name+': GL ready; three ports; '+state.components+' board details; opened lid, lifted PCB, closed, no page errors or horizontal overflow');
  await context.close();
 }
} catch(e){failures++;console.error('MOBILE 3D TEST FAILED',e);throw e;}
finally{await browser.close();}
