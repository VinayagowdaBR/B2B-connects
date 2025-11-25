from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
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
    employment_type = Column(String(50), nullable=True)  # Full-time, Part-time, Contract

    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True)

    salary_range = Column(String(100), nullable=True)
    experience_required = Column(String(100), nullable=True)

    status = Column(String(20), default="active")  # active/closed

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_careers")
