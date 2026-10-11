"""Photo-textured, physically separated 3-socket ECU.
Source photography: dist/assets/ecu/ecu-closed.webp and ecu-exploded.webp.
No cutout-photo case, no fake black slab, no composited empty holes.
Run: python scripts/build_photo_ecu3d.py
"""
from pathlib import Path
from collections import defaultdict
import math, random
import numpy as np
from PIL import Image, ImageEnhance, ImageOps, ImageDraw
import trimesh
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals

ROOT=Path(__file__).resolve().parents[1]/'dist'
OUT=ROOT/'ecu3d-real'
OUT.mkdir(parents=True,exist_ok=True)
src_closed=Image.open(ROOT/'assets/ecu/ecu-closed.webp').convert('RGBA')
src_exploded=Image.open(ROOT/'assets/ecu/ecu-exploded.webp').convert('RGBA')
assert src_closed.size==src_exploded.size==(1120,840)

def rectify(src,corner_points,size):
    """Image QUAD order: top-left, bottom-left, bottom-right, top-right."""
    im=src.transform(size,Image.Transform.QUAD,tuple(v for p in corner_points for v in p),Image.Resampling.BICUBIC)
    im=ImageEnhance.Contrast(im.convert('RGB')).enhance(1.06)
    return im

# These coordinates are calibrated against the existing genuine three-socket photographs.
# Crop INSIDE the lid's machined metal upper face; nothing behind the lid is cut away.
lid_photo=rectify(src_closed,[
    (314,57),(55,356),(877,602),(1065,284)
],(1024,600))
# The PCB surface of the separated ECU includes actual integrated circuits, copper
# traces and ceramic components, not artificial green cubes.
board_photo=rectify(src_exploded,[
    (276,309),(174,481),(864,681),(967,431)
],(1024,548))
lid_photo=ImageEnhance.Brightness(lid_photo).enhance(.91)
lid_photo.save(OUT/'ecu-lid-texture.webp','WEBP',quality=90,method=6)
board_photo=ImageEnhance.Brightness(board_photo).enhance(.96)
board_photo.save(OUT/'ecu-pcb-texture.webp','WEBP',quality=91,method=6)
# Native textured aluminum from the actual ECU lid
metal_src=src_closed.crop((390,220,738,385)).convert('RGB')
metal_src=ImageOps.fit(metal_src,(600,330),method=Image.Resampling.LANCZOS)
metal_src=ImageEnhance.Contrast(metal_src).enhance(.83)
metal_src=ImageEnhance.Brightness(metal_src).enhance(.78)
metal_src.save(OUT/'ecu-cast-alloy.webp','WEBP',quality=89,method=6)
cavity=metal_src.resize((1024,600),Image.Resampling.LANCZOS).convert('RGB')
cavity=ImageEnhance.Brightness(cavity).enhance(.46)
cd=ImageDraw.Draw(cavity,'RGBA')
for yy in range(52,590,28):
    cd.line((30,yy,990,yy+17),fill=(185,190,183,36),width=2)
cavity.save(OUT/'ecu-bay-metal.webp','WEBP',quality=88,method=6)

def socket_texture(points,name):
    pic=rectify(src_closed,points,(440,260))
    pic=ImageEnhance.Brightness(pic).enhance(1.22)
    pic=ImageEnhance.Contrast(pic).enhance(1.15)
    pic.save(OUT/name,'WEBP',quality=92,method=6)
    return pic
socket_textures=[
    socket_texture([(114,436),(69,584),(269,660),(288,495)],'ecu-socket-left.webp'),
    socket_texture([(323,504),(282,674),(548,760),(550,555)],'ecu-socket-middle.webp'),
    socket_texture([(589,588),(556,764),(814,834),(818,658)],'ecu-socket-right.webp')
]
parts=defaultdict(list)
PBR={
 'cast':((122,131,140,255),.64,.41),
 'cast_high':((165,173,179,255),.65,.34),
 'edge':((93,104,110,255),.58,.50),
 'well':((43,48,53,255),.43,.56),
 'gasket':((22,25,30,255),.02,.91),
 'plastic':((22,25,29,255),.04,.59),
 'bezel':((53,58,66,255),.18,.52),
 'pin':((192,149,64,255),.66,.29),
 'green':((22,96,67,255),.08,.53),
 'chip':((28,31,37,255),.12,.56),
 'white':((214,211,191,255),.2,.50),
}
def add(part,style,mesh):parts[(part,style)].append(mesh)
def box(part,style,x,y,z,w,h,d):
    m=trimesh.creation.box(extents=(w,h,d));m.apply_translation((x,y,z))
    add(part,style,m)
def rounded_box(part,style,x,y,z,w,h,d,r=.15,segments=7,bevel=.035):
    """Watertight rounded aluminum prism with bevelled edges, not a sharp cube."""
    radius=min(r,w*.25,d*.25)
    def ring_vertices(width,depth,height,radius):
        corners=[(width/2-radius,depth/2-radius,0,math.pi/2),
                 (-width/2+radius,depth/2-radius,math.pi/2,math.pi),
                 (-width/2+radius,-depth/2+radius,math.pi,math.pi*1.5),
                 (width/2-radius,-depth/2+radius,math.pi*1.5,math.pi*2)]
        outline=[]
        for cx,cz,a,b in corners:
            for theta in np.linspace(a,b,segments+1,endpoint=True)[:-1]:
                outline.append([x+cx+radius*math.cos(theta),y+height,z+cz+radius*math.sin(theta)])
        return outline
    # Top and bottom bevel rings provide authentic highlight roll-off.
    outer_top=ring_vertices(w,d,h/2-bevel,radius)
    inset_top=ring_vertices(w-2*bevel,d-2*bevel,h/2,radius-bevel)
    outer_bottom=ring_vertices(w,d,-h/2+bevel,radius)
    inset_bottom=ring_vertices(w-2*bevel,d-2*bevel,-h/2,radius-bevel)
    n=len(outer_top)
    vertices=np.array(outer_bottom+inset_bottom+outer_top+inset_top,dtype=float)
    faces=[]
    for layer_a,layer_b in [(0,1),(0,2),(2,3)]:
        for i in range(n):
            j=(i+1)%n
            a,b,c,d=layer_a*n+i,layer_a*n+j,layer_b*n+i,layer_b*n+j
            faces.extend([[a,b,c],[c,b,d]])
    for i in range(1,n-1):
        faces.append([n,n+i,n+i+1])
        faces.append([3*n,3*n+i+1,3*n+i])
    mesh=trimesh.Trimesh(vertices=vertices,faces=faces,process=False)
    add(part,style,mesh)
def cyl(part,style,x,y,z,r,h,sections=16):
    m=trimesh.creation.cylinder(radius=r,height=h,sections=sections)
    m.apply_transform(trimesh.transformations.rotation_matrix(math.pi/2,[1,0,0]))
    m.apply_translation((x,y,z));add(part,style,m)
def ring(part,style,x,y,z,w,d,t,h):
    for sx in (-1,1):box(part,style,x+sx*(w-t)/2,y,z,t,h,d)
    for sz in (-1,1):box(part,style,x,y,z+sz*(d-t)/2,w-2*t,h,t)
# Core magnesium/aluminum housing: solid true 3D geometry remains when lid/PCB rise.
rounded_box('BASE','cast',0,-.48,0,6.45,.40,4.14,.38)
rounded_box('BASE','edge',0,-.26,0,6.13,.065,3.82,.29,bevel=.008)
rounded_box('BASE','well',0,-.22,0,5.89,.05,3.62,.26,bevel=.009)
ring('BASE','cast_high',0,-.16,0,6.44,4.12,.19,.32)
ring('BASE','gasket',0,.016,0,6.15,3.83,.065,.055)
for x in [-3.27,3.27]:
    for z in [-1.70,1.70]:
        box('BASE','cast',x,-.45,z,.65,.24,.69)
        cyl('SCREWS','edge',x,-.3,z,.19,.04)
        cyl('SCREWS','cast_high',x,-.27,z,.085,.05)
# Raised fastener lugs, internal stand-offs and molded aluminum partitions.
for x in [-2.65,2.65]:
    for z in [-1.44,1.44]:
        cyl('BASE','cast',x,-.10,z,.14,.18)
# Shallow machined cast ribs under the lifted PCB.
for x in np.linspace(-2.6,2.6,7):
    rounded_box('BASE','edge',float(x),-.159,-.65,.03,.018,2.20,.012,bevel=.004)
for x in (-3.32,3.32):
    for z in (-1.75,1.75):
        cyl('BASE','cast_high',x,-.310,z,.20,.040,20)
        cyl('BASE','well',x,-.284,z,.099,.014,20)
        cyl('SCREWS','cast',x,-.268,z,.042,.011,14)
for x in (-3.03,3.03):
    rounded_box('BASE','cast_high',x,-.36,0,.094,.17,3.24,.037,bevel=.018)

# The PCB is a separate true 3D board with photo-projected real electronics.
rounded_box('PCB','green',0,.03,-.15,5.73,.095,3.47,.10,bevel=.008)
rounded_box('PCB','pin',0,.078,-.15,5.70,.006,3.44,.10,bevel=.001)
board_y=.089
for x in [-2.48,2.48]:
    for z in [-1.40,1.09]:
        cyl('PCB','pin',x,.092,z,.093,.006,14)
        cyl('PCB','well',x,.097,z,.036,.008,14)

# Physically removable lid with genuine photographic top surface.
rounded_box('LID','cast',0,.34,-.12,6.41,.28,4.06,.36)
ring('LID','edge',0,.174,-.12,6.39,4.02,.10,.085)
rounded_box('LID','cast_high',0,.496,-.15,5.86,.055,3.72,.21,bevel=.01)
# Subtle true-depth ribs. Photo texture supplies the fine real-machined detail.
for x in [-2.65,-2.36,-2.07,-1.78,1.75,2.04,2.33,2.62]:
    box('LID','cast',x,.54,-.34,.065,.072,2.48)
    box('LID','cast_high',x,.585,-.34,.035,.013,2.43)
# Captive screw heads positioned on actual lid geometry.
for x in [-2.97,2.97]:
    for z in [-1.62,1.40]:
        cyl('LID','edge',x,.525,z,.15,.035)
        cyl('LID','cast_high',x,.551,z,.098,.022)

# Three robust FRONT CONNECTOR SOCKETS with contacts and molded retainer.
for idx,x in enumerate([-2.04,0,2.04]):
    rounded_box('CONNECTORS','plastic',x,-.39,2.32,1.83,.81,1.06,.14,bevel=.016)
    rounded_box('CONNECTORS','bezel',x,-.38,2.87,1.78,.75,.14,.10,bevel=.015)
    rounded_box('CONNECTORS','well',x,-.40,2.959,1.54,.51,.016,.065,bevel=.003)
    for sx in [-1,1]:
        box('CONNECTORS','bezel',x+sx*.837,-.38,3.00,.10,.74,.14)
    for sy in [-1,1]:
        box('CONNECTORS','bezel',x,-.38+sy*.34,3.00,1.70,.085,.14)
    rounded_box('CONNECTORS','bezel',x,.070,2.55,.56,.105,.23,.045,bevel=.012)
    for xx in (x-.63,x+.63):
        rounded_box('CONNECTORS','plastic',xx,-.06,2.53,.14,.23,.27,.03,bevel=.008)
    for xx in (x-.84,x+.84):
        rounded_box('CONNECTORS','bezel',xx,-.36,2.88,.07,.62,.09,.022,bevel=.008)
    for row in [-.49,-.29]:
        for col in range(12):
            box('CONNECTORS','pin',x-.64+col*1.28/11,row,3.005,.023,.035,.052)

scene=trimesh.Scene()
for (part,style),items in sorted(parts.items()):
    geom=trimesh.util.concatenate(items)
    color,met,rough=PBR[style]
    geom.visual=TextureVisuals(material=PBRMaterial(name=style,baseColorFactor=color,metallicFactor=met,roughnessFactor=rough,doubleSided=True))
    scene.add_geometry(geom,geom_name=f'{part}_{style}',node_name=f'{part}_{style}')

def textured_top(part,name,picture,w,d,y,cx=0,cz=0):
    # Genuine UV mapped 3D surface attached to the corresponding moving part.
    vertices=np.array([
        [cx-w/2,y,cz-d/2],[cx-w/2,y,cz+d/2],
        [cx+w/2,y,cz+d/2],[cx+w/2,y,cz-d/2]
    ],dtype=float)
    faces=np.array([[0,1,2],[0,2,3]])
    uv=np.array([[0,1],[0,0],[1,0],[1,1]],dtype=float)
    mat=PBRMaterial(name=name,baseColorTexture=picture,metallicFactor=0,roughnessFactor=1,doubleSided=True)
    geom=trimesh.Trimesh(vertices=vertices,faces=faces,process=False)
    geom.visual=TextureVisuals(uv=uv,material=mat)
    scene.add_geometry(geom,geom_name=f'{part}_{name}',node_name=f'{part}_{name}')

def textured_front(idx,x,picture):
    # A real photographic connector-face decal placed onto physical socket mesh.
    w,h,z=1.59,.53,3.112
    cy=-.39
    vertices=np.array([[x-w/2,cy-h/2,z],[x+w/2,cy-h/2,z],[x+w/2,cy+h/2,z],[x-w/2,cy+h/2,z]])
    uv=np.array([[0,0],[1,0],[1,1],[0,1]])
    geom=trimesh.Trimesh(vertices=vertices,faces=[[0,1,2],[0,2,3]],process=False)
    geom.visual=TextureVisuals(uv=uv,material=PBRMaterial(name=f'real-socket-{idx}',baseColorTexture=picture,metallicFactor=0,roughnessFactor=1,doubleSided=True))
    scene.add_geometry(geom,geom_name=f'CONNECTORS_photo_{idx}',node_name=f'CONNECTORS_photo_{idx}')

# Real aluminum material on recessed floor and cast lips. All sit below the PCB.
textured_top('BASE','photo-machined-floor',cavity,5.68,3.40,-.185,0,0)
def lip_photo(name,cx,cz,w,d,y):
    textured_top('BASE',name,metal_src,w,d,y,cx,cz)
lip_photo('real-lip-front',0,1.975,6.18,.16,.058)
lip_photo('real-lip-rear',0,-1.975,6.18,.16,.058)
lip_photo('real-lip-left',-3.12,0,.135,3.78,.058)
lip_photo('real-lip-right',3.12,0,.135,3.78,.058)
def photographed_front_wall(image,w,h,cy,z):
    vertices=np.array([[-w/2,cy-h/2,z],[w/2,cy-h/2,z],[w/2,cy+h/2,z],[-w/2,cy+h/2,z]],dtype=float)
    uv=np.array([[0,0],[1,0],[1,1],[0,1]],dtype=float)
    geom=trimesh.Trimesh(vertices=vertices,faces=[[0,1,2],[0,2,3]],process=False)
    geom.visual=TextureVisuals(uv=uv,material=PBRMaterial(
        name='real-aluminum-front-rail',baseColorTexture=image,
        metallicFactor=.08,roughnessFactor=.95,doubleSided=True))
    scene.add_geometry(geom,geom_name='BASE_photo-front-rail',node_name='BASE_photo-front-rail')
photographed_front_wall(metal_src,6.22,.24,-.065,2.074)

textured_top('LID','photo-lid',lid_photo,5.78,3.60,.534,0,-.13)
textured_top('PCB','photo-board',board_photo,5.51,3.30,.094,0,-.15)
for i,(x,tex) in enumerate(zip([-2.04,0,2.04],socket_textures)):
    textured_front(i,x,tex)

output=OUT/'ecu-photo-3d.glb'
output.write_bytes(scene.export(file_type='glb'))
model=trimesh.load(output,force='scene')
groups={name.split('_')[0] for name in model.geometry}
assert {'BASE','CONNECTORS','LID','PCB','SCREWS'} <= groups
assert any('photo' in name for name in model.geometry)
assert len([n for n in model.geometry if n.startswith('BASE_') and ('photo' in n or 'real-lip' in n)])>=6
assert output.stat().st_size < 6_000_000
print('PHOTO ECU 3D:',output.stat().st_size,'bytes',len(model.geometry),'geometry groups',sorted(groups))
