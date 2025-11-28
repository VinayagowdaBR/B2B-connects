from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyProduct(Base):
    """Products offered by a company/tenant with tenant isolation"""
    __tablename__ = "company_products"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)

    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, index=True)
    price = Column(Float, nullable=True)
    sku = Column(String(100), nullable=True)

    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)

    category = Column(String(100), nullable=True)
    features = Column(JSON, nullable=True)
    specifications = Column(JSON, nullable=True)

    main_image_url = Column(String(500), nullable=True)
    gallery_images = Column(JSON, nullable=True)

    stock_status = Column(String(20), default="in_stock") # in_stock/out_of_stock
    publish_to_portfolio = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_products")

