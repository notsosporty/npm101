# vulnerable_ping.py - "Server health checker"
from fastapi import FastAPI, Query
import subprocess

app = FastAPI()

@app.get("/ping")
def ping_server(ip: str = Query(..., description="Target IP")):
    # Vulnerable: unsanitized IP piped to shell command
    cmd = f"ping -c 4 {ip}"
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return {"status": result.returncode == 0, "output": result.stdout}
    except Exception as e:
        return {"error": str(e)}

# Test: GET /ping?ip=8.8.8.8; cat /etc/passwd  # Whoops, spills secrets
