from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyProduct(Base):
    __tablename__ = "company_products"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    slug = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=True)
    sku = Column(String, nullable=True)

    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)

    category = Column(String, nullable=True)
    features = Column(JSON, nullable=True)
    specifications = Column(JSON, nullable=True)

    main_image_url = Column(String, nullable=True)
    gallery_images = Column(JSON, nullable=True)

    stock_status = Column(String, default="in_stock") # in_stock/out_of_stock

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("User", backref="company_products")
