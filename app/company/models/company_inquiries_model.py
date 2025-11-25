from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyInquiry(Base):
    __tablename__ = "company_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)

    subject = Column(String, nullable=True)
    message = Column(Text, nullable=True)

    attachment_url = Column(String, nullable=True)

    status = Column(String, default="new") # new/read/closed

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    customer = relationship("User", backref="company_inquiries")
