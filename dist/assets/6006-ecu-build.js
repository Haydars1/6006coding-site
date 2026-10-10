
/* 6006 Performance | ECU assembly lives in normal page flow.
   All transforms are pure functions of scroll, reversible with no timers or playback. */
(()=>{
 'use strict';
 const root=document.getElementById('ecu-journey');
 if(!root)return;
 const $=s=>root.querySelector(s);
 const i18n={
   tr:{eyebrow:'6006 / STAGE 1',skip:'Doğrudan araç seç ↓',stepA:'01 / ECU KAPAĞI',stepB:'02 / DEVRE ANALİZİ',stepC:'03 / GÜÇ EĞRİSİ',readout:'CAN / ECU',readoutDetail:'VERİ AKIŞI',chart:'ÖRNEK GÜÇ ANALİZİ',orig:'Orijinal',stage:'Stage 1',gainPS:'ÖRNEK GÜÇ ARTIŞI',gainNM:'ÖRNEK TORK ARTIŞI',note:'+30 PS / +60 Nm yalnızca örnektir. Kesin değer araç ve motor verilerine bağlıdır.'},
   de:{eyebrow:'6006 / STAGE 1',skip:'Direkt zur Fahrzeugwahl ↓',stepA:'01 / ECU-GEHÄUSE',stepB:'02 / SCHALTUNGSANALYSE',stepC:'03 / LEISTUNGSKURVE',readout:'CAN / ECU',readoutDetail:'DATENFLUSS',chart:'BEISPIEL LEISTUNGSANALYSE',orig:'Serie',stage:'Stage 1',gainPS:'BEISPIEL LEISTUNGSPLUS',gainNM:'BEISPIEL DREHMOMENTPLUS',note:'+30 PS / +60 Nm sind nur Beispielwerte. Tatsächliche Werte hängen von Fahrzeug und Motor ab.'},
   en:{eyebrow:'6006 / STAGE 1',skip:'Skip to vehicle selection ↓',stepA:'01 / ECU HOUSING',stepB:'02 / CIRCUIT ANALYSIS',stepC:'03 / POWER CURVE',readout:'CAN / ECU',readoutDetail:'DATA FLOW',chart:'EXAMPLE POWER ANALYSIS',orig:'Stock',stage:'Stage 1',gainPS:'EXAMPLE POWER GAIN',gainNM:'EXAMPLE TORQUE GAIN',note:'+30 PS / +60 Nm are illustrative values only. Actual gains depend on vehicle and engine.'}
 };
 const userLanguage=()=>{const l=(document.documentElement.lang||'de').slice(0,2).toLowerCase();return i18n[l]?l:'de'};
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const ps=$('[data-ecub-ps]'),nm=$('[data-ecub-nm]');
 const translated=[...root.querySelectorAll('[data-ecub-i18n]')];
 let current='',lastP=-1,lastPS=-1,lastNM=-1,raf=0;
 const clamp=t=>Math.max(0,Math.min(1,t));
 function ease(a,b,x){const t=clamp((x-a)/(b-a));return t*t*(3-2*t)}
 function set(name,val,unit){root.style.setProperty('--ecub-'+name,typeof val==='number'?val.toFixed(3)+(unit||''):val)}
 function language(){
   const l=userLanguage();if(l===current)return;
   current=l;
   for(const el of translated){const value=i18n[l][el.dataset.ecubI18n];if(value)el.textContent=value}
   root.setAttribute('aria-label',l==='tr'?'Sayfa ile ilerleyen ECU açılış animasyonu':l==='en'?'Scrolling ECU assembly animation':'ECU-Aufbauanimation beim Scrollen');
 }
 function paint(progress){
   const p=clamp(reduced.matches?1:progress);
   language();
   if(Math.abs(p-lastP)<.0007)return;
   lastP=p;
   const screw=ease(.005,.095,p);
   const lid=ease(.085,.29,p);
   const detach=ease(.21,.62,p);
   const data=ease(.30,.68,p);
   const path=ease(.28,.90,p);
   const chart=ease(.65,.88,p);
   const graphLines=ease(.67,.97,p);
   const result=ease(.85,1,p);
   const deviceHide=ease(.62,.88,p);
   const mobile=window.innerWidth<=760;
   const travel=Math.min((window.innerHeight||800)*(mobile?.43:.47),mobile?365:440);
   set('progress',(p*100).toFixed(2)+'%');
   set('screw-turn',screw*490,'deg');set('screws',1-screw);
   set('lid-angle',-111*lid,'deg');set('lid-y',-15*lid,'px');set('lid-opacity',1-ease(.23,.37,p));
   set('board-drop',detach*travel,'px');set('board-scale',1+detach*(mobile?.18:.30));
   set('board-opacity',1-deviceHide*.98);
   set('housing',1-ease(.28,.56,p));
   set('circuit-opacity',data);set('circuit-dash',650*(1-data));
   set('ribbon-opacity',path);
   set('ribbon-dash',2700*(1-path));
   set('data-opacity',data*(1-ease(.63,.87,p)));
   set('data-y',(1-data)*25,'px');
   set('ring-scale',.84+.16*data);
   set('graph-opacity',chart);
   set('graph-rise',(1-chart)*35,'px');
   set('stock-dash',800*(1-graphLines));set('tuned-dash',800*(1-graphLines));
   set('gains-opacity',result);set('gains-y',(1-result)*14,'px');
   const nextPS=Math.round(30*result),nextNM=Math.round(60*result);
   if(nextPS!==lastPS){ps.textContent='+'+nextPS;lastPS=nextPS}
   if(nextNM!==lastNM){nm.textContent='+'+nextNM;lastNM=nextNM}
 }
 function update(){
   raf=0;
   language();
   const rect=root.getBoundingClientRect();
   const vh=window.innerHeight||document.documentElement.clientHeight||800;
   if(!reduced.matches&&(rect.bottom<0||rect.top>vh))return;
   paint(-rect.top/Math.max(1,rect.height-vh));
 }
 function schedule(){if(!raf)raf=requestAnimationFrame(update)}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pageshow',schedule,{passive:true});
 if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
 new MutationObserver(()=>{language();schedule()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if(reduced.addEventListener)reduced.addEventListener('change',schedule);
 language();schedule();
})();
