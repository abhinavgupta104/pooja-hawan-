# ============================================================
# start_backend.ps1  — Windows PowerShell startup script
# Run from: kundali-backend\ directory
# Usage:    .\start_backend.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Kundali Backend — Windows Launcher   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Activate the MSYS2-based virtual environment (venv_win)
$ActivateScript = Join-Path $ScriptDir "venv_win\bin\Activate.ps1"
if (-Not (Test-Path $ActivateScript)) {
    Write-Host "[ERROR] Virtual environment not found at: $ActivateScript" -ForegroundColor Red
    Write-Host "        Please run setup_backend.ps1 first." -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/2] Activating virtual environment..." -ForegroundColor Green
& $ActivateScript

Write-Host "[2/2] Starting Flask backend on http://127.0.0.1:8080 ..." -ForegroundColor Green
Write-Host "      Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

python (Join-Path $ScriptDir "app.py")
