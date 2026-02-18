"""Philosophy Insight API - FastAPI application entry point."""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from config import settings
from routes import texts_router, chat_router, conversations_router
from rate_limit import limiter

app = FastAPI(title="Philosophy Insight")
app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Handle rate limit exceeded with a friendly message."""
    return JSONResponse(
        status_code=429,
        content={
            "error": "rate_limit_exceeded",
            "message": "You've reached your discussion limit. Take a moment to reflect—the philosophers will wait.",
            "retry_after": exc.detail,
        }
    )

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(texts_router)
app.include_router(chat_router)
app.include_router(conversations_router)


@app.get("/")
def read_root():
    return {"message": "Philosophy Insight API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
