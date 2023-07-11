from db import db
class TicketModel(db.Model):
    __tablename__ = "Tickets"
    id = db.Column(db.Integer, primary_key = True)
    TicketId = db.Column(db.String(100), unique=True,nullable=False)
    Summary = db.Column(db.String(60))
    Description = db.Column(db.String(250))
    CreatedBy = db.Column(db.Integer, nullable=False)
    CreatedOn = db.Column(db.String(100)) 
    AssignedTo = db.Column(db.Integer())
    ClosedBy = db.Column(db.Integer())
    ClosedOn = db.Column(db.String(100)) # needs to be updated soon
    Status = db.Column(db.String(100))
    Archived = db.Column(db.Integer)
    User = db.Column(db.String(100))
