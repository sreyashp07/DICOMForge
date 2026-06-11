import glob
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from skimage import measure
from skimage.filters import threshold_otsu

from services.forge import _downsample, _enhance, _read_slices, _stack, _to_stl

SERIES = os.path.join(os.path.dirname(__file__), "..", "test_series")
OUT = os.path.join(
    os.path.dirname(__file__), "..", "..", "frontend", "public", "models"
)

files = sorted(glob.glob(os.path.join(SERIES, "*.dcm")))
if not files:
    raise SystemExit("Run make_test_series.py first")

streams = [open(f, "rb") for f in files]
slices = _read_slices(streams)
vol, spacing = _stack(slices)
small, sp = _downsample(vol, spacing, 110)
enh = _enhance(small)
level = float(threshold_otsu(enh))
verts, faces, _, _ = measure.marching_cubes(enh, level=level, spacing=sp)
buf, count = _to_stl(verts, faces)

os.makedirs(OUT, exist_ok=True)
path = os.path.join(OUT, "demo-shell.stl")
with open(path, "wb") as f:
    f.write(buf.read())
print(f"demo-shell.stl: {count} triangles, {os.path.getsize(path)/1024/1024:.2f} MB")
