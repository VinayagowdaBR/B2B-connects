from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
from app.subscriptions.models import SubscriptionPlan, CustomerSubscription
from app.payments.models import PaymentHistory
from app.tenants.context import TenantContext

class SubscriptionService:
    """
    Business logic for subscription management.
    Handles plan assignment, expiry checking, and feature limits.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_default_plan(self) -> Optional[SubscriptionPlan]:
        """Get the default subscription plan"""
        return self.db.query(SubscriptionPlan).filter(
            SubscriptionPlan.is_default == True,
            SubscriptionPlan.is_active == True
        ).first()
    
    def get_plan_by_id(self, plan_id: int) -> Optional[SubscriptionPlan]:
        """Get subscription plan by ID"""
        return self.db.query(SubscriptionPlan).filter(
            SubscriptionPlan.id == plan_id,
            SubscriptionPlan.is_active == True
        ).first()
    
    def assign_default_subscription(self, tenant_id: int) -> CustomerSubscription:
        """
        Assign default subscription plan to a new customer.
        Called during registration.
        """
        default_plan = self.get_default_plan()
        if not default_plan:
            raise ValueError("No default subscription plan configured")
        
        # Calculate end date
        start_date = datetime.utcnow()
        duration = default_plan.duration_days + default_plan.trial_days
        end_date = start_date + timedelta(days=duration)
        
        # Create subscription
        subscription = CustomerSubscription(
            tenant_id=tenant_id,
            plan_id=default_plan.id,
            start_date=start_date,
            end_date=end_date,
            status="TRIAL" if default_plan.trial_days > 0 else "ACTIVE",
            auto_renew=False
        )
        
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        
        return subscription
    
    def assign_subscription(self, tenant_id: int, plan_id: int, duration_days: Optional[int] = None) -> CustomerSubscription:
        """
        Assign specific subscription plan to customer (admin function).
        """
        plan = self.get_plan_by_id(plan_id)
        if not plan:
            raise ValueError(f"Subscription plan {plan_id} not found or inactive")
        
        # Use custom duration or plan default
        days = duration_days if duration_days else plan.duration_days
        
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=days)
        
        # Cancel existing active subscriptions
        self.db.query(CustomerSubscription).filter(
            CustomerSubscription.tenant_id == tenant_id,
            CustomerSubscription.status.in_(["ACTIVE", "TRIAL"])
        ).update({"status": "CANCELLED"})
        
        # Create new subscription
        subscription = CustomerSubscription(
            tenant_id=tenant_id,
            plan_id=plan_id,
            start_date=start_date,
            end_date=end_date,
            status="ACTIVE",
            auto_renew=False
        )
        
        self.db.add(subscription)
        self.db.commit()
        self.db.refresh(subscription)
        
        return subscription
    
    def check_subscription_active(self, tenant_id: int) -> bool:
        """
        Check if customer has an active subscription.
        Returns True if active, False if expired/cancelled.
        """
        subscription = self.db.query(CustomerSubscription).filter(
            CustomerSubscription.tenant_id == tenant_id,
            CustomerSubscription.status.in_(["ACTIVE", "TRIAL"])
        ).first()
        
        if not subscription:
            return False
        
        # Check if expired
        if subscription.end_date < datetime.utcnow():
            subscription.status = "EXPIRED"
            self.db.commit()
            return False
        
        return True
    
    def get_customer_subscription(self, tenant_id: int) -> Optional[CustomerSubscription]:
        """Get customer's current subscription"""
        return self.db.query(CustomerSubscription).filter(
            CustomerSubscription.tenant_id == tenant_id
        ).order_by(CustomerSubscription.created_at.desc()).first()
    
    def get_all_subscriptions(self, skip: int = 0, limit: int = 100) -> List[CustomerSubscription]:
        """Get all customer subscriptions (admin only)"""
        return self.db.query(CustomerSubscription).offset(skip).limit(limit).all()
    
    def check_feature_limit(self, tenant_id: int, feature: str, current_count: int) -> bool:
        """
        Check if customer has reached feature limit.
        Example: check_feature_limit(tenant_id, "max_services", 15)
        Returns True if within limit, False if exceeded.
        """
        subscription = self.get_customer_subscription(tenant_id)
        if not subscription or not subscription.plan.features:
            return True  # No limit
        
        limit = subscription.plan.features.get(feature)
        if limit is None:
            return True  # No limit for this feature
        
        return current_count < limit
    
    def has_module_access(self, tenant_id: int, module_name: str) -> bool:
        """
        Check if customer's plan includes a specific module.
        Example: has_module_access(tenant_id, "blog")
        """
        subscription = self.get_customer_subscription(tenant_id)
        if not subscription or not subscription.plan.features:
            return False
        
        allowed_modules = subscription.plan.features.get("modules", [])
        return module_name in allowed_modules
    
    def renew_subscription(self, subscription_id: int) -> CustomerSubscription:
        """Renew subscription (extend end_date)"""
        subscription = self.db.query(CustomerSubscription).filter(
            CustomerSubscription.id == subscription_id
        ).first()
        
        if not subscription:
            raise ValueError("Subscription not found")
        
        # Extend from current end_date or now (whichever is later)
        start_from = max(subscription.end_date, datetime.utcnow())
        subscription.end_date = start_from + timedelta(days=subscription.plan.duration_days)
        subscription.status = "ACTIVE"
        
        self.db.commit()
        self.db.refresh(subscription)
        
        return subscription
    
    def cancel_subscription(self, subscription_id: int) -> CustomerSubscription:
        """Cancel subscription"""
        subscription = self.db.query(CustomerSubscription).filter(
            CustomerSubscription.id == subscription_id
        ).first()
        
        if not subscription:
            raise ValueError("Subscription not found")
        
        subscription.status = "CANCELLED"
        subscription.auto_renew = False
        
        self.db.commit()
        self.db.refresh(subscription)
        
        return subscription
