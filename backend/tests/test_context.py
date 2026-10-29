"""Tests for client-held history, reading context, and full-text context."""

import json
from unittest.mock import Mock, patch

from config import settings
from models.api import ChatRequest, HistoryMessage, ReadingContext
from models.domain import ParsedUserMessage, RouteDecision
from services.chat import ChatService, MessageParser
from services.conversation import ConversationService, InMemoryConversationStore
from services.text import TextService


def make_text_dir(tmp_path, text_id="sample", sections=None):
    sections = sections or [
        {"book": 1, "number": 1, "content": "First thought."},
        {"book": 2, "number": 1, "content": "Second thought."},
    ]
    data = {"id": text_id, "title": "Sample", "author": "Author", "sections": sections}
    (tmp_path / f"{text_id}.json").write_text(json.dumps(data))
    return str(tmp_path)


def make_chat_service(store=None):
    router = Mock()
    router.decide.return_value = RouteDecision(route="basic", effort="low", confidence=1.0, reason="")
    router.get_model.return_value = "model"
    conversation = ConversationService(store or InMemoryConversationStore(), Mock())
    return ChatService(client=Mock(), router=router, conversation_service=conversation)


class TestApplyReadingContext:

    def test_fills_location_and_paragraph_when_nothing_highlighted(self):
        parsed = ParsedUserMessage(location=None, paragraph=None, highlighted=None, question="What?")
        rc = ReadingContext(book=2, section=3, paragraph="The passage.")

        result = MessageParser.apply_reading_context(parsed, rc)

        assert result.location == "Book 2, Section 3"
        assert result.paragraph == "The passage."
        assert result.question == "What?"

    def test_keeps_explicit_highlight_context(self):
        parsed = ParsedUserMessage(location="Book 1, Section 1", paragraph="Highlighted para", highlighted="para", question="?")
        rc = ReadingContext(book=5, section=5, paragraph="Elsewhere")

        result = MessageParser.apply_reading_context(parsed, rc)

        assert result is parsed

    def test_none_reading_context_is_noop(self):
        parsed = ParsedUserMessage(location=None, paragraph=None, highlighted=None, question="?")
        assert MessageParser.apply_reading_context(parsed, None) is parsed


class TestClientHistory:

    def test_history_replaces_server_copy(self):
        store = InMemoryConversationStore()
        store.save("c1", [{"role": "user", "content": "stale"}])
        service = make_chat_service(store)
        request = ChatRequest(
            conversation_id="c1",
            text_id="sample",
            user_message="Follow-up",
            history=[
                HistoryMessage(role="user", content="First question"),
                HistoryMessage(role="assistant", content="First answer"),
            ],
        )

        ctx = service.prepare_context(request, None)

        contents = [m["content"] for m in ctx.messages[1:]]
        assert contents == ["First question", "First answer", "Follow-up"]

    def test_history_survives_empty_server_store(self):
        """Simulates a backend restart: server has nothing, client resends history."""
        service = make_chat_service()
        request = ChatRequest(
            conversation_id="c1",
            text_id="sample",
            user_message="Next",
            history=[HistoryMessage(role="user", content="Q"), HistoryMessage(role="assistant", content="A")],
        )

        ctx = service.prepare_context(request, None)

        assert len(ctx.messages) == 4  # system + Q + A + Next

    def test_history_user_messages_are_normalized(self):
        service = make_chat_service()
        raw = '[Book 1, Section 2]\n> Some paragraph\n\n[Highlighted: "phrase"]\n\nWhy?'
        request = ChatRequest(
            conversation_id="c1",
            text_id="sample",
            user_message="Next",
            history=[HistoryMessage(role="user", content=raw)],
        )

        ctx = service.prepare_context(request, None)

        assert ctx.messages[1]["content"] == '[Book 1, Section 2]\n\n> Some paragraph\n\n[Highlighted: "phrase"]\n\nWhy?'


class TestFullText:

    def test_full_text_labels_sections(self, tmp_path):
        with patch.object(settings, "full_text_ids", ["sample"]):
            service = TextService(make_text_dir(tmp_path))
            text = service.full_text("sample")

        assert "[Book 1, Section 1]\nFirst thought." in text
        assert "[Book 2, Section 1]\nSecond thought." in text

    def test_full_text_none_when_not_enabled(self, tmp_path):
        with patch.object(settings, "full_text_ids", ["other"]):
            service = TextService(make_text_dir(tmp_path))
            assert service.full_text("sample") is None

    def test_full_text_wildcard(self, tmp_path):
        with patch.object(settings, "full_text_ids", ["*"]):
            service = TextService(make_text_dir(tmp_path))
            assert service.full_text("sample") is not None

    def test_full_text_none_when_too_long(self, tmp_path):
        with patch.object(settings, "full_text_ids", ["sample"]), patch.object(settings, "full_text_max_tokens", 2):
            service = TextService(make_text_dir(tmp_path))
            assert service.full_text("sample") is None

    def test_full_text_is_first_message(self, tmp_path):
        with patch.object(settings, "full_text_ids", ["sample"]):
            text_service = TextService(make_text_dir(tmp_path))
            text_info = text_service.get("sample")
            full_text = text_service.full_text("sample")
        chat = make_chat_service()
        tutor = ChatRequest(conversation_id="a", text_id="sample", user_message="Hi")
        socratic = ChatRequest(conversation_id="b", text_id="sample", user_message="Hi", mode="socratic")

        tutor_ctx = chat.prepare_context(tutor, text_info, full_text)
        socratic_ctx = chat.prepare_context(socratic, text_info, full_text)

        # Identical first message across modes = shared cacheable prefix
        assert tutor_ctx.messages[0] == socratic_ctx.messages[0]
        assert "First thought." in tutor_ctx.messages[0]["content"]
        assert "[Book X, Section Y]" in tutor_ctx.messages[1]["content"]
