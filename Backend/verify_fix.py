import asyncio
import time
import os
from dotenv import load_dotenv
from qiskit_ibm_runtime import QiskitRuntimeService
import logging

# Mock logger to avoid errors during import if backend.py expects it
logging.basicConfig(level=logging.ERROR)

# Import the function to test
# We need to add the current directory to sys.path to import backend
import sys
sys.path.append(os.getcwd())
from backend import job_to_dict, service 

# Load env
load_dotenv()

async def benchmark():
    print("--- Benchmarking job_to_dict Optimization ---")
    
    # Ensure service is connected (backend.py might have initialized it)
    if not service:
        print("Service not initialized in backend.py. Trying to connect manually...")
        token = os.getenv("IBM_QUANTUM_TOKEN")
        instance = os.getenv("IBM_QUANTUM_INSTANCE")
        try:
             # We can't easily inject service back into backend.py module scope 
             # without reloading, but job_to_dict uses 'job' object methods mostly.
             # However, job_to_dict inside backend.py calls global `service`? 
             # Checking code... no, it uses `job` methods.
             # But let's check if we need a real job.
             pass
        except:
             pass

    # We need a real job object to test
    # Let's get one using the service from backend.py or create a new one
    srv = service
    if not srv:
         token = os.getenv("IBM_QUANTUM_TOKEN")
         instance = os.getenv("IBM_QUANTUM_INSTANCE")
         channel = os.getenv("IBM_QUANTUM_CHANNEL", "ibm_cloud")
         srv = QiskitRuntimeService(channel=channel, token=token, instance=instance)

    print("Fetching 1 job for testing...")
    jobs = srv.jobs(limit=1)
    if not jobs:
        print("No jobs found to test.")
        return
    
    job = jobs[0]
    print(f"Got job: {job.job_id()}")

    print("\nRunning job_to_dict(job, lite=True)...")
    start = time.time()
    res = await job_to_dict(job, lite=True)
    duration = time.time() - start
    
    print(f"\n✅ Result: Retrieved job data in {duration:.4f} seconds.")
    print(f"Backend Name detected: {res.get('backend', 'N/A')}")
    
    if duration < 0.5:
        print("\n🚀 SUCCESS: Latency is extremely low (optimization worked!)")
    else:
        print("\n⚠️ WARNING: Latency still seems high. Check if network call was made.")

if __name__ == "__main__":
    asyncio.run(benchmark())
