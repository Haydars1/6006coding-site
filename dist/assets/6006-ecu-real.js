
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
  // Display only coherent photographs of the SAME ECU model: closed -> opened -> exploded.
  // Do not synthesize a fake metal PCB-floor from source-image cutouts.
  const scroll=p*range;
  const hold=Math.min(scroll,range*.74);
  const opened=smooth(.12,.29,p);
  const extracted=smooth(.45,.66,p);
  const exit=smooth(.80,.91,p);
  const fade=smooth(.83,.92,p);
  const graphIn=smooth(.92,.985,p);
  const draw=smooth(.93,.998,p);
  const gains=smooth(.94,.998,p);
  toCss('hold',hold,'px');
  toCss('scale',.98+.015*smooth(.45,.70,p)-.04*smooth(.77,.90,p));
  toCss('closed',1-opened);
  toCss('open',opened*(1-extracted));
  toCss('exploded',extracted);
  toCss('photo-lift',-14*smooth(.48,.76,p),'px');
  toCss('unit-exit',-Math.min(vh*.12,125)*exit,'px');
  toCss('caption-alpha',1-smooth(.77,.87,p));
  toCss('unit-alpha',1-fade);
  toCss('graph-alpha',graphIn);
  toCss('graph-rise',26*(1-graphIn),'px');
  toCss('draw-stock',750*(1-draw));
  toCss('draw-tuned',750*(1-draw));
  toCss('gain-alpha',gains);
  const ps=Math.round(30*gains),nm=Math.round(60*gains);
  if(ps!==lastPS){power.textContent='+'+ps;lastPS=ps}
  if(nm!==lastNM){torque.textContent='+'+nm;lastNM=nm}
  const phase=p<.45?'open':p<.88?'board':'graph';
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
