from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.user_model import User

class CustomerUser(User):
    """Customer-specific user table with additional fields for large-scale data"""
    __tablename__ = "customer_users"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # Customer Type relationship
    customer_type_id = Column(Integer, ForeignKey("customer_types.id"), nullable=True)
    
    # Customer-specific fields
    full_name = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Business fields
    company_name = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Additional customer data fields
    notes = Column(Text, nullable=True)
    customer_status = Column(String, default="active")  # active, inactive, suspended
    
    # Relationship
    customer_type = relationship("CustomerType", back_populates="customers")
    
    __mapper_args__ = {
        "polymorphic_identity": "customer",
    }
