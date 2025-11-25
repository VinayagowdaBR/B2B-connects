from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class CompanyBlogPost(Base):
    """Blog posts with tenant isolation"""
    __tablename__ = "company_blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    
    # TENANT ISOLATION
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)

    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)

    featured_image_url = Column(String(500), nullable=True)
    author = Column(String(255), nullable=True)
    
    category = Column(String(100), nullable=True)
    tags = Column(String(500), nullable=True)  # Comma-separated

    published_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(20), default="draft")  # draft/published

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    customer = relationship("CustomerUser", backref="company_blog_posts")
