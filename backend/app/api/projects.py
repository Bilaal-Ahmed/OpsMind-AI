from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import database
from app.models.project import create_project_document


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=500)


@router.post("")
async def create_project(project: ProjectCreate):
    document = create_project_document(
        name=project.name,
        description=project.description,
    )

    await database.projects.insert_one(document)

    return {
        "id": str(document["_id"]),
        "name": document["name"],
        "description": document["description"],
        "status": document["status"],
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


@router.get("")
async def list_projects():
    projects = []

    async for project in database.projects.find().sort("created_at", -1):
        projects.append(
            {
                "id": str(project["_id"]),
                "name": project["name"],
                "description": project["description"],
                "status": project["status"],
                "created_at": project["created_at"],
                "updated_at": project["updated_at"],
            }
        )

    return projects


@router.get("/{project_id}")
async def get_project(project_id: str):
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

    return {
        "id": str(project["_id"]),
        "name": project["name"],
        "description": project["description"],
        "status": project["status"],
        "created_at": project["created_at"],
        "updated_at": project["updated_at"],
    }


@router.delete("/{project_id}")
async def delete_project(project_id: str):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID",
        )

    project_object_id = ObjectId(project_id)

    project = await database.projects.find_one(
        {"_id": project_object_id}
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    environment = await database.environments.find_one(
        {"project_id": project_object_id}
    )

    if environment is not None:
        raise HTTPException(
            status_code=409,
            detail="Project cannot be deleted while environments exist",
        )

    await database.projects.delete_one(
        {"_id": project_object_id}
    )

    return {
        "message": "Project deleted successfully",
        "id": project_id,
    }