from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import database
from app.models.service import create_service_document


router = APIRouter(
    prefix="/api/services",
    tags=["Services"],
)


class ServiceCreate(BaseModel):
    project_id: str
    environment_id: str
    resource_id: str | None = None
    name: str = Field(min_length=1, max_length=100)
    service_type: str = Field(min_length=1, max_length=100)
    provider: str = Field(default="custom", max_length=100)
    status: str = Field(default="active", max_length=50)
    description: str = Field(default="", max_length=500)


@router.post("")
async def create_service(service: ServiceCreate):
    if not ObjectId.is_valid(service.project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    if not ObjectId.is_valid(service.environment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid environment ID",
        )

    if service.resource_id and not ObjectId.is_valid(service.resource_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid resource ID",
        )

    project = await database.projects.find_one(
        {"_id": ObjectId(service.project_id)}
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    environment = await database.environments.find_one(
        {
            "_id": ObjectId(service.environment_id),
            "project_id": ObjectId(service.project_id),
        }
    )

    if environment is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found for this project",
        )

    if service.resource_id:
        resource = await database.resources.find_one(
            {
                "_id": ObjectId(service.resource_id),
                "environment_id": ObjectId(service.environment_id),
                "project_id": ObjectId(service.project_id),
            }
        )

        if resource is None:
            raise HTTPException(
                status_code=404,
                detail="Resource not found for this environment",
            )

    document = create_service_document(
        project_id=service.project_id,
        environment_id=service.environment_id,
        resource_id=service.resource_id,
        name=service.name,
        service_type=service.service_type,
        provider=service.provider,
        status=service.status,
        description=service.description,
    )

    await database.services.insert_one(document)

    return {
        "id": str(document["_id"]),
        "project_id": str(document["project_id"]),
        "environment_id": str(document["environment_id"]),
        "resource_id": (
            str(document["resource_id"])
            if document["resource_id"]
            else None
        ),
        "name": document["name"],
        "service_type": document["service_type"],
        "provider": document["provider"],
        "status": document["status"],
        "description": document["description"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }
@router.get("/environment/{environment_id}")
async def list_environment_services(environment_id: str):
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

    services = []

    async for service in database.services.find(
        {"environment_id": ObjectId(environment_id)}
    ).sort("created_at", -1):
        services.append(
            {
                "id": str(service["_id"]),
                "project_id": str(service["project_id"]),
                "environment_id": str(service["environment_id"]),
                "resource_id": (
                    str(service["resource_id"])
                    if service.get("resource_id")
                    else None
                ),
                "name": service["name"],
                "service_type": service["service_type"],
                "provider": service["provider"],
                "status": service["status"],
                "description": service["description"],
                "created_at": service["created_at"],
                "updated_at": service["updated_at"],
            }
        )

    return services
    
@router.get("/count")
async def count_services():
    total = await database.services.count_documents({})

    return {
        "total": total,
    }
@router.delete("/{service_id}")
async def delete_service(service_id: str):
    if not ObjectId.is_valid(service_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid service ID",
        )

    service_object_id = ObjectId(service_id)

    service = await database.services.find_one(
        {"_id": service_object_id}
    )

    if service is None:
        raise HTTPException(
            status_code=404,
            detail="Service not found",
        )

    await database.services.delete_one(
        {"_id": service_object_id}
    )

    return {
        "message": "Service deleted successfully",
        "id": service_id,
    }