from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyGalleryImage(Base):
    __tablename__ = "company_gallery_images"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    image_title = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    category = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    customer = relationship("User", backref="company_gallery_images")
