
import logging
import hashlib
import os
from datetime import timezone
from typing import Any, Optional, List
import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from qiskit_ibm_runtime import QiskitRuntimeService, Sampler, Options
from qiskit.circuit.library import RealAmplitudes
from qiskit import QuantumCircuit
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# -------------------------
# Logging
# -------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quantum-tracker")

# -------------------------
# IBM Quantum Credentials
# -------------------------
TOKEN = os.getenv("IBM_QUANTUM_TOKEN", "")
INSTANCE = os.getenv("IBM_QUANTUM_INSTANCE", "")
CHANNEL = os.getenv("IBM_QUANTUM_CHANNEL", "ibm_cloud")

# Only attempt to connect if credentials are provided
service = None
if TOKEN and INSTANCE:
    try:
        service = QiskitRuntimeService(
            channel=CHANNEL,
            token=TOKEN,
            instance=INSTANCE,
        )
        logger.info("✅ Connected to IBM Quantum Runtime service")
    except Exception as e:
        logger.exception("❌ Failed to connect to IBM Quantum: %s", e)
        logger.warning("⚠️  Running without live IBM Quantum connection - API endpoints may fail")
else:
    logger.warning("⚠️  IBM Quantum credentials not found in environment variables")
    logger.warning("⚠️  Set IBM_QUANTUM_TOKEN and IBM_QUANTUM_INSTANCE in .env file")
    logger.warning("⚠️  Running without live IBM Quantum connection - API endpoints may fail")

# -------------------------
# Pydantic Models
# -------------------------
class JobSubmission(BaseModel):
    program_id: str = "sampler"
    backend: Optional[str] = None
    params: Optional[dict] = {}


# -------------------------
# FastAPI app
# -------------------------
app = FastAPI(title="IBM Quantum Job Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Helpers
# -------------------------
STATUS_MAP = {
    "QUEUED": "QUEUED",
    "RUNNING": "RUNNING",
    "COMPLETED": "COMPLETED",
    "ERROR": "ERROR",
    "CANCELLED": "CANCELLED",
    "CANCELED": "CANCELED",
    "DONE": "COMPLETED",
    "UNKNOWN": "UNKNOWN",
}


def normalize_status(status_obj: Any) -> str:
    try:
        if not status_obj:
            return "UNKNOWN"
        if hasattr(status_obj, "name"):
            s = status_obj.name
        elif hasattr(status_obj, "value"):
            s = status_obj.value
        else:
            s = str(status_obj)
        s = s.split(".")[-1].upper()
        return STATUS_MAP.get(s, s.title())
    except Exception:
        return "UNKNOWN"


def mask_user_id(user_id: str) -> str:
    if not user_id:
        return "Quantum User"
    hashed = hashlib.sha256(user_id.encode()).hexdigest()
    return f"user_{hashed[:6]}"


def safe_call(obj, attr):
    try:
        val = getattr(obj, attr, None)
        return val() if callable(val) else val
    except Exception:
        return None


async def job_to_dict(job) -> dict:
    try:
        # 🔍 Debug: Log available job attributes
        logger.debug(f"[DEBUG] Job attributes: {dir(job)}")

        backend = job.backend()
        backend_name = safe_call(backend, "name") if backend else None
        qubit_count = safe_call(backend, "num_qubits") if backend else None


        status = normalize_status(safe_call(job, "status"))

        created = safe_call(job, "creation_date")
        created_iso = created.astimezone(timezone.utc).isoformat() if created else None

        completed = safe_call(job, "end_date")
        completed_iso = completed.astimezone(timezone.utc).isoformat() if completed else None

        elapsed_time = (completed - created).total_seconds() if created and completed else None

        usage_seconds = safe_call(job, "usage")
        qpu_seconds = safe_call(job, "qpu_usage_seconds")
        logs = safe_call(job, "logs")
        
        # Get results, ensuring it's serializable
        results_dict = {}
        if status == "COMPLETED":
            try:
                job_results = await asyncio.to_thread(job.result)
                if job_results:
                    # Assuming results have a get_counts method
                    if hasattr(job_results, 'get_counts'):
                        counts = job_results.get_counts()
                        # Qiskit Counts can be a list or single object
                        if isinstance(counts, list):
                            results_dict = {f"circuit_{i}": c.hex_outcomes() for i, c in enumerate(counts)}
                        else:
                            results_dict = counts.hex_outcomes()
                    else:
                        results_dict = {'data': 'Result object not in expected format.'}
            except Exception as res_e:
                logger.error(f"Error parsing results for job {safe_call(job, 'job_id')}: {res_e}")
                results_dict = {'error': 'Could not serialize results.'}


        status_history = safe_call(job, "status_history") or []
        
        # This is a method on the job object, call it safely
        circuit_image_url = safe_call(job, "image")

        # ✅ Safe fallback if user not found
        raw_user = safe_call(job, "user") or safe_call(job, "instance") or "default"
        masked_user = mask_user_id(str(raw_user))

        return {
            "id": safe_call(job, "job_id"),
            "status": status,
            "backend": backend_name,
            "qubit_count": qubit_count,
            "submitted": created_iso,
            "elapsed_time": elapsed_time,
            "user": masked_user,
            "qpu_seconds": qpu_seconds,
            "logs": logs,
            "results": results_dict,
            "status_history": status_history,
            "circuit_image_url": circuit_image_url,
        }
    except Exception as e:
        logger.exception(f"❌ Error processing job: {e}")
        return {}


def backend_to_dict(backend) -> dict:
    try:
        status_obj = backend.status()
        return {
            "name": backend.name(),
            "status": "active" if status_obj.operational else "inactive",
            "qubit_count": backend.num_qubits,
            "queue_depth": status_obj.pending_jobs,
            "error_rate": getattr(backend, "error_rate", lambda: None)(),
        }
    except Exception as e:
        logger.error(f"Error processing backend: {e}")
        return {}


async def calculate_metrics(job_list: list) -> dict:
    try:
        total_jobs = len(job_list)
        live_jobs = sum(1 for job in job_list if job.get("status") in ["RUNNING", "QUEUED"])
        completed_jobs = [job for job in job_list if job.get("status") == "COMPLETED"]
        avg_wait_time = sum(
            job.get("elapsed_time", 0) for job in completed_jobs
        ) / len(completed_jobs) if completed_jobs else 0
        success_rate = (len(completed_jobs) / total_jobs) * 100 if total_jobs else 0
        unique_users = {job.get("user") for job in job_list if job.get("user")}
        return {
            "total_jobs": total_jobs,
            "live_jobs": live_jobs,
            "avg_wait_time": avg_wait_time,
            "success_rate": round(success_rate, 2),
            "open_sessions": len(unique_users),
            "api_speed": 0  # You can measure request duration here if needed
        }
    except Exception as e:
        logger.exception(f"❌ Error calculating metrics: {e}")
        return {}


# -------------------------
# API Routes
# -------------------------
@app.post("/api/jobs")
def create_job(submission: JobSubmission):
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        logger.info(f"Received job submission: {submission}")
        
        # Use a simulator by default
        backend_name = submission.backend or "ibmq_qasm_simulator"
        backend = service.get_backend(backend_name)

        # Example: Create a simple Bell state circuit
        # This is just a placeholder to create a valid job
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure([0, 1], [0, 1])

        options = Options()
        options.resilience_level = 1
        options.optimization_level = 3

        sampler = Sampler(backend, options=options)
        
        # The Sampler primitive expects a list of circuits
        job = sampler.run([qc], shots=1024)
        
        logger.info(f"Submitted job {job.job_id()} to backend {backend_name}")
        return {"job_id": job.job_id(), "status": "QUEUED"}
    except Exception as e:
        logger.exception("Error creating job: %s", e)
        raise HTTPException(status_code=500, detail={"error": str(e)})


@app.get("/api/jobs")
async def list_jobs(limit: int = 20, status: Optional[str] = None):
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        jobs = service.jobs(limit=limit, status=status) if status else service.jobs(limit=limit)
        job_tasks = [job_to_dict(job) for job in jobs]
        return await asyncio.gather(*job_tasks)
    except Exception as e:
        logger.exception("Error listing jobs: %s", e)
        raise HTTPException(status_code=500, detail={"error": str(e)})


@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        job = service.job(job_id)
        return await job_to_dict(job)
    except Exception as e:
        logger.exception("Error fetching job %s: %s", job_id, e)
        raise HTTPException(status_code=404, detail={"error": str(e)})


@app.get("/api/backends")
def list_backends():
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        backends = service.backends()
        return [backend_to_dict(b) for b in backends]
    except Exception as e:
        logger.exception("Error listing backends: %s", e)
        raise HTTPException(status_code=500, detail={"error": str(e)})


@app.get("/api/metrics")
async def get_metrics():
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        jobs = service.jobs()
        job_tasks = [job_to_dict(job) for job in jobs]
        job_data = await asyncio.gather(*job_tasks)
        return await calculate_metrics(job_data)
    except Exception as e:
        logger.exception("Error fetching metrics: %s", e)
        raise HTTPException(status_code=500, detail={"error": str(e)})

    

    


