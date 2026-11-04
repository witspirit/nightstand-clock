"""Offline only: python3 test/earth/render-brasschaat.py DAY.jpg NIGHT.jpg OUTDIR
Requires Pillow and NumPy. Inputs: north-up, -180..180 equirectangular maps.
Brasschaat approximate town center 51.293 N, 4.494 E; north up, east right.
Same inverse orthographic projection and sampling for both historical textures.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

out = Path(sys.argv[3])
out.mkdir(parents=True, exist_ok=True)
size = 1024  # 2x supersampling, final browser assets 512 square
lat0, lon0 = np.deg2rad([51.293, 4.494])
y, x = np.mgrid[:size, :size]
x = (x + .5 - size/2) / (size/2)
y = -(y + .5 - size/2) / (size/2)
inside = x*x + y*y <= 1
z = np.sqrt(np.maximum(0, 1-x*x-y*y))
latitude = np.arcsin(np.clip(y*np.cos(lat0)+z*np.sin(lat0), -1, 1))
longitude = lon0 + np.arctan2(x, z*np.cos(lat0)-y*np.sin(lat0))
for source, name in zip(sys.argv[1:3], ['day', 'night']):
    texture = np.asarray(Image.open(source).convert('RGB'), dtype=float)
    height, width = texture.shape[:2]
    u = ((longitude/(2*np.pi)+.5)*width-.5) % width
    v = np.clip((.5-latitude/np.pi)*height-.5, 0, height-1)
    u0, v0 = np.floor(u).astype(int), np.floor(v).astype(int)
    u1, v1 = (u0+1) % width, np.minimum(v0+1,height-1)
    fx, fy = (u-u0)[...,None], (v-v0)[...,None]
    color = (1-fy)*((1-fx)*texture[v0,u0]+fx*texture[v0,u1]) + fy*((1-fx)*texture[v1,u0]+fx*texture[v1,u1])
    color *= (.65+.35*z)[...,None]  # artistic neutral limb falloff, identical for both
    color[~inside] = 0
    Image.fromarray(np.uint8(np.clip(color,0,255))).resize((512,512), Image.Resampling.LANCZOS).save(out / (name+'.jpg'), quality=85, optimize=True)
