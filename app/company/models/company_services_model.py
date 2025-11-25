from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyService(Base):
    """
    Services offered by a company/tenant.
    MUST include tenant_id for isolation.
    """
    __tablename__ = "company_services"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION: Every service belongs to one tenant
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)

    # Service details
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, index=True)
    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)

    # Media
    icon_url = Column(String(500), nullable=True)
    banner_image_url = Column(String(500), nullable=True)

    # Categorization
    category = Column(String(100), nullable=True)
    features = Column(JSON, nullable=True)
    
    # Status
    status = Column(String(20), default="active")  # active/inactive

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_services")

