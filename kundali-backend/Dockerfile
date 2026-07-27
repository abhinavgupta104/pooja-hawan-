FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if required for pyswisseph (gcc)
RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run with gunicorn — honor Cloud Run's $PORT (defaults to 8080).
# --preload imports the app once in the master before forking workers,
# roughly halving cold-start CPU work vs each worker importing separately.
# 2 workers x 8 threads = 16 concurrent requests, matched to the Cloud Run
# containerConcurrency setting so requests aren't queued behind a full pool.
# --timeout 60 covers the worst case where an unknown place needs a remote
# geocode; cached and table-backed lookups return in milliseconds.
CMD exec gunicorn --bind 0.0.0.0:${PORT:-8080} \
    --workers 2 --threads 8 --preload \
    --timeout 60 --graceful-timeout 30 --keep-alive 65 \
    --access-logfile - --error-logfile - \
    app:app
