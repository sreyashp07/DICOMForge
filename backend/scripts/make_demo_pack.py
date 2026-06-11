import os
import sys

import numpy as np
from scipy.ndimage import gaussian_filter
from skimage import measure

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from services.forge import _to_stl

OUT = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "models")
os.makedirs(OUT, exist_ok=True)

N = 76


def grid():
    z, y, x = np.mgrid[0:N, 0:N, 0:N].astype(np.float32)
    c = (N - 1) / 2
    return (z - c) / c, (y - c) / c, (x - c) / c


def save(name, mask):
    field = gaussian_filter(mask.astype(np.float32), sigma=1.3)
    verts, faces, _, _ = measure.marching_cubes(field, level=0.5, spacing=(1.4, 1.0, 1.0))
    buf, count = _to_stl(verts, faces)
    path = os.path.join(OUT, name)
    with open(path, "wb") as f:
        f.write(buf.read())
    print(f"{name}: {count} tris, {os.path.getsize(path)/1024/1024:.2f} MB")


z, y, x = grid()
r_xy = np.sqrt(x**2 + y**2)

save("demo-thoracic.stl", (r_xy > 0.5) & (r_xy < 0.68) & (np.abs(z) < 0.75) & ((np.sin(z * 14) > -0.25) | (np.abs(y) < 0.18)))

save("demo-pelvic.stl", (np.sqrt(x**2 + y**2) - 0.52) ** 2 + z**2 < 0.2**2)

cap = ((r_xy < 0.15) & (np.abs(z) < 0.58))
cap |= (x**2 + y**2 + ((z - 0.58) / 1.0) ** 2) < 0.24**2
cap |= ((x - 0.12) ** 2 + y**2 + ((z + 0.58) / 1.0) ** 2) < 0.2**2
cap |= ((x + 0.12) ** 2 + y**2 + ((z + 0.58) / 1.0) ** 2) < 0.2**2
save("demo-femur.stl", cap)

vert = np.zeros_like(z, dtype=bool)
for zc in (-0.5, 0.0, 0.5):
    vert |= (np.sqrt(x**2 + y**2) - 0.42) ** 2 + (z - zc) ** 2 < 0.13**2
save("demo-vertebral.stl", vert)

mand = ((np.sqrt(x**2 + y**2) - 0.5) ** 2 + z**2 < 0.14**2) & (y < 0.12)
mand |= ((x - 0.5) ** 2 + (y - 0.05) ** 2 < 0.1**2) & (z > -0.05) & (z < 0.55)
mand |= ((x + 0.5) ** 2 + (y - 0.05) ** 2 < 0.1**2) & (z > -0.05) & (z < 0.55)
save("demo-mandible.stl", mand)

plate = np.abs(x - 0.3 * np.sin(y * 2.2)) < 0.07
bound = (np.abs(y) < 0.7) & (z > -0.7 + 0.6 * y) & (z < 0.65)
save("demo-scapula.stl", plate & bound)
