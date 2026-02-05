# Start the Backend Server using Uvicorn
# Make sure you have installed requirements: pip install -r requirements.txt

$env:IBM_QUANTUM_TOKEN = "AkatdF_O8CIREDSatmfKQuXiJPpI8o7bu3PhgrGyCIdy" # Pre-filling from .env for convenience, but ideally load .env
$env:IBM_QUANTUM_INSTANCE = "crn:v1:bluemix:public:quantum-computing:us-east:a/ba0357b33485454f97a21cd582168d43:89b5bd06-6eac-497d-abf8-aa8e8e8728a9::"
$env:IBM_QUANTUM_CHANNEL = "ibm_cloud"

Write-Host "Starting IBM Quantum Backend on http://localhost:8000..." -ForegroundColor Cyan
uvicorn backend:app --reload --port 8000
