"""Tests for MessageParser - user message parsing and formatting."""

import pytest
from services.chat import MessageParser


class TestParse:
    """Tests for MessageParser.parse()"""

    def test_parses_full_message_with_all_components(self):
        raw = """[Book 2, Section 3]
> From my grandfather Verus I learned good morals and the government of my temper.
[Highlighted: "government of my temper"]
What does this phrase mean?"""

        result = MessageParser.parse(raw)

        assert result.location == "Book 2, Section 3"
        assert result.paragraph == "From my grandfather Verus I learned good morals and the government of my temper."
        assert result.highlighted == "government of my temper"
        assert result.question == "What does this phrase mean?"

    def test_parses_message_without_location(self):
        raw = """> Some philosophical text here.
[Highlighted: "philosophical"]
Explain this."""

        result = MessageParser.parse(raw)

        assert result.location is None
        assert result.paragraph == "Some philosophical text here."
        assert result.highlighted == "philosophical"
        assert result.question == "Explain this."

    def test_parses_message_without_highlight(self):
        raw = """[Chapter 1]
> The unexamined life is not worth living.
What did Socrates mean by this?"""

        result = MessageParser.parse(raw)

        assert result.location == "Chapter 1"
        assert result.paragraph == "The unexamined life is not worth living."
        assert result.highlighted is None
        assert result.question == "What did Socrates mean by this?"

    def test_parses_plain_question_only(self):
        raw = "What is the meaning of life?"

        result = MessageParser.parse(raw)

        assert result.location is None
        assert result.paragraph is None
        assert result.highlighted is None
        assert result.question == "What is the meaning of life?"

    def test_handles_multiline_paragraph(self):
        raw = """[Section 5]
> First line of the paragraph.
> Second line continues here.
> Third line ends it.
What is the main idea?"""

        result = MessageParser.parse(raw)

        assert result.paragraph == "First line of the paragraph. Second line continues here. Third line ends it."
        assert result.question == "What is the main idea?"

    def test_handles_single_quotes_in_highlight(self):
        raw = "[Highlighted: 'single quoted phrase']\nExplain this."

        result = MessageParser.parse(raw)

        assert result.highlighted == "single quoted phrase"

    def test_handles_double_quotes_in_highlight(self):
        raw = '[Highlighted: "double quoted phrase"]\nExplain this.'

        result = MessageParser.parse(raw)

        assert result.highlighted == "double quoted phrase"

    def test_handles_complex_location_formats(self):
        cases = [
            ("[Book I, Chapter 2]", "Book I, Chapter 2"),
            ("[Part 3, Section 4.2]", "Part 3, Section 4.2"),
            ("[Meditation 7]", "Meditation 7"),
            ("[§23]", "§23"),
        ]

        for raw, expected in cases:
            result = MessageParser.parse(raw + "\nQuestion?")
            assert result.location == expected, f"Failed for: {raw}"

    def test_preserves_multiline_question(self):
        raw = """Can you explain this passage?
I find it confusing.
What does the author mean?"""

        result = MessageParser.parse(raw)

        assert result.question == "Can you explain this passage? I find it confusing. What does the author mean?"

    def test_handles_empty_input(self):
        result = MessageParser.parse("")
        assert result.question == ""

    def test_handles_whitespace_only(self):
        result = MessageParser.parse("   \n\n   ")
        assert result.question == "   \n\n   "  # Falls back to raw

    def test_does_not_confuse_highlighted_with_location(self):
        raw = '[Highlighted: "some text"]\nWhat does this mean?'

        result = MessageParser.parse(raw)

        assert result.location is None
        assert result.highlighted == "some text"


class TestBuildModelInput:
    """Tests for MessageParser.build_model_input()"""

    def test_builds_full_input(self):
        from models.domain import ParsedUserMessage

        parsed = ParsedUserMessage(
            location="Book 1, Section 2",
            paragraph="The text of the paragraph.",
            highlighted="key phrase",
            question="What does this mean?"
        )

        result = MessageParser.build_model_input(parsed)

        assert "[Book 1, Section 2]" in result
        assert "> The text of the paragraph." in result
        assert '[Highlighted: "key phrase"]' in result
        assert "What does this mean?" in result

    def test_omits_missing_components(self):
        from models.domain import ParsedUserMessage

        parsed = ParsedUserMessage(
            location=None,
            paragraph=None,
            highlighted=None,
            question="Simple question"
        )

        result = MessageParser.build_model_input(parsed)

        assert result == "Simple question"
        assert "[" not in result
        assert ">" not in result

    def test_separates_components_with_double_newlines(self):
        from models.domain import ParsedUserMessage

        parsed = ParsedUserMessage(
            location="Chapter 1",
            paragraph="Some text.",
            highlighted=None,
            question="Question?"
        )

        result = MessageParser.build_model_input(parsed)

        parts = result.split("\n\n")
        assert len(parts) == 3
        assert parts[0] == "[Chapter 1]"
        assert parts[1] == "> Some text."
        assert parts[2] == "Question?"
