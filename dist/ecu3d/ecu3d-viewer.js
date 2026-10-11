/* 6006 Performance: photographic 2.5D ECU assembly.
   Source: the ORIGINAL 3-socket ECU photography, not a plastic procedural GLB.
   Independent image-textured cover, circuit board, metal tray, and connectors.
   The real source photo is projected onto separate WebGL planes, with 3D depth.
*/
import * as THREE from 'three';
const host = document.querySelector('#ecu3d-story');
const canvas = document.querySelector('#ecu3d-canvas');
const phase = document.querySelector('#ecu3d-caption');
const status = document.querySelector('#ecu3d-status');
const fallback = document.querySelector('#ecu3d-fallback');
const graph = document.querySelector('#ecu3d-chart');
if (!host || !canvas) throw Error('Missing ECU3D viewer');

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
if(new URLSearchParams(location.search).has('inspect')){
 document.body.classList.add('ecu-inspect');
}
const clamp = x => Math.min(1, Math.max(0, x));
const ease = (a,b,x) => {let p=clamp((x-a)/(b-a));return p*p*(3-2*p)};

/* Coordinates traced against dist/assets/ecu/ecu-exploded.webp (1120 × 840).
   Masks are restricted INSIDE the real hardware -- never a solid slab over sockets.
   Every texture comes from the same original photographic image. */
const lidOutline = [
 [65,256],[92,222],[112,189],[160,155],[226,116],[278,90],
 [316,62],[355,28],[402,8],[469,0],[550,0],[650,15],
 [757,24],[852,57],[951,90],[1035,114],[1096,146],
 [1115,197],[1112,246],[1080,305],[1042,350],[998,379],
 [963,409],[934,422],[900,427],[856,415],[820,402],
 [765,384],[694,359],[620,340],[544,316],[474,299],
 [413,282],[344,269],[290,251],[245,244],[195,237],
 [159,232],[118,245]
];
const boardOutline = [
 [220,324],[290,292],[357,295],[432,310],[535,333],
 [651,356],[780,389],[881,416],[957,441],[995,476],
 [1002,525],[972,580],[943,622],[886,654],[826,633],
 [729,609],[628,580],[524,558],[416,530],[317,506],
 [223,477],[181,450],[187,400]
];
function polygon(ctx, points, inset=0){
 ctx.beginPath();
 points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
 ctx.closePath();
}
function maskPhoto(img, part){
 const out=document.createElement('canvas');out.width=1120;out.height=840;
 const c=out.getContext('2d',{willReadFrequently:false});
 c.clearRect(0,0,1120,840);
 c.drawImage(img,0,0,1120,840);
 if(part==='lid'||part==='board'){
  c.globalCompositeOperation='destination-in';
  polygon(c,part==='lid'?lidOutline:boardOutline);c.fill();
  if(part==='board'){
   c.globalCompositeOperation='destination-out';
   polygon(c,lidOutline);c.fill();
  }
 }else if(part==='case'){
  // When the metal lid and PCB rise, reconstruct the TWO hidden recessed
  // surfaces underneath them. Leaving the lid hole unfilled exposed an
  // enormous black void on mobile (user screenshot 09:51).
  c.globalCompositeOperation='destination-out';
  polygon(c,lidOutline);c.fill();
  polygon(c,boardOutline);c.fill();
  c.globalCompositeOperation='destination-over';
  const fillWell=(outline,start)=>{
    c.save();polygon(c,outline);c.clip();
    const g=c.createLinearGradient(145,255,1010,650);
    for(const [p,color] of start)g.addColorStop(p,color);
    c.fillStyle=g;c.fillRect(85,0,1050,760);
    c.strokeStyle='rgba(255,255,255,.13)';c.lineWidth=1.1;
    for(let y=155;y<735;y+=13){
      c.beginPath();c.moveTo(90,y);c.lineTo(1100,y+43);c.stroke();
    }
    c.restore();
  };
  fillWell(lidOutline,[
   [0,'#878d8f'],[.23,'#b7bcbd'],[.50,'#8c9397'],
   [.74,'#b0b4b5'],[1,'#777e82']]);
  fillWell(boardOutline,[
   [0,'#464f4d'],[.25,'#65716a'],[.52,'#535d58'],
   [.72,'#616c66'],[1,'#3b4440']]);
  c.globalCompositeOperation='source-over';
 }
 c.globalCompositeOperation='source-over';
 const texture=new THREE.CanvasTexture(out);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.minFilter=THREE.LinearMipmapLinearFilter;
 texture.magFilter=THREE.LinearFilter;
 texture.generateMipmaps=true;
 return texture;
}
let renderer;
try{
 renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
}catch(e){
 if(status)status.textContent='Fotoğraf dokulu 3D burada açılamadı.';
 if(fallback)fallback.hidden=false;
 throw e;
}
const scene=new THREE.Scene();
const camera=new THREE.OrthographicCamera(-6.2,6.2,6,-6,.1,90);
camera.position.set(0,0,24);
camera.lookAt(0,0,0);
const unit=new THREE.Group();
scene.add(unit);
const materials=[];
const textureLoader=new THREE.TextureLoader();
let closed,base,pcb,lid,ready=false,visible=false,dirty=false,scrollP=0;
function makePlane(texture,depth){
 const material=new THREE.MeshBasicMaterial({
  map:texture,transparent:true,alphaTest:.025,depthWrite:false,
  side:THREE.DoubleSide,toneMapped:false
 });
 materials.push(material);
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(11.2,8.4),material);
 mesh.position.z=depth;
 mesh.renderOrder=Math.round(depth*100);
 unit.add(mesh);return mesh;
}
function photoLoaded(img){
 // Photoshop-style original real ECU images use transparency and the same 1120 × 840 canvas.
 const original=new THREE.TextureLoader().load('/assets/ecu/ecu-closed.webp',()=>{
  ready=true;if(status)status.remove();if(fallback)fallback.hidden=true;onScroll();
 },undefined,()=>{if(status)status.textContent='Fotoğraf yüklenemedi';if(fallback)fallback.hidden=false;});
 original.colorSpace=THREE.SRGBColorSpace;
 closed=makePlane(original,.50);
 base=makePlane(maskPhoto(img,'case'),.10);
 pcb=makePlane(maskPhoto(img,'board'),.25);
 lid=makePlane(maskPhoto(img,'lid'),.45);
}
textureLoader.load('/assets/ecu/ecu-exploded.webp',t=>{
 const img=t.image;
 if(!img){if(status)status.textContent='ECU fotoğrafı okunamadı';return;}
 photoLoaded(img);
},undefined,()=>{if(status)status.textContent='Gerçek ECU fotoğrafı yüklenemedi';if(fallback)fallback.hidden=false;});
function resize(){
 const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
 if(canvas.width!==Math.floor(w*renderer.getPixelRatio())||canvas.height!==Math.floor(h*renderer.getPixelRatio())){
  renderer.setSize(w,h,false);
  const horiz=12.15,vert=horiz*h/w;
  camera.left=-horiz/2;camera.right=horiz/2;
  camera.top=vert/2;camera.bottom=-vert/2;camera.updateProjectionMatrix();
 }
}
function draw(){
 dirty=false;
 if(!ready||!visible||document.hidden)return;
 resize();
 // Fixed checkpoints are for visual QA only; normal visitors use real scroll.
 const inspect=new URLSearchParams(location.search).get('inspect');
 const inspectP=inspect===null?NaN:Number(inspect);
 const p=Number.isFinite(inspectP)?clamp(inspectP):(reduce.matches?.76:scrollP);
 // One and only one version visible. No transparent crossfades of different ECUs.
 const isClosed=p<.14;
 closed.visible=isClosed;
 base.visible=pcb.visible=lid.visible=!isClosed;
 if(!isClosed){
  // Authentic photo-textured layers move in world 3D; fixed casing/3 sockets do not.
  const opening=ease(.14,.42,p);
  const extraction=ease(.45,.78,p);
  lid.position.y=-.12+.80*opening;
  lid.position.z=.45+.22*opening;
  lid.rotation.z=-.022*opening;
  pcb.position.y=.17*extraction;
  pcb.position.z=.25+.22*extraction;
  pcb.rotation.x=-.035*extraction;
 }
 unit.rotation.y=.026*ease(.33,.78,p);
 unit.rotation.x=-.015*ease(.40,.78,p);
 unit.position.y=-.12;
 if(phase){
  const name=p<.14?'KAPALI GERÇEK ECU':p<.44?'METAL KAPAK AYRILIYOR':p<.80?'ELEKTRONİK KART KALKIYOR':'ECU İÇ YAPISI';
  if(phase.textContent!==name)phase.textContent=name;
 }
 if(graph){
  const opacity=ease(.85,.98,p);
  graph.style.opacity=String(opacity);
  graph.style.transform='translateY('+Math.round(24*(1-opacity))+'px)';
 }
 renderer.render(scene,camera);
}
function schedule(){if(!dirty){dirty=true;requestAnimationFrame(draw);}}
function onScroll(){
 const box=host.getBoundingClientRect();
 const range=Math.max(1,box.height-innerHeight);
 scrollP=clamp(-box.top/range);schedule();
}
new IntersectionObserver(es=>{
 visible=es.some(e=>e.isIntersecting);
 if(visible)onScroll();
},{rootMargin:'120px 0px'}).observe(host);
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',schedule,{passive:true});
window.addEventListener('pageshow',schedule,{passive:true});
document.addEventListener('visibilitychange',schedule);
if(reduce.addEventListener)reduce.addEventListener('change',schedule);
