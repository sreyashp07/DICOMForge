# DicomForge

Converts a series of 2D DICOM slices into an accurate 3D STL mesh.
Pipeline: pydicom -> CLAHE + gamma (scikit-image) -> marching cubes -> binary STL.

## Structure
- `frontend/` — Next.js (TypeScript, Tailwind), deployed to Vercel
- `backend/`  — Flask (Python 3.11), deployed to Render

## Constraints
- Backend footprint kept under ~300 MB (Render free tier, 512 MB RAM)
- Max 40 DICOM slices per request, with a pixel-resolution downsample guard
