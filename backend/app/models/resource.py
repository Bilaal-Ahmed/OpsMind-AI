from datetime import datetime, timezone

from bson import ObjectId


def create_resource_document(
    project_id: str,
    environment_id: str,
    name: str,
    resource_type: str,
    provider: str = "custom",
    status: str = "active",
    description: str = "",
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "_id": ObjectId(),
        "project_id": ObjectId(project_id),
        "environment_id": ObjectId(environment_id),
        "name": name,
        "resource_type": resource_type,
        "provider": provider,
        "status": status,
        "description": description,
        "created_at": now,
        "updated_at": now,
    }