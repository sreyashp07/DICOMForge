import io
import struct

import numpy as np
import pydicom
from skimage import exposure, measure, transform
from skimage.filters import threshold_otsu

MAX_SLICES = 40
MIN_SLICES = 8
MAX_DIM = 256
MAX_FACES = 350_000


class ForgeError(ValueError):
    pass


def _read_slices(streams):
    slices = []
    for s in streams:
        try:
            ds = pydicom.dcmread(s, force=True)
            _ = ds.pixel_array
        except Exception:
            raise ForgeError("One of the files is not a readable DICOM slice")
        slices.append(ds)

    def sort_key(ds):
        ipp = getattr(ds, "ImagePositionPatient", None)
        if ipp is not None and len(ipp) == 3:
            return float(ipp[2])
        return float(getattr(ds, "InstanceNumber", 0) or 0)

    slices.sort(key=sort_key)
    return slices


def _stack(slices):
    arrs = []
    shape = None
    for ds in slices:
        a = ds.pixel_array.astype(np.float32)
        slope = float(getattr(ds, "RescaleSlope", 1) or 1)
        intercept = float(getattr(ds, "RescaleIntercept", 0) or 0)
        a = a * slope + intercept
        if shape is None:
            shape = a.shape
        elif a.shape != shape:
            raise ForgeError("All slices must share the same resolution")
        arrs.append(a)
    vol = np.stack(arrs)

    ds0 = slices[0]
    try:
        py, px = (float(v) for v in ds0.PixelSpacing)
    except Exception:
        py = px = 1.0
    try:
        if len(slices) > 1:
            z0 = float(slices[0].ImagePositionPatient[2])
            z1 = float(slices[1].ImagePositionPatient[2])
            pz = abs(z1 - z0) or float(getattr(ds0, "SliceThickness", 1) or 1)
        else:
            pz = float(getattr(ds0, "SliceThickness", 1) or 1)
    except Exception:
        pz = float(getattr(ds0, "SliceThickness", 1) or 1)

    return vol, (pz, py, px)


def _downsample(vol, spacing, max_dim):
    z, y, x = vol.shape
    m = max(y, x)
    if m <= max_dim:
        return vol, spacing
    scale = max_dim / m
    ny, nx = max(int(y * scale), 16), max(int(x * scale), 16)
    out = transform.resize(
        vol, (z, ny, nx), preserve_range=True, anti_aliasing=True
    ).astype(np.float32)
    pz, py, px = spacing
    return out, (pz, py * y / ny, px * x / nx)


def _enhance(vol, gamma=0.85):
    vmin, vmax = float(vol.min()), float(vol.max())
    if vmax - vmin < 1e-6:
        raise ForgeError("The series has no contrast to reconstruct")
    norm = (vol - vmin) / (vmax - vmin)
    eq = np.empty_like(norm)
    for i in range(norm.shape[0]):
        eq[i] = exposure.equalize_adapthist(norm[i], clip_limit=0.02)
    return exposure.adjust_gamma(eq, gamma)


def _to_stl(verts, faces):
    tri = verts[faces].astype(np.float32)
    v1 = tri[:, 1] - tri[:, 0]
    v2 = tri[:, 2] - tri[:, 0]
    normals = np.cross(v1, v2)
    lens = np.linalg.norm(normals, axis=1)
    lens[lens == 0] = 1.0
    normals = (normals / lens[:, None]).astype(np.float32)

    count = tri.shape[0]
    rec = np.zeros(count, dtype=[("n", "<f4", 3), ("v", "<f4", 9), ("attr", "<u2")])
    rec["n"] = normals
    rec["v"] = tri.reshape(count, 9)

    buf = io.BytesIO()
    buf.write(b"DicomForge binary STL".ljust(80, b"\x00"))
    buf.write(struct.pack("<I", count))
    buf.write(rec.tobytes())
    buf.seek(0)
    return buf, count


def run_forge(streams):
    n = len(streams)
    if n < MIN_SLICES:
        raise ForgeError(f"At least {MIN_SLICES} slices are needed for a meaningful volume")
    if n > MAX_SLICES:
        raise ForgeError(f"A maximum of {MAX_SLICES} slices per forge is allowed")

    slices = _read_slices(streams)
    vol, spacing = _stack(slices)

    max_dim = MAX_DIM
    while True:
        small, sp = _downsample(vol, spacing, max_dim)
        enh = _enhance(small)
        level = float(threshold_otsu(enh))
        verts, faces, _, _ = measure.marching_cubes(enh, level=level, spacing=sp)
        if len(faces) <= MAX_FACES or max_dim <= 96:
            break
        max_dim = int(max_dim * 0.7)

    if len(faces) == 0:
        raise ForgeError("No surface could be extracted from this series")

    return _to_stl(verts, faces)
