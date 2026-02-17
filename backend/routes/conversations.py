"""Conversation management API endpoints."""

from fastapi import APIRouter, Depends

from models.api import TitleRequest
from services.conversation import ConversationService
from services.chat import TitleService
from dependencies import get_conversation_service, get_title_service

router = APIRouter(tags=["conversations"])


@router.delete("/conversations/{conversation_id}")
def clear_conversation(
    conversation_id: str,
    conversation_service: ConversationService = Depends(get_conversation_service),
):
    """Clear a conversation to start fresh."""
    conversation_service.delete(conversation_id)
    return {"status": "cleared"}


@router.post("/generate-title")
def generate_title(
    request: TitleRequest,
    title_service: TitleService = Depends(get_title_service),
):
    """Generate a short title for a conversation based on the first exchange."""
    title = title_service.generate(
        text_title=request.text_title,
        text_author=request.text_author,
        first_user_message=request.first_user_message,
        first_assistant_message=request.first_assistant_message,
    )
    return {"title": title}
