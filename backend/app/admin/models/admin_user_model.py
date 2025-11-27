from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.models.user_model import User

class AdminUser(User):
    """Admin-specific user table with additional administrative fields"""
    __tablename__ = "admin_users"
    
    id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    
    # Admin-specific fields
    department = Column(String, nullable=True)
    position = Column(String, nullable=True)
    employee_id = Column(String, unique=True, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    __mapper_args__ = {
        "polymorphic_identity": "admin",
    }
