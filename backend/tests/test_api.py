import os
os.environ["DATABASE_PATH"] = ":memory:"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_services_endpoint():
    response = client.get("/api/services")
    assert response.status_code == 200
    assert len(response.json()) >= 1

def test_create_and_list_deployment():
    created = client.post("/api/deployments", json={
        "service": "frontend",
        "environment": "production",
        "status": "success",
        "version": "test-123",
    })
    assert created.status_code == 201
    assert created.json()["version"] == "test-123"
    listed = client.get("/api/deployments")
    assert listed.status_code == 200
    assert any(item["version"] == "test-123" for item in listed.json())

def test_reject_invalid_service():
    response = client.post("/api/deployments", json={"service": "unknown"})
    assert response.status_code == 400
