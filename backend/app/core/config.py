from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "OpsMind AI API"
    app_version: str = "0.1.0"
    environment: str = "development"

    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_database: str = "opsmind_ai"

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    frontend_url: str = "http://localhost:5173"

    ai_api_key: str | None = Field(
        default=None,
        validation_alias="OPENAI_API_KEY",
    )
    ai_provider: str = "openai"
    ai_model: str = "gpt-6-luna"

    gemini_api_key: str | None = Field(
    default=None,
    validation_alias="GEMINI_API_KEY",
)
    gemini_model: str = "gemini-3.5-flash-lite"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()