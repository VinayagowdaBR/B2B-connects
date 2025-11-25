from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyService(Base):
    __tablename__ = "company_services"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, index=True)

    short_description = Column(Text, nullable=True)
    full_description = Column(Text, nullable=True)

    icon_url = Column(String, nullable=True)
    banner_image_url = Column(String, nullable=True)

    category = Column(String, nullable=True)
    features = Column(JSON, nullable=True)
    status = Column(String, default="active") # active/inactive

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("User", backref="company_services")
