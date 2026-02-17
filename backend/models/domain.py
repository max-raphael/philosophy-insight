"""Domain models - internal business objects."""

from dataclasses import dataclass


@dataclass
class ParsedUserMessage:
    """Structured representation of a user message with embedded context."""

    location: str | None      # e.g., "Book 2, Section 3"
    paragraph: str | None     # The full paragraph being read
    highlighted: str | None   # The specific phrase highlighted
    question: str             # The user's actual question


@dataclass
class RouteDecision:
    """Router's decision on how to handle a query."""

    route: str      # "basic" or "deep"
    effort: str     # "low" or "high"
    confidence: float
    reason: str
