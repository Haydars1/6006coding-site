/* 6006 genuine photo-textured 3D ECU. Separate physical lid and board.
   Not cut-out photos; casing and sockets are actual solid 3D geometries. */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const story=document.querySelector('#ecu-3d-story');
const canvas=document.querySelector('#ecu-3d-canvas');
const msg=document.querySelector('#ecu-3d-status');
const photo=document.querySelector('#ecu-3d-fallback');
const phase=document.querySelector('#ecu-3d-phase');
const graph=document.querySelector('#ecu-3d-graph');
const buttons=[...document.querySelectorAll('[data-progress]')];
if(!story||!canvas)throw Error('Missing ECU 3D scene');
const params=new URLSearchParams(location.search),qa=params.get('inspect');
if(qa!==null)document.body.classList.add('qa');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=v=>THREE.MathUtils.clamp(v,0,1);
const ease=(a,b,p)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t)};
let renderer;
try{
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.05;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));
}catch(err){
 if(photo)photo.hidden=false;
 if(msg)msg.textContent='Bu cihazda WebGL açılamadı; ECU fotoğrafı gösteriliyor.';
 throw err;
}
const scene=new THREE.Scene();
const camera=new THREE.OrthographicCamera(-5.5,5.5,5,-5,.1,90);
camera.position.set(7.2,6.7,12.5);
camera.lookAt(0,.38,0);
const ambient=new THREE.HemisphereLight(0xffffff,0x39312a,1.45);scene.add(ambient);
function light(color,intensity,x,y,z){const l=new THREE.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l)}
light(0xfff3e3,1.7,4,9,8);
light(0xffffff,.85,-6,5,-4);
light(0xe5a36a,.45,8,3,-2);
const root=new THREE.Group(),lid=new THREE.Group(),pcb=new THREE.Group();
scene.add(root);root.add(lid,pcb);
let ready=false,onscreen=true,dirty=false,scrollProgress=0,forced=null,orbitYaw=0,dragStart=null;
function resize(){
 const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
 renderer.setSize(w,h,false);
 const halfWidth=w<700?4.48:4.95;
 camera.left=-halfWidth;camera.right=halfWidth;
 const halfHeight=halfWidth*h/w;
 camera.top=halfHeight;camera.bottom=-halfHeight;
 camera.updateProjectionMatrix();
}
function draw(){
 dirty=false;
 if(!ready||document.hidden||(!onscreen&&forced===null))return;
 resize();
 let p=forced!==null?forced:(qa!==null?clamp(Number(qa)||0):(reduced.matches?.76:scrollProgress));
 const lidAmt=ease(.12,.45,p),pcbAmt=ease(.47,.79,p);
 lid.position.y=1.75*lidAmt;
 lid.position.z=-.17*lidAmt;
 lid.rotation.z=.025*lidAmt;
 pcb.position.y=.80*pcbAmt;
 pcb.position.z=.10*pcbAmt;
 pcb.rotation.z=-.02*pcbAmt;
 root.rotation.y=-.12+.15*ease(.10,.85,p)+orbitYaw;
 root.rotation.x=.025*ease(.40,.78,p);
 root.position.y=-.19;
 const title=p<.14?'KAPALI ECU':p<.47?'METAL KAPAK AÇILIYOR':p<.83?'ELEKTRONİK KART YÜKSELİYOR':'ECU İÇ YAPISI';
 if(phase&&phase.textContent!==title)phase.textContent=title;
 for(const button of buttons){
  const target=Number(button.dataset.progress);
  const selected=Math.abs(target-p)<.13;
  button.setAttribute('aria-pressed',selected?'true':'false');
 }
 if(graph){
  const alpha=ease(.87,.98,p);
  graph.style.opacity=String(alpha);
  graph.style.transform='translateY('+Math.round((1-alpha)*24)+'px)';
 }
 renderer.render(scene,camera);
}
function schedule(){if(!dirty){dirty=true;requestAnimationFrame(draw)}}
function scroll(){
 if(forced!==null)return;
 const b=story.getBoundingClientRect();
 const travel=Math.max(1,b.height-innerHeight);
 scrollProgress=clamp(-b.top/travel);
 schedule();
}
// Allow gentle horizontal inspection without stealing vertical page scroll.
canvas.addEventListener('pointerdown',e=>{
 dragStart={x:e.clientX,y:e.clientY,yaw:orbitYaw};
 if(e.pointerType==='mouse')canvas.setPointerCapture(e.pointerId);
},{passive:true});
canvas.addEventListener('pointermove',e=>{
 if(!dragStart)return;
 const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;
 if(Math.abs(dx)>Math.abs(dy)*1.25&&Math.abs(dx)>7){
  orbitYaw=THREE.MathUtils.clamp(dragStart.yaw+dx/360,-.28,.28);
  schedule();
 }
},{passive:true});
canvas.addEventListener('pointerup',()=>{dragStart=null},{passive:true});
canvas.addEventListener('pointercancel',()=>{dragStart=null},{passive:true});
window.addEventListener('wheel',()=>{if(forced!==null){forced=null;scroll()}},{passive:true});
window.addEventListener('touchmove',()=>{if(forced!==null){forced=null;scroll()}},{passive:true});

buttons.forEach(button=>button.addEventListener('click',()=>{
 forced=Number(button.dataset.progress);
 story.scrollIntoView({behavior:'smooth',block:'start'});schedule();
}));
window.addEventListener('scroll',scroll,{passive:true});
window.addEventListener('resize',schedule,{passive:true});
window.addEventListener('pageshow',schedule,{passive:true});
new IntersectionObserver(items=>{
 onscreen=items.some(e=>e.isIntersecting);
 if(onscreen){scroll();schedule()}
},{rootMargin:'140px 0px'}).observe(story);
document.addEventListener('visibilitychange',schedule);
if(reduced.addEventListener)reduced.addEventListener('change',schedule);
new GLTFLoader().load('./ecu-photo-3d.glb',gltf=>{
 const meshes=[];gltf.scene.traverse(o=>{if(o.isMesh)meshes.push(o)});
 const counts={BASE:0,CONNECTORS:0,SCREWS:0,PCB:0,LID:0};
 for(const mesh of meshes){
  const category=(mesh.name||'').toUpperCase().split('_')[0];
  if(category in counts)counts[category]++;
  if(category==='LID')lid.attach(mesh);
  else if(category==='PCB')pcb.attach(mesh);
  else root.attach(mesh);
  if(mesh.material){
   mesh.material.side=THREE.DoubleSide;
   if(mesh.material.map)mesh.material.map.colorSpace=THREE.SRGBColorSpace;
  }
 }
 if(Object.values(counts).some(n=>n===0))throw Error('Real ECU part missing: '+JSON.stringify(counts));
 ready=true;if(msg)msg.remove();if(photo)photo.hidden=true;scroll();schedule();
},undefined,err=>{
 if(msg)msg.textContent='3D yüklenemedi. Orijinal ECU fotoğrafı gösteriliyor.';
 if(photo)photo.hidden=false;
 console.warn('[6006 photo ECU] GLB failed',err);
});
