import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))


def upload_to_db():
    if not os.path.exists('final_products_details.json'):
        print("Error: final_products_details.json not found")
        return

    with open('final_products_details.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    uri = os.getenv("MONGO_URI")
    print(f"Connecting to cluster: {uri.split('@')[-1]}")

    try:
        with MongoClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000) as client:
            db = client['IMPRESS']

            client.admin.command('ping')
            print("Connection successful. Updating database...")

            db.products.delete_many({})
            db.products.insert_many(products)

            print(f"Done. {len(products)} products uploaded successfully.")
    except Exception as e:
        print(f"Connection failed: {e}")


if __name__ == "__main__":
    upload_to_db()