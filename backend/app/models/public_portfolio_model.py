from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base
import enum

class PortfolioItemType(str, enum.Enum):
    SERVICE = "service"
    PRODUCT = "product"
    PROJECT = "project"
    TESTIMONIAL = "testimonial"
    TEAM_MEMBER = "team_member"
    BLOG_POST = "blog_post"

class PublicPortfolio(Base):
    """
    Aggregated public portfolio items for the feed.
    Copies data from company tables for fast read access.
    """
    __tablename__ = "public_portfolio"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("company_info.tenant_id"), nullable=False, index=True)
    
    item_type = Column(String(50), nullable=False, index=True) # service, product, etc.
    item_id = Column(Integer, nullable=False) # ID in the original table
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    company_info = relationship("CompanyInfo", backref="portfolio_items")
    likes = relationship("PublicLike", back_populates="portfolio_item", cascade="all, delete-orphan")

class PublicLike(Base):
    """
    Likes on portfolio items.
    """
    __tablename__ = "public_likes"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_item_id = Column(Integer, ForeignKey("public_portfolio.id"), nullable=False)
    ip_address = Column(String(45), nullable=True) # IPv6 support
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    portfolio_item = relationship("PublicPortfolio", back_populates="likes")
