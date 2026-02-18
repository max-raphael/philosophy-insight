"""Feedback submission endpoint - creates GitHub issues."""

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional

from config import settings
from rate_limit import limiter

router = APIRouter(tags=["feedback"])


class FeedbackRequest(BaseModel):
    """Feedback submission payload."""
    category: str  # bug, feature, text-request, general
    message: str
    name: Optional[str] = None
    email: Optional[str] = None


@router.post("/feedback")
@limiter.limit("10/hour")
async def submit_feedback(request: Request, feedback: FeedbackRequest):
    """Submit feedback as a GitHub issue."""
    if not settings.github_token:
        raise HTTPException(
            status_code=503,
            detail="Feedback submission is not configured. Please try again later."
        )

    if not feedback.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    if len(feedback.message) > 5000:
        raise HTTPException(status_code=400, detail="Message too long (max 5000 characters)")

    # Map category to label and title prefix
    category_config = {
        "bug": {"label": "bug", "prefix": "Bug Report"},
        "feature": {"label": "enhancement", "prefix": "Feature Request"},
        "text-request": {"label": "text-request", "prefix": "Text Request"},
        "general": {"label": "feedback", "prefix": "Feedback"},
    }

    config = category_config.get(feedback.category, category_config["general"])

    # Build issue body
    body_parts = [feedback.message]

    if feedback.name or feedback.email:
        body_parts.append("\n---")
        body_parts.append("*Submitted via feedback form*")
        if feedback.name:
            body_parts.append(f"- Name: {feedback.name}")
        if feedback.email:
            body_parts.append(f"- Email: {feedback.email}")
    else:
        body_parts.append("\n---\n*Submitted anonymously via feedback form*")

    issue_body = "\n".join(body_parts)

    # Create GitHub issue
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.github.com/repos/{settings.github_repo}/issues",
            headers={
                "Authorization": f"Bearer {settings.github_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            json={
                "title": f"[{config['prefix']}] {feedback.message[:50]}{'...' if len(feedback.message) > 50 else ''}",
                "body": issue_body,
                "labels": [config["label"]],
            },
            timeout=10.0,
        )

        if response.status_code == 201:
            issue_data = response.json()
            return {
                "success": True,
                "message": "Thank you for your feedback!",
                "issue_number": issue_data.get("number"),
            }
        else:
            # Log error but don't expose details to user
            print(f"GitHub API error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=502,
                detail="Failed to submit feedback. Please try again later."
            )
