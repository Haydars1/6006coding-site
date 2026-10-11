/* 6006 Performance ECU3D - real geometry, not stacked photographs. */
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
const host=document.querySelector("#ecu3d-story");
const canvas=document.querySelector("#ecu3d-canvas");
const phase=document.querySelector("#ecu3d-caption");
const status=document.querySelector("#ecu3d-status");
const fallback=document.querySelector("#ecu3d-fallback");
const graph=document.querySelector("#ecu3d-chart");
if (!host || !canvas) throw Error("Missing ECU3D preview markup");
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
const smooth=(a,b,p)=>{const x=THREE.MathUtils.clamp((p-a)/(b-a),0,1);return x*x*(3-2*x)};
let renderer;
try{
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"low-power"});
}catch(err){
 if(status) status.textContent="3D bu cihazda açılamıyor";
 if(fallback)fallback.hidden=false;
 throw err;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.65;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(38,1,.1,60);
camera.position.set(8,7.7,11.5);
camera.lookAt(0,.35,.4);
scene.add(new THREE.HemisphereLight(0xffffff,0x373137,2.5));
function light(color,power,pos){
 const l=new THREE.DirectionalLight(color,power);
 l.position.set(...pos);scene.add(l);
}
light(0xfff2da,4,[3,9,8]);
light(0xffffff,3,[-7,6,-5]);
light(0xe9a473,1.4,[5,3,-3]);
const model=new THREE.Group(),lid=new THREE.Group(),board=new THREE.Group();
scene.add(model);model.add(lid,board);
let hasModel=false,onscreen=false,dirty=false,p=0;
function resize(){
 const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
 if(canvas.width!==Math.floor(w*renderer.getPixelRatio()) || canvas.height!==Math.floor(h*renderer.getPixelRatio())){
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<600?43:36;camera.updateProjectionMatrix();
 }
}
function draw(){
 dirty=false;
 if(!hasModel||!onscreen||document.hidden)return;
 resize();
 const t=reduced.matches?.70:p;
 lid.position.y=1.72*smooth(.11,.39,t);
 lid.rotation.z=.035*smooth(.12,.4,t);
 board.position.y=.94*smooth(.43,.73,t);
 board.rotation.z=-.015*smooth(.46,.76,t);
 model.rotation.y=-.11+.18*smooth(.1,.75,t);
 model.position.y=-.15;
 const label=t<.12?"KAPALI ECU":t<.43?"KAPAK YÜKSELİYOR":t<.77?"DEVRE KARTI ÇIKIYOR":"ECU İÇ YAPISI";
 if(phase&&phase.textContent!==label)phase.textContent=label;
 if(graph){const g=smooth(.83,.97,t);graph.style.opacity=String(g);graph.style.transform="translateY("+Math.round(20*(1-g))+"px)";}
 renderer.render(scene,camera);
}
function schedule(){if(!dirty){dirty=true;requestAnimationFrame(draw)}}
function scroll(){
 const b=host.getBoundingClientRect(),travel=Math.max(1,b.height-window.innerHeight);
 p=THREE.MathUtils.clamp(-b.top/travel,0,1);schedule();
}
new IntersectionObserver(es=>{onscreen=es.some(e=>e.isIntersecting);if(onscreen)scroll()},{rootMargin:"180px 0px"}).observe(host);
window.addEventListener("scroll",scroll,{passive:true});
window.addEventListener("resize",schedule,{passive:true});
window.addEventListener("pageshow",schedule,{passive:true});
document.addEventListener("visibilitychange",schedule);
if(reduced.addEventListener)reduced.addEventListener("change",schedule);
new GLTFLoader().load("./ecu-6006-3port.glb", gltf=>{
 const meshes=[];gltf.scene.traverse(n=>{if(n.isMesh)meshes.push(n)});
 const num={"LID":0,"PCB":0,"BASE":0,"CONNECTORS":0};
 for(const obj of meshes){
  const name=(obj.name||"").toUpperCase();
  const part=name.split("_")[0];
  if(part in num)num[part]++;
  if(part==="LID")lid.attach(obj);
  else if(part==="PCB")board.attach(obj);
  else model.attach(obj);
 }
 if(Object.values(num).some(n=>n===0))throw Error("ECU GLB must contain independent BASE/CONNECTORS/PCB/LID meshes");
 hasModel=true;
 if(status)status.remove();if(fallback)fallback.hidden=true;
 scroll();
},undefined,err=>{
 if(status)status.textContent="3D model yüklenemedi";
 if(fallback)fallback.hidden=false;
 console.warn("[ECU3D] GLB error",err);
});
