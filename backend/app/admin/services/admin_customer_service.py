from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.models.user_model import User
from app.company.models.company_info_model import CompanyInfo
from app.subscriptions.models import CustomerSubscription
from app.admin.schemas.admin_customer_schema import CustomerUpdate

class AdminCustomerService:
    def get_customers(self, db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[User]:
        query = db.query(User).filter(User.is_superuser == False)
        
        if search:
            search_filter = or_(
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%"),
                User.phone_number.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
            
        return query.offset(skip).limit(limit).all()

    def get_customer(self, db: Session, customer_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == customer_id, User.is_superuser == False).first()

    def update_customer(self, db: Session, customer_id: int, customer_in: CustomerUpdate) -> Optional[User]:
        customer = self.get_customer(db, customer_id)
        if not customer:
            return None
            
        update_data = customer_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(customer, field, value)
            
        db.add(customer)
        db.commit()
        db.refresh(customer)
        return customer

    def get_customer_detail(self, db: Session, customer_id: int):
        customer = self.get_customer(db, customer_id)
        if not customer:
            return None
            
        # Fetch company info
        company = db.query(CompanyInfo).filter(CompanyInfo.tenant_id == customer.tenant_id).first()
        
        # Fetch active subscription
        subscription = db.query(CustomerSubscription).filter(
            CustomerSubscription.tenant_id == customer.tenant_id,
            CustomerSubscription.is_active == True
        ).first()
        
        # Attach to customer object (or return a dict/object that matches schema)
        # Since User model doesn't have these fields, we might need to construct the response manually
        # or rely on relationships if they exist. For now, let's assume we construct it.
        
        return customer, company, subscription
