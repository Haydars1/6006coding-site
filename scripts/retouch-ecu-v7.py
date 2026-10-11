from PIL import Image, ImageChops, ImageDraw, ImageFilter
import numpy as np
from pathlib import Path

root=Path("dist/assets/ecu")
img=Image.open(root/"ecu-open.webp").convert("RGBA")
board=Image.open(root/"ecu-v6-board.webp").convert("RGBA")
lid=Image.open(root/"ecu-v6-lid.webp").convert("RGBA")
assert img.size==board.size==lid.size==(1120,840)
W,H=img.size
# Keep all metal edges, connector sockets, and fastening screws from the
# photographed ECU. The old artificial dark PCB-floor fill is NOT reused.
used=ImageChops.lighter(board.getchannel("A"),lid.getchannel("A"))
case=img.copy()
case.putalpha(ImageChops.multiply(img.getchannel("A"),ImageChops.invert(used)))
x=np.arange(W)[None,:].astype(float)
y=np.arange(H)[:,None].astype(float)
rng=np.random.default_rng(6006)
fleck=rng.normal(0,2.7,(H,W))
metal=79+12*np.exp(-((x-460)**2/(390**2)+(y-455)**2/(170**2)))+3*np.sin(x/67)+3.5*np.sin(y/17)+fleck
r=np.clip(metal+2,0,255).astype("uint8")
g=np.clip(metal+4,0,255).astype("uint8")
b=np.clip(metal+5,0,255).astype("uint8")
# Shallow, recessed alloy metal below PCB. Mask drawn within the real board
# silhouette (not across the black sockets/front metal lip).
inside=board.getchannel("A").filter(ImageFilter.MinFilter(15)).filter(ImageFilter.GaussianBlur(2))
floor=Image.fromarray(np.stack([r,g,b,np.array(inside,dtype=np.uint8)],axis=2),"RGBA")
ribs=Image.new("RGBA",(W,H),(0,0,0,0))
d=ImageDraw.Draw(ribs)
for yy in range(325,695,18):
    d.line((180,yy,910,yy+120),fill=(175,183,176,42),width=2)
    d.line((181,yy+2,911,yy+122),fill=(24,35,35,50),width=1)
for cx,cy in [(248,405),(770,550),(500,565)]:
    d.ellipse((cx-8,cy-5,cx+8,cy+5),fill=(29,35,35,160),outline=(161,166,166,140),width=2)
ribs.putalpha(ImageChops.multiply(ribs.getchannel("A"),inside))
floor=Image.alpha_composite(floor,ribs)
finished=Image.alpha_composite(floor,case)
out=root/"ecu-v7-housing.webp"
finished.save(out,"WEBP",quality=88,method=5,exact=True)
assert out.stat().st_size>10000
print("Created",out, "bytes",out.stat().st_size)
