from db import db
class OrganizationModel(db.Model):
    __tablename__ = "Organisations"
    id = db.Column(db.Integer, primary_key = True)
    OrgId = db.Column(db.Integer, unique=True, nullable=False)
    OrgName  = db.Column(db.String(45))
    CreatedTime = db.Column(db.String(100), nullable=False)
    CreatedBy = db.Column(db.String(100)) 
    


    
