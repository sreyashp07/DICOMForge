import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI", "")
JWT_SECRET = os.environ.get("JWT_SECRET", "")
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")
JWT_EXPIRY_DAYS = 7

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is not set. Create backend/.env from .env.example")
if not JWT_SECRET or JWT_SECRET == "change-me":
    raise RuntimeError("JWT_SECRET is not set to a secure value in backend/.env")
