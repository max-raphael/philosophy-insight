"""Application configuration and settings."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # OpenAI API
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")

    # GitHub API (for feedback submission)
    github_token: str = os.getenv("GITHUB_TOKEN", "")
    github_repo: str = os.getenv("GITHUB_REPO", "max-raphael/philosophy-insight")

    # Models (chosen by comparing candidates with scripts/model_eval.py, 2026-10-29)
    model_tutor: str = os.getenv("MODEL_TUTOR", "gpt-6.1-terra")     # Answers every reader question
    tutor_effort: str = os.getenv("TUTOR_EFFORT", "medium")          # Reasoning effort for tutor answers
    model_utility: str = os.getenv("MODEL_UTILITY", "gpt-6-luna")    # Titles and history summaries
    # How long OpenAI keeps the cached prompt (the book) alive: "30m" or "12h" on GPT-5.6+,
    # empty for the default. Cache writes cost 1.25x input for 30m.
    prompt_cache_ttl: str = os.getenv("PROMPT_CACHE_TTL", "30m")

    # Conversation limits
    max_history_messages: int = 50      # Keep up to 50 messages before summarizing
    messages_to_summarize: int = 20     # When limit hit, summarize oldest 20
    messages_to_keep: int = 30          # Keep most recent 30 at full fidelity

    # Full-text context: the whole book goes into the prompt (as a stable prefix,
    # so OpenAI's automatic prompt caching applies) for these texts.
    # Comma-separated ids, or "*" for every text under the token limit.
    full_text_ids: list[str] = [
        t.strip()
        for t in os.getenv("FULL_TEXT_IDS", "*").split(",")
        if t.strip()
    ]
    full_text_max_tokens: int = int(os.getenv("FULL_TEXT_MAX_TOKENS", "200000"))

    # Rate limiting
    rate_limit_chat: str = "50/hour;200/day"   # Chat endpoints (expensive)
    rate_limit_title: str = "100/hour"          # Title generation (cheap)

    # CORS
    cors_origins: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
    ]


settings = Settings()

