from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.environments import router as environments_router
from app.api.projects import router as projects_router
from app.api.resources import router as resources_router
from app.api.monitoring import router as monitoring_router
from app.api.services import router as services_router
from app.api.alerts import router as alerts_router
from app.api.notifications import router as notifications_router
from app.api import ai
from app.api.auth import router as auth_router
from app.core.config import settings
from app.core.database import (
    close_database_connection,
    connect_to_database,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_database()
    yield
    await close_database_connection()


app = FastAPI(
    title=settings.app_name,
    description="AI-powered DevOps and infrastructure operations platform",
    version=settings.app_version,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(projects_router)
app.include_router(environments_router)
app.include_router(resources_router)
app.include_router(monitoring_router)
app.include_router(services_router)
app.include_router(alerts_router)
app.include_router(notifications_router)
app.include_router(ai.router)
app.include_router(auth_router)

@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "status": "operational",
        "version": settings.app_version,
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}