"""Original geometry-based ECU model. Three real sockets, independent lid, PCB, shell.
Generate with: pip install trimesh numpy && python scripts/build_ecu3d.py
No licensed third-party models, imagery or paid model API.
"""
from pathlib import Path
from collections import defaultdict
import math, random
import numpy as np, trimesh
from trimesh.visual.material import PBRMaterial
root=Path(__file__).resolve().parents[1]/"dist"/"ecu3d"
root.mkdir(parents=True,exist_ok=True)
objects=defaultdict(list)
color={
"aluminum":((178,185,193,255),.87,.30),"highlight":((216,219,221,255),.85,.25),
"darkmetal":((83,94,104,255),.75,.49),"gasket":((26,29,33,255),.10,.72),
"plastic":((25,29,34,255),.05,.60),"bezel":((55,61,68,255),.13,.51),
"cavity":((11,13,16,255),.08,.90),"green":((15,105,70,255),.10,.47),
"edge":((172,140,67,255),.55,.32),"chip":((25,29,34,255),.10,.51),
"passive":((182,181,166,255),.2,.53),"gold":((210,166,70,255),.81,.31)}
rng=random.Random(6006)
def add(p,m,s):objects[p,m].append(s)
def box(p,m,x,y,z,w,h,d):
 s=trimesh.creation.box(extents=[w,h,d]);s.apply_translation([x,y,z]);add(p,m,s)
def cylinder(p,m,x,y,z,r,h,seg=12):
 s=trimesh.creation.cylinder(radius=r,height=h,sections=seg)
 s.apply_transform(trimesh.transformations.rotation_matrix(math.pi/2,[1,0,0]))
 s.apply_translation([x,y,z]);add(p,m,s)
def rim(p,m,x,y,z,w,d,t,h):
 for xx in [-1,1]:box(p,m,x+xx*(w-t)/2,y,z,t,h,d)
 for zz in [-1,1]:box(p,m,x,y,z+zz*(d-t)/2,w-2*t,h,t)
# Engine ECU lower aluminum bed. Recessed metal cavity is GEOMETRY, not a dark photo patch.
box("BASE","aluminum",0,-.43,0,6.45,.34,4.24)
box("BASE","darkmetal",0,-.23,0,5.97,.07,3.79)
box("BASE","cavity",0,-.19,0,5.69,.025,3.51)
rim("BASE","aluminum",0,-.13,0,6.37,4.17,.22,.27)
rim("BASE","gasket",0,-.01,0,6.04,3.84,.07,.038)
for x in [-3.34,3.34]:
 for z in [-1.73,1.73]:
  box("BASE","aluminum",x,-.43,z,.68,.24,.72)
  cylinder("BASE","highlight",x,-.31,z,.28,.09)
  cylinder("BASE","cavity",x,-.252,z,.13,.014)
for x in [-3.12,3.12]:box("BASE","highlight",x,-.32,0,.11,.13,4.0)
# PCB (its own independently animatable node)
box("PCB","edge",0,.005,0,5.64,.085,3.48)
box("PCB","green",0,.055,0,5.59,.032,3.43)
for x in [-2.48,2.48]:
 for z in [-1.41,1.41]:
  cylinder("PCB","gold",x,.08,z,.095,.009)
  cylinder("PCB","cavity",x,.087,z,.045,.011)
for i in range(58):
 x=rng.uniform(-2.41,2.41);z=rng.uniform(-1.38,1.38)
 if i%2:box("PCB","gold",x,.079,z,rng.uniform(.09,.45),.006,.012)
 else:box("PCB","gold",x,.079,z,.012,.006,rng.uniform(.09,.42))
for x,z,w,d in [(-.55,-.3,.92,.80),(1.10,.41,.69,.65),(-1.42,.74,.68,.57),(.18,1.08,.57,.49),(.5,-1.02,.64,.46),(-1.7,-.75,.43,.41)]:
 box("PCB","chip",x,.136,z,w,.11,d)
 box("PCB","bezel",x,.194,z,.88*w,.007,.88*d)
 for j in range(max(5,int(w/.09))):
  xx=x-w*.45+(j+.5)*w*.90/max(5,int(w/.09))
  for sg in [-1,1]:box("PCB","highlight",xx,.10,z+sg*d*.52,.033,.012,.049)
for i in range(80):
 x=rng.uniform(-2.47,2.48);z=rng.uniform(-1.34,1.34)
 box("PCB","passive" if i%3 else "chip",x,.101,z,.082,.043,.051)
for x,z in [(-2.08,-.78),(2.15,.88)]:
 cylinder("PCB","darkmetal",x,.25,z,.20,.34)
 cylinder("PCB","highlight",x,.427,z,.18,.012)
# THREE sealed plastic connector sockets with contact pins, anchored to fixed shell.
for x in [-2.03,0,2.03]:
 box("CONNECTORS","plastic",x,-.31,2.2,1.77,.73,1.06)
 box("CONNECTORS","bezel",x,-.25,2.76,1.72,.70,.13)
 box("CONNECTORS","cavity",x,-.275,2.84,1.45,.48,.02)
 rim("CONNECTORS","bezel",x,-.275,2.86,1.64,.04,.11,.62)
 box("CONNECTORS","bezel",x,.145,2.35,.50,.115,.34)
 for yy in [-.39,-.16]:
  for j in range(12):box("CONNECTORS","gold",x-.62+j*(1.24/11),yy,2.87,.032,.037,.10)
# Aluminum lid, complete removable 3D cover with thirteen cooling ribs.
box("LID","aluminum",0,.335,-.10,6.25,.255,4.03)
rim("LID","darkmetal",0,.19,-.10,6.28,4.07,.12,.07)
box("LID","highlight",0,.468,-.12,4.52,.052,2.97)
box("LID","aluminum",0,.495,-.12,3.75,.066,1.62)
for i in range(13):
 x=-2.75+i*(5.50/12)
 box("LID","darkmetal",x,.545,-.17,.07,.20,3.35)
 box("LID","highlight",x,.66,-.17,.078,.039,3.36)
box("LID","highlight",0,.532,-.13,1.38,.028,1.05)
for x in [-2.89,2.89]:
 for z in [-1.73,1.52]:
  cylinder("LID","darkmetal",x,.52,z,.17,.035)
  cylinder("LID","highlight",x,.546,z,.12,.03)
  box("LID","darkmetal",x,.566,z,.13,.009,.022)
scene=trimesh.Scene()
for (part,m),meshes in sorted(objects.items()):
 geometry=trimesh.util.concatenate(meshes)
 rgba,metalness,roughness=color[m]
 geometry.visual=trimesh.visual.TextureVisuals(material=PBRMaterial(name=m,baseColorFactor=rgba,metallicFactor=metalness,roughnessFactor=roughness,doubleSided=True))
 scene.add_geometry(geometry,geom_name=f"{part}_{m}",node_name=f"{part}_{m}")
output=root/"ecu-6006-3port.glb"
output.write_bytes(scene.export(file_type="glb"))
verify=trimesh.load(output,force="scene")
assert len(verify.geometry)>=15 and all(any(n.startswith(p+"_") for n in verify.geometry) for p in ["BASE","CONNECTORS","PCB","LID"])
assert output.stat().st_size<3_000_000
print(f"ECU 3D ready: {output.stat().st_size} bytes, {len(verify.geometry)} independent material-batched geometry nodes")
