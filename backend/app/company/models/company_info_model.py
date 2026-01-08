from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyInfo(Base):
    """
    Stores ALL business information for a customer/tenant.
    This is where company details belong.
    
    tenant_id = customer_id (one-to-one relationship)
    """
    __tablename__ = "company_info"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION: This is the customer/tenant who owns this company info
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, unique=True, index=True)

    # Business details
    company_name = Column(String(255), nullable=False)
    subdomain = Column(String(100), nullable=True, unique=True, index=True)  # e.g., "monkey-tech" for monkey-tech.b2bconnect.com
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    
    # Company profile fields
    tagline = Column(String(255), nullable=True)
    about = Column(Text, nullable=True)
    mission = Column(Text, nullable=True)
    vision = Column(Text, nullable=True)
    values = Column(Text, nullable=True)
    founding_year = Column(Integer, nullable=True)
    
    # Additional Details
    industry = Column(String(100), nullable=True)
    company_size = Column(String(50), nullable=True)

    # Media
    logo_url = Column(String(500), nullable=True)
    hero_image_url = Column(String(500), nullable=True)

    # Contact
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    whatsapp = Column(String(20), nullable=True)

    # Social media
    website_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    instagram_url = Column(String(500), nullable=True)
    facebook_url = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    customer = relationship("CustomerUser", back_populates="company_info")
