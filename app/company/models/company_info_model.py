from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyInfo(Base):
    __tablename__ = "company_info"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    company_name = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    about = Column(Text, nullable=True)
    mission = Column(Text, nullable=True)
    vision = Column(Text, nullable=True)
    values = Column(Text, nullable=True)

    founding_year = Column(Integer, nullable=True)

    logo_url = Column(String, nullable=True)
    hero_image_url = Column(String, nullable=True)

    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)

    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)

    website_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    instagram_url = Column(String, nullable=True)
    facebook_url = Column(String, nullable=True)
    youtube_url = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("User", backref="company_info")
