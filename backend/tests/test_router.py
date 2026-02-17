"""Tests for RouterService - query routing logic."""

import pytest
from models.domain import ParsedUserMessage
from models.api import TextInfo
from services.router import RouterService


class TestBuildRouterInput:
    """Tests for RouterService._build_router_input()"""

    def test_includes_text_info(self):
        router = RouterService(client=None)  # Client not needed for this method
        parsed = ParsedUserMessage(
            location=None, paragraph=None, highlighted=None, question="What is virtue?"
        )
        text_info = TextInfo(
            id="meditations",
            title="Meditations",
            author="Marcus Aurelius",
            sections=[]
        )

        result = router._build_router_input(parsed, text_info)

        assert "Text: Meditations by Marcus Aurelius" in result

    def test_includes_location(self):
        router = RouterService(client=None)
        parsed = ParsedUserMessage(
            location="Book 2, Section 5",
            paragraph=None,
            highlighted=None,
            question="Explain this."
        )

        result = router._build_router_input(parsed, None)

        assert "Location: Book 2, Section 5" in result

    def test_emphasizes_highlighted_text(self):
        router = RouterService(client=None)
        parsed = ParsedUserMessage(
            location=None,
            paragraph=None,
            highlighted="the government of my temper",
            question="What does this mean?"
        )

        result = router._build_router_input(parsed, None)

        assert 'Highlighted text: "the government of my temper"' in result

    def test_truncates_long_paragraphs(self):
        router = RouterService(client=None)
        long_para = "x" * 500
        parsed = ParsedUserMessage(
            location=None,
            paragraph=long_para,
            highlighted=None,
            question="Question?"
        )

        result = router._build_router_input(parsed, None)

        assert "Paragraph context:" in result
        assert "..." in result
        assert len(result) < len(long_para) + 100  # Truncated

    def test_keeps_short_paragraphs_intact(self):
        router = RouterService(client=None)
        short_para = "A brief paragraph."
        parsed = ParsedUserMessage(
            location=None,
            paragraph=short_para,
            highlighted=None,
            question="Question?"
        )

        result = router._build_router_input(parsed, None)

        assert f"Paragraph context: {short_para}" in result
        assert "..." not in result

    def test_always_includes_question(self):
        router = RouterService(client=None)
        parsed = ParsedUserMessage(
            location=None,
            paragraph=None,
            highlighted=None,
            question="What is Stoicism?"
        )

        result = router._build_router_input(parsed, None)

        assert "Question: What is Stoicism?" in result

    def test_handles_all_fields_none_except_question(self):
        router = RouterService(client=None)
        parsed = ParsedUserMessage(
            location=None,
            paragraph=None,
            highlighted=None,
            question="Simple question"
        )

        result = router._build_router_input(parsed, None)

        assert result == "Question: Simple question"
