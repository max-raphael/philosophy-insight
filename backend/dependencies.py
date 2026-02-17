"""FastAPI dependency injection setup."""

from functools import lru_cache
from openai import OpenAI

from config import settings
from services.text import TextService
from services.conversation import InMemoryConversationStore, ConversationService
from services.router import RouterService
from services.chat import ChatService, TitleService


@lru_cache()
def get_openai_client() -> OpenAI:
    """Get singleton OpenAI client."""
    return OpenAI(api_key=settings.openai_api_key)


@lru_cache()
def get_text_service() -> TextService:
    """Get singleton text service."""
    return TextService()


@lru_cache()
def get_conversation_store() -> InMemoryConversationStore:
    """Get singleton conversation store."""
    return InMemoryConversationStore()


def get_conversation_service() -> ConversationService:
    """Get conversation service with dependencies."""
    return ConversationService(
        store=get_conversation_store(),
        client=get_openai_client(),
    )


def get_router_service() -> RouterService:
    """Get router service with dependencies."""
    return RouterService(client=get_openai_client())


def get_chat_service() -> ChatService:
    """Get chat service with all dependencies."""
    return ChatService(
        client=get_openai_client(),
        router=get_router_service(),
        conversation_service=get_conversation_service(),
    )


def get_title_service() -> TitleService:
    """Get title generation service."""
    return TitleService(client=get_openai_client())
