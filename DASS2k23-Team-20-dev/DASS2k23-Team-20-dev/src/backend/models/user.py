from db import db 

class UserModel(db.Model):
    __tablename__ = "Users"

    id = db.Column(db.Integer, primary_key = True)
    FirstName = db.Column(db.String(30), unique=True, nullable=False)
    LastName = db.Column(db.String(30))
    Email = db.Column(db.String(255))
    PhoneNumber = db.Column(db.String(12))
    Password = db.Column(db.String(32))
    OrgId = db.Column(db.Integer)
    UserType = db.Column(db.String(20))
    CreatedOn = db.Column(db.String(100))
    CreatedBy = db.Column(db.Integer)
    Status = db.Column(db.Integer)
    
    
    
