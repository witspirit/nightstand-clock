"""Offline asset generation, not a browser dependency. Requires Pillow and NumPy.
Usage: python3 test/earth/render-frames.py /path/to/land_ocean_ice_2048.jpg /tmp/earth-frames
Output uses a zero-latitude orthographic view and neutral radial limb darkening.
No sunlight model, cloud synthesis, or current observations are involved.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

texture = np.asarray(Image.open(sys.argv[1]).convert("RGB"), dtype=float)
output = Path(sys.argv[2])
output.mkdir(parents=True, exist_ok=True)
# Supersample the globe edge and geography, then downsample to 512 pixels.
size = 1024
y, x = np.mgrid[:size, :size]
x = (x + 0.5 - size / 2) / (size / 2)
y = -(y + 0.5 - size / 2) / (size / 2)
inside = x*x + y*y <= 1
z = np.sqrt(np.maximum(0, 1 - x*x - y*y))
latitude = np.arcsin(np.clip(y, -1, 1))
height, width = texture.shape[:2]
v = np.clip((0.5 - latitude / np.pi) * height - 0.5, 0, height-1)
v0 = np.floor(v).astype(int)
v1 = np.minimum(v0+1, height-1)
fy = (v-v0)[..., None]
for index in range(12):
    longitude = np.arctan2(x, z) + np.deg2rad(-90 + index*30)
    u = ((longitude / (2*np.pi) + 0.5) * width - 0.5) % width
    u0 = np.floor(u).astype(int)
    u1 = (u0+1) % width
    fx = (u-u0)[..., None]
    color = ((1-fy)*((1-fx)*texture[v0,u0] + fx*texture[v0,u1])
             + fy*((1-fx)*texture[v1,u0] + fx*texture[v1,u1]))
    color *= (0.45 + 0.55*z)[..., None]
    color[~inside] = 0
    image = Image.fromarray(np.uint8(np.clip(color, 0, 255)))
    image.resize((512,512), Image.Resampling.LANCZOS).save(output / f"view-{index:02}.jpg", quality=80, optimize=True)
