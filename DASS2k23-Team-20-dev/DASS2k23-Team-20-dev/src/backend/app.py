from flask import Flask, jsonify
from flask_smorest import Api
from flask_jwt_extended import JWTManager

from db import db

from resources.user import blp as UserBlueprint
from resources.ticket import blp as TicketBlueprint
from resources.superadmin import blp as SuperAdminBlueprint
from resources.organization import blp as OrganzationBlueprint
from resources.admin import blp as AdminBlueprint
from resources.serviceprovider import blp as ServiceProviderBlueprint

from resources.test import blp as TestBlueprint

user = "ndu1"
password = "ndu!NDU"
host = "63.250.60.129"
port = 3306
database = "ndesk"

db_url = "mysql+pymysql://{0}:{1}@{2}:{3}/{4}".format(
    user, password, host, port, database)
test_url = "sqlite:///test.db"



def create_app():
    app = Flask(__name__)
    app.config["API_TITLE"] = "Stores REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config[
        "OPENAPI_SWAGGER_UI_URL"
    ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = test_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["PROPAGATE_EXCEPTIONS"] = True
    db.init_app(app)
    api = Api(app)

    app.config["JWT_SECRET_KEY"] = "5b20d2de-51af-4a7b-9f02-1f173a3c14e5"

    jwt = JWTManager(app)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return (
            jsonify({"message": "The token has expired.", "error": "token_expired"}),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {"message": "Signature verification failed.", "error": "invalid_token"}
            ),
            401,
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify(
                {
                    "description": "Request does not contain an access token.",
                    "error": "authorization_required",
                }
            ),
            401,
        )

    jwt = JWTManager(app)

    with app.app_context():
        import models  # noqa: F401
        db.create_all()


    api.register_blueprint(UserBlueprint)
    api.register_blueprint(TicketBlueprint)
    api.register_blueprint(SuperAdminBlueprint)
    api.register_blueprint(OrganzationBlueprint)
    api.register_blueprint(AdminBlueprint)
    api.register_blueprint(TestBlueprint)
    api.register_blueprint(ServiceProviderBlueprint)

    return app
        
