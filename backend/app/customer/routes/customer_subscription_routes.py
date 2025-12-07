from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

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
        days_left = (subscription.end_date - datetime.now(timezone.utc)).days
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


@router.post("/confirm-demo-payment")
def confirm_demo_payment(
    transaction_id: str,
    plan_id: int,
    amount: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(has_role("customer"))
):
    """
    Confirm a demo payment and record it in the database.
    This is for testing purposes only.
    """
    from app.subscriptions.models import CustomerSubscription
    from datetime import timedelta
    
    # Get the plan
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    # Get customer's current subscription
    subscription = db.query(CustomerSubscription).filter(
        CustomerSubscription.tenant_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )
    
    # Update subscription with new plan
    subscription.plan_id = plan_id
    subscription.status = "ACTIVE"
    subscription.start_date = datetime.now(timezone.utc)
    subscription.end_date = datetime.now(timezone.utc) + timedelta(days=plan.duration_days or 30)
    
    # Use raw SQL to insert payment - bypasses ORM field constraints
    from sqlalchemy import text
    payment_date = datetime.now(timezone.utc)
    
    try:
        db.execute(
            text("""
                INSERT INTO payment_history 
                (subscription_id, amount, currency, payment_gateway, transaction_id, 
                 payment_status, payment_date, notes, paid_amount, membership_id, created_at)
                VALUES 
                (:subscription_id, :amount, :currency, :payment_gateway, :transaction_id,
                 :payment_status, :payment_date, :notes, :paid_amount, NULL, :created_at)
            """),
            {
                "subscription_id": subscription.id,
                "amount": amount,
                "currency": "INR",  # Always use INR
                "payment_gateway": "demo",
                "transaction_id": transaction_id,
                "payment_status": "SUCCESS",
                "payment_date": payment_date,
                "notes": "Demo payment for subscription upgrade",
                "paid_amount": amount,  # Set paid_amount same as amount
                "created_at": payment_date  # Add created_at for frontend
            }
        )
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Payment recording failed: {str(e)}"
        )
    
    return {
        "success": True,
        "message": "Demo payment confirmed successfully",
        "transaction_id": transaction_id,
        "plan_name": plan.name,
        "new_end_date": subscription.end_date.isoformat()
    }
