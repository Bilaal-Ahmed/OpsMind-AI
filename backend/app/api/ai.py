from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.config import settings
from app.services.ai.client import gemini_client
from app.services.ai.context import build_opsmind_context


router = APIRouter(
    prefix="/api/ai",
    tags=["AI Assistant"],
)


class AIChatRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=2000,
    )


class AIChatResponse(BaseModel):
    response: str


def build_system_prompt(context: dict) -> str:
    return f"""
You are OpsMind AI, an AI-powered DevOps and infrastructure
operations assistant.

Your job is to help the user understand and operate their
infrastructure using the available OpsMind data.

Be practical, concise, and technically accurate.

You can analyze:
- Projects
- Environments
- Infrastructure resources
- Services
- Monitoring metrics
- Alerts

When analyzing operational problems:
1. Identify relevant evidence from the provided data.
2. Explain the likely issue.
3. Highlight important risks.
4. Suggest practical next steps.
5. Never claim that an action was performed unless the system
   explicitly confirms it.

Current OpsMind infrastructure context:

{context}
"""


@router.post("/chat", response_model=AIChatResponse)
async def chat_with_ai(request: AIChatRequest):
    if gemini_client is None:
        return AIChatResponse(
            response=(
                "OpsMind AI is not configured yet. "
                "Please configure the Gemini API key."
            )
        )

    context = await build_opsmind_context()

    prompt = (
        build_system_prompt(context)
        + "\n\nUser request:\n"
        + request.message
    )

    interaction = await gemini_client.aio.interactions.create(
        model=settings.gemini_model,
        input=prompt,
    )

    return AIChatResponse(
        response=interaction.output_text
        or "Gemini returned an empty response.",
    )