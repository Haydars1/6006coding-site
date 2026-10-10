
/* 6006 Performance · lightweight scroll-synchronised animation in ordinary page flow */
(()=>{
  'use strict';
  const host=document.getElementById('ecu-journey');
  if(!host)return;
  const scenes=[...host.querySelectorAll('[data-ecu-scene]')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const text={
    tr:{
      kicker:'6006 / STAGE 1 SÜRECİ',
      step1:'ECU kapağı',sub1:'Kapağı kaydırdıkça aç.',
      step2:'İç devreler',sub2:'Analiz çizgileri aşağı indikçe ilerler.',
      step3:'Güç eğrisi',sub3:'Örnek güç ve tork eğrisinin oluşumunu izle.',
      stock:'Orijinal',tuned:'Stage 1',power:'ÖRNEK GÜÇ ARTIŞI',torque:'ÖRNEK TORK ARTIŞI',
      caution:'+30 PS ve +60 Nm yalnızca animasyon örneğidir.',
      go:'Aracımı seç ve gerçek değerleri incele',visual:'TEMSiLÎ GÖSTERİM',
      summaryA:'ECU açılır.',summaryB:'Güç şekillenir.',
      summary:'Gerçek Stage 1 sonucu yalnızca aracın motor kodu, mevcut durumu ve doğrulanmış verilerle değerlendirilir.'
    },
    de:{
      kicker:'6006 / STAGE-1-ABLAUF',
      step1:'ECU-Gehäuse',sub1:'Die Abdeckung öffnet sich beim Scrollen.',
      step2:'Schaltkreise',sub2:'Die Signalwege werden beim Weiterblättern sichtbar.',
      step3:'Leistungskurve',sub3:'Eine beispielhafte Leistungs- und Drehmomentkurve entsteht.',
      stock:'Serie',tuned:'Stage 1',power:'BEISPIEL LEISTUNGSPLUS',torque:'BEISPIEL DREHMOMENTPLUS',
      caution:'+30 PS und +60 Nm sind nur illustrative Beispielwerte.',
      go:'Fahrzeug auswählen und echte Daten prüfen',visual:'SCHEMATISCHE DARSTELLUNG',
      summaryA:'ECU öffnen.',summaryB:'Leistung verstehen.',
      summary:'Das tatsächliche Stage-1-Ergebnis hängt vom Motorcode, Fahrzeugzustand und verifizierten Fahrzeugdaten ab.'
    },
    en:{
      kicker:'6006 / STAGE 1 PROCESS',
      step1:'ECU housing',sub1:'Scroll down as the cover opens.',
      step2:'Inside the ECU',sub2:'Watch the circuit analysis trace progress.',
      step3:'Power curve',sub3:'See an illustrative power and torque comparison.',
      stock:'Stock',tuned:'Stage 1',power:'EXAMPLE POWER GAIN',torque:'EXAMPLE TORQUE GAIN',
      caution:'+30 PS and +60 Nm are illustrative examples only.',
      go:'Choose my vehicle for real data',visual:'ILLUSTRATIVE DISPLAY',
      summaryA:'Open the ECU.',summaryB:'Explore the power.',
      summary:'Actual Stage 1 results depend on the engine code, vehicle condition and verified technical data.'
    }
  };
  const shown=[...document.querySelectorAll('[data-ecu-flow-text]')];
  const current=()=>{const l=(document.documentElement.lang||'de').slice(0,2).toLowerCase();return text[l]?l:'de'};
  let lastLanguage='',frame=0;
  function translate(){
    const lang=current();
    if(lastLanguage===lang)return;
    lastLanguage=lang;
    for(const node of shown){
      const value=text[lang][node.dataset.ecuFlowText];
      if(value)node.textContent=value;
    }
    host.setAttribute('aria-label',lang==='de'?'ECU und Stage 1 – animierter Ablauf':lang==='en'?'ECU and Stage 1 – animated sequence':'ECU ve Stage 1 – animasyonlu süreç');
  }
  function clamp(x){return x<0?0:x>1?1:x}
  function update(){
    frame=0;translate();
    const vh=document.documentElement.clientHeight||window.innerHeight||800;
    if(reduced.matches){
      for(const scene of scenes)scene.style.setProperty('--step-p','1');
      return;
    }
    const start=vh*.87;
    const travel=Math.min(vh*.60,650);
    for(const scene of scenes){
      const box=scene.getBoundingClientRect();
      if(box.bottom<-20||box.top>vh+20)continue;
      const p=clamp((start-box.top)/travel);
      const last=Number(scene.dataset.ecuLastProgress||-1);
      if(Math.abs(last-p)<.006)continue;
      scene.style.setProperty('--step-p',p.toFixed(3));
      scene.style.setProperty('--step-angle',(-108*p).toFixed(1)+'deg');
      scene.style.setProperty('--step-translate',((1-p)*12).toFixed(1)+'px');
      scene.style.setProperty('--step-scale',(.94+p*.06).toFixed(3));
      scene.style.setProperty('--trace-310',((1-p)*310).toFixed(1)+'px');
      scene.style.setProperty('--trace-390',((1-p)*390).toFixed(1)+'px');
      scene.style.setProperty('--trace-700',((1-p)*700).toFixed(1)+'px');
      scene.style.setProperty('--trace-opacity',(.25+p*.75).toFixed(3));
      scene.style.setProperty('--pulse-opacity',(.26+p*.74).toFixed(3));
      scene.dataset.ecuLastProgress=String(p);
      if(scene.dataset.ecuScene==='3'){
        const show=clamp((p-.35)/.65);
        scene.querySelector('[data-ecu-gain-ps]').textContent='+'+Math.round(30*show);
        scene.querySelector('[data-ecu-gain-nm]').textContent='+'+Math.round(60*show);
      }
    }
  }
  function request(){if(!frame)frame=requestAnimationFrame(update)}
  window.addEventListener('scroll',request,{passive:true});
  window.addEventListener('resize',request,{passive:true});
  document.addEventListener('visibilitychange',request);
  new MutationObserver(request).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  if(reduced.addEventListener)reduced.addEventListener('change',request);
  translate();request();
})();
