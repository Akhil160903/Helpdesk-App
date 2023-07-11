# test file routes for testing the database

from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import UserModel, OrganizationModel, TicketModel
from schemas import TicketSchema, UserSchema, OrganizationSchema

from datetime import date
import uuid
import json


blp = Blueprint("Test", "tests",
                description="tests")


@blp.route("/test/tickets")
class TicketsList(MethodView):
    @blp.response(200, TicketSchema(many=True))
    def get(self):
        try:
            tickets = TicketModel.query.all()
            return tickets
        except SQLAlchemyError as err:
            abort(500, message=str(err))


@blp.route("/test/users")
class UsersList(MethodView):
    @blp.response(200, UserSchema(many=True))
    def get(self):
        try:
            users = UserModel.query.all()
            return users
        except SQLAlchemyError as err:
            abort(500, message=str(err))


@blp.route("/test/organizations")
class OrganizationsList(MethodView):
    @blp.response(200, OrganizationSchema(many=True))
    def get(self):
        try:
            organizations = OrganizationModel.query.all()
            return organizations
        except SQLAlchemyError as err:
            abort(500, message=str(err))