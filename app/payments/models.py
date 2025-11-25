from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base

class PaymentHistory(Base):
    """
    Records all payment transactions for subscriptions.
    """
    __tablename__ = "payment_history"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Link to subscription
    subscription_id = Column(Integer, ForeignKey("customer_subscriptions.id"), nullable=False)
    
    # Payment details
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    
    # Payment gateway: razorpay, stripe, manual
    payment_gateway = Column(String(20), nullable=False)
    
    # Transaction ID from payment gateway
    transaction_id = Column(String(255), unique=True, nullable=True, index=True)
    
    # Payment status: PENDING, SUCCESS, FAILED, REFUNDED
    payment_status = Column(String(20), default="PENDING", index=True)
    
    # Payment date
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional metadata (gateway response, order details, etc.)
    # Renamed from 'metadata' to avoid SQLAlchemy reserved keyword
    payment_metadata = Column(JSON, nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    subscription = relationship("CustomerSubscription", back_populates="payments")
