import pytest
from app import app as flask_app
from bson import ObjectId

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
    })
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_check(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.get_json()['status'] == 'success'

def test_get_all_products(client):
    response = client.get('/api/products/')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_create_order(client):
    order_data = {
        "name": "ישראל ישראלי",
        "email": "test@example.com",
        "phone": "0501234567",
        "address": "Herzl 1, Tel Aviv",
        "delivery": "standard",
        "items": [
            {"name": "Classic Watch", "price": 299, "quantity": 1, "pic": "test.jpg"}
        ],
        "totalPrice": 299,
        "userEmail": "test@example.com"
    }

    response = client.post('/api/orders/', json=order_data)
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == "Order created successfully"
    assert 'orderId' in data

def test_create_invalid_order(client):
    invalid_data = {}
    response = client.post('/api/orders/', json=invalid_data)
    assert response.status_code in [400, 500]

def test_search_products(client):
    response = client.get('/api/products/search?q=watch')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)