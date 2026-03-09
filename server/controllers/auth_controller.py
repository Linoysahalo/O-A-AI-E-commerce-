import re
import os
import jwt
import datetime
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from functools import wraps

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            if "Bearer " in token:
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user_email = data['email']
        except:
            return jsonify({"message": "Token is invalid"}), 401
        return f(current_user_email, *args, **kwargs)
    return decorated

def signup(db):
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        name = data.get('name', '').strip()

        if not email or not password or not name:
            return jsonify({"message": "Email, password and name are required"}), 400

        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return jsonify({"message": "Invalid email format"}), 400

        if len(password) < 8:
            return jsonify({"message": "Password must be at least 8 characters long"}), 400

        if db.users.find_one({"email": email}):
            return jsonify({"message": "User already exists"}), 400

        new_user = {
            "email": email,
            "password": generate_password_hash(password),
            "name": name,
            "address": data.get('address', ''),
            "phone": data.get('phone', '')
        }

        db.users.insert_one(new_user)
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"message": "Internal server error"}), 500

def login(db):
    data = request.get_json()
    user = db.users.find_one({"email": data.get('email').lower()})

    if user and check_password_hash(user['password'], data.get('password')):
        token = jwt.encode({
            'email': user['email'],
            'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "token": token,
            "user": {
                "name": user['name'],
                "email": user['email'],
                "address": user['address'],
                "phone": user['phone']
            }
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401

@token_required
def update_user(current_user_email, db):
    try:
        data = request.get_json()
        update_data = {
            "name": data.get('name'),
            "phone": data.get('phone'),
            "address": data.get('address')
        }
        update_data = {k: v for k, v in update_data.items() if v is not None}
        result = db.users.update_one(
            {"email": current_user_email},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"message": "User not found"}), 404
        return jsonify({"message": "User updated successfully", "updated_info": update_data}), 200
    except Exception as e:
        return jsonify({"message": "Internal server error"}), 500