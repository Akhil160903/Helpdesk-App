from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import OrganizationModel, UserModel
from schemas import OrganizationSchema

from datetime import datetime
import uuid
import json

blp = Blueprint("Organization", "organizations",
                description="Operations on organizations")


@blp.route("/organization")
class Organizations(MethodView):
    @jwt_required()
    @blp.arguments(OrganizationSchema)
    @blp.response(201, OrganizationSchema)
    def post(self, org_data):

        if OrganizationModel.query.filter(OrganizationModel.OrgId == org_data["OrgId"]).first():
            abort(
                409, message="An organization with that OrgId already exists.")

        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()
        if (foundUser == None or foundUser.UserType != "SuperAdmin"):
            abort(
                401, message="Unauthorized : only super admin can make this request.")
        try:
            organization = OrganizationModel(
                OrgId=org_data["OrgId"],
                OrgName="OrgName",
                CreatedTime=str(datetime.now()),
                CreatedBy=str(foundUser.Email)
            )
            db.session.add(organization)
            db.session.commit()
            return organization
        except SQLAlchemyError as err:
            print(err)
            abort(500, message=str(err))
