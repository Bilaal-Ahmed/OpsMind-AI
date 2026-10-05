from bson import ObjectId

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import database
from app.models.monitoring import create_monitoring_document
from app.models.alert import create_alert_document
from app.models.notification import create_notification_document


router = APIRouter(
    prefix="/api/monitoring",
    tags=["Monitoring"],
)


class MonitoringCreate(BaseModel):
    project_id: str
    environment_id: str
    resource_id: str | None = None
    service_id: str | None = None

    status: str = Field(
        default="healthy",
        max_length=50,
    )

    cpu_usage: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    memory_usage: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    disk_usage: float = Field(
        default=0.0,
        ge=0,
        le=100,
    )

    response_time: float = Field(
        default=0.0,
        ge=0,
    )


async def resolve_alert_if_active(
    project_id: str,
    environment_id: str,
    resource_id: str | None,
    service_id: str | None,
    severity: str,
    title: str,
):
    alert_filter = {
        "project_id": ObjectId(project_id),
        "environment_id": ObjectId(environment_id),
        "severity": severity,
        "title": title,
        "status": "active",
    }

    if resource_id:
        alert_filter["resource_id"] = ObjectId(resource_id)

    if service_id:
        alert_filter["service_id"] = ObjectId(service_id)

    active_alert = await database.alerts.find_one(alert_filter)

    if active_alert is None:
        return

    await database.alerts.update_one(
        {"_id": active_alert["_id"]},
        {
            "$set": {
                "status": "resolved",
                "updated_at": __import__(
                    "datetime"
                ).datetime.now(
                    __import__("datetime").timezone.utc
                ),
            }
        },
    )


@router.post("")
async def create_monitoring(monitoring: MonitoringCreate):
    # Validate project ID
    if not ObjectId.is_valid(monitoring.project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    # Validate environment ID
    if not ObjectId.is_valid(monitoring.environment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid environment ID",
        )

    # Validate resource ID
    if monitoring.resource_id and not ObjectId.is_valid(
        monitoring.resource_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid resource ID",
        )

    # Validate service ID
    if monitoring.service_id and not ObjectId.is_valid(
        monitoring.service_id
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid service ID",
        )

    # Check project
    project = await database.projects.find_one(
        {
            "_id": ObjectId(monitoring.project_id)
        }
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    # Check environment belongs to project
    environment = await database.environments.find_one(
        {
            "_id": ObjectId(monitoring.environment_id),
            "project_id": ObjectId(monitoring.project_id),
        }
    )

    if environment is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found for this project",
        )

    # Create monitoring document
    document = create_monitoring_document(
        project_id=monitoring.project_id,
        environment_id=monitoring.environment_id,
        resource_id=monitoring.resource_id,
        service_id=monitoring.service_id,
        status=monitoring.status,
        cpu_usage=monitoring.cpu_usage,
        memory_usage=monitoring.memory_usage,
        disk_usage=monitoring.disk_usage,
        response_time=monitoring.response_time,
    )

    await database.monitoring.insert_one(document)

    # =========================================================
    # CPU ALERT / RESOLUTION
    # =========================================================

    if monitoring.cpu_usage >= 80:
        alert_filter = {
            "project_id": ObjectId(monitoring.project_id),
            "environment_id": ObjectId(monitoring.environment_id),
            "severity": "critical",
            "title": "High CPU Usage Detected",
            "status": "active",
        }

        if monitoring.resource_id:
            alert_filter["resource_id"] = ObjectId(
                monitoring.resource_id
            )

        if monitoring.service_id:
            alert_filter["service_id"] = ObjectId(
                monitoring.service_id
            )

        existing_alert = await database.alerts.find_one(
            alert_filter
        )

        if existing_alert is None:
            alert = create_alert_document(
                project_id=monitoring.project_id,
                environment_id=monitoring.environment_id,
                resource_id=monitoring.resource_id,
                service_id=monitoring.service_id,
                severity="critical",
                title="High CPU Usage Detected",
                message=(
                    f"CPU usage has reached "
                    f"{monitoring.cpu_usage}%."
                ),
                status="active",
            )

            await database.alerts.insert_one(alert)

            notification = create_notification_document(
                project_id=monitoring.project_id,
                alert_id=str(alert["_id"]),
                title=alert["title"],
                message=alert["message"],
                severity=alert["severity"],
            )

            await database.notifications.insert_one(
                notification
            )
    else:
        await resolve_alert_if_active(
            monitoring.project_id,
            monitoring.environment_id,
            monitoring.resource_id,
            monitoring.service_id,
            "critical",
            "High CPU Usage Detected",
        )

    # =========================================================
    # MEMORY ALERT / RESOLUTION
    # =========================================================

    if monitoring.memory_usage >= 85:
        alert_filter = {
            "project_id": ObjectId(monitoring.project_id),
            "environment_id": ObjectId(monitoring.environment_id),
            "severity": "critical",
            "title": "High Memory Usage Detected",
            "status": "active",
        }

        if monitoring.resource_id:
            alert_filter["resource_id"] = ObjectId(
                monitoring.resource_id
            )

        if monitoring.service_id:
            alert_filter["service_id"] = ObjectId(
                monitoring.service_id
            )

        existing_alert = await database.alerts.find_one(
            alert_filter
        )

        if existing_alert is None:
            alert = create_alert_document(
                project_id=monitoring.project_id,
                environment_id=monitoring.environment_id,
                resource_id=monitoring.resource_id,
                service_id=monitoring.service_id,
                severity="critical",
                title="High Memory Usage Detected",
                message=(
                    f"Memory usage has reached "
                    f"{monitoring.memory_usage}%."
                ),
                status="active",
            )

            await database.alerts.insert_one(alert)

            notification = create_notification_document(
                project_id=monitoring.project_id,
                alert_id=str(alert["_id"]),
                title=alert["title"],
                message=alert["message"],
                severity=alert["severity"],
            )

            await database.notifications.insert_one(
                notification
            )
    else:
        await resolve_alert_if_active(
            monitoring.project_id,
            monitoring.environment_id,
            monitoring.resource_id,
            monitoring.service_id,
            "critical",
            "High Memory Usage Detected",
        )

    # =========================================================
    # DISK ALERT / RESOLUTION
    # =========================================================

    if monitoring.disk_usage >= 90:
        alert_filter = {
            "project_id": ObjectId(monitoring.project_id),
            "environment_id": ObjectId(monitoring.environment_id),
            "severity": "critical",
            "title": "High Disk Usage Detected",
            "status": "active",
        }

        if monitoring.resource_id:
            alert_filter["resource_id"] = ObjectId(
                monitoring.resource_id
            )

        if monitoring.service_id:
            alert_filter["service_id"] = ObjectId(
                monitoring.service_id
            )

        existing_alert = await database.alerts.find_one(
            alert_filter
        )

        if existing_alert is None:
            alert = create_alert_document(
                project_id=monitoring.project_id,
                environment_id=monitoring.environment_id,
                resource_id=monitoring.resource_id,
                service_id=monitoring.service_id,
                severity="critical",
                title="High Disk Usage Detected",
                message=(
                    f"Disk usage has reached "
                    f"{monitoring.disk_usage}%."
                ),
                status="active",
            )

            await database.alerts.insert_one(alert)

            notification = create_notification_document(
                project_id=monitoring.project_id,
                alert_id=str(alert["_id"]),
                title=alert["title"],
                message=alert["message"],
                severity=alert["severity"],
            )

            await database.notifications.insert_one(
                notification
            )
    else:
        await resolve_alert_if_active(
            monitoring.project_id,
            monitoring.environment_id,
            monitoring.resource_id,
            monitoring.service_id,
            "critical",
            "High Disk Usage Detected",
        )

    # =========================================================
    # RESPONSE TIME ALERT / RESOLUTION
    # =========================================================

    if monitoring.response_time >= 1000:
        alert_filter = {
            "project_id": ObjectId(monitoring.project_id),
            "environment_id": ObjectId(monitoring.environment_id),
            "severity": "warning",
            "title": "High Response Time Detected",
            "status": "active",
        }

        if monitoring.resource_id:
            alert_filter["resource_id"] = ObjectId(
                monitoring.resource_id
            )

        if monitoring.service_id:
            alert_filter["service_id"] = ObjectId(
                monitoring.service_id
            )

        existing_alert = await database.alerts.find_one(
            alert_filter
        )

        if existing_alert is None:
            alert = create_alert_document(
                project_id=monitoring.project_id,
                environment_id=monitoring.environment_id,
                resource_id=monitoring.resource_id,
                service_id=monitoring.service_id,
                severity="warning",
                title="High Response Time Detected",
                message=(
                    f"Response time has reached "
                    f"{monitoring.response_time} ms."
                ),
                status="active",
            )

            await database.alerts.insert_one(alert)

            notification = create_notification_document(
                project_id=monitoring.project_id,
                alert_id=str(alert["_id"]),
                title=alert["title"],
                message=alert["message"],
                severity=alert["severity"],
            )

            await database.notifications.insert_one(
                notification
            )
    else:
        await resolve_alert_if_active(
            monitoring.project_id,
            monitoring.environment_id,
            monitoring.resource_id,
            monitoring.service_id,
            "warning",
            "High Response Time Detected",
        )

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
        "status": document["status"],
        "cpu_usage": document["cpu_usage"],
        "memory_usage": document["memory_usage"],
        "disk_usage": document["disk_usage"],
        "response_time": document["response_time"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


@router.get("/environment/{environment_id}")
async def list_environment_monitoring(
    environment_id: str,
):
    if not ObjectId.is_valid(environment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid environment ID",
        )

    environment = await database.environments.find_one(
        {
            "_id": ObjectId(environment_id)
        }
    )

    if environment is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    monitoring_records = []

    async for record in database.monitoring.find(
        {
            "environment_id": ObjectId(environment_id)
        }
    ).sort("created_at", -1):

        service_name = None
        resource_name = None

        if record.get("resource_id"):
            resource = await database.resources.find_one(
                {
                    "_id": record["resource_id"]
                }
            )

            if resource:
                resource_name = resource["name"]

        if record.get("service_id"):
            service = await database.services.find_one(
                {
                    "_id": record["service_id"]
                }
            )

            if service:
                service_name = service["name"]

        monitoring_records.append(
            {
                "id": str(record["_id"]),
                "project_id": str(record["project_id"]),
                "environment_id": str(record["environment_id"]),
                "resource_id": (
                    str(record["resource_id"])
                    if record.get("resource_id")
                    else None
                ),
                "resource_name": resource_name,
                "service_id": (
                    str(record["service_id"])
                    if record.get("service_id")
                    else None
                ),
                "service_name": service_name,
                "status": record["status"],
                "cpu_usage": record["cpu_usage"],
                "memory_usage": record["memory_usage"],
                "disk_usage": record["disk_usage"],
                "response_time": record["response_time"],
                "created_at": record["created_at"],
                "updated_at": record["updated_at"],
            }
        )

    return monitoring_records