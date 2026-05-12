#!/usr/bin/env bash
# ============================================================
# start_backend.sh  — Linux / macOS startup script
# Run from: kundali-backend/ directory
# Usage:    chmod +x start_backend.sh && ./start_backend.sh
# ============================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "========================================"
echo "  Kundali Backend — Linux Launcher      "
echo "========================================"
echo ""

VENV_DIR="$SCRIPT_DIR/venv"

# Create venv if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "[1/3] Creating virtual environment at $VENV_DIR ..."
    python3 -m venv "$VENV_DIR"
else
    echo "[1/3] Virtual environment already exists."
fi

# Activate venv
source "$VENV_DIR/bin/activate"
echo "[2/3] Virtual environment activated."

# Install / upgrade dependencies
echo "[3/3] Installing requirements..."
pip install --quiet --upgrade pip
pip install --quiet -r "$SCRIPT_DIR/requirements.txt"

echo ""
echo "Starting Flask backend on http://127.0.0.1:8080 ..."
echo "Press Ctrl+C to stop."
echo ""

python "$SCRIPT_DIR/app.py"
