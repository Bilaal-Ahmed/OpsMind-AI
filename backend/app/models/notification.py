from datetime import datetime, timezone

from bson import ObjectId


def create_notification_document(
    project_id: str,
    alert_id: str,
    title: str,
    message: str,
    severity: str = "warning",
) -> dict:
    now = datetime.now(timezone.utc)

    return {
        "_id": ObjectId(),
        "project_id": ObjectId(project_id),
        "alert_id": ObjectId(alert_id),
        "title": title,
        "message": message,
        "severity": severity,
        "is_read": False,
        "created_at": now,
        "read_at": None,
    }