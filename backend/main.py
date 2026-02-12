import os
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
    user_message: str
    # Spatial context - where the reader is in the text
    book: int | None = None
    section: int | None = None
    paragraph_content: str | None = None
    prev_paragraph: str | None = None
    next_paragraph: str | None = None


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


def get_system_prompt(request: ChatRequest) -> str:
    """Build the system prompt for the AI tutor with spatial context."""
    text_info = TEXTS.get(request.text_id)
    text_title = text_info.title if text_info else "this philosophical text"
    text_author = text_info.author if text_info else "the author"

    # Build spatial context section
    spatial_context = ""
    if request.paragraph_content:
        spatial_context = f"""
The reader is currently focused on Book {request.book}, Section {request.section}.

The paragraph they are reading:
---
{request.paragraph_content}
---
"""
        if request.prev_paragraph:
            spatial_context += f"""
Previous paragraph (for context):
---
{request.prev_paragraph[:500]}{"..." if len(request.prev_paragraph) > 500 else ""}
---
"""
        if request.next_paragraph:
            spatial_context += f"""
Next paragraph (for context):
---
{request.next_paragraph[:500]}{"..." if len(request.next_paragraph) > 500 else ""}
---
"""
    else:
        spatial_context = """
The reader has not focused on a specific paragraph yet. They may be asking general questions about the text.
"""

    return f"""You are a thoughtful philosophy tutor helping someone read and understand {text_title} by {text_author}.

{spatial_context}

Your role is to:
1. Help them understand the passage they are focused on
2. Explain concepts, terminology, and arguments clearly
3. Connect ideas to the broader context of the work and philosophical tradition
4. Ask guiding questions when appropriate to deepen their understanding
5. Be patient with confusion - philosophy is hard!

Keep responses focused and conversational. Don't lecture - engage in dialogue. If they ask a simple question, give a clear answer. If they seem confused, help them work through it step by step.

When they ask about "this" or "this passage" or "what does this mean", they are referring to the paragraph they are focused on.

You have deep knowledge of this text, its historical context, and the philosophical tradition it belongs to. Draw on this knowledge naturally in your responses."""


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
async def chat_stream(request: ChatRequest):
    """Stream a chat response token by token."""

    # Get or create conversation
    if request.conversation_id not in conversations:
        conversations[request.conversation_id] = []

    conversation = conversations[request.conversation_id]

    # Add user message to conversation
    conversation.append({
        "role": "user",
        "content": request.user_message
    })

    system_prompt = get_system_prompt(request)
    messages = [{"role": "system", "content": system_prompt}] + conversation

    async def generate():
        full_response = ""
        try:
            stream = client.chat.completions.create(
                model="gpt-4o",
                max_tokens=1024,
                messages=messages,
                stream=True
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
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

    # Add user message to conversation
    conversation.append({
        "role": "user",
        "content": request.user_message
    })

    system_prompt = get_system_prompt(request)
    messages = [{"role": "system", "content": system_prompt}] + conversation

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            max_tokens=1024,
            messages=messages
        )

        assistant_message = response.choices[0].message.content

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
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use smaller model for speed/cost
            max_tokens=20,
            messages=[
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
        title = response.choices[0].message.content.strip()
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
