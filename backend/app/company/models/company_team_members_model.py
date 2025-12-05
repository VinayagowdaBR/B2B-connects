from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyTeamMember(Base):
    """Team members with tenant isolation"""
    __tablename__ = "company_team_members"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)

    name = Column(String(255), nullable=False)
    position = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)

    # Contact info
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)

    # Social URLs
    photo_url = Column(String(500), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    twitter_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)

    # Skills (stored as array)
    skills = Column(ARRAY(String), nullable=True)

    display_order = Column(Integer, default=0)
    publish_to_portfolio = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_team_members")
