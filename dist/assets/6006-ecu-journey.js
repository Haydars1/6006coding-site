
/* 6006 Performance · ECU scene: scroll position directly controls opening, traces, graphs and gains. */
(()=>{
  'use strict';
  const root=document.getElementById('ecu-journey');
  if(!root)return;
  const $=selector=>root.querySelector(selector);
  const pfx='--ecu-';
  const langData={
    tr:{
      eyebrow:'STAGE 1 / NASIL ÇALIŞIR?',titleFirst:'ECU açılır.',titleSecond:'Güç şekillenir.',
      intro:'Kaydırdıkça ECU kapağı açılır; yazılım analizi ve örnek güç eğrisi ortaya çıkar.',
      skip:'Doğrudan araç seç',illustration:'TEMSiLÎ ANİMASYON',stock:'Orijinal',tuned:'Stage 1',
      graph:'GÜÇ EĞRİSİ / ÖRNEK GÖSTERİM',power:'ÖRNEK GÜÇ ARTIŞI',torque:'ÖRNEK TORK ARTIŞI',
      note:'+30 PS / +60 Nm yalnızca animasyon örneğidir. Gerçek değer araç ve motor verileriyle belirlenir.',
      steps:['ECU KAPAĞI AÇILIYOR','VERİ ANALİZİ','ÖRNEK SONUÇ'],
      phases:['ECU kapağı açılıyor','ECU verileri inceleniyor','Örnek performans eğrisi']
    },
    de:{
      eyebrow:'STAGE 1 / SO FUNKTIONIERT ES',titleFirst:'ECU öffnen.',titleSecond:'Leistung verstehen.',
      intro:'Beim Scrollen öffnet sich das Steuergerät. Die Analyse und eine beispielhafte Leistungskurve werden sichtbar.',
      skip:'Direkt zur Fahrzeugwahl',illustration:'SCHEMATISCHE ANIMATION',stock:'Serie',tuned:'Stage 1',
      graph:'LEISTUNGSKURVE / BEISPIEL',power:'BEISPIEL LEISTUNGSPLUS',torque:'BEISPIEL DREHMOMENTPLUS',
      note:'+30 PS / +60 Nm sind rein illustrative Beispielwerte. Reale Ergebnisse hängen vom Fahrzeug und Motor ab.',
      steps:['STEUERGERÄT ÖFFNEN','DATEN ANALYSIEREN','BEISPIELERGEBNIS'],
      phases:['ECU-Abdeckung öffnet sich','Steuergerätedaten werden erläutert','Beispielhafte Leistungskurve']
    },
    en:{
      eyebrow:'STAGE 1 / HOW IT WORKS',titleFirst:'Open the ECU.',titleSecond:'Explore the power.',
      intro:'As you scroll, the ECU opens to reveal its circuits, analysis and an illustrative power curve.',
      skip:'Skip to vehicle selection',illustration:'ILLUSTRATIVE ANIMATION',stock:'Stock',tuned:'Stage 1',
      graph:'POWER CURVE / EXAMPLE',power:'EXAMPLE POWER GAIN',torque:'EXAMPLE TORQUE GAIN',
      note:'+30 PS / +60 Nm are illustrative values only. Actual results depend on the vehicle and engine.',
      steps:['ECU COVER OPENS','DATA ANALYSIS','ILLUSTRATIVE RESULT'],
      phases:['ECU cover opening','ECU data analysis visualization','Illustrative performance graph']
    }
  };
  const $step=$('[data-ecu-step-label]');
  const $power=$('[data-ecu-power]');
  const $torque=$('[data-ecu-torque]');
  const $status=$('[data-ecu-phase-label]');
  const $$steps=[...root.querySelectorAll('[data-ecu-marker]')];
  const clamp=v=>Math.max(0,Math.min(1,v));
  const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
  let lastLang='',lastPhase=-1,lastP=-1,frame=null;
  const motion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced=()=>Boolean(motion&&motion.matches);
  const currentLang=()=>{const l=(document.documentElement.lang||'de').slice(0,2).toLowerCase();return langData[l]?l:'de'};
  function localize(force=false){
    const language=currentLang();
    if(language===lastLang&&!force)return;
    lastLang=language;
    const dict=langData[language];
    root.setAttribute('aria-label',language==='tr'?'Stage 1 ECU açılışı animasyonu':language==='en'?'Stage 1 ECU opening animation':'Stage 1 Steuergerät-Animation');
    root.querySelectorAll('[data-ecu-i18n]').forEach(el=>{const text=dict[el.dataset.ecuI18n];if(typeof text==='string')el.textContent=text});
    $$steps.forEach((el,i)=>el.textContent=dict.steps[i]);
    if(lastPhase>=0)$status.textContent=dict.phases[lastPhase];
  }
  function apply(progress){
    const v=reduced()?1:progress;
    if(Math.abs(v-lastP)<.001&&lastLang===currentLang())return;
    lastP=v;localize();
    const lid=smooth(.025,.31,v);
    const circuit=smooth(.24,.49,v);
    const graph=smooth(.45,.80,v);
    const result=smooth(.74,.95,v);
    root.style.setProperty(pfx+'progress',v.toFixed(4));
    root.style.setProperty(pfx+'lid',lid.toFixed(4));
    root.style.setProperty(pfx+'circuit',circuit.toFixed(4));
    root.style.setProperty(pfx+'graph',graph.toFixed(4));
    root.style.setProperty(pfx+'result',result.toFixed(4));
    const phase=v<.34?0:v<.72?1:2;
    root.dataset.phase=String(phase);
    if(phase!==lastPhase){lastPhase=phase;$status.textContent=langData[lastLang].phases[phase]}
    $step.textContent=String(phase+1).padStart(2,'0')+' / 03';
    $power.textContent='+'+Math.round(30*result);
    $torque.textContent='+'+Math.round(60*result);
  }
  function update(){
    frame=null;
    const rect=root.getBoundingClientRect();
    const visible=rect.bottom>=0&&rect.top<=window.innerHeight;
    if(!visible&&!reduced()){localize();return}
    const travel=Math.max(1,rect.height-window.innerHeight);
    apply(clamp(-rect.top/travel));
  }
  function request(){if(frame===null)frame=window.requestAnimationFrame(update)}
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request,{passive:true});
  document.addEventListener('visibilitychange',request);
  const observer=new MutationObserver(()=>{localize();request()});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if(motion&&motion.addEventListener)motion.addEventListener('change',request);
  localize(true);request();
})();
