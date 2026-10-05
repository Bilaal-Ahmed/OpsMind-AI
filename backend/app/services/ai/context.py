from app.core.database import database


async def build_opsmind_context() -> dict:
    projects = await database.projects.find().to_list(length=100)

    environments = await database.environments.find().to_list(
        length=200
    )

    resources = await database.resources.find().to_list(
        length=200
    )

    services = await database.services.find().to_list(
        length=200
    )

    monitoring = await database.monitoring.find().sort(
        "created_at",
        -1,
    ).to_list(length=100)

    alerts = await database.alerts.find().sort(
        "created_at",
        -1,
    ).to_list(length=100)

    return {
        "projects": [
            {
                "id": str(item["_id"]),
                "name": item.get("name", ""),
                "description": item.get(
                    "description",
                    "",
                ),
                "status": item.get(
                    "status",
                    "",
                ),
            }
            for item in projects
        ],
        "environments": [
            {
                "id": str(item["_id"]),
                "project_id": str(
                    item.get("project_id")
                ),
                "name": item.get("name", ""),
                "status": item.get(
                    "status",
                    "",
                ),
            }
            for item in environments
        ],
        "resources": [
            {
                "id": str(item["_id"]),
                "project_id": str(
                    item.get("project_id")
                ),
                "environment_id": str(
                    item.get("environment_id")
                ),
                "name": item.get("name", ""),
                "resource_type": item.get(
                    "resource_type",
                    "",
                ),
                "provider": item.get(
                    "provider",
                    "",
                ),
                "status": item.get(
                    "status",
                    "",
                ),
            }
            for item in resources
        ],
        "services": [
            {
                "id": str(item["_id"]),
                "project_id": str(
                    item.get("project_id")
                ),
                "environment_id": str(
                    item.get("environment_id")
                ),
                "name": item.get("name", ""),
                "service_type": item.get(
                    "service_type",
                    "",
                ),
                "provider": item.get(
                    "provider",
                    "",
                ),
                "status": item.get(
                    "status",
                    "",
                ),
            }
            for item in services
        ],
        "monitoring": [
            {
                "environment_id": str(
                    item.get("environment_id")
                ),
                "resource_id": (
                    str(item["resource_id"])
                    if item.get("resource_id")
                    else None
                ),
                "service_id": (
                    str(item["service_id"])
                    if item.get("service_id")
                    else None
                ),
                "status": item.get(
                    "status",
                    "",
                ),
                "cpu_usage": item.get(
                    "cpu_usage",
                    0,
                ),
                "memory_usage": item.get(
                    "memory_usage",
                    0,
                ),
                "disk_usage": item.get(
                    "disk_usage",
                    0,
                ),
                "response_time": item.get(
                    "response_time",
                    0,
                ),
            }
            for item in monitoring
        ],
        "alerts": [
            {
                "id": str(item["_id"]),
                "environment_id": str(
                    item.get("environment_id")
                ),
                "resource_id": (
                    str(item["resource_id"])
                    if item.get("resource_id")
                    else None
                ),
                "service_id": (
                    str(item["service_id"])
                    if item.get("service_id")
                    else None
                ),
                "severity": item.get(
                    "severity",
                    "",
                ),
                "title": item.get(
                    "title",
                    "",
                ),
                "message": item.get(
                    "message",
                    "",
                ),
                "status": item.get(
                    "status",
                    "",
                ),
            }
            for item in alerts
        ],
    }