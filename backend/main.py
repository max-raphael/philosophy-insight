"""Philosophy Insight API - FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routes import texts_router, chat_router, conversations_router

app = FastAPI(title="Philosophy Insight")

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
