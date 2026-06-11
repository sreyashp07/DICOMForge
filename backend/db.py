from pymongo import MongoClient, ASCENDING
import config

_client = MongoClient(config.MONGO_URI, serverSelectionTimeoutMS=8000)
db = _client.get_database("dicomforge")

users = db.get_collection("users")
users.create_index([("email", ASCENDING)], unique=True)
