from google import genai

from app.core.config import settings


gemini_client = (
    genai.Client(api_key=settings.gemini_api_key)
    if settings.gemini_api_key
    else None
)