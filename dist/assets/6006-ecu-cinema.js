/* Photo-accurate staged ECU, not a fictional 3D reconstruction. */
(()=>{'use strict';
const root=document.getElementById('ecu-journey');if(!root||!root.classList.contains('ecx'))return;
const slides=[...root.querySelectorAll('[data-ecx-photo]')],buttons=[...root.querySelectorAll('[data-ecx-step]')];
const unit=root.querySelector('.ecx__visual'),label=root.querySelector('[data-ecx-title]'),sub=root.querySelector('[data-ecx-subtitle]'),counter=root.querySelector('[data-ecx-counter]'),chart=root.querySelector('.ecx__chart'),caption=root.querySelector('.ecx__caption');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const locales={
 tr:[['Kapalı metal ECU','Gerçek üç soketli motor kontrol ünitesi.'],['ECU kapağı açılmış','Alüminyum kapağın altında gerçek elektronik devre.'],['Devre kartı ve bağlantılar','Motor beyni, işlemciler ve üç soketli metal gövde.']],
 de:[['Geschlossenes ECU','Originales Motorsteuergerät mit drei Anschlüssen.'],['ECU-Gehäuse geöffnet','Echte Elektronik unter dem Aluminiumdeckel.'],['Leiterplatte und Anschlüsse','Steuergerät, Bauteile und drei Steckanschlüsse.']],
 en:[['Closed metal ECU','Original engine control unit with three connectors.'],['ECU cover opened','Real electronics under the aluminum cover.'],['Circuit board and connectors','Engine ECU, processors and three electrical sockets.']]
};
const lang=()=>{const l=(document.documentElement.lang||'de').slice(0,2);return locales[l]?l:'de'};
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=(a,b,x)=>{let t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
let queued=0,active=-1,prev=-1,forced=null,language='';
const freeze=reduce.matches;
function render(){
 queued=0;
 if(freeze){root.style.setProperty('--ecx-progress','100%');return}
 const rect=root.getBoundingClientRect(),viewport=window.innerHeight||document.documentElement.clientHeight||800;
 if(rect.top>viewport+140||rect.bottom < -140)return;
 const range=Math.max(1,rect.height-viewport);
 const p=forced===null?clamp(-rect.top/range):forced;
 const l=lang();
 if(Math.abs(p-prev)<.0008 && active>=0 && l===language)return;
 prev=p;language=l;
 const idx=p<.305?0:p<.625?1:2;
 if(idx!==active || label.textContent!==locales[l][idx][0]){
   active=idx;
   for(let i=0;i<slides.length;i++){
    slides[i].classList.toggle('ecx__active',i===idx);
    slides[i].setAttribute('aria-hidden',String(i!==idx));
   }
   for(let i=0;i<buttons.length;i++)buttons[i].setAttribute('aria-pressed',String(i===idx));
   label.textContent=locales[l][idx][0];sub.textContent=locales[l][idx][1];
   counter.textContent=String(idx+1).padStart(2,'0')+' / 03';
 }
 // Low-light shutter transitions, not two photographs blended together.
 // Two complete ECU images are NEVER visible simultaneously.
 const transition=Math.min(Math.abs(p-.305),Math.abs(p-.625));
 const shutter=1-.99*(1-clamp(transition/.027));
 const leave=1-smooth(.83,.915,p);
 const alpha=shutter*leave;
 root.style.setProperty('--ecx-opacity',alpha.toFixed(3));
 root.style.setProperty('--ecx-y',(-11+23*smooth(.0,.85,p)).toFixed(1)+'px');
 root.style.setProperty('--ecx-scale',(1.018+.028*smooth(.1,.83,p)).toFixed(4));
 root.style.setProperty('--ecx-progress',(p*100).toFixed(1)+'%');
 const graphAlpha=smooth(.92,.985,p);
 root.style.setProperty('--ecx-graph',graphAlpha.toFixed(3));
 root.style.setProperty('--ecx-graph-y',(30*(1-graphAlpha)).toFixed(1)+'px');
 root.style.setProperty('--ecx-draw',String(Math.round(800*(1-smooth(.935,.997,p)))));
 chart.classList.toggle('ecx__graph-visible',graphAlpha>.001);
 chart.setAttribute('aria-hidden',String(graphAlpha<.001));
}
function request(){if(!queued)queued=requestAnimationFrame(render)}
function handleScroll(){if(forced!==null)forced=null;prev=-1;request()}
buttons.forEach((button,i)=>button.addEventListener('click',()=>{
 forced=[.10,.46,.72][i];prev=-1;request();
 // Preserve selected stage until the visitor actually scrolls again.
}));
window.addEventListener('scroll',handleScroll,{passive:true});
window.addEventListener('resize',()=>{prev=-1;request()},{passive:true});
window.addEventListener('pageshow',()=>{prev=-1;request()});
new MutationObserver(()=>{prev=-1;request()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
if(reduce.addEventListener)reduce.addEventListener('change',()=>{prev=-1;request()});
request();
})();