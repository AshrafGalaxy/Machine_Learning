import requests

url = "http://127.0.0.1:8000/api/run-stream"
data = {
    "repo_url": "https://github.com/AshrafGalaxy/dummy-python-healing-repo",
    "team_name": "AshrafGalaxy",
    "leader_name": "Agent",
    "max_iterations": 5
}
print("Connecting...")
try:
    with requests.post(url, json=data, stream=True) as response:
        response.raise_for_status()
        for line in response.iter_lines():
            if line:
                print(line.decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
