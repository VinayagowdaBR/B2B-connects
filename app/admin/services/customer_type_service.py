from sqlalchemy.orm import Session
from app.admin.repositories.customer_type_repository import CustomerTypeRepository
from app.admin.schemas.customer_type_schema import CustomerTypeCreate, CustomerTypeUpdate

class CustomerTypeService:
    def __init__(self):
        self.repository = CustomerTypeRepository()
    
    def get_all_customer_types(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_all(db, skip, limit)
    
    def get_customer_type(self, db: Session, customer_type_id: int):
        return self.repository.get_by_id(db, customer_type_id)
    
    def get_default_customer_type(self, db: Session):
        return self.repository.get_default_customer_type(db)
    
    def create_customer_type(self, db: Session, customer_type: CustomerTypeCreate):
        return self.repository.create_customer_type(db, customer_type)
    
    def update_customer_type(self, db: Session, customer_type_id: int, customer_type_update: CustomerTypeUpdate):
        return self.repository.update_customer_type(db, customer_type_id, customer_type_update)
    
    def set_default_customer_type(self, db: Session, customer_type_id: int):
        return self.repository.set_default_customer_type(db, customer_type_id)
    
    def delete_customer_type(self, db: Session, customer_type_id: int):
        return self.repository.delete_customer_type(db, customer_type_id)
