import json

from openai import AsyncOpenAI

from app.core.config import settings


class OpenAIService:
    def __init__(self) -> None:
        self.client = AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

    async def generate_enhancements(self, payload: dict) -> dict | None:
        if not self.client:
            return None

        try:
            response = await self.client.chat.completions.create(
                model=settings.openai_model,
                temperature=0.35,
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert resume strategist. "
                            "Return JSON with keys: summary, suggestions, bullet_rewrites, "
                            "interview_questions, recommended_certifications, job_recommendations."
                        ),
                    },
                    {
                        "role": "user",
                        "content": json.dumps(payload),
                    },
                ],
            )
            content = response.choices[0].message.content or "{}"
            return json.loads(content)
        except Exception:
            return None
