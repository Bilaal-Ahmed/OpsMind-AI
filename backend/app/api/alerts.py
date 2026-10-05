from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime, timezone

from app.core.database import database
from app.models.alert import create_alert_document
from app.models.notification import create_notification_document

router = APIRouter(
    prefix="/api/alerts",
    tags=["Alerts"],
)


class AlertCreate(BaseModel):
    project_id: str
    environment_id: str
    resource_id: str | None = None
    service_id: str | None = None

    severity: str = Field(
        default="warning",
        max_length=50,
    )

    title: str = Field(
        min_length=1,
        max_length=200,
    )

    message: str = Field(
        default="",
        max_length=1000,
    )

    status: str = Field(
        default="active",
        max_length=50,
    )


@router.post("")
async def create_alert(alert: AlertCreate):
    if not ObjectId.is_valid(alert.project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    if not ObjectId.is_valid(alert.environment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid environment ID",
        )

    if alert.resource_id and not ObjectId.is_valid(alert.resource_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid resource ID",
        )

    if alert.service_id and not ObjectId.is_valid(alert.service_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid service ID",
        )

    project = await database.projects.find_one(
        {"_id": ObjectId(alert.project_id)}
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    environment = await database.environments.find_one(
        {
            "_id": ObjectId(alert.environment_id),
            "project_id": ObjectId(alert.project_id),
        }
    )

    if environment is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found for this project",
        )

    if alert.resource_id:
        resource = await database.resources.find_one(
            {
                "_id": ObjectId(alert.resource_id),
                "environment_id": ObjectId(alert.environment_id),
                "project_id": ObjectId(alert.project_id),
            }
        )

        if resource is None:
            raise HTTPException(
                status_code=404,
                detail="Resource not found for this environment",
            )

    if alert.service_id:
        service = await database.services.find_one(
            {
                "_id": ObjectId(alert.service_id),
                "environment_id": ObjectId(alert.environment_id),
                "project_id": ObjectId(alert.project_id),
            }
        )

        if service is None:
            raise HTTPException(
                status_code=404,
                detail="Service not found for this environment",
            )

    document = create_alert_document(
        project_id=alert.project_id,
        environment_id=alert.environment_id,
        resource_id=alert.resource_id,
        service_id=alert.service_id,
        severity=alert.severity,
        title=alert.title,
        message=alert.message,
        status=alert.status,
    )

    await database.alerts.insert_one(document)

    notification = create_notification_document(
    project_id=alert.project_id,
    alert_id=str(document["_id"]),
    title=alert.title,
    message=alert.message,
    severity=alert.severity,
    )

    await database.notifications.insert_one(notification)

    return {
        "id": str(document["_id"]),
        "project_id": str(document["project_id"]),
        "environment_id": str(document["environment_id"]),
        "resource_id": (
            str(document["resource_id"])
            if document["resource_id"]
            else None
        ),
        "service_id": (
            str(document["service_id"])
            if document["service_id"]
            else None
        ),
        "severity": document["severity"],
        "title": document["title"],
        "message": document["message"],
        "status": document["status"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


@router.get("/environment/{environment_id}")
async def list_environment_alerts(environment_id: str):
    if not ObjectId.is_valid(environment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid environment ID",
        )

    environment = await database.environments.find_one(
        {"_id": ObjectId(environment_id)}
    )

    if environment is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    alerts = []

    async for alert in database.alerts.find(
        {"environment_id": ObjectId(environment_id)}
    ).sort("created_at", -1):

        resource_name = None
        service_name = None

        if alert.get("resource_id"):
            resource = await database.resources.find_one(
                {"_id": alert["resource_id"]}
            )

            if resource:
                resource_name = resource["name"]

        if alert.get("service_id"):
            service = await database.services.find_one(
                {"_id": alert["service_id"]}
            )

            if service:
                service_name = service["name"]

        alerts.append(
            {
                "id": str(alert["_id"]),
                "project_id": str(alert["project_id"]),
                "environment_id": str(alert["environment_id"]),
                "resource_id": (
                    str(alert["resource_id"])
                    if alert.get("resource_id")
                    else None
                ),
                "resource_name": resource_name,
                "service_id": (
                    str(alert["service_id"])
                    if alert.get("service_id")
                    else None
                ),
                "service_name": service_name,
                "severity": alert["severity"],
                "title": alert["title"],
                "message": alert["message"],
                "status": alert["status"],
                "created_at": alert["created_at"],
                "updated_at": alert["updated_at"],
            }
        )

    return alerts


@router.get("/count")
async def count_active_alerts():
    total = await database.alerts.count_documents(
        {"status": "active"}
    )

    return {
        "total": total,
    }

@router.patch("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    if not ObjectId.is_valid(alert_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid alert ID",
        )

    alert_object_id = ObjectId(alert_id)

    alert = await database.alerts.find_one(
        {
            "_id": alert_object_id
        }
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found",
        )

    if alert["status"] == "resolved":
        raise HTTPException(
            status_code=400,
            detail="Resolved alert cannot be acknowledged",
        )

    await database.alerts.update_one(
        {
            "_id": alert_object_id
        },
        {
            "$set": {
                "status": "acknowledged",
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    return {
        "message": "Alert acknowledged",
        "id": alert_id,
        "status": "acknowledged",
    }
@router.patch("/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    if not ObjectId.is_valid(alert_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid alert ID",
        )

    alert_object_id = ObjectId(alert_id)

    alert = await database.alerts.find_one(
        {
            "_id": alert_object_id
        }
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found",
        )

    if alert["status"] == "resolved":
        raise HTTPException(
            status_code=400,
            detail="Alert is already resolved",
        )

    await database.alerts.update_one(
        {
            "_id": alert_object_id
        },
        {
            "$set": {
                "status": "resolved",
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )

    return {
        "message": "Alert resolved",
        "id": alert_id,
        "status": "resolved",
    }