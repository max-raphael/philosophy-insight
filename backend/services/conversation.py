"""Conversation storage and management service."""

from abc import ABC, abstractmethod
from typing import Protocol
from openai import OpenAI

from config import settings


class ConversationStore(Protocol):
    """Protocol for conversation storage backends."""

    def get(self, conversation_id: str) -> list[dict]:
        """Get conversation history by ID. Returns empty list if not found."""
        ...

    def save(self, conversation_id: str, messages: list[dict]) -> None:
        """Save conversation history."""
        ...

    def delete(self, conversation_id: str) -> bool:
        """Delete a conversation. Returns True if existed."""
        ...


class InMemoryConversationStore:
    """In-memory conversation storage (for development/MVP)."""

    def __init__(self):
        self._conversations: dict[str, list[dict]] = {}

    def get(self, conversation_id: str) -> list[dict]:
        """Get conversation history by ID. Returns empty list if not found."""
        return self._conversations.get(conversation_id, [])

    def save(self, conversation_id: str, messages: list[dict]) -> None:
        """Save conversation history."""
        self._conversations[conversation_id] = messages

    def delete(self, conversation_id: str) -> bool:
        """Delete a conversation. Returns True if existed."""
        if conversation_id in self._conversations:
            del self._conversations[conversation_id]
            return True
        return False


class ConversationService:
    """Service for managing conversation history with summarization."""

    def __init__(self, store: ConversationStore, client: OpenAI):
        self._store = store
        self._client = client

    def get_or_create(self, conversation_id: str) -> list[dict]:
        """Get existing conversation or return empty list for new one."""
        return self._store.get(conversation_id)

    def add_message(self, conversation_id: str, role: str, content: str) -> list[dict]:
        """Add a message to conversation and return updated history."""
        messages = self._store.get(conversation_id)
        messages.append({"role": role, "content": content})
        self._store.save(conversation_id, messages)
        return messages

    def delete(self, conversation_id: str) -> bool:
        """Delete a conversation."""
        return self._store.delete(conversation_id)

    def trim_for_context(self, messages: list[dict]) -> list[dict]:
        """
        Prepare conversation for LLM context with lazy summarization.
        - Under limit: return as-is
        - Over limit: summarize oldest messages, keep recent ones
        """
        if len(messages) <= settings.max_history_messages:
            return messages

        # Split into old (to summarize) and recent (to keep)
        old_messages = messages[:settings.messages_to_summarize]
        recent_messages = messages[-settings.messages_to_keep:]

        # Summarize old messages
        summary = self._summarize_messages(old_messages)

        # Create a context message with the summary
        summary_message = {
            "role": "user",
            "content": f"[Earlier in our conversation: {summary}]"
        }

        return [summary_message] + recent_messages

    def _summarize_messages(self, messages: list[dict]) -> str:
        """Summarize a list of messages into a concise context string."""
        formatted = []
        for msg in messages:
            role = "User" if msg["role"] == "user" else "Tutor"
            content = msg["content"][:500]  # Truncate long messages
            formatted.append(f"{role}: {content}")

        messages_text = "\n\n".join(formatted)

        try:
            response = self._client.responses.create(
                model=settings.model_router,
                input=[{
                    "role": "user",
                    "content": f"""Summarize this philosophy discussion in 2-3 sentences.
Capture the key concepts discussed, questions asked, and main points made.
Be concise but preserve philosophical terminology and specific ideas.

Discussion:
{messages_text}

Summary:"""
                }]
            )
            return response.output_text.strip()
        except Exception:
            return "Earlier discussion covered foundational concepts from this text."
