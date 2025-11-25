from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyProject(Base):
    __tablename__ = "company_projects"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, index=True)

    client_name = Column(String, nullable=True)
    industry = Column(String, nullable=True)

    challenge = Column(Text, nullable=True)
    solution = Column(Text, nullable=True)
    results = Column(Text, nullable=True)

    project_date = Column(Date, nullable=True)

    cover_image_url = Column(String, nullable=True)
    gallery = Column(JSON, nullable=True)

    testimonials_id = Column(Integer, ForeignKey("company_testimonials.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("User", backref="company_projects")
    testimonial = relationship("CompanyTestimonial", backref="projects")
