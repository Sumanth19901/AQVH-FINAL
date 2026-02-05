# How to Run the AQVH Application

This project consists of a **Next.js Frontend** and a **Python FastAPI Backend**. You need to run both to get the full experience.

## 🚀 Option 1: One-Click Script (Recommended)

We have a unified script that sets up the environment, installs dependencies, and launches both servers for you.

1.  Open PowerShell in the project root (`d:\AQVH\AQVH-FINAL\AQVH-FINAL`).
2.  Run the script:
    ```powershell
    ./run_app.ps1
    ```
    *This will open the backend in a new window and run the frontend in the current window.*

---

## 🛠 Option 2: Manual Setup

If you prefer to run things manually or need to debug, follow these steps.

### 1. Start the Backend (Python)

1.  **Open a Terminal** (Command Prompt or PowerShell).
2.  **Navigate to the project folder**:
    ```powershell
    cd d:\AQVH\AQVH-FINAL\AQVH-FINAL
    ```
3.  **Create a Virtual Environment** (only needed once):
    ```powershell
    python -m venv venv
    ```
4.  **Activate the Environment**:
    ```powershell
    .\venv\Scripts\Activate
    ```
5.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```
6.  **Set Environment Variables** (Critical for IBM Quantum connection):
    ```powershell
    $env:IBM_QUANTUM_TOKEN = "AkatdF_O8CIREDSatmfKQuXiJPpI8o7bu3PhgrGyCIdy"
    $env:IBM_QUANTUM_INSTANCE = "crn:v1:bluemix:public:quantum-computing:us-east:a/ba0357b33485454f97a21cd582168d43:89b5bd06-6eac-497d-abf8-aa8e8e8728a9::"
    $env:IBM_QUANTUM_CHANNEL = "ibm_cloud"
    ```
7.  **Run the Server**:
    ```powershell
    uvicorn backend:app --reload --port 8000
    ```
    *You should see: `Uvicorn running on http://127.0.0.1:8000`*

### 2. Start the Frontend (Next.js)

1.  **Open a NEW Terminal**.
2.  **Navigate to the project folder**:
    ```powershell
    cd d:\AQVH\AQVH-FINAL\AQVH-FINAL
    ```
3.  **Install Node Dependencies** (only needed once):
    ```bash
    npm install
    ```
4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
5.  **Open in Browser**:
    Visit [http://localhost:3000](http://localhost:3000).

---

## 💡 Troubleshooting

-   **"uvicorn is not recognized"**: Make sure you activated the virtual environment (`.\venv\Scripts\Activate`) before running the command.
-   **"Backend API Error" in Dashboard**: Ensure the backend is running on port 8000.
-   **Demo Mode**: By default, the app might be in Demo Mode. Go to **Settings > Demo Mode** to toggle it OFF and see real data from the running backend.
