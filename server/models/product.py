
class Product:
    @staticmethod
    def validate(data):
        required_fields = ['name', 'price', 'pic', 'description']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing field: {field}")
        return True

    @staticmethod
    def format_item(item):
        if item and '_id' in item:
            item['_id'] = str(item['_id'])
        return item