"""Small OpenAI wrapper used by the tutor engine."""

from __future__ import annotations

from openai import OpenAI

from . import settings


class OpenAITextClient:
    def __init__(self) -> None:
        if not settings.OPENAI_API_KEY:
            raise RuntimeError("OPENAI_API_KEY was not found in /home/aubin.mugisha/Tutor/.env")
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def complete(
        self,
        *,
        model: str,
        system: str,
        user: str,
        max_output_tokens: int,
        reasoning_effort: str = "low",
    ) -> str:
        request = {
            "model": model,
            "input": [
                {"role": "developer", "content": system},
                {"role": "user", "content": user},
            ],
            "max_output_tokens": max_output_tokens,
        }

        if reasoning_effort != "none":
            request["reasoning"] = {"effort": reasoning_effort}

        try:
            response = self.client.responses.create(**request)
        except Exception as error:
            message = str(error).lower()
            if "reasoning" in message and "unsupported" in message:
                request.pop("reasoning", None)
                response = self.client.responses.create(**request)
            else:
                raise
        text = getattr(response, "output_text", "")
        if text:
            return text.strip()

        parts: list[str] = []
        for item in getattr(response, "output", []) or []:
            for content in getattr(item, "content", []) or []:
                value = getattr(content, "text", "")
                if value:
                    parts.append(value)
        return "\n".join(parts).strip()
