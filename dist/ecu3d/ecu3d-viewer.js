/* 6006 Performance · original three-socket ECU photograph preview.
   This is a coherent photo-based fallback, NOT a geometrically rebuilt 3D ECU.
   No cut-out polygons, synthetic metal slabs, crossfaded ghost parts or invented
   PCB removal. Full original photographs always remain intact. */
import * as THREE from 'three';

const host=document.querySelector('#ecu3d-story');
const canvas=document.querySelector('#ecu3d-canvas');
const phase=document.querySelector('#ecu3d-caption');
const status=document.querySelector('#ecu3d-status');
const fallback=document.querySelector('#ecu3d-fallback');
const graph=document.querySelector('#ecu3d-chart');
if(!host||!canvas)throw Error('Missing ECU photo preview');
const params=new URLSearchParams(location.search);
const inspect=params.has('inspect')?Number(params.get('inspect')):NaN;
const hasInspect=Number.isFinite(inspect);
if(hasInspect)document.body.classList.add('ecu-inspect');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x)};
let renderer, fallbackMode=false, p=0, ready=false, visible=false, scheduled=false;
const scene=new THREE.Scene();
const camera=new THREE.OrthographicCamera(-6,6,4.5,-4.5,.1,60);
camera.position.set(0,0,25);
camera.lookAt(0,0,0);
const unit=new THREE.Group();
scene.add(unit);
const stages=[
 {name:'KAPALI ECU',url:'/assets/ecu/ecu-closed.webp'},
 {name:'METAL KAPAK AÇILMIŞ',url:'/assets/ecu/ecu-open.webp'},
 {name:'KAPAK AYRI · DEVRE KARTI GÖRÜNÜR',url:'/assets/ecu/ecu-exploded.webp'}
];
const planes=[];
function makeFallback(msg){
 fallbackMode=true;
 if(status)status.textContent=msg;
 if(fallback)fallback.hidden=false;
 if(canvas)canvas.hidden=true;
}
try{
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
}catch(e){makeFallback('Orijinal ECU fotoğrafı gösteriliyor');}
function resize(){
 if(!renderer)return;
 const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
 renderer.setSize(w,h,false);
 const halfX=6.2;
 camera.left=-halfX;camera.right=halfX;
 const halfY=halfX*h/w;
 camera.top=halfY;camera.bottom=-halfY;
 camera.updateProjectionMatrix();
}
function phaseIndex(x){return x<.25?0:x<.61?1:2;}
function render(){
 scheduled=false;
 if(!visible||document.hidden)return;
 const t=hasInspect?clamp(inspect):(reduced.matches?.72:p);
 const idx=phaseIndex(t);
 if(ready&&!fallbackMode){
  resize();
  for(let i=0;i<planes.length;i++)planes[i].visible=i===idx;
  // Subtle whole-unit parallax in real 3D, no photo slicing.
  unit.rotation.y=.020*Math.sin(t*Math.PI*1.5);
  unit.rotation.x=-.015*Math.sin(t*Math.PI);
  unit.position.y=-.02;
  renderer.render(scene,camera);
 }
 if(fallback&&fallbackMode)fallback.src=stages[idx].url;
 if(phase&&phase.textContent!==stages[idx].name)phase.textContent=stages[idx].name;
 if(graph){
  const a=smooth(.89,.99,t);
  graph.style.opacity=String(a);
  graph.style.transform='translateY('+Math.round((1-a)*16)+'px)';
 }
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
function onScroll(){
 const bounds=host.getBoundingClientRect();
 p=clamp(-bounds.top/Math.max(1,bounds.height-innerHeight));
 schedule();
}
new IntersectionObserver(entries=>{
 visible=entries.some(e=>e.isIntersecting);
 if(visible)onScroll();
},{rootMargin:'180px 0px'}).observe(host);
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',schedule,{passive:true});
window.addEventListener('pageshow',schedule,{passive:true});
document.addEventListener('visibilitychange',schedule);
if(reduced.addEventListener)reduced.addEventListener('change',schedule);
if(renderer){
 const loader=new THREE.TextureLoader();
 Promise.all(stages.map((stage,index)=>new Promise((resolve,reject)=>{
  loader.load(stage.url,tex=>{
   tex.colorSpace=THREE.SRGBColorSpace;
   const material=new THREE.MeshBasicMaterial({
    map:tex,transparent:true,alphaTest:.015,depthWrite:false,
    toneMapped:false,side:THREE.DoubleSide
   });
   const plane=new THREE.Mesh(new THREE.PlaneGeometry(11.2,8.4),material);
   plane.visible=false;unit.add(plane);planes[index]=plane;resolve();
  },undefined,reject);
 }))).then(()=>{
  ready=true;
  if(status)status.remove();
  if(fallback)fallback.hidden=true;
  onScroll();
 }).catch(()=>{makeFallback('ECU görseli yüklenemedi');onScroll();});
}else onScroll();
