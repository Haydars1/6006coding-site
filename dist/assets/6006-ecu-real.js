
/* 6006 Performance · Real ECU -> opened lid -> lifted PCB -> Stage 1 dyno.
   Driven exclusively by scroll; no video, timers, scroll interception or fixed sections. */
(()=>{
 'use strict';
 const root=document.getElementById('ecu-journey');
 if(!root||!root.classList.contains('ecu-real'))return;
 const $=selector=>root.querySelector(selector);
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const labels={
  tr:{brand:'6006 · STAGE 1 / ECU',skip:'Doğrudan araç seç ↓',open:'ECU KAPAĞI AÇILIYOR',board:'ELEKTRONİK KART YERİNDEN ÇIKIYOR',scan:'VERİLER ANALİZ EDİLİYOR',graph:'ÖRNEK PERFORMANS GRAFİĞİ',stock:'Orijinal',tuned:'Stage 1',power:'ÖRNEK GÜÇ ARTIŞI',torque:'ÖRNEK TORK ARTIŞI',note:'Gösterilen +30 PS / +60 Nm yalnızca örnektir; gerçek sonuç araca ve motor durumuna bağlıdır.'},
  de:{brand:'6006 · STAGE 1 / ECU',skip:'Direkt zur Fahrzeugwahl ↓',open:'ECU-GEHÄUSE WIRD GEÖFFNET',board:'LEITERPLATTE WIRD AUSGEBAUT',scan:'DATEN WERDEN ANALYSIERT',graph:'BEISPIELHAFTE LEISTUNGSKURVE',stock:'Serie',tuned:'Stage 1',power:'BEISPIEL LEISTUNGSPLUS',torque:'BEISPIEL DREHMOMENTPLUS',note:'+30 PS / +60 Nm sind nur Beispielwerte; tatsächliche Ergebnisse hängen vom Fahrzeug und Motorzustand ab.'},
  en:{brand:'6006 · STAGE 1 / ECU',skip:'Skip to vehicle selection ↓',open:'ECU COVER OPENING',board:'CIRCUIT BOARD LIFTING OUT',scan:'ANALYSING ECU DATA',graph:'ILLUSTRATIVE POWER CURVE',stock:'Stock',tuned:'Stage 1',power:'EXAMPLE POWER GAIN',torque:'EXAMPLE TORQUE GAIN',note:'+30 PS / +60 Nm are illustrative only; actual gains depend on vehicle and engine condition.'}
 };
 const captions=[...root.querySelectorAll('[data-ecu-real-i18n]')],phaseLabel=$('[data-ecu-real-phase]');
 const power=$('[data-ecu-real-power]'),torque=$('[data-ecu-real-torque]');
 const css=(key,val)=>root.style.setProperty('--ecu-'+key,val);
 const toCss=(key,value,suffix='')=>css(key,Number(value).toFixed(3)+suffix);
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
 const currentLang=()=>{const l=(document.documentElement.lang||'de').slice(0,2).toLowerCase();return labels[l]?l:'de'};
 let lang='',last=-1,lastPhase=-1,lastPS=-1,lastNM=-1,raf=0;
 function locale(){
  const l=currentLang();if(l===lang)return;
  lang=l;
  for(const node of captions)if(labels[l][node.dataset.ecuRealI18n])node.textContent=labels[l][node.dataset.ecuRealI18n];
  lastPhase=-1;
 }
 function updateFrame(p,range,vh){
  locale();
  if(Math.abs(p-last)<.0006&&lastPhase!==-1)return;
  last=p;
  // Keep the ECU at the screen's center while the metal lid opens.
  // After the board is released, ordinary page scrolling carries it upward.
  const traveled=p*range;
  const hold=Math.min(traveled,range*.56);
  const enterOpen=smooth(.08,.16,p);
  const leaveClosed=smooth(.105,.175,p);
  const enterExploded=smooth(.32,.405,p);
  const leaveOpen=smooth(.34,.41,p);
  const enterSplit=smooth(.46,.54,p);
  const boardLift=smooth(.55,.74,p);
  const exitUnit=smooth(.78,.92,p);
  const chartIn=smooth(.71,.84,p);
  const draw=smooth(.76,.95,p);
  const gains=smooth(.87,1,p);

  toCss('hold',hold,'px');
  toCss('scale',.97+.03*smooth(.09,.32,p)-.065*smooth(.70,.89,p));
  toCss('closed',1-leaveClosed);
  toCss('open',enterOpen*(1-leaveOpen));
  toCss('exploded',enterExploded*(1-enterSplit));
  toCss('split',enterSplit);
  // PCB lifts UP from the deep metal case. Cover remains visibly OPEN.
  toCss('board-lift',-Math.min(vh*.19,164)*boardLift,'px');
  toCss('unit-alpha',1-exitUnit);
  toCss('graph-alpha',chartIn);
  toCss('graph-rise',25*(1-chartIn),'px');
  toCss('draw-stock',750*(1-draw));
  toCss('draw-tuned',750*(1-draw));
  toCss('gain-alpha',gains);
  const ps=Math.round(30*gains),nm=Math.round(60*gains);
  if(ps!==lastPS){power.textContent='+'+ps;lastPS=ps}
  if(nm!==lastNM){torque.textContent='+'+nm;lastNM=nm}
  const phase=p<.32?'open':p<.74?'board':p<.86?'scan':'graph';
  if(phase!==lastPhase){phaseLabel.textContent=labels[lang][phase];lastPhase=phase}
 }
 function redraw(){
  raf=0;locale();
  const box=root.getBoundingClientRect();
  const height=window.innerHeight||document.documentElement.clientHeight||800;
  const range=Math.max(1,box.height-height);
  if(!reduced.matches&&(box.bottom<-20||box.top>height+20))return;
  updateFrame(reduced.matches?1:clamp(-box.top/range),range,height);
 }
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(redraw)};
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pageshow',schedule,{passive:true});
 if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if(reduced.addEventListener)reduced.addEventListener('change',schedule);
 locale();schedule();
})();
