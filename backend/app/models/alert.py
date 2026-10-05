from datetime import datetime, timezone

from bson import ObjectId


def create_alert_document(
    project_id: str,
    environment_id: str,
    resource_id: str | None = None,
    service_id: str | None = None,
    severity: str = "warning",
    title: str = "",
    message: str = "",
    status: str = "active",
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "_id": ObjectId(),
        "project_id": ObjectId(project_id),
        "environment_id": ObjectId(environment_id),
        "resource_id": ObjectId(resource_id) if resource_id else None,
        "service_id": ObjectId(service_id) if service_id else None,
        "severity": severity,
        "title": title,
        "message": message,
        "status": status,
        "created_at": now,
        "updated_at": now,
    }