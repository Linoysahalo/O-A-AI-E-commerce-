import os
import json
import pymongo
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer


load_dotenv()


def sync_data():
    mongo_uri = os.getenv("MONGO_URI")
    client = pymongo.MongoClient(mongo_uri)
    db = client.get_database("IMPRESS")
    products_collection = db.products

    print("Loading AI model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')


    try:
        with open('product_reviews_rag.json', 'r', encoding='utf-8') as f:
            reviews_dict = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    products = list(products_collection.find())
    print(f"Syncing {len(products)} products...")

    for product in products:

        p_id = str(product.get('ID', ''))
        p_name = product.get('Full name') or product.get('Name')


        product_reviews_data = reviews_dict.get(p_id, [])

        relevant_reviews = []
        for r in product_reviews_data:
            if isinstance(r, dict):
                text = r.get('review_text', '')
                if text:
                    relevant_reviews.append(text)

        if len(relevant_reviews) > 0:
            print(f"✅ הצלחנו! נמצאו {len(relevant_reviews)} ביקורות למוצר: {p_name} ({p_id})")
        else:
            print(f"⚠️ לא נמצאו ביקורות ב-JSON עבור ID: {p_id}")


        rich_text = f"""
        Product: {p_name}
        Brand: {product.get('Brand Name', '')}
        Ingredients: {product.get('Ingredients', '')}
        Highlights: {product.get('highlights', '')}
        Customer Reviews: {" ".join(relevant_reviews[:3])}
        """

        embedding = model.encode(rich_text).tolist()

        products_collection.update_one(
            {'_id': product['_id']},
            {'$set': {
                'product_vector': embedding,
                'reviews_content': relevant_reviews[:5]
            }}
        )

    print("✅ Sync Complete! All products are now enriched and vectorized.")


if __name__ == "__main__":
    sync_data()