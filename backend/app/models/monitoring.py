from datetime import datetime, timezone

from bson import ObjectId


def create_monitoring_document(
    project_id: str,
    environment_id: str,
    resource_id: str | None = None,
    service_id: str | None = None,
    status: str = "healthy",
    cpu_usage: float = 0.0,
    memory_usage: float = 0.0,
    disk_usage: float = 0.0,
    response_time: float = 0.0,
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "_id": ObjectId(),
        "project_id": ObjectId(project_id),
        "environment_id": ObjectId(environment_id),
        "resource_id": ObjectId(resource_id) if resource_id else None,
        "service_id": ObjectId(service_id) if service_id else None,
        "status": status,
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "disk_usage": disk_usage,
        "response_time": response_time,
        "created_at": now,
        "updated_at": now,
    }