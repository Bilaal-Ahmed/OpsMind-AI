from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import database
from app.models.environment import create_environment_document


router = APIRouter(
    prefix="/api/environments",
    tags=["Environments"],
)


class EnvironmentCreate(BaseModel):
    project_id: str
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=500)


@router.post("")
async def create_environment(environment: EnvironmentCreate):
    if not ObjectId.is_valid(environment.project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    project = await database.projects.find_one(
        {"_id": ObjectId(environment.project_id)}
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    document = create_environment_document(
        project_id=environment.project_id,
        name=environment.name,
        description=environment.description,
    )

    await database.environments.insert_one(document)

    return {
        "id": str(document["_id"]),
        "project_id": str(document["project_id"]),
        "name": document["name"],
        "description": document["description"],
        "status": document["status"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


@router.get("/project/{project_id}")
async def list_project_environments(project_id: str):
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

    environments = []

    async for environment in database.environments.find(
        {"project_id": ObjectId(project_id)}
    ).sort("created_at", -1):
        environments.append(
            {
                "id": str(environment["_id"]),
                "project_id": str(environment["project_id"]),
                "name": environment["name"],
                "description": environment["description"],
                "status": environment["status"],
                "created_at": environment["created_at"],
                "updated_at": environment["updated_at"],
            }
        )

    return environments


@router.delete("/{environment_id}")
async def delete_environment(environment_id: str):
    if not ObjectId.is_valid(environment_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid environment ID",
        )

    environment_object_id = ObjectId(environment_id)

    environment = await database.environments.find_one(
        {"_id": environment_object_id}
    )

    if environment is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    await database.environments.delete_one(
        {"_id": environment_object_id}
    )

    return {
        "message": "Environment deleted successfully",
        "id": environment_id,
    }