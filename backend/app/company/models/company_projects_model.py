from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyProject(Base):
    """Projects by company/tenant with tenant isolation"""
    __tablename__ = "company_projects"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)

    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, index=True)

    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)

    client_name = Column(String(255), nullable=True)
    project_url = Column(String(500), nullable=True)

    category = Column(String(100), nullable=True)
    technologies = Column(JSON, nullable=True)

    featured_image_url = Column(String(500), nullable=True)
    gallery_images = Column(JSON, nullable=True)

    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)

    status = Column(String(20), default="completed")  # ongoing/completed
    publish_to_portfolio = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_projects")

