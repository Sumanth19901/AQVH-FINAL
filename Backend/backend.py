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
# Load environment variables from .env file
load_dotenv()

# Fix for "Could not find a suitable TLS CA certificate bundle" error on Windows
import certifi
os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()


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
# Startup Check (Merged from debug_ibm.py)
# -------------------------
if service:
    try:
        backends = service.backends()
        logger.info(f"✅ Found {len(backends)} available backends: {[b.name for b in backends]}")
    except Exception as e:
        logger.error(f"❌ Failed to fetch backends on startup: {e}")

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


async def job_to_dict(job, lite: bool = False) -> dict:
    try:
        # 🔍 Debug: Log available job attributes
        # logger.debug(f"[DEBUG] Job attributes: {dir(job)}")

        # -------------------------
        # 1. Basic Metadata
        # -------------------------
        job_id = safe_call(job, "job_id")
        program_id = safe_call(job, "program_id")
        instance = safe_call(job, "instance")
        raw_user = safe_call(job, "user") or instance or "default"
        masked_user = mask_user_id(str(raw_user))

        # -------------------------
        # 2. Backend / Environment
        # -------------------------
        backend = job.backend()
        backend_name = safe_call(backend, "name") if backend else "Unknown"
        is_simulator = getattr(backend, "simulator", False) if backend else False
        mode = "Simulator" if is_simulator else "Real Quantum Computer"
        
        # Region extraction (Best effort based on common CRN patterns)
        region = "Global"
        if instance:
            if "us-east" in instance: region = "US East"
            elif "eu-de" in instance: region = "Europe (Frankfurt)"
            elif "osaka" in instance: region = "Asia Pacific (Osaka)"
            elif "tokyo" in instance: region = "Asia Pacific (Tokyo)"
            elif "sydney" in instance: region = "Asia Pacific (Sydney)"

        # -------------------------
        # 3. Status & Timeline
        # -------------------------
        status = normalize_status(safe_call(job, "status"))
        created = safe_call(job, "creation_date")
        completed = safe_call(job, "end_date")
        
        # Format dates
        created_iso = created.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S") if created else "N/A"
        completed_iso = completed.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S") if completed else "N/A"
        
        # Calculate Total Completion Time
        total_completion_time = "N/A"
        if created and completed:
            diff = completed - created
            total_completion_time = f"{round(diff.total_seconds(), 2)}s"

        # Calculate Pending and In Progress times from status history
        status_history = safe_call(job, "status_history") or []
        pending_time = "N/A"
        in_progress_time = "N/A"
        
        in_progress_dt = None
        for h in status_history:
            # h can be a dict or an object depending on the SDK version/backend
            h_status_raw = getattr(h, 'status', h.get('status') if isinstance(h, dict) else None)
            h_status = normalize_status(h_status_raw)
            h_time = getattr(h, 'datetime', h.get('datetime') if isinstance(h, dict) else None)
            
            if h_status == "RUNNING" and h_time:
                in_progress_dt = h_time
                in_progress_time = h_time.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
                break
        
        if in_progress_dt and created:
            pending_time = f"{round((in_progress_dt - created).total_seconds(), 2)}s"

        # -------------------------
        # 4. Usage & Metrics
        # -------------------------
        metrics = safe_call(job, "metrics") or {}
        usage = metrics.get('usage', {})
        qiskit_runtime_usage = f"{usage.get('seconds', 0)}s"
        elapsed_seconds = diff.total_seconds() if created and completed else 0
        qpu_seconds = usage.get('seconds', 0)

        # If lite mode, skip heavy details
        if lite:
             return {
                "job_id": job_id,
                "user": masked_user,
                "region": region,
                "program": program_id,
                "instance": instance,
                "mode": mode,
                "quantum_computer": backend_name,
                "backend": backend_name,
                "submitted": created_iso,
                "elapsed_time": elapsed_seconds,
                "qpu_seconds": qpu_seconds,
                "logs": "Detailed logs not available in list view.",
                "status": status,
                "status_history": status_history,
                "status_and_usage": {
                    "status": status,
                    "total_completion_time": total_completion_time,
                    "actual_qr_usage": usage,
                    "created": created_iso,
                    "pending_time": pending_time,
                    "in_progress": in_progress_time,
                    "qiskit_runtime_usage": qiskit_runtime_usage,
                    "completed": completed_iso,
                },
                "pubs": "N/A",
                "result": "N/A",
                "observables": "N/A",
                "circuit": {
                    "diagram": None,
                    "qasm": "N/A",
                    "qiskit": "N/A"
                }
            }

        # -------------------------
        # 5. Inputs (PUBs, Observables, Circuits)
        # -------------------------
        inputs = safe_call(job, "inputs") or {}
        pubs = inputs.get('pubs', [])
        observables = inputs.get('observables', [])
        
        # Circuit Details (Diagram, Qasm, Qiskit)
        qasm_str = "N/A"
        qiskit_str = "N/A"
        circuits = inputs.get('circuits', [])
        if not circuits and 'circuit' in inputs:
            circuits = [inputs['circuit']]
            
        if circuits and len(circuits) > 0:
            try:
                target_circuit = circuits[0]
                qasm_str = target_circuit.qasm() if hasattr(target_circuit, 'qasm') else "N/A"
                qiskit_str = str(target_circuit)
            except Exception as circ_e:
                logger.debug(f"Error parsing circuit: {circ_e}")
        
        # -------------------------
        # 6. Result
        # -------------------------
        result_payload = "N/A"
        if status == "COMPLETED":
            try:
                # result() is a blocking call, so we use to_thread to keep it async-friendly
                job_result = await asyncio.to_thread(job.result)
                if hasattr(job_result, 'get_counts'):
                    result_payload = job_result.get_counts()
                else:
                    # Fallback for complex result objects (SamplerV2/EstimatorV2)
                    result_payload = str(job_result)
            except Exception as res_e:
                logger.error(f"Error fetching results for job {job_id}: {res_e}")
                result_payload = f"Error: {str(res_e)}"

        # -------------------------
        # 7. Final Payload Construction
        # -------------------------
        return {
            "job_id": job_id,
            "user": masked_user,
            "region": region,
            "program": program_id,
            "instance": instance,
            "mode": mode,
            "quantum_computer": backend_name,
            "backend": backend_name,
            "submitted": created_iso,
            "elapsed_time": elapsed_seconds,
            "qpu_seconds": qpu_seconds,
            "logs": "Logs available.",
            "status": status,
            "status_history": status_history,
            "status_and_usage": {
                "status": status,
                "total_completion_time": total_completion_time,
                "actual_qr_usage": usage,
                "created": created_iso,
                "pending_time": pending_time,
                "in_progress": in_progress_time,
                "qiskit_runtime_usage": qiskit_runtime_usage,
                "completed": completed_iso,
            },
            "pubs": str(pubs) if pubs else "N/A",
            "result": result_payload,
            "observables": str(observables) if observables else "N/A",
            "circuit": {
                "diagram": safe_call(job, "image"), # Current image logic placeholder
                "qasm": qasm_str,
                "qiskit": qiskit_str
            }
        }
    except Exception as e:
        logger.exception(f"❌ Error processing job: {e}")
        return {"job_id": safe_call(job, "job_id"), "error": str(e)}



import numpy as np

def calculate_median(values):
    if not values:
        return None
    return float(np.median(values))

def backend_to_dict(backend, detailed: bool = False) -> dict:
    try:
        # 1. Basic Status & Config (Fast)
        status_obj = backend.status()
        config = backend.configuration()
        
        # Safe attribute access
        def get_attr(obj, name, default=None):
            return getattr(obj, name, default) or default

        # Processor Type Formatting
        proc_type_raw = get_attr(config, "processor_type")
        processor_type = "N/A"
        if isinstance(proc_type_raw, dict):
            processor_type = f"{proc_type_raw.get('family', 'Unknown')} {proc_type_raw.get('revision', '')}".strip()
        
        # Region (Mock logic as it's not directly in backend obj usually, derived from instance)
        # In a real app we might pass the 'service' to this function to cross-reference
        region = "Global" 

        base_info = {
            "name": backend.name,
            "status": "active" if status_obj.operational else "inactive",
            "operational": status_obj.operational,
            "status_msg": status_obj.status_msg,
            "qubit_count": backend.num_qubits,
            "pending_jobs": status_obj.pending_jobs,
            "qpu_version": get_attr(config, "backend_version", "N/A"),
            "processor_type": processor_type,
            "basis_gates": get_attr(config, "basis_gates", []),
            "region": region, # Placeholder, will update if derived upstream
            "clops": get_attr(config, "clops", "N/A"), # Some backends expose this
        }

        if not detailed:
            return base_info

        # 2. Detailed Calibration Data (Slow - requires fetching properties)
        props = backend.properties()
        if not props:
            base_info["calibration_message"] = "No calibration data available"
            return base_info

        # Extract Qubit Metrics (T1, T2, Readout)
        t1s = []
        t2s = []
        readout_errs = []
        
        qubit_data = [] # For Table View
        
        for i, qubits_props in enumerate(props.qubits):
            # Qiskit properties structure: list of Nduv objects
            q_map = {item.name: item.value for item in qubits_props}
            
            t1 = q_map.get("T1", 0)
            t2 = q_map.get("T2", 0)
            ro = q_map.get("readout_error", 0)
            
            # Convert units if necessary (T1/T2 usually in us or s, let's normalize to us for display if < 1)
            # Standard Qiskit unit is often seconds. Let's convert to microseconds (us) for readability if needed.
            # However, looking at the logs: "T1: 48.53 us". Qiskit parser handles units. 
            # The raw .value is likely in the unit specified by .unit. 
            # We will trust the raw value for stats but might need normalization. 
            # Actually, standardizing on microseconds (us) is good for T1/T2.
            
            # Helper to find item with name and get value + unit
            def get_prop_val(name):
                for item in qubits_props:
                    if item.name == name:
                        return item.value, item.unit
                return None, None
            
            val_t1, unit_t1 = get_prop_val("T1")
            val_t2, unit_t2 = get_prop_val("T2")
            
            # Normalize to microseconds
            if unit_t1 == "s": val_t1 *= 1e6
            if unit_t1 == "ns": val_t1 /= 1e3
            if unit_t2 == "s": val_t2 *= 1e6
            if unit_t2 == "ns": val_t2 /= 1e3
            
            if val_t1: t1s.append(val_t1)
            if val_t2: t2s.append(val_t2)
            if ro: readout_errs.append(ro)
            
            qubit_data.append({
                "qubit": i,
                "T1": val_t1,
                "T2": val_t2,
                "readout_error": ro,
                # Add other specific props if needed
            })

        # Extract Gate Metrics (2Q error, SX, CZ)
        # Gates are in props.gates
        gate_metrics = {
            "2q_error": [],
            "sx_error": [],
            "cz_error": [],
            "ecr_error": []
        }
        
        gate_data = []
        
        for gate in props.gates:
            name = gate.name # e.g., 'cx0_1', 'sx0', 'ecr1_2'
            # Find gate error
            error = 0
            for param in gate.parameters:
                if param.name == "gate_error":
                    error = param.value
                    break
            
            gate_info = {
                "name": name,
                "qubits": gate.qubits,
                "error": error,
                "gate": gate.gate # 'cx', 'sx', 'ecr'
            }
            gate_data.append(gate_info)

            # Categorize
            if getattr(gate, 'qubits') and len(gate.qubits) == 2:
                gate_metrics["2q_error"].append(error)
                if gate.gate == "cz": gate_metrics["cz_error"].append(error)
                if gate.gate == "ecr": gate_metrics["ecr_error"].append(error)
            elif gate.gate == "sx":
                gate_metrics["sx_error"].append(error)

        # Merge specific gate errors for "2Q error" (generic)
        # Some backends use ECR, some CX, some CZ.
        all_2q = gate_metrics["2q_error"]
        
        # Calculate Medians
        metrics = {
            "T1 (median)": f"{calculate_median(t1s):.2f} us",
            "T2 (median)": f"{calculate_median(t2s):.2f} us",
            "Readout error (median)": f"{calculate_median(readout_errs):.4e}",
            "2Q error (median)": f"{calculate_median(all_2q):.4e}" if all_2q else "N/A",
            "2Q error (best)": f"{min(all_2q):.4e}" if all_2q else "N/A",
            "SX error (median)": f"{calculate_median(gate_metrics['sx_error']):.4e}" if gate_metrics['sx_error'] else "N/A",
            "CZ error (median)": f"{calculate_median(gate_metrics['cz_error']):.4e}" if gate_metrics['cz_error'] else "N/A",
        }

        # Calibration Data for Visualization
        calibration_data = {
            "qubits": qubit_data, # For table/map
            "gates": gate_data,   # For map connectivity
            "metrics": metrics    # Summary stats
        }
        
        return {**base_info, **metrics, "calibration_data": calibration_data}

    except Exception as e:
        logger.error(f"Error processing backend {backend}: {e}")
        return {"name": getattr(backend, "name", "Unknown"), "error": str(e)}

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
async def list_jobs(limit: int = 20, status: Optional[str] = None, lite: bool = False):
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        jobs = service.jobs(limit=limit, status=status) if status else service.jobs(limit=limit)
        job_tasks = [job_to_dict(job, lite=lite) for job in jobs]
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
        return await job_to_dict(job, lite=False)
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
        return [backend_to_dict(b, detailed=False) for b in backends]
    except Exception as e:
        logger.exception("Error listing backends: %s", e)
        raise HTTPException(status_code=500, detail={"error": str(e)})


@app.get("/api/backends/{name}")
def get_backend_details(name: str):
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        # Fetch specific backend (this might be slightly inefficient if we could cache, but safe)
        backend = service.backend(name)
        if not backend:
             raise HTTPException(status_code=404, detail="Backend not found")
        return backend_to_dict(backend, detailed=True)
    except Exception as e:
        logger.exception(f"Error fetching backend {name}: {e}")
        # Check if it was a 404 from Qiskit
        if "not found" in str(e).lower():
             raise HTTPException(status_code=404, detail="Backend not found")
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/api/metrics")
async def get_metrics():
    if not service:
        raise HTTPException(
            status_code=503,
            detail={"error": "IBM Quantum service not available. Please configure credentials in .env file."}
        )
    try:
        jobs = service.jobs()
        job_tasks = [job_to_dict(job, lite=True) for job in jobs]
        job_data = await asyncio.gather(*job_tasks)
        return await calculate_metrics(job_data)
    except Exception as e:
        logger.exception("Error fetching metrics: %s", e)
        raise HTTPException(status_code=500, detail={"error": str(e)})