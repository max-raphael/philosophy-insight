"""Text loading and management service."""

import json
import os
from config import settings
from models.api import TextInfo


class TextService:
    """Service for loading and accessing philosophy texts."""

    def __init__(self, texts_dir: str | None = None):
        """Initialize with optional custom texts directory."""
        if texts_dir is None:
            texts_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "texts")
        self._texts_dir = texts_dir
        self._texts: dict[str, TextInfo] = {}
        self.reload()

    def reload(self) -> int:
        """Reload all texts from disk. Returns count of texts loaded."""
        self._texts = {}
        self._full_text_cache: dict[str, str | None] = {}

        if not os.path.exists(self._texts_dir):
            return 0

        for filename in os.listdir(self._texts_dir):
            if filename.endswith(".json"):
                filepath = os.path.join(self._texts_dir, filename)
                with open(filepath, "r") as f:
                    data = json.load(f)
                    self._texts[data["id"]] = TextInfo(**data)

        return len(self._texts)

    def full_text(self, text_id: str) -> str | None:
        """
        Return the whole text formatted for model context, with every section
        labelled [Book X, Section Y] so the model can cite locations.
        Returns None if the text isn't enabled for full-text context or is too long.
        """
        if text_id in self._full_text_cache:
            return self._full_text_cache[text_id]

        result = None
        text = self._texts.get(text_id)
        enabled = "*" in settings.full_text_ids or text_id in settings.full_text_ids
        if text and enabled:
            body = "\n\n".join(
                f"[Book {s.get('book', 1)}, Section {s.get('number', i + 1)}]\n{s.get('content', '')}"
                for i, s in enumerate(text.sections)
            )
            # ~4 characters per token is a good enough estimate for English prose
            if len(body) // 4 <= settings.full_text_max_tokens:
                result = body

        self._full_text_cache[text_id] = result
        return result

    def get(self, text_id: str) -> TextInfo | None:
        """Get a text by ID, or None if not found."""
        return self._texts.get(text_id)

    def get_all(self) -> list[TextInfo]:
        """Get all available texts."""
        return list(self._texts.values())

    def list_metadata(self) -> list[dict]:
        """Get metadata for all texts (without full content)."""
        return [
            {
                "id": t.id,
                "title": t.title,
                "author": t.author,
                "translator": t.translator,
                "year": t.year,
                "description": t.description,
                "category": t.category,
            }
            for t in self._texts.values()
        ]

    @property
    def count(self) -> int:
        """Number of texts loaded."""
        return len(self._texts)
