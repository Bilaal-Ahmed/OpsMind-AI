from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)
    hashed_password: str
    role: str = "user"
    is_active: bool = True
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )