# One-click script to run the Full Stack Application on Windows
$ErrorActionPreference = "Stop"

Write-Host "Initializing AQVH Application..." -ForegroundColor Cyan

# 1. Check/Create Python Virtual Environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# 2. Activate Virtual Environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
try {
    .\venv\Scripts\Activate.ps1
}
catch {
    # Fallback if execution policy blocks script
    cmd /c "venv\Scripts\activate.bat"
}

# 3. Install Python Dependencies
if (Test-Path "requirements.txt") {
    Write-Host "Installing/Updating Python dependencies..." -ForegroundColor Yellow
    .\venv\Scripts\pip install -r requirements.txt | Out-Null
}
else {
    Write-Host "requirements.txt not found!" -ForegroundColor Red
}

# 4. Start Backend (in a new window)
Write-Host "Starting Backend Server (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {
    $env:IBM_QUANTUM_TOKEN = 'AkatdF_O8CIREDSatmfKQuXiJPpI8o7bu3PhgrGyCIdy';
    $env:IBM_QUANTUM_INSTANCE = 'crn:v1:bluemix:public:quantum-computing:us-east:a/ba0357b33485454f97a21cd582168d43:89b5bd06-6eac-497d-abf8-aa8e8e8728a9::';
    $env:IBM_QUANTUM_CHANNEL = 'ibm_cloud';
    cd '$PWD';
    .\venv\Scripts\uvicorn backend:app --reload --port 8000
}"

# 5. Start Frontend (in current window or new window)
Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Green
Write-Host "   (Press Ctrl+C to stop the frontend)" -ForegroundColor Gray

# Check if node_modules exists, install if not
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
}

npm run dev
