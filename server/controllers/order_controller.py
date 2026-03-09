from flask import jsonify, request
from datetime import datetime


def create_order(db):
    try:
        data = request.get_json()

        print("Received order data:", data)

        new_order = {
            "name": data.get('name'),
            "email": data.get('email'),
            "phone": data.get('phone'),
            "address": data.get('address'),
            "delivery": data.get('delivery'),
            "items": data.get('items'),
            "totalPrice": data.get('totalPrice'),
            "userEmail": data.get('userEmail'),
            "createdAt": datetime.utcnow()
        }

        result = db.orders.insert_one(new_order)

        return jsonify({
            "message": "Order created successfully",
            "orderId": str(result.inserted_id)
        }), 201

    except Exception as e:
        print(f"Error creating order: {e}")
        return jsonify({"message": "Internal Server Error", "error": str(e)}), 500


def get_user_orders(db, email):
    try:
        orders = list(db.orders.find({"userEmail": email.lower()}).sort("createdAt", -1))
        for order in orders:
            order['_id'] = str(order['_id'])
            if 'createdAt' in order:
                order['createdAt'] = order['createdAt'].isoformat()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500