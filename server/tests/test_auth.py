import pytest
from app import app as flask_app
import json


@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    return flask_app.test_client()


def test_signup_success(client):
    payload = {
        "email": "newuser@example.com",
        "password": "password123",
        "name": "Israel Israeli",
        "address": "Herzl 1, Tel Aviv",
        "phone": "050-0000000"
    }
    response = client.post('/api/auth/signup',
                           data=json.dumps(payload),
                           content_type='application/json')

    assert response.status_code == 201
    assert response.get_json()['message'] == "User created successfully"


def test_signup_duplicate_user(client):
    payload = {
        "email": "newuser@example.com",
        "password": "differentpassword"
    }
    response = client.post('/api/auth/signup',
                           data=json.dumps(payload),
                           content_type='application/json')

    assert response.status_code == 400
    assert "already exists" in response.get_json()['message']


def test_login_success(client):
    payload = {
        "email": "newuser@example.com",
        "password": "password123"
    }
    response = client.post('/api/auth/login',
                           data=json.dumps(payload),
                           content_type='application/json')

    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data
    assert data["user"]["email"] == "newuser@example.com"
    assert "name" in data["user"]


def test_login_wrong_password(client):
    payload = {
        "email": "newuser@example.com",
        "password": "wrongpassword"
    }
    response = client.post('/api/auth/login',
                           data=json.dumps(payload),
                           content_type='application/json')

    assert response.status_code == 401
    assert "Invalid credentials" in response.get_json()['message']