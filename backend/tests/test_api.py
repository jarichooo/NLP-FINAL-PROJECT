import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app() # create flask app
    app.config["TESTING"] = True # puts flask on testing mode
    with app.test_client() as client:
        yield client

def test_predict_returns_200(client):
    res = client.post("/predict", json={"text": "mag-kain siya"})
    assert res.status_code == 200

def test_predict_has_corrected_field(client):
    res = client.post("/predict", json={"text": "mag-kain siya"})
    data = res.get_json()
    assert "corrected" in data

def test_predict_has_original_field(client):
    res = client.post("/predict", json={"text": "mag-kain siya"})
    data = res.get_json()
    assert "original" in data

def test_original_matches_input(client):
    res = client.post("/predict", json={"text": "mag-kain siya"})
    data = res.get_json()
    assert data["original"] == "mag-kain siya"

def test_empty_input(client):
    res = client.post("/predict", json={"text": ""})
    assert res.status_code == 200
