from flask import Flask, jsonify
from flask_cors import CORS

from flaskr.model import setup_db


def create_app(config=None):
    app = Flask(__name__)
    setup_db(app, config)

    CORS(app)
    # Allow '*' for origins CORS.
    cors = CORS(app, resources={"r/*": {"origins": "*"}})

    from flaskr.views import api_bp

    app.register_blueprint(api_bp, url_prefix='/api')

    # set Access-Control-Allow
    @app.after_request
    def after_request(response):
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,true"
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE,OPTIONS"
        )
        return response

    from flaskr.auth import AuthError

    @app.errorhandler(AuthError)
    def auth_error(error):
        return jsonify({
            "success": False,
            "error": error.status_code,
            "message": error.error['description']
        }), error.status_code

    return app
