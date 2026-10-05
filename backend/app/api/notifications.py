from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.core.database import database


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
)


@router.get("/project/{project_id}")
async def list_project_notifications(
    project_id: str,
):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    project = await database.projects.find_one(
        {"_id": ObjectId(project_id)}
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    notifications = []

    async for notification in database.notifications.find(
        {"project_id": ObjectId(project_id)}
    ).sort("created_at", -1):

        notifications.append(
            {
                "id": str(notification["_id"]),
                "project_id": str(notification["project_id"]),
                "alert_id": str(notification["alert_id"]),
                "title": notification["title"],
                "message": notification["message"],
                "severity": notification["severity"],
                "is_read": notification["is_read"],
                "created_at": notification["created_at"],
                "read_at": notification["read_at"],
            }
        )

    return notifications


@router.get("/project/{project_id}/unread-count")
async def count_unread_notifications(
    project_id: str,
):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    project = await database.projects.find_one(
        {"_id": ObjectId(project_id)}
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    total = await database.notifications.count_documents(
        {
            "project_id": ObjectId(project_id),
            "is_read": False,
        }
    )

    return {
        "total": total,
    }


@router.patch("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
):
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid notification ID",
        )

    notification_object_id = ObjectId(notification_id)

    notification = await database.notifications.find_one(
        {"_id": notification_object_id}
    )

    if notification is None:
        raise HTTPException(
            status_code=404,
            detail="Notification not found",
        )

    now = datetime.now(timezone.utc)

    await database.notifications.update_one(
        {"_id": notification_object_id},
        {
            "$set": {
                "is_read": True,
                "read_at": now,
            }
        },
    )

    return {
        "message": "Notification marked as read",
        "id": notification_id,
    }