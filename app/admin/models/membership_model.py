from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, event
from sqlalchemy.orm import relationship, Session
from sqlalchemy.sql import func
from app.database.base import Base
from datetime import datetime

class MembershipPlan(Base):
    __tablename__ = "membership_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    fee_amount = Column(Float, nullable=False)
    duration_days = Column(Integer, nullable=False)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    memberships = relationship("CustomerMembership", back_populates="plan")

class CustomerMembership(Base):
    __tablename__ = "customer_memberships"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("membership_plans.id"), nullable=False)
    start_date = Column(DateTime(timezone=True), default=func.now())
    end_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="PENDING")  # PAID, PENDING, EXPIRED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    customer = relationship("User", backref="memberships")
    plan = relationship("MembershipPlan", back_populates="memberships")
    payment_history = relationship("MembershipPaymentHistory", back_populates="membership")

class MembershipPaymentHistory(Base):
    __tablename__ = "membership_payment_history"

    id = Column(Integer, primary_key=True, index=True)
    membership_id = Column(Integer, ForeignKey("customer_memberships.id"), nullable=False)
    paid_amount = Column(Float, nullable=False)
    paid_date = Column(DateTime(timezone=True), default=func.now())
    reference_no = Column(String, nullable=True)
    payment_mode = Column(String, nullable=True) # UPI, Card, Cash
    
    # Relationships
    membership = relationship("CustomerMembership", back_populates="payment_history")

# Event listener to ensure only one default plan exists
@event.listens_for(MembershipPlan, 'before_insert')
@event.listens_for(MembershipPlan, 'before_update')
def ensure_single_default_plan(mapper, connection, target):
    if target.is_default:
        # Set all other plans to is_default=False
        table = MembershipPlan.__table__
        connection.execute(
            table.update().where(table.c.id != target.id).values(is_default=False)
        )
