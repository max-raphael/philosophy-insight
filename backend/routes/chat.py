"""Chat API endpoints."""

from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse

from models.api import ChatRequest, ChatResponse
from services.text import TextService
from services.chat import ChatService
from dependencies import get_text_service, get_chat_service
from config import settings
from rate_limit import limiter

router = APIRouter(tags=["chat"])


@router.post("/chat/stream")
@limiter.limit(settings.rate_limit_chat)
def chat_stream(
    request: Request,
    body: ChatRequest,
    text_service: TextService = Depends(get_text_service),
    chat_service: ChatService = Depends(get_chat_service),
):
    """Stream a chat response token by token."""
    text_info = text_service.get(body.text_id)

    ctx = chat_service.prepare_context(body, text_info)

    return StreamingResponse(
        chat_service.stream_response(ctx, body.conversation_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.post("/chat", response_model=ChatResponse)
@limiter.limit(settings.rate_limit_chat)
def chat(
    request: Request,
    body: ChatRequest,
    text_service: TextService = Depends(get_text_service),
    chat_service: ChatService = Depends(get_chat_service),
):
    """Send a message and get AI response (non-streaming)."""
    text_info = text_service.get(body.text_id)

    ctx = chat_service.prepare_context(body, text_info)

    try:
        response = chat_service.generate_response(ctx, body.conversation_id)
        return ChatResponse(
            response=response,
            conversation_id=body.conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
