from datetime import datetime, UTC


class Order:
    @staticmethod
    def validate(data):
        required_fields = ['items', 'totalPrice', 'customerDetails']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

        if not isinstance(data['items'], list) or len(data['items']) == 0:
            raise ValueError("Items must be a non-empty list")

        return True

    @staticmethod
    def format_for_db(data, user_email=None):
        return {
            "userEmail": user_email.lower() if user_email else None,
            "items": data['items'],
            "totalPrice": data['totalPrice'],
            "customerDetails": data['customerDetails'],
            "createdAt": datetime.now(UTC)
        }