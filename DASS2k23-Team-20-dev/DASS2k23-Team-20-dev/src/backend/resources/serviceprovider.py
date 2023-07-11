from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError


from db import db
from models import UserModel, TicketModel
from schemas import OrganizationSchema, UserSchema, TicketSchema, OrgCallSchema

from datetime import date
import uuid
import json


blp = Blueprint("Service Provider", "service provider",
                description="Operations on service providers")


@blp.route("/sp/getall")
class GetServiceProvider(MethodView):
    @jwt_required()
    @blp.arguments(OrgCallSchema)
    @blp.response(200, UserSchema(many=True))
    def put(self, api_data):
        org_id = api_data['OrgId']

        user_email = get_jwt_identity()

        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")

        try:

            if (foundUser.UserType == "Admin"):
                foundServiceProvider = UserModel.query.filter(
                    UserModel.OrgId == org_id, UserModel.UserType == "ServiceProvider")
                return foundServiceProvider

        except SQLAlchemyError as err:
            abort(500, message=str(err))


@blp.route("/sp/getticket")
class Ticket(MethodView):
    @jwt_required()
    @blp.response(200, TicketSchema(many=True))
    def get(self):
        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()
        if (foundUser == None):
            abort(
                401, message="Invalid JWT Token.")

        try:
            user = UserModel.query.filter_by(
                Email=user_email).first()
            if not user:
                abort(404, message="Service Provider not found")
            else:
                if foundUser.id != user.id or foundUser.OrgId != user.OrgId:
                    abort(
                        405, message="Only the Service Provider who Created the Tickets can Access them.")
                if foundUser.UserType == "Admin" or foundUser.UserType == "ServiceProvider":
                    foundTickets = TicketModel.query.filter_by(
                        AssignedTo=(user.id))
                    if (user.UserType == "ServiceProvider"):
                        return foundTickets
                    else:
                        abort(404, message="Service Provider not found")
                else:
                    abort(
                        405, message="Only Admins and Service Provider can Access this Data")

        except SQLAlchemyError as err:
            abort(500, message=str(err))
@blp.route("/sp/get")
class GetServiceProvider(MethodView):
    @jwt_required()
    @blp.arguments(OrganizationSchema)
    @blp.response(200, UserSchema)
    def get(self, api_data):
        email = api_data['Email']
        user_email = get_jwt_identity()

        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")
        try:
            if (foundUser.UserType == "Admin"):
                foundServiceProvider = UserModel.query.filter(
                    UserModel.Email == email, UserModel.UserType == "ServiceProvider")
                return foundServiceProvider

        except SQLAlchemyError as err:
            abort(500, message=str(err))
