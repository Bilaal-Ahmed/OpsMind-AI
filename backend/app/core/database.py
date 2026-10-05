from pymongo import AsyncMongoClient

from app.core.config import settings


client = AsyncMongoClient(settings.mongodb_url)

database = client[settings.mongodb_database]


async def connect_to_database() -> None:
    await client.admin.command("ping")
    print("MongoDB connection: OK")


async def close_database_connection() -> None:
    await client.close()
    print("MongoDB connection: CLOSED")