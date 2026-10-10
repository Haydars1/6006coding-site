
/* 6006 Performance | ECU assembly lives in normal page flow.
   All transforms are pure functions of scroll, reversible with no timers or playback. */
(()=>{
 'use strict';
 const root=document.getElementById('ecu-journey');
 if(!root)return;
 const $=s=>root.querySelector(s);
 const pulsePath=$('.ecub__ribbon-active');
 const pulseDots=[...root.querySelectorAll('.ecub__signal-head')];
 const stockCurve=$('.ecub__chart-stock'),tunedCurve=$('.ecub__chart-tuned');
 const stockMarker=$('.ecub__chart-marker--stock'),tunedMarker=$('.ecub__chart-marker--tuned');
 const graphCursor=$('.ecub__chart-cursor');
 const lengthOf=(path,fallback)=>{
   try{const length=path&&typeof path.getTotalLength==='function'?path.getTotalLength():0;return Number.isFinite(length)&&length>0?length:fallback}
   catch(_error){return fallback}
 };
 const pulseLength=lengthOf(pulsePath,1300),stockLength=lengthOf(stockCurve,800),tunedLength=lengthOf(tunedCurve,800);
 root.style.setProperty('--ecub-path-length',pulseLength.toFixed(2));
 root.style.setProperty('--ecub-stock-length',stockLength.toFixed(2));
 root.style.setProperty('--ecub-tuned-length',tunedLength.toFixed(2));
 function pointOn(path,length,fraction){
   if(!path||typeof path.getPointAtLength!=='function')return null;
   try{return path.getPointAtLength(length*fraction)}catch(_error){return null}
 }
 function followCurve(path,length,progress,circle){
   const pt=pointOn(path,length,progress);
   if(pt&&circle){
     circle.setAttribute('cx',pt.x.toFixed(2));
     circle.setAttribute('cy',pt.y.toFixed(2));
   }
   return pt;
 }
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
 function paint(progress,scrollRange,viewportHeight){
   const p=clamp(reduced.matches?1:progress);
   language();
   if(Math.abs(p-lastP)<.0007)return;
   lastP=p;
   const opening=ease(.08,.30,p);
   const detach=ease(.34,.63,p);
   const closedFade=ease(.195,.225,p);
   const openFade=ease(.45,.48,p);
   const opened=ease(.20,.23,p)*(1-openFade);
   const exploded=ease(.455,.485,p)*(1-ease(.635,.735,p));
   const data=ease(.30,.68,p);
   const path=ease(.28,.90,p);
   const chart=ease(.625,.755,p);
   const graphLines=ease(.69,.94,p);
   const result=ease(.82,.97,p);
   const mobile=window.innerWidth<=760;
   set('progress',(p*100).toFixed(2)+'%');
   /* Photographic model: keep the same ECU registered as the lid opens, then lift the PCB. */
   set('closed-alpha',1-closedFade);
   set('open-alpha',opened);
   set('exploded-alpha',exploded);
   // Keep the physical ECU within the phone's usable viewport instead of
   // accumulating hundreds of pixels of downward movement. Translating by
   // the section scroll cancels the upward page movement, while the bounded
   // release introduces a clear, controlled downward progression.
   // Near the dyno transition the image fades BEFORE it can be clipped.
   // Natural page-flow parallax: the ECU follows only 45% of the page's
   // movement. It rises gently relative to the viewport instead of falling
   // down or remaining pinned in place. No abrupt extra release.
   set('object-y',p*scrollRange*.45,'px');
   set('object-scale',.94+.025*opening+.025*detach-.055*ease(.62,.79,p));
   set('closed-y',0,'px');
   set('closed-scale',1);
   set('open-y',-3*opening,'px');
   set('open-scale',1);
   set('exploded-y',6*detach,'px');
   set('exploded-scale',1);
   set('circuit-opacity',data);set('circuit-dash',650*(1-data));
   set('leds-opacity',data*(1-ease(.74,.91,p)));
   set('ribbon-opacity',path);
   set('ribbon-dash',pulseLength*(1-path));
   set('signal-opacity',ease(.32,.44,p)*(1-ease(.91,1,p)));
   const movingSignal=pointOn(pulsePath,pulseLength,path);
   if(movingSignal)for(const dot of pulseDots){
     dot.setAttribute('cx',movingSignal.x.toFixed(2));
     dot.setAttribute('cy',movingSignal.y.toFixed(2));
   }
   set('data-opacity',data*(1-ease(.63,.87,p)));
   set('data-y',(1-data)*25,'px');
   set('ring-scale',.84+.16*data);
   set('graph-opacity',chart);
   set('graph-rise',(1-chart)*35,'px');
   set('stock-dash',stockLength*(1-graphLines));set('tuned-dash',tunedLength*(1-graphLines));
   set('marker-opacity',graphLines);
   const stockPoint=followCurve(stockCurve,stockLength,graphLines,stockMarker);
   const tunedPoint=followCurve(tunedCurve,tunedLength,graphLines,tunedMarker);
   const cursorX=tunedPoint?tunedPoint.x:(stockPoint?stockPoint.x:null);
   if(cursorX!==null&&graphCursor){
     graphCursor.setAttribute('x1',cursorX.toFixed(2));
     graphCursor.setAttribute('x2',cursorX.toFixed(2));
   }
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
   const scrollRange=Math.max(1,rect.height-vh);
   paint(-rect.top/scrollRange,scrollRange,vh);
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
