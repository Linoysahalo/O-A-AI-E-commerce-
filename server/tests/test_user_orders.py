import pytest
from app import app as flask_app
import json


@pytest.fixture
def client():
    flask_app.config['TESTING'] = True
    return flask_app.test_client()


def test_create_order_with_user(client):
    order_payload = {
        "userEmail": "linoy@example.com",
        "items": [
            {"name": "Neevo", "price": 149, "quantity": 1}
        ],
        "totalPrice": 149,
        "customerDetails": {
            "name": "Linoy",
            "phone": "0501234567",
            "address": "Israel"
        }
    }

    response = client.post('/api/orders/',
                           data=json.dumps(order_payload),
                           content_type='application/json')

    assert response.status_code == 201
    data = response.get_json()
    assert "id" in data
    assert data["message"] == "Order placed!"


def test_fetch_user_order_history(client):
    test_email = "history_test@example.com"
    client.post('/api/orders/',
                data=json.dumps({
                    "userEmail": test_email,
                    "items": [{"name": "Rado", "price": 249, "quantity": 1}],
                    "totalPrice": 249,
                    "customerDetails": {"name": "Tester", "phone": "000", "address": "Test St"}
                }),
                content_type='application/json')

    response = client.get(f'/api/orders/history/{test_email}')

    assert response.status_code == 200
    orders = response.get_json()
    assert isinstance(orders, list)
    assert len(orders) > 0
    assert orders[0]['userEmail'] == test_email


def test_fetch_history_no_orders(client):
    response = client.get('/api/orders/history/nonexistent@user.com')
    assert response.status_code == 200
    assert response.get_json() == []