
/* 6006 Performance: one scene / one scroll-position / no autoplay / no scroll interception. */
(()=>{
  'use strict';
  const section=document.getElementById('ecu-journey');
  if(!section)return;
  const $=(sel)=>section.querySelector(sel);
  const stock=$('[data-ecux-ps]'),torque=$('[data-ecux-nm]'),status=$('[data-ecux-status]');
  const fields=[...section.querySelectorAll('[data-ecux-text]')];
  const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const copy={
    tr:{
      status0:'ECU KAPAĞI AÇILIYOR',status1:'DEVRELER ANALİZ EDİLİYOR',status2:'GÜÇ EĞRİSİ OLUŞUYOR',status3:'ÖRNEK SONUÇ',
      kicker:'6006 · STAGE 1 / ECU',hint:'KAYDIRARAK İLERLET',skip:'Animasyonu geç ↓',
      chart:'ÖRNEK PERFORMANS ANALİZİ',legendStock:'Orijinal',legendTuned:'Stage 1',
      power:'ÖRNEK GÜÇ ARTIŞI',torque:'ÖRNEK TORK ARTIŞI',
      note:'Temsilî +30 PS / +60 Nm. Gerçek sonuç araç, motor ve ölçüme bağlıdır.'
    },
    de:{
      status0:'STEUERGERÄT WIRD GEÖFFNET',status1:'SCHALTUNG WIRD ANALYSIERT',status2:'LEISTUNGSKURVE ENTSTEHT',status3:'BEISPIELERGEBNIS',
      kicker:'6006 · STAGE 1 / ECU',hint:'ZUM ANIMIEREN SCROLLEN',skip:'Animation überspringen ↓',
      chart:'BEISPIELHAFTE LEISTUNGSANALYSE',legendStock:'Serie',legendTuned:'Stage 1',
      power:'BEISPIEL LEISTUNGSPLUS',torque:'BEISPIEL DREHMOMENTPLUS',
      note:'Nur Beispiel: +30 PS / +60 Nm. Tatsächliche Werte hängen von Fahrzeug, Motor und Messung ab.'
    },
    en:{
      status0:'OPENING ECU COVER',status1:'ANALYSING CIRCUITS',status2:'DRAWING PERFORMANCE CURVES',status3:'ILLUSTRATIVE RESULT',
      kicker:'6006 · STAGE 1 / ECU',hint:'SCROLL TO EXPLORE',skip:'Skip animation ↓',
      chart:'ILLUSTRATIVE PERFORMANCE ANALYSIS',legendStock:'Stock',legendTuned:'Stage 1',
      power:'EXAMPLE POWER GAIN',torque:'EXAMPLE TORQUE GAIN',
      note:'Illustrative +30 PS / +60 Nm only. Actual gains depend on vehicle, engine and measurements.'
    }
  };
  const reduced=()=>Boolean(prefersReduced.matches);
  const locale=()=>{const raw=(document.documentElement.lang||'de').slice(0,2).toLowerCase();return copy[raw]?raw:'de'};
  let activeLang='',lastPhase=-1,lastProgress=-1,lastPS=-1,lastNM=-1,raf=0,visible=true;
  const clamp=x=>x<0?0:x>1?1:x;
  const ease=(start,end,value)=>{const p=clamp((value-start)/(end-start));return p*p*(3-2*p)};
  const v=(key,value)=>section.style.setProperty('--ecux-'+key,value);
  const set=(key,number,unit='')=>v(key,number.toFixed(3)+unit);
  function translate(){
    const lang=locale();
    if(activeLang===lang)return;
    activeLang=lang;
    const words=copy[lang];
    fields.forEach(el=>{const content=words[el.dataset.ecuxText];if(content)el.textContent=content});
    section.setAttribute('aria-label',lang==='de'?'Interaktive ECU-Animation vor Stage 1':lang==='en'?'Interactive ECU animation before Stage 1':'Stage 1 öncesi etkileşimli ECU animasyonu');
    lastPhase=-1;
  }
  function paint(progress){
    // Single deterministic timeline: every moving part derives from scroll position.
    const p=reduced()?1:clamp(progress);
    translate();
    if(Math.abs(p-lastProgress)<.0005&&lastPhase>=0)return;
    lastProgress=p;
    const screws=ease(.005,.13,p);
    const lid=ease(.09,.35,p);
    const circuit=ease(.30,.62,p);
    const scan=ease(.40,.71,p);
    const graph=ease(.64,.87,p);
    const graphDraw=ease(.70,.95,p);
    const result=ease(.85,1,p);
    const deviceGone=ease(.64,.86,p);
    set('ambient-scale',1+.15*circuit);
    set('device-scale',1+.17*circuit);
    set('device-y',-17*circuit,'px');
    set('device-alpha',1-.98*deviceGone);
    set('screws-opacity',1-screws);
    set('screw-rotation',540*screws,'deg');
    set('lid-angle',-118*lid,'deg');
    set('lid-up',-11*lid,'px');
    set('lid-alpha',1-.79*lid);
    set('trace-alpha',Math.min(1,.06+scan));
    set('trace-dash',580*(1-scan),'px');
    set('radar-opacity',.4+.45*circuit);
    set('beam-alpha',.58*scan*(1-graph));
    set('beam-y',-110+220*scan,'px');
    set('scan-x',-65+160*scan,'%');
    set('data-alpha',scan*(1-graph));
    set('graph-alpha',graph);
    set('graph-scale',.90+.10*graph);
    set('graph-y',27*(1-graph),'px');
    set('stock-dash',700*(1-graphDraw),'');
    set('tuned-dash',700*(1-graphDraw),'');
    set('result-alpha',result);
    set('result-y',12*(1-result),'px');
    v('progress-width',(100*p).toFixed(2)+'%');
    const nextPS=Math.round(30*result),nextNM=Math.round(60*result);
    if(nextPS!==lastPS){stock.textContent='+'+nextPS;lastPS=nextPS}
    if(nextNM!==lastNM){torque.textContent='+'+nextNM;lastNM=nextNM}
    // Only the small label changes at milestones; the visual remains continuous.
    const phase=p<.32?0:p<.64?1:p<.86?2:3;
    if(lastPhase!==phase){status.textContent=copy[activeLang]['status'+phase];lastPhase=phase}
  }
  function onFrame(){
    raf=0;
    const rect=section.getBoundingClientRect();
    const height=window.innerHeight||document.documentElement.clientHeight||800;
    const scrollRange=Math.max(1,rect.height-height);
    // Don't continuously render content outside the user's viewport.
    visible=rect.bottom>=-20&&rect.top<=height+20;
    if(!visible&&!reduced())return;
    paint(-rect.top/scrollRange);
  }
  function schedule(){if(!raf)raf=window.requestAnimationFrame(onFrame)}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule,{passive:true});
  if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
  new MutationObserver(()=>{translate();schedule()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if(prefersReduced.addEventListener)prefersReduced.addEventListener('change',schedule);
  translate();
  schedule();
})();
