"""Application configuration and settings."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # OpenAI API
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    # Models
    model_router: str = "gpt-5-nano"    # Fast/cheap router
    model_basic: str = "gpt-5-mini"     # Quick responses for simple queries
    model_deep: str = "gpt-5.2"         # Deep reasoning for complex queries

    # Conversation limits
    max_history_messages: int = 50      # Keep up to 50 messages before summarizing
    messages_to_summarize: int = 20     # When limit hit, summarize oldest 20
    messages_to_keep: int = 30          # Keep most recent 30 at full fidelity

    # CORS
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
    ]


settings = Settings()


# Structured output schema for router
ROUTE_SCHEMA = {
    "name": "route_decision",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "route": {
                "type": "string",
                "enum": ["basic", "deep"],
                "description": "Whether to use basic (fast) or deep (reasoning) model"
            },
            "effort": {
                "type": "string",
                "enum": ["low", "high"],
                "description": "Reasoning effort level"
            },
            "confidence": {
                "type": "number",
                "description": "Confidence in routing decision (0.0 to 1.0)"
            },
            "reason": {
                "type": "string",
                "description": "Brief explanation of routing decision"
            }
        },
        "required": ["route", "effort", "confidence", "reason"],
        "additionalProperties": False
    }
}
