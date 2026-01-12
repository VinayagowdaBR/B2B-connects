from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database.connection import get_db
from app.auth.dependencies import has_permission, has_role
from app.models.user_model import User
from app.subscriptions.models import CustomerSubscription, SubscriptionPlan
from app.payments.models import PaymentHistory
from app.company.models.company_info_model import CompanyInfo

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin - Dashboard"]
)

@router.get("/stats")
@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    user: User = Depends(has_role("admin"))
):
    # 1. Total Customers
    total_customers = db.query(func.count(User.id)).filter(User.user_type == "customer").scalar()

    # 2. Active Subscriptions
    active_subscriptions = db.query(func.count(CustomerSubscription.id)).filter(CustomerSubscription.status == "ACTIVE").scalar()

    # 3. Total Revenue
    # Sum successful payments
    total_revenue = db.query(func.sum(PaymentHistory.amount)).filter(PaymentHistory.payment_status == "SUCCESS").scalar() or 0.0

    # 4. Active Companies
    active_companies = db.query(func.count(CompanyInfo.id)).scalar()

    # 5. Subscription Distribution
    plans = db.query(SubscriptionPlan.name, func.count(CustomerSubscription.id))\
        .join(CustomerSubscription, SubscriptionPlan.id == CustomerSubscription.plan_id)\
        .group_by(SubscriptionPlan.name).all()
    
    subscription_distribution = [
        {"name": name, "count": count} for name, count in plans
    ]
    
    # Calculate percentages
    total_subs = sum(item["count"] for item in subscription_distribution)
    for item in subscription_distribution:
        item["percentage"] = round((item["count"] / total_subs) * 100) if total_subs > 0 else 0
        # Assign colors dynamically or fixed based on plan name in frontend
    
    # 6. Recent Customers
    recent_customers_query = db.query(User, CompanyInfo, CustomerSubscription, SubscriptionPlan)\
        .join(CompanyInfo, User.tenant_id == CompanyInfo.tenant_id, isouter=True)\
        .join(CustomerSubscription, User.tenant_id == CustomerSubscription.tenant_id, isouter=True)\
        .join(SubscriptionPlan, CustomerSubscription.plan_id == SubscriptionPlan.id, isouter=True)\
        .filter(User.user_type == "customer")\
        .order_by(desc(User.id))\
        .limit(5)\
        .all()

    recent_customers = []
    for user, company, sub, plan in recent_customers_query:
        recent_customers.append({
            "name": company.company_name if company else user.full_name or "Unknown",
            "email": user.email,
            "plan": plan.name if plan else "None",
            "status": sub.status.capitalize() if sub else "Inactive",
            "joined_at": user.company_info.created_at if hasattr(user, 'company_info') and user.company_info else None # Fallback needed
        })
        
        # If created_at is not safely accessible via relationship (it should be), use fallback
        if not recent_customers[-1]["joined_at"] and company:
             recent_customers[-1]["joined_at"] = company.created_at

    return {
        "total_customers": total_customers,
        "active_subscriptions": active_subscriptions,
        "total_revenue": total_revenue,
        "active_companies": active_companies,
        "subscription_distribution": subscription_distribution,
        "recent_customers": recent_customers
    }
