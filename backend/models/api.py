"""API models - Pydantic schemas for request/response validation."""

from pydantic import BaseModel


class TextInfo(BaseModel):
    """Schema for philosophy text metadata and content."""

    id: str
    title: str
    author: str
    translator: str | None = None
    year: str | None = None
    description: str | None = None
    category: str | None = None
    sections: list[dict]


class ChatRequest(BaseModel):
    """Request body for chat endpoints."""

    conversation_id: str
    text_id: str
    user_message: str  # Contains embedded context (location + passage)
    mode: str = "tutor"  # "tutor" (default) or "socratic"
    ai_initiate: bool = False  # If true, AI sends first message (Socratic mode)


class ChatResponse(BaseModel):
    """Response body for non-streaming chat endpoint."""

    response: str
    conversation_id: str


class TitleRequest(BaseModel):
    """Request body for title generation."""

    text_title: str
    text_author: str
    first_user_message: str
    first_assistant_message: str
