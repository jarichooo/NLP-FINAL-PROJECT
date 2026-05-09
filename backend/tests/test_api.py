# backend/tests/test_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_predict_endpoint():
    res = client.post("/predict", json={"text": "hello world"})
    assert res.status_code == 200
    assert "label" in res.json()

def test_empty_input():
    res = client.post("/predict", json={"text": ""})
    assert res.status_code == 422  # validation error
