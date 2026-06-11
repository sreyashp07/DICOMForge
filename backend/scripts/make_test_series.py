import os

import numpy as np
import pydicom
from pydicom.dataset import FileDataset, FileMetaDataset
from pydicom.uid import CTImageStorage, ExplicitVRLittleEndian, generate_uid

OUT = os.path.join(os.path.dirname(__file__), "..", "test_series")
N, SIZE = 36, 128

os.makedirs(OUT, exist_ok=True)
series_uid = generate_uid()
study_uid = generate_uid()

zz, yy, xx = np.mgrid[0:N, 0:SIZE, 0:SIZE]
cz, cy, cx = N / 2, SIZE / 2, SIZE / 2

outer = np.sqrt(
    ((zz - cz) / (N / 2.4)) ** 2
    + ((yy - cy) / (SIZE / 3.0)) ** 2
    + ((xx - cx) / (SIZE / 2.7)) ** 2
)
inner = np.sqrt(
    ((zz - cz) / (N / 3.1)) ** 2
    + ((yy - cy) / (SIZE / 3.9)) ** 2
    + ((xx - cx) / (SIZE / 3.5)) ** 2
)

vol = np.zeros((N, SIZE, SIZE), dtype=np.int16)
vol[outer < 1.0] = 1000
vol[inner < 1.0] = 120
rng = np.random.default_rng(7)
vol = (vol + rng.normal(0, 12, vol.shape)).astype(np.int16)

for i in range(N):
    meta = FileMetaDataset()
    meta.MediaStorageSOPClassUID = CTImageStorage
    meta.MediaStorageSOPInstanceUID = generate_uid()
    meta.TransferSyntaxUID = ExplicitVRLittleEndian

    ds = FileDataset(None, {}, file_meta=meta, preamble=b"\x00" * 128)
    ds.SOPClassUID = CTImageStorage
    ds.SOPInstanceUID = meta.MediaStorageSOPInstanceUID
    ds.Modality = "CT"
    ds.SeriesInstanceUID = series_uid
    ds.StudyInstanceUID = study_uid
    ds.InstanceNumber = i + 1
    ds.ImagePositionPatient = [0.0, 0.0, float(i) * 2.0]
    ds.PixelSpacing = [1.0, 1.0]
    ds.SliceThickness = 2.0
    ds.Rows = SIZE
    ds.Columns = SIZE
    ds.BitsAllocated = 16
    ds.BitsStored = 16
    ds.HighBit = 15
    ds.PixelRepresentation = 1
    ds.SamplesPerPixel = 1
    ds.PhotometricInterpretation = "MONOCHROME2"
    ds.RescaleSlope = 1
    ds.RescaleIntercept = 0
    ds.PixelData = vol[i].tobytes()
    ds.save_as(os.path.join(OUT, f"slice_{i:03d}.dcm"), enforce_file_format=True)

print(f"Wrote {N} slices to {os.path.abspath(OUT)}")
