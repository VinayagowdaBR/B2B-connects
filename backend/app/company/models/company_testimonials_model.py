from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyTestimonial(Base):
    """Customer testimonials with tenant isolation"""
    __tablename__ = "company_testimonials"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)

    client_name = Column(String(255), nullable=False)
    client_designation = Column(String(255), nullable=True)
    client_company = Column(String(255), nullable=True)
    client_image_url = Column(String(500), nullable=True)

    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)  # 1-5 stars

    is_featured = Column(Boolean, default=False)
    publish_to_portfolio = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_testimonials")
