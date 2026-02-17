import os
import re
from dataclasses import dataclass
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

app = FastAPI(title="Philosophy Insight")

# CORS configuration - defaults to localhost for development
# In production, set CORS_ORIGINS env var to comma-separated list of allowed origins
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory conversation storage (for MVP - would use DB in production)
conversations: dict[str, list] = {}

# Models
MODEL_ROUTER = "gpt-5-nano"   # Fast/cheap router
MODEL_BASIC = "gpt-5-mini"    # Quick responses for simple queries
MODEL_DEEP = "gpt-5.2"        # Deep reasoning for complex queries

# Conversation limits
MAX_HISTORY_MESSAGES = 50      # Keep up to 50 messages before summarizing
MESSAGES_TO_SUMMARIZE = 20     # When limit hit, summarize oldest 20 messages
MESSAGES_TO_KEEP = 30          # Keep most recent 30 messages at full fidelity


# --- Structured output schema for router ---
ROUTE_SCHEMA = {
    "name": "route_decision",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "route": {
                "type": "string",
                "enum": ["basic", "deep"],
                "description": "Whether to use basic (fast) or deep (reasoning) model"
            },
            "effort": {
                "type": "string",
                "enum": ["low", "high"],
                "description": "Reasoning effort level"
            },
            "confidence": {
                "type": "number",
                "description": "Confidence in routing decision (0.0 to 1.0)"
            },
            "reason": {
                "type": "string",
                "description": "Brief explanation of routing decision"
            }
        },
        "required": ["route", "effort", "confidence", "reason"],
        "additionalProperties": False
    }
}


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


class TextInfo(BaseModel):
    id: str
    title: str
    author: str
    translator: str | None = None
    year: str | None = None
    description: str | None = None
    category: str | None = None
    sections: list[dict]


class ChatRequest(BaseModel):
    conversation_id: str
    text_id: str
    user_message: str  # Contains embedded context (location + passage)
    mode: str = "tutor"  # "tutor" (default) or "socratic"


class ChatResponse(BaseModel):
    response: str
    conversation_id: str


def load_texts() -> dict[str, TextInfo]:
    """Load all available texts from the texts directory."""
    texts = {}
    texts_dir = os.path.join(os.path.dirname(__file__), "texts")

    if os.path.exists(texts_dir):
        for filename in os.listdir(texts_dir):
            if filename.endswith(".json"):
                with open(os.path.join(texts_dir, filename), "r") as f:
                    data = json.load(f)
                    texts[data["id"]] = TextInfo(**data)

    return texts


TEXTS = load_texts()


def parse_user_message(raw: str) -> ParsedUserMessage:
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


def build_router_input(parsed: ParsedUserMessage, text_info: TextInfo | None) -> str:
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


def build_model_input(parsed: ParsedUserMessage) -> str:
    """Build a clean, structured message for the model."""
    parts = []

    if parsed.location:
        parts.append(f"[{parsed.location}]")

    if parsed.paragraph:
        # Format paragraph with > prefix for clarity
        parts.append(f"> {parsed.paragraph}")

    if parsed.highlighted:
        parts.append(f'[Highlighted: "{parsed.highlighted}"]')

    parts.append(parsed.question)

    return '\n\n'.join(parts)


def decide_route(parsed: ParsedUserMessage, text_info: TextInfo | None) -> RouteDecision:
    """
    Use the router model to decide how to handle this query.
    Returns RouteDecision with model choice and reasoning effort.
    """
    router_input = build_router_input(parsed, text_info)

    router_prompt = """You are a routing classifier for a philosophy tutoring app.

Decide whether this query needs BASIC (fast, simple) or DEEP (reasoning, analysis) handling.

ROUTE TO BASIC when:
- Simple definitions ("What is X?")
- Factual questions ("When did Y live?")
- Straightforward clarifications
- The highlighted text (if any) is simple/clear

ROUTE TO DEEP when:
- The highlighted text is dense, abstract, or ambiguous
- Interpreting arguments or philosophical positions
- Questions about why/how an argument works
- Connecting ideas across the text
- The user expresses confusion about meaning
- Close reading of difficult passages

IMPORTANT: Consider the HIGHLIGHTED TEXT complexity, not just the question.
"What does this mean?" on a simple phrase = basic
"What does this mean?" on a dense Hegelian sentence = deep

Set confidence 0.0-1.0 based on how clear the routing decision is."""

    try:
        response = client.responses.create(
            model=MODEL_ROUTER,
            reasoning={"effort": "low"},
            input=[
                {"role": "system", "content": router_prompt},
                {"role": "user", "content": router_input}
            ],
            text={"format": {"type": "json_schema", "json_schema": ROUTE_SCHEMA}}
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


def summarize_messages(messages: list) -> str:
    """Summarize a list of messages into a concise context string."""
    # Format messages for summarization
    formatted = []
    for msg in messages:
        role = "User" if msg["role"] == "user" else "Tutor"
        content = msg["content"][:500]  # Truncate long messages for summarization
        formatted.append(f"{role}: {content}")

    messages_text = "\n\n".join(formatted)

    try:
        response = client.responses.create(
            model=MODEL_ROUTER,  # Use fast model for summarization
            input=[{
                "role": "user",
                "content": f"""Summarize this philosophy discussion in 2-3 sentences.
Capture the key concepts discussed, questions asked, and main points made.
Be concise but preserve philosophical terminology and specific ideas.

Discussion:
{messages_text}

Summary:"""
            }]
        )
        return response.output_text.strip()
    except Exception:
        # Fallback: just note that earlier discussion occurred
        return "Earlier discussion covered foundational concepts from this text."


def trim_conversation(conversation: list) -> list:
    """
    Manage conversation history with lazy summarization.
    - Under 50 messages: keep everything
    - Over 50 messages: summarize oldest 20, keep recent 30
    """
    if len(conversation) <= MAX_HISTORY_MESSAGES:
        return conversation

    # Split into old (to summarize) and recent (to keep)
    old_messages = conversation[:MESSAGES_TO_SUMMARIZE]
    recent_messages = conversation[-MESSAGES_TO_KEEP:]

    # Summarize old messages
    summary = summarize_messages(old_messages)

    # Create a system-style context message with the summary
    summary_message = {
        "role": "user",
        "content": f"[Earlier in our conversation: {summary}]"
    }

    # Return summary + recent messages
    return [summary_message] + recent_messages


def get_system_prompt(text_id: str, mode: str = "tutor") -> str:
    """Build the system prompt for the AI tutor."""
    text_info = TEXTS.get(text_id)
    text_title = text_info.title if text_info else "this philosophical text"
    text_author = text_info.author if text_info else "the author"

    context_instructions = """The reader's messages include structured context:
- [Book X, Section Y] indicates their location in the text
- Lines starting with > show the paragraph they're reading
- [Highlighted: "..."] shows the specific phrase they selected

When they ask about "this" or want explanation, focus on the highlighted text within its paragraph context. Ground your response in the specific passage when one is provided."""

    if mode == "socratic":
        return f"""You are a Socratic guide to {text_title} by {text_author}.

{context_instructions}

Your approach:
- Ask 1-2 thoughtful questions that help the reader discover insights themselves
- Guide toward understanding through inquiry, not instruction
- If they highlight text, ask questions that illuminate that specific passage
- If they seem stuck after several exchanges, offer a gentle hint
- Only give direct answers if they explicitly ask you to "just tell me"

You embody Socrates' method: wisdom comes from self-discovery."""

    # Default tutor mode
    return f"""You are an expert guide to {text_title} by {text_author}.

{context_instructions}

Your approach:
- Explain concepts and arguments with precision and depth
- When text is highlighted, anchor your explanation to that specific passage
- Connect ideas to the broader work and philosophical tradition
- Be direct and substantive - engage as an intellectual equal
- Let the conversation flow naturally

You have comprehensive knowledge of this text, its historical context, and the philosophical tradition."""


@app.get("/")
def read_root():
    return {"message": "Philosophy Insight API"}


@app.get("/texts")
def get_texts():
    """Return list of available texts (without full content)."""
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
        for t in TEXTS.values()
    ]


@app.get("/texts/{text_id}")
def get_text(text_id: str):
    """Return a specific text with all its sections."""
    if text_id not in TEXTS:
        raise HTTPException(status_code=404, detail="Text not found")
    return TEXTS[text_id]


@app.post("/chat/stream")
def chat_stream(request: ChatRequest):
    """Stream a chat response token by token. Sync endpoint to avoid blocking event loop."""

    # Get or create conversation
    if request.conversation_id not in conversations:
        conversations[request.conversation_id] = []

    conversation = conversations[request.conversation_id]

    # Parse the user message into structured components
    parsed = parse_user_message(request.user_message)

    # Build clean model input from parsed message
    model_input = build_model_input(parsed)

    # Add to conversation history
    conversation.append({
        "role": "user",
        "content": model_input
    })

    # Trim conversation to prevent unbounded growth
    trimmed = trim_conversation(conversation)

    # Route the query
    text_info = TEXTS.get(request.text_id)
    route_decision = decide_route(parsed, text_info)

    # Select model based on routing
    model = MODEL_DEEP if route_decision.route == "deep" else MODEL_BASIC

    system_prompt = get_system_prompt(request.text_id, request.mode)
    messages = [{"role": "system", "content": system_prompt}] + trimmed

    def generate():
        # Send routing info first so frontend can show appropriate loading state
        yield f"data: {json.dumps({'routing': {'route': route_decision.route, 'effort': route_decision.effort}})}\n\n"

        full_response = ""
        try:
            stream = client.responses.create(
                model=model,
                input=messages,
                reasoning={"effort": route_decision.effort},
                stream=True
            )

            for event in stream:
                if event.type == "response.output_text.delta":
                    content = event.delta
                    full_response += content
                    yield f"data: {json.dumps({'content': content})}\n\n"

            # Save the complete response to conversation history
            conversation.append({
                "role": "assistant",
                "content": full_response
            })

            yield f"data: {json.dumps({'done': True})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Send a message about a specific section and get AI response (non-streaming)."""

    # Get or create conversation
    if request.conversation_id not in conversations:
        conversations[request.conversation_id] = []

    conversation = conversations[request.conversation_id]

    # Parse the user message into structured components
    parsed = parse_user_message(request.user_message)

    # Build clean model input from parsed message
    model_input = build_model_input(parsed)

    # Add to conversation history
    conversation.append({
        "role": "user",
        "content": model_input
    })

    # Trim conversation to prevent unbounded growth
    trimmed = trim_conversation(conversation)

    # Route the query
    text_info = TEXTS.get(request.text_id)
    route_decision = decide_route(parsed, text_info)

    # Select model based on routing
    model = MODEL_DEEP if route_decision.route == "deep" else MODEL_BASIC

    system_prompt = get_system_prompt(request.text_id, request.mode)
    messages = [{"role": "system", "content": system_prompt}] + trimmed

    try:
        response = client.responses.create(
            model=model,
            input=messages,
            reasoning={"effort": route_decision.effort}
        )

        assistant_message = response.output_text

        # Add assistant response to conversation
        conversation.append({
            "role": "assistant",
            "content": assistant_message
        })

        return ChatResponse(
            response=assistant_message,
            conversation_id=request.conversation_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/conversations/{conversation_id}")
def clear_conversation(conversation_id: str):
    """Clear a conversation to start fresh."""
    if conversation_id in conversations:
        del conversations[conversation_id]
    return {"status": "cleared"}


class TitleRequest(BaseModel):
    text_title: str
    text_author: str
    first_user_message: str
    first_assistant_message: str


@app.post("/generate-title")
def generate_title(request: TitleRequest):
    """Generate a short title for a conversation based on the first exchange."""
    try:
        response = client.responses.create(
            model=MODEL_ROUTER,
            input=[
                {
                    "role": "system",
                    "content": "Generate a concise 3-5 word title for this philosophy discussion. No quotes, no punctuation. Just the title words."
                },
                {
                    "role": "user",
                    "content": f"Text: {request.text_title} by {request.text_author}\n\nUser asked: {request.first_user_message[:200]}\n\nTutor replied about: {request.first_assistant_message[:300]}"
                }
            ]
        )
        title = response.output_text.strip()
        # Clean up any quotes or extra punctuation
        title = title.strip('"\'')
        return {"title": title}
    except Exception as e:
        # Return a fallback if generation fails
        return {"title": "New discussion", "error": str(e)}


# Reload texts on startup and provide a reload endpoint for development
@app.post("/reload-texts")
def reload_texts():
    """Reload texts from disk (useful during development)."""
    global TEXTS
    TEXTS = load_texts()
    return {"status": "reloaded", "count": len(TEXTS)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
