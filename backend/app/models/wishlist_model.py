from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Can reference either a product or a service (or both, technically, but logic should handle it)
    product_id = Column(Integer, ForeignKey("company_products.id"), nullable=True)
    # Service model might be needed too if we want to wishlist services
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="wishlist_items")
    product = relationship("CompanyProduct")
