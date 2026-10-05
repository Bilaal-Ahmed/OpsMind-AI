from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import database
from app.models.resource import create_resource_document


router = APIRouter(
    prefix="/api/resources",
    tags=["Resources"],
)


class ResourceCreate(BaseModel):
    project_id: str
    environment_id: str
    name: str = Field(min_length=1, max_length=100)
    resource_type: str = Field(min_length=1, max_length=100)
    provider: str = Field(default="custom", max_length=100)
    status: str = Field(default="active", max_length=50)
    description: str = Field(default="", max_length=500)


@router.post("")
async def create_resource(resource: ResourceCreate):
    if not ObjectId.is_valid(resource.project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    if not ObjectId.is_valid(resource.environment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid environment ID",
        )

    project = await database.projects.find_one(
        {"_id": ObjectId(resource.project_id)}
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    environment = await database.environments.find_one(
        {
            "_id": ObjectId(resource.environment_id),
            "project_id": ObjectId(resource.project_id),
        }
    )

    if environment is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found for this project",
        )

    document = create_resource_document(
        project_id=resource.project_id,
        environment_id=resource.environment_id,
        name=resource.name,
        resource_type=resource.resource_type,
        provider=resource.provider,
        status=resource.status,
        description=resource.description,
    )

    await database.resources.insert_one(document)

    return {
        "id": str(document["_id"]),
        "project_id": str(document["project_id"]),
        "environment_id": str(document["environment_id"]),
        "name": document["name"],
        "resource_type": document["resource_type"],
        "provider": document["provider"],
        "status": document["status"],
        "description": document["description"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


@router.get("/environment/{environment_id}")
async def list_environment_resources(environment_id: str):
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

    resources = []

    async for resource in database.resources.find(
        {"environment_id": ObjectId(environment_id)}
    ).sort("created_at", -1):
        resources.append(
            {
                "id": str(resource["_id"]),
                "project_id": str(resource["project_id"]),
                "environment_id": str(resource["environment_id"]),
                "name": resource["name"],
                "resource_type": resource["resource_type"],
                "provider": resource["provider"],
                "status": resource["status"],
                "description": resource["description"],
                "created_at": resource["created_at"],
                "updated_at": resource["updated_at"],
            }
        )
    return resources

@router.delete("/{resource_id}")
async def delete_resource(resource_id: str):
    if not ObjectId.is_valid(resource_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid resource ID",
        )

    resource_object_id = ObjectId(resource_id)

    resource = await database.resources.find_one(
        {"_id": resource_object_id}
    )

    if resource is None:
        raise HTTPException(
            status_code=404,
            detail="Resource not found",
        )

    await database.resources.delete_one(
        {"_id": resource_object_id}
    )

    return {
        "message": "Resource deleted successfully",
        "id": resource_id,
    }
@router.get("/count")
async def count_resources():
    total = await database.resources.count_documents({})

    return {
        "total": total,
    }