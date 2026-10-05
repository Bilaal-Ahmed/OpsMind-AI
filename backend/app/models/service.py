from datetime import datetime, timezone

from bson import ObjectId


def create_service_document(
    project_id: str,
    environment_id: str,
    name: str,
    service_type: str,
    provider: str = "custom",
    status: str = "active",
    description: str = "",
    resource_id: str | None = None,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "_id": ObjectId(),
        "project_id": ObjectId(project_id),
        "environment_id": ObjectId(environment_id),
        "resource_id": ObjectId(resource_id) if resource_id else None,
        "name": name,
        "service_type": service_type,
        "provider": provider,
        "status": status,
        "description": description,
        "created_at": now,
        "updated_at": now,
    }