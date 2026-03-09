from flask import Blueprint, current_app
from controllers.auth_controller import signup, login, update_user

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/signup', methods=['POST'])
def signup_route():
    return signup(current_app.db_instance)

@auth_blueprint.route('/login', methods=['POST'])
def login_route():
    return login(current_app.db_instance)

@auth_blueprint.route('/update', methods=['PUT'])
def update_user_route():
    return update_user(current_app.db_instance)