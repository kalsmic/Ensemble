from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from flaskr.models import db

migrate = Migrate()


def create_app(config='config.ProductionConfig'):
    app = Flask(__name__)

    app.config.from_object(config)
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        db.create_all()

    CORS(app)
    # Allow '*' for origins CORS.
    CORS(app, resources={"r/*": {"origins": "*"}})

    from flaskr.views import api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route('/')
    def welcome():
        return {"message": "welcome to Ensemble"}, 200

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

    return app
