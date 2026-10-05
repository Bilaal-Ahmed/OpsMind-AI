from fastapi import APIRouter, HTTPException, status

from app.core.database import database
from app.core.security import create_access_token, hash_password, verify_password
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


def user_response(user_id: str, user: User) -> UserResponse:
    return UserResponse(
        id=user_id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        is_active=user.is_active,
    )


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(request: SignupRequest):
    existing_user = await database.users.find_one(
        {"email": request.email.lower()}
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        email=request.email.lower(),
        full_name=request.full_name.strip(),
        hashed_password=hash_password(request.password),
    )

    result = await database.users.insert_one(
        user.model_dump()
    )

    user_id = str(result.inserted_id)

    access_token = create_access_token(
        {
            "sub": user_id,
            "email": user.email,
            "role": user.role,
        }
    )

    return TokenResponse(
        access_token=access_token,
        user=user_response(user_id, user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(request: LoginRequest):
    user = await database.users.find_one(
        {"email": request.email.lower()}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(
        request.password,
        user["hashed_password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive.",
        )

    user_id = str(user["_id"])

    access_token = create_access_token(
        {
            "sub": user_id,
            "email": user["email"],
            "role": user.get("role", "user"),
        }
    )

    return TokenResponse(
        access_token=access_token,
        user=UserResponse(
            id=user_id,
            email=user["email"],
            full_name=user.get("full_name", ""),
            role=user.get("role", "user"),
            is_active=user.get("is_active", True),
        ),
    )
@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Authentication successful.",
        "user": current_user,
    }