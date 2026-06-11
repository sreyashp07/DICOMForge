from bson import ObjectId
from flask import Blueprint, jsonify, request
from pymongo.errors import DuplicateKeyError
from werkzeug.security import check_password_hash, generate_password_hash

from db import users
from utils.security import auth_required, issue_token, valid_email, valid_password

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _public(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
    }


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or len(name) < 2:
        return jsonify({"error": "Please provide your name"}), 400
    if not valid_email(email):
        return jsonify({"error": "That email address does not look valid"}), 400
    if not valid_password(password):
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    doc = {
        "name": name,
        "email": email,
        "password_hash": generate_password_hash(password),
    }
    try:
        result = users.insert_one(doc)
    except DuplicateKeyError:
        return jsonify({"error": "An account with this email already exists"}), 409

    token = issue_token(str(result.inserted_id), email)
    doc["_id"] = result.inserted_id
    return jsonify({"token": token, "user": _public(doc)}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = users.find_one({"email": email}) if valid_email(email) else None
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Incorrect email or password"}), 401

    token = issue_token(str(user["_id"]), email)
    return jsonify({"token": token, "user": _public(user)}), 200


@auth_bp.route("/me", methods=["GET"])
@auth_required
def me():
    user = users.find_one({"_id": ObjectId(request.user["sub"])})
    if not user:
        return jsonify({"error": "Account no longer exists"}), 404
    return jsonify({"user": _public(user)}), 200
