from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database.connection import get_db
from app.auth.dependencies import has_role
from app.models.user_model import User
from app.subscriptions.models import SubscriptionPlan
from app.subscriptions.schemas import (
    SubscriptionPlanResponse,
    CustomerSubscriptionResponse,
    PaymentInitiateRequest,
    PaymentInitiateResponse,
    PaymentHistoryResponse
)
from app.subscriptions.service import SubscriptionService
from app.payments.models import PaymentHistory

router = APIRouter(
    prefix="/customer/subscription",
    tags=["Customer - Subscription"]
)

@router.get("/", response_model=CustomerSubscriptionResponse)
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    """
    Get current customer's subscription details.
    Shows plan info, status, and days remaining.
    """
    service = SubscriptionService(db)
    subscription = service.get_customer_subscription(current_user.id)
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found. Please contact support."
        )
    
    # Calculate days remaining
    if subscription.status in ["ACTIVE", "TRIAL"]:
        days_left = (subscription.end_date - datetime.utcnow()).days
        subscription.days_remaining = max(0, days_left)
    else:
        subscription.days_remaining = 0
    
    return subscription

@router.get("/plans", response_model=List[SubscriptionPlanResponse])
def get_available_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    """
    View all available subscription plans for upgrade.
    Only shows active plans.
    """
    plans = db.query(SubscriptionPlan).filter(
        SubscriptionPlan.is_active == True
    ).all()
    
    return plans

@router.post("/upgrade", response_model=PaymentInitiateResponse)
def initiate_plan_upgrade(
    request: PaymentInitiateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    """
    Initiate payment for plan upgrade/renewal.
    Returns payment URL for Razorpay or Stripe.
    """
    service = SubscriptionService(db)
    
    # Verify plan exists and is active
    plan = service.get_plan_by_id(request.plan_id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription plan not found"
        )
    
    # Create payment order based on gateway
    if request.payment_gateway == "razorpay":
        from app.payments.razorpay_service import RazorpayService
        payment_service = RazorpayService()
        
        order = payment_service.create_order(
            amount=plan.price,
            currency=plan.currency,
            customer_id=current_user.id,
            plan_id=plan.id
        )
        
        return PaymentInitiateResponse(
            payment_url=order["payment_url"],
            order_id=order["order_id"],
            amount=plan.price,
            currency=plan.currency,
            gateway="razorpay"
        )
    
    elif request.payment_gateway == "stripe":
        from app.payments.stripe_service import StripeService
        payment_service = StripeService()
        
        session = payment_service.create_checkout_session(
            amount=plan.price,
            currency=plan.currency,
            customer_id=current_user.id,
            plan_id=plan.id
        )
        
        return PaymentInitiateResponse(
            payment_url=session["url"],
            order_id=session["session_id"],
            amount=plan.price,
            currency=plan.currency,
            gateway="stripe"
        )
    
    elif request.payment_gateway == "phonepe":
        from app.payments.phonepe_service import PhonePeService
        payment_service = PhonePeService()
        
        payment = payment_service.create_payment(
            amount=plan.price,
            customer_id=current_user.id,
            plan_id=plan.id
        )
        
        return PaymentInitiateResponse(
            payment_url=payment["payment_url"],
            order_id=payment["transaction_id"],
            amount=plan.price,
            currency=plan.currency,
            gateway="phonepe"
        )
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment gateway. Use 'razorpay', 'stripe', or 'phonepe'"
        )

@router.get("/payment-history", response_model=List[PaymentHistoryResponse])
def get_my_payment_history(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    """
    Get payment history for current customer.
    Shows all payments made for subscriptions.
    """
    from app.subscriptions.models import CustomerSubscription
    
    # Get customer's subscriptions
    subscription_ids = db.query(CustomerSubscription.id).filter(
        CustomerSubscription.tenant_id == current_user.id
    ).all()
    
    subscription_ids = [s[0] for s in subscription_ids]
    
    # Get payment history
    payments = db.query(PaymentHistory).filter(
        PaymentHistory.subscription_id.in_(subscription_ids)
    ).order_by(PaymentHistory.created_at.desc()).offset(skip).limit(limit).all()
    
    return payments

@router.get("/check-access/{module_name}")
def check_module_access(
    module_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    """
    Check if customer has access to a specific module.
    Example: /customer/subscription/check-access/blog
    """
    service = SubscriptionService(db)
    
    # Check if subscription is active
    if not service.check_subscription_active(current_user.id):
        return {
            "has_access": False,
            "reason": "Subscription expired"
        }
    
    # Check module access
    has_access = service.has_module_access(current_user.id, module_name)
    
    return {
        "has_access": has_access,
        "module": module_name,
        "reason": "Plan does not include this module" if not has_access else None
    }
