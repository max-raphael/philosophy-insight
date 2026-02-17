"""Prompt templates for LLM interactions."""

from prompts.router import ROUTER_PROMPT
from prompts.system import build_system_prompt

__all__ = ["ROUTER_PROMPT", "build_system_prompt"]
