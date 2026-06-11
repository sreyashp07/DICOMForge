from flask import Blueprint, jsonify, request, send_file

from services.forge import MAX_SLICES, ForgeError, run_forge
from utils.security import auth_required

forge_bp = Blueprint("forge", __name__, url_prefix="/api/forge")


@forge_bp.route("", methods=["POST"])
@auth_required
def forge():
    files = request.files.getlist("slices")
    if not files:
        return jsonify({"error": "Attach your DICOM slices in the slices field"}), 400
    if len(files) > MAX_SLICES:
        return jsonify({"error": f"A maximum of {MAX_SLICES} slices per forge is allowed"}), 413

    try:
        stl, count = run_forge([f.stream for f in files])
    except ForgeError as e:
        return jsonify({"error": str(e)}), 422
    except Exception:
        return jsonify({"error": "The forge failed on this series. Please verify the files"}), 500

    response = send_file(
        stl,
        mimetype="model/stl",
        as_attachment=True,
        download_name="dicomforge.stl",
    )
    response.headers["X-Triangle-Count"] = str(count)
    response.headers["Access-Control-Expose-Headers"] = "X-Triangle-Count"
    return response
