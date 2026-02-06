import os
import asyncio
from dotenv import load_dotenv
from qiskit_ibm_runtime import QiskitRuntimeService
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("inspect-job")

# Load env from .env in current directory
load_dotenv()

def inspect_job():
    token = os.getenv("IBM_QUANTUM_TOKEN")
    instance = os.getenv("IBM_QUANTUM_INSTANCE")
    channel = os.getenv("IBM_QUANTUM_CHANNEL", "ibm_cloud")

    if not token or not instance:
        print("❌ Credentials not found. Please ensure .env is set.")
        return

    print("Connecting to IBM Quantum...")
    try:
        service = QiskitRuntimeService(channel=channel, token=token, instance=instance)
        print("✅ Connected.")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    print("Fetching last 3 jobs...")
    jobs = service.jobs(limit=3)
    
    if not jobs:
        print("No jobs found to inspect.")
        return

    job = jobs[0]
    print(f"\n--- Inspecting Job {job.job_id()} ---")
    
    # Check dir()
    print(f"\n[dir(job)] sample (first 20): {dir(job)[:20]} ...")
    
    # Check attributes that might contain backend name
    candidates = ["backend", "_backend", "backend_id", "_backend_id", "options", "inputs"]
    for attr in candidates:
        try:
            val = getattr(job, attr, "N/A - Not Found")
            print(f"Attribute '{attr}': {val} (Type: {type(val)})")
        except Exception as e:
            print(f"Attribute '{attr}': Error accessing - {e}")

    # Check safe_call(job.backend) latency vs direct access
    import time
    start = time.time()
    try:
        b = job.backend()
        name = b.name if b else "None"
        print(f"\njob.backend() call took: {time.time() - start:.4f}s -> Result: {name}")
    except Exception as e:
        print(f"\njob.backend() call failed: {e}")

if __name__ == "__main__":
    inspect_job()
