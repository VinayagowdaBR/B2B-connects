from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyCareer(Base):
    __tablename__ = "company_careers"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    job_title = Column(String, nullable=False)
    department = Column(String, nullable=True)

    job_type = Column(String, nullable=True) # full-time/part-time/remote

    location = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    responsibilities = Column(JSON, nullable=True)
    requirements = Column(JSON, nullable=True)

    salary_range = Column(String, nullable=True)
    posted_date = Column(Date, nullable=True)
    closing_date = Column(Date, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("User", backref="company_careers")
