from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.admin.models.customer_type_model import CustomerType
from app.admin.schemas.customer_type_schema import CustomerTypeCreate, CustomerTypeUpdate
from fastapi import HTTPException

class CustomerTypeRepository:
    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        """Get all customer types"""
        return db.query(CustomerType).offset(skip).limit(limit).all()
    
    def get_by_id(self, db: Session, customer_type_id: int):
        """Get customer type by ID"""
        return db.query(CustomerType).filter(CustomerType.id == customer_type_id).first()
    
    def get_by_name(self, db: Session, name: str):
        """Get customer type by name"""
        return db.query(CustomerType).filter(CustomerType.name == name).first()
    
    def get_default_customer_type(self, db: Session):
        """Get the default customer type"""
        return db.query(CustomerType).filter(
            CustomerType.is_default == True,
            CustomerType.is_active == True
        ).first()
    
    def create_customer_type(self, db: Session, customer_type: CustomerTypeCreate):
        """Create a new customer type"""
        # Check for duplicate name
        if self.get_by_name(db, customer_type.name):
            raise HTTPException(
                status_code=400, 
                detail=f"Customer type with name '{customer_type.name}' already exists"
            )
        
        # If this is set as default, unset all others
        if customer_type.is_default:
            db.query(CustomerType).update({CustomerType.is_default: False})
        
        db_customer_type = CustomerType(
            name=customer_type.name,
            description=customer_type.description,
            is_default=customer_type.is_default,
            is_active=customer_type.is_active
        )
        
        try:
            db.add(db_customer_type)
            db.commit()
            db.refresh(db_customer_type)
            return db_customer_type
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400, 
                detail="Customer type creation failed due to duplicate constraint"
            )
    
    def update_customer_type(self, db: Session, customer_type_id: int, customer_type_update: CustomerTypeUpdate):
        """Update customer type"""
        db_customer_type = self.get_by_id(db, customer_type_id)
        if not db_customer_type:
            return None
        
        update_data = customer_type_update.dict(exclude_unset=True)
        
        # Check for duplicate name if name is being updated
        if 'name' in update_data and update_data['name'] != db_customer_type.name:
            if self.get_by_name(db, update_data['name']):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Customer type with name '{update_data['name']}' already exists"
                )
        
        # If setting as default, unset all others
        if 'is_default' in update_data and update_data['is_default']:
            db.query(CustomerType).filter(CustomerType.id != customer_type_id).update(
                {CustomerType.is_default: False}
            )
        
        for key, value in update_data.items():
            setattr(db_customer_type, key, value)
        
        try:
            db.commit()
            db.refresh(db_customer_type)
            return db_customer_type
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=400, 
                detail="Customer type update failed due to duplicate constraint"
            )
    
    def set_default_customer_type(self, db: Session, customer_type_id: int):
        """Set a customer type as default (business rule: only one can be default)"""
        db_customer_type = self.get_by_id(db, customer_type_id)
        if not db_customer_type:
            return None
        
        # Unset all other defaults
        db.query(CustomerType).filter(CustomerType.id != customer_type_id).update(
            {CustomerType.is_default: False}
        )
        
        # Set this one as default
        db_customer_type.is_default = True
        db.commit()
        db.refresh(db_customer_type)
        return db_customer_type
    
    def delete_customer_type(self, db: Session, customer_type_id: int):
        """Soft delete customer type by setting is_active to False"""
        db_customer_type = self.get_by_id(db, customer_type_id)
        if db_customer_type:
            # Don't allow deleting the default type
            if db_customer_type.is_default:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot delete the default customer type. Set another type as default first."
                )
            
            db_customer_type.is_active = False
            db.commit()
            db.refresh(db_customer_type)
        return db_customer_type
