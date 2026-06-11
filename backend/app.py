from flask import Flask, jsonify
from flask_cors import CORS

import config
from routes.auth import auth_bp

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": [config.FRONTEND_ORIGIN]}},
    supports_credentials=False,
)

app.register_blueprint(auth_bp)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "DicomForge backend"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
