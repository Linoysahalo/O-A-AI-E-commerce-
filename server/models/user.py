from werkzeug.security import generate_password_hash, check_password_hash

class User:
    @staticmethod
    def validate_signup(data):
        if not data.get('email') or not data.get('password'):
            raise ValueError("Email and password are required")
        return True

    @staticmethod
    def create_user_doc(data):
        return {
            "email": data['email'].lower(),
            "password": generate_password_hash(data['password']),
            "name": data.get('name', ""),
            "phone": data.get('phone', ""),
            "address": data.get('address', ""),
        }

    @staticmethod
    def check_password(hashed_password, password):
        return check_password_hash(hashed_password, password)