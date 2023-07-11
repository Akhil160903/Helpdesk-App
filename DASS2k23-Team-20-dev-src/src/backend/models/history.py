from db import db
class HistoryModel(db.Model):
    __tablename__ = "History"
    Id = db.Column(db.Integer, primary_key = True)
    TicketId = db.Column(db.Integer, nullable=False)
    Update  = db.Column(db.String(120))
    UpdatedOn = db.Column(db.String(100), nullable=False)
    UpdatedBy = db.Column(db.Integer) 
    


    
