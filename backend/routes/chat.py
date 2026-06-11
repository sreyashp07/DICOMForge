from flask import Blueprint, jsonify, request

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")

INTENTS = [
    (("what", "dicomforge"), "DicomForge converts a series of 2D DICOM slices from CT or MRI into a single accurate 3D STL mesh you can inspect, study and print. The whole pipeline is deterministic and runs in memory."),
    (("what", "is", "this"), "This is DicomForge, a forge that turns DICOM medical imaging series into 3D STL models. Ask me about uploading, limits, accuracy or printing."),
    (("upload", ), "Open the Forge Floor from the access icon, then use the Forge Intake panel on the right. Select between 8 and 40 .dcm slices from one series and the forge handles the rest."),
    (("slice", "limit"), "Each forge accepts 8 to 40 DICOM slices. The cap keeps every conversion safely inside the deployment memory ceiling so a forge never fails midway."),
    (("40", ), "The 40-slice cap keeps every forge inside the memory ceiling of the deployment, so conversions always complete. It is enforced in the browser and on the server."),
    (("format", "file", "type"), "Standard DICOM files with the .dcm extension from a CT or MRI series. The output is a watertight binary STL, ready for any slicer or 3D viewer."),
    (("accura", "precise"), "Extraction uses the marching cubes algorithm on a CLAHE and gamma enhanced volume. It is fully deterministic: the same scan always forges the same geometry, with no ML approximation."),
    (("print", "3d print"), "Yes. The forge outputs watertight binary STL, the native input of every mainstream slicer. Download the model from the Specimen panel and print directly."),
    (("privacy", "data", "stored", "secure"), "Nothing is stored. Slices are parsed, processed and discarded in memory, and the STL is streamed back without ever touching a disk."),
    (("account", "login", "sign"), "Use the access icon next to the menu, or open Access from the menu. Sign up with your name, email and a password of at least 8 characters."),
    (("password", ), "Passwords need at least 8 characters and are stored only as secure hashes. If sign in fails, the form will tell you exactly what went wrong."),
    (("slow", "wait", "minute", "warming", "cold"), "The forge sleeps when idle to stay lightweight. The first request after sleep can take up to a minute to wake it; everything after that is fast."),
    (("demo", "archive", "model"), "The Archive list on the Forge Floor holds pre-loaded study models. Click any entry and it materialises on the floor for inspection."),
    (("rotate", "pause", "zoom", "control"), "Drag the hologram to orbit, scroll to zoom, and use Pause Rotation in the Specimen panel to hold it still for study."),
    (("download", ), "After a forge completes, the Download STL button appears in the Specimen panel on the left. Demo models are view-only."),
    (("hello", "hi", "hey"), "Hello. I am the Forge Guide. Ask me anything about converting DICOM series, the limits, accuracy, printing or your account."),
    (("thank", ), "Anytime. The forge is ready when you are."),
]

FALLBACK = "I can help with uploading DICOM series, slice limits, accuracy, printing, privacy and accounts. Try asking about one of those."


@chat_bp.route("", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip().lower()
    if not message:
        return jsonify({"error": "Say something and I will answer"}), 400
    if len(message) > 500:
        return jsonify({"error": "Keep questions under 500 characters"}), 400

    best, score = None, 0
    for keywords, answer in INTENTS:
        hits = sum(1 for k in keywords if k in message)
        if hits > score:
            best, score = answer, hits

    return jsonify({"reply": best or FALLBACK}), 200
