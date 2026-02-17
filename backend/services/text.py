"""Text loading and management service."""

import json
import os
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

        if not os.path.exists(self._texts_dir):
            return 0

        for filename in os.listdir(self._texts_dir):
            if filename.endswith(".json"):
                filepath = os.path.join(self._texts_dir, filename)
                with open(filepath, "r") as f:
                    data = json.load(f)
                    self._texts[data["id"]] = TextInfo(**data)

        return len(self._texts)

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
