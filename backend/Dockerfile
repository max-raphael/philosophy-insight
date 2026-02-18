FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and texts
COPY main.py .
COPY config.py .
COPY dependencies.py .
COPY rate_limit.py .
COPY models/ models/
COPY services/ services/
COPY routes/ routes/
COPY prompts/ prompts/
COPY texts/ texts/

# Railway sets PORT env var
EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
