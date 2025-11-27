from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.user_model import User

class CustomerUser(User):
    """
    Customer user with ONLY identity fields.
    Business data (address, company_name, etc.) moved to CompanyInfo.
    
    Rule: Keep this table minimal - only authentication and identity.
    """
    __tablename__ = "customer_users"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # Customer classification (for categorization, NOT access control)
    customer_type_id = Column(Integer, ForeignKey("customer_types.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    customer_type = relationship("CustomerType", back_populates="customers")
    subscription = relationship("CustomerSubscription", back_populates="customer", uselist=False)
    company_info = relationship("CompanyInfo", back_populates="customer", uselist=False)
    
    __mapper_args__ = {
        "polymorphic_identity": "customer",
    }
