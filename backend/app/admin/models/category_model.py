from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class Category(Base):
    """
    Categories for products and services.
    Admin-managed, used across the platform.
    """
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)  # Lucide icon name (e.g., "Building2", "Cpu")
    color = Column(String(50), default="bg-blue-500")  # Tailwind color class
    image_url = Column(String(500), nullable=True)
    
    is_active = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)  # For custom ordering
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
