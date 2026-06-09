from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # tightened to the Vercel domain in Phase 5

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "DicomForge backend"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
