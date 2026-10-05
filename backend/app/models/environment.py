from datetime import datetime, timezone

from bson import ObjectId


def create_environment_document(
    project_id: str,
    name: str,
    description: str = "",
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "_id": ObjectId(),
        "project_id": ObjectId(project_id),
        "name": name,
        "description": description,
        "status": "active",
        "created_at": now,
        "updated_at": now,
    }