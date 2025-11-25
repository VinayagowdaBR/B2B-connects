from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyTestimonial(Base):
    __tablename__ = "company_testimonials"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    client_name = Column(String, nullable=False)
    client_designation = Column(String, nullable=True)
    company = Column(String, nullable=True)

    message = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True) # 1-5

    client_photo_url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    customer = relationship("User", backref="company_testimonials")
