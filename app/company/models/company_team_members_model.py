from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyTeamMember(Base):
    __tablename__ = "company_team_members"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String, nullable=False)
    designation = Column(String, nullable=True)
    bio = Column(Text, nullable=True)

    photo_url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    customer = relationship("User", backref="company_team_members")
