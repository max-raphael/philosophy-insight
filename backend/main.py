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
    user_message: str  # Contains embedded context (location + passage)


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


def get_system_prompt(text_id: str) -> str:
    """Build the system prompt for the AI tutor."""
    text_info = TEXTS.get(text_id)
    text_title = text_info.title if text_info else "this philosophical text"
    text_author = text_info.author if text_info else "the author"

    return f"""You are an expert guide to {text_title} by {text_author}.

The reader's messages include context showing where they are in the text:
- [Book X, Section Y] indicates their location
- Quoted text (>) shows the passage they're reading or text they highlighted

When they refer to "this" or ask "what does this mean", look at the quoted passage in their message. When context changes between messages (different book/section), they've moved to a new part of the text.

Your approach:
- Explain concepts and arguments with precision and depth
- Connect ideas to the broader work and philosophical tradition
- Be direct and substantive - engage as an intellectual equal, not a simplifier
- Don't end every response with a question - let the conversation flow naturally

You have comprehensive knowledge of this text, its historical context, and the philosophical tradition. Draw on this expertise naturally."""


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

    system_prompt = get_system_prompt(request.text_id)
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

    system_prompt = get_system_prompt(request.text_id)
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
