from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import UserModel
from schemas import NewUserSchema

from datetime import datetime


blp = Blueprint("Superadmin", "superadmin",
                description="To create a superadmin")


@blp.route("/superadmin")
class SuperAdmin(MethodView):
    @blp.arguments(NewUserSchema)
    def post(self, user_data):
        if UserModel.query.filter(UserModel.UserType == "SuperAdmin").first():
            abort(
                409, message="SuperAdmin already exists")
        try:
            user = UserModel(

                FirstName=user_data["FirstName"],
                LastName=user_data["LastName"],
                Email=user_data["Email"],
                PhoneNumber=user_data["PhoneNumber"],
                Password=pbkdf2_sha256.hash(user_data["Password"]),
                UserType="SuperAdmin",
                OrgId=-1,
                CreatedOn=str(datetime.now()),
                CreatedBy="*",
                Status=1
            )
    
            db.session.add(user)
            db.session.commit()

            return {"message" : "SuperAdmin created"}, 200
        except SQLAlchemyError as err:
            print(err)
            exit(1) # since we cant create a superadmin 
