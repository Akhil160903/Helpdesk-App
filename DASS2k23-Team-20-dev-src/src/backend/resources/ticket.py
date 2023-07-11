from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError


from db import db
from models import UserModel, TicketModel, HistoryModel
from schemas import TicketSchema, StateSchema, UpdateTicketSchema, UpdateTicketReturnSchema

from datetime import date, datetime
import uuid
import json


blp = Blueprint("Ticket", "tickets",
                description="Operations on users (includes service providers, admins, and users)")


@blp.route("/ticket")
class Tickets(MethodView):
    @jwt_required()
    @blp.arguments(TicketSchema)
    @blp.response(201, TicketSchema)
    def post(self, ticket_data):
        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()
        cannot_make_ticket = ((foundUser.UserType != "User") and (
            foundUser.UserType != "Admin") and (foundUser.UserType != "SuperAdmin"))
        if (foundUser == None or cannot_make_ticket):
            abort(
                401, message="Unauthorized : only users / admin / super admin can make this request.")
        print(foundUser)
        try:
            ticket = TicketModel(
                TicketId=str(uuid.uuid1()),
                Summary=ticket_data["Summary"],
                Description=ticket_data["Description"],
                CreatedBy=foundUser.FirstName + foundUser.LastName,
                CreatedOn=str(datetime.now()),
                AssignedTo=None,
                ClosedBy=None,
                ClosedOn=None,
                Status="Open",
                Archived=False,
                User=str(foundUser.Email)
            )
            db.session.add(ticket)
            db.session.commit()
            return ticket
        except SQLAlchemyError as err:
            print(err)
            abort(500, message=str(err))

    @jwt_required()
    @blp.response(200, TicketSchema(many=True))
    def get(self):
        user_email = get_jwt_identity()

        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")

        try:
            if (foundUser.UserType == "User"):
                tickets = TicketModel.query.filter(
                    TicketModel.User == foundUser.Email)
                return tickets
            elif (foundUser.UserType == "Admin" or foundUser.UserType == "SuperAdmin"):
                tickets = TicketModel.query.join(
                    UserModel, UserModel.Email == TicketModel.User).filter(
                    UserModel.OrgId == foundUser.OrgId)
                return tickets
            else:
                abort(
                    401, message="Unauthorized : only users / admin / super admin can make this request.")
        except SQLAlchemyError as err:
            abort(500, message=str(err))


@blp.route("/ticket/<ticket_id>")
class Ticket(MethodView):
    # @jwt_required()
    # @blp.response(200, TicketSchema)
    # def delete(self, ticket_id):
    #     user_email = get_jwt_identity()
    #     foundUser = UserModel.query.filter(
    #         UserModel.Email == user_email).first()

    #     if (foundUser == None):
    #         abort(
    #             401, message="Invalid identity")

    #     try:
    #         ticket = TicketModel.query.filter_by(TicketId=ticket_id).first()
    #         if ticket:
    #             ticket_created_by = UserModel.query.fiter(
    #                 UserModel.Email == ticket.User)
    #             if ticket.Status == "Closed":
    #                 abort(409, message="The ticket is already closed.")
    #             if (ticket_created_by.User == foundUser.Email or (ticket_created_by.OrgId == foundUser.OrgId and foundUser.UserType == "Admin")):
    #                 ticket.Status = "Closed"
    #                 ticket.ClosedBy = foundUser.FirstName + foundUser.LastName
    #                 ticket.ClosedOn = str(date.today())

    #             db.session.commit()
    #             return ticket
    #         else:
    #             abort(404, message="The ticket was not found.")

    #     except SQLAlchemyError as err:
    #         abort(500, message=str(err))

    @jwt_required()
    @blp.response(200, TicketSchema)
    def get(self, ticket_id):
        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter_by(Email=user_email).first()
        
        if foundUser is None:
            abort(401, message="Invalid identity")

        print(foundUser.OrgId)

        try:
            ticket = TicketModel.query.filter_by(TicketId=ticket_id).first()
            if ticket:
                if foundUser.UserType == "Admin" and foundUser.OrgId == (ticket.CreatedBy).OrgId:
                    # Admins can get tickets of any user of the same orgid
                    return ticket
                elif foundUser.UserType == "User" and ticket.User == user_email:
                    # Users can only get details of their own tickets
                    return ticket
                else:
                    abort(
                        401, message="Unauthorized: You are not authorized to view this ticket.")
            else:
                abort(404, message="The ticket was not found.")
        except SQLAlchemyError as err:
            abort(500, message=str(err))


# ALL STATE TRANSITIONS
@blp.route("/ticket/status/open")
class Ticket(MethodView):
    @jwt_required()
    @blp.arguments(StateSchema)
    @blp.response(200, TicketSchema)
    def put(self, ticket_data):
        ticket_id = ticket_data["TicketId"]

        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")
        
        ticket = TicketModel.query.filter(TicketModel.TicketId == ticket_id).first()    
        

        if (ticket == None):
            abort(
                404, message="Not found")
      

        ticket_created_by_name = ticket.User
        ticket_created_by = UserModel.query.filter(
            UserModel.Email == ticket_created_by_name ).first()
    

        if (ticket_created_by.OrgId != foundUser.OrgId):

            abort(
                403, message=" The ticket must be associated by the same organization")

        try:

            allowed_identites = ["Admin", "ServiceProvider"]
            previous_states = ["Assigned", "WIP"]

            if foundUser.UserType not in allowed_identites:
                abort(
                    401, message="Only Admins and ServiceProviders can make this request.")

            if ticket.Status not in previous_states:
                abort(
                    403, message="Ticket must previously be in Assigned on WIP state.")

            ticket.Status = "Open"
            ticket.AssignedTo = None

            db.session.commit()
            return ticket

        except SQLAlchemyError as err:
            abort(500, message=str(err))


@blp.route("/ticket/status/assigned")
class Ticket(MethodView):
    @jwt_required()
    @blp.arguments(StateSchema)
    @blp.response(200, TicketSchema)
    def put(self, api_data):
        ticket_id = api_data["TicketId"]
        serviceProvider_email = api_data["Email"]

        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")
            
        serviceProvider = UserModel.query.filter(
            UserModel.Email == serviceProvider_email).first()

        if (serviceProvider == None or serviceProvider.UserType != "ServiceProvider"):
            abort(
                401, message="Invalid Service Provider")
        
        ticket = TicketModel.query.filter(TicketModel.TicketId == ticket_id).first()    
        

        if (ticket == None):
            abort(
                404, message="Not found")

        ticket_created_by_name = ticket.User
        ticket_created_by = UserModel.query.filter(
            UserModel.Email == ticket_created_by_name ).first()
    

        if (ticket_created_by.OrgId != foundUser.OrgId and foundUser.OrgId != serviceProvider.OrgId):
            abort(
                403, message=" The Ticket and Service Provider must be associated by the same organization")
        try:

            allowed_identites = ["Admin"]
            previous_states = ["Open"]

            if foundUser.UserType not in allowed_identites:
                abort(
                    401, message="Only Admins can make this request.")

            if ticket.Status not in previous_states:
                abort(
                    403, message="Ticket must previously be in Open state.")
            
            ticket.Status = "Assigned"
            ticket.AssignedTo = serviceProvider.id

            db.session.commit()
            return ticket

        except SQLAlchemyError as err:
            abort(500, message=str(err))


@blp.route("/ticket/status/WIP")
class Ticket(MethodView):
    @jwt_required()
    @blp.arguments(StateSchema)
    @blp.response(200, TicketSchema)
    def put(self, ticket_data):
        ticket_id = ticket_data["TicketId"]

        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")
        
        ticket = TicketModel.query.filter(TicketModel.TicketId == ticket_id).first()    

        if (ticket == None):
            abort(
                404, message="Not found")
      
        ticket_created_by_name = ticket.User
        ticket_created_by = UserModel.query.filter(
            UserModel.Email == ticket_created_by_name ).first()
    

        if (ticket_created_by.OrgId != foundUser.OrgId):

            abort(
                403, message=" The ticket must be associated by the same organization")

        try:

            allowed_identites = ["ServiceProvider"]
            previous_states = ["Assigned", "Resolved"]

            if foundUser.UserType not in allowed_identites:
                abort(
                    401, message="Only ServiceProviders can make this request.")

            if ticket.Status not in previous_states:
                abort(
                    403, message="Ticket must previously be in Assigned or Resolved state.")

            ticket.Status = "WIP"

            db.session.commit()
            return ticket

        except SQLAlchemyError as err:
            abort(500, message=str(err))


@blp.route("/ticket/status/resolved")
class Ticket(MethodView):
    @jwt_required()
    @blp.arguments(StateSchema)
    @blp.response(200, TicketSchema)
    def put(self, ticket_data):
        ticket_id = ticket_data["TicketId"]

        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")
        
        ticket = TicketModel.query.filter(TicketModel.TicketId == ticket_id).first()    

        if (ticket == None):
            abort(
                404, message="Not found")
      
        ticket_created_by_name = ticket.User
        ticket_created_by = UserModel.query.filter(
            UserModel.Email == ticket_created_by_name ).first()
    

        if (ticket_created_by.OrgId != foundUser.OrgId):

            abort(
                403, message=" The ticket must be associated by the same organization")

        try:

            allowed_identites = ["ServiceProvider"]
            previous_states = ["WIP"]

            if foundUser.UserType not in allowed_identites:
                abort(
                    401, message="Only ServiceProviders can make this request.")

            if ticket.Status not in previous_states:
                abort(
                    403, message="Ticket must previously be in WIP state.")

            ticket.Status = "Resolved"

            db.session.commit()
            return ticket

        except SQLAlchemyError as err:
            abort(500, message=str(err))

@blp.route("/ticket/status/closed")
class Ticket(MethodView):
    @jwt_required()
    @blp.arguments(StateSchema)
    @blp.response(200, TicketSchema)
    def put(self, ticket_data):
        ticket_id = ticket_data["TicketId"]

        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if (foundUser == None):
            abort(
                401, message="Invalid identity")
        
        ticket = TicketModel.query.filter(TicketModel.TicketId == ticket_id).first()    

        if (ticket == None):
            abort(
                404, message="Not found")
    
        ticket_created_by_name = ticket.User
        ticket_created_by = UserModel.query.filter(
            UserModel.Email == ticket_created_by_name ).first()
    

        if (ticket_created_by.OrgId != foundUser.OrgId):

            abort(
                403, message=" The ticket must be associated by the same organization")

        try:

            allowed_identites = ["Admin","User"]
            previous_states = ["WIP","Open","Resolved","Assigned"]

            if foundUser.UserType not in allowed_identites:
                abort(
                    401, message="Only Admins and Users can make this request.")

            if ticket.Status not in previous_states:
                abort(
                    403, message="Ticket is already in Closed state.")

            ticket.Status = "Closed"
            ticket.AssignedTo = None
            ticket.ClosedBy = foundUser.FirstName + foundUser.LastName
            ticket.ClosedOn = str(date.today())

            db.session.commit()
            return ticket

        except SQLAlchemyError as err:
            abort(500, message=str(err))

@blp.route("/ticket/update")
class UpdateTicket(MethodView):
    @jwt_required()
    @blp.arguments(UpdateTicketSchema)
    @blp.response(200, UpdateTicketSchema)
    def post(self, ticket_data):
        ticket_id = ticket_data["TicketId"]
        update = ticket_data["Update"]
        
        user_email = get_jwt_identity()
        foundUser = UserModel.query.filter(
            UserModel.Email == user_email).first()
        if (foundUser == None):
            abort(
                401, message="Unauthorized")
        try:
            update = HistoryModel(
                TicketId=ticket_id,
                UpdatedBy=foundUser.id,
                Update=update,
                UpdatedOn=str(datetime.today())
            )
            db.session.add(update)
            db.session.commit()
            return update
        except SQLAlchemyError as err:
            abort(500, message=str(err))

    @jwt_required()
    @blp.response(200, UpdateTicketReturnSchema(many=True))
    def get(self):
        ticket_id = request.args.get("id")
        user_email = get_jwt_identity()
        found_user = UserModel.query.filter(
            UserModel.Email == user_email).first()

        if found_user == None:
            abort(
                401, message="Unauthorized")
        
        try:
            updates = HistoryModel.query.filter(HistoryModel.TicketId == ticket_id).all()
            return updates
        except SQLAlchemyError as err:
            abort(500, message=str(err))