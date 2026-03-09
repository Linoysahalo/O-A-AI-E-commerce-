from flask import jsonify, request
from bson import ObjectId

def get_all_products(db):
    try:
        products = list(db.products.find())
        for product in products:
            product['_id'] = str(product['_id'])
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

def get_product_by_id(db, product_id):
    try:
        product = db.products.find_one({"_id": ObjectId(product_id)})
        if product:
            product['_id'] = str(product['_id'])
            return jsonify(product), 200
        return jsonify({"message": "Product not found"}), 404
    except Exception as e:
        return jsonify({"message": "Invalid ID format"}), 400

from flask import jsonify, request
from bson import ObjectId
import re

def search_products(db):
    try:

        query = request.args.get('q', '').strip()

        if not query:
            return jsonify([]), 200


        search_pattern = re.escape(query)


        mongo_query = {
            "$or": [
                {"Name": {"$regex": search_pattern, "$options": "i"}},
                {"Full name": {"$regex": search_pattern, "$options": "i"}},
                {"Brand Name": {"$regex": search_pattern, "$options": "i"}},
                {"Category": {"$regex": search_pattern, "$options": "i"}},
                {"Sub-category": {"$regex": search_pattern, "$options": "i"}},
                {"Description": {"$regex": search_pattern, "$options": "i"}},
                {"highlights": {"$regex": search_pattern, "$options": "i"}}
            ]
        }

        products = list(db.products.find(mongo_query))


        for p in products:
            p['_id'] = str(p['_id'])
        print(f"Query: {query}, Found: {len(products)} items")
        return jsonify(products), 200
    except Exception as e:
        print(f"Search error details: {e}")
        return jsonify({"message": "Search failed", "error": str(e)}), 500