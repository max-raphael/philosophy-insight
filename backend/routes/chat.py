"""Chat API endpoints."""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse

from models.api import ChatRequest, ChatResponse
from services.text import TextService
from services.chat import ChatService
from dependencies import get_text_service, get_chat_service

router = APIRouter(tags=["chat"])


@router.post("/chat/stream")
def chat_stream(
    request: ChatRequest,
    text_service: TextService = Depends(get_text_service),
    chat_service: ChatService = Depends(get_chat_service),
):
    """Stream a chat response token by token."""
    text_info = text_service.get(request.text_id)

    ctx = chat_service.prepare_context(request, text_info)

    return StreamingResponse(
        chat_service.stream_response(ctx, request.conversation_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    text_service: TextService = Depends(get_text_service),
    chat_service: ChatService = Depends(get_chat_service),
):
    """Send a message and get AI response (non-streaming)."""
    text_info = text_service.get(request.text_id)

    ctx = chat_service.prepare_context(request, text_info)

    try:
        response = chat_service.generate_response(ctx, request.conversation_id)
        return ChatResponse(
            response=response,
            conversation_id=request.conversation_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
