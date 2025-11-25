from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyBlogPost(Base):
    __tablename__ = "company_blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    slug = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=True) # LONGTEXT in MySQL, Text in generic SQLAlchemy

    author = Column(String, nullable=True)
    tags = Column(JSON, nullable=True)

    thumbnail_url = Column(String, nullable=True)

    published_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="draft") # draft/published

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("User", backref="company_blog_posts")
