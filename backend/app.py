from flask import Flask, jsonify
from flask_cors import CORS

import config
from routes.auth import auth_bp
from routes.forge import forge_bp

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 64 * 1024 * 1024

CORS(
    app,
    resources={r"/api/*": {"origins": [config.FRONTEND_ORIGIN]}},
    supports_credentials=False,
)

app.register_blueprint(auth_bp)
app.register_blueprint(forge_bp)


@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": "Upload too large. Keep the series under 64 MB"}), 413


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "DicomForge backend"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
