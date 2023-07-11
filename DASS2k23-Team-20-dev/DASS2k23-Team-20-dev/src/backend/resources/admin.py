from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError


from db import db
from models import UserModel, TicketModel, OrganizationModel
from schemas import TicketSchema, NewUserSchema

from datetime import date
import uuid
import json


blp = Blueprint("Admin", "admins",
                description="Operations on admins (only admins and superadmins can make these requests)")

@blp.route("/admin")
class Admin(MethodView):
    @jwt_required() 
    @blp.arguments(NewUserSchema)
    def post(self, user_data):
        if UserModel.query.filter(UserModel.Email == user_data["Email"]).first():
            abort(
                409, message="A user with that username in this organization already exists.")
        
        if user_data["UserType"] != "Admin":
            abort(
                405, message="Only registering as an admin is allowed.")
            
        if OrganizationModel.query.filter(OrganizationModel.OrgId == user_data["OrgId"]).first() is None:
            abort (
                404, message = "Organization ID not found."
            )

            
        
        registerer_email = get_jwt_identity()
        registerer = UserModel.query.filter(UserModel.Email == registerer_email).first()

        if not registerer or registerer.UserType != "SuperAdmin":
            abort (405, message = "SuperAdmin only")

        user = UserModel(
            FirstName=user_data["FirstName"],
            LastName=user_data["LastName"],
            Email=user_data["Email"],
            PhoneNumber=user_data["PhoneNumber"],
            Password=pbkdf2_sha256.hash(user_data["Password"]),
            UserType=user_data["UserType"],
            OrgId=user_data["OrgId"],
            CreatedOn=str(date.today()),
            CreatedBy=str(registerer_email),
            Status=1
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "Admin created successfully."}, 201


