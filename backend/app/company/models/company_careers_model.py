from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Date, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyCareer(Base):
    """Job postings with tenant isolation"""
    __tablename__ = "company_careers"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)

    job_title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    job_type = Column(String(50), nullable=True)  # Full-time, Part-time, Contract, Freelance, Internship

    description = Column(Text, nullable=False)
    requirements = Column(ARRAY(String), nullable=True)  # Array of requirement strings
    responsibilities = Column(ARRAY(String), nullable=True)  # Array of responsibility strings

    salary_range = Column(String(100), nullable=True)
    
    # Date fields
    posted_date = Column(Date, nullable=True)
    closing_date = Column(Date, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_careers")
