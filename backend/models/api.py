"""API models - Pydantic schemas for request/response validation."""

from typing import Literal
from pydantic import BaseModel, Field


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


class HistoryMessage(BaseModel):
    """A prior message in the conversation, as stored by the client."""

    role: Literal["user", "assistant"]
    content: str = Field(max_length=50_000)


class ReadingContext(BaseModel):
    """Where the reader currently is in the text (sent even without a highlight)."""

    book: int
    section: int
    paragraph: str = Field(max_length=20_000)


class ChatRequest(BaseModel):
    """Request body for chat endpoints."""

    conversation_id: str
    text_id: str
    user_message: str  # Contains embedded context (location + passage)
    mode: str = "tutor"  # "tutor" (default) or "socratic"
    ai_initiate: bool = False  # If true, AI sends first message (Socratic mode)
    # Client-held history (localStorage is the source of truth). When provided it
    # replaces the server's copy, so conversations survive backend restarts.
    history: list[HistoryMessage] | None = Field(default=None, max_length=200)
    reading_context: ReadingContext | None = None


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
