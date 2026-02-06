from qiskit_ibm_runtime import QiskitRuntimeService
import os
from dotenv import load_dotenv
import json
import datetime

load_dotenv()

def serialize(obj):
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    return str(obj)

service = QiskitRuntimeService(
    channel=os.getenv("IBM_QUANTUM_CHANNEL"),
    token=os.getenv("IBM_QUANTUM_TOKEN"),
    instance=os.getenv("IBM_QUANTUM_INSTANCE")
)

# Get a real backend (not simulator if possible)
backends = service.backends(simulator=False)
if not backends:
    print("No real backends found.")
    exit()

b = backends[0]
print(f"Inspecting: {b.name}")

# 1. Configuration
try:
    config = b.configuration()
    print("\n--- Configuration Keys ---")
    print(config.to_dict().keys())
    
    print("\n--- Specific Config ---")
    print(f"Processor Type: {getattr(config, 'processor_type', 'N/A')}")
    print(f"Basis Gates: {getattr(config, 'basis_gates', 'N/A')}")
except Exception as e:
    print(f"Config Error: {e}")

# 2. Properties (Calibration)
try:
    props = b.properties()
    if props:
        print("\n--- Properties ---")
        print(f"Last Update: {props.last_update_date}")
        
        # Check for T1, T2, Readout error of Qubit 0
        q0 = props.qubits[0]
        print("\nQubit 0 Props:")
        for item in q0:
            print(f"  {item.name}: {item.value} {item.unit}")
            
        # Check Gate Errors
        print("\nGate 0:")
        g0 = props.gates[0]
        print(f"  {g0.name} on {g0.qubits}: {g0.parameters}")
    else:
        print("Properties are None")
except Exception as e:
    print(f"Properties Error: {e}")

# 3. Status
try:
    status = b.status()
    print("\n--- Status ---")
    print(status.to_dict())
except Exception as e:
    print(f"Status Error: {e}")
