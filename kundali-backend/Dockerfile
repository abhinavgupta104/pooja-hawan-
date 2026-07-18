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

# Run with gunicorn — honor Cloud Run's $PORT (defaults to 8080),
# 60s timeout since geocoding of unusual places can be slow
CMD exec gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 2 --threads 4 --timeout 60 app:app
