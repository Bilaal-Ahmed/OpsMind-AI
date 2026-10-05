from datetime import datetime, timezone

from bson import ObjectId


def create_project_document(name: str, description: str = "") -> dict:
    now = datetime.now(timezone.utc)

    return {
        "_id": ObjectId(),
        "name": name,
        "description": description,
        "status": "active",
        "created_at": now,
        "updated_at": now,
    }