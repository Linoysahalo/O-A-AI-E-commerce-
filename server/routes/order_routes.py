from flask import Blueprint, current_app
from controllers.order_controller import create_order, get_user_orders

order_blueprint = Blueprint('orders', __name__)

@order_blueprint.route('/', methods=['POST'])
def add_order():
    return create_order(current_app.db_instance)

@order_blueprint.route('/history/<email>', methods=['GET'])
def fetch_user_history(email):
    return get_user_orders(current_app.db_instance, email)