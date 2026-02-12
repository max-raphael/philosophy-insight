# Contributing Guide

Development workflow, setup, and testing procedures for Philosophy Insight.

---

## Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- **OpenAI API key**

---

## Environment Setup

### Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn openai python-dotenv pydantic

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Frontend

```bash
cd frontend
npm install
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for chat completions |

Location: `backend/.env`

---

## Development Workflow

### Starting the Dev Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Available Scripts

#### Frontend (`frontend/package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start development server with HMR |
| `build` | `tsc -b && vite build` | Type-check and build for production |
| `lint` | `eslint .` | Run ESLint on all files |
| `preview` | `vite preview` | Preview production build locally |

#### Backend

| Command | Description |
|---------|-------------|
| `python main.py` | Start FastAPI server on port 8000 |
| `curl -X POST http://localhost:8000/reload-texts` | Reload text JSON files without restart |

---

## Adding New Texts

1. Create a JSON file in `backend/texts/`:

```json
{
  "id": "unique-slug",
  "title": "Book Title",
  "author": "Author Name",
  "translator": "Translator (optional)",
  "year": "Publication Year",
  "description": "Brief description",
  "category": "ancient|enlightenment|modern",
  "sections": [
    {"book": 1, "number": 1, "content": "First paragraph..."},
    {"book": 1, "number": 2, "content": "Second paragraph..."}
  ]
}
```

2. Reload texts:
```bash
curl -X POST http://localhost:8000/reload-texts
```

---

## Code Style

- **Frontend:** TypeScript, React, Tailwind CSS v4
- **Backend:** Python, FastAPI, Pydantic
- **Fonts:** Libre Baskerville (text), Inter (UI)

Run linting before commits:
```bash
cd frontend && npm run lint
```

---

## Testing

### Manual Testing

1. Start both servers
2. Navigate to http://localhost:5173
3. Select a text from the library
4. Highlight text and click "Discuss"
5. Verify AI response streams correctly

### Build Verification

```bash
cd frontend
npm run build
```

Build must complete without TypeScript errors.

---

## Project Structure

```
/backend
  main.py           # FastAPI routes and OpenAI integration
  texts/*.json      # Philosophy text files
  .env              # Environment variables (not committed)
  .env.example      # Environment template

/frontend
  src/
    App.tsx         # Router setup
    pages/
      Home.tsx      # Library grid
      Reader.tsx    # Reading view (page)
    components/
      Reader.tsx    # Text display component
      DiscussionPanel.tsx  # Chat interface
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/texts` | List all texts (metadata only) |
| GET | `/texts/{id}` | Get full text with sections |
| POST | `/chat/stream` | Stream chat response (SSE) |
| DELETE | `/conversations/{id}` | Clear conversation history |
| POST | `/reload-texts` | Reload text files from disk |
