"""Text-related API endpoints."""

from fastapi import APIRouter, HTTPException, Depends

from services.text import TextService
from dependencies import get_text_service

router = APIRouter(tags=["texts"])


@router.get("/texts")
def get_texts(text_service: TextService = Depends(get_text_service)):
    """Return list of available texts (without full content)."""
    return text_service.list_metadata()


@router.get("/texts/{text_id}")
def get_text(text_id: str, text_service: TextService = Depends(get_text_service)):
    """Return a specific text with all its sections."""
    text = text_service.get(text_id)
    if text is None:
        raise HTTPException(status_code=404, detail="Text not found")
    return text


@router.post("/reload-texts")
def reload_texts(text_service: TextService = Depends(get_text_service)):
    """Reload texts from disk (useful during development)."""
    count = text_service.reload()
    return {"status": "reloaded", "count": count}
