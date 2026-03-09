from flask import Blueprint, current_app, request
from controllers.product_controller import get_all_products, get_product_by_id, search_products

product_blueprint = Blueprint('products', __name__)

@product_blueprint.route('/', methods=['GET'])
def fetch_products():
    db = current_app.db_instance
    return get_all_products(db)

@product_blueprint.route('/search', methods=['GET'])
def find_products():
    db = current_app.db_instance
    return search_products(db)

@product_blueprint.route('/<id>', methods=['GET'])
def fetch_product(id):
    db = current_app.db_instance
    return get_product_by_id(db, id)