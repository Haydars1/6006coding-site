from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np
from pathlib import Path

root=Path("dist/assets/ecu")
source=root/"ecu-open.webp"
closed=root/"ecu-closed.webp"
assert source.exists() and closed.exists(), "Previous realistic ECU files not available"
img=Image.open(source).convert("RGBA")
full_closed=Image.open(closed).convert("RGBA")
if img.size!=(1120,840):
    raise ValueError(f"ECU source changed: {img.size}")
W,H=img.size
# All contours are measured on the SAME photographic open ECU, at 1120x840.
# Crucial distinction vs old attempt: the PCB mask excludes the sockets,
# surrounding aluminium and the thick lower housing (those remain stationary).
lid_outline=[
(0,0),(1120,0),(1120,322),(1092,363),(1052,414),(1015,438),
(973,450),(943,439),(911,433),(894,407),(867,395),(831,394),
(797,377),(746,369),(700,356),(653,347),(606,331),(560,319),
(502,300),(448,286),(394,273),(340,258),(291,245),(240,227),
(192,214),(167,208),(142,210),(111,242),(90,255),(70,245),
(65,219),(82,201),(110,175),(130,151),(155,122),(210,95),
(260,55),(316,25),(330,0)]
pcb_outline=[
(293,296),(343,305),(414,324),(478,344),(547,364),(626,386),
(693,405),(760,421),(815,442),(885,465),(936,490),(950,509),
(948,552),(931,583),(892,634),(847,668),(814,687),(779,680),
(724,661),(674,644),(615,629),(556,611),(488,589),(413,565),
(351,547),(292,527),(238,509),(204,495),(180,477),(179,448),
(194,412),(221,376),(249,342),(278,313)]
def poly_mask(points,blur):
    m=Image.new("L",(W,H),0)
    ImageDraw.Draw(m).polygon(points,fill=255)
    return m.filter(ImageFilter.GaussianBlur(blur))
lid_mask=poly_mask(lid_outline,1.8)
pcb_mask=poly_mask(pcb_outline,1.6)
pcb_mask=ImageChops.multiply(pcb_mask,ImageChops.invert(lid_mask))
original_alpha=img.getchannel("A")
cover=img.copy()
cover.putalpha(ImageChops.multiply(original_alpha,lid_mask))
pcb=img.copy()
pcb.putalpha(ImageChops.multiply(original_alpha,pcb_mask))
# The case keeps the real metal perimeter + all three black connector sockets.
# Remove ONLY the cover and the PCB. Use a low shaded *floor underneath*,
# not a new upright plate or a moving duplicate of the chip.
remaining=ImageChops.invert(ImageChops.lighter(lid_mask,pcb_mask))
case=img.copy()
case.putalpha(ImageChops.multiply(original_alpha,remaining))
x=np.arange(W)[None,:]
y=np.arange(H)[:,None]
rng=np.random.default_rng(6006)
noise=rng.normal(0,1.65,(H,W))
shade=47 + .014*(x-500) - .019*(y-440) + 2.5*np.sin(x/121) + noise
cr=np.clip(shade+2,0,255).astype('uint8')
cg=np.clip(shade+5,0,255).astype('uint8')
cb=np.clip(shade+6,0,255).astype('uint8')
inner=np.array(pcb_mask,dtype=np.uint8)
# The floor is physically BEHIND the metal/PCB, and never animated.
floor=Image.fromarray(np.stack([cr,cg,cb,inner],axis=2),"RGBA")
housing=Image.alpha_composite(floor,case)
for name,item in (("closed",full_closed),("lid",cover),("board",pcb),("housing",housing)):
    result=root/f"ecu-v6-{name}.webp"
    item.save(result,"WEBP",quality=87,method=5,exact=True)
    assert result.stat().st_size>10000, result
print("Created aligned photo components:",[(p.name,p.stat().st_size) for p in root.glob("ecu-v6-*.webp")])
