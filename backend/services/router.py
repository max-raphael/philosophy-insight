"""Query routing service for adaptive model selection."""

import json
from openai import OpenAI

from config import settings, ROUTE_SCHEMA
from models.domain import ParsedUserMessage, RouteDecision
from models.api import TextInfo
from prompts.router import ROUTER_PROMPT


class RouterService:
    """Service for routing queries to appropriate models."""

    def __init__(self, client: OpenAI):
        self._client = client

    def decide(self, parsed: ParsedUserMessage, text_info: TextInfo | None) -> RouteDecision:
        """
        Decide how to handle a query based on complexity.
        Returns RouteDecision with model choice and reasoning effort.
        """
        router_input = self._build_router_input(parsed, text_info)

        try:
            response = self._client.responses.create(
                model=settings.model_router,
                reasoning={"effort": "low"},
                input=[
                    {"role": "system", "content": ROUTER_PROMPT},
                    {"role": "user", "content": router_input}
                ],
                text={
                    "format": {
                        "type": "json_schema",
                        "name": ROUTE_SCHEMA["name"],
                        "schema": ROUTE_SCHEMA["schema"]
                    }
                }
            )

            result = json.loads(response.output_text)

            route = result.get("route", "deep")
            effort = result.get("effort", "high")
            confidence = float(result.get("confidence", 0.5))
            reason = result.get("reason", "")

            # Fail-safe: if confidence is low, default to deep/high
            if confidence < 0.65:
                route = "deep"
                effort = "high"
                reason = f"Low confidence ({confidence:.2f}), defaulting to deep. Original: {reason}"

            return RouteDecision(
                route=route,
                effort=effort,
                confidence=confidence,
                reason=reason
            )

        except Exception as e:
            # On any error, fail safe to deep reasoning
            return RouteDecision(
                route="deep",
                effort="high",
                confidence=0.0,
                reason=f"Router error, defaulting to deep: {str(e)}"
            )

    def get_model(self, decision: RouteDecision) -> str:
        """Get the model name for a routing decision."""
        return settings.model_deep if decision.route == "deep" else settings.model_basic

    def _build_router_input(self, parsed: ParsedUserMessage, text_info: TextInfo | None) -> str:
        """Build the input string for the router, emphasizing the highlighted text."""
        parts = []

        if text_info:
            parts.append(f"Text: {text_info.title} by {text_info.author}")

        if parsed.location:
            parts.append(f"Location: {parsed.location}")

        if parsed.highlighted:
            parts.append(f"Highlighted text: \"{parsed.highlighted}\"")

        if parsed.paragraph:
            # Truncate long paragraphs for router
            para_preview = parsed.paragraph[:300] + "..." if len(parsed.paragraph) > 300 else parsed.paragraph
            parts.append(f"Paragraph context: {para_preview}")

        parts.append(f"Question: {parsed.question}")

        return '\n'.join(parts)
