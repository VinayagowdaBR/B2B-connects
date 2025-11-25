from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.auth.dependencies import has_role
from app.models.user_model import User
from app.subscriptions.models import SubscriptionPlan, CustomerSubscription
from app.subscriptions.schemas import (
    SubscriptionPlanCreate,
    SubscriptionPlanUpdate,
    SubscriptionPlanResponse,
    CustomerSubscriptionResponse,
    SubscriptionAssignRequest
)
from app.subscriptions.service import SubscriptionService

router = APIRouter(
    prefix="/admin/subscriptions",
    tags=["Admin - Subscription Management"]
)

# ============ Subscription Plans Management ============

@router.get("/plans", response_model=List[SubscriptionPlanResponse])
def get_all_plans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get all subscription plans"""
    plans = db.query(SubscriptionPlan).offset(skip).limit(limit).all()
    return plans

@router.post("/plans", response_model=SubscriptionPlanResponse, status_code=status.HTTP_201_CREATED)
def create_plan(
    plan_in: SubscriptionPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """
    Create new subscription plan.
    If setting as default, automatically unsets other defaults.
    """
    # Check for duplicate name
    existing = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == plan_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Plan with name '{plan_in.name}' already exists"
        )
    
    # If setting as default, unset other defaults
    if plan_in.is_default:
        db.query(SubscriptionPlan).update({"is_default": False})
        db.commit()
    
    plan = SubscriptionPlan(**plan_in.dict())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan

@router.get("/plans/{plan_id}", response_model=SubscriptionPlanResponse)
def get_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get subscription plan by ID"""
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

@router.put("/plans/{plan_id}", response_model=SubscriptionPlanResponse)
def update_plan(
    plan_id: int,
    plan_in: SubscriptionPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Update subscription plan"""
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # Check for duplicate name if updating name
    if plan_in.name and plan_in.name != plan.name:
        existing = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == plan_in.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Plan with name '{plan_in.name}' already exists"
            )
    
    for field, value in plan_in.dict(exclude_unset=True).items():
        setattr(plan, field, value)
    
    db.commit()
    db.refresh(plan)
    return plan

@router.delete("/plans/{plan_id}")
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """
    Deactivate subscription plan (soft delete).
    Cannot delete if it's the default plan.
    """
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if plan.is_default:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the default plan. Set another plan as default first."
        )
    
    plan.is_active = False
    db.commit()
    
    return {"message": f"Plan '{plan.name}' deactivated successfully"}

@router.post("/plans/{plan_id}/set-default")
def set_default_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Set a plan as the default plan for new registrations"""
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if not plan.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot set an inactive plan as default"
        )
    
    # Unset all defaults
    db.query(SubscriptionPlan).update({"is_default": False})
    
    # Set this plan as default
    plan.is_default = True
    db.commit()
    
    return {"message": f"Plan '{plan.name}' set as default"}

# ============ Customer Subscriptions Management ============

@router.get("/customers", response_model=List[CustomerSubscriptionResponse])
def get_all_customer_subscriptions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Get all customer subscriptions (admin view)"""
    service = SubscriptionService(db)
    subscriptions = service.get_all_subscriptions(skip, limit)
    
    # Calculate days remaining for each
    from datetime import datetime
    for sub in subscriptions:
        if sub.status in ["ACTIVE", "TRIAL"]:
            days_left = (sub.end_date - datetime.utcnow()).days
            sub.days_remaining = max(0, days_left)
        else:
            sub.days_remaining = 0
    
    return subscriptions

@router.post("/assign", response_model=CustomerSubscriptionResponse, status_code=status.HTTP_201_CREATED)
def assign_subscription_to_customer(
    request: SubscriptionAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """
    Manually assign subscription to a customer.
    Admin can override plan duration.
    """
    from app.customer.models.customer_user_model import CustomerUser
    
    # Verify customer exists
    customer = db.query(CustomerUser).filter(CustomerUser.id == request.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Assign subscription
    service = SubscriptionService(db)
    try:
        subscription = service.assign_subscription(
            tenant_id=request.customer_id,
            plan_id=request.plan_id,
            duration_days=request.duration_days
        )
        
        # Calculate days remaining
        from datetime import datetime
        days_left = (subscription.end_date - datetime.utcnow()).days
        subscription.days_remaining = max(0, days_left)
        
        return subscription
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/subscriptions/{subscription_id}/cancel")
def cancel_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Cancel a customer subscription"""
    service = SubscriptionService(db)
    try:
        subscription = service.cancel_subscription(subscription_id)
        return {
            "message": "Subscription cancelled successfully",
            "subscription_id": subscription.id,
            "status": subscription.status
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/subscriptions/{subscription_id}/renew", response_model=CustomerSubscriptionResponse)
def renew_subscription(
    subscription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("admin"))
):
    """Renew a customer subscription"""
    service = SubscriptionService(db)
    try:
        subscription = service.renew_subscription(subscription_id)
        
        # Calculate days remaining
        from datetime import datetime
        days_left = (subscription.end_date - datetime.utcnow()).days
        subscription.days_remaining = max(0, days_left)
        
        return subscription
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
