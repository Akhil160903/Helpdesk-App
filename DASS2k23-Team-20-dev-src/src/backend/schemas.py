from marshmallow import Schema, fields


class NewUserSchema(Schema):
    FirstName = fields.Str(required=True)
    LastName = fields.Str(required=True)
    Email = fields.Str(required=True)
    PhoneNumber = fields.Int(required=True)
    Password = fields.Str(required=True)
    UserType = fields.Str(required=True)
    OrgId = fields.Integer(required=True)


class TicketSchema(Schema):
    TicketId = fields.String(required=True, dump_only=True)
    Summary = fields.Str(required=True)
    Description = fields.Str(required=True)
    CreatedOn = fields.Str(dump_only=True)
    AssignedTo = fields.Str(dump_only=True)
    Status = fields.String(dump_only=True)
    User = fields.String(dump_only=True)


class UserSchema(Schema):
    Email = fields.Str(required=True)
    Password = fields.Str(required=True, load_only=True)
    OrgId = fields.Integer(required=True)
    id = fields.Int(required=True, dump_only=True)
    FirstName = fields.String(required=True, dump_only=True)
    LastName = fields.String(required=True, dump_only=True)
    UserType = fields.String(required=True, dump_only=True)
    CreatedOn = fields.String(required=True, dump_only=True)
    Status = fields.Int(required=True, dump_only=True)
    Tickets = fields.List(fields.Nested(TicketSchema()), dump_only=True)


class OrganizationSchema(Schema):

    OrgId = fields.Int(required=True)
    OrgName = fields.Str(required=True)
    id = fields.Int(dump_only=True)
    CreatedTime = fields.String(dump_only=True)
    CreatedBy = fields.String(required=True, dump_only=True)

class StateSchema(Schema):
    TicketId = fields.Str(required=True)
    Email = fields.Str()
    
class OrgCallSchema(Schema): # the id that we assign
    OrgId = fields.Int(required=True)

class UserCallSchema(Schema): # auto assgined incremental
   id = fields.Int(required=True)

class UpdateTicketSchema(Schema):
    TicketId = fields.Str(required=True)
    Update = fields.Str(required=True)
    
class UpdateTicketReturnSchema(Schema):
    Id  = fields.Int(required=True)
    TicketId = fields.Str(required=True)
    Update = fields.Str(required=True)
    UpdatedOn = fields.Str(required=True)
    UpdatedBy = fields.Str(required=True)