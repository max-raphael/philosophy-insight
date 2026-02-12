# Runbook

Deployment, monitoring, and troubleshooting procedures for Philosophy Insight.

---

## Local Deployment

### Starting Services

**Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```
- Runs on: `http://localhost:8000`
- Logs to: stdout

**Frontend:**
```bash
cd frontend
npm run dev
```
- Runs on: `http://localhost:5173`
- HMR enabled

### Stopping Services

- `Ctrl+C` in each terminal
- Or find and kill processes:
```bash
lsof -i :8000  # Backend
lsof -i :5173  # Frontend
kill <PID>
```

---

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

Serve with any static file server or deploy to Vercel/Netlify.

### Backend

For production, use uvicorn with workers:

```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## Health Checks

### Backend API

```bash
curl http://localhost:8000/
# Expected: {"message": "Philosophy Insight API"}

curl http://localhost:8000/texts
# Expected: JSON array of available texts
```

### Frontend

Navigate to `http://localhost:5173` - should show library grid.

---

## Common Issues and Fixes

### "Error: Failed to send message"

**Cause:** Backend not running or running old code.

**Fix:**
```bash
# Check if backend is running
lsof -i :8000

# Restart backend
kill <PID>
cd backend && source venv/bin/activate && python main.py
```

### "OPENAI_API_KEY not found"

**Cause:** Missing or invalid `.env` file.

**Fix:**
```bash
cd backend
cp .env.example .env
# Edit .env and add valid API key
```

### Frontend TypeScript Errors

**Cause:** Type mismatches after code changes.

**Fix:**
```bash
cd frontend
npm run build  # Shows exact errors
# Fix errors, then rebuild
```

### Text Not Appearing

**Cause:** Text JSON file not loaded.

**Fix:**
```bash
# Reload texts without restart
curl -X POST http://localhost:8000/reload-texts

# Verify text exists
curl http://localhost:8000/texts
```

### CORS Errors

**Cause:** Frontend/backend port mismatch.

**Fix:** Ensure frontend runs on port 5173 and backend on 8000. Check `main.py` CORS settings:
```python
allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"]
```

### Streaming Not Working

**Cause:** SSE connection issues.

**Fix:**
1. Check browser DevTools Network tab for `/chat/stream`
2. Verify response content-type is `text/event-stream`
3. Check backend logs for errors

---

## Logs

### Backend Logs

Logs print to stdout. Look for:
- Startup messages
- Request logs
- OpenAI API errors

### Frontend Logs

Browser DevTools Console:
- React errors
- Network failures
- State issues

---

## Rollback Procedures

### Code Rollback

```bash
git log --oneline -10  # Find good commit
git checkout <commit>   # Rollback
```

### Database/State Rollback

**Conversations:** Stored in browser localStorage. Clear via:
- DevTools > Application > Local Storage > Clear
- Or click "Clear" button in Discussion panel

**Backend conversations:** In-memory only. Restart backend to clear.

---

## Monitoring Checklist

- [ ] Backend responds to health check
- [ ] Frontend loads without errors
- [ ] Text selection popup appears
- [ ] Chat messages stream correctly
- [ ] Conversations persist on refresh

---

## Emergency Contacts

This is a personal project. For issues:
- Check this runbook
- Review `WORKING.md` for current status
- Check `NORTH_STAR.md` for product context
