"""Chat service - core chat processing logic."""

import json
import re
from dataclasses import dataclass
from typing import Iterator
from openai import OpenAI

from config import settings
from models.domain import ParsedUserMessage, RouteDecision
from models.api import TextInfo, ChatRequest
from prompts.system import build_system_prompt
from services.router import RouterService
from services.conversation import ConversationService


class MessageParser:
    """Parses user messages into structured components."""

    @staticmethod
    def parse(raw: str) -> ParsedUserMessage:
        """
        Parse a user message into structured components.
        Best-effort parsing - never throws, falls back gracefully.
        """
        location = None
        paragraph = None
        highlighted = None
        question_parts = []

        lines = raw.strip().split('\n')

        for line in lines:
            line_stripped = line.strip()

            # Check for location: [Book X, Section Y] or similar bracketed location
            location_match = re.match(r'^\[([^\]]+)\]$', line_stripped)
            if location_match and not line_stripped.startswith('[Highlighted'):
                location = location_match.group(1)
                continue

            # Check for highlighted text: [Highlighted: "..."]
            highlight_match = re.search(r'\[Highlighted:\s*["\'](.+?)["\']\]', line_stripped)
            if highlight_match:
                highlighted = highlight_match.group(1)
                continue

            # Check for paragraph lines (prefixed with >)
            if line_stripped.startswith('>'):
                para_line = line_stripped[1:].strip()
                if paragraph is None:
                    paragraph = para_line
                else:
                    paragraph += ' ' + para_line
                continue

            # Everything else is part of the question
            if line_stripped:
                question_parts.append(line_stripped)

        question = ' '.join(question_parts) if question_parts else raw

        return ParsedUserMessage(
            location=location,
            paragraph=paragraph,
            highlighted=highlighted,
            question=question
        )

    @staticmethod
    def build_model_input(parsed: ParsedUserMessage) -> str:
        """Build a clean, structured message for the model."""
        parts = []

        if parsed.location:
            parts.append(f"[{parsed.location}]")

        if parsed.paragraph:
            parts.append(f"> {parsed.paragraph}")

        if parsed.highlighted:
            parts.append(f'[Highlighted: "{parsed.highlighted}"]')

        parts.append(parsed.question)

        return '\n\n'.join(parts)


@dataclass
class ChatContext:
    """Context needed to generate a chat response."""

    parsed: ParsedUserMessage
    text_info: TextInfo | None
    route_decision: RouteDecision
    model: str
    messages: list[dict]  # Full message list including system prompt


class ChatService:
    """Service for processing chat requests."""

    def __init__(
        self,
        client: OpenAI,
        router: RouterService,
        conversation_service: ConversationService,
    ):
        self._client = client
        self._router = router
        self._conversation = conversation_service

    def prepare_context(
        self,
        request: ChatRequest,
        text_info: TextInfo | None,
    ) -> ChatContext:
        """
        Prepare all context needed for generating a response.
        Shared between streaming and non-streaming endpoints.
        """
        # For AI-initiated messages, we don't add a user message
        if request.ai_initiate:
            # Get existing conversation (likely empty for first message)
            conversation = self._conversation.get_or_create(request.conversation_id)
            trimmed = self._conversation.trim_for_context(conversation)

            # Parse the context info (location, paragraph) even without a question
            parsed = MessageParser.parse(request.user_message) if request.user_message else ParsedUserMessage(
                location=None, paragraph=None, highlighted=None, question=""
            )

            # For AI-initiated, use deep routing to ensure thoughtful opening
            route_decision = RouteDecision(route="deep", effort="medium", confidence=1.0, reason="AI-initiated Socratic opening")
            model = self._router.get_model(route_decision)

            # Build system prompt with AI initiate flag
            system_prompt = build_system_prompt(text_info, request.mode, ai_initiate=True)

            # If context was provided (location/paragraph), add it as a system message
            context_parts = []
            if parsed.location:
                context_parts.append(f"The reader is at: [{parsed.location}]")
            if parsed.paragraph:
                context_parts.append(f"They are reading: \"{parsed.paragraph[:500]}{'...' if len(parsed.paragraph) > 500 else ''}\"")

            messages = [{"role": "system", "content": system_prompt}]
            if context_parts:
                messages.append({"role": "system", "content": "\n".join(context_parts)})
            messages.extend(trimmed)

            return ChatContext(
                parsed=parsed,
                text_info=text_info,
                route_decision=route_decision,
                model=model,
                messages=messages,
            )

        # Standard flow: parse user message and add to history
        parsed = MessageParser.parse(request.user_message)
        model_input = MessageParser.build_model_input(parsed)

        # Add to conversation history
        conversation = self._conversation.add_message(
            request.conversation_id,
            "user",
            model_input
        )

        # Trim conversation for context window
        trimmed = self._conversation.trim_for_context(conversation)

        # Route the query
        route_decision = self._router.decide(parsed, text_info)
        model = self._router.get_model(route_decision)

        # Build full message list
        system_prompt = build_system_prompt(text_info, request.mode)
        messages = [{"role": "system", "content": system_prompt}] + trimmed

        return ChatContext(
            parsed=parsed,
            text_info=text_info,
            route_decision=route_decision,
            model=model,
            messages=messages,
        )

    def generate_response(self, ctx: ChatContext, conversation_id: str) -> str:
        """Generate a non-streaming response."""
        response = self._client.responses.create(
            model=ctx.model,
            input=ctx.messages,
            reasoning={"effort": ctx.route_decision.effort}
        )

        assistant_message = response.output_text

        # Save to conversation history
        self._conversation.add_message(conversation_id, "assistant", assistant_message)

        return assistant_message

    def stream_response(self, ctx: ChatContext, conversation_id: str) -> Iterator[str]:
        """
        Generate a streaming SSE response.
        Yields SSE-formatted strings: 'data: {...}\n\n'
        """
        # Send routing info first
        yield f"data: {json.dumps({'routing': {'route': ctx.route_decision.route, 'effort': ctx.route_decision.effort}})}\n\n"

        full_response = ""
        try:
            stream = self._client.responses.create(
                model=ctx.model,
                input=ctx.messages,
                reasoning={"effort": ctx.route_decision.effort},
                stream=True
            )

            for event in stream:
                if event.type == "response.output_text.delta":
                    content = event.delta
                    full_response += content
                    yield f"data: {json.dumps({'content': content})}\n\n"

            # Save complete response to conversation history
            self._conversation.add_message(conversation_id, "assistant", full_response)

            yield f"data: {json.dumps({'done': True})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"


class TitleService:
    """Service for generating conversation titles."""

    def __init__(self, client: OpenAI):
        self._client = client

    def generate(
        self,
        text_title: str,
        text_author: str,
        first_user_message: str,
        first_assistant_message: str,
    ) -> str:
        """Generate a short title for a conversation based on the first exchange."""
        try:
            response = self._client.responses.create(
                model=settings.model_router,
                input=[
                    {
                        "role": "system",
                        "content": "Generate a concise 3-5 word title for this philosophy discussion. No quotes, no punctuation. Just the title words."
                    },
                    {
                        "role": "user",
                        "content": f"Text: {text_title} by {text_author}\n\nUser asked: {first_user_message[:200]}\n\nTutor replied about: {first_assistant_message[:300]}"
                    }
                ]
            )
            title = response.output_text.strip()
            return title.strip('"\'')
        except Exception:
            return "New discussion"
