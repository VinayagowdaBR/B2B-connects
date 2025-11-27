from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Text, event
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class SubscriptionPlan(Base):
    """
    Subscription plans define what features customers can access.
    Example: Basic Plan, Pro Plan, Enterprise Plan
    """
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Pricing
    price = Column(Float, nullable=False)  # Monthly price
    currency = Column(String(10), default="INR")
    duration_days = Column(Integer, default=30)  # Subscription duration
    
    # Feature limits (JSON structure)
    # Example: {"max_services": 10, "max_products": 50, "modules": ["blog", "gallery"]}
    features = Column(JSON, nullable=True)
    
    # Plan settings
    is_default = Column(Boolean, default=False)  # Auto-assign on registration
    is_active = Column(Boolean, default=True)
    trial_days = Column(Integer, default=0)  # Free trial period
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    subscriptions = relationship("CustomerSubscription", back_populates="plan")


class CustomerSubscription(Base):
    """
    Links customers to their active subscription plan.
    tenant_id == customer_id (each customer is a tenant)
    """
    __tablename__ = "customer_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Tenant isolation: tenant_id is the customer who owns this subscription
    tenant_id = Column(Integer, ForeignKey("customer_users.id"), nullable=False, index=True)
    
    # Subscription details
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    
    # Subscription period
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=False)
    
    # Status: ACTIVE, EXPIRED, CANCELLED, TRIAL
    status = Column(String(20), default="ACTIVE", index=True)
    
    # Auto-renewal
    auto_renew = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    plan = relationship("SubscriptionPlan", back_populates="subscriptions")
    customer = relationship("CustomerUser", back_populates="subscription")
    payments = relationship("PaymentHistory", back_populates="subscription")


# Event listener to ensure only one default plan exists
@event.listens_for(SubscriptionPlan, 'before_insert')
@event.listens_for(SubscriptionPlan, 'before_update')
def ensure_single_default_plan(mapper, connection, target):
    if target.is_default:
        # Set all other plans to is_default=False
        table = SubscriptionPlan.__table__
        connection.execute(
            table.update().where(table.c.id != target.id).values(is_default=False)
        )
