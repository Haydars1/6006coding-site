"""Experimental TripoSR input prep for real 6006 three-port ECU images.
Outputs are review-only: never replace working production animation.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
HERE=Path(__file__).resolve().parents[1]
ASSET=HERE/'dist/assets/ecu'
OUT=HERE/'output/ecu-triposr'
OUT.mkdir(parents=True,exist_ok=True)
source=Image.open(ASSET/'ecu-exploded.webp').convert('RGBA')
closed=Image.open(ASSET/'ecu-closed.webp').convert('RGBA')
assert source.size==closed.size==(1120,840)
LID=[(320,0),(435,0),(560,15),(700,48),(845,90),(987,115),
(1105,189),(1117,262),(1093,315),(1026,386),(955,454),
(880,470),(789,432),(689,409),(589,367),(486,347),
(391,316),(287,293),(213,268),(140,285),(95,277),
(80,246),(99,197),(162,160),(204,107),(243,60)]
PCB=[(264,293),(344,286),(435,310),(564,337),(678,368),
(800,402),(930,438),(972,486),(981,588),(925,650),
(860,672),(755,639),(626,602),(530,579),(404,541),
(302,515),(194,483),(168,443),(185,387),(210,345)]
def mask_poly(points):
 m=Image.new('L',source.size,0)
 ImageDraw.Draw(m).polygon(points,fill=255)
 return m.filter(ImageFilter.GaussianBlur(.8))
def prepare(src,mask,name):
 pix=np.asarray(mask)
 bounds=Image.fromarray((pix>24).astype('uint8')*255).getbbox()
 if bounds is None:raise ValueError('empty foreground '+name)
 x0,y0,x1,y1=bounds
 x0=max(0,x0-32);y0=max(0,y0-32);x1=min(src.width,x1+32);y1=min(src.height,y1+32)
 rgba=src.copy()
 alpha=(np.asarray(src.getchannel('A'),dtype='uint16')*np.asarray(mask,dtype='uint16')//255).astype('uint8')
 rgba.putalpha(Image.fromarray(alpha))
 rgba=rgba.crop((x0,y0,x1,y1))
 scale=min(460/rgba.width,460/rgba.height)
 size=(max(1,round(rgba.width*scale)),max(1,round(rgba.height*scale)))
 img=rgba.resize(size,Image.Resampling.LANCZOS)
 output=Image.new('RGB',(512,512),(128,128,128))
 output.paste(img,((512-img.width)//2,(512-img.height)//2),img)
 output.save(OUT/(name+'.png'),optimize=True)
 return output
lid=mask_poly(LID);pcb=mask_poly(PCB)
alpha=np.asarray(source.getchannel('A'),dtype='uint16')
board_mask=Image.fromarray(np.minimum(np.asarray(pcb),255-np.asarray(lid)).astype('uint8'))
lower_mask=Image.fromarray((alpha*(255-np.maximum(np.asarray(lid),np.asarray(pcb)).astype('uint16'))//255).astype('uint8'))
for src,mask,name in [(source,lid,'lid'),(source,board_mask,'pcb'),(closed,closed.getchannel('A'),'closed'),(source,lower_mask,'base')]:
 prepare(src,mask,name)
print('Prepared four isolated ECU inputs. DO NOT PUBLISH without detailed visual acceptance.')
