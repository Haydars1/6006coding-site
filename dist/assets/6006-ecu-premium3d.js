/* 6006 Performance: genuine 3D geometry, three sockets, removable lid, detailed PCB. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js';
const section=document.querySelector('#ecu-journey.ecx'),host=section?.querySelector('.ecx__visual');
if(!section||!host)throw Error('ECU mount missing');
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),ease=(a,b,v)=>{let t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
let renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));
renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.13;
const canvas=renderer.domElement;
canvas.className='ecx__3d-canvas';canvas.tabIndex=0;canvas.style.touchAction='pan-y';
canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Üç soketli ECU 3D modeli. Döndürmek için sürükleyin.');
const scene=new THREE.Scene(),root=new THREE.Group();scene.add(root);
const base=new THREE.Group(),lid=new THREE.Group(),pcb=new THREE.Group(),ports=new THREE.Group();
root.add(base,lid,pcb,ports);
const material=(c,m=0,r=.5)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r});
const aluminum=material(0xa8aaa6,.81,.32),silver=material(0xd3cfc4,.84,.28);
const steel=material(0x555d5c,.77,.36),black=material(0x11191b,.07,.55),plastic=material(0x25282c,.04,.50);
const board=material(0x184434,.04,.54),gold=material(0xc69f56,.67,.25),solder=material(0xaab8b3,.69,.28),chip=material(0x161b1d,.09,.45);
function cube(parent,x,y,z,w,h,d,m){
 const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o;
}
function disk(parent,x,y,z,r,h,m,n=12){
 const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,n),m);o.position.set(x,y,z);parent.add(o);return o;
}
function casting(parent,w,d,r,h,y,m){
 const s=new THREE.Shape(),x=-w/2,z=-d/2;
 s.moveTo(x+r,z);s.lineTo(x+w-r,z);s.quadraticCurveTo(x+w,z,x+w,z+r);
 s.lineTo(x+w,z+d-r);s.quadraticCurveTo(x+w,z+d,x+w-r,z+d);
 s.lineTo(x+r,z+d);s.quadraticCurveTo(x,z+d,x,z+d-r);
 s.lineTo(x,z+r);s.quadraticCurveTo(x,z,x+r,z);
 const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSize:.042,bevelThickness:.035,bevelSegments:2,curveSegments:6});
 g.rotateX(-Math.PI/2);
 const o=new THREE.Mesh(g,m);o.position.y=y;parent.add(o);return o;
}
// Die-cast metal floor, raised gasket, perimeter sealing surface and fastening lugs.
casting(base,6.35,4.2,.32,.24,-.31,steel);
casting(base,6.28,4.13,.31,.31,-.22,aluminum);
casting(base,6.19,4.05,.29,.035,.12,silver);
casting(base,6.06,3.92,.28,.025,.16,black);
casting(base,5.96,3.80,.26,.04,.18,aluminum);
for(const x of [-3.34,3.34])for(const z of [-1.45,1.45]){
 cube(base,x,-.16,z,.49,.16,.75,aluminum);
 disk(base,x,-.053,z,.17,.045,silver);
 disk(base,x,-.03,z,.09,.065,black);
}
for(let i=0;i<10;i++)for(const s of [-1,1])cube(base,s*3.02,.02,-1.6+i*.35,.18,.10,.045,silver);
// Solid independent lid, machined grooves, identification plaque, bolt heads.
casting(lid,6.08,3.94,.30,.16,.31,aluminum);
casting(lid,5.96,3.79,.29,.036,.475,silver);
for(const x of [-2.77,2.77])for(const z of [-1.67,1.67]){
 disk(lid,x,.54,z,.111,.075,steel);
 disk(lid,x,.591,z,.069,.071,silver,6);
 cube(lid,x,.631,z,.087,.01,.016,steel);
}
for(let i=0;i<10;i++)cube(lid,1.56,.552,-.85+i*.17,1.46,.02,.061,steel);
cube(lid,-1.1,.567,-.44,2.34,.02,.94,steel);
cube(lid,-1.1,.586,-.44,2.27,.018,.88,silver);
const pic=document.createElement('canvas');pic.width=900;pic.height=350;
const pen=pic.getContext('2d'),grad=pen.createLinearGradient(0,0,900,350);
grad.addColorStop(0,'#b8b8b5');grad.addColorStop(.46,'#eeece6');grad.addColorStop(1,'#a7a6a1');
pen.fillStyle=grad;pen.fillRect(0,0,900,350);
for(let i=0;i<350;i+=3){pen.fillStyle=i%9?'rgba(255,255,255,.05)':'rgba(0,0,0,.04)';pen.fillRect(0,i,900,1);}
pen.fillStyle='#414747';pen.textAlign='center';pen.textBaseline='middle';
pen.font='900 106px Arial';pen.fillText('6006',450,120);
pen.font='bold 39px Arial';pen.fillText('P E R F O R M A N C E',450,217);
pen.font='26px monospace';pen.fillText('ENGINE CONTROL MODULE',450,294);
const tex=new THREE.CanvasTexture(pic);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
const metalPlate=new THREE.Mesh(new THREE.PlaneGeometry(2.25,.86),new THREE.MeshStandardMaterial({map:tex,metalness:.45,roughness:.35}));
metalPlate.rotation.x=-Math.PI/2;metalPlate.position.set(-1.1,.607,-.44);lid.add(metalPlate);
// Physical printed circuit board with copper vias, processor pins, chips, capacitors and traces.
casting(pcb,5.66,3.53,.15,.061,.224,board);
const traceMaterial=material(0xc0a67f,.58,.39);
function track(a,b,c){
 const curve=new THREE.CatmullRomCurve3([a,b,c].map(p=>new THREE.Vector3(p[0],.314,p[1])));
 pcb.add(new THREE.Mesh(new THREE.TubeGeometry(curve,9,.009,4,false),traceMaterial));
}
for(let i=0;i<100;i++){
 const x=-2.56+i*.051,z=-1.45+((i*23)%41)*.072;
 track([x,-1.53],[x,z],[clamp(x+(i%2?.38:-.38),-2.61,2.61),z]);
}
for(let i=0;i<154;i++){
 const x=-2.5+((i*53)%149)/149*5,z=-1.48+((i*43)%147)/147*2.96;
 disk(pcb,x,.325,z,.025,.011,gold,7);
}
function processor(x,z,w,d,count){
 cube(pcb,x,.39,z,w,.103,d,chip);
 cube(pcb,x,.447,z,w*.53,.012,d*.47,steel);
 for(let i=0;i<count;i++){
  const px=x-w/2+.07+(w-.14)*i/(count-1);
  cube(pcb,px,.332,z-d/2-.045,.027,.015,.085,solder);
  cube(pcb,px,.332,z+d/2+.045,.027,.015,.085,solder);
 }
}
processor(-.65,-.31,1.12,1.08,16);processor(1.4,-.88,.75,.8,11);
processor(1.44,.73,.65,.68,10);processor(-1.82,.95,.59,.61,9);
for(let i=0;i<42;i++){
 const x=-2.44+(i%10)*.53,z=-1.39+Math.floor(i/10)*.68;
 if((x>-.95&&x<0&&z<.4)||(x>1.04&&x<1.8))continue;
 cube(pcb,x,.36,z,.17,.08,.12,chip);
 cube(pcb,x-.105,.329,z,.029,.013,.11,solder);
 cube(pcb,x+.105,.329,z,.029,.013,.11,solder);
}
for(let i=0;i<18;i++){
 const x=-2.46+(i%6)*.88,z=-1.36+Math.floor(i/6)*1.37;
 disk(pcb,x,.405,z,.078,.19,plastic);
 disk(pcb,x,.502,z,.065,.011,solder);
}
for(let i=0;i<42;i++)cube(pcb,-2.43+i*.119,.333,1.61,.057,.013,.26,gold);
// Three separately modeled socket housings (centre is wider); double-row gold pins.
for(const [x,w,pins] of [[-1.94,1.34,17],[0,1.57,20],[1.94,1.34,17]]){
 const group=new THREE.Group();ports.add(group);const z=2.07;
 cube(group,x,-.09,z,w+.22,.82,.9,plastic);
 cube(group,x,-.09,z+.47,w+.02,.59,.083,black);
 cube(group,x,-.08,z+.53,w-.15,.43,.025,black);
 for(const s of [-1,1]){
  cube(group,x+s*(w/2+.055),-.09,z,.13,.69,.90,plastic);
  disk(group,x+s*(w/2+.06),.35,z+.18,.1,.135,steel);
 }
 cube(group,x,.153,z+.55,w-.16,.045,.06,steel);
 cube(group,x,-.315,z+.55,w-.16,.045,.06,steel);
 cube(group,x,-.08,z+.57,.05,.48,.08,plastic);
 for(let i=0;i<pins;i++)for(let r=0;r<2;r++){
  const px=x-(w-.30)/2+(w-.30)*i/(pins-1),py=-.22+r*.25;
  cube(group,px,py,z+.58,.031,.039,.072,gold);
 }
 for(let i=0;i<5;i++)cube(group,x-w*.35+i*w*.175,.355,z-.05,.08,.05,.28,black);
}
scene.add(new THREE.HemisphereLight(0xfff2e5,0x31292a,1.7));
function light(color,power,x,y,z){const l=new THREE.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l);}
light(0xffefdb,3.1,4,9,8);light(0xfafcff,1.9,-6,6,-5);light(0xd09a6a,.72,8,3,-3);
const camera=new THREE.PerspectiveCamera(33,1,.1,80),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let ready=false,onscreen=true,drag=null,forced=null,yaw=-.17,pitch=.46,raf=0;
function resize(){
 const w=Math.max(host.clientWidth,1),h=Math.max(host.clientHeight,1);
 renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
}
function draw(){
 raf=0;if(!ready||!onscreen||document.hidden)return;resize();
 const rect=section.getBoundingClientRect();
 const p=reduced.matches?.74:(forced!==null?forced:clamp(-rect.top/Math.max(1,rect.height-innerHeight)));
 const open=ease(.09,.46,p),rise=ease(.48,.81,p);
 lid.position.y=1.69*open;lid.position.z=-.18*open;lid.rotation.x=-.033*open;
 pcb.position.y=.77*rise;pcb.rotation.z=.018*rise;
 const angle=yaw+.13*ease(.15,.8,p),el=pitch+.05*ease(.2,.82,p),distance=12.3;
 camera.position.set(distance*Math.sin(angle)*Math.cos(el),distance*Math.sin(el),distance*Math.cos(angle)*Math.cos(el));
 camera.lookAt(0,.46*open,0);
 renderer.render(scene,camera);
}
function schedule(){if(!raf)raf=requestAnimationFrame(draw);}
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw,pitch};if(e.pointerType==='mouse')canvas.setPointerCapture(e.pointerId);},{passive:true});
canvas.addEventListener('pointermove',e=>{
 if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
 if(Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy)*1.12){
  yaw=drag.yaw+dx*.0065;pitch=clamp(drag.pitch-dy*.002,.22,1.1);schedule();
 }
},{passive:true});
canvas.addEventListener('pointerup',()=>drag=null,{passive:true});
canvas.addEventListener('pointercancel',()=>drag=null,{passive:true});
canvas.addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();yaw+=(e.key==='ArrowRight'?1:-1)*.18;schedule();}
 if(e.key==='Home'){yaw=-.17;pitch=.46;schedule();}
});
section.querySelectorAll('[data-ecx-step]').forEach((b,i)=>b.addEventListener('click',()=>{forced=[.07,.41,.74][i];schedule();}));
window.addEventListener('scroll',()=>{forced=null;schedule();},{passive:true});
window.addEventListener('resize',schedule,{passive:true});
document.addEventListener('visibilitychange',schedule);
new ResizeObserver(schedule).observe(host);
if(reduced.addEventListener)reduced.addEventListener('change',schedule);
canvas.addEventListener('webglcontextlost',()=>{ready=false;section.classList.remove('ecx--3d-ready');},{passive:true});
// Preserve original three matching ECU photographs unless a WebGL frame succeeded.
host.insertBefore(canvas,host.firstChild);ready=true;
try{draw();section.classList.add('ecx--3d-ready');}
catch(e){ready=false;canvas.remove();renderer.dispose();console.error('6006 3D fallback',e);}
new IntersectionObserver(es=>{onscreen=es.some(e=>e.isIntersecting);schedule();},{rootMargin:'120px 0px'}).observe(section);
