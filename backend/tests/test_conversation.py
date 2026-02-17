"""Tests for ConversationService - history management."""

import pytest
from unittest.mock import Mock, patch
from services.conversation import ConversationService, InMemoryConversationStore
from config import settings


class TestInMemoryConversationStore:
    """Tests for InMemoryConversationStore"""

    def test_get_returns_empty_list_for_new_conversation(self):
        store = InMemoryConversationStore()
        result = store.get("nonexistent-id")
        assert result == []

    def test_save_and_get_roundtrip(self):
        store = InMemoryConversationStore()
        messages = [{"role": "user", "content": "Hello"}]

        store.save("conv-1", messages)
        result = store.get("conv-1")

        assert result == messages

    def test_delete_returns_true_if_existed(self):
        store = InMemoryConversationStore()
        store.save("conv-1", [{"role": "user", "content": "Hi"}])

        result = store.delete("conv-1")

        assert result is True
        assert store.get("conv-1") == []

    def test_delete_returns_false_if_not_existed(self):
        store = InMemoryConversationStore()

        result = store.delete("nonexistent")

        assert result is False


class TestConversationServiceTrimming:
    """Tests for ConversationService.trim_for_context()"""

    def test_returns_messages_unchanged_when_under_limit(self):
        store = InMemoryConversationStore()
        mock_client = Mock()
        service = ConversationService(store, mock_client)

        messages = [{"role": "user", "content": f"Message {i}"} for i in range(30)]

        result = service.trim_for_context(messages)

        assert result == messages
        mock_client.responses.create.assert_not_called()

    def test_returns_messages_unchanged_at_exact_limit(self):
        store = InMemoryConversationStore()
        mock_client = Mock()
        service = ConversationService(store, mock_client)

        messages = [{"role": "user", "content": f"Message {i}"} for i in range(settings.max_history_messages)]

        result = service.trim_for_context(messages)

        assert result == messages
        mock_client.responses.create.assert_not_called()

    def test_summarizes_when_over_limit(self):
        store = InMemoryConversationStore()
        mock_client = Mock()
        mock_client.responses.create.return_value = Mock(output_text="Summary of discussion.")
        service = ConversationService(store, mock_client)

        # Create messages over the limit
        messages = [{"role": "user", "content": f"Message {i}"} for i in range(60)]

        result = service.trim_for_context(messages)

        # Should have called summarization
        mock_client.responses.create.assert_called_once()

        # Should have summary message + recent messages
        assert len(result) == settings.messages_to_keep + 1
        assert "[Earlier in our conversation:" in result[0]["content"]
        assert "Summary of discussion." in result[0]["content"]

    def test_keeps_recent_messages_intact(self):
        store = InMemoryConversationStore()
        mock_client = Mock()
        mock_client.responses.create.return_value = Mock(output_text="Summary.")
        service = ConversationService(store, mock_client)

        messages = [{"role": "user", "content": f"Message {i}"} for i in range(60)]

        result = service.trim_for_context(messages)

        # Recent messages should be kept intact (last 30)
        recent = result[1:]  # Skip summary message
        expected_recent = messages[-settings.messages_to_keep:]
        assert recent == expected_recent

    def test_handles_summarization_failure_gracefully(self):
        store = InMemoryConversationStore()
        mock_client = Mock()
        mock_client.responses.create.side_effect = Exception("API error")
        service = ConversationService(store, mock_client)

        messages = [{"role": "user", "content": f"Message {i}"} for i in range(60)]

        result = service.trim_for_context(messages)

        # Should still return a valid result with fallback summary
        assert len(result) == settings.messages_to_keep + 1
        assert "Earlier discussion covered foundational concepts" in result[0]["content"]
