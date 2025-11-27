from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.tenants.context import TenantContext
from app.database.connection import SessionLocal
from app.subscriptions.service import SubscriptionService

class SubscriptionCheckMiddleware(BaseHTTPMiddleware):
    """
    Checks if customer has active subscription before accessing company modules.
    Admin bypasses this check.
    
    Blocks access to /customer/company/* routes if subscription is expired.
    """
    
    async def dispatch(self, request: Request, call_next):
        # Only check for customer company module routes
        if request.url.path.startswith("/customer/company/"):
            # Admin bypasses subscription check
            if not TenantContext.is_admin():
                tenant_id = TenantContext.get_tenant_id()
                
                if tenant_id:
                    db = SessionLocal()
                    try:
                        service = SubscriptionService(db)
                        
                        if not service.check_subscription_active(tenant_id):
                            subscription = service.get_customer_subscription(tenant_id)
                            
                            error_detail = {
                                "message": "Your subscription has expired. Please renew to continue using company modules.",
                                "subscription_status": subscription.status if subscription else "NONE",
                                "expired_on": subscription.end_date.isoformat() if subscription else None
                            }
                            
                            raise HTTPException(
                                status_code=status.HTTP_403_FORBIDDEN,
                                detail=error_detail
                            )
                    finally:
                        db.close()
        
        response = await call_next(request)
        return response
