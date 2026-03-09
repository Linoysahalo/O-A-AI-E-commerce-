import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify

from flask_cors import CORS
from pymongo import MongoClient
from routes.product_routes import product_blueprint
from routes.order_routes import order_blueprint
from routes.auth_routes import auth_blueprint
from sentence_transformers import SentenceTransformer
from RAG.groq import get_amber_response

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

MONGO_URI = os.getenv("MONGO_URI").strip()

try:
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")

    db = client['IMPRESS']
    app.db_instance = db

    products_col = db.products
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

app.register_blueprint(product_blueprint, url_prefix='/api/products')
app.register_blueprint(order_blueprint, url_prefix='/api/orders')
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')


@app.route('/')
def health_check():
    return {"status": "success", "message": "Server is running"}

@app.route('/api/chat/recommend', methods=['POST'])
def get_recommendation():
    try:
        data = request.json
        user_query = data.get('query', '')

        query_vector = embedding_model.encode(user_query).tolist()
        pipeline = [
            {"$vectorSearch": {
                "index": "vector_index",
                "path": "product_vector",
                "queryVector": query_vector,
                "numCandidates": 50,
                "limit": 3
            }}
        ]
        results = list(products_col.aggregate(pipeline))

        context_text = ""
        for p in results:
            reviews = " ".join(p.get('reviews_content', []))
            context_text += f"Product: {p.get('Full name')}\nIngredients: {p.get('Ingredients')}\nReviews: {reviews}\n---\n"

        answer = get_amber_response(user_query, context_text)

        return jsonify({
            "answer": answer,
            "products": [{
                "id": str(p['_id']),
                "name": p.get('Full name'),
                "pic": p.get('pic'),
                "price": p.get('Price')
            } for p in results]
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500



if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port)