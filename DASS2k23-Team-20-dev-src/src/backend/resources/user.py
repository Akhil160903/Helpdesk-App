from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import UserModel, OrganizationModel
from schemas import UserSchema, NewUserSchema, UserCallSchema

from datetime import datetime


blp = Blueprint("User", "user",
                description="Operations on users (includes service providers, admins, and users)")


@blp.route("/user/register")
class UserRegister(MethodView):
    @blp.arguments(NewUserSchema)
    def post(self, user_data):
        if UserModel.query.filter(UserModel.Email == user_data["Email"]).first():
            abort(
                409, message="A user with that username in this organization already exists.")
        
        if user_data["UserType"] != "User" and user_data["UserType"] != "ServiceProvider":

            abort(
                405, message="Only registering as a User or ServiceProvider is allowed.")
        if OrganizationModel.query.filter(OrganizationModel.OrgId == user_data["OrgId"]).first() is None:
            abort (
                404, message = "Organization ID not found."
            )


        user = UserModel(
            FirstName=user_data["FirstName"],
            LastName=user_data["LastName"],
            Email=user_data["Email"],
            PhoneNumber=user_data["PhoneNumber"],
            Password=pbkdf2_sha256.hash(user_data["Password"]),
            UserType=user_data["UserType"],
            OrgId=user_data["OrgId"],
            CreatedOn=str(datetime.now()),
            CreatedBy="hard_coded",
            Status=1
        )



        db.session.add(user)
        db.session.commit()

        return {"message": "User created successfully."}, 201


@blp.route("/user/login")
class UserLogin(MethodView):
    @blp.arguments(UserSchema)
    def post(self, user_data):
        user = UserModel.query.filter(
            UserModel.Email == user_data["Email"],
            UserModel.OrgId == user_data["OrgId"]
        ).first()

        if user and pbkdf2_sha256.verify(user_data["Password"], user.Password):
            access_token = create_access_token(identity=user.Email)
            return {"access_token": access_token,
                    "Email": user.Email,
                    "id": user.id,
                    "OrgId": user.OrgId,
                    "FirstName": user.FirstName,
                    "LastName": user.LastName,
                    "UserType": user.UserType,
                    "CreatedOn": user.CreatedOn,
                    "Status": user.Status
                    }, 200

        abort(401, message="Invalid credentials.")



@blp.route("/user/<useremail>")
class FetchUser(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema)
    def get(self, useremail):
        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()
        if (foundUser == None):
            abort(
                401, message="Invalid JWT Token.")
        try:
            
            user = UserModel.query.filter_by(
                Email = useremail).first()

            if not user:
                abort(404, message="User not found")
            else:
                if foundUser.UserType == "Admin" or foundUser.UserType == "SuperAdmin":
                    return user
                elif foundUser.UserType == "User":
                    if foundUser.Email == user.Email:
                        return user
                    else:
                        abort(405, message="Users can only access thier own data")
        except SQLAlchemyError as err:
            abort(500, message=str(err))

@blp.route("/user")
class FetchSingleUser(MethodView):
    @blp.arguments(UserCallSchema)
    @blp.response(200, UserSchema)
    def get(self, data):
        try:
            found_id = data["id"]
            print(found_id)    
            user = UserModel.query.filter(
                UserModel.id == found_id).first()

            if not user:
                abort(404, message="User not a found")
            else:
                # if foundUser.UserType == "Admin" or foundUser.UserType == "SuperAdmin" or foundUser.type == "User":
                return user
        except SQLAlchemyError as err:
            abort(500, message=str(err))
